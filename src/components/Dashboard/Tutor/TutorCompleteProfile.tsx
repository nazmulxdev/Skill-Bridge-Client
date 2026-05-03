// src/components/Dashboard/Tutor/TutorCompleteProfile.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  Star,
  Mail,
  Award,
  Briefcase,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { TutorBookings } from "./TutorBookings";

// Import your existing components
import { TutorHourlyRate } from "./HourlyRate";
import { TutorEducation } from "./TutorEducation";
import { TutorSubject } from "./TutorSubject";
import { TutorAvailability } from "./TutorAvailability";
import { TutorTimeSlot } from "./TutorTimeSlot";

interface TutorProfileDetailsProps {
  userData: any;
}

// Define types for better type safety
interface SubjectItem {
  id: string;
  subject: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
      description?: string;
    } | null;
  };
}

interface CategoryGroup {
  [key: string]: SubjectItem[];
}

// Define type for review item
interface ReviewItem {
  id: string;
  rating: string;
  comment?: string;
  createdAt: string;
}

// Define type for time slot item
interface TimeSlotItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export function TutorCompleteProfile({ userData }: TutorProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || "",
  });

  const { name, email, image, tutorProfiles } = userData;

  if (!tutorProfiles) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No tutor profile found</p>
        </CardContent>
      </Card>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate average rating
  const avgRating =
    tutorProfiles.reviews?.length > 0
      ? (
          tutorProfiles.reviews.reduce(
            (acc: number, r: ReviewItem) => acc + parseFloat(r.rating),
            0,
          ) / tutorProfiles.reviews.length
        ).toFixed(1)
      : "0.0";

  const handleSaveName = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await authClient.updateUser({
        name: formData.name,
      });

      toast.success("Name updated successfully");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userData.name || "",
    });
    setIsEditing(false);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={image || ""} />
              <AvatarFallback className="text-3xl bg-primary/10">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tutor-name">Full Name</Label>
                    <Input
                      id="tutor-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="bg-background max-w-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveName}
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
                    <h1 className="text-3xl font-bold">{name}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 hover:bg-primary/10"
                      title="Edit name"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {tutorProfiles.isFeatured && (
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <Award className="h-3 w-3 mr-1" /> Featured Tutor
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />$
                      {tutorProfiles.hourlyRate}/hour
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/20"
                    >
                      <Star className="h-3 w-3 mr-1 fill-success" />
                      {avgRating} ({tutorProfiles.reviews?.length || 0} reviews)
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      Active since{" "}
                      {new Date(tutorProfiles.createdAt).getFullYear()}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subjects</p>
              <p className="text-xl font-bold">
                {tutorProfiles.subjects?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Education</p>
              <p className="text-xl font-bold">
                {tutorProfiles.education?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Availability</p>
              <p className="text-xl font-bold">
                {tutorProfiles.availabilities?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Slots</p>
              <p className="text-xl font-bold">
                {tutorProfiles.tutorTimeSlots?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs with Your Existing Components */}
      <Tabs defaultValue="hourly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        </TabsList>

        {/* Hourly Rate Tab - Using your existing component */}
        <TabsContent value="hourly">
          <TutorHourlyRate tutorProfile={tutorProfiles} />
        </TabsContent>

        {/* Education Tab - Using your existing component */}
        <TabsContent value="education">
          <TutorEducation tutorProfile={tutorProfiles} isLocked={false} />
        </TabsContent>

        {/* Subjects Tab - Using your existing component */}
        <TabsContent value="subjects">
          <TutorSubject tutorProfile={tutorProfiles} isLocked={false} />
        </TabsContent>

        {/* Availability Tab - Using your existing component */}
        <TabsContent value="availability">
          <TutorAvailability tutorProfile={tutorProfiles} isLocked={false} />
        </TabsContent>

        {/* Time Slots Tab - Using your existing component */}
        <TabsContent value="timeslots">
          <TutorTimeSlot tutorProfile={tutorProfiles} isLocked={false} />
        </TabsContent>
      </Tabs>

      {/* Bookings and Reviews Tabs (Keep these separate) */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <TutorBookings bookings={tutorProfiles.bookings || []} />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Student Reviews
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {avgRating} ★ ({tutorProfiles.reviews?.length || 0} reviews)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tutorProfiles.reviews?.map(
                (review: ReviewItem, index: number) => (
                  <div key={review.id}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Student</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= Math.round(parseFloat(review.rating))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                    {index < tutorProfiles.reviews.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ),
              )}
              {tutorProfiles.reviews?.length === 0 && (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Time Slots Section - Keep this for quick view */}
      {tutorProfiles.tutorTimeSlots?.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {tutorProfiles.tutorTimeSlots
                .filter((slot: TimeSlotItem) => !slot.isBooked)
                .slice(0, 5)
                .map((slot: TimeSlotItem) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="font-medium">{formatDate(slot.date)}</span>
                    <span className="text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success"
                    >
                      Available
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
