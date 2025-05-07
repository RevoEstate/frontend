import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectApplicationDialogProps {
  application: {
    id: string;
    companyName: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  isRejecting?: boolean; // Optional, for loading state
}

export function RejectApplicationDialog({
  application,
  isOpen,
  onClose,
  onReject,
  isRejecting,
}: RejectApplicationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    onReject(rejectionReason);
    setRejectionReason(""); // Clear the input
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Reject Application: {application.companyName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="rejectionReason">Rejection Reason</Label>
          <Textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejecting this application"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRejecting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isRejecting}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
