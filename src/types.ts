export type CanCuLoai = 'QUY_DINH' | 'THONG_LE_CHUYEN_NGANH';

export type KetQuaType = 'DAT' | 'CAN_LAM_RO' | 'CHUA_DU_CAN_CU' | 'KHONG_PHU_HOP';

export type NhomNganhType = 'ALL' | 'BYT' | 'BNNPTNT' | 'BCT';

export type LoaiCoSoType = 'CHUNG' | 'SAN_XUAT' | 'AN_UONG' | 'BEP_AN' | 'NONG_LAM_THUY_SAN';

export interface ChecklistItem {
  id: string;
  nhom: string;
  yeu_cau: string;
  can_cu_loai: CanCuLoai;
  can_cu_phap_ly: string; // Tên văn bản (NĐ 15/2018, NĐ 43/2017, TT 17/2021...)
  nganh_quan_ly?: NhomNganhType;
  loai_co_so?: LoaiCoSoType;
}

export interface ShortItem {
  id: string;
  dk: string;
  cc: string;
  hs?: string | null;
  vt?: string | null;
  kq: string;
  lp?: string | null;
  ly: string;
}

export interface ExpandedItem {
  checklist_id: string;
  dieu_kien_dang_kiem_tra: string;
  can_cu: string;
  ho_so_chung_minh: string | null;
  vi_tri_trong_ho_so: string | null;
  ket_qua_danh_gia: KetQuaType;
  loai_phat_hien: string | null;
  ly_do_ngan_gon: string;
  he_thong_dieu_chinh?: boolean;
  ghi_chu_dieu_chinh?: string;
}

export interface ConfirmedRecord {
  ketQua: KetQuaType;
  xacNhan: boolean;
  ghiChu?: string;
}

export interface SampleDossier {
  id: string;
  title: string;
  coSoName: string;
  loaiHình: string;
  nganh: NhomNganhType;
  thuyetMinh: {
    name: string;
    text: string;
  };
  chungMinh: {
    name: string;
    text: string;
  }[];
}

export interface LegalDocument {
  id: string;
  code: string;
  title: string;
  type: string;
  issuedDate: string;
  effectiveDate: string;
  summary: string;
  keyArticles: {
    article: string;
    title: string;
    content: string;
  }[];
}

export type DocCategoryType =
  | 'DON_XIN_CAP'
  | 'DANG_KY_KINH_DOANH'
  | 'THUYET_MINH_CSVC'
  | 'SO_DO_MAT_BANG'
  | 'GIAY_KHAM_SUC_KHOE'
  | 'TAP_HUAN_ATTP'
  | 'HOP_DONG_NGUYEN_LIEU'
  | 'GIAY_TO_KHAC';

export interface ScannedDocumentItem {
  id: string;
  fileName: string;
  fileSize?: number;
  previewUrl?: string;
  extractedText?: string;
  category: DocCategoryType;
  categoryLabel: string;
  targetEntityName: string;
  documentDate?: string;
  documentNumber?: string;
  confidenceScore: number;
  suggestedSequence: number;
  status: 'PENDING' | 'ANALYZING' | 'CLASSIFIED' | 'ERROR';
  qualityWarning?: string;
  isDuplicate?: boolean;
}

export interface SortedDossierGroup {
  id: string;
  entityName: string;
  taxCode?: string;
  address?: string;
  documents: ScannedDocumentItem[];
  missingCategories: { category: DocCategoryType; label: string; isMandatory: boolean }[];
  completenessScore: number;
}

