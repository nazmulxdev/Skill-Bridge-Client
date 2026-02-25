"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TutorsFiltersProps {
  filters: {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    rating: string;
    limit: string;
  };
  onFilterChange: (key: string, value: string) => void;
  categories: any[];
}

// Rating options
const ratings = [
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
  { value: "3", label: "3+ Stars" },
];

// Limit options
const limitOptions = [
  { value: "5", label: "5 per page" },
  { value: "9", label: "9 per page" },
  { value: "12", label: "12 per page" },
  { value: "15", label: "15 per page" },
  { value: "20", label: "20 per page" },
];

export function TutorsFilters({
  filters,
  onFilterChange,
  categories,
}: TutorsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSearch = () => {
    onFilterChange("search", searchInput);
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange("search", "");
    onFilterChange("category", "all");
    onFilterChange("minPrice", "");
    onFilterChange("maxPrice", "");
    onFilterChange("rating", "all");
    onFilterChange("limit", "9");
    onFilterChange("page", "1");
    setMobileFiltersOpen(false);
  };

  const applyMobileFilters = () => {
    handleSearch();
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category !== "all") ||
    filters.minPrice ||
    filters.maxPrice ||
    (filters.rating && filters.rating !== "all");

  const categoryNames = categories
    .map((cat: any) => cat.name)
    .filter(Boolean)
    .sort();

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden h-10 px-3">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-full sm:w-[400px] p-0">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-xl">Filters</SheetTitle>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-180px)] px-6 py-4">
              <div className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(v) =>
                      onFilterChange("category", v === "all" ? "" : v)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryNames.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Rating</Label>
                  <Select
                    value={filters.rating || "all"}
                    onValueChange={(v) =>
                      onFilterChange("rating", v === "all" ? "" : v)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      {ratings.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Price Range ($)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Min
                      </Label>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || !isNaN(Number(value))) {
                            onFilterChange("minPrice", value);
                          }
                        }}
                        className="w-full h-10"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Max
                      </Label>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || !isNaN(Number(value))) {
                            onFilterChange("maxPrice", value);
                          }
                        }}
                        className="w-full h-10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Items Per Page */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Items Per Page</Label>
                  <Select
                    value={filters.limit || "9"}
                    onValueChange={(v) => onFilterChange("limit", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                      {limitOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="p-6 pt-4 border-t flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Clear All
              </Button>
              <SheetClose asChild>
                <Button
                  onClick={applyMobileFilters}
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Desktop Search Button */}
        <Button onClick={handleSearch} className="hidden lg:inline-flex h-10">
          Search
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex flex-wrap gap-4 items-end">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(v) =>
              onFilterChange("category", v === "all" ? "" : v)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryNames.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Rating</Label>
          <Select
            value={filters.rating || "all"}
            onValueChange={(v) =>
              onFilterChange("rating", v === "all" ? "" : v)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              {ratings.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Min ($)</Label>
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || !isNaN(Number(value))) {
                onFilterChange("minPrice", value);
              }
            }}
            className="w-[100px] h-10"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Max ($)</Label>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || !isNaN(Number(value))) {
                onFilterChange("maxPrice", value);
              }
            }}
            className="w-[100px] h-10"
            min="0"
          />
        </div>

        {/* Limit Dropdown */}
        <div className="space-y-2">
          <Label>Show</Label>
          <Select
            value={filters.limit || "9"}
            onValueChange={(v) => onFilterChange("limit", v)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2 mb-[2px] h-10"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
