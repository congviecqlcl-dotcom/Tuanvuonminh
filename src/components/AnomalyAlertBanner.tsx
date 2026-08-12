import React from 'react';
import { ShieldAlert, AlertTriangle, Scale, ArrowRight, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';
import { DossierAnomaly } from '../data/agriCapacityData';

interface Props {
  anomalies: DossierAnomaly[];
  onOpenCapacityCalculator?: () => void;
  onApplyAnomaliesToChecklist?: (anomalies: DossierAnomaly[]) => void;
}

export default function AnomalyAlertBanner({ anomalies, onOpenCapacityCalculator, onApplyAnomaliesToChecklist }: Props) {
  if (!anomalies || anomalies.length === 0) return null;

  const criticalCount = anomalies.filter((a) => a.severity === 'CRITICAL').length;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/70 p-5 shadow-xs mb-6 text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shadow-2xs">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-red-950 text-base tracking-tight">
                Phát hiện {anomalies.length} Điểm Bất Hợp Lý & Mâu Thuẫn Trong Hồ Sơ!
              </h3>
              {criticalCount > 0 && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-extrabold text-white animate-pulse">
                  {criticalCount} Nghiêm trọng
                </span>
              )}
            </div>
            <p className="text-xs text-red-800 mt-0.5">
              Hệ thống tự động đối chiếu thông số thuyết minh, diện tích đất, năng lực sinh học & chứng từ pháp lý
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCapacityCalculator && (
            <button
              onClick={onOpenCapacityCalculator}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-50 shadow-2xs transition-colors"
            >
              <Scale size={14} className="text-amber-600" />
              Công cụ Phân tích Năng lực Sinh học
            </button>
          )}
          {onApplyAnomaliesToChecklist && (
            <button
              onClick={() => onApplyAnomaliesToChecklist(anomalies)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
            >
              <CheckCircle2 size={14} />
              Tự động Đưa vào Báo cáo Thẩm định
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {anomalies.map((ano) => (
          <div
            key={ano.id}
            className={`rounded-lg border bg-white p-4 shadow-2xs transition-all ${
              ano.severity === 'CRITICAL' ? 'border-red-300 border-l-4 border-l-red-600' : 'border-amber-300 border-l-4 border-l-amber-500'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {ano.severity === 'CRITICAL' ? (
                  <ShieldAlert size={18} className="text-red-600 shrink-0" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                )}
                <h4 className="font-bold text-slate-900 text-sm">{ano.title}</h4>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  ano.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {ano.severity === 'CRITICAL' ? 'Bất hợp lý nghiêm trọng' : 'Cảnh báo mâu thuẫn'}
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-700">{ano.description}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100">
              <div>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <FileText size={12} className="text-slate-500" /> Chứng cứ mâu thuẫn trong hồ sơ:
                </span>
                <p className="text-slate-700 mt-0.5">{ano.evidence}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Scale size={12} className="text-slate-500" /> Căn cứ định mức sinh học & pháp lý:
                </span>
                <p className="text-slate-700 mt-0.5">{ano.agronomicLegalBasis}</p>
              </div>
            </div>

            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-blue-900 bg-blue-50/70 p-2 rounded border border-blue-100 font-medium">
              <Lightbulb size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Đề xuất hướng xử lý của Công chức thẩm định: </span>
                <span>{ano.suggestedSolution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
