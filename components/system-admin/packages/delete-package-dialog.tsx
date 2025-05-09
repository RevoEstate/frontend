"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useDeletePackage } from "@/hooks/useDeletePackage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface DeletePackageDialogProps {
  packageId: string;
  packageName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeletePackageDialog({
  packageId,
  packageName,
  isOpen,
  onClose,
}: DeletePackageDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState("");
  const { deletePackage, isDeleting, error, isSuccess } = useDeletePackage();

  const handleDelete = () => {
    deletePackage(packageId, {
      onSuccess: () => {
        toast({
          title: "Package deleted",
          description: `${packageName} has been successfully deleted.`,
        });
        onClose();
        router.push("/dashboard/packages");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to delete package: ${error.message}`,
        });
      },
    });
  };

  const isConfirmValid = confirmText === packageName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Package</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            package and remove it from our servers.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            To confirm, type{" "}
            <span className="font-semibold">{packageName}</span> below:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder={packageName}
            disabled={isDeleting}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="ml-2"
          >
            {isDeleting ? "Deleting..." : "Delete Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
