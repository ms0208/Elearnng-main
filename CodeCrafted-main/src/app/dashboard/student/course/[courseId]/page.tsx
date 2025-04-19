// src/app/(dashboard)/student/course/[courseId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { LessonList } from "@/components/courses/LessionList";
import { Course, Lesson } from "@/lib/data/mock-data";
import { courseApi } from "@/lib/api/mock-api";
import { formatDate } from "@/lib/utils";

export default function StudentCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await courseApi.getCourseById(courseId);
        setCourse(courseData);

        // Set the first lesson as the current lesson by default
        if (courseData.lessons.length > 0) {
          setCurrentLesson(courseData.lessons[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSelectLesson = (lessonId: string) => {
    if (!course) return;

    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
          <p className="text-gray-600">
            The course you are looking for does not exist or you do not have
            permission to view it.
          </p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">
            {course.category} • {course.duration} • Last updated{" "}
            {formatDate(course.updatedAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg bg-black">
                  {/* Video Player (mockup) */}
                  {/* Video Player */}
                  <div className="overflow-hidden rounded-lg bg-black">
                    <video
                      className="w-full h-auto"
                      controls
                      src={currentLesson.videoUrl}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {currentLesson.title}
                  </h2>
                  <p className="text-gray-700">{currentLesson.description}</p>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!course) return;

                      const currentIndex = course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      );

                      if (currentIndex > 0) {
                        handleSelectLesson(course.lessons[currentIndex - 1].id);
                      }
                    }}
                    disabled={
                      !currentLesson ||
                      course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      ) === 0
                    }>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mr-2 h-5 w-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                    Previous Lesson
                  </Button>

                  <Button
                    onClick={() => {
                      if (!course) return;

                      const currentIndex = course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      );

                      if (currentIndex < course.lessons.length - 1) {
                        handleSelectLesson(course.lessons[currentIndex + 1].id);
                      }
                    }}
                    disabled={
                      !currentLesson ||
                      course.lessons.findIndex(
                        (l) => l.id === currentLesson?.id
                      ) ===
                        course.lessons.length - 1
                    }>
                    Next Lesson
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="ml-2 h-5 w-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
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
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No lessons available
                </h3>
                <p className="text-sm text-gray-500">
                  This course does not have any lessons yet.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar with course info and lesson list */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <LessonList
                  lessons={course.lessons}
                  currentLessonId={currentLesson?.id}
                  onSelectLesson={handleSelectLesson}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">About This Course</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">{course.description}</p>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="mb-2 text-sm font-medium">Instructor</h4>
                    <div className="flex items-center">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacherName}`}
                        alt={course.teacherName}
                        className="mr-3 h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {course.teacherName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
