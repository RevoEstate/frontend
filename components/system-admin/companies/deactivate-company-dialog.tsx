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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface DeactivateCompanyDialogProps {
  company: {
    id: string
    name: string
  }
  isOpen: boolean
  onClose: () => void
  onDeactivate: () => void
}

export function DeactivateCompanyDialog({ company, isOpen, onClose, onDeactivate }: DeactivateCompanyDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState("")

  const expectedText = "deactivate"
  const isConfirmed = confirmText.toLowerCase() === expectedText

  const handleDeactivate = () => {
    if (!isConfirmed) {
      setError(`Please type "${expectedText}" to confirm`)
      return
    }

    onDeactivate()
    setConfirmText("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg max-h-[100vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Deactivate Company
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently deactivate{" "}
            <strong>{company.name}</strong>. This action cannot be undone. All
            company data, listings, and account information will be archived.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
            <p>Warning: This is a permanent action and cannot be reversed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-deactivation">
              Type{" "}
              <span className="font-mono bg-muted px-1 rounded">
                {expectedText}
              </span>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-deactivation"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmText("");
              setError("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeactivate}
            className="bg-red-600 hover:bg-red-700"
            disabled={!isConfirmed}
          >
            Deactivate Company
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
