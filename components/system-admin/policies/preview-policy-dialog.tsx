"use client"

import { format } from "date-fns"
import { Eye, FileText } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PreviewPolicyDialogProps {
  policy: {
    id: string
    title: string
    description: string
    effectiveDate: Date
    lastUpdated: Date
    version: string
  }
  isOpen: boolean
  onClose: () => void
}

export function PreviewPolicyDialog({ policy, isOpen, onClose }: PreviewPolicyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Policy Preview
          </DialogTitle>
          <DialogDescription>This is how the policy will appear to users on the platform.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="bg-muted p-6 rounded-md">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{policy.title}</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground mb-6">
              <div>
                <span>Version {policy.version}</span>
                <span className="mx-2">•</span>
                <span>Last Updated: {format(policy.lastUpdated, "MMMM d, yyyy")}</span>
              </div>
              <div>Effective: {format(policy.effectiveDate, "MMMM d, yyyy")}</div>
            </div>

            <Separator className="mb-6" />

            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{policy.description}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
