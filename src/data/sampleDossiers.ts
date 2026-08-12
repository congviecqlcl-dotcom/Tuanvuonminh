import { SampleDossier } from '../types';

export const SAMPLE_DOSSIERS: SampleDossier[] = [
  {
    id: 'sample-1',
    title: 'Mẫu 1: Giò chả An An (Hồ sơ đầy đủ — Đạt)',
    coSoName: 'Cơ sở Sản xuất Giò chả An An',
    loaiHình: 'Sản xuất, chế biến thực phẩm',
    nganh: 'BNNPTNT',
    thuyetMinh: {
      name: 'ThuetMinh_AnAn_GioCha.pdf',
      text: `BẢN THUYẾT MINH CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM
I. THÔNG TIN CHUNG:
- Tên cơ sở: Cơ sở Sản xuất Giò chả An An
- Địa chỉ: Số 88 Đường Võ Văn Kiệt, Phường 1, Quận 5, TP.HCM
- Mã số thuế: 0318987654
- Người đại diện pháp luật: Nguyễn Văn An - Chủ cơ sở

II. ĐIỀU KIỆN CƠ SỞ VẬT CHẤT & NHÀ XƯỞNG:
- Diện tích khu vực chế biến: 180 m2.
- Thiết kế nguyên tắc một chiều: Khu nhập thịt sống -> Khu lọc lóc/xay giò -> Khu gói/hấp -> Khu làm nguội/đóng gói -> Kho thành phẩm.
- Tường ốp gạch men trắng cao 2.2m, nền lát gạch chống trượt, có hệ thống rãnh thoát nước kín.

III. TRANG THIẾT BỊ, DỤNG CỤ:
- Danh mục thiết bị: 02 Máy xay thịt inox 304, 01 Máy quết giò tự động, 02 Tủ hấp tiệt trùng bằng điện, 01 Máy hút chân không.
- Dụng cụ tiếp xúc thực phẩm: Khay Inox 304, dao thớt phân màu rõ ràng cho thịt sống và thành phẩm chín.

IV. NGUYÊN LIỆU & QUY TRÌNH CHẾ BIẾN:
- Nguyên liệu: Thịt heo tươi lấy từ Công ty Cổ phần Chăn nuôi C.P Việt Nam (có hợp đồng cung cấp & kiểm dịch thú y từng lô).
- Quy trình chế biến: Tiếp nhận nguyên liệu -> Kiểm tra chất lượng -> Xay/Quết giò -> Gói lá chuối/khuôn -> Hấp chín ở 100°C -> Làm nguội -> Hút chân không -> Bảo quản lạnh 0-4°C.
- Quy trình truy xuất nguồn gốc: Đã lập sổ theo dõi lô hàng nhận, lô hàng sản xuất và lô hàng giao theo Thông tư 17/2021/TT-BNNPTNT.

V. NHÂN LỰC & VỆ SINH:
- Tổng số nhân viên chế biến: 08 người.
- 100% nhân viên đã được cấp Giấy khám sức khỏe còn thời hạn và Giấy xác nhận tập huấn kiến thức an toàn thực phẩm.
- Vệ sinh thiết bị, nhà xưởng thực hiện hàng ngày sau ca sản xuất bằng dung dịch khử trùng thực phẩm.`,
    },
    chungMinh: [
      {
        name: 'GiayDKKD_AnAn.pdf',
        text: 'Giấy chứng nhận đăng ký kinh doanh số 0318987654 do Sở KH&ĐT TP.HCM cấp. Đại diện: Nguyễn Văn An. Ngành nghề: Sản xuất chế biến giò chả, thịt đóng gói.',
      },
      {
        name: 'SoDoMatBang_NhaXuong.pdf',
        text: 'Bản vẽ sơ đồ mặt bằng tổng thể 180m2 thể hiện rõ dây chuyền chế biến một chiều từ khu tiếp nhận đến kho lạnh thành phẩm, phân biệt khu sạch/bẩn.',
      },
      {
        name: 'HopDongNguyenLieu_CP.pdf',
        text: 'Hợp đồng cung cấp thịt heo số 12/2025/HD-CP ký giữa Công ty CP C.P Việt Nam và Cơ sở An An kèm Giấy chứng nhận kiểm dịch thú y từng lô.',
      },
      {
        name: 'HoSoNhanSu_KSK_TapHuan.pdf',
        text: 'Danh sách 08 công nhân kèm Giấy khám sức khỏe Bệnh viện Quận 5 cấp năm 2026 và Giấy xác nhận tập huấn kiến thức ATTP.',
      },
      {
        name: 'MauNhan_GioCha.pdf',
        text: 'Mẫu nhãn sản phẩm Giò chả lụa An An: Tên sản phẩm, ĐKKD 0318987654, Khối lượng tịnh 500g, NSX 01/08/2026, HSD 30 ngày bảo quản 0-4°C, Thành phần: Thịt heo 90%, nước mắm, phụ gia INS 451i.',
      },
    ],
  },
  {
    id: 'sample-2',
    title: 'Mẫu 2: Bánh mì Minh Tâm (Thiếu Hợp đồng & Giấy KSK)',
    coSoName: 'Lò Bánh mì Minh Tâm',
    loaiHình: 'Sản xuất bánh mì, bánh ngọt',
    nganh: 'BCT',
    thuyetMinh: {
      name: 'ThuetMinh_BanhMi_MinhTam.pdf',
      text: `BẢN THUYẾT MINH CƠ SỞ BÁNH MÌ MINH TÂM
Tên cơ sở: Lò Bánh mì Minh Tâm
Địa chỉ: 45 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM
Mã số thuế: 0311223344
Đại diện: Trần Thị Tâm

Cơ sở có diện tích 60m2. Thiết bị gồm 1 lò nướng 3 khay, 1 máy cối trộn bột.
Nguyên liệu bột mì mua trôi nổi tại chợ đầu mối không có hóa đơn hợp đồng.
Nhân sự gồm 3 người làm trực tiếp nhưng chưa đi khám sức khỏe năm nay.`,
    },
    chungMinh: [
      {
        name: 'GiayKinhDoanh_MinhTam.pdf',
        text: 'Giấy phép hộ kinh doanh Minh Tâm. MST 0311223344 do UBND Quận 5 cấp.',
      },
    ],
  },
  {
    id: 'sample-3',
    title: 'Mẫu 3: Bếp ăn tập thể Cty May Việt Tiến (Đầy đủ — Lưu mẫu 24h)',
    coSoName: 'Bếp ăn tập thể Cty CP May Việt Tiến',
    loaiHình: 'Bếp ăn tập thể (>500 suất/ngày)',
    nganh: 'BYT',
    thuyetMinh: {
      name: 'ThuetMinh_BepAn_VietTien.pdf',
      text: `BẢN THUYẾT MINH BẾP ĂN TẬP THỂ CÔNG TY MAY VIỆT TIẾN
1. Thông tin chung:
- Tên đơn vị: Bếp ăn tập thể Công ty CP May Việt Tiến
- Địa chỉ: 07 Lê Tiến Giảng, Phường Tân Thới Nhất, Quận 12, TP.HCM
- Quy mô: 800 suất ăn/ngày cho công nhân.

2. Điều kiện vệ sinh & Lưu mẫu:
- Bếp ăn thiết kế nguyên tắc một chiều. Rãnh thoát nước kín, có lưới chắn côn trùng.
- Đã trang bị tủ lưu mẫu thức ăn chuyên dụng, dung tích lưu mẫu ≥120g/mẫu. Thực hiện lưu mẫu thức ăn 24 giờ đúng Quy định 1241/QĐ-BYT.
- Nguồn nước máy thủy cục Thành phố đạt QCVN 01-1:2018/BYT.
- Có hợp đồng mua rau củ từ Hợp tác xã Nông nghiệp An Phú và thịt từ Vissan.`,
    },
    chungMinh: [
      {
        name: 'GiayDangKyDoanhNghiep.pdf',
        text: 'Giấy chứng nhận đăng ký doanh nghiệp Công ty CP May Việt Tiến. Mã số DN: 0300889900.',
      },
      {
        name: 'SoDoMặtBang_BepAn.pdf',
        text: 'Sơ đồ dây chuyền bếp ăn tập thể 300m2 phân khu nhận thực phẩm, sơ chế thô, bếp nấu chín, chia suất và phòng ăn riêng biệt.',
      },
      {
        name: 'HopDong_Vissan_AnPhu.pdf',
        text: 'Hợp đồng cung ứng thực phẩm an toàn với Công ty Vissan và HTX An Phú kèm chứng nhận chuỗi thực phẩm an toàn.',
      },
      {
        name: 'KSK_TapHuan_12NhanVien.pdf',
        text: 'Giấy khám sức khỏe định kỳ và xác nhận kiến thức ATTP của 12 nhân viên nhà bếp.',
      },
      {
        name: 'SoTheoDoiLuuMauThucAn.pdf',
        text: 'Sổ nhật ký lưu mẫu thức ăn 24h có đầy đủ chữ ký người lưu, nhiệt độ tủ lưu 2-4°C, thời gian niêm phong và hủy mẫu.',
      },
    ],
  },
  {
    id: 'sample-4',
    title: 'Mẫu 4: Cơ sở Chế biến Thủy sản Khô Hải Nam (Bộ BNN&PTNT — Đạt)',
    coSoName: 'Cơ sở Chế biến Thủy sản Khô Hải Nam',
    loaiHình: 'Chế biến thủy sản',
    nganh: 'BNNPTNT',
    thuyetMinh: {
      name: 'ThuetMinh_HaiNam_Seafood.pdf',
      text: `BẢN THUYẾT MINH CƠ SỞ CHẾ BIẾN THỦY SẢN KHÔ HẢI NAM
I. THÔNG TIN CƠ SỞ:
- Cơ sở Chế biến Thủy sản Khô Hải Nam. Địa chỉ: Cảng cá Cát Lở, Phường 11, TP. Vũng Tàu. MST: 3501234567.

II. ĐIỀU KIỆN CHẾ BIẾN & TRUY XUẤT NGUỒN GỐC:
- Mức công suất chế biến: 50 tấn cá khô/năm.
- Nguyên liệu cá mực tươi thu mua từ các tàu cá đánh bắt có nhật ký khai thác và mã số tàu cá theo quy định IUU.
- Đã thiết lập hệ thống truy xuất nguồn gốc lô hàng theo Thông tư 17/2021/TT-BNNPTNT (sổ theo dõi mã lô nhập, mã lô sấy đóng gói, mã lô xuất bán).
- Nhà xưởng có nhà sấy năng lượng mặt trời kín, tránh côn trùng bụi bẩn.`,
    },
    chungMinh: [
      {
        name: 'GiayĐKKD_HaiNam.pdf',
        text: 'Giấy ĐKKD số 3501234567 cấp bởi Sở KH&ĐT Bà Rịa - Vũng Tàu.',
      },
      {
        name: 'NhatKyKhaiThac_TauCa.pdf',
        text: 'Bản sao nhật ký khai thác thủy sản và biên bản kiểm tra nguồn gốc thủy sản đánh bắt tại cảng cá.',
      },
      {
        name: 'HoSoTruyXuat_TT17.pdf',
        text: 'Hồ sơ thiết lập hệ thống truy xuất nguồn gốc "1 bước trước - 1 bước sau", mã nhận diện mã lô sản xuất HNM-2026-08.',
      },
      {
        name: 'GiayKSK_TapHuan.pdf',
        text: 'Giấy KSK và xác nhận kiến thức ATTP cho 15 công nhân sấy phân loại cá.',
      },
    ],
  },
  {
    id: 'sample-5',
    title: 'Mẫu 5: HTX Rau an toàn Xanh Tươi (Phát hiện Cảnh báo: 360m² rau nhưng ký hợp đồng giao 200kg/ngày)',
    coSoName: 'Hợp tác xã Nông nghiệp Rau an toàn Xanh Tươi',
    loaiHình: 'Trồng trọt, nông sản tươi',
    nganh: 'BNNPTNT',
    thuyetMinh: {
      name: 'ThuetMinh_RauXanhTuoi.pdf',
      text: `BẢN THUYẾT MINH CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM
I. THÔNG TIN CHUNG:
- Tên cơ sở: Hợp tác xã Nông nghiệp Rau an toàn Xanh Tươi
- Địa chỉ mảnh đất canh tác: Thôn An Bình, Xã Hòa Bình, Huyện Thường Tín, Hà Nội
- Mã số thuế: 0109988776
- Người đại diện: Lê Văn Tươi - Giám đốc HTX

II. QUY MÔ DIỆN TÍCH CANH TÁC & SẢN LƯỢNG:
- Diện tích mảnh đất trồng rau thực tế: 360 m2 (đất nông nghiệp trồng rau màu).
- Quy trình trồng: Canh tác rau an toàn theo hướng VietGAP ngoài trời.
- Chủng loại sản phẩm khai báo cung cấp: 08 loại gồm Rau cải ngọt, Cải bẹ xanh, Xà lách, Cà chua, Dưa leo, Củ cải trắng, Cà rốt, Bí đao.

III. HỢP ĐỒNG CUNG CẤP & KHỐI LƯỢNG:
- HTX đã ký Hợp đồng cung cấp nông sản số 88/2026/HĐ-XT với Chuỗi Bếp ăn Siêu thị X.
- Khối lượng cung cấp theo hợp đồng: Cam kết giao 200 kg/ngày (tương đương 6 tấn/tháng, 72 tấn/năm) liên tục 365 ngày/năm.

IV. NHÂN LỰC & NGUỒN NƯỚC:
- Số lao động: 03 người. Đã tập huấn kiến thức ATTP và có Giấy khám sức khỏe.
- Nguồn nước tưới: Nước giếng khoan qua bể lọc cát.`,
    },
    chungMinh: [
      {
        name: 'GiayDK_HTX_XanhTuoi.pdf',
        text: 'Giấy chứng nhận đăng ký HTX số 0109988776 do UBND Huyện Thường Tín cấp. Ngành nghề: Trồng trọt rau màu.',
      },
      {
        name: 'GiayNhanQuyenSudungDat_360m2.pdf',
        text: 'Giấy chứng nhận quyền sử dụng đất số BD 123456 cấp cho mảnh đất nông nghiệp diện tích đúng 360 m2 tại xã Hòa Bình.',
      },
      {
        name: 'HopDongCungCap_Bepan_200kg.pdf',
        text: 'Hợp đồng kinh tế số 88/2026/HĐ-XT: HTX Xanh Tươi cam kết cung cấp hàng ngày 200 kg rau củ quả các loại cho Bếp ăn Công ty X.',
      },
      {
        name: 'GiayKSK_NhanSu.pdf',
        text: 'Giấy khám sức khỏe và xác nhận kiến thức ATTP cho 03 thành viên HTX.',
      },
    ],
  },
];
