// src/components/Dashboard/Admin/DashboardAdminCategoriesClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FolderTree,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  BookOpen,
  Calendar,
  MoreVertical,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  createCategoryByAdmin,
  updateCategoryByAdmin,
  deleteCategoryByAdmin,
} from "@/actions/admin.action";

interface AdminCategoriesClientProps {
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

export function DashboardAdminCategoriesClient({
  initialCategories,
}: AdminCategoriesClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState({
    name: "",
    description: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCategories = initialCategories.filter((cat: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Calculate stats - using initialCategories directly
  const stats = {
    total: initialCategories.length,
    withSubjects: initialCategories.filter((c: any) => c.subjects?.length > 0)
      .length,
    empty: initialCategories.filter((c: any) => !c.subjects?.length).length,
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading("Creating category...");

    try {
      const { data, error } = await createCategoryByAdmin({
        name: newCategory.name,
        description: newCategory.description,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Category created successfully!", { id: toastId });
      setIsCreateDialogOpen(false);
      setNewCategory({ name: "", description: "" });
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    if (!editCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading("Updating category...");

    try {
      const { data, error } = await updateCategoryByAdmin({
        categoryId: selectedCategory.id,
        name: editCategory.name,
        description: editCategory.description,
      });

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Category updated successfully!", { id: toastId });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setEditCategory({ name: "", description: "" });
      router.refresh();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setActionLoading(true);
    const toastId = toast.loading("Deleting category...");

    try {
      const { data, error } = await deleteCategoryByAdmin(selectedCategory.id);

      if (error || !data) throw new Error(getErrorMessage(error));

      toast.success("Category deleted successfully!", { id: toastId });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
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

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setEditCategory({
      name: category.name,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
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
          {totalItems} categories
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
  const MobileCategoryCard = ({ category }: { category: any }) => {
    const subjectCount = category.subjects?.length || 0;

    return (
      <Card className="border-border/50 mb-3 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FolderTree className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {category.description || "No description"}
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
                <DropdownMenuItem onClick={() => openEditDialog(category)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => openDeleteDialog(category)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-muted/30 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Subjects</p>
              <p className="text-sm font-bold">{subjectCount}</p>
            </div>
            <div className="bg-muted/30 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-xs truncate">
                {formatDate(category.createdAt)}
              </p>
            </div>
          </div>

          {subjectCount > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                Recent Subjects
              </p>
              <div className="flex flex-wrap gap-1">
                {category.subjects.slice(0, 3).map((subject: any) => (
                  <Badge
                    key={subject.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {subject.name}
                  </Badge>
                ))}
                {subjectCount > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{subjectCount - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
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
                Category Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create, edit, and manage categories for subjects in your
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
                <span className="text-xs sm:text-sm">New Category</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <FolderTree className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground truncate">
                      Total Categories
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
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-green-600 truncate">
                      With Subjects
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.withSubjects}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 border-yellow-500/20 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10 flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-yellow-600 truncate">
                      Empty Categories
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.empty}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories by name or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 w-full text-sm h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{totalItems}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{stats.total}</span>{" "}
              categories
            </p>
          </div>

          {/* Mobile Cards View (0-1024px) */}
          <div className="block lg:hidden">
            {paginatedCategories.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginatedCategories.map((category: any) => (
                    <MobileCategoryCard key={category.id} category={category} />
                  ))}
                </div>
                <MobilePagination />
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <FolderTree className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No categories found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Desktop Table View (1024px+) */}
          <div className="hidden lg:block">
            <Card className="border-border/50">
              <CardHeader className="pb-2 px-4 md:px-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  All Categories ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          Category Name
                        </TableHead>
                        <TableHead className="w-[300px]">Description</TableHead>
                        <TableHead className="w-[100px]">Subjects</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                        <TableHead className="w-[80px] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCategories.map((category: any) => (
                        <TableRow
                          key={category.id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="font-medium">
                            <div
                              className="truncate max-w-[180px]"
                              title={category.name}
                            >
                              {category.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="truncate max-w-[280px] text-sm text-muted-foreground"
                              title={category.description || ""}
                            >
                              {category.description || "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5">
                                {category.subjects?.length || 0}
                              </Badge>
                              {category.subjects?.length > 0 && (
                                <span
                                  className="text-xs text-muted-foreground truncate max-w-[100px]"
                                  title={category.subjects
                                    .map((s: any) => s.name)
                                    .join(", ")}
                                >
                                  {category.subjects
                                    .slice(0, 2)
                                    .map((s: any) => s.name)
                                    .join(", ")}
                                  {category.subjects.length > 2 && "..."}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">
                                {formatDate(category.createdAt)}
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openEditDialog(category)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => openDeleteDialog(category)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {paginatedCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderTree className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No categories found</p>
                  </div>
                ) : (
                  <DesktopPagination />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Create Category Dialog - Responsive */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category for organizing subjects
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., SCIENCE, MATHEMATICS, ARTS"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        name: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the category..."
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setNewCategory({ name: "", description: "" });
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  disabled={actionLoading || !newCategory.name.trim()}
                  className="w-full sm:w-auto"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog - Responsive */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update category information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Category Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., SCIENCE, MATHEMATICS, ARTS"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        name: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Brief description of the category..."
                    value={editCategory.description}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCategory(null);
                    setEditCategory({ name: "", description: "" });
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCategory}
                  disabled={actionLoading || !editCategory.name.trim()}
                  className="w-full sm:w-auto"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Category"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog - Responsive */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription className="break-words">
                  Are you sure you want to delete "{selectedCategory?.name}"?
                  This action cannot be undone. Any subjects in this category
                  will also be deleted.
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
                  onClick={handleDeleteCategory}
                  disabled={actionLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete Category"
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
