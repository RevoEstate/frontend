"use client"

import { ShieldOff } from "lucide-react"

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
import { Staff } from "@/hooks/useStaff"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DeactivateAccountDialogProps {
  account: Staff
  isOpen: boolean
  onClose: () => void
  onDeactivate: () => void
  isDeactivating?: boolean
}

export function DeactivateAccountDialog({
  account,
  isOpen,
  onClose,
  onDeactivate,
  isDeactivating = false,
}: DeactivateAccountDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-amber-500" />
            Deactivate Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate this account? The user will no longer be able to log in or access the
            system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{account.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{account.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role:</span>
                <span className="text-sm">{account.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{account.staffId}</span>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeactivating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onDeactivate()
            }}
            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4" />
                <span>Deactivating...</span>
              </div>
            ) : (
              "Deactivate Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
