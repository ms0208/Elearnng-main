"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from "@/components/ui/Button";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { CourseSearchBar } from "@/components/courses/CourseSearchBar";
import { Course } from "@/lib/data/mock-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { studentApi, courseApi } from "@/lib/api/mock-api";

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const [studentCourses, featuredCourses] = await Promise.all([
          studentApi.getPurchasedCourses(user.id),
          courseApi.getPopularCourses(),
        ]);

        setPurchasedCourses(studentCourses);

        // Filter out courses that the student has already purchased
        const purchasedIds = studentCourses.map((course) => course.id);
        const filteredPopular = featuredCourses.filter(
          (course) => !purchasedIds.includes(course.id)
        );

        setPopularCourses(filteredPopular.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name}. Continue your learning journey.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Find your next course
          </h2>
          <CourseSearchBar />
        </div>

        {/* My Courses */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <Link
              href="/dashboard/student/courses"
              className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : purchasedCourses.length > 0 ? (
            <CourseGrid
              courses={purchasedCourses.slice(0, 4)}
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
              <h3 className="text-lg font-medium text-gray-900">
                No courses yet
              </h3>
              <p className="mb-4 max-w-md text-sm text-gray-500">
                You haven `&apos` t enrolled in any courses yet. Browse our
                catalog to find courses that interest you.
              </p>
              <Link href="/dashboard/student/explore">
                <Button>Explore Courses</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Courses */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended for You
            </h2>
            <Link
              href="/dashboard/student/explore"
              className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Browse All →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : popularCourses.length > 0 ? (
            <CourseGrid
              courses={popularCourses}
              href={(course) => `/courses/${course.id}`}
            />
          ) : (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-gray-600">
                You &apos`ve already enrolled in all our featured courses. Check
                out our full catalog for more options.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
