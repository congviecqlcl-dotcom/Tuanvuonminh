import React, { useState, useRef } from 'react';
import {
  X, Upload, Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowRight,
  FolderOpen, Layers, ShieldCheck, Download, Trash2, RotateCw, Eye, MoveVertical,
  Plus, Scan, Check, HelpCircle, AlertCircle, FileCheck, RefreshCw, FileSearch
} from 'lucide-react';
import { ScannedDocumentItem, SortedDossierGroup, DocCategoryType } from '../types';
import {
  MANDATORY_CATEGORIES, classifyDocumentText, groupAndSortScannedDocuments,
  SAMPLE_BATCH_SCANNED_FILES
} from '../data/batchScanData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportDossierToApp?: (entityName: string, textContent: string) => void;
}

export default function BatchDocSorterModal({ isOpen, onClose, onImportDossierToApp }: Props) {
  const [scannedItems, setScannedItems] = useState<ScannedDocumentItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number; currentFileName: string }>({ current: 0, total: 0, currentFileName: '' });
  const [activeTab, setActiveTab] = useState<'SORTED_GROUPS' | 'ALL_RAW_FILES' | 'CATEGORIES_GUIDE'>('SORTED_GROUPS');
  const [selectedDocPreview, setSelectedDocPreview] = useState<ScannedDocumentItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sortedGroups = groupAndSortScannedDocuments(scannedItems);

  // Helper to trigger AI processing for uploaded or sample files
  const processFilesBatch = async (filesToProcess: { name: string; text?: string; base64?: string; type?: string }[]) => {
    setIsScanning(true);
    setScanProgress({ current: 0, total: filesToProcess.length, currentFileName: 'Đang khởi tạo AI Scan...' });

    const newDocs: ScannedDocumentItem[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const item = filesToProcess[i];
      setScanProgress({
        current: i + 1,
        total: filesToProcess.length,
        currentFileName: item.name,
      });

      let textContent = item.text || '';

      if (!textContent && item.base64) {
        try {
          const res = await fetch('/api/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: item.name,
              base64: item.base64,
              mediaType: item.type || 'image/jpeg',
            }),
          });
          const data = await res.json();
          textContent = data.text || '';
        } catch {
          textContent = `[Tệp scan ${item.name}]\nKhông đọc được toàn bộ chữ, tự động xếp theo nhãn tệp.`;
        }
      }

      const classification = classifyDocumentText(item.name, textContent);

      const docItem: ScannedDocumentItem = {
        id: `scanned-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        fileName: item.name,
        extractedText: textContent,
        category: classification.category,
        categoryLabel: classification.categoryLabel,
        targetEntityName: classification.entityName,
        documentDate: classification.documentDate,
        documentNumber: classification.documentNumber,
        confidenceScore: classification.confidenceScore,
        suggestedSequence: classification.seq,
        status: 'CLASSIFIED',
        qualityWarning: classification.qualityWarning,
      };

      newDocs.push(docItem);
      // Small pause to give realistic processing feedback
      await new Promise((r) => setTimeout(r, 220));
    }

    setScannedItems((prev) => [...prev, ...newDocs]);
    setIsScanning(false);
  };

  const handleLoadSampleBatch = () => {
    const samples = SAMPLE_BATCH_SCANNED_FILES.map((s) => ({
      name: s.fileName,
      text: s.text,
    }));
    processFilesBatch(samples);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);

    const pendingPromises = fileList.map((file) => {
      return new Promise<{ name: string; base64?: string; type: string; text?: string }>((resolve) => {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1] || '';
            resolve({ name: file.name, base64, type: file.type });
          };
          reader.readAsDataURL(file);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ name: file.name, text: reader.result as string, type: 'text/plain' });
          };
          reader.readAsText(file);
        }
      });
    });

    Promise.all(pendingPromises).then((items) => {
      processFilesBatch(items);
    });

    if (e.target) e.target.value = '';
  };

  const handleRemoveDoc = (docId: string) => {
    setScannedItems((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách tệp đã scan?')) {
      setScannedItems([]);
      setSelectedDocPreview(null);
    }
  };

  const handleManualCategoryChange = (docId: string, newCat: DocCategoryType) => {
    const foundCat = MANDATORY_CATEGORIES.find((m) => m.category === newCat);
    if (!foundCat) return;

    setScannedItems((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            category: newCat,
            categoryLabel: foundCat.label,
            suggestedSequence: foundCat.seq,
          };
        }
        return doc;
      })
    );
  };

  const handleExportBatchReport = (group: SortedDossierGroup) => {
    const reportText = `====================================================\n` +
      `BÁO CÁO PHÂN LOẠI & SẮP XẾP HỒ SƠ TỰ ĐỘNG BẰNG AI\n` +
      `Doanh nghiệp / Cơ sở: ${group.entityName}\n` +
      `Thời gian tạo: ${new Date().toLocaleString('vi-VN')}\n` +
      `Mức độ hoàn thiện hồ sơ: ${group.completenessScore}%\n` +
      `====================================================\n\n` +
      `THỨ TỰ BỘ HỒ SƠ THEO QUY ĐỊNH NGHỊ ĐỊNH 15/2018/NĐ-CP:\n` +
      group.documents.map((d, idx) => `${idx + 1}. [Vị trí #${d.suggestedSequence}] ${d.categoryLabel}\n   - Tệp scan gốc: ${d.fileName}\n   - Mã/Số hiệu: ${d.documentNumber || 'N/A'} (Ngày: ${d.documentDate || 'N/A'})\n   - Độ tin cậy AI: ${d.confidenceScore}%`).join('\n\n') +
      `\n\n` +
      (group.missingCategories.length > 0
        ? `🚨 CÁC TÀI LIỆU BẮT BUỘC CÒN THIẾU:\n` + group.missingCategories.map((m) => `- ${m.label}`).join('\n')
        : `✅ HỒ SƠ ĐÃ ĐẦY ĐỦ 100% CÁC THÀNH PHẦN QUY ĐỊNH!`);

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_muc_Ho_so_${group.entityName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-300">
              <Scan size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Hệ thống AI Đọc, Phân loại & Sắp xếp Hồ sơ Hàng loạt
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles size={12} /> Auto OCR & Classifier
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tự động OCR đọc ảnh scan/ảnh chụp, phân loại vào đúng loại văn bản, gom theo từng bộ hồ sơ doanh nghiệp & sắp xếp theo thứ tự pháp lý chuẩn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action & Upload Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,application/pdf,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Upload size={16} />
              <span>Tải ảnh/Scan hàng loạt</span>
            </button>

            <button
              onClick={handleLoadSampleBatch}
              disabled={isScanning}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles size={16} />
              <span>Nạp 8 ảnh scan xáo trộn mẫu (Test AI)</span>
            </button>

            {scannedItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Xóa danh sách ({scannedItems.length})</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('SORTED_GROUPS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'SORTED_GROUPS'
                  ? 'bg-white text-blue-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>Kết quả Bộ Hồ sơ ({sortedGroups.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ALL_RAW_FILES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ALL_RAW_FILES'
                  ? 'bg-white text-blue-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSearch size={14} />
              <span>Tệp đống gốc ({scannedItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('CATEGORIES_GUIDE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'CATEGORIES_GUIDE'
                  ? 'bg-white text-blue-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck size={14} />
              <span>Quy chuẩn 8 thành phần</span>
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col gap-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <span className="flex items-center gap-2">
                  <RefreshCw size={15} className="animate-spin text-blue-600" />
                  AI đang đọc OCR, phân tích thực thể & gom nhóm bộ hồ sơ...
                </span>
                <span>
                  {scanProgress.current} / {scanProgress.total} tệp ({Math.round((scanProgress.current / scanProgress.total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-700 italic">
                Đang xử lý tệp: <span className="font-semibold">{scanProgress.currentFileName}</span>
              </p>
            </div>
          )}

          {/* Empty State */}
          {scannedItems.length === 0 && !isScanning && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Scan size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Chưa có tệp scan hoặc ảnh chụp hồ sơ nào
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
                Bạn hãy chụp ảnh bằng điện thoại hoặc quét scan hàng loạt hồ sơ (ĐKKD, Thuyết minh, Khám sức khỏe, Tập huấn, Hợp đồng...) rồi tải lên đây. AI sẽ tự động đọc nội dung, tách thành từng **Bộ hồ sơ riêng biệt** và **sắp xếp thứ tự chuẩn 100%**.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  <span>Chọn tệp ảnh / scan từ máy tính</span>
                </button>
                <button
                  onClick={handleLoadSampleBatch}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  <span>Bấm để nạp ngay 8 tệp xáo trộn mẫu</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SORTED DOSSIER GROUPS */}
          {activeTab === 'SORTED_GROUPS' && sortedGroups.length > 0 && (
            <div className="space-y-6">
              {sortedGroups.map((group, groupIdx) => (
                <div
                  key={group.id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Group Header */}
                  <div className="bg-gradient-to-r from-slate-100 via-blue-50/40 to-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        Bộ #{groupIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                          <span>{group.entityName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                            {group.documents.length} văn bản
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tự động nhận diện thực thể & khớp nối từ các tệp scan lẻ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Completeness Badge */}
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-xs text-slate-600 font-medium">Độ hoàn thiện:</span>
                        <span
                          className={`text-xs font-bold ${
                            group.completenessScore >= 80
                              ? 'text-emerald-700'
                              : group.completenessScore >= 50
                              ? 'text-amber-700'
                              : 'text-red-700'
                          }`}
                        >
                          {group.completenessScore}%
                        </span>
                      </div>

                      <button
                        onClick={() => handleExportBatchReport(group)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition-colors flex items-center gap-1.5"
                      >
                        <Download size={14} />
                        <span>Xuất danh mục</span>
                      </button>

                      {onImportDossierToApp && (
                        <button
                          onClick={() => {
                            const combinedText = group.documents.map((d) => `=== ${d.categoryLabel} ===\n${d.extractedText || ''}`).join('\n\n');
                            onImportDossierToApp(group.entityName, combinedText);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <ShieldCheck size={14} />
                          <span>Đưa vào Thẩm định ngay</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Missing Mandatory Documents Alert */}
                  {group.missingCategories.length > 0 && (
                    <div className="p-3.5 bg-amber-50/80 border-b border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Cảnh báo thiếu hụt thành phần hồ sơ:</span> Bộ hồ sơ này hiện còn thiếu{' '}
                        <span className="font-bold">{group.missingCategories.length} văn bản bắt buộc</span> sau theo Nghị định 15/2018/NĐ-CP:
                        <ul className="list-disc list-inside mt-1 font-medium space-y-0.5 text-amber-800">
                          {group.missingCategories.map((m) => (
                            <li key={m.category}>{m.label}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Ordered Document Items List */}
                  <div className="divide-y divide-slate-100">
                    {group.documents.map((doc, docIdx) => (
                      <div
                        key={doc.id}
                        className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* Position Badge */}
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            #{doc.suggestedSequence}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900">
                                {doc.categoryLabel}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                                AI khớp {doc.confidenceScore}%
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                              <span>Tệp gốc: <strong className="text-slate-700">{doc.fileName}</strong></span>
                              {doc.documentNumber && <span>• Số hiệu: <strong>{doc.documentNumber}</strong></span>}
                              {doc.documentDate && <span>• Ngày: <strong>{doc.documentDate}</strong></span>}
                            </p>

                            {doc.qualityWarning && (
                              <p className="text-xs text-amber-700 font-medium mt-1">
                                {doc.qualityWarning}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions & Category Override Selector */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <select
                            value={doc.category}
                            onChange={(e) => handleManualCategoryChange(doc.id, e.target.value as DocCategoryType)}
                            className="text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-1.5 font-medium focus:ring-1 focus:ring-blue-500"
                          >
                            {MANDATORY_CATEGORIES.map((cat) => (
                              <option key={cat.category} value={cat.category}>
                                {cat.label}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => setSelectedDocPreview(doc)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem nội dung OCR trích xuất"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa tệp khỏi bộ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: RAW UNORDERED FILES LIST */}
          {activeTab === 'ALL_RAW_FILES' && scannedItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between">
                <span>Danh sách {scannedItems.length} tệp đống gốc đã nạp</span>
                <span className="text-xs font-normal text-slate-500">
                  (AI tự động nhận diện thông tin trong mỗi tệp)
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {scannedItems.map((doc) => (
                  <div key={doc.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{doc.fileName}</p>
                        <p className="text-slate-500 mt-0.5">
                          Đã phân loại ➔ <strong className="text-blue-800">{doc.categoryLabel}</strong> ({doc.targetEntityName})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocPreview(doc)}
                      className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-medium"
                    >
                      Xem trích xuất OCR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REGULATORY CATEGORIES GUIDE */}
          {activeTab === 'CATEGORIES_GUIDE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MANDATORY_CATEGORIES.map((cat) => (
                <div key={cat.category} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
                      Vị trí #{cat.seq}
                    </span>
                    {cat.isMandatory ? (
                      <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        Bắt buộc 100%
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Tùy chọn phụ trợ
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{cat.label}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hệ thống áp dụng thuật toán OCR kết hợp phân tích ngữ nghĩa Gemini 3.6 Flash để tự động nhận diện và phân loại hồ sơ ATTP.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>

      {/* OCR Text Preview Sub-Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" />
                  <span>Trích xuất OCR: {selectedDocPreview.fileName}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Phân loại: <strong className="text-amber-300">{selectedDocPreview.categoryLabel}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-800 bg-slate-50 whitespace-pre-wrap leading-relaxed">
              {selectedDocPreview.extractedText || '(Không có dữ liệu trích xuất)'}
            </div>
            <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
