export type Company = {
  _id: string;
  realEstateName: string;
  userId: string;
  email: string;
  phone: string;
  description: string;
  imageUrl: string;
  documentUrl: string;
  verificationStatus: 'initial' | 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  verifiedBy?: string;
  revoemb: string[];
  createdAt: string;
  updatedAt: string;
  address: {
    geoPoint: {
      type: 'Point';
      coordinates: [number, number];
    };
    region: string;
    city: string;
    specificLocation: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    whatsapp?: string;
  };
};

export type CompanyFilter = {
  search?: string;
  verificationStatus?: string;
  region?: string;
};

export type CompanySort = {
  field: 'realEstateName' | 'createdAt';
  direction: 'asc' | 'desc';
};

export type CompanyPagination = {
  page: number;
  limit: number;
  total: number;
};
