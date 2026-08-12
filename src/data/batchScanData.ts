import { DocCategoryType, ScannedDocumentItem, SortedDossierGroup } from '../types';

export const MANDATORY_CATEGORIES: { category: DocCategoryType; label: string; seq: number; isMandatory: boolean; desc: string }[] = [
  {
    category: 'DON_XIN_CAP',
    label: '1. Đơn đề nghị cấp Giấy chứng nhận ATTP (Mẫu 01)',
    seq: 1,
    isMandatory: true,
    desc: 'Đơn xin cấp theo quy định Nghị định 15/2018/NĐ-CP, có chữ ký và con dấu của người đại diện.'
  },
  {
    category: 'DANG_KY_KINH_DOANH',
    label: '2. Giấy chứng nhận Đăng ký Doanh nghiệp / HKD',
    seq: 2,
    isMandatory: true,
    desc: 'Giấy phép ĐKKD hoặc ĐK HTX cấp bởi Sở KH&ĐT hoặc UBND Quận/Huyện.'
  },
  {
    category: 'THUYET_MINH_CSVC',
    label: '3. Bản thuyết minh cơ sở vật chất, trang thiết bị',
    seq: 3,
    isMandatory: true,
    desc: 'Mô tả chi tiết diện tích mặt bằng, khu vực chế biến, trang thiết bị inox, dụng cụ.'
  },
  {
    category: 'SO_DO_MAT_BANG',
    label: '4. Sơ đồ mặt bằng & Quy trình sản xuất 1 chiều',
    seq: 4,
    isMandatory: true,
    desc: 'Sơ đồ thiết kế phân khu và dòng chảy thực phẩm 1 chiều chống nhiễm khuẩn chéo.'
  },
  {
    category: 'GIAY_KHAM_SUC_KHOE',
    label: '5. Danh sách & Giấy khám sức khỏe nhân sự',
    seq: 5,
    isMandatory: true,
    desc: 'Giấy khám sức khỏe định kỳ theo Thông tư 14/2013/TT-BYT cho 100% công nhân trực tiếp.'
  },
  {
    category: 'TAP_HUAN_ATTP',
    label: '6. Danh sách & Giấy xác nhận tập huấn ATTP',
    seq: 6,
    isMandatory: true,
    desc: 'Giấy chứng nhận/Xác nhận đã qua lớp tập huấn kiến thức an toàn thực phẩm.'
  },
  {
    category: 'HOP_DONG_NGUYEN_LIEU',
    label: '7. Hợp đồng nguyên liệu & Giấy chứng nhận VietGAP/HACCP',
    seq: 7,
    isMandatory: true,
    desc: 'Hợp đồng liên kết cung ứng nông sản, thực phẩm tươi sống hoặc chứng chỉ VietGAP/ISO.'
  },
  {
    category: 'GIAY_TO_KHAC',
    label: '8. Văn bản phụ trợ khác (Nước sinh hoạt, Thu gom rác...)',
    seq: 8,
    isMandatory: false,
    desc: 'Phiếu kết quả xét nghiệm nước chế biến, hợp đồng xử lý chất thải thực phẩm.'
  }
];

export function classifyDocumentText(fileName: string, text: string): {
  category: DocCategoryType;
  categoryLabel: string;
  entityName: string;
  confidenceScore: number;
  seq: number;
  documentNumber?: string;
  documentDate?: string;
  qualityWarning?: string;
} {
  const lower = (fileName + ' ' + text).toLowerCase();

  let entityName = 'Cơ sở / Doanh nghiệp Chưa xác định';
  const entityMatch = text.match(/(công ty|cơ sở|hợp tác xã|hợp tác xã dịch vụ|bếp ăn|doanh nghiệp)\s+([^\n,.\–\-]+)/i);
  if (entityMatch) {
    entityName = entityMatch[0].trim();
  }

  // Detect document numbers & dates
  const docNumMatch = text.match(/(số|mã số|mst|đkkd):\s*([0-9A-Z\-\/]+)/i);
  const docNumber = docNumMatch ? docNumMatch[2] : undefined;

  const docDateMatch = text.match(/(ngày|ngày cấp):\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i);
  const docDate = docDateMatch ? docDateMatch[2] : undefined;

  let category: DocCategoryType = 'GIAY_TO_KHAC';
  let confidenceScore = 85;

  if (lower.includes('đơn đề nghị') || lower.includes('mẫu 01') || lower.includes('đơn xin cấp')) {
    category = 'DON_XIN_CAP';
    confidenceScore = 98;
  } else if (lower.includes('đăng ký kinh doanh') || lower.includes('đăng ký doanh nghiệp') || lower.includes('mã số thuế') || lower.includes('giấy chứng nhận đăng ký')) {
    category = 'DANG_KY_KINH_DOANH';
    confidenceScore = 96;
  } else if (lower.includes('thuyết minh') || lower.includes('cơ sở vật chất') || lower.includes('trang thiết bị') || lower.includes('dụng cụ sản xuất')) {
    category = 'THUYET_MINH_CSVC';
    confidenceScore = 95;
  } else if (lower.includes('sơ đồ') || lower.includes('mặt bằng') || lower.includes('quy trình một chiều') || lower.includes('quy trình 1 chiều')) {
    category = 'SO_DO_MAT_BANG';
    confidenceScore = 94;
  } else if (lower.includes('khám sức khỏe') || lower.includes('kết quả khám') || lower.includes('sức khỏe công nhân') || lower.includes('thông tư 14')) {
    category = 'GIAY_KHAM_SUC_KHOE';
    confidenceScore = 97;
  } else if (lower.includes('tập huấn') || lower.includes('kiến thức an toàn') || lower.includes('xác nhận tập huấn') || lower.includes('chứng nhận tập huấn')) {
    category = 'TAP_HUAN_ATTP';
    confidenceScore = 96;
  } else if (lower.includes('hợp đồng') || lower.includes('thu mua') || lower.includes('vietgap') || lower.includes('haccp') || lower.includes('cung cấp nguyên liệu')) {
    category = 'HOP_DONG_NGUYEN_LIEU';
    confidenceScore = 93;
  }

  const foundItem = MANDATORY_CATEGORIES.find((c) => c.category === category) || MANDATORY_CATEGORIES[7];

  let qualityWarning: string | undefined;
  if (text.length < 100) {
    qualityWarning = '⚠️ Văn bản quá ngắn hoặc ảnh scan có độ phân giải thấp.';
  } else if (lower.includes('mờ') || lower.includes('thiếu dấu')) {
    qualityWarning = '⚠️ Cần kiểm tra lại con dấu hoặc chữ ký đại diện.';
  }

  return {
    category,
    categoryLabel: foundItem.label,
    entityName,
    confidenceScore,
    seq: foundItem.seq,
    documentNumber: docNumber,
    documentDate: docDate,
    qualityWarning,
  };
}

export function groupAndSortScannedDocuments(docs: ScannedDocumentItem[]): SortedDossierGroup[] {
  const groupsMap = new Map<string, ScannedDocumentItem[]>();

  for (const doc of docs) {
    let key = doc.targetEntityName || 'Chưa xác định cơ sở';
    // Normalize entity key
    const normalized = key.toLowerCase().replace(/^(công ty|cơ sở|htx|doanh nghiệp)\s+/i, '').trim();
    
    let foundGroupKey = Array.from(groupsMap.keys()).find((k) => {
      const kNorm = k.toLowerCase().replace(/^(công ty|cơ sở|htx|doanh nghiệp)\s+/i, '').trim();
      return kNorm.includes(normalized) || normalized.includes(kNorm);
    });

    if (!foundGroupKey) {
      foundGroupKey = key;
      groupsMap.set(foundGroupKey, []);
    }

    groupsMap.get(foundGroupKey)!.push(doc);
  }

  const result: SortedDossierGroup[] = [];

  for (const [entityName, docList] of groupsMap.entries()) {
    // Sort documents inside dossier set by standard sequence (1 to 8)
    const sortedDocs = [...docList].sort((a, b) => a.suggestedSequence - b.suggestedSequence);

    // Identify missing mandatory categories
    const existingCategories = new Set(sortedDocs.map((d) => d.category));
    const missingCategories = MANDATORY_CATEGORIES
      .filter((m) => m.isMandatory && !existingCategories.has(m.category))
      .map((m) => ({ category: m.category, label: m.label, isMandatory: m.isMandatory }));

    const mandatoryCount = MANDATORY_CATEGORIES.filter((m) => m.isMandatory).length;
    const presentMandatoryCount = mandatoryCount - missingCategories.length;
    const completenessScore = Math.round((presentMandatoryCount / mandatoryCount) * 100);

    result.push({
      id: `group-${Math.random().toString(36).substr(2, 9)}`,
      entityName,
      documents: sortedDocs,
      missingCategories,
      completenessScore,
    });
  }

  return result;
}

export const SAMPLE_BATCH_SCANNED_FILES: { fileName: string; text: string; previewColor: string }[] = [
  {
    fileName: 'SCAN_001_Anh_chup_GDKKD_SôngHồng.jpg',
    previewColor: 'from-blue-500 to-indigo-600',
    text: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nSỞ KẾ HOẠCH VÀ ĐẦU TƯ TP. HÀ NỘI\n\nGIẤY CHỨNG NHẬN ĐĂNG KÝ DOANH NGHIỆP\nMã số doanh nghiệp: 0108998822\nTên công ty: CÔNG TY TNHH CHẾ BIẾN THỰC PHẨM SÔNG HỒNG\nĐịa chỉ trụ sở chính: Số 45 Đường Nguyễn Văn Cừ, Phường Bồ Đề, Quận Long Biên, Hà Nội.\nNgười đại diện theo pháp luật: Nguyễn Thị Lan.\nNgày đăng ký lần đầu: 15/03/2021.`,
  },
  {
    fileName: 'SCAN_002_Don_Xin_Cap_GCN_SongHong.pdf',
    previewColor: 'from-amber-500 to-orange-600',
    text: `ĐƠN ĐỀ NGHỊ CẤP GIẤY CHỨNG NHẬN CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM\n(Mẫu số 01 - Nghị định 15/2018/NĐ-CP)\n\nKính gửi: Chi cục Quản lý Chất lượng Nông Lâm sản và Thủy sản Hà Nội\nTên cơ sở xin cấp: CÔNG TY TNHH CHẾ BIẾN THỰC PHẨM SÔNG HỒNG\nĐịa chỉ xưởng sản xuất: Lô B2, Cụm Công nghiệp Hapro, Gia Lâm, Hà Nội\nLoại hình sản xuất: Sơ chế và Chế biến nông sản đóng gói\nChúng tôi cam kết chấp hành nghiêm chỉnh các quy định của pháp luật về an toàn thực phẩm.`,
  },
  {
    fileName: 'SCAN_003_Giay_Kham_Suc_Khoe_Cong_Nhan_SongHong.jpg',
    previewColor: 'from-emerald-500 to-teal-600',
    text: `BỆNH VIỆN ĐA KHOA DÂN LẬP HÀ NỘI\n\nDANH SÁCH VÀ KẾT QUẢ KHÁM SỨC KHỎE ĐỊNH KỲ CHO NGƯỜI TRỰC TIẾP SẢN XUẤT THỰC PHẨM\n(Theo Thông tư 14/2013/TT-BYT)\n\nCơ sở làm việc: CÔNG TY TNHH CHẾ BIẾN THỰC PHẨM SÔNG HỒNG\nDanh sách bao gồm 12 công nhân trực tiếp sản xuất:\n1. Trần Văn Bình - Kết quả: Đủ sức khỏe làm việc\n2. Lê Thị Mai - Kết quả: Đủ sức khỏe làm việc\n...\n12. Phạm Quốc Cường - Kết quả: Đủ sức khỏe làm việc\nNgày cấp giấy xác nhận: 10/01/2026.`,
  },
  {
    fileName: 'SCAN_004_Hop_Dong_Lien_Ket_VietGAP_RauAnBinh.pdf',
    previewColor: 'from-purple-500 to-pink-600',
    text: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n\nHỢP ĐỒNG LIÊN KẾT CUNG CẤP NÔNG SẢN ĐẠT CHUẨN VIETGAP\n\nBên A: HTX RAU SẠCH AN BÌNH\nĐịa chỉ: Xã Vân Nội, Huyện Đông Anh, Hà Nội\nBên B: CÔNG TY TNHH CHẾ BIẾN THỰC PHẨM SÔNG HỒNG\nNội dung: Bên A cam kết cung cấp 1.500 kg rau củ quả an toàn đạt chứng nhận VietGAP số VGAP-2025-098 mỗi ngày cho Bên B. Hợp đồng có hiệu lực đến 31/12/2026.`,
  },
  {
    fileName: 'SCAN_005_So_Do_Bep_1_Chieu_AnBinh.png',
    previewColor: 'from-cyan-500 to-blue-600',
    text: `BẢN VẼ SƠ ĐỒ MẶT BẰNG VÀ QUY TRÌNH CHẾ BIẾN MỘT CHIỀU\n\nĐơn vị chủ quản: HTX RAU SẠCH AN BÌNH\nĐịa chỉ nhà xưởng: Thôn Nhất Bốt, Xã Vân Nội, Đông Anh, Hà Nội\nQuy trình sơ chế một chiều:\n1. Khu tiếp nhận nông sản thô ➔ 2. Khu ngâm rửa sục Ozon ➔ 3. Khu phân loại & đóng gói ➔ 4. Kho lạnh bảo quản ➔ 5. Khu xuất hàng.\nTrang bị: Bồn rửa inox, đèn diệt khuẩn UV, lối đi phân tách biệt.`,
  },
  {
    fileName: 'SCAN_006_Xac_Nhan_Tap_Huan_ATTP_SongHong.jpg',
    previewColor: 'from-rose-500 to-red-600',
    text: `CHI CỤC QUẢN LÝ CHẤT LƯỢNG NÔNG LÂM SẢN VÀ THỦY SẢN\n\nGIẤY XÁC NHẬN TẬP HUẤN KIẾN THỨC AN TOÀN THỰC PHẨM\n\nCấp cho: CÔNG TY TNHH CHẾ BIẾN THỰC PHẨM SÔNG HỒNG\nĐã hoàn thành khóa xác nhận kiến thức an toàn thực phẩm cho 12/12 người lao động trực tiếp theo quy định của Bộ Nông nghiệp & PTNT.\nChịu trách nhiệm chuyên môn: Nguyễn Thị Lan.\nNgày cấp: 18/01/2026.`,
  },
  {
    fileName: 'SCAN_007_Thuyet_Minh_Dieu_Kien_AnBinh.pdf',
    previewColor: 'from-emerald-600 to-green-700',
    text: `BẢN THUYẾT MINH CƠ SỞ VẬT CHẤT, TRANG THIẾT BỊ VÀ DỤNG CỤ SẢN XUẤT\n\nTên cơ sở: HTX RAU SẠCH AN BÌNH\nĐịa chỉ: Xã Vân Nội, Đông Anh, Hà Nội\n1. Diện tích mặt bằng nhà xưởng: 850 m² nhà màng + 200 m² khu sơ chế phân loại.\n2. Thiết bị: 02 máy sục ozon rửa rau, 01 kho lạnh 30m³, 04 bàn inox sơ chế.\n3. Nguồn nước dùng trong sơ chế: Nước sạch thành phố có kết quả xét nghiệm mẫu định kỳ đạt chuẩn QCVN 01-1:2018/BYT.`,
  },
  {
    fileName: 'SCAN_008_Giay_Kham_Suc_Khoe_AnBinh.jpg',
    previewColor: 'from-amber-600 to-yellow-600',
    text: `TRUNG TÂM Y TẾ HUYỆN ĐÔNG ANH\n\nGIẤY XÁC NHẬN ĐỦ SỨC KHỎE TRỰC TIẾP SẢN XUẤT THỰC PHẨM\n\nCấp cho nhân sự thuộc: HTX RAU SẠCH AN BÌNH\nSố lượng nhân sự được cấp giấy: 08 xã viên trực tiếp trồng trọt và đóng gói.\nTất cả 08 nhân sự không mắc các bệnh truyền nhiễm theo quy định của Bộ Y tế.\nHiệu lực: Đến hết ngày 05/01/2027.`,
  }
];
