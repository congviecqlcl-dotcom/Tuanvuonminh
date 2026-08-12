import React from 'react';
import { X, FileCheck2, AlertCircle, CheckCircle2, FileText, ArrowRightLeft } from 'lucide-react';
import { CrossDocComparisonResult } from '../data/riskAssessmentData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: CrossDocComparisonResult | null;
}

export default function CrossDocCompareModal({ isOpen, onClose, result }: Props) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Công cụ Đối chiếu & Kiểm tra Mâu thuẫn Đa Tài liệu (Cross-Doc Audit)
              </h2>
              <p className="text-xs text-slate-300">
                Tự động trích xuất & so sánh đối chiếu dữ liệu giữa Thuyết minh và các Giấy tờ chứng minh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary Status */}
          <div
            className={`rounded-xl border p-4 flex items-center justify-between ${
              result.mismatchCount > 0
                ? 'border-red-300 bg-red-50 text-red-900'
                : 'border-emerald-300 bg-emerald-50 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.mismatchCount > 0 ? (
                <AlertCircle size={24} className="text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-sm">
                  {result.mismatchCount > 0
                    ? `Phát hiện ${result.mismatchCount} mâu thuẫn dữ liệu giữa các tài liệu!`
                    : 'Dữ liệu hành chính đồng nhất giữa các tài liệu'}
                </h3>
                <p className="text-xs mt-0.5 opacity-90">{result.summaryNote}</p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-1/4">Trường Thông tin</th>
                  <th className="p-3 w-1/4">1. Bản Thuyết minh</th>
                  <th className="p-3 w-1/4">2. ĐKKD / Giấy tờ Chứng minh</th>
                  <th className="p-3 w-1/4">Kết luận Đối chiếu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {result.fields.map((f, i) => (
                  <tr key={i} className={f.status === 'MISMATCH' ? 'bg-red-50/80 font-medium' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-bold text-slate-900">{f.fieldName}</td>
                    <td className="p-3 text-slate-800">{f.thuyetMinhValue || '—'}</td>
                    <td className="p-3 text-slate-800">{f.dkkdValue || '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {f.status === 'MATCH' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                            <CheckCircle2 size={12} /> Đồng nhất
                          </span>
                        )}
                        {f.status === 'MISMATCH' && (
                          <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-[10px]">
                            <AlertCircle size={12} /> Sai lệch / Mâu thuẫn
                          </span>
                        )}
                        {f.status === 'NOT_APPLICABLE' && (
                          <span className="text-slate-500 italic text-[11px]">Chưa đủ thông tin</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{f.note}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t bg-slate-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
