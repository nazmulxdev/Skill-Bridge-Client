"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  DollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  Mail,
  Award,
  Briefcase,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { bookingTimeSlot } from "@/actions/atudent.action";

interface TutorProfileClientProps {
  tutor: any;
  studentProfile: any;
}

// Helper to calculate slot price based on duration
const calculateSlotPrice = (slot: any, hourlyRate: number) => {
  const start = slot.startTime.split(":").map(Number);
  const end = slot.endTime.split(":").map(Number);

  // Calculate duration in minutes
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  const durationMinutes = endMinutes - startMinutes;

  // Calculate price (hourly rate * hours)
  const durationHours = durationMinutes / 60;
  const price = durationHours * hourlyRate;

  // Format duration for display
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

  return { price, durationText, durationMinutes };
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to format time
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper to format error message
const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "object" && error !== null) {
    if (error.message) return error.message;
    if (error.error?.message) return error.error.message;
    return "Operation failed. Please try again.";
  }
  if (typeof error === "string") {
    if (error.includes("[object Object]")) {
      return "Operation failed. Please try again.";
    }
    return error;
  }
  return "Something went wrong. Please try again.";
};

export function DashboardTutorCompleteProfile({
  tutor,
  studentProfile,
}: TutorProfileClientProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotData, setSelectedSlotData] = useState<any | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isLoggedIn = !!studentProfile;
  const isStudent = studentProfile?.role === "STUDENT";

  // Calculate average rating
  const avgRating =
    tutor.reviews?.length > 0
      ? (
          tutor.reviews.reduce(
            (acc: number, r: any) => acc + parseFloat(r.rating),
            0,
          ) / tutor.reviews.length
        ).toFixed(1)
      : "0.0";

  // Group subjects by category
  const groupedSubjects = tutor.subjects?.reduce((acc: any, item: any) => {
    const categoryName = item.subject?.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  // Group time slots by date
  const availableSlots = tutor.tutorTimeSlots
    ?.filter((slot: any) => !slot.isBooked && new Date(slot.date) >= new Date())
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  const groupedSlots = availableSlots?.reduce((acc: any, slot: any) => {
    const dateKey = slot.date.split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot.id);
    setSelectedSlotData(slot);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);

    const toastId = toast.loading("Booking your session...");

    try {
      const { data, error } = await bookingTimeSlot({
        timeSlotId: selectedSlot,
        subjectId: selectedSubject,
      });

      if (error || !data) {
        throw new Error(getErrorMessage(error));
      }

      toast.success("Session booked successfully!", { id: toastId });
      setBookingSuccess(true);
      setSelectedSlot(null);
      setSelectedSlotData(null);
      setSelectedSubject("");

      // Refresh to show updated data
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setBookingError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  // Calculate price for selected slot
  const selectedSlotPrice = selectedSlotData
    ? calculateSlotPrice(selectedSlotData, tutor.hourlyRate)
    : null;

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/dashboard/student/tutors"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Tutors
            </Link>
          </div>

          {/* Login Prompt for Non-Logged In Users */}
          {!isLoggedIn && (
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                Please{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  login
                </Link>{" "}
                as a student to book sessions with tutors.
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Header */}
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={tutor.user?.image || ""} />
                  <AvatarFallback className="text-3xl bg-primary/10">
                    {tutor.user?.name?.charAt(0) || "T"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold">{tutor.user?.name}</h1>
                    {tutor.isFeatured && (
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <Award className="h-3 w-3 mr-1" /> Featured Tutor
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{tutor.user?.email}</span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />${tutor.hourlyRate}
                      /hour
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/20"
                    >
                      <Star className="h-3 w-3 mr-1 fill-success" />
                      {avgRating} ({tutor.reviews?.length || 0} reviews)
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      Active since {new Date(tutor.createdAt).getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                  <p className="text-xl font-bold">
                    {tutor.subjects?.length || 0}
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
                    {tutor.education?.length || 0}
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
                  <p className="text-xs text-muted-foreground">
                    Weekly Availability
                  </p>
                  <p className="text-xl font-bold">
                    {tutor.availabilities?.length || 0} days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Available Slots
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {availableSlots?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Student Reviews
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      {avgRating} ★ ({tutor.reviews?.length || 0} reviews)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutor.reviews?.length > 0 ? (
                    tutor.reviews.map((review: any, index: number) => (
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
                                      "h-4 w-4",
                                      star <=
                                        Math.round(parseFloat(review.rating))
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
                        {index < tutor.reviews.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        Be the first to book a session and leave a review!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Subjects by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {groupedSubjects &&
                  Object.keys(groupedSubjects).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedSubjects).map(
                        ([category, items]: [string, any]) => (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-1 bg-primary rounded-full" />
                              <h3 className="font-semibold text-lg">
                                {category}
                              </h3>
                              <Badge
                                variant="outline"
                                className="ml-2 bg-primary/10 text-primary"
                              >
                                {items.length}{" "}
                                {items.length === 1 ? "subject" : "subjects"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-4">
                              {items.map((item: any) => (
                                <Badge
                                  key={item.id}
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
                                  {item.subject?.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No subjects added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Educational Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutor.education?.length > 0 ? (
                    tutor.education.map((edu: any, index: number) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {edu.degree} in {edu.fieldOfStudy}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {edu.institute}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.startYear} -{" "}
                              {edu.isCurrent ? "Present" : edu.endYear}
                            </p>
                          </div>
                        </div>
                        {index < tutor.education.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No education added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Booking Section - Separate and Prominent */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarDays className="h-6 w-6 text-primary" />
                Book a Session with {tutor.user?.name?.split(" ")[0]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {bookingSuccess && (
                <Alert className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Session booked successfully! Check your dashboard for
                    details.
                  </AlertDescription>
                </Alert>
              )}

              {bookingError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{bookingError}</AlertDescription>
                </Alert>
              )}

              {availableSlots?.length > 0 ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Hourly Rate
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${tutor.hourlyRate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Available Slots
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {availableSlots.length}
                      </p>
                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      1. Choose a Subject
                    </Label>
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select the subject you want to learn" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutor.subjects?.map((item: any) => (
                          <SelectItem key={item.id} value={item.subjectId}>
                            {item.subject?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      2. Select a Date & Time
                    </Label>
                    {Object.entries(groupedSlots || {}).map(
                      ([date, slots]: [string, any]) => (
                        <div key={date} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{formatDate(date)}</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {slots.map((slot: any) => {
                              const isSelected = selectedSlot === slot.id;
                              const slotPrice = calculateSlotPrice(
                                slot,
                                tutor.hourlyRate,
                              );

                              return (
                                <Button
                                  key={slot.id}
                                  variant={isSelected ? "default" : "outline"}
                                  className={cn(
                                    "h-auto py-3 px-4 flex-col items-start gap-1",
                                    isSelected &&
                                      "bg-primary text-primary-foreground ring-2 ring-primary/20",
                                    !isLoggedIn || !isStudent
                                      ? "opacity-50 cursor-not-allowed"
                                      : "",
                                  )}
                                  onClick={() => handleSlotSelect(slot)}
                                  disabled={!isLoggedIn || !isStudent}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <Clock3 className="h-4 w-4" />
                                    <span className="font-medium">
                                      {formatTime(slot.startTime)} -{" "}
                                      {formatTime(slot.endTime)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between w-full text-xs opacity-80">
                                    <span>
                                      Duration: {slotPrice.durationText}
                                    </span>
                                    <span className="font-semibold">
                                      ${slotPrice.price.toFixed(2)}
                                    </span>
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Price Summary */}
                  {selectedSlot && selectedSubject && selectedSlotPrice && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-primary/20">
                      <h4 className="font-semibold mb-3">Booking Summary</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Hourly Rate:
                          </span>
                          <span className="font-medium">
                            ${tutor.hourlyRate}/hour
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span className="font-medium">
                            {selectedSlotPrice.durationText}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold">Total to pay:</span>
                          <span className="font-bold text-primary text-lg">
                            ${selectedSlotPrice.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <div className="pt-4">
                    {!isLoggedIn ? (
                      <Button asChild className="w-full h-12 text-base">
                        <Link href="/login">
                          Only Student can Book(Login as Student)
                        </Link>
                      </Button>
                    ) : !isStudent ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You need a student account to book sessions.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Button
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                        onClick={handleBooking}
                        disabled={
                          bookingLoading || !selectedSlot || !selectedSubject
                        }
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processing Your Booking...
                          </>
                        ) : (
                          `Confirm Booking - $${selectedSlotPrice?.price.toFixed(2) || tutor.hourlyRate}`
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Available Slots
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {tutor.user?.name?.split(" ")[0]} doesn't have any available
                    time slots at the moment. Check back later or browse other
                    tutors.
                  </p>
                  <Button asChild className="mt-6" variant="outline">
                    <Link href="/dashboard/student/tutors">
                      Browse Other Tutors
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Availability Preview */}
          {tutor.availabilities?.length > 0 && (
            <Card className="border-border/50 bg-card/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Weekly Schedule (Recurring Availability)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {tutor.availabilities.map((av: any) => (
                    <div
                      key={av.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <span className="font-medium">{av.dayOfWeek}</span>
                      <span className="text-muted-foreground">
                        {formatTime(av.startTime)} - {formatTime(av.endTime)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
