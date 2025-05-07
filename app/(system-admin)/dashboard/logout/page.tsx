"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Auto-redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !isLoggingOut) {
      handleLogout()
    }
  }, [countdown, isLoggingOut])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // In a real app, you would call your logout API endpoint
      console.log("Logging out...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear any auth tokens, cookies, etc.
      // For example: localStorage.removeItem('authToken')

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-500" />
            Logout Confirmation
          </CardTitle>
          <CardDescription>You are about to log out of the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Are you sure you want to log out? Any unsaved changes will be lost.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            You will be automatically logged out in {countdown} seconds.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel} disabled={isLoggingOut}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Confirm Logout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
