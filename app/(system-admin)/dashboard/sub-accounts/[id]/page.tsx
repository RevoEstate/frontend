"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, KeyRound, Save, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ResetPasswordDialog } from "@/components/system-admin/sub-accounts/reset-password-dialog"

// Mock data for demonstration - in a real app, you would fetch this from an API
const subAccounts = [
  {
    id: "SA-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date(2023, 10, 15, 14, 30),
    permissions: {
      approveListings: true,
      viewReports: true,
      manageUsers: false,
      manageContent: true,
      accessAnalytics: false,
      managePayments: false,
    },
  },
  {
    id: "SA-1002",
    name: "Maria Johnson",
    email: "maria.johnson@example.com",
    role: "Sub-Admin",
    status: "active",
    lastLogin: new Date(2023, 10, 14, 9, 45),
    permissions: {
      approveListings: true,
      viewReports: true,
      manageUsers: true,
      manageContent: true,
      accessAnalytics: true,
      managePayments: false,
    },
  },
]

export default function EditSubAccountPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [account, setAccount] = useState<(typeof subAccounts)[0] | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: {
      approveListings: false,
      viewReports: false,
      manageUsers: false,
      manageContent: false,
      accessAnalytics: false,
      managePayments: false,
    },
  })
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the account data from an API
    const foundAccount = subAccounts.find((a) => a.id === params.id)
    if (foundAccount) {
      setAccount(foundAccount)
      setFormData({
        name: foundAccount.name,
        email: foundAccount.email,
        role: foundAccount.role,
        permissions: { ...foundAccount.permissions },
      })
    }
  }, [params.id])

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

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSaving(true)
      try {
        // In a real app, you would send this data to your API
        console.log("Updating sub-account:", {
          id: account?.id,
          ...formData,
        })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Show success message or redirect
        router.back()
      } catch (error) {
        console.error("Error updating account:", error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Account not found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sub-accounts
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Sub-Account</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{account.name}</CardTitle>
              <CardDescription>
                {account.role} • ID: {account.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Sub-Admin">Sub-Admin</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Content Moderator">Content Moderator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResetPasswordDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Reset Password
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Last login: {new Date(account.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Permissions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approveListings"
                  checked={formData.permissions.approveListings}
                  onCheckedChange={(checked) => handlePermissionChange("approveListings", checked as boolean)}
                />
                <Label htmlFor="approveListings">Approve Listings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewReports"
                  checked={formData.permissions.viewReports}
                  onCheckedChange={(checked) => handlePermissionChange("viewReports", checked as boolean)}
                />
                <Label htmlFor="viewReports">View Reports</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageUsers"
                  checked={formData.permissions.manageUsers}
                  onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked as boolean)}
                />
                <Label htmlFor="manageUsers">Manage Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manageContent"
                  checked={formData.permissions.manageContent}
                  onCheckedChange={(checked) => handlePermissionChange("manageContent", checked as boolean)}
                />
                <Label htmlFor="manageContent">Manage Content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessAnalytics"
                  checked={formData.permissions.accessAnalytics}
                  onCheckedChange={(checked) => handlePermissionChange("accessAnalytics", checked as boolean)}
                />
                <Label htmlFor="accessAnalytics">Access Analytics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="managePayments"
                  checked={formData.permissions.managePayments}
                  onCheckedChange={(checked) => handlePermissionChange("managePayments", checked as boolean)}
                />
                <Label htmlFor="managePayments">Manage Payments</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <ResetPasswordDialog
        account={account}
        isOpen={isResetPasswordDialogOpen}
        onClose={() => setIsResetPasswordDialogOpen(false)}
      />
    </div>
  )
}
