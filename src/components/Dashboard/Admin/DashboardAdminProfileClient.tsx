// src/components/Dashboard/Admin/DashboardAdminProfileClient.tsx
"use client";

import { useState } from "react";
import {
  Shield,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  User,
  Key,
  AlertCircle,
  Sparkles,
  Database,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ingestAllData } from "@/actions/rag.action";

interface AdminProfileClientProps {
  admin: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    createdAt: string;
    status: string;
  };
}

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function DashboardAdminProfileClient({
  admin,
}: AdminProfileClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [formData, setFormData] = useState({
    name: admin.name || "",
  });

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await authClient.updateUser({
        name: formData.name,
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: admin.name || "",
    });
    setIsEditing(false);
  };

  // AI Indexing handler
  const handleIndexing = async () => {
    setIsIndexing(true);
    const toastId = toast.loading("Indexing data for AI...");

    try {
      const { data, error } = await ingestAllData();

      if (error || !data) {
        toast.error("Failed to index data", { id: toastId });
      } else {
        toast.success(`AI data indexed successfully!`, {
          id: toastId,
          description: `Tutors: ${data.tutors}, Subjects: ${data.subjects}, FAQs: ${data.faqs}, Total: ${data.total} documents`,
        });
      }
    } catch {
      toast.error("Indexing failed", { id: toastId });
    } finally {
      setIsIndexing(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-full mx-auto space-y-6">
          {/* AI Indexing Card */}
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      AI Knowledge Base Indexing
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Index all tutors, subjects & FAQs for the AI chat
                      assistant. Run this after adding new data.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleIndexing}
                  disabled={isIndexing}
                  className="gap-2 shrink-0"
                >
                  {isIndexing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Indexing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Index Data Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Header Card */}
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={admin.image || ""} />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                      {getInitials(admin.name)}
                    </AvatarFallback>
                  </Avatar>
                  {admin.status === "UNBANNED" ? (
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 ring-2 ring-background" />
                  ) : (
                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-red-500 ring-2 ring-background" />
                  )}
                </div>

                {/* Admin Info */}
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter your name"
                            className="bg-background"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          size="sm"
                          className="gap-2"
                        >
                          {isSaving ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          size="sm"
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl font-bold">
                          {admin.name || "Admin"}
                        </h1>
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                        {admin.status === "BANNED" ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 border-green-500/20"
                          >
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{admin.email || "No email"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {formatDate(admin.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap mt-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Full Access
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="gap-2 hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Shield className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Key className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">
                        Full Name
                      </Label>
                      <p className="font-medium">{admin.name || "N/A"}</p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="font-medium">{admin.email || "N/A"}</p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">
                        Role
                      </Label>
                      <p className="font-medium capitalize">
                        {admin.role?.toLowerCase() || "admin"}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                      <Label className="text-xs text-muted-foreground">
                        User ID
                      </Label>
                      <p className="font-medium text-sm font-mono truncate">
                        {admin.id || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Account Status</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              admin.status === "UNBANNED"
                                ? "bg-green-500"
                                : "bg-red-500",
                            )}
                          />
                          <p className="font-medium">
                            {admin.status === "UNBANNED" ? "Active" : "Banned"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Account Type
                        </Label>
                        <p className="font-medium">Administrator</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Member Since
                        </Label>
                        <p className="font-medium">
                          {formatDate(admin.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Permissions
                        </Label>
                        <p className="font-medium">Full Access</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Account Actions</h3>
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Administrator Account</p>
                          <p className="text-sm text-muted-foreground">
                            You have full access to manage users, bookings,
                            categories, and subjects through the dashboard
                            navigation menu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Login Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Email
                        </Label>
                        <p className="font-medium">{admin.email || "N/A"}</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                        <Label className="text-xs text-muted-foreground">
                          Password
                        </Label>
                        <p className="font-medium">••••••••</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Security Actions</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() =>
                          toast.info(
                            "Password change functionality coming soon",
                          )
                        }
                      >
                        <Key className="h-4 w-4" />
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() =>
                          toast.info("2FA functionality coming soon")
                        }
                      >
                        <Shield className="h-4 w-4" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-yellow-600">
                          Security Notice
                        </p>
                        <p className="text-sm text-muted-foreground">
                          As an administrator, ensure your password is strong
                          and unique. Never share your credentials with anyone.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
