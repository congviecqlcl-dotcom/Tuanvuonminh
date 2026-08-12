export interface ProductionNorm {
  id: string;
  categoryName: string;
  group: 'CROP' | 'LIVESTOCK' | 'AQUACULTURE';
  unitArea: string; // m2, con, ao
  yieldPerCropPerM2: number; // kg/m2/vụ
  cropsPerYear: number; // số vụ/năm
  avgDailyYieldPerM2: number; // kg/m2/ngày
  maxVarietiesPer100m2: number; // Số chủng loại tối đa trồng/nuôi được trên 100m2
  description: string;
  legalNormReference: string;
}

export const PRODUCTION_NORMS: ProductionNorm[] = [
  {
    id: 'RAU_AN_LA',
    categoryName: 'Rau ăn lá (Cải, Xà lách, Rau muống, Mùng tơi...)',
    group: 'CROP',
    unitArea: 'm²',
    yieldPerCropPerM2: 2.0, // 20 tấn/ha/vụ = 2 kg/m2/vụ
    cropsPerYear: 6, // 6 vụ/năm (mỗi vụ 35-45 ngày)
    avgDailyYieldPerM2: 0.033, // ~12 kg/m2/năm -> 0.033 kg/m2/ngày
    maxVarietiesPer100m2: 2,
    description: 'Trồng đất ngoài trời hoặc nhà lưới đơn giản. Năng suất trung bình 18-22 tấn/ha/vụ.',
    legalNormReference: 'Quyết định định mức KT-KT Trồng trọt - Bộ NN&PTNT / Niên giám Thống kê Nông nghiệp',
  },
  {
    id: 'RAU_AN_QUA',
    categoryName: 'Rau ăn quả (Cà chua, Dưa leo, Ớt, Bí đao, Khổ qua)',
    group: 'CROP',
    unitArea: 'm²',
    yieldPerCropPerM2: 3.5, // 35 tấn/ha/vụ
    cropsPerYear: 3,
    avgDailyYieldPerM2: 0.029, // ~10.5 kg/m2/năm
    maxVarietiesPer100m2: 1,
    description: 'Cần giàn leo và thời gian sinh trưởng 70-90 ngày/vụ.',
    legalNormReference: 'Quy trình kỹ thuật VietGAP Trồng trọt - Bộ NN&PTNT',
  },
  {
    id: 'CU_QUA',
    categoryName: 'Củ nông nghiệp (Củ cải, Cà rốt, Khoai lang, Khoai tây)',
    group: 'CROP',
    unitArea: 'm²',
    yieldPerCropPerM2: 2.5, // 25 tấn/ha/vụ
    cropsPerYear: 3,
    avgDailyYieldPerM2: 0.02,
    maxVarietiesPer100m2: 1,
    description: 'Thời gian sinh trưởng dài 80-100 ngày/vụ, cần đất tơi xốp.',
    legalNormReference: 'Quy trình kỹ thuật canh tác củ quả an toàn',
  },
  {
    id: 'GA_THIT',
    categoryName: 'Gà thịt (Nuôi nhốt/Bán thả vườn)',
    group: 'LIVESTOCK',
    unitArea: 'm²',
    yieldPerCropPerM2: 15.0, // 6-8 con/m2 * 2.2kg = 15 kg thịt/m2/vụ
    cropsPerYear: 3, // 3.5-4 tháng/lứa
    avgDailyYieldPerM2: 0.12, // ~45 kg/m2/năm -> 0.12 kg/m2/ngày
    maxVarietiesPer100m2: 1,
    description: 'Mật độ nuôi 6-8 con/m2 chuồng hở, 10-12 con/m2 chuồng kín.',
    legalNormReference: 'Quy chuẩn kỹ thuật quốc gia QCVN 01-15:2010/BNNPTNT về điều kiện trang trại chăn nuôi gà',
  },
  {
    id: 'GA_DE_TRUNG',
    categoryName: 'Gà đẻ trứng (Trứng thương phẩm)',
    group: 'LIVESTOCK',
    unitArea: 'm²',
    yieldPerCropPerM2: 3.5, // Mật độ 4-5 con/m2. Tỷ lệ đẻ 80% = ~3.5 quả trứng/m2/ngày
    cropsPerYear: 365,
    avgDailyYieldPerM2: 3.5, // 3.5 quả trứng/m2/ngày
    maxVarietiesPer100m2: 1,
    description: 'Mật độ 4-5 con/m2. Tỷ lệ đẻ bình quân 75-85%/ngày.',
    legalNormReference: 'Quy trình chăn nuôi gà đẻ trứng an toàn sinh học - Cục Chăn nuôi',
  },
  {
    id: 'LON_THIT',
    categoryName: 'Lợn thịt (Heo thịt)',
    group: 'LIVESTOCK',
    unitArea: 'm²',
    yieldPerCropPerM2: 70.0, // 0.7 con/m2 * 100kg = 70 kg thịt/m2/vụ
    cropsPerYear: 2.2, // 4.5 - 5 tháng/lứa
    avgDailyYieldPerM2: 0.42, // ~154 kg/m2/năm
    maxVarietiesPer100m2: 1,
    description: 'Mật độ tối thiểu 1.2 - 1.5 m2/con lợn thịt.',
    legalNormReference: 'QCVN 01-14:2010/BNNPTNT về trang trại chăn nuôi lợn',
  },
  {
    id: 'TOM_THE',
    categoryName: 'Tôm thẻ chân trắng (Thủy sản công nghiệp)',
    group: 'AQUACULTURE',
    unitArea: 'm²',
    yieldPerCropPerM2: 1.5, // 15 tấn/ha/vụ = 1.5 kg/m2/vụ
    cropsPerYear: 2.5,
    avgDailyYieldPerM2: 0.01,
    maxVarietiesPer100m2: 1,
    description: 'Mật độ nuôi 80-120 con/m2 ao đất hoặc ao bạt.',
    legalNormReference: 'Quy chuẩn VietGAP Thủy sản - Cục Thủy sản',
  },
  {
    id: 'CA_RO_PHI',
    categoryName: 'Cá rô phi / Cá diêu hồng / Cá tra (Thủy sản nước ngọt)',
    group: 'AQUACULTURE',
    unitArea: 'm²',
    yieldPerCropPerM2: 20.0, // 200 tấn/ha/vụ = 20 kg/m2/vụ
    cropsPerYear: 1.5,
    avgDailyYieldPerM2: 0.08,
    maxVarietiesPer100m2: 1,
    description: 'Nuôi thâm canh ao đất hoặc lồng bè.',
    legalNormReference: 'Tiêu chuẩn kỹ thuật nuôi cá thâm canh - Cục Thủy sản',
  },
];

export interface CapacityCheckResult {
  normUsed: ProductionNorm;
  areaSquareMeters: number;
  contractDailyVolume: number; // kg/ngày hoặc quả/ngày
  contractUnit: string; // 'kg' hoặc 'quả'
  statedVarietyCount: number;
  maxFeasibleDailyVolume: number;
  maxFeasibleAnnualVolume: number;
  discrepancyRatio: number; // Tỷ lệ vượt (vd: 15.2 nghĩa là gấp 15.2 lần)
  status: 'NORMAL' | 'WARNING' | 'CRITICAL_ANOMALY';
  statusLabel: string;
  summaryTitle: string;
  detailedAnalysis: string[];
  agronomicVerdict: string;
  suggestedAction: string;
}

export function evaluateProductionCapacity(
  normId: string,
  areaSquareMeters: number,
  contractDailyVolume: number,
  contractUnit: string = 'kg',
  statedVarietyCount: number = 1
): CapacityCheckResult {
  const norm = PRODUCTION_NORMS.find((n) => n.id === normId) || PRODUCTION_NORMS[0];

  let maxFeasibleDaily = 0;
  if (norm.id === 'GA_DE_TRUNG') {
    // Với gà đẻ trứng: unit là quả/ngày
    maxFeasibleDaily = Math.round(areaSquareMeters * norm.avgDailyYieldPerM2);
  } else {
    maxFeasibleDaily = Math.round(areaSquareMeters * norm.avgDailyYieldPerM2 * 10) / 10;
  }

  const maxFeasibleAnnual = Math.round((maxFeasibleDaily * 365) / 1000 * 10) / 10; // Tấn/năm

  // Tính tỷ lệ vượt
  const discrepancyRatio = maxFeasibleDaily > 0 ? Math.round((contractDailyVolume / maxFeasibleDaily) * 10) / 10 : 0;

  // Tính khả thi về chủng loại
  const maxFeasibleVarieties = Math.max(1, Math.floor((areaSquareMeters / 100) * norm.maxVarietiesPer100m2));
  const isVarietyExceeded = statedVarietyCount > maxFeasibleVarieties;

  let status: 'NORMAL' | 'WARNING' | 'CRITICAL_ANOMALY' = 'NORMAL';
  let statusLabel = 'Hợp lý - Phù hợp năng lực sinh học';
  let summaryTitle = 'Sản lượng đăng ký phù hợp với quy mô diện tích đất / chuồng / ao.';

  if (discrepancyRatio > 3 || (discrepancyRatio > 1.5 && isVarietyExceeded)) {
    status = 'CRITICAL_ANOMALY';
    statusLabel = 'BẤT HỢP LÝ NGHIÊM TRỌNG (Dấu hiệu mạo danh sản xuất an toàn / Gom hàng trôi nổi)';
    summaryTitle = `Sản lượng đăng ký trong hợp đồng vượt quá GẤP ${discrepancyRatio} LẦN năng lực sinh học tối đa!`;
  } else if (discrepancyRatio > 1.2 || isVarietyExceeded) {
    status = 'WARNING';
    statusLabel = 'CẦN LÀM RÕ NĂNG LỰC (Có dấu hiệu quá tải hoặc kê khai bất hợp lý)';
    summaryTitle = `Sản lượng hợp đồng vượt quá 20% - ${Math.round((discrepancyRatio - 1) * 100)}% năng lực sản xuất thực tế.`;
  }

  const detailedAnalysis: string[] = [];

  // 1. Phân tích diện tích & sản lượng
  detailedAnalysis.push(
    `Diện tích khai báo: ${areaSquareMeters.toLocaleString('vi-VN')} m². Năng suất sinh học định mức ngành (${norm.legalNormReference}): khoảng ${norm.yieldPerCropPerM2} kg/m²/vụ (${norm.cropsPerYear} vụ/năm).`
  );
  detailedAnalysis.push(
    `Sản lượng tối đa khả thi tự sản xuất: ~${maxFeasibleDaily.toLocaleString('vi-VN')} ${contractUnit}/ngày (~${maxFeasibleAnnual} tấn/năm).`
  );
  detailedAnalysis.push(
    `Cam kết cung cấp theo hợp đồng: ${contractDailyVolume.toLocaleString('vi-VN')} ${contractUnit}/ngày (${(contractDailyVolume * 365 / 1000).toFixed(1)} tấn/năm).`
  );

  if (discrepancyRatio > 1) {
    detailedAnalysis.push(
      `👉 Chênh lệch: Hợp đồng vượt GẤP ${discrepancyRatio} LẦN công suất sản xuất thực tế tại mảnh đất/chuồng trại này.`
    );
  } else {
    detailedAnalysis.push(
      `✅ Công suất hợp đồng nằm trong ngưỡng an toàn sinh học (đạt ${Math.round(discrepancyRatio * 100)}% công suất tối đa).`
    );
  }

  // 2. Phân tích chủng loại
  if (norm.group === 'CROP' && statedVarietyCount > 1) {
    if (isVarietyExceeded) {
      detailedAnalysis.push(
        `🚨 Bất hợp lý chủng loại: Khai báo cung cấp ${statedVarietyCount} loại sản phẩm. Với diện tích ${areaSquareMeters} m², tối đa chỉ canh tác luân canh được ~${maxFeasibleVarieties} loại cùng lúc. Việc cam kết giao đồng thời nhiều loại rau củ trái mùa/khác họ trên diện tích hẹp là KHÔNG THỂ VỀ SINH HỌC.`
      );
    } else {
      detailedAnalysis.push(
        `Chủng loại sản phẩm: Khai báo ${statedVarietyCount} loại, phù hợp với quy mô luân canh trên diện tích ${areaSquareMeters} m².`
      );
    }
  }

  // Nhận định kỹ thuật
  let agronomicVerdict = '';
  let suggestedAction = '';

  if (status === 'CRITICAL_ANOMALY') {
    agronomicVerdict = `Cơ sở không đủ năng lực tự sản xuất khối lượng ${contractDailyVolume} ${contractUnit}/ngày trên diện tích ${areaSquareMeters} m². Rất có nguy cơ cơ sở đứng tên mã số để thu mua thực phẩm không rõ nguồn gốc ngoài thị trường/chợ đầu mối rồi dán nhãn an toàn cung cấp cho đối tác.`;
    suggestedAction = `Yêu cầu cơ sở: (1) Xuất trình hợp đồng liên kết thu mua với các hộ nông dân/hợp tác tác khác có kèm Giấy cam kết ATTP/Giấy chứng nhận VietGAP; (2) Tiến hành kiểm tra thực địa đột xuất diện tích đất và sản lượng thực tế trước khi cấp Giấy chứng nhận.`;
  } else if (status === 'WARNING') {
    agronomicVerdict = `Khối lượng hợp đồng tiệm cận hoặc vượt nhẹ định mức sinh học. Cơ sở có thể phải áp dụng thâm canh cao độ hoặc thu mua thêm một phần từ bên ngoài.`;
    suggestedAction = `Yêu cầu cơ sở làm rõ quy trình canh tác tăng vụ hoặc bổ sung hợp đồng/hóa đơn nguồn nguyên liệu thu mua ngoài (nếu có).`;
  } else {
    agronomicVerdict = `Số liệu diện tích và sản lượng cân đối hợp lý, nằm trong định mức sinh học cho phép.`;
    suggestedAction = `Hồ sơ đạt yêu cầu về năng lực sản xuất. Có thể duyệt mục này.`;
  }

  return {
    normUsed: norm,
    areaSquareMeters,
    contractDailyVolume,
    contractUnit,
    statedVarietyCount,
    maxFeasibleDailyVolume: maxFeasibleDaily,
    maxFeasibleAnnualVolume: maxFeasibleAnnual,
    discrepancyRatio,
    status,
    statusLabel,
    summaryTitle,
    detailedAnalysis,
    agronomicVerdict,
    suggestedAction,
  };
}

/**
 * Scan text to automatically detect area (m2) and daily volume (kg/ngày) if present
 */
export function autoDetectCapacityFromText(text: string): { area?: number; dailyKg?: number; varieties?: number } {
  if (!text) return {};

  let area: number | undefined;
  let dailyKg: number | undefined;
  let varieties: number | undefined;

  // Search for m2 / hecta
  const areaMatch = text.match(/(\d+[\d.,]*)\s*(m2|m²|mét vuông|hecta|ha)/i);
  if (areaMatch) {
    let num = parseFloat(areaMatch[1].replace(/\./g, '').replace(',', '.'));
    const unit = areaMatch[2].toLowerCase();
    if (unit === 'ha' || unit === 'hecta') {
      num = num * 10000;
    }
    if (num > 0) area = num;
  }

  // Search for volume kg/ngày or tấn/tháng
  const dailyMatch = text.match(/(\d+[\d.,]*)\s*(kg|ký|kilogram|cân|tấn|tạ)\s*[\/|\b](ngày|tháng|năm|ngày đêm)/i);
  if (dailyMatch) {
    let vol = parseFloat(dailyMatch[1].replace(/\./g, '').replace(',', '.'));
    const unit = dailyMatch[2].toLowerCase();
    const timeUnit = dailyMatch[3].toLowerCase();

    if (unit === 'tấn') vol = vol * 1000;
    if (unit === 'tạ') vol = vol * 100;

    if (timeUnit === 'tháng') vol = Math.round(vol / 30);
    if (timeUnit === 'năm') vol = Math.round(vol / 365);

    if (vol > 0) dailyKg = vol;
  }

  // Count mentioned vegetables/items if keywords exist
  const itemKeywords = ['cải', 'xà lách', 'muống', 'cà chua', 'dưa leo', 'ớt', 'bí', 'hành', 'ngò', 'củ cải', 'cà rốt', 'khoai'];
  const foundSet = new Set<string>();
  const lower = text.toLowerCase();
  itemKeywords.forEach((kw) => {
    if (lower.includes(kw)) foundSet.add(kw);
  });
  if (foundSet.size > 0) varieties = foundSet.size;

  return { area, dailyKg, varieties };
}

export interface DossierAnomaly {
  id: string;
  category: 'BIOLOGICAL_CAPACITY' | 'EQUIPMENT_STORAGE' | 'WORKFORCE_CAPACITY' | 'CROSS_DOC_CONTRADICTION';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  description: string;
  evidence: string;
  agronomicLegalBasis: string;
  suggestedSolution: string;
  impactedChecklistIds: string[];
}

export function scanFullDossierAnomalies(thuyetMinhText: string, chungMinhText: string): DossierAnomaly[] {
  const anomalies: DossierAnomaly[] = [];
  const fullText = (thuyetMinhText + '\n' + chungMinhText).toLowerCase();

  // 1. Kiểm tra Năng lực Sinh học (Diện tích m2 vs Sản lượng hợp đồng)
  const capacity = autoDetectCapacityFromText(thuyetMinhText + '\n' + chungMinhText);

  // Mặc định kiểm tra nhóm Rau ăn lá nếu phát hiện diện tích rau
  if (capacity.area && capacity.dailyKg) {
    const res = evaluateProductionCapacity('RAU_AN_LA', capacity.area, capacity.dailyKg, 'kg', capacity.varieties || 1);
    if (res.status === 'CRITICAL_ANOMALY') {
      anomalies.push({
        id: 'ANO-CAPACITY-01',
        category: 'BIOLOGICAL_CAPACITY',
        severity: 'CRITICAL',
        title: `Vô lý Năng lực Sản xuất: Sản lượng hợp đồng vượt GẤP ${res.discrepancyRatio} LẦN định mức sinh học!`,
        description: `Khai báo diện tích mảnh đất canh tác ${capacity.area.toLocaleString('vi-VN')} m², nhưng ký hợp đồng giao ${capacity.dailyKg.toLocaleString('vi-VN')} kg/ngày (~${(capacity.dailyKg * 365 / 1000).toFixed(1)} tấn/năm). Năng suất tối đa theo định mức Bộ NN&PTNT chỉ đạt ~${res.maxFeasibleDailyVolume} kg/ngày.`,
        evidence: `Thuyết minh ghi ${capacity.area} m²; Hợp đồng cam kết giao ${capacity.dailyKg} kg/ngày.`,
        agronomicLegalBasis: 'Quyết định Định mức KT-KT Trồng trọt & Quy trình VietGAP - Bộ NN&PTNT; Khoản 4 Điều 4 Luật ATTP 2010.',
        suggestedSolution: 'Yêu cầu cơ sở cung cấp Hợp đồng liên kết thu mua bổ sung có chứng nhận ATTP/VietGAP của các hộ vệ tinh, hoặc tiến hành thẩm định đột xuất diện tích đất thực tế trước khi cấp Giấy chứng nhận.',
        impactedChecklistIds: ['NL-03', 'SL-01', 'NL-01'],
      });
    } else if (res.status === 'WARNING') {
      anomalies.push({
        id: 'ANO-CAPACITY-02',
        category: 'BIOLOGICAL_CAPACITY',
        severity: 'WARNING',
        title: 'Cảnh báo Sản lượng: Sản lượng ký kết sát trần hoặc vượt nhẹ quy mô đất canh tác',
        description: `Sản lượng cam kết ${capacity.dailyKg} kg/ngày tiệm cận mức thâm canh tối đa trên diện tích ${capacity.area} m². Cần làm rõ khả năng quay vòng vụ gieo trồng.`,
        evidence: `Diện tích ${capacity.area} m², sản lượng hợp đồng ${capacity.dailyKg} kg/ngày.`,
        agronomicLegalBasis: 'Định mức kỹ thuật trồng trọt nông nghiệp.',
        suggestedSolution: 'Giải trình quy trình tăng vụ, bón phân vi sinh thâm canh hoặc hóa đơn nhập hạt giống.',
        impactedChecklistIds: ['NL-03'],
      });
    }

    // Kiểm tra số chủng loại quá nhiều trên diện tích hẹp
    if (capacity.varieties && capacity.varieties > 5 && capacity.area < 500) {
      anomalies.push({
        id: 'ANO-VARIETY-01',
        category: 'BIOLOGICAL_CAPACITY',
        severity: 'CRITICAL',
        title: `Vô lý Chủng loại: Cam kết giao đồng thời ${capacity.varieties} loại rau củ trên diện tích chỉ ${capacity.area} m²`,
        description: `Với diện tích ${capacity.area} m², việc bố trí lô thửa để thu hoạch đồng thời ${capacity.varieties} loại rau củ quả (có loại khác họ, khác mùa vụ) là không khả thi về sinh học và thổ nhưỡng.`,
        evidence: `Khai báo cung cấp ${capacity.varieties} chủng loại sản phẩm trên ${capacity.area} m² đất.`,
        agronomicLegalBasis: 'Quy chuẩn sinh học canh tác luân canh nông nghiệp.',
        suggestedSolution: 'Yêu cầu cơ sở liệt kê sơ đồ phân lô thửa canh tác chi tiết hoặc chứng minh nguồn thu mua ngoài.',
        impactedChecklistIds: ['NL-03'],
      });
    }
  }

  // 2. Kiểm tra Bất hợp lý Nhân lực / Công suất bếp ăn / chế biến
  const hasSuatAn = fullText.match(/(\d+[\d.,]*)\s*(suất|phần|khẩu phần)\s*[\/|\b](ngày|bữa)/i);
  const hasNhanSu = fullText.match(/(\d+)\s*(lao động|nhân sự|người|công nhân|đầu bếp)/i);
  if (hasSuatAn && hasNhanSu) {
    const suat = parseInt(hasSuatAn[1].replace(/\./g, ''));
    const nhanSu = parseInt(hasNhanSu[1]);
    const suatNguoiRatio = suat / (nhanSu || 1);

    if (suat > 300 && suatNguoiRatio > 250) {
      anomalies.push({
        id: 'ANO-WORKFORCE-01',
        category: 'WORKFORCE_CAPACITY',
        severity: 'CRITICAL',
        title: `Vô lý Quy mô Nhân sự: ${nhanSu} lao động chế biến ${suat.toLocaleString('vi-VN')} suất ăn/ngày`,
        description: `Định mức công suất chế biến bếp ăn tập thể thông thường là 50-80 suất ăn/lao động/ngày. Việc chỉ có ${nhanSu} nhân sự phục vụ ${suat} suất ăn/ngày (tỷ lệ 1:${Math.round(suatNguoiRatio)}) là vượt quá khả năng lao động an toàn, dễ gây nhiễm khuẩn chéo.`,
        evidence: `Bản thuyết minh khai báo ${suat} suất ăn/ngày nhưng danh sách nhân sự chỉ có ${nhanSu} người.`,
        agronomicLegalBasis: 'Quy chuẩn kỹ thuật vệ sinh bếp ăn tập thể & An toàn lao động ngành Chế biến Thực phẩm.',
        suggestedSolution: 'Yêu cầu cơ sở bổ sung hợp đồng lao động, danh sách nhân viên sơ chế, chia suất ăn hoặc giảm định mức công suất đăng ký.',
        impactedChecklistIds: ['NS-01', 'NL-01'],
      });
    }
  }

  // 3. Kiểm tra Bất hợp lý Cấp đông / Kho lạnh đối với thực phẩm đông lạnh
  const isDongLanh = fullText.includes('đông lạnh') || fullText.includes('cấp đông') || fullText.includes('thủy hải sản tươi sống');
  const hasKhoLanh = fullText.includes('kho lạnh') || fullText.includes('tủ đông') || fullText.includes('xe lạnh');
  if (isDongLanh && !hasKhoLanh) {
    anomalies.push({
      id: 'ANO-EQUIPMENT-01',
      category: 'EQUIPMENT_STORAGE',
      severity: 'CRITICAL',
      title: 'Thiếu Thiết bị Bảo quản Đông lạnh chuyên dụng đối với Mặt hàng Đông lạnh',
      description: 'Cơ sở đăng ký kinh doanh/sản xuất thực phẩm đông lạnh nhưng trong danh mục trang thiết bị không có Kho lạnh, Tủ đông công nghiệp hoặc Xe lạnh vận chuyển bảo quản nhiệt độ âm (≤ -18°C).',
      evidence: 'Hồ sơ khai báo sản phẩm đông lạnh nhưng danh mục thiết bị thiếu kho lạnh/tủ đông.',
      agronomicLegalBasis: 'Điều 10, 18 Luật An toàn thực phẩm 2010 về bảo quản chuỗi lạnh thực phẩm.',
      suggestedSolution: 'Bổ sung hóa đơn mua sắm/hợp đồng thuê kho lạnh, tủ đông chuyên dụng và nhật ký theo dõi nhiệt độ bảo quản.',
      impactedChecklistIds: ['TB-01', 'CL-01'],
    });
  }

  // 4. Kiểm tra Mâu thuẫn thông tin giữa các Giấy tờ (Cross-document inconsistency)
  const hasMst1 = thuyetMinhText.match(/mã số thuế[:\s]*(\d{10,13})/i);
  const hasMst2 = chungMinhText.match(/mã số thuế[:\s]*(\d{10,13})/i);
  if (hasMst1 && hasMst2 && hasMst1[1] !== hasMst2[1]) {
    anomalies.push({
      id: 'ANO-CROSS-MST',
      category: 'CROSS_DOC_CONTRADICTION',
      severity: 'CRITICAL',
      title: `Mâu thuẫn Mã số thuế: Thuyết minh (${hasMst1[1]}) khác ĐKKD (${hasMst2[1]})`,
      description: 'Mã số thuế ghi trên Bản thuyết minh không khớp với Mã số thuế ghi trên Giấy chứng nhận Đăng ký kinh doanh đính kèm.',
      evidence: `Thuyết minh: ${hasMst1[1]} vs GCN ĐKKD: ${hasMst2[1]}.`,
      agronomicLegalBasis: 'Quy định tính pháp lý của Hồ sơ hành chính.',
      suggestedSolution: 'Yêu cầu cơ sở chỉnh sửa lại Bản thuyết minh cho đồng nhất với Giấy đăng ký kinh doanh.',
      impactedChecklistIds: ['PL-01'],
    });
  }

  return anomalies;
}

/* ==========================================================================
   ĐÁNH GIÁ NĂNG LỰC CON NGƯỜI (NHÂN SỰ & LAO ĐỘNG) THEO LOẠI HÌNH VÀ QUY MÔ
   ========================================================================== */

export type OperationType = 'SAN_XUAT' | 'SO_CHE' | 'CHE_BIEN' | 'KINH_DOANH';
export type OperationScale = 'NHO_LE' | 'VUA' | 'LON';

export interface HumanCapacityInput {
  operationType: OperationType;
  scale: OperationScale;
  totalWorkers: number;
  hasTechnicalOfficer: boolean; // Có cán bộ kỹ thuật / QC / Thú y / Bếp trưởng / Kỹ sư CNTP
  healthCheckRatio: number; // 0 - 100%
  attpTrainedRatio: number; // 0 - 100%
  dailyCapacityVolume: number; // Khối lượng kg/ngày hoặc số suất ăn/ngày
  unitLabel?: string;
}

export interface HumanCapacityResult {
  operationTypeLabel: string;
  scaleLabel: string;
  totalWorkers: number;
  requiredMinWorkers: number;
  maxRecommendedDailyVolumePerWorker: number;
  actualVolumePerWorker: number;
  status: 'PASS' | 'WARNING' | 'CRITICAL_DEFICIT';
  statusLabel: string;
  summaryTitle: string;
  detailedAnalysis: string[];
  legalBasis: string;
  actionPlan: string;
}

export function evaluateHumanCapacity(input: HumanCapacityInput): HumanCapacityResult {
  const {
    operationType,
    scale,
    totalWorkers,
    hasTechnicalOfficer,
    healthCheckRatio,
    attpTrainedRatio,
    dailyCapacityVolume,
    unitLabel = 'kg/ngày'
  } = input;

  let operationTypeLabel = '';
  let scaleLabel = '';
  let requiredMinWorkers = 2;
  let maxRecommendedDailyVolumePerWorker = 200; // Định mức trung bình 1 công nhân/ngày

  // 1. Xác định Nhãn & Định mức theo Loại hình và Quy mô
  switch (operationType) {
    case 'SAN_XUAT':
      operationTypeLabel = 'Sản xuất (Trồng trọt, Chăn nuôi, Nuôi trồng Thủy sản)';
      if (scale === 'NHO_LE') {
        scaleLabel = 'Nhỏ lẻ / Hộ gia đình';
        requiredMinWorkers = 1;
        maxRecommendedDailyVolumePerWorker = 200;
      } else if (scale === 'VUA') {
        scaleLabel = 'Quy mô Vừa (Trang trại / HTX vừa)';
        requiredMinWorkers = 4;
        maxRecommendedDailyVolumePerWorker = 300;
      } else {
        scaleLabel = 'Quy mô Lớn / Công nghiệp';
        requiredMinWorkers = 10;
        maxRecommendedDailyVolumePerWorker = 450;
      }
      break;

    case 'SO_CHE':
      operationTypeLabel = 'Sơ chế, Phân loại & Đóng gói Thực phẩm';
      if (scale === 'NHO_LE') {
        scaleLabel = 'Nhỏ lẻ / Cơ sở sơ chế thủ công';
        requiredMinWorkers = 2;
        maxRecommendedDailyVolumePerWorker = 180;
      } else if (scale === 'VUA') {
        scaleLabel = 'Quy mô Vừa (Nhà sơ chế trung tâm)';
        requiredMinWorkers = 5;
        maxRecommendedDailyVolumePerWorker = 350;
      } else {
        scaleLabel = 'Quy mô Lớn (Xưởng sơ chế tự động/Bán tự động)';
        requiredMinWorkers = 12;
        maxRecommendedDailyVolumePerWorker = 600;
      }
      break;

    case 'CHE_BIEN':
      operationTypeLabel = 'Chế biến Thực phẩm / Bếp ăn Tập thể / Suất ăn Công nghiệp';
      if (scale === 'NHO_LE') {
        scaleLabel = 'Nhỏ lẻ (Bếp ăn nhỏ < 100 suất/ngày hoặc xưởng thủ công)';
        requiredMinWorkers = 2;
        maxRecommendedDailyVolumePerWorker = 60; // 60 suất hoặc 60kg/người
      } else if (scale === 'VUA') {
        scaleLabel = 'Quy mô Vừa (Bếp ăn 100 - 500 suất/ngày hoặc xưởng chế biến vừa)';
        requiredMinWorkers = 6;
        maxRecommendedDailyVolumePerWorker = 75;
      } else {
        scaleLabel = 'Quy mô Lớn (> 500 suất/ngày hoặc Nhà máy chế biến đồ đóng hộp/đông lạnh)';
        requiredMinWorkers = 15;
        maxRecommendedDailyVolumePerWorker = 90;
      }
      break;

    case 'KINH_DOANH':
      operationTypeLabel = 'Kinh doanh, Siêu thị, Cửa hàng & Phân phối Thực phẩm';
      if (scale === 'NHO_LE') {
        scaleLabel = 'Nhỏ lẻ / Cửa hàng thực phẩm an toàn';
        requiredMinWorkers = 1;
        maxRecommendedDailyVolumePerWorker = 250;
      } else if (scale === 'VUA') {
        scaleLabel = 'Quy mô Vừa (Cửa hàng lớn / Siêu thị vừa)';
        requiredMinWorkers = 4;
        maxRecommendedDailyVolumePerWorker = 500;
      } else {
        scaleLabel = 'Quy mô Lớn (Chuỗi siêu thị / Trung tâm phân phối kho bãi)';
        requiredMinWorkers = 10;
        maxRecommendedDailyVolumePerWorker = 800;
      }
      break;
  }

  // 2. Phân tích Tải trọng Công việc thực tế trên mỗi Lao động
  const safeWorkers = Math.max(1, totalWorkers);
  const actualVolumePerWorker = Math.round((dailyCapacityVolume / safeWorkers) * 10) / 10;
  const overloadRatio = actualVolumePerWorker / maxRecommendedDailyVolumePerWorker;

  const detailedAnalysis: string[] = [];
  let status: 'PASS' | 'WARNING' | 'CRITICAL_DEFICIT' = 'PASS';
  let statusLabel = 'ĐẠT YÊU CẦU NĂNG LỰC CON NGƯỜI';
  let summaryTitle = 'Đội ngũ nhân sự đáp ứng đầy đủ định mức lao động, bằng cấp chuyên môn và quy định an toàn sức khỏe.';

  // Kiểm tra Số lượng lao động
  if (totalWorkers < requiredMinWorkers) {
    status = 'CRITICAL_DEFICIT';
    detailedAnalysis.push(
      `🚨 Thừa/Thiếu số lượng: Khai báo ${totalWorkers} lao động. Với loại hình ${operationTypeLabel} (${scaleLabel}), số lao động tối thiểu để vận hành an toàn là ${requiredMinWorkers} người.`
    );
  } else {
    detailedAnalysis.push(
      `✅ Số lượng nhân sự: Khai báo ${totalWorkers} lao động (đáp ứng mức tối thiểu ${requiredMinWorkers} lao động cho quy mô này).`
    );
  }

  // Kiểm tra Công suất / Lao động / Ngày
  if (overloadRatio > 1.8) {
    status = 'CRITICAL_DEFICIT';
    detailedAnalysis.push(
      `🚨 Quá tải lao động nghiêm trọng: Áp lực công việc bình quân ${actualVolumePerWorker.toLocaleString('vi-VN')} ${unitLabel}/lao động/ngày (vượt GẤP ${overloadRatio.toFixed(1)} LẦN định mức an toàn lao động tối đa ${maxRecommendedDailyVolumePerWorker} ${unitLabel}/người). Nguy cơ cao gây sơ suất vi phạm quy trình vệ sinh & nhiễm khuẩn chéo!`
    );
  } else if (overloadRatio > 1.2) {
    if (status !== 'CRITICAL_DEFICIT') status = 'WARNING';
    detailedAnalysis.push(
      `⚠️ Cảnh báo tiệm cận quá tải: Bình quân ${actualVolumePerWorker.toLocaleString('vi-VN')} ${unitLabel}/lao động/ngày (vượt ${Math.round((overloadRatio - 1) * 100)}% định mức lao động tiêu chuẩn).`
    );
  } else {
    detailedAnalysis.push(
      `✅ Định mức khối lượng công việc: Bình quân ${actualVolumePerWorker.toLocaleString('vi-VN')} ${unitLabel}/lao động/ngày nằm trong ngưỡng lao động an toàn (ngưỡng khuyến nghị ≤ ${maxRecommendedDailyVolumePerWorker} ${unitLabel}/người/ngày).`
    );
  }

  // Kiểm tra Cán bộ Kỹ thuật / Chuyên môn QC
  const requiresOfficer = scale === 'VUA' || scale === 'LON' || operationType === 'CHE_BIEN' || operationType === 'SO_CHE';
  if (requiresOfficer && !hasTechnicalOfficer) {
    if (status !== 'CRITICAL_DEFICIT') status = 'WARNING';
    detailedAnalysis.push(
      `⚠️ Thiếu Cán bộ Kỹ thuật/QC chuyên trách: Cơ sở thuộc loại hình/quy mô cần có nhân sự có chuyên môn (Bác sĩ thú y/Kỹ sư CNTP/Kỹ sư nông học/Bếp trưởng có chứng chỉ ATTP) để kiểm soát chất lượng nội bộ.`
    );
  } else if (hasTechnicalOfficer) {
    detailedAnalysis.push(
      `✅ Nhân sự quản lý chuyên môn: Có Cán bộ Kỹ thuật/QC/Quản lý ATTP phụ trách kiểm tra chất lượng nội bộ.`
    );
  }

  // Kiểm tra Điều kiện Bắt buộc Pháp luật: Khám sức khỏe & Tập huấn ATTP
  if (healthCheckRatio < 100) {
    status = 'CRITICAL_DEFICIT';
    detailedAnalysis.push(
      `🚨 Vi phạm Khám sức khỏe: Chỉ có ${healthCheckRatio}% lao động có Giấy khám sức khỏe định kỳ còn hiệu lực. Theo Luật ATTP, 100% người trực tiếp tiếp xúc thực phẩm phải khám sức khỏe theo quy định Bộ Y tế.`
    );
  } else {
    detailedAnalysis.push(
      `✅ Khám sức khỏe định kỳ: 100% lao động trực tiếp có Giấy khám sức khỏe còn hiệu lực.`
    );
  }

  if (attpTrainedRatio < 100) {
    status = 'CRITICAL_DEFICIT';
    detailedAnalysis.push(
      `🚨 Vi phạm Tập huấn ATTP: Chỉ có ${attpTrainedRatio}% lao động có Giấy xác nhận/Cam kết tập huấn kiến thức ATTP. Theo Luật ATTP, 100% nhân sự trực tiếp phải qua tập huấn.`
    );
  } else {
    detailedAnalysis.push(
      `✅ Tập huấn kiến thức ATTP: 100% lao động trực tiếp đã hoàn thành tập huấn kiến thức ATTP.`
    );
  }

  // Tiêu đề & Nhãn
  if (status === 'CRITICAL_DEFICIT') {
    statusLabel = 'BẤT HỢP LÝ / THIẾU HỤT NGHIÊM TRỌNG NĂNG LỰC CON NGƯỜI';
    summaryTitle = `Hồ sơ nhân sự không đạt điều kiện pháp lý hoặc vượt quá khả năng lao động an toàn của ${totalWorkers} nhân sự!`;
  } else if (status === 'WARNING') {
    statusLabel = 'CẦN LÀM RÕ & BỔ SUNG NĂNG LỰC NHÂN SỰ';
    summaryTitle = 'Số lượng nhân sự tiệm cận quá tải hoặc thiếu cán bộ chuyên môn phụ trách QC/Kỹ thuật.';
  }

  const legalBasis =
    'Điều 9, 10, 11 Luật An toàn thực phẩm 2010; Thông tư 38/2018/TT-BNNPTNT & Thông tư 13/2014/TT-LT-BYT-BNNPTNT về điều kiện con người trực tiếp sản xuất kinh doanh thực phẩm.';

  let actionPlan = '';
  if (status === 'CRITICAL_DEFICIT') {
    actionPlan =
      'Yêu cầu cơ sở: (1) Khám sức khỏe và cấp Giấy tập huấn ATTP bổ sung cho 100% người lao động chưa có; (2) Tăng cường thêm lao động trực tiếp hoặc giảm công suất/sản lượng đăng ký; (3) Bổ sung Hợp đồng lao động và Bằng cấp cán bộ chuyên môn.';
  } else if (status === 'WARNING') {
    actionPlan =
      'Yêu cầu cơ sở giải trình phương án phân công ca lao động, bổ sung Phụ lục phân công Cán bộ kỹ thuật/QC phụ trách ATTP.';
  } else {
    actionPlan = 'Đội ngũ nhân sự đầy đủ và hợp lệ theo quy định pháp luật. Hồ sơ đạt điều kiện về năng lực con người.';
  }

  return {
    operationTypeLabel,
    scaleLabel,
    totalWorkers,
    requiredMinWorkers,
    maxRecommendedDailyVolumePerWorker,
    actualVolumePerWorker,
    status,
    statusLabel,
    summaryTitle,
    detailedAnalysis,
    legalBasis,
    actionPlan,
  };
}


