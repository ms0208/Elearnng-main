"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import axios from 'axios'
import { Button } from "@/components/ui/Button";
import { CourseGrid } from "@/components/courses/CourseGrid";
// import { CourseSearchBar } from "@/components/courses/CourseSearchBar";
import { Course } from "@/components/courses/CoursePage";

export default function HomePage() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [fetchCourse, setFetchCourse] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/course");
      const data = await res.json();

      setPopularCourses(data.slice(0, 8)); // Top 8 courses
    } catch (error) {
      console.error("Failed to fetch popular courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommended = async () => {
    const cachedData = localStorage.getItem("recommendRequestResponse");

    if (cachedData) {
      const { response } = JSON.parse(cachedData);
      setFetchCourse(response);
      setIsRecommendedLoading(false);
      return;
    }

    const requestData = {
      user_profile: {
        UserID: "67fb3576eb3ed9b234f8bd47",
        total_courses_taken: 1,
        avg_rating: 0.0,
      },
      course_profile: {
        CourseID: 1,
        CourseTitle: "C++ programming",
        Description: "Great courses",
        Duration: "2hr",
        DifficultyLevel: "Medium",
      },
      num_recommendations: 10,
      exclude_taken_courses: true,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/recommend")//,(
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      const result = await res.data;

      // Store request and response in localStorage
      localStorage.setItem(
        "recommendRequestResponse",
        JSON.stringify({
          request: requestData,
          response: result,
        })
      );

      setFetchCourse(result);
      console.log(result)
    } catch (error) {
      console.error("Recommendation fetch error:", error);
    } finally {
      setIsRecommendedLoading(false);
    }
  };

  const refreshRecommendations = () => {
    localStorage.removeItem("recommendRequestResponse");
    setIsRecommendedLoading(true);
    fetchRecommended();
  };

  useEffect(() => {
    fetchCourses();
    fetchRecommended();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Learn Without Limits
          </h1>
          <p className="mb-8 max-w-2xl mx-auto text-lg text-blue-100">
            Start, switch, or advance your career with thousands of courses from expert instructors.
          </p>
          {/* <CourseSearchBar /> */}
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Join For Free
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Popular Courses</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700">
              View All Courses →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            <CourseGrid courses={popularCourses} />
          )}
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Recommended Courses
          </h2>

          {isRecommendedLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : Array.isArray(fetchCourse) && fetchCourse.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {fetchCourse.map((course: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.course_title}
                  </h3>
                  <p className="text-gray-700">{course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No recommendations available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Why Learn With Us Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why Learn With Us
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Expert Instructors",
                description: "Learn from industry experts who are passionate about teaching and sharing their knowledge.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347..." />
                ),
              },
              {
                title: "Learn at Your Own Pace",
                description: "Access course materials 24/7 and learn at your own pace, from any device, anywhere in the world.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0..." />
                ),
              },
              {
                title: "Progress Tracking",
                description: "Track your progress, earn certificates, and achieve your learning goals with our dashboard.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12..." />
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            Join our community and explore hundreds of courses to upgrade your skills.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}


