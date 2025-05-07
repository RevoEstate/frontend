"use client"

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
import { useState } from "react"

interface DeactivateAccountDialogProps {
  account: {
    id: string
    name: string
    email: string
    role: string
  }
  isOpen: boolean
  onClose: () => void
  onDeactivate: () => void
}

export function DeactivateAccountDialog({ account, isOpen, onClose, onDeactivate }: DeactivateAccountDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleDeactivate = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for deactivating this account")
      return
    }

    onDeactivate()
    setReason("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Deactivate Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to deactivate <strong>{account.name}</strong> ({account.role}). This will temporarily disable
            their access to the platform. They will not be able to log in until the account is reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="deactivation-reason">
              Reason for Deactivation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="deactivation-reason"
              placeholder="Please provide a reason for deactivating this account..."
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
          <AlertDialogAction onClick={handleDeactivate} className="bg-amber-600 hover:bg-amber-700">
            Deactivate Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
