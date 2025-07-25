export type Company = {
  _id: string;
  realEstateName: string;
  email: string;
  phone: string;
  description: string;
  imageUrl: string;
  documentUrl: string;
  website?: string;
  companyStatus: 'active' | 'suspended';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  listingsCount: number;
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
  companyStatus?: 'active' | 'suspended';
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  location?: string;
};

export type CompanySort = {
  field: 'realEstateName' | 'createdAt' | 'companyStatus' | 'listingsCount' | 'verificationStatus';
  direction: 'asc' | 'desc';
};

export type CompanyPagination = {
  page: number;
  limit: number;
  total: number;
};
