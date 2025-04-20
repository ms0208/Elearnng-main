import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { Course } from "./CoursePage";
import logo from '/public/images/CodeCraftedLogo.jpg';
import img from '/public/uploads/image1.jpeg';

interface CourseCardProps {
  course: Course;
  href?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  href = `/courses/${course.CourseID}`,
}) => {
  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-video w-full overflow-hidden">
          <img
            // src={course.thumbnail}
            // alt={course.title}
            // className="h-full w-full object-cover"
            src={`http://localhost:5000/images/${course.CourseImages}`}
            alt={course.CourseTitle}
            className="h-full w-full object-cover"
          />
          
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {/* {course.category} */}
              {course.CourseTitle}
            </span>
            <div className="flex items-center text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              {/* <span className="ml-1">{course.purchaseCount} students</span> */}
              <span className="ml-1">{course.CourseTitle}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={logo.src}  // Ensure 'logo' is the correct variable
                alt={course.CourseTitle}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-xs text-gray-600">
                {/* {course.teacherName} */}
                {course.Description}
              </span>
            </div>
            <span className="font-bold text-blue-600">
              {/* {formatPrice(course.price)} */}
              {"$"+course.CoursePrice}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
