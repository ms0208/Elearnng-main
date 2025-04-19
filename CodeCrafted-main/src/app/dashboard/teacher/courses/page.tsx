"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { Course } from "@/lib/data/mock-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { teacherApi } from "@/lib/api/mock-api";

export default function TeacherCoursesPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const teacherCourses = await teacherApi.getTeacherCourses(user.id);
        setCourses(teacherCourses);
      } catch (error) {
        console.error("Failed to fetch teacher courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600">
              Manage and edit your published courses
            </p>
          </div>
          <Link href="/dashboard/teacher/create-course">
            <Button>Create New Course</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : courses.length > 0 ? (
          <CourseGrid
            courses={courses}
            href={(course) => `/dashboard/teacher/edit-course/${course.id}`}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No courses yet
            </h3>
            <p className="mb-4 max-w-md text-sm text-gray-500">
              Get started by creating your first course. Share your knowledge
              and expertise with students around the world.
            </p>
            <Link href="/dashboard/teacher/create-course">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
