"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  _id?: string;
}

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    imageUrl: user?.imageUrl || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!user?.id) return; // Skip if no user ID
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/getuserbyId/${user.id}`,
          {
            withCredentials: true,
          }
        );
        const userData: UserData = response?.data?.data?.user;
        console.log("User data fetched:", userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          imageUrl: userData.imageUrl || "",
          isVerified: userData.isVerified || false,
          emailVerified: userData.emailVerified || false,
          createdAt: userData.createdAt || "",
          updatedAt: userData.updatedAt || "",
          role: userData.role || "",
          _id: userData._id || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserById();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      if (formData.phone) formDataToSend.append("phone", formData.phone);
      if (imageFile) formDataToSend.append("image", imageFile);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/updateMe`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        ...response.data.data.user,
      }));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      imageUrl: user?.imageUrl || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
  };

  if (!user) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
              src={imagePreview || formData.imageUrl || ""}
              alt={`${formData.firstName} ${formData.lastName}`}
            />
            <AvatarFallback>
              <h1 className="text-4xl font-bold">
                {formData.firstName?.charAt(0)}
              </h1>
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <div className="mb-4">
              <Label htmlFor="image" className="block mb-2 text-sm font-medium">
                Change Profile Picture
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <div onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button
                className="bg-sky-600 hover:bg-sky-600/80 cursor-pointer"
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{formData.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{formData.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">
                  {formData.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{formData.role || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Verified</p>
                <p className="font-medium">
                  {formData.emailVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;
