"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Eye, FileText, History, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreviewPolicyDialog } from "@/components/system-admin/policies/preview-policy-dialog"

// Mock data for demonstration - in a real app, you would fetch this from an API
const policies = [
  {
    id: "POL-1001",
    title: "Terms of Service",
    description:
      "These Terms of Service govern your use of our platform and services. By accessing or using our services, you agree to be bound by these terms.",
    effectiveDate: new Date(2023, 9, 15),
    lastUpdated: new Date(2023, 9, 15),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1002",
    title: "Privacy Policy",
    description:
      "This Privacy Policy describes how we collect, use, and share your personal information when you use our platform and services.",
    effectiveDate: new Date(2023, 9, 15),
    lastUpdated: new Date(2023, 10, 5),
    status: "active",
    version: "1.1",
  },
]

// Mock revision history
const revisionHistory = [
  {
    id: "REV-1001",
    version: "1.0",
    date: new Date(2023, 9, 15),
    user: "Admin User",
    changes: "Initial policy creation.",
  },
  {
    id: "REV-1002",
    version: "1.1",
    date: new Date(2023, 10, 5),
    user: "Admin User",
    changes: "Updated data processing information to comply with new regulations.",
  },
]

export default function EditPolicyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [policy, setPolicy] = useState<(typeof policies)[0] | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    effectiveDate: new Date(),
    notifyUsers: false,
    notifyEmail: false,
  })
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the policy data from an API
    const foundPolicy = policies.find((p) => p.id === params.id)
    if (foundPolicy) {
      setPolicy(foundPolicy)
      setFormData({
        title: foundPolicy.title,
        description: foundPolicy.description,
        effectiveDate: foundPolicy.effectiveDate,
        notifyUsers: false,
        notifyEmail: false,
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSaving(true)
      try {
        // In a real app, you would send this data to your API
        console.log("Updating policy:", {
          id: policy?.id,
          ...formData,
        })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Show success message or redirect
        router.back()
      } catch (error) {
        console.error("Error updating policy:", error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Policy not found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to policies
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
        <h1 className="text-2xl font-bold tracking-tight">Edit Policy</h1>
      </div>

      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit Policy</TabsTrigger>
          <TabsTrigger value="history">Revision History</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>{policy.title}</CardTitle>
              </div>
              <CardDescription>
                ID: {policy.id} • Version: {policy.version} • Last Updated: {format(policy.lastUpdated, "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Policy Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
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
                  className={`min-h-[300px] ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button id="effectiveDate" variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(formData.effectiveDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
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

              <Separator />

              <div className="space-y-3">
                <Label>Notification Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyUsers"
                      checked={formData.notifyUsers}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, notifyUsers: checked as boolean }))
                      }
                    />
                    <Label htmlFor="notifyUsers">Send platform notification to all users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyEmail"
                      checked={formData.notifyEmail}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, notifyEmail: checked as boolean }))
                      }
                    />
                    <Label htmlFor="notifyEmail">Send email notification to all users</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsPreviewDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle>Revision History</CardTitle>
              </div>
              <CardDescription>View all changes made to this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {revisionHistory.map((revision) => (
                  <div key={revision.id} className="flex flex-col space-y-2 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Version {revision.version}</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {format(revision.date, "MMM d, yyyy")}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Version
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Changes:</span> {revision.changes}
                    </p>
                    <p className="text-xs text-muted-foreground">Updated by {revision.user}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PreviewPolicyDialog
        policy={{
          ...policy,
          title: formData.title,
          description: formData.description,
          effectiveDate: formData.effectiveDate,
        }}
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
      />
    </div>
  )
}
