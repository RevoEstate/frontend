"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"

interface ResetPasswordDialogProps {
  account: {
    id: string
    name: string
    email: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ResetPasswordDialog({ account, isOpen, onClose }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState("")

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let newPassword = ""
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(newPassword)
    setError("")
  }

  const handleResetPassword = async () => {
    if (!password.trim()) {
      setError("Please enter a new password or generate one")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsResetting(true)
    try {
      // In a real app, you would send this data to your API
      console.log("Resetting password for account:", {
        accountId: account.id,
        password,
        sendEmail,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onClose()
    } catch (error) {
      console.error("Error resetting password:", error)
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Reset the password for <strong>{account.name}</strong> ({account.email}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-password">
                New Password <span className="text-red-500">*</span>
              </Label>
              <Button type="button" variant="link" size="sm" onClick={generateRandomPassword} className="h-auto p-0">
                Generate Strong Password
              </Button>
            </div>
            <Input
              id="new-password"
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-muted-foreground">
              The user will be prompted to change this password on next login.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-email"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked as boolean)}
            />
            <Label htmlFor="send-email">Send password reset email to user</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResetPassword} disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
