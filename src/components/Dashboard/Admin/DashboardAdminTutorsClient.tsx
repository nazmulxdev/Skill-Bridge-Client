"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  Search,
  Star,
  Calendar,
  MoreVertical,
  Loader2,
  RefreshCw,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  GraduationCap,
  Shield,
  AlertCircle,
  HelpCircle,
  BanknoteX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { manageTutorByAdmin } from "@/actions/admin.action";

interface AdminTutorsClientProps {
  initialTutors: any[];
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper to calculate average rating
const getAverageRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce(
    (acc: number, r: any) => acc + parseFloat(r.rating),
    0,
  );
  return (sum / reviews.length).toFixed(1);
};

// Helper to check if tutor profile is complete
const isProfileComplete = (tutor: any) => {
  const profile = tutor.tutorProfiles;
  if (!profile) return false;

  return (
    profile.hourlyRate != null &&
    profile.education?.length > 0 &&
    profile.subjects?.length > 0 &&
    profile.availabilities?.length > 0
  );
};

// Helper to get profile completion percentage
const getProfileCompletion = (tutor: any) => {
  const profile = tutor.tutorProfiles;
  if (!profile) return 0;

  let completed = 0;
  const total = 4;

  if (profile.hourlyRate != null) completed++;
  if (profile.education?.length > 0) completed++;
  if (profile.subjects?.length > 0) completed++;
  if (profile.availabilities?.length > 0) completed++;

  return Math.round((completed / total) * 100);
};

// Helper to get error message
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

export function DashboardAdminTutorsClient({
  initialTutors,
}: AdminTutorsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showUnfeatureDialog, setShowUnfeatureDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and sort tutors
  const filteredTutors = initialTutors
    .filter((tutor: any) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          tutor.name?.toLowerCase().includes(query) ||
          tutor.email?.toLowerCase().includes(query) ||
          tutor.id?.toLowerCase().includes(query) ||
          tutor.tutorProfiles?.subjects?.some((s: any) =>
            s.subject?.name?.toLowerCase().includes(query),
          );
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== "all" && tutor.status !== statusFilter) {
        return false;
      }

      // Featured filter
      if (featuredFilter === "featured" && !tutor.tutorProfiles?.isFeatured) {
        return false;
      }
      if (
        featuredFilter === "not-featured" &&
        tutor.tutorProfiles?.isFeatured
      ) {
        return false;
      }

      // Profile completion filter
      const complete = isProfileComplete(tutor);
      if (profileFilter === "complete" && !complete) return false;
      if (profileFilter === "incomplete" && complete) return false;
      if (profileFilter === "no-profile" && tutor.tutorProfiles) return false;

      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "rating-high") {
        const aRating = getAverageRating(a.tutorProfiles?.reviews || []);
        const bRating = getAverageRating(b.tutorProfiles?.reviews || []);
        return parseFloat(bRating as string) - parseFloat(aRating as string);
      }
      if (sortBy === "rating-low") {
        const aRating = getAverageRating(a.tutorProfiles?.reviews || []);
        const bRating = getAverageRating(b.tutorProfiles?.reviews || []);
        return parseFloat(aRating as string) - parseFloat(bRating as string);
      }
      if (sortBy === "price-high") {
        return (
          (b.tutorProfiles?.hourlyRate || 0) -
          (a.tutorProfiles?.hourlyRate || 0)
        );
      }
      if (sortBy === "price-low") {
        return (
          (a.tutorProfiles?.hourlyRate || 0) -
          (b.tutorProfiles?.hourlyRate || 0)
        );
      }
      if (sortBy === "completion-high") {
        return getProfileCompletion(b) - getProfileCompletion(a);
      }
      if (sortBy === "completion-low") {
        return getProfileCompletion(a) - getProfileCompletion(b);
      }
      return 0;
    });

  // Calculate stats
  const stats = {
    total: initialTutors.length,
    featured: initialTutors.filter((t: any) => t.tutorProfiles?.isFeatured)
      .length,
    active: initialTutors.filter((t: any) => t.status === "UNBANNED").length,
    banned: initialTutors.filter((t: any) => t.status === "BANNED").length,
    withReviews: initialTutors.filter(
      (t: any) => t.tutorProfiles?.reviews?.length > 0,
    ).length,
    complete: initialTutors.filter((t: any) => isProfileComplete(t)).length,
    incomplete: initialTutors.filter(
      (t: any) => !isProfileComplete(t) && t.tutorProfiles,
    ).length,
    noProfile: initialTutors.filter((t: any) => !t.tutorProfiles).length,
  };

  const handleFeatureTutor = async () => {
    if (!selectedTutor) return;

    setActionLoading(true);
    const toastId = toast.loading(`Featuring tutor ${selectedTutor.name}...`);

    try {
      const { data, error } = await manageTutorByAdmin({
        tutorId: selectedTutor.tutorProfiles.id,
        isFeatured: true,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success(`${selectedTutor.name} is now a featured tutor!`, {
        id: toastId,
      });
      setShowFeatureDialog(false);
      setSelectedTutor(null);
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfeatureTutor = async () => {
    if (!selectedTutor) return;

    setActionLoading(true);
    const toastId = toast.loading(
      `Removing featured status from ${selectedTutor.name}...`,
    );

    try {
      const { data, error } = await manageTutorByAdmin({
        tutorId: selectedTutor.tutorProfiles.id,
        isFeatured: false,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success(`Featured status removed from ${selectedTutor.name}`, {
        id: toastId,
      });
      setShowUnfeatureDialog(false);
      setSelectedTutor(null);
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      router.refresh();
    } finally {
      setRefreshing(false);
    }
  };

  // Mobile Card View
  const MobileTutorCard = ({ tutor }: { tutor: any }) => {
    const avgRating = getAverageRating(tutor.tutorProfiles?.reviews || []);
    const isFeatured = tutor.tutorProfiles?.isFeatured;
    const subjects = tutor.tutorProfiles?.subjects?.slice(0, 3) || [];
    const profileComplete = isProfileComplete(tutor);
    const completionPercentage = getProfileCompletion(tutor);
    const hasProfile = !!tutor.tutorProfiles;

    return (
      <Card className="border-border/50 mb-3 hover:shadow-md transition-all">
        <CardContent className="p-4">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                <AvatarImage src={tutor.image || ""} />
                <AvatarFallback className="bg-primary/10">
                  {tutor.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{tutor.name}</h3>
                  {isFeatured && (
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {tutor.status === "BANNED" && (
                    <Badge variant="destructive" className="text-[10px]">
                      Banned
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{tutor.email}</p>
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-sm">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasProfile && isFeatured ? (
                  <DropdownMenuItem
                    className="text-yellow-600 text-sm"
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setShowUnfeatureDialog(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                    Remove Featured
                  </DropdownMenuItem>
                ) : hasProfile ? (
                  <DropdownMenuItem
                    className="text-yellow-600 text-sm"
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setShowFeatureDialog(true);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Mark Featured
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled>
                    <BanknoteX className="h-4 w-4 mr-2" />
                    Incomplete Profile
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile Status */}
          {!hasProfile ? (
            <div className="mb-3 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-600">
                  No Profile Created
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This tutor hasn't created their profile yet.
              </p>
            </div>
          ) : !profileComplete ? (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium">
                    Profile Completion
                  </span>
                </div>
                <span className="text-xs font-medium">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-1.5" />
              <div className="flex flex-wrap gap-1 mt-2">
                {!tutor.tutorProfiles?.hourlyRate && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-500/5"
                  >
                    No rate
                  </Badge>
                )}
                {!tutor.tutorProfiles?.education?.length && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-500/5"
                  >
                    No education
                  </Badge>
                )}
                {!tutor.tutorProfiles?.subjects?.length && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-500/5"
                  >
                    No subjects
                  </Badge>
                )}
                {!tutor.tutorProfiles?.availabilities?.length && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-500/5"
                  >
                    No availability
                  </Badge>
                )}
              </div>
            </div>
          ) : null}

          {/* Stats Grid - Only show if profile exists */}
          {hasProfile && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-muted/30 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Hourly Rate
                </p>
                <p className="text-sm font-bold text-primary">
                  ${tutor.tutorProfiles?.hourlyRate || 0}/hr
                </p>
              </div>
              <div className="bg-muted/30 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({tutor.tutorProfiles?.reviews?.length || 0})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Subjects */}
          {hasProfile && subjects.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Subjects
              </p>
              <div className="flex flex-wrap gap-1">
                {subjects.map((s: any) => (
                  <Badge key={s.id} variant="secondary" className="text-xs">
                    {s.subject?.name}
                  </Badge>
                ))}
                {tutor.tutorProfiles?.subjects?.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{tutor.tutorProfiles.subjects.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Education Preview */}
          {hasProfile && tutor.tutorProfiles?.education?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Education
              </p>
              <p className="text-xs">
                {tutor.tutorProfiles.education[0].degree} at{" "}
                {tutor.tutorProfiles.education[0].institute}
              </p>
            </div>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Joined {formatDate(tutor.createdAt)}</span>
            </div>
            {hasProfile && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {tutor.tutorProfiles?.tutorTimeSlots?.length || 0} slots
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen bg-background">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Tutor Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage all tutors, feature/unfeature profiles, and monitor
                  performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="h-9 sm:h-10"
                >
                  <RefreshCw
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2",
                      refreshing && "animate-spin",
                    )}
                  />
                  <span className="text-xs sm:text-sm">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards*/}
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
              <Card className="border-border/50">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    {stats.total}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-yellow-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-yellow-600">Featured</p>
                  <p className="text-lg sm:text-xl font-bold text-yellow-600 mt-1">
                    {stats.featured}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-green-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-green-600">Active</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600 mt-1">
                    {stats.active}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-red-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-red-600">Banned</p>
                  <p className="text-lg sm:text-xl font-bold text-red-600 mt-1">
                    {stats.banned}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-blue-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-blue-600">Reviews</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1">
                    {stats.withReviews}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-emerald-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-emerald-600">Complete</p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">
                    {stats.complete}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-orange-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-orange-600">Incomplete</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-600 mt-1">
                    {stats.incomplete}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-amber-500/20">
                <CardContent className="p-2 sm:p-3">
                  <p className="text-xs text-amber-600">No Profile</p>
                  <p className="text-lg sm:text-xl font-bold text-amber-600 mt-1">
                    {stats.noProfile}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters Section - Added profile filter */}
            <Card className="border-border/50">
              <CardContent className="p-3 sm:p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tutors by name, email, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full text-sm h-10"
                  />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="UNBANNED">Active</SelectItem>
                      <SelectItem value="BANNED">Banned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={featuredFilter}
                    onValueChange={setFeaturedFilter}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tutors</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={profileFilter}
                    onValueChange={setProfileFilter}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Profiles</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="no-profile">No Profile</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 text-xs sm:text-sm col-span-2 sm:col-span-2">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="rating-high">
                        Highest Rating
                      </SelectItem>
                      <SelectItem value="rating-low">Lowest Rating</SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="completion-high">
                        Most Complete
                      </SelectItem>
                      <SelectItem value="completion-low">
                        Least Complete
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredTutors.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {stats.total}
                </span>{" "}
                tutors
              </p>
              {(searchQuery ||
                statusFilter !== "all" ||
                featuredFilter !== "all" ||
                profileFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setFeaturedFilter("all");
                    setProfileFilter("all");
                    setSortBy("newest");
                  }}
                  className="h-8 text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden">
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor: any) => (
                  <MobileTutorCard key={tutor.id} tutor={tutor} />
                ))
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No tutors found</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Desktop Table View - Added Profile Status Column */}
            <div className="hidden lg:block">
              <Card className="border-border/50">
                <CardHeader className="pb-2 px-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    All Tutors ({filteredTutors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">
                            Tutor
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Rate
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Rating
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Profile
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Status
                          </th>
                          <th className="text-left p-3 text-sm font-medium">
                            Featured
                          </th>
                          <th className="text-right p-3 text-sm font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredTutors.map((tutor: any) => {
                          const avgRating = getAverageRating(
                            tutor.tutorProfiles?.reviews || [],
                          );
                          const isFeatured = tutor.tutorProfiles?.isFeatured;
                          const hasProfile = !!tutor.tutorProfiles;
                          const profileComplete = isProfileComplete(tutor);
                          const completionPercentage =
                            getProfileCompletion(tutor);

                          return (
                            <tr
                              key={tutor.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={tutor.image || ""} />
                                    <AvatarFallback className="bg-primary/10">
                                      {tutor.name?.charAt(0) || "T"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {tutor.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {tutor.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                {hasProfile ? (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-medium">
                                      {tutor.tutorProfiles?.hourlyRate || 0}/hr
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                {hasProfile &&
                                tutor.tutorProfiles?.reviews?.length > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{avgRating}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({tutor.tutorProfiles?.reviews?.length})
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    No reviews
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                {!hasProfile ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  >
                                    No Profile
                                  </Badge>
                                ) : profileComplete ? (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge
                                        variant="outline"
                                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      >
                                        Complete
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Profile is 100% complete</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge
                                        variant="outline"
                                        className="bg-orange-500/10 text-orange-600 border-orange-500/20"
                                      >
                                        {completionPercentage}%
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs space-y-1">
                                        <p>Missing:</p>
                                        {!tutor.tutorProfiles?.hourlyRate && (
                                          <p>• Hourly rate</p>
                                        )}
                                        {!tutor.tutorProfiles?.education
                                          ?.length && <p>• Education</p>}
                                        {!tutor.tutorProfiles?.subjects
                                          ?.length && <p>• Subjects</p>}
                                        {!tutor.tutorProfiles?.availabilities
                                          ?.length && <p>• Availability</p>}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </td>
                              <td className="p-3">
                                {tutor.status === "UNBANNED" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-500/10 text-green-600"
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/10 text-red-600"
                                  >
                                    <Shield className="h-3 w-3 mr-1" />
                                    Banned
                                  </Badge>
                                )}
                              </td>
                              <td className="p-3">
                                {isFeatured ? (
                                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                    <Award className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-muted-foreground"
                                  >
                                    Not Featured
                                  </Badge>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {hasProfile && isFeatured ? (
                                      <DropdownMenuItem
                                        className="text-yellow-600"
                                        onClick={() => {
                                          setSelectedTutor(tutor);
                                          setShowUnfeatureDialog(true);
                                        }}
                                      >
                                        <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                                        Remove Featured
                                      </DropdownMenuItem>
                                    ) : hasProfile ? (
                                      <DropdownMenuItem
                                        className="text-yellow-600"
                                        onClick={() => {
                                          setSelectedTutor(tutor);
                                          setShowFeatureDialog(true);
                                        }}
                                      >
                                        <Star className="h-4 w-4 mr-2" />
                                        Mark Featured
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem disabled>
                                        <BanknoteX className="h-4 w-4 mr-2" />
                                        Incomplete Profile
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredTutors.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No tutors found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Dialogs */}
            <AlertDialog
              open={showFeatureDialog}
              onOpenChange={setShowFeatureDialog}
            >
              <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Feature Tutor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark {selectedTutor?.name} as a
                    featured tutor? Featured tutors appear prominently in search
                    results.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel disabled={actionLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleFeatureTutor}
                    disabled={actionLoading}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Featuring...
                      </>
                    ) : (
                      "Yes, Feature Tutor"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={showUnfeatureDialog}
              onOpenChange={setShowUnfeatureDialog}
            >
              <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Featured Status</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove featured status from{" "}
                    {selectedTutor?.name}? They will no longer appear
                    prominently in search results.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel disabled={actionLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleUnfeatureTutor}
                    disabled={actionLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      "Yes, Remove Featured"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
