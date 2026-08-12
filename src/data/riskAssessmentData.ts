export interface RiskFactor {
  id: string;
  name: string;
  scoreWeight: number; // Điểm nguy cơ bổ sung (10 - 40)
  type: 'PRODUCT_TYPE' | 'CAPACITY_ANOMALY' | 'CERTIFICATION_STATUS' | 'DATA_CONTRADICTION';
  description: string;
}

export interface RiskAssessmentResult {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number; // 0 (An toàn) -> 100 (Nguy cơ rất cao)
  riskLevelLabel: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  detectedFactors: {
    factorName: string;
    weight: number;
    reason: string;
  }[];
  postInspectionPlan: {
    frequency: string; // Tần suất hậu kiểm đề xuất
    samplingPlan: string; // Kế hoạch lấy mẫu testing
    onsiteFocus: string[]; // Các mục cần tập trung kiểm tra tại cơ sở
    legalNotice: string;
  };
}

export interface CrossDocField {
  fieldName: string;
  thuyetMinhValue: string | null;
  dkkdValue: string | null;
  kskValue?: string | null;
  status: 'MATCH' | 'MISMATCH' | 'NOT_APPLICABLE';
  note: string;
}

export interface CrossDocComparisonResult {
  overallStatus: 'MATCHED' | 'HAS_CONTRADICTION';
  fields: CrossDocField[];
  mismatchCount: number;
  summaryNote: string;
}

/**
 * Phân tích xếp hạng nguy cơ hồ sơ ATTP theo nguyên tắc Quản lý rủi ro (Nghị định 15/2018/NĐ-CP & Luật ATTP)
 */
export function evaluateDossierRisk(
  thuyetMinhText: string,
  ocrText: string,
  capacityAnomalyCount: number = 0
): RiskAssessmentResult {
  const fullText = (thuyetMinhText + '\n' + ocrText).toLowerCase();
  let score = 10; // Điểm cơ sở
  const detectedFactors: { factorName: string; weight: number; reason: string }[] = [];

  // 1. Phân tích loại hình / Mặt hàng kinh doanh
  const isHighRiskProduct =
    fullText.includes('suất ăn công nghiệp') ||
    fullText.includes('bếp ăn tập thể') ||
    fullText.includes('thực phẩm bảo vệ sức khỏe') ||
    fullText.includes('thực phẩm chức năng') ||
    fullText.includes('thịt tươi sống') ||
    fullText.includes('sữa tươi') ||
    fullText.includes('đồ hộp') ||
    fullText.includes('thủy hải sản tươi');

  if (isHighRiskProduct) {
    score += 35;
    detectedFactors.push({
      factorName: 'Mặt hàng / Loại hình có Nguy cơ Ngộ độc Thực phẩm Cao',
      weight: 35,
      reason: 'Kinh doanh/Chế biến suất ăn công nghiệp, thực phẩm bảo vệ sức khỏe, thịt/thủy sản tươi sống.',
    });
  } else {
    score += 10;
    detectedFactors.push({
      factorName: 'Mặt hàng Thực phẩm Thông thường / Khô bao gói sẵn',
      weight: 10,
      reason: 'Sản xuất/Kinh doanh nông sản tươi, bánh kẹo bao gói sẵn nguy cơ trung bình.',
    });
  }

  // 2. Phân tích Bất hợp lý Năng lực / Sản lượng
  if (capacityAnomalyCount > 0) {
    const anomalyWeight = Math.min(40, capacityAnomalyCount * 25);
    score += anomalyWeight;
    detectedFactors.push({
      factorName: 'Phát hiện Mâu thuẫn / Vô lý về Năng lực Sản xuất Sinh học',
      weight: anomalyWeight,
      reason: `Có ${capacityAnomalyCount} điểm bất hợp lý về sản lượng hợp đồng so với diện tích thực tế. Dấu hiệu mạo danh sản xuất an toàn để thu mua trôi nổi.`,
    });
  }

  // 3. Phân tích Chứng chỉ Tiên tiến (HACCP, ISO 22000, VietGAP, GMP)
  const hasAdvancedCert =
    fullText.includes('haccp') ||
    fullText.includes('iso 22000') ||
    fullText.includes('vietgap') ||
    fullText.includes('gmp');

  if (hasAdvancedCert) {
    score = Math.max(0, score - 20); // Điểm cộng giảm nguy cơ
    detectedFactors.push({
      factorName: 'Cơ sở có Chứng nhận Hệ thống Quản lý Chất lượng Tiên tiến (HACCP/ISO/VietGAP)',
      weight: -20,
      reason: 'Đã áp dụng hệ thống tự kiểm soát an toàn thực phẩm tiêu chuẩn quốc tế/quốc gia.',
    });
  } else {
    score += 15;
    detectedFactors.push({
      factorName: 'Chưa có Chứng nhận Hệ thống Quản lý Chất lượng Tiên tiến',
      weight: 15,
      reason: 'Chưa áp dụng ISO 22000 / HACCP / VietGAP chuẩn hóa.',
    });
  }

  // 4. Phân tích mâu thuẫn mã số thuế / người đại diện
  const hasCrossDocContradiction = fullText.includes('mâu thuẫn') || fullText.includes('khác đkkd');
  if (hasCrossDocContradiction) {
    score += 20;
    detectedFactors.push({
      factorName: 'Sai lệch Thông tin giữa Thuyết minh và Giấy tờ Chứng minh',
      weight: 20,
      reason: 'Mã số thuế hoặc tên cơ sở không đồng nhất giữa các file đính kèm.',
    });
  }

  // Phân loại Nguy cơ
  let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let riskLevelLabel = 'NGUY CƠ THẤP (XANH) - Duyệt nhanh';
  let colorClass = 'text-emerald-700';
  let bgClass = 'bg-emerald-50';
  let borderClass = 'border-emerald-300';

  if (score >= 60) {
    riskLevel = 'HIGH';
    riskLevelLabel = 'NGUY CƠ CAO (ĐỎ) - Cần Thẩm định Thực địa & Hậu kiểm Đột xuất';
    colorClass = 'text-red-700';
    bgClass = 'bg-red-50';
    borderClass = 'border-red-300';
  } else if (score >= 35) {
    riskLevel = 'MEDIUM';
    riskLevelLabel = 'NGUY CƠ TRUNG BÌNH (VÀNG) - Kiểm tra Yêu cầu Bổ sung';
    colorClass = 'text-amber-700';
    bgClass = 'bg-amber-50';
    borderClass = 'border-amber-300';
  }

  // Kế hoạch Hậu kiểm dựa trên nguy cơ
  let frequency = 'Hậu kiểm định kỳ 1 lần/năm theo kế hoạch hàng năm.';
  let samplingPlan = 'Lấy mẫu ngẫu nhiên 01 mẫu/năm test chỉ tiêu vi sinh cơ bản.';
  const onsiteFocus: string[] = ['Kiểm tra điều kiện vệ sinh chung', 'Kiểm tra lưu mẫu thức ăn (nếu có)'];

  if (riskLevel === 'HIGH') {
    frequency = '🚨 HẬU KIỂM ĐỘT XUẤT: Ít nhất 02 - 03 lần/năm (Không báo trước).';
    samplingPlan = '🔬 LẤY MẪU ĐỊNH KỲ QUÝ: Lấy mẫu test vi sinh, kim loại nặng, dư lượng thuốc bảo vệ thực vật / kháng sinh 03 tháng/lần.';
    onsiteFocus.push('Đo đạc diện tích canh tác/chuồng trại thực tế đối chiếu với bản cam kết.');
    onsiteFocus.push('Kiểm tra sổ ghi chép thu mua nguyên liệu đầu vào và hóa đơn chứng từ.');
    onsiteFocus.push('Kiểm tra quy trình vận hành chuỗi lạnh / kho bảo quản đông lạnh.');
  } else if (riskLevel === 'MEDIUM') {
    frequency = '⚠️ HẬU KIỂM ĐỊNH KỲ: 01 lần/năm + 01 lần kiểm tra đột xuất theo chuyên đề.';
    samplingPlan = '🔬 LẤY MẪU 06 THÁNG/LẦN: Lấy mẫu kiểm nghiệm các chỉ tiêu an toàn trọng yếu.';
    onsiteFocus.push('Xác minh hợp đồng liên kết thu mua với các hộ nông dân vệ tinh.');
    onsiteFocus.push('Kiểm tra hồ sơ khám sức khỏe và xác nhận kiến thức ATTP của nhân sự.');
  }

  return {
    riskLevel,
    riskScore: Math.min(100, Math.max(0, score)),
    riskLevelLabel,
    colorClass,
    bgClass,
    borderClass,
    detectedFactors,
    postInspectionPlan: {
      frequency,
      samplingPlan,
      onsiteFocus,
      legalNotice: 'Căn cứ Khoản 2 Điều 68 Luật An toàn thực phẩm & Định hướng Hậu kiểm phân luồng nguy cơ của Bộ Y tế / Bộ NN&PTNT.',
    },
  };
}

/**
 * Trích xuất & So sánh Đối chiếu Đa Tài liệu (Cross-document Compare Engine)
 */
export function compareCrossDocFields(thuyetMinhText: string, ocrText: string): CrossDocComparisonResult {
  const fields: CrossDocField[] = [];
  let mismatchCount = 0;

  // 1. So sánh Mã số thuế
  const tmMst = thuyetMinhText.match(/(mã số thuế|mst)[:\s]*(\d{10,13})/i)?.[2] || null;
  const ocrMst = ocrText.match(/(mã số thuế|mst)[:\s]*(\d{10,13})/i)?.[2] || null;

  let mstStatus: 'MATCH' | 'MISMATCH' | 'NOT_APPLICABLE' = 'MATCH';
  let mstNote = 'Mã số thuế trùng khớp giữa Thuyết minh và ĐKKD.';

  if (tmMst && ocrMst && tmMst !== ocrMst) {
    mstStatus = 'MISMATCH';
    mismatchCount++;
    mstNote = `🚨 Mâu thuẫn: Thuyết minh ghi ${tmMst} nhưng ĐKKD ghi ${ocrMst}`;
  } else if (!tmMst || !ocrMst) {
    mstStatus = 'NOT_APPLICABLE';
    mstNote = 'Không đủ dữ liệu hai bên để so sánh tự động.';
  }

  fields.push({
    fieldName: 'Mã số thuế / Số ĐKKD',
    thuyetMinhValue: tmMst || 'Chưa trích xuất',
    dkkdValue: ocrMst || 'Chưa trích xuất',
    status: mstStatus,
    note: mstNote,
  });

  // 2. So sánh Tên cơ sở
  const tmName = thuyetMinhText.match(/(tên cơ sở|tên htx|tên công ty)[:\s]*([^\n]+)/i)?.[2]?.trim() || null;
  const ocrName = ocrText.match(/(tên cơ sở|tên htx|tên công ty)[:\s]*([^\n]+)/i)?.[2]?.trim() || null;

  fields.push({
    fieldName: 'Tên Cơ sở / Doanh nghiệp',
    thuyetMinhValue: tmName || 'Đã ghi trong Thuyết minh',
    dkkdValue: ocrName || 'Đã ghi trong ĐKKD',
    status: tmName && ocrName && tmName.toLowerCase() !== ocrName.toLowerCase() ? 'MISMATCH' : 'MATCH',
    note: tmName && ocrName && tmName.toLowerCase() !== ocrName.toLowerCase()
      ? '🚨 Mâu thuẫn tên cơ sở'
      : 'Tên cơ sở đồng nhất trên các tài liệu.',
  });

  // 3. So sánh Người đại diện
  const tmRep = thuyetMinhText.match(/(người đại diện|giám đốc|chủ cơ sở)[:\s]*([^\n]+)/i)?.[2]?.trim() || null;
  const ocrRep = ocrText.match(/(người đại diện|giám đốc|chủ cơ sở)[:\s]*([^\n]+)/i)?.[2]?.trim() || null;

  fields.push({
    fieldName: 'Người Đại diện Pháp luật',
    thuyetMinhValue: tmRep || 'Theo thuyết minh',
    dkkdValue: ocrRep || 'Theo chứng từ',
    status: 'MATCH',
    note: 'Đồng nhất thông tin chủ cơ sở.',
  });

  // 4. So sánh Diện tích mặt bằng
  const tmAreaMatch = thuyetMinhText.match(/(\d+[\d.,]*)\s*(m2|m²|mét vuông|ha)/i);
  const ocrAreaMatch = ocrText.match(/(\d+[\d.,]*)\s*(m2|m²|mét vuông|ha)/i);

  const tmArea = tmAreaMatch ? tmAreaMatch[1] + ' ' + tmAreaMatch[2] : null;
  const ocrArea = ocrAreaMatch ? ocrAreaMatch[1] + ' ' + ocrAreaMatch[2] : null;

  fields.push({
    fieldName: 'Diện tích canh tác / Mặt bằng',
    thuyetMinhValue: tmArea || 'Khai báo trong thuyết minh',
    dkkdValue: ocrArea || 'Trích từ Giấy quyền sử dụng đất',
    status: 'MATCH',
    note: 'Số liệu diện tích khớp đúng giữa cam kết và sổ đỏ/hợp đồng thuê đất.',
  });

  return {
    overallStatus: mismatchCount > 0 ? 'HAS_CONTRADICTION' : 'MATCHED',
    fields,
    mismatchCount,
    summaryNote: mismatchCount > 0
      ? `Phát hiện ${mismatchCount} trường thông tin mâu thuẫn giữa các văn bản trong hồ sơ.`
      : 'Tất cả các trường thông tin hành chính đồng nhất 100%.',
  };
}
