export type PropertyType = "Apartment" | "House" | "Commercial" | "Land" | "Villa";
export type PropertyStatus = "available" | "sold" | "rented";
export type ListingType = "For Rent" | "For Sale";
export type FurnishedStatus = "Yes" | "No";

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface PropertyAddress {
  region: string;
  city: string;
  specificLocation?: string;
  geoPoint: GeoPoint;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  address: PropertyAddress;
  propertyType: PropertyType;
  status: PropertyStatus;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  builtInYear?: number;
  isFeatured: boolean;
  expireDate?: Date;
  isActive: boolean;
  userId: string;
  companyId: string;
  purchaseId: string;
  viewCount: number;
  landArea: number;
  panoramicImages: string[];
  listingType: ListingType;
  furnished: FurnishedStatus;
  amenities: string[];
  propertyId?: string;
  revoemb?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  price: number;
  area: number;
  address: Omit<PropertyAddress, "geoPoint"> & {
    geoPoint: {
      coordinates: [number, number];
    };
  };
  propertyType: PropertyType;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  builtInYear?: number;
  landArea: number;
  panoramicImages?: string[];
  listingType: ListingType;
  furnished?: FurnishedStatus;
  amenities?: string[];
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {
  status?: PropertyStatus;
  isFeatured?: boolean;
  isActive?: boolean;
  expireDate?: Date;
} 
