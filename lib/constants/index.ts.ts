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
    description: '',
    imageUrl: undefined,
  
    // Address Information
    address: {
      region: '',
      city: '',
      specificLocation: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
  
    // Social Media
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: '',
      whatsapp: ''
    },
  
    // Verification and Licensing
    documentUrl: undefined
  };
