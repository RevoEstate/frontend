"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface RemoveContentDialogProps {
  report: {
    id: string
    contentDescription: string
    propertyId: string
    contentOwner: {
      name: string
      email: string
    }
    reportedBy: {
      name: string
      email: string
    }
  }
  isOpen: boolean
  onClose: () => void
  onRemove: () => void
}

export function RemoveContentDialog({ report, isOpen, onClose, onRemove }: RemoveContentDialogProps) {
  const [explanation, setExplanation] = useState("")
  const [notifyContentOwner, setNotifyContentOwner] = useState(true)
  const [notifyReporter, setNotifyReporter] = useState(true)
  const [error, setError] = useState("")

  const handleRemove = () => {
    if (!explanation.trim()) {
      setError("Please provide an explanation for removing this content")
      return
    }

    onRemove()
    setExplanation("")
    setError("")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Remove Reported Content
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to remove the reported content for <strong>{report.propertyId}</strong>. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Content to be removed:</p>
            <p className="text-sm bg-muted p-2 rounded">{report.contentDescription}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">
              Explanation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="explanation"
              placeholder="Please explain why this content is being removed..."
              value={explanation}
              onChange={(e) => {
                setExplanation(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              className={`min-h-[100px] ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-owner"
                checked={notifyContentOwner}
                onCheckedChange={(checked) => setNotifyContentOwner(checked as boolean)}
              />
              <Label htmlFor="notify-owner" className="text-sm">
                Notify content owner ({report.contentOwner.name})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-reporter"
                checked={notifyReporter}
                onCheckedChange={(checked) => setNotifyReporter(checked as boolean)}
              />
              <Label htmlFor="notify-reporter" className="text-sm">
                Notify reporter ({report.reportedBy.name})
              </Label>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setExplanation("")
              setError("")
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">
            Remove Content
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
