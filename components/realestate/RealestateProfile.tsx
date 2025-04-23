"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BadgeCheck, Globe, Hourglass, Mail, MapPin, Phone, SquareChartGantt, Verified } from "lucide-react"
import Link from "next/link"
import { useRealestateByUserId } from "@/hooks/useRealestateByUser"
import { useRealestateById } from "@/hooks/useRealestateById"
import { RealEstateProfileSkeleton } from "./RealEstateProfileSkeleton"

export function RealEstateProfile() {
  const { realestate: userRealestate, isLoading: userLoading } = useRealestateByUserId();
  const { 
    realestate, 
    isLoading, 
    error 
  } = useRealestateById(userRealestate?._id);

  if (isLoading || userLoading) {
    return <RealEstateProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-medium">Error loading profile</h3>
          <p className="text-sm mt-1">
            {error?.message || "Failed to load real estate data"}
          </p>
        </div>
      </div>
    );
  }

  if(!realestate?.isVerified) {
    return(
      <div className="border-1 py-10 px-5 text-gray-900">
      <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="font-medium text-center md:text-xl">Your Document is Under revision for Verification!</h1>
      <p className="text-muted-foreground text-xs md:text-sm">Wait for sometime</p>
      </div>
    </div>
    )
   
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Header */}
        <div className="md:w-1/3 space-y-4">
          <Card className="shadow-sm rounded-sm">
            <CardHeader>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-25 w-25">
                  <AvatarImage
                    alt="company logo"
                    src="/images/realestate logo.jpg"
                    />
                  <AvatarFallback className="text-7xl text-sky-800 font-bold bg-sky-50/90">
                    {realestate?.realEstateName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <CardTitle className="text-xl md:text-2xl flex  gap-2 items-center justify-between">
                    {realestate?.realEstateName}
                    {realestate?.isVerified ? (
                        <BadgeCheck size={48} color="#00db04" strokeWidth={3} className="h-6 w-6" />
                    ) : (
                        <Badge></Badge>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-3">{realestate?.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={28} strokeWidth={2} className="text-muted-foreground" />
                  <span>
                    {realestate?.address.specificLocation}, {realestate?.address.city}, {realestate?.address.region}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{realestate?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{realestate?.email}</span>
                </div>
              </div>

              {realestate?.socialMedia && (
                <>
                  <Separator />
                  <div className="flex justify-center gap-4">
                    {realestate?.socialMedia.instagram && (
                      <Link href={realestate?.socialMedia.instagram} target="_blank">
                        <Button variant="outline" size="icon" className="cursor-pointer hover:text-rose-500">
                          <InstagramIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {realestate?.socialMedia.facebook && (
                      <Link href={realestate?.socialMedia.facebook} target="_blank">
                        <Button variant="outline" size="icon" className="cursor-pointer hover:text-sky-500">
                          <FacebookIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {realestate?.socialMedia.linkedin && (
                      <Link href={realestate?.socialMedia.linkedin} target="_blank">
                        <Button variant="outline" size="icon" className="cursor-pointer hover:text-sky-500">
                          <LinkedinIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 space-y-6">        
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Verified className="h-5 w-5 text-green-500" />
                  <CardTitle>Verified Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Verified On</p>
                    <p className="font-medium">
                      {new Date(realestate.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Verified By</p>
                    <p className="font-medium">
                      {realestate?.verifiedBy || "System Administrator"}
                    </p>
                  </div>
                   {/* Documents */}
                    {realestate?.verificationDocuments?.length > 0 && ( 
                        <div>
                            {realestate?.verificationDocuments && (
                            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
                                <span className="text-sm font-medium truncate">
                                    Document
                                </span>
                                </div>
                                <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                                View Document
                                </Button>
                            </div>
                            )}
                        </div>
                    )}
                </div>
              </CardContent>
            </Card>          

          {/* Location Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Globe className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Map view coming soon</p>
                  <p className="text-sm">
                    {realestate?.address.specificLocation}, {realestate?.address.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Social Media Icons
function InstagramIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}