"use client"

import { format } from "date-fns"
import { Check, File, X } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ApplicationDetailsModalProps {
  application: {
    id: string;
    companyName: string;
    applicationDate: Date;
    taxId: string;
    documentsUploaded: string[];
    status: string;
    contentOwner: {
      name: string;
      email: string;
      avatar: string;
    };
    address: string;
    website: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ApplicationDetailsModalProps) {
  // Mock company details - in a real app, you would fetch this data
  const companyDetails = {
    contactName: application.contentOwner.name,
    contactEmail: application.contentOwner.email,
    contactPhone: application.taxId,
    address: application.address,
    documentsUploaded: application.documentsUploaded,
    website: application.website,
  };

  // Mock comments - in a real app, you would fetch these
  const comments = [
    {
      id: "1",
      author: "Admin",
      date: new Date(),
      text: "Application is under review.",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "initial":
        return (
          <Badge
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
            variant="outline"
          >
            New
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[80vh] m-auto flex flex-col max-h-[90vh] overflow-hidden my-10 mx-auto"
        style={{ zIndex: 9999 }}
      >
        <style jsx global>{`
          [data-radix-portal] > div {
            z-index: 9999 !important;
          }
        `}</style>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{application.companyName}</span>
            {getStatusBadge(application.status)}
          </DialogTitle>
          <DialogDescription>
            Application submitted on{" "}
            {format(application.applicationDate, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="details" className="space-y-4 pt-4 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Contact Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {companyDetails.contactName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {companyDetails.contactEmail}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {companyDetails.contactPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h3>
                  <p className="mt-2">{companyDetails.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Business Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Tax ID/Phone:</span>{" "}
                      {application.taxId}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Online Presence
                  </h3>
                  <p className="mt-2">
                    <span className="font-medium">Website:</span>{" "}
                    {companyDetails.website}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="documents"
              className="space-y-4 pt-4 h-full overflow-auto"
            >
              <div className="space-y-4">
                {application.documentsUploaded.length > 0 ? (
                  application.documentsUploaded.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <File className="h-5 w-5 text-blue-500" />
                        <span>{doc}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No documents available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="comments"
              className="space-y-4 pt-4 h-full overflow-auto"
            >
              <div className="space-y-4 max-h-[40vh] overflow-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(comment.date, "MMM d, yyyy")}
                      </span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Add Comment</h3>
                <Textarea
                  placeholder="Add your notes here..."
                  className="min-h-[100px]"
                />
                <Button className="mt-2">Add Comment</Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          {application.status !== "approved" &&
            application.status !== "rejected" && (
              <>
                <Button
                  variant="outline"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={onApprove}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onReject}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </>
            )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
