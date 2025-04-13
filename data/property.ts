// data/property.ts
export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  areaSqft: number;
  location: string;
  images: string[];
  type: "For Sale" | "For Rent";
  yearBuilt: number;
  status: "Active" | "Sold" | "Rented Out";
  featured: boolean;
  vrTour?: string;
  amenities?: string[];
  lotSize?: string;
  garage?: number;
  agent?: string;
  lastUpdated?: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "Luxury Waterfront Villa",
    description:
      "Stunning modern villa with panoramic ocean views and private beach access.",
    price: 4250000,
    beds: 5,
    baths: 4.5,
    areaSqft: 5800,
    location: "Malibu, CA",
    images: [
      "/images/property-1.jpg",
      "/images/property1bed.jpg",
      "/images/property1kit.jpg",
    ],
    type: "For Sale",
    yearBuilt: 2018,
    status: "Active",
    featured: true,
    vrTour: "/vr/1",
    amenities: ["Pool", "Home Theater", "Wine Cellar"],
    lotSize: "1.2 acres",
    garage: 3,
  },
  {
    id: 2,
    title: "Downtown Luxury Loft",
    description:
      "Industrial-chic loft in the heart of the city with rooftop access.",
    price: 1850000,
    beds: 3,
    baths: 2,
    areaSqft: 3200,
    location: "New York, NY",
    images: [
      "/images/property-2.jpg",
      "/images/property2bed.jpg",
      "/images/property2kit.jpg",
    ],
    type: "For Sale",
    yearBuilt: 1920,
    status: "Active",
    featured: true,
    vrTour: "/vr/2",
    amenities: ["Rooftop Deck", "Concierge"],
  },
  {
    id: 3,
    title: "Mountain Retreat Cabin",
    description:
      "Cozy log cabin nestled in the mountains with breathtaking views.",
    price: 950000,
    beds: 4,
    baths: 3,
    areaSqft: 2800,
    location: "Aspen, CO",
    images: [
      "/images/property-3.jpeg",
      "/properties/3/2.jpg",
      "/properties/3/3.jpg",
    ],
    type: "For Sale",
    yearBuilt: 2015,
    status: "Active",
    featured: false,
    vrTour: "/vr/3",
  },
  {
    id: 4,
    title: "Modern Beachfront Condo",
    description: "Sleek beachfront condo with ocean views from every room.",
    price: 3200,
    beds: 2,
    baths: 2,
    areaSqft: 1800,
    location: "Miami Beach, FL",
    images: ["/images/property-3.jpeg", "/properties/4/2.jpg"],
    type: "For Rent",
    yearBuilt: 2019,
    status: "Active",
    featured: true,
  },
  {
    id: 5,
    title: "Historic Townhouse",
    description:
      "Beautifully restored historic townhouse with modern amenities.",
    price: 2750000,
    beds: 4,
    baths: 3.5,
    areaSqft: 3800,
    location: "Boston, MA",
    images: [
      "/properties/5/1.jpg",
      "/properties/5/2.jpg",
      "/properties/5/3.jpg",
    ],
    type: "For Sale",
    yearBuilt: 1890,
    status: "Active",
    featured: false,
  },
  {
    id: 6,
    title: "Suburban Family Home",
    description: "Spacious family home in excellent school district.",
    price: 875000,
    beds: 5,
    baths: 3,
    areaSqft: 3200,
    location: "Austin, TX",
    images: ["/properties/6/1.jpg", "/properties/6/2.jpg"],
    type: "For Sale",
    yearBuilt: 2012,
    status: "Active",
    featured: true,
  },
  {
    id: 7,
    title: "Luxury Penthouse",
    description: "Ultra-modern penthouse with 360° city views.",
    price: 6500,
    beds: 3,
    baths: 3.5,
    areaSqft: 4200,
    location: "Chicago, IL",
    images: [
      "/properties/7/1.jpg",
      "/properties/7/2.jpg",
      "/properties/7/3.jpg",
    ],
    type: "For Rent",
    yearBuilt: 2020,
    status: "Active",
    featured: true,
  },
  {
    id: 8,
    title: "Desert Modern Oasis",
    description: "Architectural masterpiece blending indoor/outdoor living.",
    price: 3900000,
    beds: 6,
    baths: 5,
    areaSqft: 7200,
    location: "Scottsdale, AZ",
    images: ["/properties/8/1.jpg", "/properties/8/2.jpg"],
    type: "For Sale",
    yearBuilt: 2017,
    status: "Active",
    featured: true,
  },
  {
    id: 9,
    title: "Coastal Cottage",
    description: "Charming renovated cottage steps from the beach.",
    price: 1200,
    beds: 2,
    baths: 1,
    areaSqft: 1200,
    location: "Outer Banks, NC",
    images: ["/properties/9/1.jpg"],
    type: "For Rent",
    yearBuilt: 1965,
    status: "Rented Out",
    featured: false,
  },
  {
    id: 10,
    title: "Golf Course Villa",
    description: "Elegant villa overlooking championship golf course.",
    price: 3100000,
    beds: 4,
    baths: 4,
    areaSqft: 4500,
    location: "Palm Springs, CA",
    images: ["/properties/10/1.jpg", "/properties/10/2.jpg"],
    type: "For Sale",
    yearBuilt: 2010,
    status: "Sold",
    featured: false,
  },
];

export default properties;
