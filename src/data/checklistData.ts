import { ChecklistItem } from '../types';

export const COMPREHENSIVE_CHECKLIST: ChecklistItem[] = [
  // 1. Thông tin pháp lý & Tư cách chủ thể
  {
    id: 'PL-01',
    nhom: 'Thông tin pháp lý',
    yeu_cau: 'Có Đăng ký kinh doanh / Quyết định thành lập có ngành nghề sản xuất, kinh doanh thực phẩm phù hợp',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 34 Luật ATTP 2010; Điều 36 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'PL-02',
    nhom: 'Thông tin pháp lý',
    yeu_cau: 'Thông tin tên cơ sở, địa chỉ sản xuất, người đại diện pháp luật thống nhất trên toàn bộ hồ sơ',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 36 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'PL-03',
    nhom: 'Thông tin pháp lý & Miễn Giấy chứng nhận',
    yeu_cau: 'Trường hợp cơ sở đã có chứng nhận GMP/HACCP/ISO 22000/IFS/BRC/FSSC 22000: Có văn bản thông báo và bản sao chứng nhận còn hiệu lực (Được miễn cấp Giấy chứng nhận ATTP)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Khoản 1k Điều 12 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'PL-04',
    nhom: 'Phân công thẩm quyền quản lý',
    yeu_cau: 'Cơ sở sản xuất nhiều loại sản phẩm thuộc thẩm quyền quản lý của từ 2 Bộ trở lên: Nộp hồ sơ đến cơ quan quản lý sản phẩm có sản lượng lớn nhất',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Khoản 8, 10 Điều 36 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },

  // 2. Môi trường, Diện tích & Bố trí nhà xưởng
  {
    id: 'DT-01',
    nhom: 'Diện tích & Địa điểm',
    yeu_cau: 'Có mô tả diện tích khu vực sản xuất/chế biến thích hợp, có khoảng cách an toàn với nguồn ô nhiễm',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 19 Luật ATTP 2010; Khoản 1 Điều 12 NĐ 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'NX-01',
    nhom: 'Nhà xưởng & Dây chuyền',
    yeu_cau: 'Bố trí mặt bằng theo nguyên tắc một chiều từ nguyên liệu đầu vào đến thành phẩm, tránh nhiễm chéo',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 19, Điều 25 Luật ATTP 2010; Điều 28 NĐ 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'NX-02',
    nhom: 'Nhà xưởng & Kết cấu',
    yeu_cau: 'Kết cấu trần, tường, nền nhà xưởng phẳng, không thấm nước, dễ vệ sinh, khử trùng',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 19 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'GMP-01',
    nhom: 'Nhà xưởng & Tiêu chuẩn GMP',
    yeu_cau: 'Cơ sở sản xuất Thực phẩm bảo vệ sức khỏe (Health Supplement): Bắt buộc đạt tiêu chuẩn Thực hành sản xuất tốt (GMP) do Bộ Y tế cấp',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 28 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'BYT',
    loai_co_so: 'SAN_XUAT',
  },

  // 3. Trang thiết bị & Dụng cụ tiếp xúc thực phẩm
  {
    id: 'TB-01',
    nhom: 'Thiết bị & Dụng cụ',
    yeu_cau: 'Có danh mục trang thiết bị, dụng cụ chế biến làm bằng vật liệu không thôi nhiễm độc hại (Inox 304, nhựa thực phẩm)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 18, Điều 19 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'TB-02',
    nhom: 'Thiết bị & Phân màu',
    yeu_cau: 'Có dụng cụ, đồ chứa đựng riêng biệt phân màu hoặc đánh dấu rõ giữa thực phẩm sống và thực phẩm chín',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 28, Điều 29 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'AN_UONG',
  },

  // 4. Nguồn nước, Nước đá & Hệ thống xử lý chất thải
  {
    id: 'NC-01',
    nhom: 'Nước & Nước đá',
    yeu_cau: 'Có nguồn nước sạch đạt quy chuẩn kỹ thuật phục vụ chế biến và nước đá sạch (nếu có sử dụng)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 19 Luật ATTP 2010; Phụ lục II NĐ 15/2018/NĐ-CP',
    nganh_quan_ly: 'BYT',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'CT-01',
    nhom: 'Xử lý chất thải',
    yeu_cau: 'Có hệ thống thu gom, xử lý chất thải, nước thải vận hành thường xuyên, cống rãnh thông thoát',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 19, Điều 28 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },

  // 5. Nguyên liệu đầu vào & Truy xuất nguồn gốc
  {
    id: 'NL-01',
    nhom: 'Nguyên liệu đầu vào',
    yeu_cau: 'Nguyên liệu thực phẩm có nguồn gốc, xuất xứ rõ ràng (có hợp đồng, hóa đơn, giấy kiểm dịch thú y/thực vật)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 26 Luật ATTP 2010; Điều 54 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'NL-03',
    nhom: 'Năng lực sản xuất & Sản lượng hợp đồng',
    yeu_cau: 'Diện tích canh tác/chuồng trại/ao nuôi tương xứng với khối lượng sản phẩm ký hợp đồng cung cấp (Không có dấu hiệu mạo danh tự sản xuất để thu mua trôi nổi ngoài thị trường)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Khoản 4 Điều 4, Khoản 2 Điều 26 Luật ATTP 2010; Quy chuẩn Định mức Nông nghiệp Bộ NN&PTNT',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'TX-01',
    nhom: 'Truy xuất nguồn gốc',
    yeu_cau: 'Thiết lập quy trình ghi chép và lưu trữ hồ sơ truy xuất nguồn gốc lô hàng theo nguyên tắc "1 bước trước - 1 bước sau"',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 54 Luật ATTP 2010; Điều 4, 5, 6 Thông tư 17/2021/TT-BNNPTNT',
    nganh_quan_ly: 'BNNPTNT',
    loai_co_so: 'NONG_LAM_THUY_SAN',
  },
  {
    id: 'CK-01',
    nhom: 'Cam kết ATTP (Cơ sở nhỏ lẻ)',
    yeu_cau: 'Đối với cơ sở không thuộc diện cấp Giấy chứng nhận (sản xuất/kinh doanh nhỏ lẻ, bao gói sẵn): Có Bản cam kết sản xuất, kinh doanh thực phẩm an toàn',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 3, Điều 4 Thông tư 17/2018/TT-BNNPTNT',
    nganh_quan_ly: 'BNNPTNT',
    loai_co_so: 'CHUNG',
  },

  // 6. Ghi nhãn thực phẩm, Công bố & Quảng cáo
  {
    id: 'NH-01',
    nhom: 'Ghi nhãn & Công bố',
    yeu_cau: 'Sản phẩm bao gói sẵn có mẫu nhãn thể hiện đầy đủ các nội dung bắt buộc (Tên, ĐKKD, NSX, HSD, Định lượng, Thành phần)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Nghị định 43/2017/NĐ-CP sửa đổi bởi NĐ 111/2021/NĐ-CP; Điều 44 Luật ATTP 2010',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'CB-01',
    nhom: 'Ghi nhãn & Công bố',
    yeu_cau: 'Sản phẩm thuộc diện tự công bố hoặc đăng ký bản công bố sản phẩm đã có phiếu kiểm nghiệm ISO 17025 còn hạn 12 tháng',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 4, Điều 5, Điều 7 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'QC-01',
    nhom: 'Quảng cáo thực phẩm',
    yeu_cau: 'Đối với thực phẩm bảo vệ sức khỏe / dinh dưỡng y học: Nội dung quảng cáo đăng ký xác nhận và bắt buộc có câu khuyến cáo "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 5 Nghị định 181/2013/NĐ-CP; Điều 26 Nghị định 15/2018/NĐ-CP',
    nganh_quan_ly: 'BYT',
    loai_co_so: 'SAN_XUAT',
  },

  // 7. Quản lý Nhân lực (Sức khỏe & Tập huấn ATTP)
  {
    id: 'NS-01',
    nhom: 'Nhân lực & Sức khỏe',
    yeu_cau: 'Chủ cơ sở và người trực tiếp sản xuất/chế biến có Giấy khám sức khỏe do cơ sở y tế cấp huyện trở lên cấp',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Khoản 1d Điều 36 Luật ATTP 2010; Thông tư 17/2024/TT-BNNPTNT',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
  {
    id: 'NS-02',
    nhom: 'Nhân lực & Tập huấn',
    yeu_cau: 'Chủ cơ sở và người trực tiếp chế biến có Giấy xác nhận / Danh sách xác nhận tập huấn kiến thức an toàn thực phẩm',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Khoản 1đ Điều 36 Luật ATTP 2010; Điều 18 Thông tư 38/2018/TT-BNNPTNT',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },

  // 8. Bếp ăn tập thể & Lưu mẫu thức ăn 24h
  {
    id: 'BA-01',
    nhom: 'Bếp ăn tập thể',
    yeu_cau: 'Có thực hiện lưu mẫu thức ăn đủ 24 giờ theo đúng quy định (lượng mẫu ≥100g, niêm phong, ghi ngày giờ, bảo quản 0-4°C)',
    can_cu_loai: 'QUY_DINH',
    can_cu_phap_ly: 'Điều 30 Luật ATTP 2010; Quyết định 1241/QĐ-BYT',
    nganh_quan_ly: 'BYT',
    loai_co_so: 'BEP_AN',
  },

  // 9. Quy trình & Kiểm soát mối nguy
  {
    id: 'QT-01',
    nhom: 'Quy trình sản xuất',
    yeu_cau: 'Quy trình sản xuất mô tả đầy đủ các công đoạn, có kiểm soát các thông số kỹ thuật cốt lõi (nhiệt độ, thời gian hấp/sấy)',
    can_cu_loai: 'THONG_LE_CHUYEN_NGANH',
    can_cu_phap_ly: 'Tiêu chuẩn Kỹ thuật Ngành / Tiêu chuẩn HACCP/GMP',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'SAN_XUAT',
  },
  {
    id: 'BQ-01',
    nhom: 'Bảo quản sản phẩm',
    yeu_cau: 'Có trang thiết bị bảo quản phù hợp (kho lạnh/tủ đông/nhiệt độ mát) đáp ứng yêu cầu bảo quản của từng loại sản phẩm',
    can_cu_loai: 'THONG_LE_CHUYEN_NGANH',
    can_cu_phap_ly: 'Điều 20 Luật ATTP 2010; Quy chuẩn bảo quản chuyên ngành',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },

  // 10. Tính hợp lý số liệu & Logic hồ sơ
  {
    id: 'SL-01',
    nhom: 'Tính hợp lý số liệu',
    yeu_cau: 'Công suất khai báo tương xứng với diện tích mặt bằng, năng lực trang thiết bị và số lượng nhân sự',
    can_cu_loai: 'THONG_LE_CHUYEN_NGANH',
    can_cu_phap_ly: 'Nghiệp vụ thẩm định hồ sơ hành chính',
    nganh_quan_ly: 'ALL',
    loai_co_so: 'CHUNG',
  },
];

