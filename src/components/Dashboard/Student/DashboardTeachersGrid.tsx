"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  DollarSign,
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  Award,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TutorsGridProps {
  tutors: any[];
}

export function DashboardTutorsGrid({ tutors }: TutorsGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!tutors || tutors.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Tutors Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No tutors match your current filters. Try adjusting your search
          criteria.
        </p>
      </div>
    );
  }

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getTotalReviews = (reviews: any[]) => {
    return reviews?.length || 0;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {tutors.map((tutor) => {
          const avgRating = getAverageRating(tutor.reviews);
          const totalReviews = getTotalReviews(tutor.reviews);
          const isHovered = hoveredId === tutor.id;

          return (
            <div
              key={tutor.id}
              onMouseEnter={() => setHoveredId(tutor.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group w-full"
            >
              <Card
                className={`
                h-full w-full border-border/50 bg-gradient-to-br from-card/50 to-background 
                hover:shadow-xl transition-all duration-300 overflow-hidden
                ${isHovered ? "scale-[1.02] border-primary/30" : ""}
              `}
              >
                <CardContent className="p-0">
                  {/* Header with Gradient Background */}
                  <div className="relative h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent w-full">
                    {/* Featured Badge */}
                    {tutor.isFeatured && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-white border-0 z-10">
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}

                    {/* Avatar  */}
                    <div className="absolute -bottom-12 left-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                          <AvatarImage src={tutor.user?.image || ""} />
                          <AvatarFallback className="bg-primary/10 text-2xl">
                            {tutor.user?.name?.charAt(0) || "T"}
                          </AvatarFallback>
                        </Avatar>
                        {tutor.user?.status === "ONLINE" && (
                          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-16 p-6 w-full">
                    {/* Name and Rating */}
                    <div className="flex items-start justify-between mb-3 w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors truncate">
                          {tutor.user?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-xs whitespace-nowrap"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />$
                            {tutor.hourlyRate}/hr
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {avgRating}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              ({totalReviews})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    {tutor.subjects && tutor.subjects.length > 0 && (
                      <div className="mb-4 w-full">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Subjects
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tutor.subjects.slice(0, 4).map((s: any) => (
                            <Badge
                              key={s.id}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 hover:bg-primary/10 transition-colors cursor-default"
                            >
                              {s.subject?.name}
                            </Badge>
                          ))}
                          {tutor.subjects.length > 4 && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10"
                                >
                                  +{tutor.subjects.length - 4}
                                </Badge>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">
                                    All Subjects
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {tutor.subjects.map((s: any) => (
                                      <Badge
                                        key={s.id}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {s.subject?.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {tutor.education && tutor.education.length > 0 && (
                      <div className="mb-4 w-full">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Education
                        </p>
                        <div className="space-y-2 w-full">
                          {tutor.education
                            .slice(0, 2)
                            .map((edu: any, idx: number) => (
                              <div key={edu.id} className="text-sm w-full">
                                <p className="font-medium truncate">
                                  {edu.degree} in {edu.fieldOfStudy}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {edu.institute} • {edu.startYear} -{" "}
                                  {edu.isCurrent ? "Present" : edu.endYear}
                                </p>
                              </div>
                            ))}

                          {tutor.education.length > 2 && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                >
                                  View all {tutor.education.length}{" "}
                                  qualifications
                                  <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-3">
                                  <p className="text-sm font-medium">
                                    All Education
                                  </p>
                                  {tutor.education.map((edu: any) => (
                                    <div
                                      key={edu.id}
                                      className="text-sm border-l-2 border-primary/20 pl-3"
                                    >
                                      <p className="font-medium">
                                        {edu.degree} in {edu.fieldOfStudy}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {edu.institute} • {edu.startYear} -{" "}
                                        {edu.isCurrent
                                          ? "Present"
                                          : edu.endYear}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Availability Preview */}
                    {tutor.availabilities &&
                      tutor.availabilities.length > 0 && (
                        <div className="mb-4 w-full">
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Available
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tutor.availabilities.slice(0, 3).map((av: any) => (
                              <Badge
                                key={av.id}
                                variant="outline"
                                className="text-xs bg-green-500/5 text-green-600 border-green-500/20"
                              >
                                {av.dayOfWeek.slice(0, 3)}
                              </Badge>
                            ))}
                            {tutor.availabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{tutor.availabilities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                    {/* View Profile Button */}
                    <div className="mt-6 pt-4 border-t border-border/50 w-full">
                      <Button className="w-full gap-2 group" asChild>
                        <Link
                          href={`/dashboard/student/tutors/${tutor.userId}`}
                        >
                          View Profile
                          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
