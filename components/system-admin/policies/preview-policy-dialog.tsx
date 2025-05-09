"use client"

import { Eye } from "lucide-react"
import { format, parseISO } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Policy } from "@/types/policy"

interface PreviewPolicyDialogProps {
  policy: Policy
  isOpen: boolean
  onClose: () => void
}

export function PreviewPolicyDialog({ policy, isOpen, onClose }: PreviewPolicyDialogProps) {
  const formattedEffectiveDate = policy.effectiveDate 
    ? format(parseISO(policy.effectiveDate), "MMMM d, yyyy") 
    : "Not set"
  const formattedUpdatedAt = policy.updatedAt 
    ? format(parseISO(policy.updatedAt), "MMMM d, yyyy") 
    : "Not available"
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5" />
            {policy.title}
          </DialogTitle>
          <DialogDescription>
            Effective: {formattedEffectiveDate} • Last updated: {formattedUpdatedAt}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-line">{policy.description}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
