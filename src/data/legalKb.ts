import { LegalDocument } from '../types';

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'luat-attp-2010',
    code: 'Luật số 55/2010/QH12',
    title: 'Luật An toàn thực phẩm 2010',
    type: 'Luật Quốc hội',
    issuedDate: '17/06/2010',
    effectiveDate: '01/07/2011',
    summary: 'Quy định quyền và nghĩa vụ của tổ chức, cá nhân trong bảo đảm ATTP; điều kiện bảo đảm an toàn đối với sản xuất, kinh doanh, nhập khẩu thực phẩm, ghi nhãn, kiểm nghiệm, cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP và trách nhiệm quản lý nhà nước.',
    keyArticles: [
      {
        article: 'Điều 19',
        title: 'Điều kiện bảo đảm an toàn thực phẩm đối với cơ sở sản xuất, kinh doanh thực phẩm',
        content: 'Địa điểm, diện tích thích hợp, cách biệt nguồn gây ô nhiễm; Nguồn nước đạt quy chuẩn; Đủ thiết bị xử lý nguyên liệu, bảo quản; Hệ thống xử lý chất thải; Tuân thủ quy định về sức khỏe, kiến thức nhân sự.',
      },
      {
        article: 'Điều 34',
        title: 'Đối tượng, điều kiện cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm',
        content: 'Cơ sở được cấp Giấy chứng nhận khi có đủ điều kiện bảo đảm ATTP phù hợp với từng loại hình và có đăng ký ngành nghề kinh doanh thực phẩm trong Giấy chứng nhận đăng ký kinh doanh.',
      },
      {
        article: 'Điều 36',
        title: 'Hồ sơ, trình tự, thủ tục cấp Giấy chứng nhận',
        content: 'Hồ sơ gồm: Đơn đề nghị; Bản sao Giấy ĐKKD; Bản thuyết minh cơ sở vật chất, thiết bị; Giấy xác nhận đủ sức khỏe của chủ cơ sở và nhân viên; Giấy xác nhận tập huấn kiến thức ATTP.',
      },
      {
        article: 'Điều 54',
        title: 'Truy xuất nguồn gốc thực phẩm đối với thực phẩm không bảo đảm an toàn',
        content: 'Thực hiện việc truy xuất nguồn gốc khi cơ quan nhà nước yêu cầu hoặc khi phát hiện thực phẩm do mình sản xuất, kinh doanh không bảo đảm an toàn theo nguyên tắc nhận diện lô hàng và thông báo toàn chuỗi.',
      },
    ],
  },
  {
    id: 'nghi-dinh-15-2018',
    code: 'Nghị định số 15/2018/NĐ-CP',
    title: 'Nghị định quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm',
    type: 'Nghị định Chính phủ',
    issuedDate: '02/02/2018',
    effectiveDate: '02/02/2018',
    summary: 'Quy định chi tiết thủ tục tự công bố sản phẩm, đăng ký bản công bố sản phẩm, cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP, miễn cấp Giấy chứng nhận ATTP, kiểm tra nhà nước thực phẩm nhập khẩu, phân công trách nhiệm quản lý nhà nước giữa Bộ Y tế, Bộ Nông nghiệp & PTNT và Bộ Công Thương.',
    keyArticles: [
      {
        article: 'Điều 4 & 5',
        title: 'Thủ tục tự công bố sản phẩm',
        content: 'Tổ chức, cá nhân tự công bố sản phẩm đã qua chế biến bao gói sẵn, phụ gia thực phẩm... kèm Phiếu kết quả kiểm nghiệm ATTP trong thời hạn 12 tháng do phòng kiểm nghiệm ISO 17025 cấp.',
      },
      {
        article: 'Điều 12',
        title: 'Các cơ sở không thuộc diện cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP',
        content: 'Bao gồm: Sản xuất ban đầu nhỏ lẻ; Kinh doanh không có địa điểm cố định; Sơ chế nhỏ lẻ; Kinh doanh nhỏ lẻ; Kinh doanh thực phẩm bao gói sẵn; Nhà hàng trong khách sạn; Bếp ăn tập thể không đăng ký kinh doanh; Kinh doanh thức ăn đường phố; Cơ sở đã được cấp GMP, HACCP, ISO 22000, IFS, BRC, FSSC 22000.',
      },
      {
        article: 'Điều 36',
        title: 'Nguyên tắc phân công trách nhiệm quản lý nhà nước về ATTP',
        content: 'Thống nhất quản lý xuyên suốt toàn bộ quá trình sản xuất, kinh doanh; Bảo đảm nguyên tắc một cửa, một sản phẩm, một cơ sở sản xuất kinh doanh chỉ chịu sự quản lý của một cơ quan quản lý nhà nước.',
      },
    ],
  },
  {
    id: 'nghi-dinh-43-111',
    code: 'Nghị định 43/2017/NĐ-CP & 111/2021/NĐ-CP',
    title: 'Nghị định về Nhãn hàng hóa (sửa đổi bổ sung năm 2021)',
    type: 'Nghị định Chính phủ',
    issuedDate: '14/04/2017 - 09/12/2021',
    effectiveDate: '15/02/2022',
    summary: 'Quy định nội dung, cách ghi và quản lý nhãn hàng hóa đối với hàng hóa lưu thông tại Việt Nam, hàng hóa nhập khẩu. Quy định bắt buộc đối với thực phẩm bao gói sẵn: Tên hàng hóa, Tên/Địa chỉ nhà sản xuất hoặc nhập khẩu, Xuất xứ, Định lượng, Ngày sản xuất, Hạn sử dụng, Thành phần/Thành phần định lượng, Hướng dẫn sử dụng và bảo quản.',
    keyArticles: [
      {
        article: 'Điều 10',
        title: 'Nội dung bắt buộc phải thể hiện trên nhãn hàng hóa',
        content: 'Tên hàng hóa; Tên và địa chỉ của tổ chức, cá nhân chịu trách nhiệm về hàng hóa; Xuất xứ hàng hóa; Các nội dung bắt buộc khác theo Phụ lục I tùy theo tính chất sản phẩm.',
      },
      {
        article: 'Phụ lục I (Số 2)',
        title: 'Nội dung bắt buộc đối với Thực phẩm',
        content: 'a) Định lượng; b) Ngày sản xuất; c) Hạn sử dụng; d) Thành phần hoặc thành phần định lượng; thành phần dinh dưỡng (nếu có); đ) Thông tin cảnh báo; e) Hướng dẫn sử dụng, hướng dẫn bảo quản.',
      },
    ],
  },
  {
    id: 'thong-tu-17-2021-bnnptnt',
    code: 'Thông tư số 17/2021/TT-BNNPTNT',
    title: 'Quy định về truy xuất nguồn gốc, thu hồi và xử lý thực phẩm không bảo đảm an toàn thuộc phạm vi quản lý của Bộ Nông nghiệp & PTNT',
    type: 'Thông tư Bộ Nông nghiệp & PTNT',
    issuedDate: '20/12/2021',
    effectiveDate: '02/02/2022',
    summary: 'Quy định chi tiết việc thiết lập hệ thống truy xuất nguồn gốc thực phẩm nông lâm thủy sản theo nguyên tắc "1 bước trước - 1 bước sau", quy trình thu hồi tự nguyện, thu hồi bắt buộc và hình thức xử lý sản phẩm sau thu hồi (khắc phục lỗi, chuyển mục đích sử dụng, tái xuất, tiêu hủy).',
    keyArticles: [
      {
        article: 'Điều 4 & 6',
        title: 'Yêu cầu lưu trữ thông tin truy xuất nguồn gốc',
        content: 'Lưu trữ thông tin lô hàng nhận (nhà cung cấp, ngày nhận, mã lô), lô hàng sản xuất và lô hàng giao (khách hàng, ngày giao). Thời gian lưu trữ tối thiểu: 06 tháng đối với thực phẩm tươi sống; 02 năm đối với thực phẩm đông lạnh, chế biến.',
      },
      {
        article: 'Điều 9 & 10',
        title: 'Hình thức và trình tự thu hồi thực phẩm',
        content: 'Gồm thu hồi tự nguyện (trong 24h dừng sản xuất/phân phối và thông báo hệ thống) và thu hồi bắt buộc theo quyết định cưỡng chế của cơ quan nhà nước.',
      },
    ],
  },
  {
    id: 'thong-tu-17-2024-bnnptnt',
    code: 'Thông tư số 17/2024/TT-BNNPTNT',
    title: 'Sửa đổi bổ sung quy định thẩm định, chứng nhận cơ sở sản xuất kinh doanh thực phẩm nông lâm thủy sản đủ điều kiện ATTP',
    type: 'Thông tư Bộ Nông nghiệp & PTNT',
    issuedDate: '28/11/2024',
    effectiveDate: '15/01/2025',
    summary: 'Cập nhật phân cấp thẩm quyền cấp Giấy chứng nhận ATTP và kiểm tra an toàn thực phẩm giữa Trung ương (Cục Chất lượng, Chế biến và Phát triển thị trường) và địa phương; hướng dẫn quy trình thẩm định trực tuyến/trực tiếp và biểu mẫu thẩm định mới.',
    keyArticles: [
      {
        article: 'Điều 5',
        title: 'Thẩm quyền cấp, thu hồi Giấy chứng nhận ATTP',
        content: 'Cơ quan Trung ương chứng nhận cho cơ sở xuất khẩu trực tiếp; Cơ quan chuyên môn cấp tỉnh chứng nhận cho các cơ sở sản xuất kinh doanh nông lâm thủy sản trên địa bàn.',
      },
      {
        article: 'Điều 12',
        title: 'Hồ sơ xin cấp Giấy chứng nhận',
        content: 'Chủ cơ sở tổ chức tập huấn kiến thức ATTP cho người lao động và tự xác nhận. Hồ sơ nộp qua Cổng dịch vụ công trực tuyến, bưu điện hoặc nộp trực tiếp.',
      },
    ],
  },
  {
    id: 'nghi-dinh-181-2013',
    code: 'Nghị định số 181/2013/NĐ-CP',
    title: 'Nghị định quy định chi tiết thi hành một số điều của Luật Quảng cáo',
    type: 'Nghị định Chính phủ',
    issuedDate: '14/11/2013',
    effectiveDate: '01/01/2014',
    summary: 'Quy định chi tiết điều kiện quảng cáo thực phẩm, thực phẩm chức năng, thực phẩm bảo vệ sức khỏe, sản phẩm sữa và sản phẩm dinh dưỡng dùng cho trẻ nhỏ. Quy định thủ tục đăng ký xác nhận nội dung quảng cáo và các hành vi bị cấm.',
    keyArticles: [
      {
        article: 'Điều 5',
        title: 'Quảng cáo thực phẩm, phụ gia thực phẩm',
        content: 'Quảng cáo thực phẩm phải có Giấy xác nhận nội dung quảng cáo. Đối với Thực phẩm bảo vệ sức khỏe, quảng cáo trên mọi phương tiện bắt buộc phải có câu khuyến cáo: "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh".',
      },
      {
        article: 'Điều 12',
        title: 'Các hành vi cấm trong quảng cáo thực phẩm',
        content: 'Cấm quảng cáo thực phẩm gây hiểu nhầm là thuốc chữa bệnh; cấm sử dụng hình ảnh, uy tín, thư cảm ơn của bác sĩ, dược sĩ, cơ sở y tế để quảng cáo thực phẩm.',
      },
    ],
  },
  {
    id: 'thong-tu-17-2018-bnnptnt',
    code: 'Thông tư số 17/2018/TT-BNNPTNT',
    title: 'Quy định về phương thức quản lý điều kiện bảo đảm ATTP đối với cơ sở sản xuất kinh doanh nông lâm thủy sản không thuộc diện cấp Giấy chứng nhận đủ điều kiện ATTP',
    type: 'Thông tư Bộ Nông nghiệp & PTNT',
    issuedDate: '31/10/2018',
    effectiveDate: '01/01/2019',
    summary: 'Quy định việc ký Bản cam kết sản xuất, kinh doanh thực phẩm an toàn đối với cơ sở sản xuất ban đầu nhỏ lẻ, cơ sở sơ chế/kinh doanh nhỏ lẻ, bán hàng bao gói sẵn không có địa điểm cố định. Phân công UBND cấp xã/huyện quản lý và kiểm tra.',
    keyArticles: [
      {
        article: 'Điều 3 & 4',
        title: 'Ký Bản cam kết sản xuất kinh doanh thực phẩm an toàn',
        content: 'Chủ cơ sở không thuộc diện cấp GCN phải tổ chức ký Bản cam kết (Mẫu Phụ lục I) định kỳ 3 năm/lần gửi UBND cấp xã hoặc Trạm Chăn nuôi/Trồng trọt địa phương lưu theo dõi.',
      },
      {
        article: 'Điều 6',
        title: 'Kiểm tra việc thực hiện cam kết',
        content: 'Cơ quan được giao nhiệm vụ thực hiện kiểm tra đột xuất hoặc định kỳ (không quá 1 lần/năm) việc chấp hành các nội dung đã cam kết.',
      },
    ],
  },
];
