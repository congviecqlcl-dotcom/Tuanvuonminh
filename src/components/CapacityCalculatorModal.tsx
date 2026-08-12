import React, { useState, useEffect } from 'react';
import {
  X, AlertTriangle, CheckCircle2, Scale, ShieldAlert, Sparkles, Copy, Check, BookOpen, Users, UserCheck, ShieldCheck, Activity
} from 'lucide-react';
import {
  PRODUCTION_NORMS, evaluateProductionCapacity, autoDetectCapacityFromText, CapacityCheckResult,
  OperationType, OperationScale, evaluateHumanCapacity, HumanCapacityResult
} from '../data/agriCapacityData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ocrText?: string;
  onApplyResultToChecklist?: (result: CapacityCheckResult) => void;
}

export default function CapacityCalculatorModal({ isOpen, onClose, ocrText, onApplyResultToChecklist }: Props) {
  const [activeTab, setActiveTab] = useState<'BIOLOGICAL' | 'HUMAN'>('BIOLOGICAL');

  // Biological Capacity State
  const [selectedNormId, setSelectedNormId] = useState<string>('RAU_AN_LA');
  const [area, setArea] = useState<number>(360);
  const [contractDaily, setContractDaily] = useState<number>(200);
  const [unit, setUnit] = useState<string>('kg');
  const [varieties, setVarieties] = useState<number>(8);

  // Human Capacity State
  const [opType, setOpType] = useState<OperationType>('CHE_BIEN');
  const [opScale, setOpScale] = useState<OperationScale>('VUA');
  const [workers, setWorkers] = useState<number>(3);
  const [dailyVolume, setDailyVolume] = useState<number>(350);
  const [hasOfficer, setHasOfficer] = useState<boolean>(false);
  const [healthRatio, setHealthRatio] = useState<number>(100);
  const [attpRatio, setAttpRatio] = useState<number>(100);

  const [copied, setCopied] = useState<boolean>(false);

  // Auto detect when modal opens or ocrText changes
  useEffect(() => {
    if (ocrText && isOpen) {
      const detected = autoDetectCapacityFromText(ocrText);
      if (detected.area) setArea(detected.area);
      if (detected.dailyKg) {
        setContractDaily(detected.dailyKg);
        setDailyVolume(detected.dailyKg);
      }
      if (detected.varieties) setVarieties(detected.varieties);
    }
  }, [ocrText, isOpen]);

  if (!isOpen) return null;

  const bioResult = evaluateProductionCapacity(selectedNormId, area, contractDaily, unit, varieties);
  const humanResult = evaluateHumanCapacity({
    operationType: opType,
    scale: opScale,
    totalWorkers: workers,
    hasTechnicalOfficer: hasOfficer,
    healthCheckRatio: healthRatio,
    attpTrainedRatio: attpRatio,
    dailyCapacityVolume: dailyVolume,
    unitLabel: opType === 'CHE_BIEN' ? 'suất/ngày' : 'kg/ngày'
  });

  const handleCopyBioReport = () => {
    const text = `=== BÁO CÁO ĐÁNH GIÁ NĂNG LỰC SẢN XUẤT SO VỚI SẢN LƯỢNG HỢP ĐỒNG ===
Cơ sở sản xuất: ${bioResult.normUsed.categoryName}
- Diện tích khai báo: ${bioResult.areaSquareMeters.toLocaleString('vi-VN')} m²
- Cam kết cung cấp hợp đồng: ${bioResult.contractDailyVolume.toLocaleString('vi-VN')} ${bioResult.contractUnit}/ngày (${bioResult.statedVarietyCount} chủng loại)
- Công suất sinh học tối đa: ~${bioResult.maxFeasibleDailyVolume.toLocaleString('vi-VN')} ${bioResult.contractUnit}/ngày (~${bioResult.maxFeasibleAnnualVolume} tấn/năm)
- Tỷ lệ chênh lệch: Vượt GẤP ${bioResult.discrepancyRatio} LẦN công suất sinh học!
- Đánh giá nghiệp vụ: ${bioResult.statusLabel}
- Nhận định chuyên môn: ${bioResult.agronomicVerdict}
- Đề xuất xử lý: ${bioResult.suggestedAction}
(Trích xuất theo Định mức KT-KT Nông nghiệp Bộ NN&PTNT và Quy chuẩn ATTP)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHumanReport = () => {
    const text = `=== BÁO CÁO ĐÁNH GIÁ NĂNG LỰC CON NGƯỜI (NHÂN SỰ & LAO ĐỘNG) ===
Loại hình: ${humanResult.operationTypeLabel} | Quy mô: ${humanResult.scaleLabel}
- Số lượng nhân sự: ${humanResult.totalWorkers} người (Tối thiểu quy định: ${humanResult.requiredMinWorkers} người)
- Định mức công việc thực tế: ${humanResult.actualVolumePerWorker.toLocaleString('vi-VN')} /lao động/ngày (Định mức an toàn: ≤ ${humanResult.maxRecommendedDailyVolumePerWorker})
- Cán bộ kỹ thuật / QC chuyên trách: ${hasOfficer ? 'Có' : 'Không có'}
- Tỷ lệ Khám sức khỏe: ${healthRatio}% | Tỷ lệ Tập huấn ATTP: ${attpRatio}%
- Kết luận năng lực: ${humanResult.statusLabel}
- Đề xuất xử lý: ${humanResult.actionPlan}
(Căn cứ Điều 9,10,11 Luật ATTP 2010 & Thông tư 38/2018/TT-BNNPTNT)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToForm = () => {
    if (onApplyResultToChecklist) {
      onApplyResultToChecklist(bioResult);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-3.5 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Scale size={22} className="text-amber-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight">Công cụ Kiểm tra Năng lực Sản xuất & Năng lực Con người</h2>
              <p className="text-xs text-slate-400">Định mức Kỹ thuật Nông nghiệp & Tiêu chuẩn Điều kiện Nhân sự ATTP</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-6 pt-2 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('BIOLOGICAL')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'BIOLOGICAL'
                ? 'bg-white text-blue-700 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Activity size={15} />
            1. Năng lực Sinh học & Diện tích đất/chuồng
          </button>
          <button
            onClick={() => setActiveTab('HUMAN')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'HUMAN'
                ? 'bg-white text-blue-700 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Users size={15} />
            2. Năng lực Con người (Nhân sự theo Loại hình & Quy mô)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {activeTab === 'BIOLOGICAL' ? (
            <>
              {/* Preset Buttons for standard test cases */}
              <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                <p className="font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" /> Thử nghiệm nhanh tình huống thực tế (Bấm để tải ví dụ):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedNormId('RAU_AN_LA');
                      setArea(360);
                      setContractDaily(200);
                      setVarieties(8);
                      setUnit('kg');
                    }}
                    className="rounded border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-800 hover:bg-blue-100 shadow-2xs"
                  >
                    🌱 360m² rau trồng - Giao 200kg/ngày (Dấu hiệu gom hàng)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNormId('GA_DE_TRUNG');
                      setArea(100);
                      setContractDaily(1000);
                      setVarieties(1);
                      setUnit('quả');
                    }}
                    className="rounded border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-800 hover:bg-blue-100 shadow-2xs"
                  >
                    🥚 100m² gà đẻ - Giao 1.000 trứng/ngày (Vượt 3 lần)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNormId('RAU_AN_LA');
                      setArea(2000);
                      setContractDaily(50);
                      setVarieties(2);
                      setUnit('kg');
                    }}
                    className="rounded border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 shadow-2xs"
                  >
                    ✅ 2.000m² rau - Giao 50kg/ngày (Bình thường)
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Loại hình canh tác / chăn nuôi / nuôi trồng:</label>
                  <select
                    value={selectedNormId}
                    onChange={(e) => {
                      const normId = e.target.value;
                      setSelectedNormId(normId);
                      if (normId === 'GA_DE_TRUNG') setUnit('quả');
                      else setUnit('kg');
                    }}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    {PRODUCTION_NORMS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Diện tích mặt bằng thực tế ({bioResult.normUsed.unitArea}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={area}
                    onChange={(e) => setArea(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Sản lượng cam kết hợp đồng ({unit}/ngày):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={contractDaily}
                    onChange={(e) => setContractDaily(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Số chủng loại sản phẩm khai báo:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={varieties}
                    onChange={(e) => setVarieties(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Result Card Banner */}
              <div
                className={`rounded-xl border p-5 shadow-xs transition-all ${
                  bioResult.status === 'CRITICAL_ANOMALY'
                    ? 'border-red-300 bg-red-50/90 text-red-950'
                    : bioResult.status === 'WARNING'
                    ? 'border-amber-300 bg-amber-50/90 text-amber-950'
                    : 'border-emerald-300 bg-emerald-50/90 text-emerald-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {bioResult.status === 'CRITICAL_ANOMALY' ? (
                    <ShieldAlert size={26} className="text-red-600 shrink-0 mt-0.5" />
                  ) : bioResult.status === 'WARNING' ? (
                    <AlertTriangle size={26} className="text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={26} className="text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-white/90 border border-current px-2.5 py-0.5 font-bold uppercase tracking-wide text-[11px]">
                      {bioResult.statusLabel}
                    </span>
                    <h3 className="text-sm font-bold leading-snug">{bioResult.summaryTitle}</h3>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-black/10 pt-3 text-center font-mono">
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Khả thi tối đa / ngày</span>
                    <span className="text-sm font-bold text-slate-900">
                      {bioResult.maxFeasibleDailyVolume.toLocaleString('vi-VN')} {bioResult.contractUnit}
                    </span>
                  </div>
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Cam kết hợp đồng / ngày</span>
                    <span className="text-sm font-bold text-blue-700">
                      {bioResult.contractDailyVolume.toLocaleString('vi-VN')} {bioResult.contractUnit}
                    </span>
                  </div>
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Tỷ lệ chênh lệch</span>
                    <span
                      className={`text-sm font-extrabold ${
                        bioResult.discrepancyRatio > 3
                          ? 'text-red-600'
                          : bioResult.discrepancyRatio > 1
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {bioResult.discrepancyRatio > 1 ? `Vượt GẤP ${bioResult.discrepancyRatio} LẦN` : 'Đạt 100%'}
                    </span>
                  </div>
                </div>

                {/* Analysis Detail Bullet Points */}
                <div className="mt-4 space-y-1.5 border-t border-black/10 pt-3">
                  <p className="font-bold text-slate-900">Phân tích chi tiết quy chuẩn sinh học:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    {bioResult.detailedAnalysis.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>

                {/* Agronomic Verdict & Action Advice */}
                <div className="mt-3 rounded-lg bg-white/80 border border-black/10 p-3 space-y-2">
                  <div>
                    <span className="font-bold text-slate-900">🔍 Căn cứ nhận định chuyên môn:</span>
                    <p className="mt-0.5 text-slate-700 leading-relaxed">{bioResult.agronomicVerdict}</p>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <span className="font-bold text-blue-900">⚖ Kế hoạch xử lý chuyên môn của Công chức:</span>
                    <p className="mt-0.5 text-blue-950 font-medium leading-relaxed">{bioResult.suggestedAction}</p>
                  </div>
                </div>
              </div>

              {/* Reference Legal/Technical Norm Box */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <BookOpen size={13} className="text-slate-500" /> Căn cứ định mức sinh học ({bioResult.normUsed.legalNormReference}):
                </p>
                <p>{bioResult.normUsed.description}</p>
              </div>
            </>
          ) : (
            <>
              {/* HUMAN CAPACITY TAB */}
              <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3.5">
                <p className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                  <Users size={15} className="text-blue-600" /> Nguyên tắc Đánh giá Năng lực Con người (Theo Luật ATTP 2010):
                </p>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Năng lực con người phụ thuộc trực tiếp vào <strong>Loại hình hoạt động</strong> (Sản xuất, Sơ chế, Chế biến/Bếp ăn, Kinh doanh) và <strong>Quy mô vận hành</strong> (Nhỏ lẻ, Vừa, Lớn) để xác định định mức số người tối thiểu, cán bộ kỹ thuật/QC và 100% người trực tiếp phải có Giấy khám sức khỏe & Giấy tập huấn ATTP.
                </p>
              </div>

              {/* Preset Buttons for Human Capacity */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setOpType('CHE_BIEN');
                    setOpScale('VUA');
                    setWorkers(3);
                    setDailyVolume(350);
                    setHasOfficer(false);
                    setHealthRatio(100);
                    setAttpRatio(100);
                  }}
                  className="rounded border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-800 hover:bg-red-50 shadow-2xs"
                >
                  🔴 Bếp ăn 350 suất - Chỉ có 3 nhân sự (Quá tải 116 suất/người)
                </button>
                <button
                  onClick={() => {
                    setOpType('SO_CHE');
                    setOpScale('LON');
                    setWorkers(10);
                    setDailyVolume(2000);
                    setHasOfficer(true);
                    setHealthRatio(70);
                    setAttpRatio(100);
                  }}
                  className="rounded border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-800 hover:bg-red-50 shadow-2xs"
                >
                  🔴 Xưởng sơ chế lớn - Khám sức khỏe chỉ đạt 70% (Vi phạm luật)
                </button>
                <button
                  onClick={() => {
                    setOpType('SAN_XUAT');
                    setOpScale('NHO_LE');
                    setWorkers(2);
                    setDailyVolume(150);
                    setHasOfficer(false);
                    setHealthRatio(100);
                    setAttpRatio(100);
                  }}
                  className="rounded border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-50 shadow-2xs"
                >
                  ✅ Trồng trọt nhỏ lẻ - 2 lao động / 150kg (Đạt chuẩn)
                </button>
              </div>

              {/* Human Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Loại hình hoạt động:</label>
                  <select
                    value={opType}
                    onChange={(e) => setOpType(e.target.value as OperationType)}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="SAN_XUAT">🌱 Sản xuất (Trồng trọt, Chăn nuôi, Thủy sản)</option>
                    <option value="SO_CHE">🧺 Sơ chế, Phân loại & Đóng gói</option>
                    <option value="CHE_BIEN">🍲 Chế biến thực phẩm / Bếp ăn tập thể / Suất ăn</option>
                    <option value="KINH_DOANH">🏪 Kinh doanh, Siêu thị & Phân phối</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Quy mô cơ sở:</label>
                  <select
                    value={opScale}
                    onChange={(e) => setOpScale(e.target.value as OperationScale)}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="NHO_LE">Quy mô Nhỏ lẻ / Hộ gia đình</option>
                    <option value="VUA">Quy mô Vừa (Cơ sở trung tâm / HTX vừa)</option>
                    <option value="LON">Quy mô Lớn / Công nghiệp / Chuỗi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Tổng số lao động trực tiếp (người):</label>
                  <input
                    type="number"
                    min="1"
                    value={workers}
                    onChange={(e) => setWorkers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Công suất / Khối lượng xử lý hàng ngày ({opType === 'CHE_BIEN' ? 'suất/ngày' : 'kg/ngày'}):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={dailyVolume}
                    onChange={(e) => setDailyVolume(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Tỷ lệ có Giấy Khám sức khỏe định kỳ còn hiệu lực:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={healthRatio}
                      onChange={(e) => setHealthRatio(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`w-12 text-right font-bold ${healthRatio < 100 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {healthRatio}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Tỷ lệ đã qua Tập huấn & Giấy xác nhận ATTP:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={attpRatio}
                      onChange={(e) => setAttpRatio(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`w-12 text-right font-bold ${attpRatio < 100 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {attpRatio}%
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chkOfficer"
                    checked={hasOfficer}
                    onChange={(e) => setHasOfficer(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="chkOfficer" className="font-semibold text-slate-800 cursor-pointer">
                    Có Cán bộ Kỹ thuật / Quản lý QC / Thú y / Bếp trưởng có bằng cấp chuyên môn ATTP phụ trách
                  </label>
                </div>
              </div>

              {/* Human Capacity Result Banner */}
              <div
                className={`rounded-xl border p-5 shadow-xs transition-all ${
                  humanResult.status === 'CRITICAL_DEFICIT'
                    ? 'border-red-300 bg-red-50/90 text-red-950'
                    : humanResult.status === 'WARNING'
                    ? 'border-amber-300 bg-amber-50/90 text-amber-950'
                    : 'border-emerald-300 bg-emerald-50/90 text-emerald-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {humanResult.status === 'CRITICAL_DEFICIT' ? (
                    <ShieldAlert size={26} className="text-red-600 shrink-0 mt-0.5" />
                  ) : humanResult.status === 'WARNING' ? (
                    <AlertTriangle size={26} className="text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <UserCheck size={26} className="text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-white/90 border border-current px-2.5 py-0.5 font-bold uppercase tracking-wide text-[11px]">
                      {humanResult.statusLabel}
                    </span>
                    <h3 className="text-sm font-bold leading-snug">{humanResult.summaryTitle}</h3>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-black/10 pt-3 text-center font-mono">
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Số lao động khai báo</span>
                    <span className="text-sm font-bold text-slate-900">
                      {humanResult.totalWorkers} người (Tối thiểu: {humanResult.requiredMinWorkers})
                    </span>
                  </div>
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Áp lực công việc thực tế</span>
                    <span className="text-sm font-bold text-blue-700">
                      {humanResult.actualVolumePerWorker.toLocaleString('vi-VN')} {opType === 'CHE_BIEN' ? 'suất/người' : 'kg/người'}
                    </span>
                  </div>
                  <div className="rounded bg-white/70 p-2">
                    <span className="block text-[11px] font-medium text-slate-500">Định mức lao động tiêu chuẩn</span>
                    <span className="text-sm font-bold text-slate-800">
                      ≤ {humanResult.maxRecommendedDailyVolumePerWorker} {opType === 'CHE_BIEN' ? 'suất/người' : 'kg/người'}
                    </span>
                  </div>
                </div>

                {/* Analysis Breakdown */}
                <div className="mt-4 space-y-1.5 border-t border-black/10 pt-3">
                  <p className="font-bold text-slate-900">Chi tiết đối chiếu điều kiện con người:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    {humanResult.detailedAnalysis.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>

                {/* Legal Action Plan */}
                <div className="mt-3 rounded-lg bg-white/80 border border-black/10 p-3 space-y-2">
                  <div>
                    <span className="font-bold text-blue-900">⚖ Căn cứ pháp lý & Đề xuất giải quyết cho Công chức Thẩm định:</span>
                    <p className="mt-0.5 text-blue-950 font-medium leading-relaxed">{humanResult.actionPlan}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-slate-500" /> Căn cứ pháp lý quy định điều kiện con người:
                </p>
                <p>{humanResult.legalBasis}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 shrink-0">
          <button
            onClick={activeTab === 'BIOLOGICAL' ? handleCopyBioReport : handleCopyHumanReport}
            className="flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? 'Đã sao chép văn bản' : 'Sao chép văn bản trích dẫn'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyToForm}
              className="rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
            >
              Áp dụng kết luận này vào Báo cáo Thẩm định
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

