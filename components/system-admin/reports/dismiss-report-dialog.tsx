"use client"

import { useState } from "react"
import { X } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useReports } from "@/hooks/use-reports";
import { useReportsStore } from "@/store/reports";

interface DismissReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dismissReasons = [
  "Content does not violate platform policies",
  "Insufficient evidence of violation",
  "Report submitted in error",
  "Issue already resolved by content owner",
  "No action required",
  "Other",
];

export function DismissReportDialog({
  open,
  onOpenChange,
}: DismissReportDialogProps) {
  const { selectedReport, setSelectedReport } = useReportsStore();
  const { dismissReport } = useReports();
  const [reasonType, setReasonType] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");
  const [notifyReporter, setNotifyReporter] = useState(true);
  const [error, setError] = useState("");

  const handleDismiss = () => {
    if (!reasonType) {
      setError("Please select a reason type");
      return;
    }

    if (!reasonDetails.trim()) {
      setError("Please provide details for dismissing this report");
      return;
    }

    if (!selectedReport) return;

    const notes = `${reasonType}: ${reasonDetails}`;
    dismissReport({ id: selectedReport._id, notes });
    onOpenChange(false);
    setReasonType("");
    setReasonDetails("");
    setError("");
  };

  const handleClose = () => {
    setReasonType("");
    setReasonDetails("");
    setError("");
    onOpenChange(false);
  };

  if (!selectedReport) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5" />
            Dismiss Report
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are dismissing the report for property{" "}
            <strong>{selectedReport.propertyId}</strong>. This will mark the
            report as resolved without taking action against the content.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dismiss-reason-type">
              Reason Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={reasonType}
              onValueChange={(value) => {
                setReasonType(value);
                if (value) setError("");
              }}
            >
              <SelectTrigger
                id="dismiss-reason-type"
                className={error && !reasonType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select reason type" />
              </SelectTrigger>
              <SelectContent>
                {dismissReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dismiss-details">
              Explanation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="dismiss-details"
              placeholder="Please explain why this report is being dismissed..."
              value={reasonDetails}
              onChange={(e) => {
                setReasonDetails(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className={`min-h-[100px] ${error && !reasonDetails.trim() ? "border-red-500" : ""}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-reporter"
              checked={notifyReporter}
              onCheckedChange={(checked) =>
                setNotifyReporter(checked as boolean)
              }
            />
            <Label htmlFor="notify-reporter" className="text-sm">
              Notify reporter ({selectedReport.reporter?.name || "Unknown"})
            </Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDismiss}
            className="bg-primary hover:bg-primary/90"
          >
            Dismiss Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

