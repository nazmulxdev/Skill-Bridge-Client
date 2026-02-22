"use client";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TutorBookings } from "./TutorBookings";

interface TutorProfileDetailsProps {
  userData: any;
}

export function TutorCompleteProfile({ userData }: TutorProfileDetailsProps) {
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
            (acc: number, r: any) => acc + parseFloat(r.rating),
            0,
          ) / tutorProfiles.reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={image || ""} />
              <AvatarFallback className="text-3xl bg-primary/10">
                {name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{name}</h1>
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
                  Active since {new Date(tutorProfiles.createdAt).getFullYear()}
                </Badge>
              </div>
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

      {/* Detailed Tabs */}
      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

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
              {tutorProfiles.subjects?.length > 0 ? (
                <div className="space-y-6">
                  {/* Group subjects by category */}
                  {Object.entries(
                    tutorProfiles.subjects.reduce((acc: any, item: any) => {
                      const categoryName =
                        item.subject?.category?.name || "Uncategorized";
                      if (!acc[categoryName]) {
                        acc[categoryName] = [];
                      }
                      acc[categoryName].push(item);
                      return acc;
                    }, {}),
                  ).map(([category, items]: [string, any[]]) => (
                    <div key={category} className="space-y-3">
                      {/* Category Header */}
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h3 className="font-semibold text-lg">{category}</h3>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-primary/10 text-primary"
                        >
                          {items.length}{" "}
                          {items.length === 1 ? "subject" : "subjects"}
                        </Badge>
                      </div>

                      {/* Subjects under this category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            className="p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {item.subject?.name}
                              </span>
                              {item.subject?.category?.description && (
                                <span
                                  className="text-xs text-muted-foreground truncate ml-2"
                                  title={item.subject.category.description}
                                >
                                  ℹ️
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No subjects added yet</p>
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
              {tutorProfiles.education?.map((edu: any, index: number) => (
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
                  {index < tutorProfiles.education.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
              {tutorProfiles.education?.length === 0 && (
                <p className="text-muted-foreground">No education added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Weekly Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {tutorProfiles.availabilities?.map((av: any) => (
                  <div
                    key={av.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="font-medium">{av.dayOfWeek}</span>
                    <span className="text-muted-foreground">
                      {av.startTime} - {av.endTime}
                    </span>
                  </div>
                ))}
                {tutorProfiles.availabilities?.length === 0 && (
                  <p className="text-muted-foreground">No availability set</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* bookings tab */}
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
              {tutorProfiles.reviews?.map((review: any, index: number) => (
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
              ))}
              {tutorProfiles.reviews?.length === 0 && (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Time Slots Section */}
      {tutorProfiles.tutorTimeSlots?.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {tutorProfiles.tutorTimeSlots
                .filter((slot: any) => !slot.isBooked)
                .slice(0, 5)
                .map((slot: any) => (
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
