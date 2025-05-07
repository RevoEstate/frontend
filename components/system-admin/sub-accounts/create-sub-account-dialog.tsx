"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateSubAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateSubAccountDialog({ isOpen, onClose }: CreateSubAccountDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    permissions: {
      approveListings: false,
      viewReports: false,
      manageUsers: false,
      manageContent: false,
      accessAnalytics: false,
      managePayments: false,
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handlePermissionChange = (permission: keyof typeof formData.permissions, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Temporary password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, you would send this data to your API
      console.log("Creating sub-account:", formData)
      onClose()
    }
  }

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    handleInputChange("password", password)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Sub-Account
          </DialogTitle>
          <DialogDescription>Create a new manager or sub-admin account with specific permissions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="sub-admin">Sub-Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="content-moderator">Content Moderator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Temporary Password <span className="text-red-500">*</span>
              </Label>
              <Button type="button" variant="link" size="sm" onClick={generateRandomPassword} className="h-auto p-0">
                Generate
              </Button>
            </div>
            <Input
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <p className="text-xs text-muted-foreground">
              The user will be prompted to change this password on first login.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approveListings"
                  checked={formData.permissions.approveListings}
                  onCheckedChange={(checked) => handlePermissionChange("approveListings", checked as boolean)}
                />
                <Label htmlFor="approveListings" className="text-sm">
                  Approve Listings
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewReports"
                  checked={formData.permissions.viewReports}
                  onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                />
                <Label htmlFor="viewReports" className="text-sm">
                  View Reports
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageUsers"
                  checked={formData.permissions.manageUsers}
                  onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                />
                <Label htmlFor="manageUsers" className="text-sm">
                  Manage Users
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageContent"
                  checked={formData.permissions.manageContent}
                  onCheckedChange={(checked) => handlePermissionChange("manageContent", checked as boolean)}
                />
                <Label htmlFor="manageContent" className="text-sm">
                  Manage Content
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessAnalytics"
                  checked={formData.permissions.accessAnalytics}
                  onCheckedChange={(checked) => handlePermissionChange("accessAnalytics", checked as boolean)}
                />
                <Label htmlFor="accessAnalytics" className="text-sm">
                  Access Analytics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="managePayments"
                  checked={formData.permissions.managePayments}
                  onCheckedChange={(checked) => handlePermissionChange("managePayments", checked as boolean)}
                />
                <Label htmlFor="managePayments" className="text-sm">
                  Manage Payments
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
