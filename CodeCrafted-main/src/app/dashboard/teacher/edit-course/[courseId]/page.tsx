// src/app/(dashboard)/teacher/edit-course/[courseId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LessonList } from "@/components/courses/LessionList";
import { useAuthStore } from "@/lib/store/auth-store";
import { courseApi, teacherApi } from "@/lib/api/mock-api";
import { Course, categories } from "@/lib/data/mock-data";
// Lesson import and use
import { Toaster, toast } from "sonner";

interface EditCourseFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
}

interface AddLessonFormValues {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCourseFormValues>();

  const {
    register: registerLesson,
    handleSubmit: handleSubmitLesson,
    reset: resetLesson,
    formState: { errors: lessonErrors },
  } = useForm<AddLessonFormValues>({
    defaultValues: {
      videoUrl: "/videos/lesson-sample.mp4",
      duration: "45 minutes",
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await courseApi.getCourseById(courseId);

        // Check if this course belongs to the current user
        if (user?.id !== courseData.teacherId) {
          toast.error("You do not have permission to edit this course");
          router.push("/dashboard/teacher/dashboard");
          return;
        }

        setCourse(courseData);
        reset({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          category: courseData.category,
          thumbnail: courseData.thumbnail,
          duration: courseData.duration,
        });
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast.error("Failed to load course. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCourse();
    }
  }, [courseId, user, router, reset]);

  const onSaveCourse = async (data: EditCourseFormValues) => {
    if (!course) return;

    setIsSaving(true);

    try {
      const updatedCourse = await courseApi.updateCourse(courseId, data);
      setCourse(updatedCourse);
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error("Failed to update course. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onAddLesson = async (data: AddLessonFormValues) => {
    if (!course) return;

    setIsAddingLesson(true);

    try {
      const lessonData = {
        ...data,
        order: course.lessons.length + 1,
      };

      const updatedCourse = await teacherApi.addLesson(courseId, lessonData);
      setCourse(updatedCourse);
      toast.success("Lesson added successfully!");
      resetLesson();
    } catch (error) {
      console.error("Failed to add lesson:", error);
      toast.error("Failed to add lesson. Please try again.");
    } finally {
      setIsAddingLesson(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;

    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      try {
        await courseApi.deleteCourse(courseId);
        toast.success("Course deleted successfully!");
        router.push("/dashboard/teacher/courses");
      } catch (error) {
        console.error("Failed to delete course:", error);
        toast.error("Failed to delete course. Please try again.");
      }
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
          <Button
            onClick={() => router.push("/dashboard/teacher/courses")}
            className="mt-4">
            Back to My Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600">
              Update your course information and manage lessons
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push(`/courses/${courseId}`)}
              variant="outline">
              Preview Course
            </Button>
            <Button onClick={handleDeleteCourse} variant="destructive">
              Delete Course
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTabIndex(0)}
              className={`inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium ${
                activeTabIndex === 0
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}>
              Course Details
            </button>
            <button
              onClick={() => setActiveTabIndex(1)}
              className={`inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium ${
                activeTabIndex === 1
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}>
              Lessons
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTabIndex === 0 && (
            <form onSubmit={handleSubmit(onSaveCourse)} className="max-w-3xl">
              <div className="mb-8 space-y-6">
                <Input
                  id="title"
                  label="Course Title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                  error={errors.title?.message}
                />

                <Textarea
                  id="description"
                  label="Course Description"
                  rows={4}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                  error={errors.description?.message}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    id="price"
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0,
                        message: "Price must be at least $0",
                      },
                      valueAsNumber: true,
                    })}
                    error={errors.price?.message}
                  />

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-1 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    id="thumbnail"
                    label="Thumbnail URL"
                    {...register("thumbnail", {
                      required: "Thumbnail URL is required",
                    })}
                    error={errors.thumbnail?.message}
                  />

                  <Input
                    id="duration"
                    label="Duration (e.g., 10 hours)"
                    {...register("duration", {
                      required: "Duration is required",
                    })}
                    error={errors.duration?.message}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" isLoading={isSaving}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/teacher/courses")}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {activeTabIndex === 1 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Lessons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.lessons.length > 0 ? (
                      <LessonList lessons={course.lessons} />
                    ) : (
                      <div className="flex h-64 flex-col items-center justify-center text-center">
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
                          No lessons added yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Start adding lessons to your course using the form on
                          the right.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmitLesson(onAddLesson)}
                      className="space-y-4">
                      <Input
                        id="lesson-title"
                        label="Lesson Title"
                        {...registerLesson("title", {
                          required: "Title is required",
                        })}
                        error={lessonErrors.title?.message}
                      />

                      <Textarea
                        id="lesson-description"
                        label="Lesson Description"
                        rows={3}
                        {...registerLesson("description", {
                          required: "Description is required",
                        })}
                        error={lessonErrors.description?.message}
                      />

                      <Input
                        id="lesson-video"
                        label="Video URL"
                        {...registerLesson("videoUrl", {
                          required: "Video URL is required",
                        })}
                        error={lessonErrors.videoUrl?.message}
                      />

                      <Input
                        id="lesson-duration"
                        label="Duration (e.g., 45 minutes)"
                        {...registerLesson("duration", {
                          required: "Duration is required",
                        })}
                        error={lessonErrors.duration?.message}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        isLoading={isAddingLesson}>
                        Add Lesson
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </DashboardLayout>
  );
}
