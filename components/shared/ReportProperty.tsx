"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const REPORT_REASONS = [
  "Violent content",
  "Sexually explicit content",
  "Fraudulent listing",
  "Hate speech or discrimination",
  "Spam or misleading information",
  "Inaccurate property details"
];

interface ReportPropertyProps {
  propertyId: string;
}

export function ReportProperty({ propertyId }: ReportPropertyProps) {
  const { data: session } = useSession();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Authentication Required", {
        description: "You must be logged in to submit a report",
      });
      return;
    }

    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/reportproperty/${propertyId}`,
        {
          reason,
        },
        {
          withCredentials: true
        }
      );

      toast.success("Report Submitted", {
        description: "Thank you for helping us improve our platform.",
      });
      setIsSubmitted(true);
      setReason("");
      setDetails("");
    } catch (error) {
      let errorMessage = "Failed to submit report";
  
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Alert variant="default" className="border-green-200 bg-green-50">
        <AlertTitle className="text-green-800">Report Submitted</AlertTitle>
        <AlertDescription className="text-green-700">
          Thank you for your report. Our team will review it shortly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Report Inappropriate Content</h2>
      {!session && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to submit a report.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Reason for reporting
          </label>
          <Select 
            onValueChange={setReason}
            value={reason}
            disabled={!session}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {REPORT_REASONS.map((reason) => (
                <SelectItem className="cursor-pointer" key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <Button
          type="submit"
          className="w-full cursor-pointer bg-sky-600 hover:bg-sky-600/80"
          disabled={!session || !reason || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </div>
  );
}