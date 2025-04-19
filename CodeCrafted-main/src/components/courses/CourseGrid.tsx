import React from "react";
import { CourseCard } from "./CourseCard";
import { Course } from "./CoursePage";

interface CourseGridProps {
  courses: Course[];
  href?: (course: Course) => string;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses, href }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course,index) => (
    <div key={index}>
     <CourseCard
     course={course}
     href={href ? href(course) : undefined}
   />
   </div>
      ))}
    </div>
  );
};
