"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { jwtDecode } from "jwt-decode";
import { LessonList } from "@/components/courses/LessionList";
import { courseApi, studentApi } from "@/lib/api/mock-api";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasUserPurchased, setHasUserPurchased] = useState(false);

  // Fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode<{ id: string }>(token);
        const userId = decoded.id;

        const userRes = await axios.get(
          `http://localhost:5000/api/users/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(userRes.data);
      } catch (err) {
        console.error("User fetch error", err);
        toast.error("Failed to fetch user data");
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRes = await axios.get(
          `http://localhost:5000/api/courses/course/${courseId}`
        );
        setCourse(courseRes.data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  // Check if course already purchased
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (user && courseId && user.role === "student") {
        try {
          const purchasedCourses = await studentApi.getPurchasedCourses(
            user.id
          );
          const isPurchased = purchasedCourses.some((c) => c.id === courseId);
          setHasUserPurchased(isPurchased);
        } catch (err) {
          console.error("Failed to check purchase status", err);
        }
      }
    };

    checkPurchaseStatus();
  }, [user, courseId]);

  const handlePurchaseCourse = async () => {
    if (!user) {
      router.push(`/login?redirect=/course/${courseId}`);
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can purchase courses");
      return;
    }

    setIsPurchasing(true);

    try {
      // await axios.post("http://localhost:5000/api/students/purchase-course", {
      //   userId: user.id,
      //   courseId,
      // });
      // setHasUserPurchased(true);
      toast.success("Course purchased successfully!");
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
      <Toaster />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <img
                  src={`http://localhost:5000/images/${course.CourseImages}`}
                  alt={course.CourseTitle}
                  className="img-fluid rounded border border-secondary shadow-sm transition-transform"
                  style={{ transition: "transform 0.3s ease", cursor: "pointer" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium">
                  {course.CourseTitle}
                </span>
                <div className="flex items-center space-x-1 text-yellow-300">
                  <span>{course.category}</span>
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {course.title}
              </h1>

              <p className="mb-6 text-blue-100">{course.Description}</p>

              <div className="mb-6 flex flex-wrap items-center text-sm space-x-4">
                <span>Duration: {course.Duration}</span>
                {/* <span>Students: {course.purchaseCount}</span> */}
              </div>

              {hasUserPurchased ? (
                <Button
                  onClick={() =>
                    router.push(`/dashboard/student/course/${courseId}`)
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Course
                </Button>
              ) : (
                <Button
                  onClick={handlePurchaseCourse}
                  disabled={isPurchasing}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  {isPurchasing ? "Purchasing..." : `Buy for $${course.CoursePrice}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
