"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { LessonList } from "@/components/courses/LessionList";
import { Course } from "@/lib/data/mock-data";
import { courseApi, studentApi } from "@/lib/api/mock-api";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatPrice, formatDate } from "@/lib/utils";
import axios from 'axios';
import { Toaster, toast } from "sonner";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasUserPurchased, setHasUserPurchased] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch course details
        // backend URL
        const courseRes = await axios.get(`http://localhost:5000/api/courses/course/${courseId}`);
        setCourse(courseRes.data);

        // Check if the user has already purchased this course
        if (user && user.role === "student") {
          const purchasedCourses = await studentApi.getPurchasedCourses(
            user.id
          );
          const isPurchased = purchasedCourses.some((c) => c.id === courseId);
          setHasUserPurchased(isPurchased);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  const handlePurchaseCourse = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=/course/${courseId}`);
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can purchase courses");
      return;
    }

    setIsPurchasing(true);

    try {
      await studentApi.purchaseCourse(user.id, courseId);
      setHasUserPurchased(true);
      toast.success("Course purchased successfully!");

      // Redirect to the course content page
      router.push(`/dashboard/student/course/${courseId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to purchase course";
      toast.error(errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
          <p className="text-gray-600">
            The course you are looking for does not exist.
          </p>
          <Button onClick={() => router.push("/courses")} className="mt-4">
            Browse Courses
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Course Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium">
                  {course.category}
                </span>
                <div className="flex items-center space-x-1 text-yellow-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{course.category}</span>
                </div>
              </div>

              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {course.title}
              </h1>

              <p className="mb-6 text-blue-100">{course.description}</p>

              <div className="mb-6 flex flex-wrap items-center text-sm">
                <div className="mr-6 flex items-center">
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{course.duration}</span>
                </div>

                <div className="mr-6 flex items-center">
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
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  <span>{course.purchaseCount} students</span>
                </div>

                <div className="flex items-center">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                  <span>Last updated {formatDate(course.updatedAt)}</span>
                </div>
              </div>

              <div className="mb-6 flex items-center">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacherName}`}
                  alt={course.teacherName}
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm">Created by</p>
                  <p className="font-medium">{course.teacherName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-6 text-center">
                  <div className="mb-4 text-3xl font-bold text-gray-900">
                    {formatPrice(course.price)}
                  </div>

                  {hasUserPurchased ? (
                    <div className="space-y-4">
                      <div className="rounded-md bg-green-50 p-3">
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 text-green-400">
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              You already own this course
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() =>
                          router.push(`/dashboard/student/course/${courseId}`)
                        }>
                        Go to Course
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePurchaseCourse}
                      isLoading={isPurchasing}>
                      {user ? "Enroll Now" : "Sign in to Enroll"}
                    </Button>
                  )}

                  <p className="mt-4 text-xs text-gray-500">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                What You&apos;ll Learn
              </h2>

              <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* {course.description
                  .split(". ")
                  .slice(0, 6)
                  .map((point, index) => (
                    <div key={index} className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-2 h-6 w-6 flex-shrink-0 text-blue-500">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span>{point}.</span>
                    </div>
                  ))} */}
              </div>

              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Course Description
              </h2>

              <div className="mb-12 prose prose-blue max-w-none">
                <p className="text-gray-700">{course.description}</p>

                <h3 className="mt-8 text-xl font-semibold">
                  Who this course is for:
                </h3>
                <ul className="mt-4 list-disc pl-5">
                  <li>
                    Beginner and intermediate learners interested in{" "}
                    {course.category}
                  </li>
                  <li>Anyone looking to gain practical skills in this field</li>
                  <li>
                    Professionals wanting to update their knowledge and stay
                    current
                  </li>
                </ul>

                <h3 className="mt-8 text-xl font-semibold">Requirements:</h3>
                <ul className="mt-4 list-disc pl-5">
                  <li>Basic understanding of the subject area</li>
                  <li>No specialized equipment or software needed</li>
                  <li>A computer with internet access</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Course Content
                  </h3>

                  <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                    <span>{course.category} lessons</span>
                    <span>{course.duration}</span>
                  </div>

                  {/* {course.lessons.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <LessonList lessons={course.lessons} />
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      This course is currently being updated with new content.
                    </p>
                  )} */}
                </div>

                {!hasUserPurchased && (
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
                      Ready to start learning?
                    </h3>
                    <Button
                      className="w-full"
                      onClick={handlePurchaseCourse}
                      isLoading={isPurchasing}>
                      {user ? "Enroll Now" : "Sign in to Enroll"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </MainLayout>
  );
}
