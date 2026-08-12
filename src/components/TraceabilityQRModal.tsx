import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertTriangle, Search, ExternalLink, ShieldCheck, Building2, Truck, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coSoName?: string;
  ocrText?: string;
}

export default function TraceabilityQRModal({ isOpen, onClose, coSoName, ocrText }: Props) {
  const [activeTab, setActiveTab] = useState<'ONE_STEP' | 'QR_TEST' | 'CERT_LOOKUP'>('ONE_STEP');
  const [qrCodeInput, setQrCodeInput] = useState<string>('https://hanoicheck.gov.vn/trace/SP-99281');
  const [scanResult, setScanResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSimulateQRScan = () => {
    setScanResult({
      productName: 'Rau cải ngọt An Toàn VietGAP',
      coSoSanXuat: coSoName || 'Hợp tác xã Nông nghiệp Rau an toàn Xanh Tươi',
      maSoVungTrong: 'VT-HNI-2026-8812',
      maSoDongGoi: 'DG-HNI-0029',
      certNumber: '1288/2025/VietGAP-TT',
      certIssuer: 'Trung tâm Chứng nhận Chất lượng Nông nghiệp',
      validUntil: '15/12/2028',
      traceHistory: [
        { date: '01/08/2026', step: 'Thu hoạch & Đóng gói tại Lô 03 - Vùng trồng Thường Tín' },
        { date: '02/08/2026', step: 'Vận chuyển chuỗi lạnh xe 29C-881.02 đến Siêu thị X' },
        { date: '03/08/2026', step: 'Phân phối tại kệ siêu thị - Sẵn sàng tiêu dùng' },
      ],
      qrStatus: 'VALID',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Công cụ Kiểm tra Truy xuất Nguồn gốc & Mã QR Nhãn Điện Tử
              </h2>
              <p className="text-xs text-emerald-200">
                Thẩm định việc tuân thủ nguyên tắc 1 bước trước - 1 bước sau & Mã số vùng trồng / đóng gói
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('ONE_STEP')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors ${
              activeTab === 'ONE_STEP'
                ? 'bg-white border-slate-200 text-emerald-900 border-b-2 border-b-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck size={14} /> Nguyên tắc Truy xuất 1 Bước
          </button>
          <button
            onClick={() => setActiveTab('QR_TEST')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-t border-x transition-colors ${
              activeTab === 'QR_TEST'
                ? 'bg-white border-slate-200 text-emerald-900 border-b-2 border-b-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode size={14} /> Quét mã QR & Nhãn Điện tử
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'ONE_STEP' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-700" />
                  Quy định Truy xuất Nguồn gốc Thực phẩm theo Chuỗi (Thông tư 25/2019/TT-BNNPTNT)
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Cơ sở sản xuất, kinh doanh thực phẩm phải lưu trữ hồ sơ theo dõi nguyên tắc: <strong>1 bước trước</strong> (nguồn gốc nguyên liệu mua vào) và <strong>1 bước sau</strong> (khách hàng, đại lý phân phối bán ra).
                </p>
              </div>

              {/* 1 Step Back & 1 Step Forward Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step Back */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                    <Building2 size={16} className="text-indigo-600" />
                    1. Bước Trước (Nguồn gốc Đầu Vào)
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Nhà cung ứng / Hộ nông dân:</strong> Khai báo danh sách 03 hộ nông dân liên kết tại xã Hòa Bình, Thường Tín.
                      </div>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Chứng nhận nguồn gốc:</strong> Có Giấy chứng nhận VietGAP số 1288/2025/VietGAP-TT.
                      </div>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Nhật ký canh tác:</strong> Khai báo ghi chép sổ nhật ký phân bón, thuốc BVTV sinh học.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Step Forward */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Truck size={16} className="text-emerald-600" />
                    2. Bước Sau (Kênh Phân Phối Bán Ra)
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Khách hàng thu mua:</strong> Hợp đồng cung cấp số 88/2026/HĐ-XT giao Chuỗi Bếp ăn Siêu thị X.
                      </div>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Lưu hóa đơn / Biên bản giao nhận:</strong> Lưu trữ hóa đơn bán hàng & sổ xuất kho tối thiểu 01 năm.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'QR_TEST' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Nhập mã URL/Chuỗi QR Code ghi trên nhãn sản phẩm:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                  />
                  <button
                    onClick={handleSimulateQRScan}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors"
                  >
                    <RefreshCw size={14} /> Tra cứu Mã QR
                  </button>
                </div>
              </div>

              {scanResult && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-emerald-600" />
                      <h4 className="font-bold text-emerald-950 text-sm">{scanResult.productName}</h4>
                    </div>
                    <span className="rounded bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      MÃ QR HỢP LỆ & LIÊN THÔNG DỮ LIỆU
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500">Cơ sở sản xuất:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{scanResult.coSoSanXuat}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500">Mã số vùng trồng:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{scanResult.maSoVungTrong}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500">Số Chứng nhận VietGAP:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{scanResult.certNumber}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500">Đơn vị cấp phép:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{scanResult.certIssuer}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-slate-900 mb-2">Nhật ký Hành trình Sản phẩm (Supply Chain History):</h5>
                    <div className="space-y-1.5 pl-3 border-l-2 border-emerald-500 text-xs">
                      {scanResult.traceHistory.map((h: any, idx: number) => (
                        <div key={idx} className="bg-white p-2 rounded border border-emerald-100">
                          <span className="font-bold text-emerald-800">{h.date}: </span>
                          <span className="text-slate-700">{h.step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t bg-slate-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
