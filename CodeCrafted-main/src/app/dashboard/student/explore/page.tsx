"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { Input } from "@/components/ui/Input";
import { Course } from "@/lib/data/mock-data";
import { studentApi, courseApi } from "@/lib/api/mock-api";
import { useAuthStore } from "@/lib/store/auth-store";

export default function ExplorePage() {
  const { user } = useAuthStore();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [courses, purchasedCourses] = await Promise.all([
          courseApi.getAllCourses(),
          user ? studentApi.getPurchasedCourses(user.id) : Promise.resolve([]),
        ]);

        setAllCourses(courses);
        setFilteredCourses(courses);

        if (purchasedCourses.length > 0) {
          setPurchasedCourseIds(purchasedCourses.map((course) => course.id));
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let filtered = [...allCourses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    setFilteredCourses(filtered);
  }, [allCourses, searchQuery, selectedCategory, priceRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-600">
            Discover courses to advance your skills and knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Filters
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-medium text-gray-700">
                  Search
                </label>
                <Input
                  id="search"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <CourseFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </div>
          </div>

          {/* Course listings */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-600">
                  Showing {filteredCourses.length} of {allCourses.length}{" "}
                  courses
                </p>
                <CourseGrid
                  courses={filteredCourses}
                  href={(course) =>
                    purchasedCourseIds.includes(course.id)
                      ? `/dashboard/student/course/${course.id}`
                      : `/courses/${course.id}`
                  }
                />
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mb-4 h-12 w-12 text-gray-400">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="text-sm text-gray-500">
                  No courses match your current filters. Try adjusting your
                  search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
