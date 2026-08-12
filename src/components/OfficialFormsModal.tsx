import React, { useState } from 'react';
import { X, Printer, Download, FileCheck, AlertCircle, FileText } from 'lucide-react';
import { ExpandedItem, ConfirmedRecord } from '../types';
import { printElement, exportToWord } from '../utils/printAndExport';

interface OfficialFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coSoName: string;
  thuyetMinhName: string;
  ketQua: ExpandedItem[];
  confirmed: Record<string, ConfirmedRecord>;
}

export default function OfficialFormsModal({
  isOpen,
  onClose,
  coSoName,
  thuyetMinhName,
  ketQua,
  confirmed,
}: OfficialFormsModalProps) {
  const [activeForm, setActiveForm] = useState<'thong_bao' | 'bien_ban' | 'du_thao_qd'>('thong_bao');
  const [officerName, setOfficerName] = useState('Nguyễn Văn Bình');
  const [officerTitle, setOfficerTitle] = useState('Chuyên viên Thẩm định Hồ sơ ATTP');
  const [docNumber, setOfficerDocNumber] = useState('105/TB-ATTP');

  if (!isOpen) return null;

  const getEffectiveKetQua = (k: ExpandedItem) => confirmed[k.checklist_id]?.ketQua || k.ket_qua_danh_gia;

  const itemsCanLamRo = ketQua.filter((k) => ['CAN_LAM_RO', 'CHUA_DU_CAN_CU', 'KHONG_PHU_HOP'].includes(getEffectiveKetQua(k)));
  const itemsDat = ketQua.filter((k) => getEffectiveKetQua(k) === 'DAT');

  const currentDateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const getFormTitle = () => {
    if (activeForm === 'thong_bao') return 'Thông báo Yêu cầu Bổ sung Hồ sơ';
    if (activeForm === 'bien_ban') return 'Biên bản Thẩm định Hồ sơ ATTP';
    return 'Dự thảo Quyết định Cấp GCN ATTP';
  };

  const getFormFileName = () => {
    const safeCoSo = (coSoName || 'CoSo').replace(/[^a-zA-Z0-9_]/g, '_');
    if (activeForm === 'thong_bao') return `Thong_bao_bo_sung_${safeCoSo}.doc`;
    if (activeForm === 'bien_ban') return `Bien_ban_tham_dinh_${safeCoSo}.doc`;
    return `Du_thao_Quyet_dinh_${safeCoSo}.doc`;
  };

  const handlePrint = () => {
    printElement('official-form-printable', getFormTitle());
  };

  const handleExportWord = () => {
    exportToWord('official-form-printable', getFormFileName());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 print:p-0 print:static print:bg-white">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden print:h-auto print:max-w-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-800 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck size={20} className="text-emerald-400" />
            <h2 className="text-base font-semibold">Xuất Văn bản Administrative / Báo cáo Thẩm định</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
              title="In văn bản trực tiếp hoặc lưu dạng PDF"
            >
              <Printer size={14} /> In văn bản / Xuất PDF
            </button>

            <button
              onClick={handleExportWord}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
              title="Tải về tệp Word (.doc) hỗ trợ chỉnh sửa trên MS Word"
            >
              <Download size={14} /> Xuất File Word (.doc)
            </button>

            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2 text-xs gap-2 print:hidden">
          <button
            onClick={() => setActiveForm('thong_bao')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
              activeForm === 'thong_bao'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertCircle size={14} /> 1. Thông báo Yêu cầu Bổ sung Hồ sơ
          </button>
          <button
            onClick={() => setActiveForm('bien_ban')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
              activeForm === 'bien_ban'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText size={14} /> 2. Biên bản Thẩm định Hồ sơ
          </button>
          <button
            onClick={() => setActiveForm('du_thao_qd')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
              activeForm === 'du_thao_qd'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileCheck size={14} /> 3. Dự thảo Quyết định cấp GCN
          </button>
        </div>

        {/* Settings Bar */}
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 bg-slate-100/60 px-6 py-2 text-xs text-slate-700 print:hidden">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Số công văn:</span>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setOfficerDocNumber(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-800"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Công chức thụ lý:</span>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-800"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Chức danh:</span>
            <input
              type="text"
              value={officerTitle}
              onChange={(e) => setOfficerTitle(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* Form Content Display */}
        <div id="official-form-printable" className="flex-1 overflow-y-auto p-8 bg-white font-serif text-slate-900 leading-relaxed text-sm">
          {/* Form Header Standard */}
          <div className="flex justify-between items-start mb-6 text-xs font-sans">
            <div className="text-center">
              <p className="font-bold uppercase">CƠ QUAN QUẢN LÝ AN TOÀN THỰC PHẨM</p>
              <p className="font-semibold">BỘ PHẬN THẨM ĐỊNH HỒ SƠ</p>
              <p className="mt-1 italic">Số: {docNumber}</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
              <p className="mt-1 italic">ngày {currentDateStr}</p>
            </div>
          </div>

          {/* 1. THÔNG BÁO SỬA ĐỔI BỔ SUNG */}
          {activeForm === 'thong_bao' && (
            <div className="space-y-4">
              <div className="text-center my-6 font-sans">
                <h3 className="text-base font-bold uppercase">THÔNG BÁO</h3>
                <p className="text-sm font-semibold">
                  Về việc yêu cầu sửa đổi, bổ sung hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm
                </p>
              </div>

              <p className="font-bold text-center mb-4">Kính gửi: Ông/Bà Chủ cơ sở {coSoName || '...'}</p>

              <p>
                Căn cứ Luật An toàn thực phẩm ngày 17 tháng 6 năm 2010;
                <br />
                Căn cứ Nghị định số 15/2018/NĐ-CP ngày 02 tháng 02 năm 2018 của Chính phủ quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm;
              </p>

              <p>
                Sau khi xem xét và đối chiếu bản thuyết minh (Tệp: <i>{thuyetMinhName || 'ThuetMinh.pdf'}</i>) cùng các tài liệu đính kèm, Cơ quan thẩm định thông báo kết quả thẩm định bước 1 như sau:
              </p>

              {itemsCanLamRo.length > 0 ? (
                <div>
                  <p className="font-bold mb-2 font-sans text-xs uppercase tracking-wider text-slate-800">
                    Các mục chưa đạt / cần giải trình, làm rõ ({itemsCanLamRo.length} mục):
                  </p>
                  <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-4">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800">
                        <th className="border border-slate-400 p-2 w-16">Mã mục</th>
                        <th className="border border-slate-400 p-2">Nội dung điều kiện</th>
                        <th className="border border-slate-400 p-2 w-28">Kết luận</th>
                        <th className="border border-slate-400 p-2">Yêu cầu bổ sung / Lý do</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsCanLamRo.map((k) => (
                        <tr key={k.checklist_id}>
                          <td className="border border-slate-400 p-2 font-bold text-center">{k.checklist_id}</td>
                          <td className="border border-slate-400 p-2">{k.dieu_kien_dang_kiem_tra}</td>
                          <td className="border border-slate-400 p-2 font-semibold">{getEffectiveKetQua(k)}</td>
                          <td className="border border-slate-400 p-2">{k.ly_do_ngan_gon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-sans text-xs font-semibold">
                  Hồ sơ đầy đủ, không phát hiện nội dung thiếu sót cần bổ sung.
                </p>
              )}

              <p className="font-bold mt-4">Thời hạn bổ sung:</p>
              <p>
                Trường hợp cơ sở không sửa đổi, bổ sung hồ sơ trong thời hạn 90 ngày kể từ ngày ban hành thông báo này, hồ sơ không còn giá trị pháp lý theo quy định tại Khoản 3 Điều 8 Nghị định số 15/2018/NĐ-CP.
              </p>

              {/* Signatures */}
              <div className="flex justify-between items-start pt-8 font-sans text-xs">
                <div>
                  <p className="font-bold">Nơi nhận:</p>
                  <p>- Như trên;</p>
                  <p>- Lưu hồ sơ thẩm định.</p>
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase">CÔNG CHỨC THỤ LÝ HỒ SƠ</p>
                  <div className="h-16" />
                  <p className="font-bold">{officerName}</p>
                  <p className="text-slate-500">{officerTitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. BIÊN BẢN THẨM ĐỊNH HỒ SƠ */}
          {activeForm === 'bien_ban' && (
            <div className="space-y-4">
              <div className="text-center my-6 font-sans">
                <h3 className="text-base font-bold uppercase">BIÊN BẢN THẨM ĐỊNH HỒ SƠ ĐIỆN TỬ</h3>
                <p className="text-sm font-semibold">
                  Đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm
                </p>
              </div>

              <p>Tên cơ sở đề nghị: <b>{coSoName || 'Cơ sở sản xuất thực phẩm'}</b></p>
              <p>Tài liệu thuyết minh chính: <i>{thuyetMinhName || 'ThuetMinh.pdf'}</i></p>
              <p>Công chức thẩm định: <b>{officerName}</b> - {officerTitle}</p>

              <h4 className="font-bold font-sans text-xs uppercase tracking-wider text-slate-800 mt-4 mb-2">
                Bảng tổng hợp kết quả đối chiếu 10/10 mục kiểm tra:
              </h4>

              <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-4">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-400 p-2 w-12">STT</th>
                    <th className="border border-slate-400 p-2 w-16">Mã</th>
                    <th className="border border-slate-400 p-2">Nội dung kiểm tra</th>
                    <th className="border border-slate-400 p-2 w-24">Kết quả</th>
                    <th className="border border-slate-400 p-2">Căn cứ chứng minh / Trích dẫn</th>
                  </tr>
                </thead>
                <tbody>
                  {ketQua.map((k, idx) => (
                    <tr key={k.checklist_id}>
                      <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-bold text-center">{k.checklist_id}</td>
                      <td className="border border-slate-400 p-2">{k.dieu_kien_dang_kiem_tra}</td>
                      <td className="border border-slate-400 p-2 font-semibold text-center">{getEffectiveKetQua(k)}</td>
                      <td className="border border-slate-400 p-2">
                        {k.ho_so_chung_minh ? `${k.ho_so_chung_minh} (${k.vi_tri_trong_ho_so || ''})` : 'Chưa có tài liệu chứng minh'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="font-bold mt-2">Dự thảo Đánh giá Tổng thể:</p>
              <p>
                - Số mục ĐẠT: {itemsDat.length}/{ketQua.length} mục.
                <br />
                - Kết luận đề xuất: {itemsCanLamRo.length === 0 ? 'Đủ điều kiện chuyển sang bước kiểm tra thực tế tại cơ sở.' : 'Chưa đủ điều kiện, đề nghị gửi Thông báo yêu cầu làm rõ.'}
              </p>

              {/* Signatures */}
              <div className="flex justify-between items-start pt-8 font-sans text-xs">
                <div className="text-center">
                  <p className="font-bold uppercase">CƠ SỞ ĐƯỢC THẨM ĐỊNH</p>
                  <p className="italic text-slate-400">(Xác nhận đã gửi hồ sơ điện tử)</p>
                  <div className="h-16" />
                  <p className="font-bold">{coSoName}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase">CÔNG CHỨC THẨM ĐỊNH</p>
                  <div className="h-16" />
                  <p className="font-bold">{officerName}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. DỰ THẢO QUYẾT ĐỊNH CẤP GCN */}
          {activeForm === 'du_thao_qd' && (
            <div className="space-y-4">
              <div className="text-center my-6 font-sans">
                <h3 className="text-base font-bold uppercase">QUYẾT ĐỊNH (DỰ THẢO)</h3>
                <p className="text-sm font-semibold">
                  Về việc cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm
                </p>
              </div>

              <p className="text-center font-bold">THỦ TRƯỞNG CƠ QUAN QUẢN LÝ AN TOÀN THỰC PHẨM</p>

              <p className="text-xs">
                Căn cứ Luật An toàn thực phẩm ngày 17 tháng 6 năm 2010;
                <br />
                Căn cứ Nghị định số 15/2018/NĐ-CP ngày 02 tháng 02 năm 2018 của Chính phủ;
                <br />
                Xét Báo cáo kết quả thẩm định hồ sơ điện tử và Biên bản kiểm tra thực tế ngày {currentDateStr},
              </p>

              <p className="font-bold text-center my-3 uppercase font-sans">QUYẾT ĐỊNH:</p>

              <p>
                <b>Điều 1.</b> Cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm cho:
                <br />
                - Tên cơ sở: <b>{coSoName || 'Cơ sở sản xuất thực phẩm'}</b>
                <br />
                - Loại hình: Cơ sở sản xuất, chế biến thực phẩm
                <br />- Thời hạn hiệu lực: <b>03 năm</b> (từ ngày ký).
              </p>

              <p>
                <b>Điều 2.</b> Cơ sở có trách nhiệm duy trì các điều kiện bảo đảm an toàn thực phẩm theo đúng quy định của pháp luật và chịu sự kiểm tra, giám sát định kỳ của cơ quan chức năng.
              </p>

              <p>
                <b>Điều 3.</b> Quyết định này có hiệu lực kể từ ngày ký.
              </p>

              {/* Signatures */}
              <div className="flex justify-between items-start pt-8 font-sans text-xs">
                <div>
                  <p className="font-bold">Nơi nhận:</p>
                  <p>- Như Điều 1;</p>
                  <p>- Cơ quan QLCL địa phương;</p>
                  <p>- Lưu VT.</p>
                </div>
                <div className="text-center">
                  <p className="font-bold uppercase">THỦ TRƯỞNG ĐƠN VỊ</p>
                  <p className="italic text-slate-400">(Dự thảo trình ký)</p>
                  <div className="h-16" />
                  <p className="font-bold">Nguyễn Văn C</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
