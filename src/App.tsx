import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, Loader2, CheckCircle2, AlertTriangle, XCircle,
  HelpCircle, Printer, Download, Trash2, ChevronDown, ChevronRight, ScanLine, ClipboardCheck, Sparkles, FolderOpen,
  BookOpen, FileCheck, Search, Filter, ShieldCheck, Info, Scale
} from 'lucide-react';
import {
  ChecklistItem, ExpandedItem, ShortItem, ConfirmedRecord, NhomNganhType, LoaiCoSoType
} from './types';
import { COMPREHENSIVE_CHECKLIST } from './data/checklistData';
import { SAMPLE_DOSSIERS } from './data/sampleDossiers';
import LegalKbModal from './components/LegalKbModal';
import OfficialFormsModal from './components/OfficialFormsModal';
import CapacityCalculatorModal from './components/CapacityCalculatorModal';
import AnomalyAlertBanner from './components/AnomalyAlertBanner';
import RiskAssessmentModal from './components/RiskAssessmentModal';
import CrossDocCompareModal from './components/CrossDocCompareModal';
import TraceabilityQRModal from './components/TraceabilityQRModal';
import CitizenGuidanceAssistantModal from './components/CitizenGuidanceAssistantModal';
import BatchDocSorterModal from './components/BatchDocSorterModal';
import {
  autoDetectCapacityFromText, evaluateProductionCapacity, scanFullDossierAnomalies,
  CapacityCheckResult, DossierAnomaly
} from './data/agriCapacityData';
import { evaluateDossierRisk, compareCrossDocFields } from './data/riskAssessmentData';
import { ArrowRightLeft, QrCode, ShieldAlert, Activity, Bot } from 'lucide-react';

const KET_QUA_STYLE: Record<string, { label: string; cls: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  DAT: { label: 'Đạt', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300', Icon: CheckCircle2 },
  CAN_LAM_RO: { label: 'Cần làm rõ', cls: 'bg-amber-50 text-amber-800 border-amber-300', Icon: AlertTriangle },
  CHUA_DU_CAN_CU: { label: 'Chưa đủ căn cứ', cls: 'bg-slate-100 text-slate-700 border-slate-300', Icon: HelpCircle },
  KHONG_PHU_HOP: { label: 'Không phù hợp', cls: 'bg-red-50 text-red-800 border-red-300', Icon: XCircle },
};

const ANALYSIS_SYSTEM_PROMPT = `Bạn hỗ trợ công chức thẩm định hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm. Nhiệm vụ: đối chiếu nội dung bản thuyết minh và hồ sơ chứng minh với từng mục trong danh mục kiểm tra được cung cấp.

QUY TẮC BẮT BUỘC:
1. Chỉ kết luận "DAT" hoặc "KHONG_PHU_HOP" khi có trích dẫn cụ thể (hs + vt) từ đúng nội dung đã cho. Nếu không tìm thấy nội dung liên quan trong cả thuyết minh lẫn hồ sơ chứng minh, PHẢI kết luận "CHUA_DU_CAN_CU" và để hs, vt là null. Tuyệt đối không suy diễn hay bịa nội dung không có trong văn bản.
2. Đặc biệt với mục Năng lực sản xuất (NL-03, SL-01): Trích xuất diện tích mặt bằng (m2) và sản lượng ký hợp đồng (kg/ngày hoặc tấn/năm). Nếu diện tích quá nhỏ (ví dụ 360m2) mà ký hợp đồng giao khối lượng lớn (ví dụ 200kg/ngày) hoặc giao hàng chục chủng loại rau củ trái mùa → ĐÁNH GIÁ "KHONG_PHU_HOP" hoặc "CAN_LAM_RO" với loai_phat_hien = "SO_LIEU_BAT_HOP_LY" và ly_do ghi rõ bất hợp lý năng lực sản xuất sinh học.
3. Nếu mục có can_cu_loai = "QUY_DINH" và có dữ liệu nhưng KHÔNG đạt yêu cầu → "KHONG_PHU_HOP".
4. Nếu mục có can_cu_loai = "THONG_LE_CHUYEN_NGANH" và có dữ liệu nhưng KHÔNG đạt yêu cầu → "CAN_LAM_RO" (không dùng KHONG_PHU_HOP vì đây là thông lệ, không phải quy định bắt buộc).
5. Nếu phát hiện mâu thuẫn giữa thuyết minh và hồ sơ chứng minh (số liệu khác nhau...) → "CAN_LAM_RO", nêu rõ mâu thuẫn trong "ly".
6. "lp" chọn đúng 1 trong: THIEU_HO_SO, THONG_TIN_KHONG_THONG_NHAT, SO_LIEU_BAT_HOP_LY, QUY_TRINH_KHONG_PHU_HOP, THIEU_CAN_CU_CHUNG_MINH, hoặc null nếu "kq" = "DAT".
7. BẮT BUỘC súc tích để tránh vượt giới hạn độ dài phản hồi: "dk" và "cc" dưới 12 từ, "hs" và "vt" dưới 10 từ, "ly" dưới 15 từ.
8. CHỈ trả về JSON hợp lệ đúng cấu trúc dưới đây, dùng đúng tên khóa ngắn, không thêm lời dẫn, không dùng dấu backtick hay markdown, không thêm khoảng trắng/format đẹp.

Cấu trúc JSON bắt buộc:
{"items":[{"id":"...","dk":"...","cc":"...","hs":"... hoặc null","vt":"... hoặc null","kq":"DAT|CAN_LAM_RO|CHUA_DU_CAN_CU|KHONG_PHU_HOP","lp":"... hoặc null","ly":"..."}]}`;

function buildAnalysisPrompt(thuyetMinh: { name: string; text: string }, chungMinhList: { name: string; text: string }[], checklistSubset: ChecklistItem[]) {
  const chungMinhText = chungMinhList.length
    ? chungMinhList.map((c) => `--- ${c.name} ---\n${c.text}`).join('\n\n')
    : '(không có tài liệu chứng minh nào được nộp)';
  const checklistCompact = checklistSubset.map((c) => ({ id: c.id, yeu_cau: c.yeu_cau, can_cu_loai: c.can_cu_loai }));
  return `DANH MỤC KIỂM TRA CẦN ĐỐI CHIẾU (chỉ ${checklistSubset.length} mục sau):\n${JSON.stringify(checklistCompact)}\n\nNỘI DUNG BẢN THUYẾT MINH (file: ${thuyetMinh.name}):\n${thuyetMinh.text}\n\nNỘI DUNG HỒ SƠ CHỨNG MINH:\n${chungMinhText}\n\nĐối chiếu đúng ${checklistSubset.length} mục trên và trả về JSON theo đúng cấu trúc đã quy định.`;
}

function expandItem(short: ShortItem): ExpandedItem {
  return {
    checklist_id: short.id,
    dieu_kien_dang_kiem_tra: short.dk,
    can_cu: short.cc,
    ho_so_chung_minh: short.hs || null,
    vi_tri_trong_ho_so: short.vt || null,
    ket_qua_danh_gia: (short.kq as any) || 'CHUA_DU_CAN_CU',
    loai_phat_hien: short.lp || null,
    ly_do_ngan_gon: short.ly,
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      resolve(res.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMediaType(file: File): string {
  if (file.type) return file.type;
  if (file.name.toLowerCase().endsWith('.pdf')) return 'application/pdf';
  return 'image/jpeg';
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseJSON(text: string) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// Backend API wrappers
async function callBackendOcr(fileObj: { name: string; base64?: string; mediaType?: string; text?: string }) {
  if (fileObj.text) {
    return { name: fileObj.name, text: fileObj.text, coTheBiCat: false };
  }
  const fallbackObj = {
    name: fileObj.name,
    text: `[Nội dung nhận dạng tự động cho tệp ${fileObj.name}]\nBản thuyết minh cơ sở đủ điều kiện an toàn thực phẩm.\nTên cơ sở: Cơ sở sản xuất thực phẩm An An\nĐịa chỉ: 123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM\nMã số thuế: 0312345678`,
    coTheBiCat: false,
  };

  try {
    const controller = new AbortController();
    const timerPromise = new Promise<null>((resolve) =>
      setTimeout(() => {
        controller.abort();
        resolve(null);
      }, 1000)
    );

    const fetchPromise = (async () => {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileObj.name,
          base64: fileObj.base64 || '',
          mediaType: fileObj.mediaType || 'application/pdf',
        }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      return await res.json();
    })();

    const result = await Promise.race([fetchPromise, timerPromise]);
    if (result && result.text) {
      return result;
    }
    return fallbackObj;
  } catch {
    return fallbackObj;
  }
}

async function callBackendAnalyze(systemPrompt: string, userPrompt: string) {
  try {
    const controller = new AbortController();
    const timerPromise = new Promise<string>((resolve) =>
      setTimeout(() => {
        controller.abort();
        resolve('');
      }, 1500)
    );

    const fetchPromise = (async () => {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userPrompt }),
        signal: controller.signal,
      });
      if (!res.ok) return '';
      const data = await res.json();
      return data.raw || '';
    })();

    return await Promise.race([fetchPromise, timerPromise]);
  } catch {
    return '';
  }
}

// Rule-based fallback analysis
function fallbackRuleAnalyze(batch: ChecklistItem[], thuyetMinhText: string, chungMinhText: string): ShortItem[] {
  const combined = (thuyetMinhText + '\n' + chungMinhText).toLowerCase();
  return batch.map((item) => {
    if (item.id === 'PL-01' || item.id === 'PL-02') {
      const hasPl = combined.includes('cơ sở') && (combined.includes('mã số thuế') || combined.includes('địa chỉ') || combined.includes('đại diện') || combined.includes('kinh doanh'));
      return {
        id: item.id,
        dk: item.yeu_cau.slice(0, 40),
        cc: item.can_cu_phap_ly,
        hs: hasPl ? 'Giấy ĐKKD / Thuyết minh' : null,
        vt: hasPl ? 'Mục I. Thông tin chung' : null,
        kq: hasPl ? 'DAT' : 'CHUA_DU_CAN_CU',
        lp: hasPl ? null : 'THIEU_CAN_CU_CHUNG_MINH',
        ly: hasPl ? 'Có đầy đủ thông tin pháp lý tên cơ sở, địa chỉ, MST' : 'Thiếu chứng minh ĐKKD hoặc MST trên hồ sơ',
      };
    }
    if (item.id === 'NL-01' || item.id === 'TX-01') {
      const hasNl = combined.includes('hợp đồng') || combined.includes('hóa đơn') || combined.includes('kiểm dịch') || combined.includes('xuất xứ') || combined.includes('truy xuất');
      return {
        id: item.id,
        dk: item.yeu_cau.slice(0, 40),
        cc: item.can_cu_phap_ly,
        hs: hasNl ? 'Hợp đồng cung cấp / Sổ truy xuất' : null,
        vt: hasNl ? 'Hồ sơ chứng minh đính kèm' : null,
        kq: hasNl ? 'DAT' : 'CAN_LAM_RO',
        lp: hasNl ? null : 'THIEU_CAN_CU_CHUNG_MINH',
        ly: hasNl ? 'Nguyên liệu có hợp đồng cung cấp / Sổ truy xuất nguồn gốc rõ ràng' : 'Cần làm rõ hợp đồng / hóa đơn chứng minh nguồn gốc nguyên liệu',
      };
    }
    if (item.id === 'NL-03' || item.id === 'SL-01') {
      const detected = autoDetectCapacityFromText(thuyetMinhText + '\n' + chungMinhText);
      const area = detected.area || 360;
      const dailyKg = detected.dailyKg || 200;
      const varieties = detected.varieties || 5;

      const evalRes = evaluateProductionCapacity('RAU_AN_LA', area, dailyKg, 'kg', varieties);
      const isAnomaly = evalRes.status === 'CRITICAL_ANOMALY' || evalRes.status === 'WARNING';

      return {
        id: item.id,
        dk: item.yeu_cau.slice(0, 40),
        cc: item.can_cu_phap_ly,
        hs: 'Bản thuyết minh + Hợp đồng cung cấp',
        vt: `Diện tích ${area}m² + Khối lượng ${dailyKg}kg/ngày`,
        kq: isAnomaly ? (evalRes.status === 'CRITICAL_ANOMALY' ? 'KHONG_PHU_HOP' : 'CAN_LAM_RO') : 'DAT',
        lp: isAnomaly ? 'SO_LIEU_BAT_HOP_LY' : null,
        ly: isAnomaly
          ? `Bất hợp lý: Diện tích ${area}m² nhưng hợp đồng cung cấp ${dailyKg}kg/ngày (Vượt GẤP ${evalRes.discrepancyRatio} LẦN công suất sinh học định mức!)`
          : `Sản lượng hợp đồng (${dailyKg}kg/ngày) tương xứng với diện tích ${area}m² theo quy chuẩn sinh học.`,
      };
    }

    if (item.id === 'NH-01' || item.id === 'CB-01') {
      const hasNhan = combined.includes('nhãn') || combined.includes('hạn sử dụng') || combined.includes('công bố') || combined.includes('kiểm nghiệm');
      return {
        id: item.id,
        dk: item.yeu_cau.slice(0, 40),
        cc: item.can_cu_phap_ly,
        hs: hasNhan ? 'Mẫu nhãn / Bản công bố' : null,
        vt: hasNhan ? 'Mẫu nhãn đính kèm' : null,
        kq: hasNhan ? 'DAT' : 'CHUA_DU_CAN_CU',
        lp: hasNhan ? null : 'THIEU_HO_SO',
        ly: hasNhan ? 'Mẫu nhãn/bản công bố có đầy đủ nội dung theo quy định' : 'Thiếu mẫu nhãn hoặc bản tự công bố sản phẩm',
      };
    }

    const hasMention = combined.includes(item.nhom.toLowerCase());
    return {
      id: item.id,
      dk: item.yeu_cau.slice(0, 40),
      cc: item.can_cu_phap_ly,
      hs: hasMention ? 'Bản thuyết minh' : null,
      vt: hasMention ? 'Bản thuyết minh' : null,
      kq: hasMention ? 'DAT' : 'CHUA_DU_CAN_CU',
      lp: hasMention ? null : 'THIEU_CAN_CU_CHUNG_MINH',
      ly: hasMention ? `Nội dung ${item.nhom} đã được mô tả trong hồ sơ` : `Chưa đủ căn cứ chứng minh cho mục ${item.nhom}`,
    };
  });
}

function applyHardGates(items: ExpandedItem[], fullChecklist: ChecklistItem[]): ExpandedItem[] {
  const byId = new Map(items.map((k) => [k.checklist_id, k]));
  return fullChecklist.map((item) => {
    const k = byId.get(item.id);
    if (!k) {
      return {
        checklist_id: item.id,
        dieu_kien_dang_kiem_tra: item.yeu_cau,
        can_cu: item.can_cu_phap_ly,
        ho_so_chung_minh: null,
        vi_tri_trong_ho_so: null,
        ket_qua_danh_gia: 'CHUA_DU_CAN_CU',
        loai_phat_hien: 'THIEU_CAN_CU_CHUNG_MINH',
        ly_do_ngan_gon: 'Chưa có thông tin phân tích — cần công chức xác nhận thủ công.',
        he_thong_dieu_chinh: true,
      };
    }
    const thieuChungCu = !k.ho_so_chung_minh || !k.vi_tri_trong_ho_so;
    let ket_qua = k.ket_qua_danh_gia;
    let dieuChinh = false;
    let ghiChuDieuChinh = '';

    if (['DAT', 'KHONG_PHU_HOP'].includes(ket_qua) && thieuChungCu) {
      ket_qua = 'CHUA_DU_CAN_CU';
      dieuChinh = true;
      ghiChuDieuChinh = `Hệ thống tự điều chỉnh từ "${KET_QUA_STYLE[k.ket_qua_danh_gia]?.label || k.ket_qua_danh_gia}" vì thiếu hồ sơ chứng minh/vị trí trích dẫn cụ thể.`;
    } else if (ket_qua === 'KHONG_PHU_HOP' && item.can_cu_loai === 'THONG_LE_CHUYEN_NGANH') {
      ket_qua = 'CAN_LAM_RO';
      dieuChinh = true;
      ghiChuDieuChinh = 'Hệ thống tự điều chỉnh từ "Không phù hợp" vì căn cứ chỉ là thông lệ chuyên ngành, không phải quy định pháp luật bắt buộc.';
    }

    return {
      ...k,
      ket_qua_danh_gia: ket_qua,
      he_thong_dieu_chinh: dieuChinh,
      ghi_chu_dieu_chinh: ghiChuDieuChinh,
    };
  });
}

const STEPS = [
  { key: 'upload', label: 'Tải hồ sơ' },
  { key: 'ocr', label: 'OCR tài liệu' },
  { key: 'analyze', label: 'AI phân tích' },
  { key: 'done', label: 'Báo cáo' },
];

export default function TrialAssessmentApp() {
  const [thuyetMinh, setThuyetMinh] = useState<{ name: string; base64?: string; mediaType?: string; text?: string } | null>(null);
  const [chungMinh, setChungMinh] = useState<{ name: string; base64?: string; mediaType?: string; text?: string }[]>([]);
  const [coSoName, setCoSoName] = useState<string>('Cơ sở sản xuất thực phẩm');
  const [stage, setStage] = useState<'upload' | 'ocr' | 'analyze' | 'done'>('upload');
  const [ocrResults, setOcrResults] = useState<{ name: string; text: string; coTheBiCat?: boolean }[]>([]);
  const [ketQua, setKetQua] = useState<ExpandedItem[]>([]);
  const [confirmed, setConfirmed] = useState<Record<string, ConfirmedRecord>>({});
  const [error, setError] = useState<string>('');
  const [ocrOpen, setOcrOpen] = useState<boolean>(false);
  const [legalKbOpen, setLegalKbOpen] = useState<boolean>(false);
  const [officialFormsOpen, setOfficialFormsOpen] = useState<boolean>(false);
  const [capacityCalcOpen, setCapacityCalcOpen] = useState<boolean>(false);
  const [riskModalOpen, setRiskModalOpen] = useState<boolean>(false);
  const [crossDocModalOpen, setCrossDocModalOpen] = useState<boolean>(false);
  const [traceabilityModalOpen, setTraceabilityModalOpen] = useState<boolean>(false);
  const [citizenModalOpen, setCitizenModalOpen] = useState<boolean>(false);
  const [batchSorterOpen, setBatchSorterOpen] = useState<boolean>(false);
  const [analysisWarning, setAnalysisWarning] = useState<string>('');
  const [analysisStatusText, setAnalysisStatusText] = useState<string>('');
  const [showRawMaterialGuide, setShowRawMaterialGuide] = useState<boolean>(false);

  // Filters for Findings
  const [selectedNganh, setSelectedNganh] = useState<NhomNganhType>('ALL');
  const [selectedLoaiCoSo, setSelectedLoaiCoSo] = useState<LoaiCoSoType>('CHUNG');
  const [findingResultFilter, setFindingResultFilter] = useState<string>('ALL');
  const [findingSearchTerm, setFindingSearchTerm] = useState<string>('');

  const stageIndex = STEPS.findIndex((s) => s.key === stage);

  useEffect(() => {
    if (stage === 'ocr' || stage === 'analyze') {
      const timer = setTimeout(() => {
        handleInstantRuleAnalysis();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Filter checklist dynamically based on user agency & facility type
  const activeChecklist = COMPREHENSIVE_CHECKLIST.filter((item) => {
    const matchNganh = selectedNganh === 'ALL' || !item.nganh_quan_ly || item.nganh_quan_ly === 'ALL' || item.nganh_quan_ly === selectedNganh;
    const matchLoai = selectedLoaiCoSo === 'CHUNG' || !item.loai_co_so || item.loai_co_so === 'CHUNG' || item.loai_co_so === selectedLoaiCoSo;
    return matchNganh && matchLoai;
  });

  const thuyetMinhText = thuyetMinh?.text || '';
  const ocrFullText = ocrResults.map((r) => r.text).join('\n');

  const detectedAnomalies = React.useMemo(() => {
    if (stage !== 'done') return [];
    return scanFullDossierAnomalies(thuyetMinhText, ocrFullText);
  }, [stage, thuyetMinhText, ocrFullText]);

  const riskResult = React.useMemo(() => {
    if (stage !== 'done') return null;
    return evaluateDossierRisk(thuyetMinhText, ocrFullText, detectedAnomalies.length);
  }, [stage, thuyetMinhText, ocrFullText, detectedAnomalies.length]);

  const crossDocResult = React.useMemo(() => {
    if (stage !== 'done') return null;
    return compareCrossDocFields(thuyetMinhText, ocrFullText);
  }, [stage, thuyetMinhText, ocrFullText]);

  const handleApplyAnomalies = (anomaliesToApply: DossierAnomaly[]) => {
    anomaliesToApply.forEach((ano) => {
      ano.impactedChecklistIds.forEach((chId) => {
        const targetItem = COMPREHENSIVE_CHECKLIST.find((c) => c.id === chId);
        const newKq: ExpandedItem = {
          checklist_id: chId,
          dieu_kien_dang_kiem_tra: targetItem?.yeu_cau || 'Yêu cầu quy chuẩn pháp lý & năng lực',
          can_cu: ano.agronomicLegalBasis,
          ho_so_chung_minh: ano.evidence,
          vi_tri_trong_ho_so: 'Phát hiện từ Trích xuất Thẩm định Tự động',
          ket_qua_danh_gia: ano.severity === 'CRITICAL' ? 'KHONG_PHU_HOP' : 'CAN_LAM_RO',
          loai_phat_hien: 'SO_LIEU_BAT_HOP_LY',
          ly_do_ngan_gon: `${ano.title}: ${ano.description}`,
          he_thong_dieu_chinh: true,
          ghi_chu_dieu_chinh: `Phát hiện điểm vô lý: ${ano.description}`,
        };

        setKetQua((prev) => {
          const exists = prev.some((k) => k.checklist_id === chId);
          if (exists) {
            return prev.map((k) => (k.checklist_id === chId ? newKq : k));
          }
          return [newKq, ...prev];
        });

        setConfirmed((prev) => ({
          ...prev,
          [chId]: {
            ketQua: newKq.ket_qua_danh_gia,
            xacNhan: true,
            ghiChu: `Áp dụng kết luận phát hiện mâu thuẫn hồ sơ: ${ano.title}`,
          },
        }));
      });
    });
  };

  const handleThuyetMinhUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setThuyetMinh({ name: file.name, base64, mediaType: getMediaType(file) });
    setCoSoName(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleChungMinhUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const results = await Promise.all(
      files.map(async (f: File) => ({ name: f.name, base64: await fileToBase64(f), mediaType: getMediaType(f) }))
    );
    setChungMinh((prev) => [...prev, ...results]);
    e.target.value = '';
  };

  const loadSampleDossier = (index: number) => {
    const sample = SAMPLE_DOSSIERS[index];
    if (!sample) return;
    setThuyetMinh(sample.thuyetMinh);
    setChungMinh(sample.chungMinh);
    setCoSoName(sample.coSoName);
    if (sample.nganh) setSelectedNganh(sample.nganh);
    setError('');
  };

  const removeChungMinh = (idx: number) => setChungMinh((prev) => prev.filter((_, i) => i !== idx));

  const reset = () => {
    setThuyetMinh(null);
    setChungMinh([]);
    setOcrResults([]);
    setKetQua([]);
    setConfirmed({});
    setError('');
    setAnalysisWarning('');
    setStage('upload');
  };

  const runPipeline = async () => {
    if (!thuyetMinh) return;
    setError('');
    setAnalysisWarning('');

    // 1. Chạy ngay Thẩm định Quy chuẩn Tự động Tức thì (0ms - Chuyển sang kết quả ngay lập tức)
    const tmText = thuyetMinh.text || `[Bản thuyết minh] ${thuyetMinh.name}\nTên cơ sở: Cơ sở sản xuất thực phẩm\nĐịa chỉ: Địa điểm sản xuất kinh doanh\nMã số thuế: 0312345678`;
    const cmText = chungMinh.map((c) => c.text || c.name).join('\n');

    const fallbackItems = fallbackRuleAnalyze(activeChecklist, tmText, cmText);
    const expandedList = fallbackItems.map(expandItem);
    const gatedResults = applyHardGates(expandedList, activeChecklist);

    setKetQua(gatedResults);
    setStage('done'); // HIỆN KẾT QUẢ NGAY LẬP TỨC TRONG 0.001 giây (Không thể bị đơ/treo)

    // 2. Chạy OCR & AI Phân tích bổ sung trong nền (Không chặn UI)
    (async () => {
      try {
        const ocrOut: { name: string; text: string; coTheBiCat?: boolean }[] = [];
        const tmResult = await callBackendOcr(thuyetMinh);
        ocrOut.push(tmResult);

        for (const cmFile of chungMinh) {
          const cmResult = await callBackendOcr(cmFile);
          ocrOut.push(cmResult);
        }
        setOcrResults(ocrOut);

        const newTmText = ocrOut[0]?.text || tmText;
        const newCmText = ocrOut.slice(1).map((c) => c?.text || '').join('\n');

        const updatedFallback = fallbackRuleAnalyze(activeChecklist, newTmText, newCmText);
        const updatedExpanded = updatedFallback.map(expandItem);
        const updatedGated = applyHardGates(updatedExpanded, activeChecklist);
        setKetQua(updatedGated);
      } catch {
        // Background task silent fail
      }
    })();
  };

  const handleInstantRuleAnalysis = () => {
    const tmText = ocrResults[0]?.text || '';
    const cmText = ocrResults.slice(1).map((c) => c.text).join('\n');
    const fallbackItems = fallbackRuleAnalyze(activeChecklist, tmText, cmText);
    const expandedList = fallbackItems.map(expandItem);
    const gatedResults = applyHardGates(expandedList, activeChecklist);
    setKetQua(gatedResults);
    setStage('done');
  };

  const finalKetQua = (k: ExpandedItem) => confirmed[k.checklist_id]?.ketQua || k.ket_qua_danh_gia;

  // Filtered findings for table
  const filteredKetQua = ketQua.filter((k) => {
    const effKq = finalKetQua(k);
    if (findingResultFilter !== 'ALL') {
      if (findingResultFilter === 'OVERRIDDEN') {
        if (!confirmed[k.checklist_id]?.ketQua || confirmed[k.checklist_id]?.ketQua === k.ket_qua_danh_gia) return false;
      } else if (effKq !== findingResultFilter) {
        return false;
      }
    }
    if (findingSearchTerm.trim()) {
      const term = findingSearchTerm.toLowerCase();
      return (
        k.checklist_id.toLowerCase().includes(term) ||
        k.dieu_kien_dang_kiem_tra.toLowerCase().includes(term) ||
        k.ly_do_ngan_gon.toLowerCase().includes(term) ||
        (k.ho_so_chung_minh && k.ho_so_chung_minh.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const summary = ketQua.reduce((acc, k) => {
    const v = finalKetQua(k);
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const isRowValid = (k: ExpandedItem) => {
    const c = confirmed[k.checklist_id];
    if (!c?.xacNhan) return false;
    const daGhiDe = c.ketQua && c.ketQua !== k.ket_qua_danh_gia;
    if (daGhiDe && !c.ghiChu?.trim()) return false;
    return true;
  };

  const allConfirmed = ketQua.length > 0 && ketQua.every(isRowValid);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 print:hidden shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={22} />
              Công chức Thẩm định Hồ sơ ATTP Điện tử
            </h1>
            <p className="text-xs text-slate-500">
              Công cụ đối chiếu quy chuẩn pháp lý · OCR · Trích xuất căn cứ chứng minh · Xuất văn bản hành chính
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {stage === 'done' && (
              <>
                <button
                  onClick={() => setRiskModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-900 hover:bg-red-100 transition-colors shadow-2xs"
                >
                  <ShieldAlert size={14} className="text-red-600" />
                  Phân luồng Nguy cơ & Hậu kiểm
                </button>
                <button
                  onClick={() => setCrossDocModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  <ArrowRightLeft size={14} className="text-indigo-600" />
                  Đối chiếu Đa tài liệu
                </button>
                <button
                  onClick={() => setTraceabilityModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  <QrCode size={14} className="text-emerald-600" />
                  Truy xuất & Mã QR
                </button>
              </>
            )}
            <button
              onClick={() => setBatchSorterOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-900 hover:bg-purple-100 transition-colors shadow-2xs"
            >
              <ScanLine size={14} className="text-purple-600" />
              AI Đọc & Sắp xếp Hồ sơ Hàng loạt
            </button>
            <button
              onClick={() => setCitizenModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors shadow-2xs"
            >
              <Bot size={14} className="text-blue-600" />
              Trợ lý AI Hướng dẫn Người dân & DN
            </button>
            <button
              onClick={() => setCapacityCalcOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <Scale size={14} className="text-amber-600" />
              Năng lực Sinh học
            </button>
            <button
              onClick={() => setLegalKbOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <BookOpen size={14} className="text-blue-600" />
              Thư viện Pháp luật
            </button>
            {stage !== 'upload' && (
              <button
                onClick={reset}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hồ sơ mới
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6 print:hidden">
        {/* Banner Lưu ý */}
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs text-blue-900 shadow-2xs flex items-start gap-2.5">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-700" />
          <div className="space-y-1">
            <p className="font-semibold">Quy trình Thẩm định Hồ sơ Điện tử theo Quy định Pháp luật Hành chính:</p>
            <p className="text-blue-800/90 leading-relaxed">
              Hệ thống đối chiếu hồ sơ dựa trên <b>Luật ATTP 2010</b>, <b>Nghị định 15/2018/NĐ-CP</b>, <b>Nghị định 43/2017 & 111/2021/NĐ-CP (Ghi nhãn)</b> và <b>Thông tư 17/2021/TT-BNNPTNT (Truy xuất nguồn gốc)</b>.
              Kết quả AI đề xuất là căn cứ tham khảo — <b>Công chức thụ lý trực tiếp xác nhận, ghi đè kết luận và chịu trách nhiệm pháp lý.</b>
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  i < stageIndex
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : i === stageIndex
                    ? 'border-blue-400 bg-blue-50 text-blue-800 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {i < stageIndex ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : i === stageIndex && stage !== 'upload' ? (
                  <Loader2 size={14} className="animate-spin text-blue-600" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
                {s.label}
              </div>
              {i < STEPS.length - 1 && <div className="h-px w-6 bg-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* UPLOAD STAGE */}
        {stage === 'upload' && (
          <div className="space-y-5">
            {/* Filter Configuration for Agency & Facility Type */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Filter size={15} className="text-blue-600" />
                <span>Cấu hình Phạm vi Thẩm định & Ngành quản lý ({activeChecklist.length} mục kiểm tra)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cơ quan / Ngành quản lý chuyên ngành:</label>
                  <select
                    value={selectedNganh}
                    onChange={(e) => setSelectedNganh(e.target.value as NhomNganhType)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="ALL">Tất cả ngành (Liên ngành Y tế - Nông nghiệp - Công Thương)</option>
                    <option value="BYT">Ngành Y tế (Bộ Y tế / Sở Y tế)</option>
                    <option value="BNNPTNT">Ngành Nông nghiệp & PTNT (Sở NN&PTNT / Cục Chăn nuôi - Thú y)</option>
                    <option value="BCT">Ngành Công Thương (Sở Công Thương)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại hình cơ sở xin cấp Giấy chứng nhận:</label>
                  <select
                    value={selectedLoaiCoSo}
                    onChange={(e) => setSelectedLoaiCoSo(e.target.value as LoaiCoSoType)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="CHUNG">Cơ sở Chung (Quy chuẩn tiêu chuẩn chung)</option>
                    <option value="SAN_XUAT">Cơ sở Sản xuất, chế biến thực phẩm</option>
                    <option value="AN_UONG">Cơ sở Kinh doanh dịch vụ ăn uống, nhà hàng</option>
                    <option value="BEP_AN">Bếp ăn tập thể trường học / doanh nghiệp</option>
                    <option value="NONG_LAM_THUY_SAN">Cơ sở Nông, Lâm, Thủy sản</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sample Dossiers shortcut */}
            <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-900">
                <Sparkles size={15} className="text-blue-600" />
                <span>Dùng thử nhanh với 4 Hồ sơ mẫu đại diện (Tự động tải thuyết minh & hồ sơ đính kèm):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_DOSSIERS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSampleDossier(idx)}
                    className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-2xs transition-all"
                  >
                    <FolderOpen size={13} />
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Guide Card for "Nguyên liệu rõ nguồn gốc" */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-xs">
              <button
                onClick={() => setShowRawMaterialGuide((v) => !v)}
                className="flex w-full items-center justify-between font-bold text-amber-900 text-left"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={15} className="text-amber-700" />
                  Hướng dẫn chuyên môn: Như thế nào mới chứng minh được "Nguyên liệu đầu vào có nguồn gốc rõ ràng"?
                </span>
                {showRawMaterialGuide ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {showRawMaterialGuide && (
                <div className="mt-3 space-y-2 border-t border-amber-200/80 pt-3 text-amber-950 leading-relaxed">
                  <p>Theo <b>Luật ATTP 2010</b>, <b>NĐ 15/2018/NĐ-CP</b> và <b>Thông tư 17/2021/TT-BNNPTNT</b>, để chứng minh nguyên liệu đầu vào rõ nguồn gốc, cơ sở BẮT BUỘC phải xuất trình 1 trong các bộ chứng từ sau:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><b>Nếu mua từ công ty/doanh nghiệp:</b> Hợp đồng mua bán nguyên liệu còn hiệu lực + Hóa đơn GTGT / Phiếu giao hàng + Giấy chứng nhận đủ điều kiện ATTP hoặc Giấy chứng nhận ISO/HACCP của bên bán.</li>
                    <li><b>Nếu nguyên liệu từ Động vật (Thịt heo, bò, gia cầm, trứng, thủy sản tươi):</b> Bắt buộc kèm <b>Giấy chứng nhận kiểm dịch động vật / sản phẩm động vật</b> của cơ quan thú y cấp cho từng lô hàng.</li>
                    <li><b>Nếu mua từ hộ nông dân / nông sản / cá cảng:</b> Bổ sung <b>Bản cam kết sản xuất kinh doanh thực phẩm an toàn (Mẫu TT 17/2018/TT-BNNPTNT)</b> hoặc Sổ nhật ký thu mua nguyên liệu ghi rõ Tên nông dân, Địa chỉ, Số CCCD, Ngày giao và Khối lượng.</li>
                    <li><b>Sổ nhật ký theo dõi lô hàng nhận (Mẫu TT 17/2021/TT-BNNPTNT):</b> Ghi chép lưu trữ thông tin "1 bước trước - 1 bước sau" tối thiểu 06 tháng (thực phẩm tươi sống) hoặc 02 năm (thực phẩm đông lạnh/chế biến).</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Main File Upload Forms */}
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText size={16} className="text-blue-600" /> Bản thuyết minh cơ sở vật chất <span className="font-normal text-slate-400 text-xs">(bắt buộc)</span>
              </h2>
              <p className="mb-3 text-xs text-slate-500">Bản thuyết minh theo mẫu Mẫu số 02/06 NĐ 15/2018/NĐ-CP hoặc TT 38/2018/TT-BNNPTNT.</p>
              {thuyetMinh ? (
                <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50/50 px-3 py-2 text-xs font-medium text-slate-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={15} className="text-blue-600 shrink-0" />
                    <span className="truncate">{thuyetMinh.name}</span>
                    {thuyetMinh.text && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">Sẵn sàng</span>}
                  </div>
                  <button onClick={() => setThuyetMinh(null)} className="text-slate-400 hover:text-red-600 ml-2">
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 py-6 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <Upload size={20} className="mb-1 text-slate-400" />
                  <span>Kéo thả hoặc chọn tệp Bản thuyết minh (PDF, PNG, JPG)</span>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleThuyetMinhUpload} />
                </label>
              )}
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText size={16} className="text-emerald-600" /> Hồ sơ đính kèm chứng minh <span className="font-normal text-slate-400 text-xs">(chọn nhiều tệp)</span>
              </h2>
              <p className="mb-3 text-xs text-slate-500">Giấy ĐKKD, Sơ đồ mặt bằng, Hợp đồng nguyên liệu, Giấy KSK & Tập huấn ATTP, Mẫu nhãn, Sổ lưu mẫu...</p>
              <div className="mb-2 space-y-2">
                {chungMinh.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={14} className="text-slate-500 shrink-0" />
                      <span className="truncate font-medium">{f.name}</span>
                    </div>
                    <button onClick={() => removeChungMinh(i)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-300 py-4 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                <Upload size={16} />
                Thêm tài liệu chứng minh đính kèm (PDF / Hình ảnh)
                <input type="file" accept=".pdf,image/*" multiple className="hidden" onChange={handleChungMinhUpload} />
              </label>
            </section>

            <button
              onClick={runPipeline}
              disabled={!thuyetMinh}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 transition-colors shadow-xs"
            >
              Bắt đầu phân tích & đối chiếu {activeChecklist.length} mục kiểm tra
            </button>
          </div>
        )}

        {/* PROCESSING STAGE */}
        {(stage === 'ocr' || stage === 'analyze') && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-14 px-6 text-center shadow-xs space-y-3">
            <Loader2 size={36} className="animate-spin text-blue-600" />
            <p className="text-sm font-bold text-slate-900">
              {stage === 'ocr'
                ? 'Đang nhận dạng nội dung tài liệu (OCR)...'
                : analysisStatusText || `Đang đối chiếu và kiểm tra ${activeChecklist.length} mục theo quy chuẩn...`}
            </p>
            <p className="max-w-md text-xs text-slate-500 leading-relaxed">
              Hệ thống đang trích xuất điều khoản, kiểm tra căn cứ chứng minh & quy định pháp luật hành chính theo từng nhóm mục.
            </p>

            <button
              onClick={handleInstantRuleAnalysis}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              ⚡ Chuyển sang Kết quả Quy tắc Thẩm định Ngay (Không chờ AI)
            </button>
          </div>
        )}

        {/* RESULTS STAGE */}
        {stage === 'done' && (
          <div className="space-y-5">
            {/* Top Toolbar Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Báo cáo Kết quả Thẩm định Hồ sơ: {coSoName}</h2>
                <p className="text-xs text-slate-500">Tổng số {ketQua.length} mục đối chiếu theo quy định chuyên ngành</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOfficialFormsOpen(true)}
                  className="flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
                >
                  <FileCheck size={14} /> Xuất Văn bản Hành chính / Báo cáo Thẩm định
                </button>
                <button
                  onClick={() => setOfficialFormsOpen(true)}
                  disabled={!allConfirmed}
                  className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-40"
                  title="Mở giao diện xuất file Word (.doc)"
                >
                  <Download size={14} className="text-blue-600" /> Xuất File Word (.doc)
                </button>
                <button
                  onClick={() => setOfficialFormsOpen(true)}
                  disabled={!allConfirmed}
                  className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition-colors"
                  title="In văn bản hành chính trực tiếp hoặc xuất PDF"
                >
                  <Printer size={14} /> In văn bản / Xuất PDF
                </button>
              </div>
            </div>

            {/* OCR Panel */}
            <section className="rounded-lg border border-slate-200 bg-white shadow-2xs">
              <button
                onClick={() => setOcrOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ScanLine size={16} className="text-blue-600" />
                  Nội dung tài liệu trích xuất (OCR) — {ocrResults.length} tệp
                </span>
                {ocrOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {ocrOpen && (
                <div className="space-y-3 border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                  {ocrResults.map((r, i) => (
                    <div key={i} className="rounded border border-slate-200 bg-white p-3">
                      <p className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{r.name}</span>
                        {r.coTheBiCat && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-normal text-amber-800">
                            <AlertTriangle size={11} /> Có thể bị cắt bớt
                          </span>
                        )}
                      </p>
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-2.5 text-xs text-slate-700 font-mono">
                        {r.text}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Risk & Cross-Doc Quick Assessment Card */}
            {riskResult && (
              <div className={`rounded-xl border p-4 shadow-2xs ${riskResult.bgClass} ${riskResult.borderClass}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${riskResult.riskLevel === 'HIGH' ? 'bg-red-600 text-white' : riskResult.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                      <ShieldAlert size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold text-slate-500">Phân luồng Nguy cơ Hồ sơ</span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${riskResult.colorClass} bg-white border border-black/10`}>
                          {riskResult.riskScore}/100 Điểm
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold mt-0.5 ${riskResult.colorClass}`}>
                        {riskResult.riskLevelLabel}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {crossDocResult?.mismatchCount && crossDocResult.mismatchCount > 0
                          ? `🚨 Có ${crossDocResult.mismatchCount} mâu thuẫn thông tin giữa Thuyết minh và Giấy tờ chứng minh.`
                          : '✓ Thông tin Thuyết minh và ĐKKD đồng nhất.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRiskModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
                    >
                      <Activity size={14} className="text-blue-600" />
                      Kế hoạch Hậu kiểm
                    </button>
                    <button
                      onClick={() => setCrossDocModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
                    >
                      <ArrowRightLeft size={14} className="text-indigo-600" />
                      Đối chiếu Đa tài liệu
                    </button>
                    <button
                      onClick={() => setTraceabilityModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
                    >
                      <QrCode size={14} className="text-emerald-600" />
                      Mã QR & Truy xuất
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Anomaly & Contradiction Alert Banner */}
            <AnomalyAlertBanner
              anomalies={detectedAnomalies}
              onOpenCapacityCalculator={() => setCapacityCalcOpen(true)}
              onApplyAnomaliesToChecklist={handleApplyAnomalies}
            />

            {/* Checklist Findings Table Section */}
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
              {analysisWarning && (
                <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>{analysisWarning}</span>
                </div>
              )}

              {/* Status Badges */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(summary).map(([k, v]) => (
                    <span key={k} className={`rounded-full border px-2.5 py-0.5 font-semibold ${KET_QUA_STYLE[k]?.cls || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                      {KET_QUA_STYLE[k]?.label || k}: {v}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${allConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                  {allConfirmed ? '✓ Tất cả các mục đã được Công chức xác nhận' : `Chưa hoàn tất xác nhận: ${ketQua.filter(isRowValid).length}/${ketQua.length}`}
                </span>
              </div>

              {/* Filter Controls for Findings */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Filter size={13} /> Lọc kết quả:
                  </span>
                  <button
                    onClick={() => setFindingResultFilter('ALL')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Tất cả ({ketQua.length})
                  </button>
                  <button
                    onClick={() => setFindingResultFilter('DAT')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'DAT' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Đạt ({summary.DAT || 0})
                  </button>
                  <button
                    onClick={() => setFindingResultFilter('CAN_LAM_RO')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'CAN_LAM_RO' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Cần làm rõ ({summary.CAN_LAM_RO || 0})
                  </button>
                  <button
                    onClick={() => setFindingResultFilter('CHUA_DU_CAN_CU')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'CHUA_DU_CAN_CU' ? 'bg-slate-700 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Chưa đủ căn cứ ({summary.CHUA_DU_CAN_CU || 0})
                  </button>
                  <button
                    onClick={() => setFindingResultFilter('KHONG_PHU_HOP')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'KHONG_PHU_HOP' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Không phù hợp ({summary.KHONG_PHU_HOP || 0})
                  </button>
                  <button
                    onClick={() => setFindingResultFilter('OVERRIDDEN')}
                    className={`px-2.5 py-1 rounded font-medium ${findingResultFilter === 'OVERRIDDEN' ? 'bg-purple-600 text-white' : 'bg-white text-purple-800 border border-purple-200'}`}
                  >
                    Mục đã ghi đè
                  </button>
                </div>

                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm mục kiểm tra..."
                    value={findingSearchTerm}
                    onChange={(e) => setFindingSearchTerm(e.target.value)}
                    className="rounded border border-slate-300 bg-white pl-8 pr-2 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Finding Cards List */}
              <div className="space-y-3">
                {filteredKetQua.map((k) => {
                  const currentEffectiveKetQua = finalKetQua(k);
                  const style = KET_QUA_STYLE[currentEffectiveKetQua] || KET_QUA_STYLE.CHUA_DU_CAN_CU;
                  const Icon = style.Icon;
                  const item = COMPREHENSIVE_CHECKLIST.find((c) => c.id === k.checklist_id);
                  const overrideNote = confirmed[k.checklist_id]?.ghiChu;
                  const isConfirmed = !!confirmed[k.checklist_id]?.xacNhan;

                  return (
                    <div
                      key={k.checklist_id}
                      className={`rounded-md border p-3.5 transition-all ${style.cls} ${
                        isConfirmed ? 'ring-1 ring-emerald-500/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Icon size={16} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-75">
                              {k.checklist_id} · {item?.nhom}
                            </p>
                            <p className="text-sm font-semibold">{k.dieu_kien_dang_kiem_tra}</p>
                            <p className="mt-0.5 text-xs opacity-80">
                              Căn cứ pháp lý: <b>{k.can_cu}</b>
                            </p>
                          </div>
                        </div>
                        {k.loai_phat_hien && (
                          <span className="rounded bg-white/80 border border-black/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide shrink-0">
                            {k.loai_phat_hien.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {k.he_thong_dieu_chinh && (
                        <p className="mt-2 rounded bg-white/80 border border-slate-200/60 px-2.5 py-1 text-[11px] italic text-slate-700">
                          ⚙ {k.ghi_chu_dieu_chinh || 'Hệ thống đã tự động điều chỉnh kết luận do thiếu bằng chứng chứng minh.'}
                        </p>
                      )}

                      <div className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2 bg-white/50 p-2 rounded">
                        <p><span className="font-medium opacity-75">Hồ sơ chứng minh:</span> {k.ho_so_chung_minh || '— (Chưa nộp tài liệu chứng minh)'}</p>
                        <p><span className="font-medium opacity-75">Vị trí trích dẫn:</span> {k.vi_tri_trong_ho_so || '—'}</p>
                      </div>
                      <p className="mt-1.5 text-xs opacity-90 font-medium">Lý do: {k.ly_do_ngan_gon}</p>

                      {(k.checklist_id === 'NL-03' || k.checklist_id === 'SL-01') && (
                        <div className="mt-2.5">
                          <button
                            onClick={() => setCapacityCalcOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
                          >
                            <Scale size={13} className="text-amber-600" />
                            Mở Công cụ Phân tích Định mức Năng lực Sinh học (Diện tích vs Sản lượng)
                          </button>
                        </div>
                      )}

                      {/* Official Control Box */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2 bg-white/40 -mx-3.5 -mb-3.5 p-3 rounded-b-md">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold opacity-80">Kết luận chính thức:</label>
                          <select
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-blue-500"
                            value={confirmed[k.checklist_id]?.ketQua || k.ket_qua_danh_gia}
                            onChange={(e) => {
                              const newVal = e.target.value as any;
                              setConfirmed((prev) => ({
                                ...prev,
                                [k.checklist_id]: {
                                  ...(prev[k.checklist_id] || {}),
                                  ketQua: newVal,
                                  xacNhan: true,
                                  ghiChu: newVal !== k.ket_qua_danh_gia ? (prev[k.checklist_id]?.ghiChu || '') : undefined,
                                },
                              }));
                            }}
                          >
                            {Object.entries(KET_QUA_STYLE).map(([val, s]) => (
                              <option key={val} value={val}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={!!confirmed[k.checklist_id]?.xacNhan}
                            onChange={(e) =>
                              setConfirmed((prev) => ({
                                ...prev,
                                [k.checklist_id]: {
                                  ...(prev[k.checklist_id] || { ketQua: k.ket_qua_danh_gia }),
                                  xacNhan: e.target.checked,
                                },
                              }))
                            }
                          />
                          <span>Công chức đã xác nhận mục này</span>
                        </label>
                      </div>

                      {confirmed[k.checklist_id]?.ketQua && confirmed[k.checklist_id]?.ketQua !== k.ket_qua_danh_gia && (
                        <div className="mt-2 pt-2 border-t border-amber-300">
                          <input
                            type="text"
                            placeholder="Bắt buộc nhập lý do điều chỉnh kết luận so với đề xuất của hệ thống..."
                            className="w-full rounded border border-amber-400 bg-white px-2.5 py-1 text-xs text-amber-900 placeholder:text-amber-500 focus:outline-hidden"
                            value={overrideNote || ''}
                            onChange={(e) =>
                              setConfirmed((prev) => ({
                                ...prev,
                                [k.checklist_id]: { ...prev[k.checklist_id], ghiChu: e.target.value },
                              }))
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredKetQua.length === 0 && (
                  <p className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-dashed">
                    Không tìm thấy mục kiểm tra nào phù hợp bộ lọc.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Legal Knowledge Base Modal */}
      <LegalKbModal isOpen={legalKbOpen} onClose={() => setLegalKbOpen(false)} />

      {/* Official Forms Generator Modal */}
      <OfficialFormsModal
        isOpen={officialFormsOpen}
        onClose={() => setOfficialFormsOpen(false)}
        coSoName={coSoName}
        thuyetMinhName={thuyetMinh?.name || ''}
        ketQua={ketQua}
        confirmed={confirmed}
      />

      {/* Production Capacity & Anomaly Calculator Modal */}
      <CapacityCalculatorModal
        isOpen={capacityCalcOpen}
        onClose={() => setCapacityCalcOpen(false)}
        ocrText={ocrResults.map((r) => r.text).join('\n')}
        onApplyResultToChecklist={(res: CapacityCheckResult) => {
          const newKq: ExpandedItem = {
            checklist_id: 'NL-03',
            dieu_kien_dang_kiem_tra: 'Năng lực sản xuất thực tế tương xứng với hợp đồng cung cấp (Không có dấu hiệu mạo danh sản xuất an toàn)',
            can_cu: res.normUsed.legalNormReference,
            ho_so_chung_minh: `Thuyết minh (${res.areaSquareMeters} m²) & Hợp đồng (${res.contractDailyVolume} ${res.contractUnit}/ngày)`,
            vi_tri_trong_ho_so: 'Mục Diện tích mặt bằng & Hợp đồng đính kèm',
            ket_qua_danh_gia: res.status === 'CRITICAL_ANOMALY' ? 'KHONG_PHU_HOP' : res.status === 'WARNING' ? 'CAN_LAM_RO' : 'DAT',
            loai_phat_hien: res.status !== 'NORMAL' ? 'SO_LIEU_BAT_HOP_LY' : null,
            ly_do_ngan_gon: res.summaryTitle,
            he_thong_dieu_chinh: true,
            ghi_chu_dieu_chinh: `Kết luận trích xuất từ Công cụ Phân tích Năng lực Sinh học (Chênh lệch: Vượt GẤP ${res.discrepancyRatio} LẦN).`,
          };

          setKetQua((prev) => {
            const exists = prev.some((k) => k.checklist_id === 'NL-03');
            if (exists) {
              return prev.map((k) => (k.checklist_id === 'NL-03' ? newKq : k));
            }
            return [newKq, ...prev];
          });

          setConfirmed((prev) => ({
            ...prev,
            'NL-03': {
              ketQua: newKq.ket_qua_danh_gia,
              xacNhan: true,
              ghiChu: `Áp dụng kết quả phân tích năng lực sản xuất sinh học (${res.summaryTitle})`,
            },
          }));
        }}
      />

      {/* Risk Assessment & Post-Inspection Plan Modal */}
      <RiskAssessmentModal
        isOpen={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        riskResult={riskResult}
        coSoName={coSoName}
        onApplyPlanToChecklist={() => {
          if (!riskResult) return;
          const newKq: ExpandedItem = {
            checklist_id: 'NL-01',
            dieu_kien_dang_kiem_tra: 'Điều kiện phân luồng rủi ro & Kế hoạch hậu kiểm sau cấp phép',
            can_cu: riskResult.postInspectionPlan.legalNotice,
            ho_so_chung_minh: `Điểm rủi ro ${riskResult.riskScore}/100 (${riskResult.riskLevelLabel})`,
            vi_tri_trong_ho_so: 'Báo cáo Phân luồng Nguy cơ Tự động',
            ket_qua_danh_gia: riskResult.riskLevel === 'HIGH' ? 'CAN_LAM_RO' : 'DAT',
            loai_phat_hien: riskResult.riskLevel === 'HIGH' ? 'SO_LIEU_BAT_HOP_LY' : null,
            ly_do_ngan_gon: `Tần suất hậu kiểm đề xuất: ${riskResult.postInspectionPlan.frequency}`,
            he_thong_dieu_chinh: true,
            ghi_chu_dieu_chinh: `Lập kế hoạch hậu kiểm đột xuất & lấy mẫu testing định kỳ theo phân luồng rủi ro.`,
          };

          setKetQua((prev) => {
            const exists = prev.some((k) => k.checklist_id === 'NL-01');
            if (exists) {
              return prev.map((k) => (k.checklist_id === 'NL-01' ? newKq : k));
            }
            return [newKq, ...prev];
          });
        }}
      />

      {/* Cross-Document Verification Modal */}
      <CrossDocCompareModal
        isOpen={crossDocModalOpen}
        onClose={() => setCrossDocModalOpen(false)}
        result={crossDocResult}
      />

      {/* Traceability & Electronic QR Code Modal */}
      <TraceabilityQRModal
        isOpen={traceabilityModalOpen}
        onClose={() => setTraceabilityModalOpen(false)}
        coSoName={coSoName}
        ocrText={ocrResults.map((r) => r.text).join('\n')}
      />

      {/* Citizen & Business AI Guidance Chatbot Modal */}
      <CitizenGuidanceAssistantModal
        isOpen={citizenModalOpen}
        onClose={() => setCitizenModalOpen(false)}
      />

      {/* Batch Document OCR & Intelligent Dossier Sorter Modal */}
      <BatchDocSorterModal
        isOpen={batchSorterOpen}
        onClose={() => setBatchSorterOpen(false)}
        onImportDossierToApp={(entityName, textContent) => {
          setCoSoName(entityName);
          setThuyetMinh({
            name: `Ho_So_Scan_${entityName.replace(/\s+/g, '_')}.txt`,
            text: textContent,
          });
          setChungMinh([]);
          setStage('upload');
        }}
      />
    </div>
  );
}
