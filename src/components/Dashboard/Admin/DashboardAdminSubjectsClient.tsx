// src/components/Dashboard/Admin/DashboardAdminSubjectsClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Calendar,
  MoreVertical,
  FolderTree,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { TooltipProvider } from "@/components/ui/tooltip";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addSubjectByAdmin,
  updateSubjectByAdmin,
  deleteSubjectByAdmin,
} from "@/actions/admin.action";

interface AdminSubjectsClientProps {
  initialSubjects: any[];
  initialCategories: any[];
}

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

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function DashboardAdminSubjectsClient({
  initialSubjects,
  initialCategories,
}: AdminSubjectsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newSubject, setNewSubject] = useState({ category_id: "", name: "" });
  const [editSubject, setEditSubject] = useState({ category_id: "", name: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSubjects = initialSubjects.filter((subject: any) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = subject.name?.toLowerCase().includes(query);

      const category = initialCategories.find(
        (c: any) => c.id === subject.category_id,
      );
      const matchesCategory = category?.name?.toLowerCase().includes(query);
      if (!matchesName && !matchesCategory) return false;
    }

    // Category filter
    if (categoryFilter !== "all" && subject.category_id !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Pagination calculations
  const totalItems = filteredSubjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
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
    total: initialSubjects.length,
    categories: initialCategories.length,
    avgPerCategory:
      initialCategories.length > 0
        ? (initialSubjects.length / initialCategories.length).toFixed(1)
        : "0",
  };

  const handleCreateSubject = async () => {
    if (!newSubject.category_id) {
      toast.error("Please select a category");
      return;
    }
    if (!newSubject.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading("Creating subject...");

    try {
      const { data, error } = await addSubjectByAdmin({
        categoryId: newSubject.category_id,
        name: newSubject.name,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Subject created successfully!", { id: toastId });
      setIsCreateDialogOpen(false);
      setNewSubject({ category_id: "", name: "" });
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject) return;
    if (!editSubject.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading("Updating subject...");

    try {
      const { data, error } = await updateSubjectByAdmin({
        subjectId: selectedSubject.id,
        name: editSubject.name,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Subject updated successfully!", { id: toastId });
      setIsEditDialogOpen(false);
      setSelectedSubject(null);
      setEditSubject({ category_id: "", name: "" });
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;

    setActionLoading(true);
    const toastId = toast.loading("Deleting subject...");

    try {
      const { data, error } = await deleteSubjectByAdmin(selectedSubject.id);

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Subject deleted successfully!", { id: toastId });
      setIsDeleteDialogOpen(false);
      setSelectedSubject(null);
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

  const openEditDialog = (subject: any) => {
    setSelectedSubject(subject);
    setEditSubject({
      category_id: subject.category_id,
      name: subject.name,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subject: any) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    const category = initialCategories.find((c: any) => c.id === categoryId);
    return category?.name || "Unknown Category";
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
          {totalItems} subjects
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

  // Mobile Card View
  const MobileSubjectCard = ({ subject }: { subject: any }) => {
    const categoryName = getCategoryName(subject.category_id);

    return (
      <Card className="border-border/50 mb-3 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {subject.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Category: {categoryName}
                </p>
              </div>
            </div>

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
                <DropdownMenuItem onClick={() => openEditDialog(subject)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => openDeleteDialog(subject)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-muted/30 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <Badge variant="outline" className="bg-primary/5">
                {categoryName}
              </Badge>
            </div>
            <div className="bg-muted/30 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-xs truncate">
                {formatDate(subject.createdAt)}
              </p>
            </div>
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
                  Subject Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create, edit, and manage subjects under categories in your
                  platform.
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
                <Button
                  size="sm"
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="h-9 sm:h-10"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="text-xs sm:text-sm">New Subject</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground truncate">
                        Total Subjects
                      </p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                      <FolderTree className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-green-600 truncate">
                        Categories
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.categories}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-blue-600 truncate">
                        Avg per Category
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.avgPerCategory}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
              <CardContent className="p-3 sm:p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subjects by name or category..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 w-full text-sm h-10"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {initialCategories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
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
                subjects
              </p>
              {(searchQuery || categoryFilter !== "all") && (
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
              {paginatedSubjects.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {paginatedSubjects.map((subject: any) => (
                      <MobileSubjectCard key={subject.id} subject={subject} />
                    ))}
                  </div>
                  <MobilePagination />
                </>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No subjects found</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card className="border-border/50">
                <CardHeader className="pb-2 px-4 md:px-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    All Subjects ({totalItems})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            Subject Name
                          </TableHead>
                          <TableHead className="w-[200px]">Category</TableHead>
                          <TableHead className="w-[120px]">Created</TableHead>
                          <TableHead className="w-[80px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSubjects.map((subject: any) => {
                          const categoryName = getCategoryName(
                            subject.category_id,
                          );

                          return (
                            <TableRow
                              key={subject.id}
                              className="hover:bg-muted/30"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span
                                    className="truncate max-w-[200px]"
                                    title={subject.name}
                                  >
                                    {subject.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-primary/5"
                                >
                                  <FolderTree className="h-3 w-3 mr-1" />
                                  {categoryName}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate">
                                    {formatDate(subject.createdAt)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
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
                                    <DropdownMenuItem
                                      onClick={() => openEditDialog(subject)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => openDeleteDialog(subject)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {paginatedSubjects.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No subjects found</p>
                    </div>
                  ) : (
                    <DesktopPagination />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Create Subject Dialog */}
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Create New Subject</DialogTitle>
                  <DialogDescription>
                    Add a new subject under a category
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newSubject.category_id}
                      onValueChange={(value) =>
                        setNewSubject({ ...newSubject, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialCategories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Subject Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., MATHEMATICS, PHYSICS, BIOLOGY"
                      value={newSubject.name}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewSubject({ category_id: "", name: "" });
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSubject}
                    disabled={
                      actionLoading ||
                      !newSubject.category_id ||
                      !newSubject.name.trim()
                    }
                    className="w-full sm:w-auto"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Subject"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Subject Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Edit Subject</DialogTitle>
                  <DialogDescription>
                    Update subject information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="p-2 bg-muted/30 rounded-md text-sm">
                      {getCategoryName(editSubject.category_id)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Category cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Subject Name *</Label>
                    <Input
                      id="edit-name"
                      placeholder="e.g., MATHEMATICS, PHYSICS, BIOLOGY"
                      value={editSubject.name}
                      onChange={(e) =>
                        setEditSubject({
                          ...editSubject,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedSubject(null);
                      setEditSubject({ category_id: "", name: "" });
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateSubject}
                    disabled={actionLoading || !editSubject.name.trim()}
                    className="w-full sm:w-auto"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Subject"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                  <AlertDialogDescription className="break-words">
                    Are you sure you want to delete "{selectedSubject?.name}"?
                    This action cannot be undone. This subject may be used in
                    tutor profiles.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel
                    disabled={actionLoading}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSubject}
                    disabled={actionLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete Subject"
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
