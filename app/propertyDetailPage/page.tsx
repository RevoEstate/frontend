"use client";
import Image from "next/image";
import {
  Star,
  Check,
  Search,
  BedDouble,
  Bath,
  Maximize,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PropertyListing() {
  // Moved images array above the useState hook
  const images = [
    "/Images/home1.jpeg",
    "/Images/room1.jpeg",
    "/Images/room2.jpeg",
    "/Images/room3.jpeg",
    "/Images/room4.jpeg",
  ];

  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Navigation */}
      {/* <header className="flex items-center justify-between mb-2 p-0.5 h-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/Images/LOGO.jpeg"
              alt="Logo"
              width={80}
              height={80}
              className="mr-8"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 ml-6">
            <Link href="/buy" className="font-medium text-sm">
              Buy
            </Link>
            <Link href="/rent" className="font-medium text-sm">
              Rent
            </Link>
            <Link href="/sell" className="font-medium text-sm">
              Sell
            </Link>
            <Link href="/agents" className="font-medium text-sm">
              Agents
            </Link>
          </nav>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-1 rounded-md bg-gray-200 w-[180px]"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </header> */}

      <div className="lg:grid lg:grid-cols-3 gap-10 mt-4">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative h-[300px] md:h-[400px] mb-4 rounded-lg overflow-hidden">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Property view"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative h-20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedImage === image
                    ? "ring-2 ring-primary"
                    : "hover:opacity-80"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Interior view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-6">
              {["details", "features", "nearby", "map"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-1 py-2 border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-black font-medium"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  {tab === "details"
                    ? "Property Details"
                    : tab === "features"
                    ? "Features"
                    : tab === "nearby"
                    ? "Nearby places"
                    : "Map"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">
                Property description
              </h3>
              <p className="text-gray-700 mb-6">
                This stunning modern apartment is located in the heart of
                downtown, offering a blend of luxury and convenience. The
                open-concept design features high ceilings, large windows that
                flood the space with natural light, and premium finishes
                throughout. The property has been recently renovated with
                top-quality materials and appliances.
              </p>
              <p className="text-gray-700">
                Perfectly positioned in a vibrant neighborhood, this apartment
                is just steps away from restaurants, cafes, shopping, and public
                transportation. The building offers excellent amenities
                including a fitness center, rooftop terrace, and 24/7 security
                for ultimate peace of mind.
              </p>
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>3 spacious bedrooms with built-in closets</li>
                  <li>2 full bathrooms with luxury fixtures</li>
                  <li>Open plan kitchen with island</li>
                  <li>144 m² of living space</li>
                  <li>Private balcony with city view</li>
                  <li>Secure parking garage</li>
                  <li>24/7 building security</li>
                  <li>Fitness center access</li>
                </ul>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-1 md:mt-0">
                  <li>Pet-friendly building</li>
                  <li>Air conditioning & central heating</li>
                  <li>Hardwood flooring throughout</li>
                  <li>Stainless steel appliances</li>
                  <li>In-unit washer and dryer</li>
                  <li>High-speed internet ready</li>
                  <li>Smart home features</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "nearby" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-1">Transportation</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Metro Station - 5 min walk</li>
                    <li>Bus Stop - 2 min walk</li>
                    <li>Taxi Stand - 3 min walk</li>
                    <li>Airport - 25 min drive</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Shopping & Dining</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Supermarket - 3 min walk</li>
                    <li>Shopping Mall - 10 min walk</li>
                    <li>Restaurants - 5 min walk</li>
                    <li>Cafes - 2 min walk</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Education & Healthcare</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>School - 7 min walk</li>
                    <li>University - 15 min walk</li>
                    <li>Hospital - 10 min drive</li>
                    <li>Pharmacy - 5 min walk</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Recreation</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Park - 8 min walk</li>
                    <li>Gym - 5 min walk</li>
                    <li>Cinema - 12 min walk</li>
                    <li>Sports Center - 15 min walk</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Location Map</h3>
              <div className="bg-gray-200 h-[400px] rounded-lg flex items-center justify-center">
                <p className="text-gray-600">
                  Interactive map would be displayed here
                </p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-gray-700">123 Main Street</p>
                <p className="text-gray-700">Downtown District</p>
                <p className="text-gray-700">City, Country</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Modern 3-Bedroom Apartment in Downtown
            </h1>
            <h2 className="text-xl font-bold mb-3">20M Birr!!</h2>
            <p className="text-gray-700 mb-4">123 Main st, city, country</p>

            <div className="grid grid-cols-2 gap-y-2 mb-4">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-blue-500" />
                <span className="text-sm">3 spacious Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Open plan Kitchen</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-blue-500" />
                <span className="text-sm">144m² Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-blue-500" />
                <span className="text-sm">2 Modern Bathrooms</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium">
                Virtual Tour
              </button>
              <button className="border border-gray-300 px-6 py-2 rounded-md font-medium">
                Contact Agent
              </button>
            </div>
          </div>

          {/* Agent Info */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/Images/profile.jpeg"
                  alt="Agent"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">Abebe Belachew</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-500">Verified agent</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 ml-5">
                <span className="font-semibold text-lg">4.8</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-yellow-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold ml-0">120</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="border border-gray-300 flex-1 py-2 rounded-md font-medium">
                Call
              </button>
              <button className="bg-blue-500 text-white flex-1 py-2 rounded-md font-medium">
                Message
              </button>
            </div>
          </div>

          {/* Listing Info */}
          <div className="border rounded-lg p-4">
            <p className="mb-3">Listed 3 days ago.</p>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 rounded-md p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-green-500">Verified Listing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
