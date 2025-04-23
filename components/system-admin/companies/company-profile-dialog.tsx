"use client"

import { format } from "date-fns"
import { Ban, Building2, Calendar, ExternalLink, Globe, Mail, MapPin, Phone, Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CompanyProfileDialogProps {
  company: {
    id: string
    name: string
    logo: string
    contactEmail: string
    registrationDate: Date
    numberOfListings: number
    status: string
    location: string
    verificationStatus: string
    licenseNumber: string
    website: string
    phone: string
    address: string
  }
  isOpen: boolean
  onClose: () => void
  onSuspend: () => void
  onDeactivate: () => void
}

// Mock listings data
const mockListings = [
  { id: "1", title: "Modern Downtown Apartment", type: "Apartment", price: "$2,500/mo", date: new Date(2023, 9, 15) },
  { id: "2", title: "Luxury Waterfront Condo", type: "Condo", price: "$750,000", date: new Date(2023, 9, 10) },
  { id: "3", title: "Spacious Family Home", type: "House", price: "$450,000", date: new Date(2023, 9, 5) },
  { id: "4", title: "Commercial Office Space", type: "Commercial", price: "$35/sqft/yr", date: new Date(2023, 8, 28) },
]

// Mock activity log
const mockActivityLog = [
  { id: "1", action: "New listing added", date: new Date(2023, 9, 15), details: "Modern Downtown Apartment" },
  {
    id: "2",
    action: "Responded to inquiry",
    date: new Date(2023, 9, 12),
    details: "From John Smith regarding Luxury Waterfront Condo",
  },
  { id: "3", action: "Updated company profile", date: new Date(2023, 9, 8), details: "Changed contact information" },
  { id: "4", action: "New listing added", date: new Date(2023, 9, 5), details: "Spacious Family Home" },
  { id: "5", action: "Verification documents submitted", date: new Date(2023, 8, 30), details: "License renewal" },
]

export function CompanyProfileDialog({ company, isOpen, onClose, onSuspend, onDeactivate }: CompanyProfileDialogProps) {
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending Verification
          </Badge>
        )
      case "unverified":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Unverified
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary/10 text-primary">
              <AvatarFallback>
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {company.name}
          </DialogTitle>
          <DialogDescription>Registered on {format(company.registrationDate, "MMMM d, yyyy")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="details" className="space-y-6 pt-4 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{company.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${company.contactEmail}`} className="text-sm text-primary hover:underline">
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getVerificationBadge(company.verificationStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">License Number:</span>
                      <span className="text-sm">{company.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Listings:</span>
                      <span className="text-sm">{company.numberOfListings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{company.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Registration Date:</span>
                      <span className="text-sm">{format(company.registrationDate, "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="space-y-4 pt-4 h-full overflow-auto">
              <div className="space-y-4">
                {mockListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{listing.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline">{listing.type}</Badge>
                            <span className="text-sm font-medium">{listing.price}</span>
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
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 pt-4 h-full overflow-auto">
              <div className="space-y-4">
                {mockActivityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-md">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-sm text-muted-foreground">{format(activity.date, "MMM d, yyyy")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Separator className="my-4" />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {company.status !== "suspended" && (
            <Button
              variant="outline"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={onSuspend}
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend Company
            </Button>
          )}
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onDeactivate}>
            <Trash2 className="h-4 w-4 mr-2" />
            Deactivate Company
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
