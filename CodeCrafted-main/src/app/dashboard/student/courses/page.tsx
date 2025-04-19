"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { Input } from "@/components/ui/Input";
import { Course } from "@/lib/data/mock-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { studentApi } from "@/lib/api/mock-api";

export default function StudentCoursesPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const purchasedCourses = await studentApi.getPurchasedCourses(user.id);
        setCourses(purchasedCourses);
        setFilteredCourses(purchasedCourses);
      } catch (error) {
        console.error("Failed to fetch purchased courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
    );

    setFilteredCourses(filtered);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">
            View and continue your enrolled courses
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8">
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <CourseGrid
            courses={filteredCourses}
            href={(course) => `/dashboard/student/course/${course.id}`}
          />
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
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            {courses.length > 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="text-sm text-gray-500">
                  No courses match your search criteria. Try a different search
                  term.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900">
                  No courses yet
                </h3>
                <p className="text-sm text-gray-500">
                  You haven`&apos`t enrolled in any courses yet. Browse our
                  catalog to find courses that interest you.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
