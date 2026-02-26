"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Star,
  Calendar,
  MoreVertical,
  Loader2,
  RefreshCw,
  UserCog,
  Award,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { manageUserByAdmin, manageTutorByAdmin } from "@/actions/admin.action";
import { Status } from "@/types";

interface AdminUsersClientProps {
  initialUsers: any[];
}

// Status configuration
const statusConfig = {
  ["BANNED" as Status.BANNED]: {
    label: "Banned",
    icon: ShieldOff,
    color: "text-red-600 bg-red-500/10 border-red-500/20",
    badge: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  ["UNBANNED" as Status.UNBANNED]: {
    label: "Active",
    icon: Shield,
    color: "text-green-600 bg-green-500/10 border-green-500/20",
    badge: "bg-green-500/10 text-green-600 border-green-500/20",
  },
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

export function DashboardAdminUsersClient({
  initialUsers,
}: AdminUsersClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showUnfeatureDialog, setShowUnfeatureDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter users by search only
  const filteredUsers = initialUsers.filter((user: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id?.toLowerCase().includes(query)
    );
  });

  // Calculate stats from database data
  const stats = {
    total: initialUsers.length,
    students: initialUsers.filter((u: any) => u.role === "STUDENT").length,
    tutors: initialUsers.filter((u: any) => u.role === "TUTOR").length,
    admins: initialUsers.filter((u: any) => u.role === "ADMIN").length,
    banned: initialUsers.filter(
      (u: any) => u.status === ("BANNED" as Status.BANNED),
    ).length,
    active: initialUsers.filter(
      (u: any) => u.status === ("UNBANNED" as Status.UNBANNED),
    ).length,
    featured: initialUsers.filter(
      (u: any) => u.role === "TUTOR" && u.tutorProfiles?.isFeatured === true,
    ).length,
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const toastId = toast.loading(`Banning user ${selectedUser.name}...`);

    try {
      const { data, error } = await manageUserByAdmin({
        userId: selectedUser.id,
        status: "BANNED" as Status.BANNED,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success(`User ${selectedUser.name} has been banned`, {
        id: toastId,
      });
      setShowBanDialog(false);
      setSelectedUser(null);
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const toastId = toast.loading(`Unbanning user ${selectedUser.name}...`);

    try {
      const { data, error } = await manageUserByAdmin({
        userId: selectedUser.id,
        status: "UNBANNED" as Status.UNBANNED,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success(`User ${selectedUser.name} has been unbanned`, {
        id: toastId,
      });
      setShowUnbanDialog(false);
      setSelectedUser(null);
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
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

  // Mobile Card View Component
  const MobileUserCard = ({ user }: { user: any }) => {
    const status = statusConfig[user.status as Status];
    const StatusIcon = status?.icon;
    const isTutor = user.role === "TUTOR";
    const isFeatured = isTutor && user.tutorProfiles?.isFeatured;

    return (
      <Card className="border-border/50 mb-3">
        <CardContent className="p-4">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-primary/10">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{user.name}</h3>
                  {isFeatured && (
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px] px-1.5 py-0">
                      <Award className="h-2.5 w-2.5 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                {user.status === "UNBANNED" ? (
                  <DropdownMenuItem
                    className="text-destructive text-sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowBanDialog(true);
                    }}
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Ban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-green-600 text-sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUnbanDialog(true);
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Unban User
                  </DropdownMenuItem>
                )}
                {isTutor && user.tutorProfiles && (
                  <>
                    <DropdownMenuSeparator />
                    {isFeatured ? (
                      <DropdownMenuItem
                        className="text-yellow-600 text-sm"
                        onClick={() => {
                          setSelectedTutor(user);
                          setShowUnfeatureDialog(true);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                        Remove Featured
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-yellow-600 text-sm"
                        onClick={() => {
                          setSelectedTutor(user);
                          setShowFeatureDialog(true);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Mark Featured
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  user.role === "ADMIN" &&
                    "bg-purple-500/10 text-purple-600 border-purple-500/20",
                  user.role === "TUTOR" &&
                    "bg-green-500/10 text-green-600 border-green-500/20",
                  user.role === "STUDENT" &&
                    "bg-blue-500/10 text-blue-600 border-blue-500/20",
                )}
              >
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant="outline" className={cn("text-xs", status?.badge)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status?.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Joined</p>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="text-xs font-mono text-muted-foreground">
                {user.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
          {/* Header */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage users, ban/unban accounts, and feature tutors
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
          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            <Card className="border-border/50">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {stats.total}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-blue-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-blue-600">Students</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                  {stats.students}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-green-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-green-600">Tutors</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                  {stats.tutors}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-yellow-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-yellow-600">Featured</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                  {stats.featured}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-purple-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-purple-600">Admins</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                  {stats.admins}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-green-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-green-600">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                  {stats.active}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-red-500/20">
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-red-600">Banned</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                  {stats.banned}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full text-sm h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsive Display: Cards on Mobile, Table on Desktop */}
          <div className="lg:hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => (
                <MobileUserCard key={user.id} user={user} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card className="border-border/50">
              <CardHeader className="pb-2 px-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-primary" />
                  All Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => {
                      const status = statusConfig[user.status as Status];
                      const StatusIcon = status?.icon;
                      const isTutor = user.role === "TUTOR";
                      const isFeatured =
                        isTutor && user.tutorProfiles?.isFeatured;

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-primary/10">
                                  {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{user.name}</p>
                                  {isFeatured && (
                                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[10px] px-1.5 py-0">
                                      <Award className="h-2.5 w-2.5 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                user.role === "ADMIN" &&
                                  "bg-purple-500/10 text-purple-600 border-purple-500/20",
                                user.role === "TUTOR" &&
                                  "bg-green-500/10 text-green-600 border-green-500/20",
                                user.role === "STUDENT" &&
                                  "bg-blue-500/10 text-blue-600 border-blue-500/20",
                              )}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", status?.badge)}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(user.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.status === "UNBANNED" ? (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowBanDialog(true);
                                    }}
                                  >
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Ban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowUnbanDialog(true);
                                    }}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Unban User
                                  </DropdownMenuItem>
                                )}
                                {isTutor && user.tutorProfiles && (
                                  <>
                                    <DropdownMenuSeparator />
                                    {isFeatured ? (
                                      <DropdownMenuItem
                                        className="text-yellow-600"
                                        onClick={() => {
                                          setSelectedTutor(user);
                                          setShowUnfeatureDialog(true);
                                        }}
                                      >
                                        <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                                        Remove Featured
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        className="text-yellow-600"
                                        onClick={() => {
                                          setSelectedTutor(user);
                                          setShowFeatureDialog(true);
                                        }}
                                      >
                                        <Star className="h-4 w-4 mr-2" />
                                        Mark Featured
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Dialogs - Responsive */}
          <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
            <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Ban User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to ban {selectedUser?.name}? This user
                  will no longer be able to access the platform.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel disabled={actionLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBanUser}
                  disabled={actionLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Banning...
                    </>
                  ) : (
                    "Yes, Ban User"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
            <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Unban User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unban {selectedUser?.name}? This user
                  will regain access to the platform.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel disabled={actionLoading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnbanUser}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Unbanning...
                    </>
                  ) : (
                    "Yes, Unban User"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                  {selectedTutor?.name}? They will no longer appear prominently
                  in search results.
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
  );
}
