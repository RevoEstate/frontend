"use client"

import { Archive } from "lucide-react"

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
import { useState } from "react"

interface ArchivePolicyDialogProps {
  policy: {
    id: string
    title: string
  }
  isOpen: boolean
  onClose: () => void
  onArchive: () => void
}

export function ArchivePolicyDialog({ policy, isOpen, onClose, onArchive }: ArchivePolicyDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleArchive = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for archiving this policy")
      return
    }

    onArchive()
    setReason("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <Archive className="h-5 w-5" />
            Archive Policy
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to archive <strong>{policy.title}</strong>. This will make the policy inactive and no longer
            visible to users. Archived policies can still be viewed in the admin dashboard but cannot be edited.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="archive-reason">
              Reason for Archiving <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="archive-reason"
              placeholder="Please provide a reason for archiving this policy..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              className={`min-h-[100px] ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
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
          <AlertDialogAction onClick={handleArchive} className="bg-amber-600 hover:bg-amber-700">
            Archive Policy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
