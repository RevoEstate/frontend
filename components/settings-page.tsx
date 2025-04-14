"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CreditCard,
  Lock,
  User,
  Palette,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  // Initialize state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | "system"
        | null;
      const savedCompactMode = localStorage.getItem("compactMode");
      const savedAnimations = localStorage.getItem("animations");
      const savedFontSize = localStorage.getItem("fontSize") as
        | "small"
        | "medium"
        | "large"
        | null;

      if (savedTheme) setTheme(savedTheme);
      if (savedCompactMode !== null)
        setCompactMode(savedCompactMode === "true");
      if (savedAnimations !== null) setAnimations(savedAnimations === "true");
      if (savedFontSize) setFontSize(savedFontSize);
    }
  }, []);

  // Apply theme changes
  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  // Apply compact mode
  const toggleCompactMode = (enabled: boolean) => {
    setCompactMode(enabled);
    localStorage.setItem("compactMode", enabled.toString());

    const root = document.documentElement;
    if (enabled) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }
  };

  // Apply animations setting
  const toggleAnimations = (enabled: boolean) => {
    setAnimations(enabled);
    localStorage.setItem("animations", enabled.toString());

    const root = document.documentElement;
    if (!enabled) {
      root.classList.add("no-animations");
    } else {
      root.classList.remove("no-animations");
    }
  };

  // Apply font size
  const changeFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);

    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");

    if (size === "small") {
      root.classList.add("text-sm");
    } else if (size === "large") {
      root.classList.add("text-lg");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america-new_york">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-new_york">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="america-chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="america-denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="america-los_angeles">
                        Pacific Time (PT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <Switch id="public-profile" defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">
                    When enabled, your profile will be visible to other users.
                  </p>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Settings */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password or enable two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Property Updates</Label>
                        <p className="text-sm text-gray-500">
                          Receive updates about your listed properties.
                        </p>
                      </div>
                      <Switch id="email-property-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Inquiries</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when someone inquires about your
                          property.
                        </p>
                      </div>
                      <Switch id="email-inquiries" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Updates</Label>
                        <p className="text-sm text-gray-500">
                          Receive tips and updates about real estate marketing.
                        </p>
                      </div>
                      <Switch id="email-marketing" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Instant Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Get real-time notifications for important updates.
                        </p>
                      </div>
                      <Switch id="push-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Messages</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications for new messages.
                        </p>
                      </div>
                      <Switch id="push-messages" defaultChecked />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Professional Plan</p>
                      <p className="text-sm text-gray-500">$29.99/month</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Your next billing date is{" "}
                    <span className="font-medium">May 15, 2025</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" /> Add Method
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Apr 15, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $29.99
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <Button variant="link" size="sm">
                            Download
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          Mar 15, 2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $29.99
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <Button variant="link" size="sm">
                            Download
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings - Simplified UI */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the dashboard looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 h-auto p-6",
                      theme === "light" && "border-2 border-primary"
                    )}
                    onClick={() => applyTheme("light")}
                  >
                    <Sun className="h-10 w-10" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 h-auto p-6",
                      theme === "dark" && "border-2 border-primary"
                    )}
                    onClick={() => applyTheme("dark")}
                  >
                    <Moon className="h-10 w-10" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 h-auto p-6",
                      theme === "system" && "border-2 border-primary"
                    )}
                    onClick={() => applyTheme("system")}
                  >
                    <Laptop className="h-10 w-10" />
                    <span>System</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Compact Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use a more compact layout to fit more content on screen.
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={toggleCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Animations</Label>
                    <p className="text-sm text-gray-500">
                      Enable animations and transitions throughout the
                      interface.
                    </p>
                  </div>
                  <Switch
                    id="animations"
                    checked={animations}
                    onCheckedChange={toggleAnimations}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={fontSize}
                  onValueChange={(value) =>
                    changeFontSize(value as "small" | "medium" | "large")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
