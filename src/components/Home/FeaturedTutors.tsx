// components/Home/FeaturedTutors.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFeaturedTutor } from "@/actions/public.action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  GraduationCap,
  Award,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Education {
  id: string;
  institute: string;
  degree: string;
  fieldOfStudy: string;
  isCurrent: boolean;
}

interface Subject {
  id: string;
  subject: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface Tutor {
  id: string;
  userId: string;
  hourlyRate: string;
  isFeatured: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  education: Education[];
  subjects: Subject[];
}

interface FeaturedTutorsProps {
  initialData?: Tutor[];
}

export function FeaturedTutors({ initialData }: FeaturedTutorsProps) {
  const [tutors, setTutors] = useState<Tutor[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (initialData) {
      setTutors(initialData);
      setLoading(false);
      return;
    }

    const fetchFeaturedTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await publicFeaturedTutor();
        if (result.error) {
          setError(
            typeof result.error === "string"
              ? result.error
              : "Failed to load featured tutors",
          );
        } else {
          setTutors(result.data || []);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTutors();
  }, [initialData, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get highest education
  const getHighestEducation = (education: Education[]) => {
    if (!education || education.length === 0) return null;
    return education[0];
  };

  // Get first 2 subjects
  const getSubjectNames = (subjects: Subject[]) => {
    if (!subjects || subjects.length === 0) return [];
    return subjects.slice(0, 2).map((s) => s.subject.name);
  };

  // Calculate grid columns based on number of tutors
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-md mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
    if (count === 3)
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section className="w-full py-12 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Featured Tutors
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Learn from{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Expert Educators
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Hand-picked top-rated tutors ready to help you master any subject
          </p>
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-border/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Skeleton className="h-20 w-20 rounded-full mb-4" />
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-3" />
                      <div className="flex gap-1 justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Skeleton
                            key={s}
                            className="h-3.5 w-3.5 rounded-full"
                          />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-4 w-36 mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-9 w-28 rounded-md mt-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="max-w-md mx-auto">
              <Card className="border-destructive/20">
                <CardContent className="p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                    <AlertCircle className="h-12 w-12 text-destructive/60 relative" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Unable to Load Tutors
                  </h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && tutors.length === 0 && (
            <div className="max-w-md mx-auto">
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    <div className="relative bg-gradient-to-b from-primary/10 to-transparent p-4 rounded-full">
                      <Award className="h-12 w-12 text-primary/60" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    We're hand-picking exceptional tutors to feature. Check back
                    soon!
                  </p>
                  <Link href="/tutors">
                    <Button variant="outline" size="lg">
                      Browse All Tutors
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success State with Tutors */}
          {!loading && !error && tutors.length > 0 && (
            <>
              <div className={cn("grid gap-6", getGridClass(tutors.length))}>
                {tutors.map((tutor) => {
                  const highestEdu = getHighestEducation(tutor.education);
                  const subjectNames = getSubjectNames(tutor.subjects);
                  const initials = getInitials(tutor.user.name);

                  return (
                    <Card
                      key={tutor.id}
                      className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-600 border-yellow-500/20 backdrop-blur-sm">
                          <Award className="h-3 w-3 mr-1 fill-yellow-500" />
                          Featured
                        </Badge>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          {/* Avatar */}
                          <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 blur-xl group-hover:blur-2xl transition-all" />
                            <Avatar className="h-20 w-20 border-2 border-primary/10 group-hover:border-primary/30 transition-colors relative">
                              {tutor.user.image ? (
                                <AvatarImage
                                  src={tutor.user.image}
                                  alt={tutor.user.name}
                                />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg">
                                  {initials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>

                          {/* Name & Title */}
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {tutor.user.name}
                          </h3>

                          {/* Education */}
                          {highestEdu && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              <span className="font-medium text-foreground">
                                {highestEdu.degree}
                              </span>{" "}
                              in {highestEdu.fieldOfStudy}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              5.0
                            </span>
                          </div>

                          {/* Institute */}
                          {highestEdu && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                              <GraduationCap className="h-3.5 w-3.5" />
                              <span className="line-clamp-1">
                                {highestEdu.institute}
                              </span>
                            </div>
                          )}

                          {/* Subjects */}
                          {subjectNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                              {subjectNames.map((subject, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-primary/5 text-xs font-normal px-2 py-0.5"
                                >
                                  {subject}
                                </Badge>
                              ))}
                              {tutor.subjects.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/5 text-xs font-normal px-2 py-0.5"
                                >
                                  +{tutor.subjects.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Hourly Rate */}
                          <div className="mb-4">
                            <p className="text-2xl font-bold text-primary">
                              ${tutor.hourlyRate}
                              <span className="text-xs text-muted-foreground font-normal ml-1">
                                /hr
                              </span>
                            </p>
                          </div>

                          {/* View Profile Button */}
                          <Link href={`/tutors/${tutor.id}`} className="w-full">
                            <Button
                              size="sm"
                              className="w-full group/btn relative overflow-hidden"
                              variant="outline"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-1">
                                View Profile
                                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* View All Tutors Button */}
              <div className="flex justify-center mt-12 md:mt-16">
                <Link href="/tutors">
                  <Button size="lg" className="group gap-2 px-8">
                    <span>Browse All Tutors</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
