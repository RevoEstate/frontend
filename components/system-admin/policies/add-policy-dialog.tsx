"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface AddPolicyDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPolicyDialog({ isOpen, onClose }: AddPolicyDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    effectiveDate: new Date(),
    notifyUsers: true,
    notifyEmail: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Policy title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Policy description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, you would send this data to your API
      console.log("Adding new policy:", formData)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Policy
          </DialogTitle>
          <DialogDescription>Create a new platform policy or terms of service.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Policy Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
              placeholder="e.g., Privacy Policy, Terms of Service"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Policy Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[200px] ${errors.description ? "border-red-500" : ""}`}
              placeholder="Enter the full policy text here..."
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button id="effectiveDate" variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.effectiveDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.effectiveDate}
                  onSelect={(date) => {
                    if (date) {
                      setFormData((prev) => ({ ...prev, effectiveDate: date }))
                      setDatePickerOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label>Notification Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyUsers"
                  checked={formData.notifyUsers}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, notifyUsers: checked as boolean }))}
                />
                <Label htmlFor="notifyUsers">Send platform notification to all users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyEmail"
                  checked={formData.notifyEmail}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, notifyEmail: checked as boolean }))}
                />
                <Label htmlFor="notifyEmail">Send email notification to all users</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Policy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
