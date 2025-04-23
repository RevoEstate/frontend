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

interface RejectApplicationDialogProps {
  application: {
    id: string
    companyName: string
  }
  isOpen: boolean
  onClose: () => void
  onReject: (reason: string) => void
}

export function RejectApplicationDialog({ application, isOpen, onClose, onReject }: RejectApplicationDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleReject = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection")
      return
    }

    onReject(reason)
    setReason("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Reject Application
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to reject the application from <strong>{application.companyName}</strong>. This action will
            notify the company and archive the application.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="rejection-reason" className="mb-2 block">
            Reason for Rejection <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="rejection-reason"
            placeholder="Please provide a detailed reason for rejection..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (e.target.value.trim()) setError("")
            }}
            className={`min-h-[120px] ${error ? "border-red-500" : ""}`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReason("")
              setError("")
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
            Reject Application
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
