"use client"

import { Trash2 } from "lucide-react";

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
import { Staff } from "@/hooks/useStaff";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DeleteAccountDialogProps {
  account: Staff;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteAccountDialog({
  account,
  isOpen,
  onClose,
  onDelete,
  isDeleting = false,
}: DeleteAccountDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this account? This action cannot be
            undone and will permanently remove all data associated with this
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{account.firstName} { account.lastName }</span>
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
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
