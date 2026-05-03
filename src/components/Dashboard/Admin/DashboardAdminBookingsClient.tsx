// src/components/Dashboard/Admin/DashboardAdminBookingsClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Search,
  RefreshCw,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  Eye,
  GraduationCap,
  Award,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminBookingsClientProps {
  initialBookings: any[];
}

// Status configuration
const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: PendingIcon,
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  CONFIRM: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-green-600 bg-green-500/10 border-green-500/20",
    badge: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-500/10 border-red-500/20",
    badge: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  COMPLETE: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
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

// Helper to format time
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper to format full datetime
const formatFullDateTime = (dateString: string, timeString?: string) => {
  const date = new Date(dateString);
  if (timeString) {
    const [hours, minutes] = timeString.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));
  }
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function DashboardAdminBookingsClient({
  initialBookings,
}: AdminBookingsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter bookings
  const filteredBookings = initialBookings.filter((booking: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTutor = booking.tutorProfile?.user?.name
        ?.toLowerCase()
        .includes(query);
      const matchesStudent = booking.student?.name
        ?.toLowerCase()
        .includes(query);
      const matchesId = booking.id?.toLowerCase().includes(query);
      if (!matchesTutor && !matchesStudent && !matchesId) return false;
    }

    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Calculate stats
  const stats = {
    total: initialBookings.length,
    pending: initialBookings.filter((b: any) => b.status === "PENDING").length,
    confirmed: initialBookings.filter((b: any) => b.status === "CONFIRM")
      .length,
    completed: initialBookings.filter((b: any) => b.status === "COMPLETE")
      .length,
    cancelled: initialBookings.filter((b: any) => b.status === "CANCELLED")
      .length,
    revenue: initialBookings
      .filter((b: any) => b.status === "COMPLETE")
      .reduce((acc, b: any) => acc + parseFloat(b.booking_price || 0), 0)
      .toFixed(2),
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      router.refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const openDetailsDialog = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  // Desktop Pagination Component
  const DesktopPagination = () => {
    if (totalItems === 0) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
          {totalItems} bookings
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1)
                  return true;
                return false;
              })
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <div
                      key={`ellipsis-${page}`}
                      className="flex items-center gap-1"
                    >
                      <span className="text-muted-foreground px-1">...</span>
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Mobile Pagination Component
  const MobilePagination = () => {
    if (totalItems === 0) return null;

    return (
      <div className="flex flex-col gap-3 p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
          </span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-3">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Mobile Card View Component
  const MobileBookingCard = ({ booking }: { booking: any }) => {
    const status = statusConfig[booking.status as keyof typeof statusConfig];
    const StatusIcon = status?.icon;

    return (
      <Card className="border-border/50 mb-3 hover:shadow-md transition-all">
        <CardContent className="p-4">
          {/* Header with Status and Actions */}
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className={cn("text-xs", status?.badge)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status?.label}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openDetailsDialog(booking)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Student and Tutor Info */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10">
                  {booking.student?.name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {booking.student?.name || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {booking.student?.email || "No email"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10">
                  {booking.tutorProfile?.user?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {booking.tutorProfile?.user?.name || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {booking.tutorProfile?.user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
              <p className="text-sm font-medium">
                {booking.timeSlot?.date
                  ? formatDate(booking.timeSlot.date)
                  : "TBD"}
              </p>
              {booking.timeSlot?.startTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(booking.timeSlot.startTime)}
                </p>
              )}
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <p className="text-lg font-bold text-primary">
                ${parseFloat(booking.booking_price || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Booking ID</p>
            <p className="text-xs font-mono truncate">{booking.id}</p>
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
                  Bookings Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage all bookings across the platform in one place.
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
                      "h-3 w-3 sm:h-4 sm:w-4 mr-2",
                      refreshing && "animate-spin",
                    )}
                  />
                  <span className="text-xs sm:text-sm">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">
                    {stats.total}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-yellow-500/20">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-yellow-600">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                    {stats.pending}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-green-500/20">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-green-600">Confirmed</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                    {stats.confirmed}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-blue-500/20">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-blue-600">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    {stats.completed}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-red-500/20">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-red-600">Cancelled</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                    {stats.cancelled}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-purple-500/20">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs text-purple-600">Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                    ${stats.revenue}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
              <CardContent className="p-3 sm:p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student, tutor, or ID..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 w-full text-sm h-10"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRM">Confirmed</SelectItem>
                    <SelectItem value="COMPLETE">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {totalItems}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {stats.total}
                </span>{" "}
                bookings
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden">
              {paginatedBookings.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {paginatedBookings.map((booking: any) => (
                      <MobileBookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                  <MobilePagination />
                </>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No bookings found</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card className="border-border/50">
                <CardHeader className="pb-2 px-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    All Bookings ({totalItems})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Student</TableHead>
                          <TableHead className="w-[200px]">Tutor</TableHead>
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[80px]">Price</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[80px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((booking: any) => {
                          const status =
                            statusConfig[
                              booking.status as keyof typeof statusConfig
                            ];
                          const StatusIcon = status?.icon;

                          return (
                            <TableRow
                              key={booking.id}
                              className="hover:bg-muted/30"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10">
                                      {booking.student?.name?.charAt(0) || "S"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {booking.student?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                      {booking.student?.email || "No email"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10">
                                      {booking.tutorProfile?.user?.name?.charAt(
                                        0,
                                      ) || "T"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {booking.tutorProfile?.user?.name ||
                                        "Unknown"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                      {booking.tutorProfile?.user?.email ||
                                        "No email"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    {booking.timeSlot?.date
                                      ? formatDate(booking.timeSlot.date)
                                      : "TBD"}
                                  </p>
                                  {booking.timeSlot?.startTime && (
                                    <p className="text-xs text-muted-foreground">
                                      {formatTime(booking.timeSlot.startTime)}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm font-bold text-primary">
                                  $
                                  {parseFloat(
                                    booking.booking_price || 0,
                                  ).toFixed(2)}
                                </p>
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
                              <TableCell className="text-right">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => openDetailsDialog(booking)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {paginatedBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No bookings found</p>
                    </div>
                  ) : (
                    <DesktopPagination />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comprehensive Details Dialog - Unchanged */}
            <Dialog
              open={isDetailsDialogOpen}
              onOpenChange={setIsDetailsDialogOpen}
            >
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                {selectedBooking && (
                  <>
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="text-xl sm:text-2xl">
                        Booking Details
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Complete information about this booking
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 sm:space-y-6 py-4">
                      {/* Header with Status and ID */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 w-fit",
                            statusConfig[
                              selectedBooking.status as keyof typeof statusConfig
                            ]?.badge,
                          )}
                        >
                          {
                            statusConfig[
                              selectedBooking.status as keyof typeof statusConfig
                            ]?.label
                          }
                        </Badge>
                        <p className="text-xs sm:text-sm font-mono bg-muted/30 px-2 sm:px-3 py-1 rounded truncate">
                          ID: {selectedBooking.id}
                        </p>
                      </div>

                      {/* Booking Summary Card */}
                      <Card className="border-border/50 bg-primary/5">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Booking Summary
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Total Price
                              </p>
                              <p className="text-2xl sm:text-3xl font-bold text-primary">
                                $
                                {parseFloat(
                                  selectedBooking.booking_price || 0,
                                ).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Subject
                              </p>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-xs px-2 sm:px-3 py-1"
                              >
                                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                {selectedBooking.tutorProfile?.subjects?.[0]
                                  ?.subject?.name || "N/A"}
                              </Badge>
                            </div>
                            <div className="sm:col-span-2 md:col-span-1">
                              <p className="text-xs text-muted-foreground">
                                Created
                              </p>
                              <p className="text-xs sm:text-sm">
                                {formatFullDateTime(selectedBooking.createdAt)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Session Details */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-2 px-4 sm:px-6">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Session Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Date
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                  {selectedBooking.timeSlot?.date
                                    ? new Date(
                                        selectedBooking.timeSlot.date,
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "Not scheduled"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Time
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                  {selectedBooking.timeSlot?.startTime &&
                                  selectedBooking.timeSlot?.endTime
                                    ? `${formatTime(selectedBooking.timeSlot.startTime)} - ${formatTime(selectedBooking.timeSlot.endTime)}`
                                    : "Not scheduled"}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Duration
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                  {selectedBooking.timeSlot?.startTime &&
                                  selectedBooking.timeSlot?.endTime
                                    ? (() => {
                                        const start =
                                          selectedBooking.timeSlot.startTime
                                            .split(":")
                                            .map(Number);
                                        const end =
                                          selectedBooking.timeSlot.endTime
                                            .split(":")
                                            .map(Number);
                                        const minutes =
                                          end[0] * 60 +
                                          end[1] -
                                          (start[0] * 60 + start[1]);
                                        const hours = Math.floor(minutes / 60);
                                        const mins = minutes % 60;
                                        return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
                                      })()
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Time Slot ID
                                </p>
                                <p className="text-xs font-mono truncate">
                                  {selectedBooking.timeSlot?.id || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Student & Tutor Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-border/50">
                          <CardHeader className="pb-2 px-4 sm:px-6">
                            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Student Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarFallback className="bg-primary/10">
                                  {selectedBooking.student?.name?.charAt(0) ||
                                    "S"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-base sm:text-lg truncate">
                                  {selectedBooking.student?.name || "Unknown"}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {selectedBooking.student?.email || "No email"}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Student ID
                                </p>
                                <p className="text-xs sm:text-sm font-mono truncate">
                                  {selectedBooking.student?.id}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Account Status
                                </p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    selectedBooking.student?.status ===
                                      "UNBANNED"
                                      ? "bg-green-500/10 text-green-600"
                                      : "bg-red-500/10 text-red-600",
                                  )}
                                >
                                  {selectedBooking.student?.status || "UNKNOWN"}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Joined
                                </p>
                                <p className="text-xs sm:text-sm">
                                  {formatDate(
                                    selectedBooking.student?.createdAt,
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-border/50">
                          <CardHeader className="pb-2 px-4 sm:px-6">
                            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              Tutor Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarFallback className="bg-primary/10">
                                  {selectedBooking.tutorProfile?.user?.name?.charAt(
                                    0,
                                  ) || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-base sm:text-lg truncate">
                                  {selectedBooking.tutorProfile?.user?.name ||
                                    "Unknown"}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {selectedBooking.tutorProfile?.user?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Tutor Profile ID
                                </p>
                                <p className="text-xs sm:text-sm font-mono truncate">
                                  {selectedBooking.tutorProfile?.id}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Hourly Rate
                                </p>
                                <p className="text-sm sm:text-base font-bold text-primary">
                                  $
                                  {selectedBooking.tutorProfile?.hourlyRate ||
                                    0}
                                  /hr
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Featured
                                </p>
                                {selectedBooking.tutorProfile?.isFeatured ? (
                                  <Badge className="bg-yellow-500/10 text-yellow-600 text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    Not Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Subjects & Education */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-2 px-4 sm:px-6">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Tutor's Subjects & Education
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <p className="text-xs sm:text-sm font-medium mb-2">
                                Subjects
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {selectedBooking.tutorProfile?.subjects
                                  ?.length > 0 ? (
                                  selectedBooking.tutorProfile.subjects.map(
                                    (s: any) => (
                                      <Badge
                                        key={s.id}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {s.subject?.name}
                                      </Badge>
                                    ),
                                  )
                                ) : (
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    No subjects listed
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium mb-2">
                                Education
                              </p>
                              {selectedBooking.tutorProfile?.education?.length >
                              0 ? (
                                <div className="space-y-2">
                                  {selectedBooking.tutorProfile.education.map(
                                    (edu: any) => (
                                      <div
                                        key={edu.id}
                                        className="text-xs sm:text-sm"
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
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  No education listed
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Timeline */}
                      <Card className="border-border/50">
                        <CardHeader className="pb-2 px-4 sm:px-6">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                Booking Created:
                              </span>
                              <span className="text-xs sm:text-sm font-medium">
                                {formatFullDateTime(selectedBooking.createdAt)}
                              </span>
                            </div>
                            {selectedBooking.confirmedAt && (
                              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  Confirmed:
                                </span>
                                <span className="text-xs sm:text-sm font-medium">
                                  {formatFullDateTime(
                                    selectedBooking.confirmedAt,
                                  )}
                                </span>
                              </div>
                            )}
                            {selectedBooking.completedAt && (
                              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  Completed:
                                </span>
                                <span className="text-xs sm:text-sm font-medium">
                                  {formatFullDateTime(
                                    selectedBooking.completedAt,
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
