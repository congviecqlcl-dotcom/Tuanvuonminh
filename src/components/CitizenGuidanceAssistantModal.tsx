import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Sparkles, Scale, CheckCircle2, AlertTriangle, FileText, BookOpen, Lightbulb, UserCheck, ShieldCheck, HelpCircle, Users, PanelLeftClose, PanelLeft, Type, Loader2 } from 'lucide-react';
import { evaluateProductionCapacity, evaluateHumanCapacity, OperationType, OperationScale } from '../data/agriCapacityData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  timestamp: string;
  type?: 'NORMAL' | 'CAPACITY_CHECK' | 'HUMAN_CHECK' | 'DOSSIER_LIST' | 'WARNING';
  details?: any;
  isThinking?: boolean;
}

const SYSTEM_PROMPT_DOSSIER_AUDITOR = `
Bạn là Chuyên gia & Công chức Thẩm định Hồ sơ An toàn Thực phẩm & Năng lực Sản xuất Nông nghiệp (thuộc Chi cục Quản lý Chất lượng Nông Lâm sản & Thủy sản / Sở Y tế / Sở NN&PTNT).
Nhiệm vụ của bạn là thẩm định trực tiếp, giải đáp vướng mắc và kiểm tra tính hợp pháp, tính khả thi sinh học, định mức nhân sự con người cho Doanh nghiệp, HTX, Bếp ăn tập thể, và Người dân trước khi nộp hồ sơ xin cấp Giấy chứng nhận ATTP.

BẮT BUỘC trả lời theo phong cách thẩm định chuyên nghiệp, sâu sát và cụ thể (bằng tiếng Việt):

1. 🔍 **Kết luận Thẩm định Chuyên môn:**
   - Nêu rõ một trong các trạng thái: [✅ HỢP LỆ & ĐẠT CHUẨN] hoặc [⚠️ CẦN BỔ SUNG / LÀM RÕ] hoặc [🚨 BẤT HỢP LÝ HOẶC THIẾU HỤT NGHIÊM TRỌNG].
   - Đưa ra nhận xét nghiệp vụ trực diện, chỉ rõ điểm được và điểm vi phạm/thiếu sót.

2. ⚖️ **Căn cứ Pháp lý & Quy chuẩn Kỹ thuật:**
   - Trích dẫn chính xác các văn bản quy phạm pháp luật: Nghị định 15/2018/NĐ-CP, Luật An toàn thực phẩm 2010 (Điều 9, 10, 11, 12...), Thông tư 38/2018/TT-BNNPTNT, Thông tư 24/2019/TT-BYT, QCVN...

3. 🔢 **Định mức Kỹ thuật & Con số Cụ thể:**
   - Cung cấp số liệu cụ thể: diện tích m² vs năng suất kg/ngày, mật độ chăn nuôi/trồng trọt, định mức công việc kg/công nhân/ngày hoặc suất ăn/công nhân/ngày, yêu cầu bắt buộc 100% Giấy khám sức khỏe & Tập huấn ATTP.

4. 💡 **Hướng dẫn Khắc phục & Hoàn thiện Hồ sơ:**
   - Nêu danh mục các giấy tờ, hợp đồng liên kết thu mua, sơ đồ quy trình 1 chiều, quyết định phân công Cán bộ Kỹ thuật/QC... để cơ sở hoàn thiện và NỘP 1 LẦN LÀ DUYỆT NGAY.

Yêu cầu định dạng: Sử dụng Markdown rõ ràng, dùng các ký hiệu đầu dòng, in đậm các nội dung quan trọng. TUYỆT ĐỐI KHÔNG trả lời chung chung, không dùng câu từ đại khái.
`;

function generateOfflineAuditorResponse(query: string, ctx?: { cropType?: string; areaInput?: number; dailyKgInput?: number; humanOpType?: OperationType; humanScale?: OperationScale; workersInput?: number; volumeInput?: number }): string {
  const lower = query.toLowerCase();

  if (lower.includes('nhân sự') || lower.includes('lao động') || lower.includes('con người') || lower.includes('công nhân') || lower.includes('khám sức khỏe') || lower.includes('tập huấn') || lower.includes('định mức')) {
    const opType = ctx?.humanOpType || 'CHE_BIEN';
    const scale = ctx?.humanScale || 'VUA';
    const workers = ctx?.workersInput || 3;
    const volume = ctx?.volumeInput || 350;

    const res = evaluateHumanCapacity({
      operationType: opType,
      scale: scale,
      totalWorkers: workers,
      hasTechnicalOfficer: false,
      healthCheckRatio: 100,
      attpTrainedRatio: 100,
      dailyCapacityVolume: volume,
      unitLabel: opType === 'CHE_BIEN' ? 'suất/ngày' : 'kg/ngày'
    });

    return `👥 **BÁO CÁO THẨM ĐỊNH NĂNG LỰC CON NGƯỜI & NHÂN SỰ LAO ĐỘNG**\n\n` +
      `🔍 **1. Kết luận Thẩm định & Định mức Lao động:**\n` +
      `- **Loại hình cơ sở:** ${res.operationTypeLabel}\n` +
      `- **Quy mô đăng ký:** ${res.scaleLabel}\n` +
      `- **Khai báo thực tế:** ${workers} lao động / Xử lý ${volume.toLocaleString('vi-VN')} ${opType === 'CHE_BIEN' ? 'suất ăn/ngày' : 'kg/ngày'}\n` +
      `- **Mức áp lực công việc:** **${res.actualVolumePerWorker.toLocaleString('vi-VN')}** ${opType === 'CHE_BIEN' ? 'suất' : 'kg'}/người/ngày (Ngưỡng an toàn khuyến cáo: ≤ **${res.maxRecommendedDailyVolumePerWorker}**)\n` +
      `- **Yêu cầu nhân sự tối thiểu quy định:** **${res.requiredMinWorkers} người**\n\n` +
      (res.status === 'CRITICAL_DEFICIT'
        ? `🚨 **ĐÁNH GIÁ: THIẾU HỤT NGHIÊM TRỌNG NĂNG LỰC CON NGƯỜI!**\nSản lượng/suất ăn khai báo vượt quá định mức lao động an toàn. Công chức thẩm định sẽ **TRẢ LẠI HỒ SƠ** do nguy cơ cao gây mất an toàn thực phẩm & lây nhiễm chéo.\n\n`
        : res.status === 'WARNING'
        ? `⚠️ **ĐÁNH GIÁ: CẢNH BÁO QUÁ TẢI NHÂN SỰ!**\nSố lượng công nhân tiệm cận trần định mức lao động. Cần bổ sung nhân sự dự phòng hoặc cán bộ Kỹ thuật/QC chuyên trách.\n\n`
        : `✅ **ĐÁNH GIÁ: HỢP LỆ & ĐẠT CHUẨN ĐỊNH MỨC!**\nĐịnh mức lao động phù hợp với quy mô và khối lượng xử lý khai báo.\n\n`) +
      `⚖️ **2. Căn cứ Pháp lý Bắt buộc:**\n` +
      `- **Điều 9, 10, 11 - Luật An toàn Thực phẩm 2010:** Quy định bắt buộc về điều kiện con người trực tiếp sản xuất, kinh doanh thực phẩm.\n` +
      `- **Thông tư 38/2018/TT-BNNPTNT & Thông tư 24/2019/TT-BYT:** Quy định 100% nhân sự trực tiếp phải có Giấy khám sức khỏe định kỳ & Giấy xác nhận tập huấn kiến thức ATTP.\n\n` +
      `💡 **3. Hướng dẫn Khắc phục để Duyệt Hồ sơ 100%:**\n` +
      `1. Bổ sung Giấy khám sức khỏe (theo Thông tư 14/2013/TT-BYT) và Giấy xác nhận tập huấn ATTP còn hạn hiệu lực.\n` +
      `2. Nếu quy mô vừa hoặc lớn, bổ sung Cán bộ Kỹ thuật / Quản lý Chất lượng (QC) có bằng cấp Trung cấp/Đại học chuyên ngành Công nghệ thực phẩm, Bằng Bác sĩ Thú y, hoặc Agronomy.\n` +
      `3. Cập nhật Bảng phân công nhiệm vụ nhân sự chi tiết trong Bản thuyết minh cơ sở.`;
  }

  if (lower.includes('diện tích') || lower.includes('sản lượng') || lower.includes('sinh học') || lower.includes('rau') || lower.includes('lợn') || lower.includes('gà') || lower.includes('kg/ngày') || lower.includes('vô lý')) {
    const area = ctx?.areaInput || 360;
    const dailyKg = ctx?.dailyKgInput || 200;
    const crop = ctx?.cropType || 'RAU_AN_LA';

    const res = evaluateProductionCapacity(crop, area, dailyKg, 'kg', 5);

    return `🌾 **BÁO CÁO THẨM ĐỊNH NĂNG LỰC SINH HỌC & ĐỊNH MỨC NĂNG SUẤT**\n\n` +
      `🔍 **1. Kết luận Thẩm định Năng lực Sinh học:**\n` +
      `- **Mô hình / Cây trồng:** ${res.normUsed.categoryName}\n` +
      `- **Diện tích đất canh tác:** ${area.toLocaleString('vi-VN')} m²\n` +
      `- **Cam kết giao hàng:** **${dailyKg.toLocaleString('vi-VN')} kg/ngày** (~${(dailyKg * 365 / 1000).toFixed(1)} tấn/năm)\n` +
      `- **Năng suất sinh học tối đa thực tế:** **~${res.maxFeasibleDailyVolume.toLocaleString('vi-VN')} kg/ngày** (Định mức Bộ NN&PTNT: ${res.normUsed.yieldPerCropPerM2} kg/m²/vụ, ${res.normUsed.cropsPerYear} vụ/năm)\n\n` +
      (res.status === 'CRITICAL_ANOMALY'
        ? `🚨 **ĐÁNH GIÁ: BẤT HỢP LÝ NGHIÊM TRỌNG (GẤP ${res.discrepancyRatio} LẦN ĐỊNH MỨC SINH HỌC)!**\nDiện tích ${area} m² hoàn toàn KHÔNG THỂ sản xuất ra ${dailyKg} kg/ngày. Hồ sơ có dấu hiệu mạo danh nguồn gốc sản xuất an toàn và sẽ bị **BÁC BỎ NGAY LẬP TỨC**.\n\n`
        : `✅ **ĐÁNH GIÁ: HỢP LÝ BIOLOGICAL!**\nSản lượng hợp đồng nằm trong ngưỡng khả thi sinh học của diện tích đất.\n\n`) +
      `⚖️ **2. Căn cứ Quy chuẩn Kỹ thuật:**\n` +
      `- **Quyết định Định mức Kinh tế - Kỹ thuật Trồng trọt / Chăn nuôi - Bộ NN&PTNT.**\n` +
      `- **Thông tư 38/2018/TT-BNNPTNT:** Quy định về thẩm định, kiểm tra cơ sở sản xuất nông lâm thủy sản.\n\n` +
      `💡 **3. Hướng dẫn Điều chỉnh Hồ sơ:**\n` +
      `1. **Nếu sản lượng gom từ nhiều hộ:** Bổ sung Hợp đồng liên kết thu mua + Danh sách các hộ nông dân vệ tinh (ghi rõ diện tích & địa chỉ từng hộ).\n` +
      `2. **Nếu tự sản xuất 100%:** Điều chỉnh con số cam kết trong Hợp đồng kinh tế giảm xuống dưới **${res.maxFeasibleDailyVolume} kg/ngày** để tương xứng với diện tích ${area} m².`;
  }

  if (lower.includes('bếp ăn') || lower.includes('suất ăn') || lower.includes('mầm non') || lower.includes('trường học') || lower.includes('công ty')) {
    return `🍱 **THẨM ĐỊNH ĐIỀU KIỆN ATTP BẾP ĂN TẬP THỂ & SUẤT ĂN CÔNG NGHIỆP**\n\n` +
      `🔍 **1. Yêu cầu Mặt bằng & Nguyên tắc Bếp 1 chiều:**\n` +
      `- Bếp ăn BẮT BUỘC thiết kế theo **nguyên tắc 1 chiều**: *Khu tiếp nhận nguyên liệu ➔ Khu sơ chế thô ➔ Khu chế biến nhiệt ➔ Khu chia suất/đóng gói ➔ Khu phục vụ & Dụng cụ bẩn*.\n` +
      `- Tuyệt đối không để lối đi của thực phẩm sống cắt ngang lối đi của thực phẩm chín.\n\n` +
      `👥 **2. Định mức Lao động & Nhân sự:**\n` +
      `- **Dưới 100 suất/ngày:** Tối thiểu 2 công nhân trực tiếp.\n` +
      `- **Từ 100 - 500 suất/ngày:** Tối thiểu 5 - 8 công nhân + 1 Bếp trưởng/Cán bộ quản lý ATTP.\n` +
      `- **Trên 500 suất/ngày:** Tối thiểu 12 - 18 công nhân + Cán bộ QC/Kỹ thuật phụ trách lưu mẫu & kiểm thực.\n\n` +
      `⚖️ **3. Hồ sơ Pháp lý & Sổ sách Bắt buộc:**\n` +
      `- **Lưu mẫu thức ăn 24 giờ:** Dụng cụ lưu mẫu inox/thủy tinh có nắp đậy, niêm phong, tủ lạnh lưu mẫu riêng biệt, dung tích mẫu ≥ 100g (mẫu lỏng ≥ 150ml).\n` +
      `- **Sổ kiểm thực 3 bước:** Bước 1 (Kiểm tra nguyên liệu nhập vào) ➔ Bước 2 (Kiểm tra trước khi chế biến) ➔ Bước 3 (Kiểm tra trước khi ăn).\n` +
      `- **100% Nhân sự:** Giấy khám sức khỏe định kỳ & Xác nhận tập huấn kiến thức ATTP.`;
  }

  if (lower.includes('hồ sơ') || lower.includes('giấy tờ') || lower.includes('thành phần') || lower.includes('tài liệu') || lower.includes('xin cấp')) {
    return `📋 **DANH MỤC HỒ SƠ CHUẨN MỰC XIN CẤP GIẤY CHỨNG NHẬN ATTP (Nghị định 15/2018/NĐ-CP)**\n\n` +
      `1. 📝 **Đơn đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP** (Mẫu 01 - NĐ 15/2018).\n` +
      `2. 📑 **Bản sao Giấy chứng nhận Đăng ký kinh doanh** (Doanh nghiệp/Hộ kinh doanh/HTX).\n` +
      `3. 🏢 **Bản thuyết minh về cơ sở vật chất, trang thiết bị, dụng cụ:**\n` +
      `   - Sơ đồ mặt bằng tổng thể & Sơ đồ quy trình sản xuất một chiều.\n` +
      `   - Danh mục chi tiết trang thiết bị, dụng cụ inox/nhựa thực phẩm tiếp xúc trực tiếp.\n` +
      `4. 🩺 **Danh sách & Giấy xác nhận đủ sức khỏe** của Chủ cơ sở & Người trực tiếp sản xuất (Đạt 100%).\n` +
      `5. 🎓 **Danh sách & Giấy xác nhận tập huấn kiến thức ATTP** (Đạt 100%).\n` +
      `6. 🤝 **Hợp đồng cung cấp nguyên liệu đầu vào / Hóa đơn chứng từ nguồn gốc:** Hợp đồng mua bán VietGAP, chứng nhận HACCP/ISO 22000 hoặc Giấy ATTP của đơn vị cung ứng.`;
  }

  return `🔍 **BÁO CÁO TƯ VẤN THẨM ĐỊNH HỒ SƠ & NĂNG LỰC CƠ SỞ ATTP**\n\n` +
    `Cảm ơn bạn đã gửi câu hỏi vướng mắc: *"Nội dung: ${query}"*\n\n` +
    `⚖️ **1. Căn cứ Pháp lý Chuẩn mực:**\n` +
    `- **Nghị định 15/2018/NĐ-CP:** Quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm.\n` +
    `- **Luật An toàn Thực phẩm số 55/2010/QH12:** Quy định về quyền, nghĩa vụ và điều kiện bảo đảm ATTP.\n` +
    `- **Thông tư 38/2018/TT-BNNPTNT & Thông tư 24/2019/TT-BYT:** Quy định về kiểm tra, thẩm định cơ sở.\n\n` +
    `📌 **2. Tiêu chí Đánh giá Chuyên môn để Hồ sơ được duyệt Ngay:**\n` +
    `1. **Đồng nhất 100% Thông tin:** Mã số thuế, Tên Doanh nghiệp/HKD, Địa chỉ sản xuất trên ĐKKD phải TRÙNG KHỚP HOÀN TOÀN với Bản thuyết minh và Đơn đề nghị.\n` +
    `2. **Tính Hợp lý Năng lực Sinh học:** Diện tích trồng trọt/chuồng trại/ao nuôi phải tương thích với sản lượng cam kết giao hàng (Tránh ghi chênh lệch quá 2 lần so với định mức kỹ thuật).\n` +
    `3. **Tính Chuẩn mực Năng lực Con người:** 100% lực lượng công nhân trực tiếp có Giấy khám sức khỏe & Giấy tập huấn ATTP còn thời hạn hiệu lực. Số lượng lao động phải cân đối với khối lượng làm việc.\n` +
    `4. **Sơ đồ Quy trình 1 chiều:** Đảm bảo không chồng chéo giữa khu thô và khu tinh, trang bị đầy đủ dụng cụ rửa tay, xà phòng, cồn sát khuẩn & sấy khô.\n\n` +
    `💡 **Đề xuất hành động:** Bạn có thể sử dụng **Công cụ Tự kiểm tra Năng lực** ở thanh bên trái để tính toán chính xác định mức trước khi chính thức nộp hồ sơ!`;
}

export default function CitizenGuidanceAssistantModal({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'BOT',
      text: 'Xin chào! Tôi là Trợ lý AI Hướng dẫn Lập Hồ sơ ATTP chuyên sâu. Tôi giúp bạn giải đáp vướng mắc, kiểm tra hồ sơ đúng pháp luật và thẩm định **Năng lực Sinh học** (diện tích, sản lượng) cũng như **Năng lực Con người** (số lao động, khám sức khỏe & tập huấn ATTP 100%). Bạn cần tôi tư vấn vướng mắc nào?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isExpandedFont, setIsExpandedFont] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'CHAT' | 'TOOLS'>('CHAT');

  // Form thử nghiệm tính toán năng lực sinh học trực tiếp
  const [cropType, setCropType] = useState<string>('RAU_AN_LA');
  const [areaInput, setAreaInput] = useState<number>(360);
  const [dailyKgInput, setDailyKgInput] = useState<number>(200);
  const [varietiesInput, setVarietiesInput] = useState<number>(5);

  // Form thử nghiệm năng lực con người
  const [activeLeftTool, setActiveLeftTool] = useState<'BIO' | 'HUMAN'>('BIO');
  const [humanOpType, setHumanOpType] = useState<OperationType>('CHE_BIEN');
  const [humanScale, setHumanScale] = useState<OperationScale>('VUA');
  const [workersInput, setWorkersInput] = useState<number>(3);
  const [volumeInput, setVolumeInput] = useState<number>(350);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const thinkingMsgId = `b-think-${Date.now()}`;
    const thinkingMsg: ChatMessage = {
      id: thinkingMsgId,
      sender: 'BOT',
      text: '⏳ *AI Thẩm định viên đang phân tích câu hỏi & đối chiếu định mức kỹ thuật / quy định pháp lý...*',
      timestamp: 'Đang xử lý...',
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    if (!textToSend) setInputQuery('');
    setMobileTab('CHAT');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT_DOSSIER_AUDITOR,
          userPrompt: `Câu hỏi/Vướng mắc của Doanh nghiệp/Người dân: "${q}"\n\nThông số tham chiếu hiện tại (nếu có):\n- Loại cây/mô hình: ${cropType}\n- Diện tích: ${areaInput} m2, Sản lượng cam kết: ${dailyKgInput} kg/ngày\n- Loại hình nhân sự: ${humanOpType}, Quy mô: ${humanScale}, Công nhân: ${workersInput} người, Khối lượng: ${volumeInput}`,
        }),
      });

      const data = await response.json();
      let aiText = data?.raw || '';

      if (!aiText || aiText.trim().length < 25) {
        aiText = generateOfflineAuditorResponse(q, {
          cropType,
          areaInput,
          dailyKgInput,
          humanOpType,
          humanScale,
          workersInput,
          volumeInput,
        });
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'BOT',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => prev.map((m) => (m.id === thinkingMsgId ? botMsg : m)));
    } catch (err) {
      const fallbackText = generateOfflineAuditorResponse(q, {
        cropType,
        areaInput,
        dailyKgInput,
        humanOpType,
        humanScale,
        workersInput,
        volumeInput,
      });

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'BOT',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => prev.map((m) => (m.id === thinkingMsgId ? botMsg : m)));
    }
  };

  const renderFormattedText = (rawText: string) => {
    const parts = rawText.split('\n');
    return parts.map((line, idx) => {
      // Bold formatting replacing **text**
      const boldSegments = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = boldSegments.map((seg, sIdx) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={sIdx} className="font-bold">{seg.slice(2, -2)}</strong>;
        }
        return seg;
      });

      return (
        <React.Fragment key={idx}>
          {renderedLine}
          {idx < parts.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 md:p-4">
      <div className="relative w-full max-w-[96vw] lg:max-w-6xl xl:max-w-7xl h-[92vh] flex flex-col rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shrink-0">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold">
                  Trợ Lý AI Hướng Dẫn Chuẩn Bị Hồ Sơ ATTP (Citizen & Business Assistant)
                </h2>
                <span className="rounded-full bg-blue-500/30 border border-blue-400/50 px-2.5 py-0.5 text-[11px] font-bold text-blue-200 flex items-center gap-1">
                  <Sparkles size={12} /> Hướng Dẫn Năng Lực Con Người & Sinh Học
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Tư vấn người dân, hộ kinh doanh & HTX chuẩn bị hồ sơ hợp lệ, hợp lý sinh học & nhân sự trước khi nộp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Thu gọn thanh công cụ bên trái để mở rộng khung đọc" : "Mở thanh công cụ bên trái"}
              className="hidden md:flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
              <span>{isSidebarOpen ? 'Thu gọn công cụ' : 'Mở công cụ'}</span>
            </button>

            <button
              onClick={() => setIsExpandedFont(!isExpandedFont)}
              title="Thay đổi cỡ chữ tin nhắn"
              className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors"
            >
              <Type size={16} />
              <span className="hidden sm:inline">{isExpandedFont ? 'Chữ vừa' : 'Chữ lớn'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switching Bar (Visible on mobile/tablet screens < md) */}
        <div className="flex md:hidden border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5 shrink-0 text-xs font-bold">
          <button
            onClick={() => setMobileTab('CHAT')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'CHAT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            <Bot size={16} /> Trò chuyện AI & Hỏi đáp
          </button>
          <button
            onClick={() => setMobileTab('TOOLS')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'TOOLS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 bg-white border border-slate-200'
            }`}
          >
            <Sparkles size={16} /> Công cụ Tự kiểm tra
          </button>
        </div>

        {/* Content Body Grid with min-h-0 for proper CSS scrolling */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Left Sidebar: Quick Testing Tools */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 bg-slate-50 p-4 md:p-5 overflow-y-auto min-h-0 space-y-4 shrink-0 transition-all ${
            mobileTab === 'TOOLS' ? 'block' : 'hidden md:block'
          } ${isSidebarOpen ? '' : 'md:hidden'}`}>
            {/* Tool Switcher */}
              <div className="flex rounded-lg bg-slate-200 p-1 gap-1 text-xs font-bold">
                <button
                  onClick={() => setActiveLeftTool('BIO')}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeLeftTool === 'BIO' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scale size={13} /> Năng lực Sinh học
                </button>
                <button
                  onClick={() => setActiveLeftTool('HUMAN')}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeLeftTool === 'HUMAN' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users size={13} /> Năng lực Con người
                </button>
              </div>

              {activeLeftTool === 'BIO' ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                    <Scale size={16} className="text-amber-600 shrink-0" />
                    Công cụ Tự kiểm tra Năng lực Sinh học trước khi Nộp:
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Nhập thông số mô hình của bạn để Trợ lý AI kiểm tra xem sản lượng dự kiến có bị <strong>coi là bất hợp lý</strong> khi thẩm định hay không:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Loại cây trồng / Mô hình:</label>
                      <select
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="RAU_AN_LA">Rau ăn lá (Rau cải, xà lách, rau muống...)</option>
                        <option value="RAU_AN_QUA">Rau ăn quả (Cà chua, dưa leo, ớt, bí...)</option>
                        <option value="RAU_AN_CU">Rau ăn củ (Cà rốt, khoai tây, củ cải...)</option>
                        <option value="LON_THIT">Chăn nuôi Lợn thịt thương phẩm</option>
                        <option value="GA_THIT">Chăn nuôi Gà thịt thương phẩm</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Diện tích đất (m²):</label>
                        <input
                          type="number"
                          value={areaInput}
                          onChange={(e) => setAreaInput(Number(e.target.value))}
                          className="w-full rounded-md border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Sản lượng giao (kg/ngày):</label>
                        <input
                          type="number"
                          value={dailyKgInput}
                          onChange={(e) => setDailyKgInput(Number(e.target.value))}
                          className="w-full rounded-md border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendMessage(`Tôi có diện tích ${areaInput}m2 trồng ${cropType}, muốn cam kết giao ${dailyKgInput}kg/ngày thì có bất hợp lý không?`)}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 p-2 text-xs font-bold text-white shadow-2xs transition-colors"
                    >
                      <Sparkles size={14} /> Kiểm tra Năng lực Sinh học Ngay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-blue-950 text-xs">
                    <Users size={16} className="text-blue-600 shrink-0" />
                    Tự kiểm tra Năng lực Con người (Loại hình & Quy mô):
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Đánh giá xem số lượng công nhân và định mức công việc có phù hợp với <strong>Loại hình</strong> và <strong>Quy mô</strong> đăng ký hay không:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Loại hình hoạt động:</label>
                      <select
                        value={humanOpType}
                        onChange={(e) => setHumanOpType(e.target.value as OperationType)}
                        className="w-full rounded-md border border-slate-300 bg-white p-2 font-semibold focus:border-blue-500 focus:outline-none"
                      >
                        <option value="SAN_XUAT">Sản xuất (Trồng trọt, Chăn nuôi, Thủy sản)</option>
                        <option value="SO_CHE">Sơ chế, Phân loại & Đóng gói</option>
                        <option value="CHE_BIEN">Chế biến thực phẩm / Bếp ăn / Suất ăn</option>
                        <option value="KINH_DOANH">Kinh doanh, Siêu thị & Phân phối</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Quy mô cơ sở:</label>
                      <select
                        value={humanScale}
                        onChange={(e) => setHumanScale(e.target.value as OperationScale)}
                        className="w-full rounded-md border border-slate-300 bg-white p-2 font-semibold focus:border-blue-500 focus:outline-none"
                      >
                        <option value="NHO_LE">Nhỏ lẻ / Hộ gia đình</option>
                        <option value="VUA">Quy mô Vừa</option>
                        <option value="LON">Quy mô Lớn / Công nghiệp</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Số lao động (người):</label>
                        <input
                          type="number"
                          value={workersInput}
                          onChange={(e) => setWorkersInput(Number(e.target.value))}
                          className="w-full rounded-md border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Khối lượng ({humanOpType === 'CHE_BIEN' ? 'suất/ngày' : 'kg/ngày'}):</label>
                        <input
                          type="number"
                          value={volumeInput}
                          onChange={(e) => setVolumeInput(Number(e.target.value))}
                          className="w-full rounded-md border border-slate-300 bg-white p-2 focus:border-blue-500 focus:outline-none font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendMessage(`Tôi đăng ký mô hình ${humanOpType} quy mô ${humanScale}, có ${workersInput} lao động để xử lý ${volumeInput} ${humanOpType === 'CHE_BIEN' ? 'suất/ngày' : 'kg/ngày'} thì có đủ năng lực con người không?`)}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 p-2 text-xs font-bold text-white shadow-2xs transition-colors"
                    >
                      <Users size={14} /> Kiểm tra Năng lực Con người Ngay
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle size={14} /> Câu hỏi tư vấn phổ biến:
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage('Định mức nhân sự lao động đối với xưởng sơ chế quy mô vừa là bao nhiêu?')}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-800 font-medium transition-colors"
                  >
                    🧺 Định mức nhân sự cho Xưởng Sơ chế thực phẩm quy mô vừa?
                  </button>
                  <button
                    onClick={() => handleSendMessage('Bếp ăn mầm non phục vụ 350 suất ăn/ngày thì cần đăng ký bao nhiêu công nhân chế biến?')}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-800 font-medium transition-colors"
                  >
                    🍱 Định mức nhân sự chế biến cho 350 suất ăn/ngày?
                  </button>
                  <button
                    onClick={() => handleSendMessage('Toàn bộ nhân sự trực tiếp có bắt buộc phải Khám sức khỏe và Tập huấn ATTP 100% không?')}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs text-slate-800 font-medium transition-colors"
                  >
                    🩺 Quy định khám sức khỏe và tập huấn ATTP cho 100% công nhân?
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1 text-blue-950">
                  <BookOpen size={14} className="text-blue-600" /> Lợi ích của việc tự kiểm tra trước:
                </div>
                <ul className="pl-4 list-disc space-y-1 text-[11px] text-blue-950/90">
                  <li>Tiết kiệm 80% thời gian xử lý thủ tục hành chính.</li>
                  <li>Không bị từ chối hồ sơ vì sai lệch diện tích vs sản lượng.</li>
                  <li>Đảm bảo chuẩn điều kiện con người theo Luật ATTP 2010.</li>
                </ul>
              </div>
            </div>

          {/* Right Main Chat Area with flex-1 min-h-0 overflow-hidden */}
          <div className={`flex-1 flex flex-col h-full min-h-0 bg-white overflow-hidden ${
            mobileTab === 'CHAT' ? 'flex' : 'hidden md:flex'
          }`}>
            {/* Top Bar inside Chat to show active view mode */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 md:px-5 py-2.5 shrink-0 text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Bot size={16} className="text-blue-600" /> Khung tương tác Trợ lý AI
              </span>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex text-blue-700 font-bold hover:underline items-center gap-1 text-xs"
              >
                {isSidebarOpen ? 'Thu gọn công cụ bên trái ➔' : '🡨 Mở lại công cụ bên trái'}
              </button>
            </div>

            {/* Messages Feed - Scrollable container */}
            <div className="flex-1 p-5 md:p-8 overflow-y-auto space-y-5 min-h-0 scroll-smooth">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[96%] md:max-w-[92%] lg:max-w-[88%] rounded-2xl p-5 shadow-2xs transition-all ${
                    isExpandedFont ? 'text-base leading-relaxed' : 'text-sm leading-relaxed'
                  } ${
                    m.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2.5 border-b border-black/10 pb-2 font-bold text-xs opacity-80">
                      {m.sender === 'BOT' ? (
                        <span className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                          <Bot size={16} /> Trợ lý AI Hướng dẫn
                        </span>
                      ) : (
                        <span className="text-xs">Bạn (Doanh nghiệp/Người dân)</span>
                      )}
                      <span className="ml-auto text-xs font-normal opacity-70">{m.timestamp}</span>
                    </div>

                    <div className="font-normal text-slate-800 leading-relaxed">
                      {m.isThinking ? (
                        <div className="flex items-center gap-2 text-blue-700 font-medium italic py-1">
                          <Loader2 size={16} className="animate-spin text-blue-600" />
                          <span>AI đang phân tích câu hỏi & đối chiếu định mức quy định...</span>
                        </div>
                      ) : (
                        renderFormattedText(m.text)
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Footer */}
            <div className="border-t-2 border-blue-500/30 p-3.5 md:p-4 bg-slate-50 shrink-0 shadow-lg z-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 md:gap-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="💬 Nhập câu hỏi vướng mắc của bạn tại đây..."
                    className="w-full rounded-xl border-2 border-blue-400 bg-white px-4 py-3 text-xs md:text-sm text-slate-900 font-medium placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 md:px-6 py-3 text-xs md:text-sm font-bold text-white shadow-md transition-all shrink-0"
                >
                  <Send size={16} /> <span className="hidden sm:inline">Gửi câu hỏi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

