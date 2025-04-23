"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SuspendCompanyDialog } from "@/components/system-admin/companies/suspend-company-dialog";
import { DeactivateCompanyDialog } from "@/components/system-admin/companies/deactivate-company-dialog";
import { use } from "react";

// Mock data for demonstration - in a real app, you would fetch this from an API
const companies = [
  {
    id: "1",
    name: "Acme Real Estate",
    logo: "A",
    contactEmail: "contact@acmerealestate.com",
    registrationDate: new Date(2023, 0, 15),
    numberOfListings: 24,
    status: "active",
    location: "New York",
    verificationStatus: "verified",
    licenseNumber: "RE-12345-NY",
    website: "https://acmerealestate.com",
    phone: "(212) 555-1234",
    address: "123 Broadway, New York, NY 10001",
  },
  {
    id: "2",
    name: "Horizon Properties",
    logo: "H",
    contactEmail: "info@horizonproperties.com",
    registrationDate: new Date(2023, 1, 22),
    numberOfListings: 18,
    status: "active",
    location: "Los Angeles",
    verificationStatus: "verified",
    licenseNumber: "RE-67890-CA",
    website: "https://horizonproperties.com",
    phone: "(310) 555-6789",
    address: "456 Sunset Blvd, Los Angeles, CA 90028",
  },
  // ... other companies
]

// Mock listings data
const mockListings = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    type: "Apartment",
    price: "$2,500/mo",
    date: new Date(2023, 9, 15),
  },
  {
    id: "2",
    title: "Luxury Waterfront Condo",
    type: "Condo",
    price: "$750,000",
    date: new Date(2023, 9, 10),
  },
  {
    id: "3",
    title: "Spacious Family Home",
    type: "House",
    price: "$450,000",
    date: new Date(2023, 9, 5),
  },
  {
    id: "4",
    title: "Commercial Office Space",
    type: "Commercial",
    price: "$35/sqft/yr",
    date: new Date(2023, 8, 28),
  },
  {
    id: "5",
    title: "Beachfront Villa",
    type: "House",
    price: "$1,200,000",
    date: new Date(2023, 8, 20),
  },
  {
    id: "6",
    title: "Studio Apartment",
    type: "Apartment",
    price: "$1,800/mo",
    date: new Date(2023, 8, 15),
  },
  {
    id: "7",
    title: "Retail Space",
    type: "Commercial",
    price: "$28/sqft/yr",
    date: new Date(2023, 8, 10),
  },
  {
    id: "8",
    title: "Mountain Cabin",
    type: "House",
    price: "$350,000",
    date: new Date(2023, 8, 5),
  },
  {
    id: "9",
    title: "Luxury Penthouse",
    type: "Condo",
    price: "$3,500,000",
    date: new Date(2023, 7, 28),
  },
  {
    id: "10",
    title: "Office Building",
    type: "Commercial",
    price: "$5,200,000",
    date: new Date(2023, 7, 20),
  },
  {
    id: "11",
    title: "Suburban Home",
    type: "House",
    price: "$425,000",
    date: new Date(2023, 7, 15),
  },
  {
    id: "12",
    title: "Downtown Loft",
    type: "Apartment",
    price: "$2,200/mo",
    date: new Date(2023, 7, 10),
  },
];

// Mock activity log
const mockActivityLog = [
  {
    id: "1",
    action: "New listing added",
    date: new Date(2023, 9, 15),
    details: "Modern Downtown Apartment",
  },
  {
    id: "2",
    action: "Responded to inquiry",
    date: new Date(2023, 9, 12),
    details: "From John Smith regarding Luxury Waterfront Condo",
  },
  {
    id: "3",
    action: "Updated company profile",
    date: new Date(2023, 9, 8),
    details: "Changed contact information",
  },
  {
    id: "4",
    action: "New listing added",
    date: new Date(2023, 9, 5),
    details: "Spacious Family Home",
  },
  {
    id: "5",
    action: "Verification documents submitted",
    date: new Date(2023, 8, 30),
    details: "License renewal",
  },
  {
    id: "6",
    action: "New listing added",
    date: new Date(2023, 8, 25),
    details: "Commercial Office Space",
  },
  {
    id: "7",
    action: "Customer inquiry",
    date: new Date(2023, 8, 20),
    details: "Regarding Beachfront Villa",
  },
  {
    id: "8",
    action: "Updated listing",
    date: new Date(2023, 8, 15),
    details: "Price reduced on Studio Apartment",
  },
  {
    id: "9",
    action: "New listing added",
    date: new Date(2023, 8, 10),
    details: "Retail Space",
  },
  {
    id: "10",
    action: "Attended training",
    date: new Date(2023, 8, 5),
    details: "Platform usage webinar",
  },
  {
    id: "11",
    action: "New listing added",
    date: new Date(2023, 7, 28),
    details: "Luxury Penthouse",
  },
  {
    id: "12",
    action: "Updated company logo",
    date: new Date(2023, 7, 25),
    details: "Uploaded new branding",
  },
  {
    id: "13",
    action: "New listing added",
    date: new Date(2023, 7, 20),
    details: "Office Building",
  },
  {
    id: "14",
    action: "Customer feedback",
    date: new Date(2023, 7, 15),
    details: "Positive review from client",
  },
  {
    id: "15",
    action: "New listing added",
    date: new Date(2023, 7, 10),
    details: "Downtown Loft",
  },
];

export default function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [company, setCompany] = useState<(typeof companies)[0] | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  // Pagination state for listings
  const [listingsPage, setListingsPage] = useState(1);
  const listingsPerPage = 4;
  const totalListingsPages = Math.ceil(mockListings.length / listingsPerPage);

  // Pagination state for activity log
  const [activityPage, setActivityPage] = useState(1);
  const activitiesPerPage = 5;
  const totalActivityPages = Math.ceil(
    mockActivityLog.length / activitiesPerPage
  );

  useEffect(() => {
    // In a real app, you would fetch the company data from an API
    const foundCompany = companies.find((c) => c.id === id);
    setCompany(foundCompany || null);
  }, [id]);

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
          >
            Pending Verification
          </Badge>
        );
      case "unverified":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Unverified
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
          >
            Suspended
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate current page data for listings
  const indexOfLastListing = listingsPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = mockListings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  // Calculate current page data for activity log
  const indexOfLastActivity = activityPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = mockActivityLog.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );

  // Pagination controls for listings
  const goToNextListingsPage = () =>
    setListingsPage((prev) => Math.min(prev + 1, totalListingsPages));
  const goToPrevListingsPage = () =>
    setListingsPage((prev) => Math.max(prev - 1, 1));

  // Pagination controls for activity log
  const goToNextActivityPage = () =>
    setActivityPage((prev) => Math.min(prev + 1, totalActivityPages));
  const goToPrevActivityPage = () =>
    setActivityPage((prev) => Math.max(prev - 1, 1));

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Company not found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to companies
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                    <AvatarFallback>
                      <Building2 className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {company.location}
                    </p>
                  </div>
                </div>
                {getStatusBadge(company.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Contact Information
                </h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {company.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{company.address}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Company Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Verification
                    </p>
                    <p className="text-sm">
                      {getVerificationBadge(company.verificationStatus)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      License Number
                    </p>
                    <p className="text-sm font-medium">
                      {company.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Listings</p>
                    <p className="text-sm font-medium">
                      {company.numberOfListings}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registered</p>
                    <p className="text-sm">
                      {format(company.registrationDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                {company.status !== "suspended" && (
                  <Button
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 w-full"
                    onClick={() => setIsSuspendDialogOpen(true)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Company
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                  onClick={() => setIsDeactivateDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deactivate Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-4 pt-4">
              <div className="space-y-4">
                {currentListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{listing.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline">{listing.type}</Badge>
                            <span className="text-sm font-medium">
                              {listing.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(listing.date, "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Listings Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstListing + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastListing, mockListings.length)}
                  </span>{" "}
                  of <span className="font-medium">{mockListings.length}</span>{" "}
                  listings
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevListingsPage}
                    disabled={listingsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextListingsPage}
                    disabled={listingsPage === totalListingsPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 pt-4">
              <div className="space-y-4">
                {currentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border rounded-md"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(activity.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Log Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstActivity + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastActivity, mockActivityLog.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{mockActivityLog.length}</span>{" "}
                  activities
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevActivityPage}
                    disabled={activityPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextActivityPage}
                    disabled={activityPage === totalActivityPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <SuspendCompanyDialog
        company={company}
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onSuspend={(reason) => {
          console.log(
            `Suspending company ${company.id} with reason: ${reason}`
          );
          setIsSuspendDialogOpen(false);
          // In a real application, you would call an API to update the status
        }}
      />

      <DeactivateCompanyDialog
        company={company}
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        onDeactivate={() => {
          console.log(`Deactivating company ${company.id}`);
          setIsDeactivateDialogOpen(false);
          // In a real application, you would call an API to update the status
        }}
      />
    </div>
  );
}
