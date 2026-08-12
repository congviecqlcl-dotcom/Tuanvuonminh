import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, Scale, TestTube, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { RiskAssessmentResult } from '../data/riskAssessmentData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  riskResult: RiskAssessmentResult | null;
  coSoName?: string;
  onApplyPlanToChecklist?: () => void;
}

export default function RiskAssessmentModal({ isOpen, onClose, riskResult, coSoName, onApplyPlanToChecklist }: Props) {
  if (!isOpen || !riskResult) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-6 py-4 ${riskResult.bgClass}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${riskResult.riskLevel === 'HIGH' ? 'bg-red-600 text-white' : riskResult.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Kết Quả Phân Tích Nguy Cơ ATTP & Kế Hoạch Hậu Kiểm
              </h2>
              <p className="text-xs text-slate-600">
                {coSoName || 'Cơ sở đăng ký cấp Giấy chứng nhận ATTP'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Score Badge */}
          <div className={`rounded-xl border p-5 ${riskResult.bgClass} ${riskResult.borderClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
                  Xếp hạng Phân luồng Nguy cơ (Risk Score)
                </span>
                <div className={`text-xl font-extrabold mt-1 ${riskResult.colorClass}`}>
                  {riskResult.riskLevelLabel}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Thang điểm rủi ro tính toán: <strong className="text-slate-900">{riskResult.riskScore}/100 điểm</strong> (0 = An toàn tuyệt đối, 100 = Nguy cơ rất cao)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-2xl font-extrabold text-slate-900">{riskResult.riskScore}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Điểm Rủi Ro</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detected Risk Factors */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-600" />
              Các Yếu tố Cấu thành Rủi ro được Hệ thống Ghi nhận:
            </h3>
            <div className="space-y-2">
              {riskResult.detectedFactors.map((f, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{f.factorName}</div>
                    <div className="text-slate-600 mt-0.5">{f.reason}</div>
                  </div>
                  <span className={`shrink-0 font-bold px-2 py-0.5 rounded text-[11px] ${f.weight > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {f.weight > 0 ? `+${f.weight} điểm rủi ro` : `${f.weight} điểm giảm rủi ro`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Post-Inspection Plan */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 space-y-4">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Khuyến Nghị Kế Hoạch Hậu Kiểm & Kiểm Nghiệm Chất Lượng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-600" /> Tần suất kiểm tra hậu kiểm:
                </span>
                <p className="mt-1 text-slate-800 font-medium">{riskResult.postInspectionPlan.frequency}</p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <TestTube size={14} className="text-blue-600" /> Định mức lấy mẫu kiểm nghiệm:
                </span>
                <p className="mt-1 text-slate-800 font-medium">{riskResult.postInspectionPlan.samplingPlan}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5 mb-2">
                <FileText size={14} className="text-blue-600" /> Nội dung trọng tâm kiểm tra tại cơ sở (On-site Audit Focus):
              </span>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700">
                {riskResult.postInspectionPlan.onsiteFocus.map((item, idx) => (
                  <li key={idx} className="font-medium">{item}</li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-blue-800 italic pt-2 border-t border-blue-200/60">
              * {riskResult.postInspectionPlan.legalNotice}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
          {onApplyPlanToChecklist && (
            <button
              onClick={() => {
                onApplyPlanToChecklist();
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <CheckCircle2 size={15} />
              Tự động Đưa Kế hoạch Hậu kiểm vào Biên bản
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
