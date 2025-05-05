export const NAV_ITEMS = [
  { name: "Buy", href: "/buy" },
  { name: "Rent", href: "/rent" },
  { name: "Sell", href: "/sell" },
];

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "RevoEstate";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern real estate marketplace with AI-powered recommendations and 360° virtual tours for an interactive experience.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/users";


  export const realestateDefaultValues = {
    realEstateName: '',
    email: '',
    phone: '',
    description: undefined,
    imageUrl: undefined,
  
    // Address Information
    address: {
      region: "",
      city: "",
      specificLocation: "",
      geoPoint: {
        type: "Point" as const,
        coordinates: [0, 0] as [number, number],
      },
    },
  
    // Social Media
    socialMedia: {
      instagram: undefined,
      facebook: undefined,
      linkedin: undefined,
      tiktok: undefined,
      whatsapp: undefined,
    },
  
    // Verification and Licensing
    documentUrl: undefined
  };


export const createPropertyDefaultValues = {
  title: "",
  description: "",
  price: 0,
  area: 0,
  address: {
    region: "",
    city: "",
    specificLocation: "",
    geoPoint: {
      type: "Point" as const,
      coordinates: [0, 0] as [number, number],
    },
  },
  propertyType: "Apartment" as const,
  status: "available" as const,
  images: [] as File[],
  bedrooms: 0,
  bathrooms: 0,
  builtInYear: undefined as number | undefined,
  landArea: 0,
  panoramicImages: [] as File[],
  listingType: "For Sale" as const,
  furnished: "No" as const,
  amenities: [] as string[],
};
