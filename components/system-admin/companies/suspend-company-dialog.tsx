"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SuspendCompanyDialogProps {
  company: {
    _id: string;
    realEstateName: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (reason: string) => void;
}

const suspensionReasons = [
  "Terms of Service Violation",
  "Fraudulent Activity",
  "Misleading Information",
  "Customer Complaints",
  "Verification Issues",
  "Other",
]

export function SuspendCompanyDialog({ company, isOpen, onClose, onSuspend }: SuspendCompanyDialogProps) {
  const [reasonType, setReasonType] = useState("")
  const [reasonDetails, setReasonDetails] = useState("")
  const [error, setError] = useState("")

  const handleSuspend = () => {
    if (!reasonType) {
      setError("Please select a reason type")
      return
    }

    if (!reasonDetails.trim()) {
      setError("Please provide details for the suspension")
      return
    }

    const fullReason = `${reasonType}: ${reasonDetails}`
    onSuspend(fullReason)
    setReasonType("")
    setReasonDetails("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg max-h-[100vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Suspend Company
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to suspend <strong>{company.realEstateName}</strong>.
            This will temporarily disable their account and prevent them from
            accessing the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4 overflow-visible">
          <div className="space-y-2">
            <Label htmlFor="suspension-reason-type">
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
                id="suspension-reason-type"
                className={error && !reasonType ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select reason type" />
              </SelectTrigger>
              <SelectContent>
                {suspensionReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspension-details">
              Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="suspension-details"
              placeholder="Please provide specific details about the suspension reason..."
              value={reasonDetails}
              onChange={(e) => {
                setReasonDetails(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className={`min-h-[20px] ${error && !reasonDetails.trim() ? "border-red-500" : ""}`}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReasonType("");
              setReasonDetails("");
              setError("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSuspend}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Suspend Company
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
