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

interface DeleteAccountDialogProps {
  account: {
    id: string
    name: string
    email: string
    role: string
  }
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeleteAccountDialog({ account, isOpen, onClose, onDelete }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState("")

  const expectedText = "delete"
  const isConfirmed = confirmText.toLowerCase() === expectedText

  const handleDelete = () => {
    if (!isConfirmed) {
      setError(`Please type "${expectedText}" to confirm`)
      return
    }

    onDelete()
    setConfirmText("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently delete <strong>{account.name}</strong> ({account.role}). This action cannot be
            undone. All account data and access permissions will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
            <p>Warning: This is a permanent action and cannot be reversed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-deletion">
              Type <span className="font-mono bg-muted px-1 rounded">{expectedText}</span> to confirm
            </Label>
            <Input
              id="confirm-deletion"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value)
                setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmText("")
              setError("")
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={!isConfirmed}>
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
