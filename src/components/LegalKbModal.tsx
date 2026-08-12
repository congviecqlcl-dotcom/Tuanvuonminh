import React, { useState } from 'react';
import { X, Search, BookOpen, ChevronRight, FileText } from 'lucide-react';
import { LEGAL_DOCUMENTS } from '../data/legalKb';

interface LegalKbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalKbModal({ isOpen, onClose }: LegalKbModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>(LEGAL_DOCUMENTS[0].id);

  if (!isOpen) return null;

  const filteredDocs = LEGAL_DOCUMENTS.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(term) ||
      doc.code.toLowerCase().includes(term) ||
      doc.summary.toLowerCase().includes(term) ||
      doc.keyArticles.some((a) => a.article.toLowerCase().includes(term) || a.content.toLowerCase().includes(term))
    );
  });

  const currentDoc = LEGAL_DOCUMENTS.find((d) => d.id === selectedDocId) || LEGAL_DOCUMENTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-800 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen size={20} className="text-blue-400" />
            <div>
              <h2 className="text-base font-semibold">Thư viện Quy định Pháp luật An toàn Thực phẩm</h2>
              <p className="text-xs text-slate-300">Tra cứu nhanh căn cứ pháp lý & quy định quản lý hành chính phục vụ công chức thẩm định</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Left Sidebar: Document List */}
          <div className="border-r border-slate-200 bg-slate-50/70 p-4 flex flex-col gap-3 overflow-y-auto">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên luật, nghị định, điều khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    doc.id === currentDoc.id
                      ? 'border-blue-500 bg-blue-50/80 font-medium text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <p className="font-semibold text-slate-800">{doc.code}</p>
                  <p className="mt-0.5 line-clamp-2 text-slate-600 font-normal">{doc.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{doc.type}</span>
                    <span className="flex items-center gap-0.5">
                      Xem chi tiết <ChevronRight size={11} />
                    </span>
                  </div>
                </button>
              ))}
              {filteredDocs.length === 0 && (
                <p className="p-4 text-center text-xs text-slate-500">Không tìm thấy văn bản phù hợp từ khóa.</p>
              )}
            </div>
          </div>

          {/* Right Main Panel: Detail of selected document */}
          <div className="col-span-2 p-6 overflow-y-auto space-y-5 bg-white">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">{currentDoc.code}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{currentDoc.type}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{currentDoc.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Ban hành: {currentDoc.issuedDate} · Hiệu lực: {currentDoc.effectiveDate}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700">
              <p className="font-semibold text-slate-800 mb-1">Tóm tắt nội dung chính:</p>
              <p className="leading-relaxed">{currentDoc.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> Điều khoản trọng tâm về Thẩm định Hồ sơ ATTP
              </h4>
              <div className="space-y-3">
                {currentDoc.keyArticles.map((art, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300">
                    <p className="text-xs font-bold text-blue-700 mb-1">
                      {art.article}: {art.title}
                    </p>
                    <p className="text-xs text-slate-700 leading-normal">{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
