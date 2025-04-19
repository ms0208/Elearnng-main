"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store/auth-store";
import { courseApi } from "@/lib/api/mock-api";
import { categories } from "@/lib/data/mock-data";
import { Toaster, toast } from "sonner";

interface CreateCourseFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({
    defaultValues: {
      price: 49.99,
      category: categories[0],
      thumbnail: "/images/courses/default.jpg",
      duration: "10 hours",
    },
  });

  const onSubmit = async (data: CreateCourseFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const courseData = {
        ...data,
        teacherId: user.id,
        teacherName: user.name,
        rating: 0,
        lessons: [],
      };

      const newCourse = await courseApi.createCourse(courseData);

      toast.success("Course created successfully!");
      router.push(`/dashboard/teacher/edit-course/${newCourse.id}`);
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
      console.error("Failed to create course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create your new course
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
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
            <Button type="submit" isLoading={isSubmitting}>
              Create Course
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </DashboardLayout>
  );
}
