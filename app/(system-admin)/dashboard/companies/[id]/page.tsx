"use client"

import { useState } from "react"
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
import { useParams } from "next/navigation";
import { useCompany } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

export default function CompanyProfilePage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  // Fetch company data from API
  const { 
    company, 
    isLoading, 
    isError, 
    error,
    suspendCompany,
    isSuspending,
    activateCompany,
    isActivating,
    deactivateCompany,
    isDeactivating,
  } = useCompany(companyId);

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

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "approved":
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
      case "rejected":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Rejected
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

  const handleSuspend = () => {
    setIsSuspendDialogOpen(true);
  };

  const handleActivate = () => {
    activateCompany(
      { companyId },
      {
        onSuccess: () => {
          toast.success("Company activated successfully");
        },
        onError: (error) => {
          toast.error(`Failed to activate company: ${error instanceof Error ? error.message : 'Unknown error'}`);
        },
      }
    );
  };

  const handleDeactivate = () => {
    setIsDeactivateDialogOpen(true);
  };

  const goToNextListingsPage = () =>
    setListingsPage((prev) => Math.min(prev + 1, totalListingsPages));

  const goToPrevListingsPage = () =>
    setListingsPage((prev) => Math.max(prev - 1, 1));

  const goToNextActivityPage = () =>
    setActivityPage((prev) => Math.min(prev + 1, totalActivityPages));

  const goToPrevActivityPage = () =>
    setActivityPage((prev) => Math.max(prev - 1, 1));

  // Loading state
  if (isLoading) {
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
                <Skeleton className="h-12 w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Separator />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Error loading company data</h2>
        <p className="text-muted-foreground mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to companies
        </Button>
      </div>
    );
  }

  // Not found state
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
                    <CardTitle>{company.realEstateName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {company.address.city}, {company.address.region}
                    </p>
                  </div>
                </div>
                {getStatusBadge(company.companyStatus)}
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
                    href={`mailto:${company.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.phone}</span>
                </div>
                {company.website && (
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
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">
                    {company.address.specificLocation}
                  </span>
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
                      Document URL
                    </p>
                    <p className="text-sm font-medium truncate">
                      {company.documentUrl ? (
                        <a 
                          href={company.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Document
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Listings</p>
                    <p className="text-sm font-medium">
                      {company.listingsCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registered</p>
                    <p className="text-sm">
                      {format(new Date(company.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Social Media
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {company.socialMedia?.instagram && (
                    <div>
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <a
                        href={`https://instagram.com/${company.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @{company.socialMedia.instagram}
                      </a>
                    </div>
                  )}
                  {company.socialMedia?.facebook && (
                    <div>
                      <p className="text-xs text-muted-foreground">Facebook</p>
                      <a
                        href={`https://facebook.com/${company.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.socialMedia.facebook}
                      </a>
                    </div>
                  )}
                  {company.socialMedia?.linkedin && (
                    <div>
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <a
                        href={`https://linkedin.com/company/${company.socialMedia.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.socialMedia.linkedin}
                      </a>
                    </div>
                  )}
                  {company.socialMedia?.tiktok && (
                    <div>
                      <p className="text-xs text-muted-foreground">TikTok</p>
                      <a
                        href={`https://tiktok.com/@${company.socialMedia.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @{company.socialMedia.tiktok}
                      </a>
                    </div>
                  )}
                  {company.socialMedia?.whatsapp && (
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <a
                        href={`https://wa.me/${company.socialMedia.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {company.socialMedia.whatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Actions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {company.companyStatus === "active" ? (
                    <Button
                      variant="outline"
                      className="border-amber-500 text-amber-500 hover:bg-amber-50"
                      onClick={handleSuspend}
                      disabled={isSuspending}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      {isSuspending ? "Suspending..." : "Suspend Company"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={handleActivate}
                      disabled={isActivating}
                    >
                      {isActivating ? "Activating..." : "Activate Company"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeactivating ? "Deactivating..." : "Deactivate Company"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">
                    Details & Description
                  </TabsTrigger>
                  <TabsTrigger value="listings">Recent Listings</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs>
              <TabsContent value="details" className="mt-0">
                <div className="space-y-4">
                  <h3 className="font-medium">About {company.realEstateName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.description || "No description provided."}
                  </p>
                  
                  {company.imageUrl && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Company Image</h3>
                      <img 
                        src={company.imageUrl} 
                        alt={company.realEstateName}
                        className="rounded-md max-w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                </TabsContent>
                
              
              <TabsContent value="listings" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Listings</h3>
                    <div className="text-sm text-muted-foreground">
                      Page {listingsPage} of {totalListingsPages}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {mockListings
                      .slice(
                        (listingsPage - 1) * listingsPerPage,
                        listingsPage * listingsPerPage
                      )
                      .map((listing) => (
                        <Card key={listing.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{listing.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">
                                    {listing.type}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {listing.price}
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(listing.date, "MMM d, yyyy")}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToPrevListingsPage}
                      disabled={listingsPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToNextListingsPage}
                      disabled={listingsPage === totalListingsPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Activity Log</h3>
                    <div className="text-sm text-muted-foreground">
                      Page {activityPage} of {totalActivityPages}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mockActivityLog
                      .slice(
                        (activityPage - 1) * activitiesPerPage,
                        activityPage * activitiesPerPage
                      )
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 pb-4 border-b last:border-0"
                        >
                          <div className="mt-0.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {activity.action}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(activity.date, "MMM d, yyyy 'at' h:mm a")}
                            </div>
                            <div className="text-sm mt-1">
                              {activity.details}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToPrevActivityPage}
                      disabled={activityPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToNextActivityPage}
                      disabled={activityPage === totalActivityPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <SuspendCompanyDialog
        company={company}
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onSuspend={(reason) => {
          suspendCompany(
            { companyId: company._id, reason },
            {
              onSuccess: () => {
                toast.success("Company suspended successfully");
                setIsSuspendDialogOpen(false);
              },
              onError: (error) => {
                toast.error(`Failed to suspend company: ${error instanceof Error ? error.message : 'Unknown error'}`);
              },
            }
          );
        }}
      />

      <DeactivateCompanyDialog
        company={company}
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        onDeactivate={() => {
          deactivateCompany(company._id, {
            onSuccess: () => {
              toast.success("Company deactivated successfully");
              setIsDeactivateDialogOpen(false);
              router.push('/dashboard/companies');
            },
            onError: (error) => {
              toast.error(`Failed to deactivate company: ${error instanceof Error ? error.message : 'Unknown error'}`);
            },
          });
        }}
      />
    </div>
  );
}
