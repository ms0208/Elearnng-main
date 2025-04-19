// src/components/courses/LessonList.tsx
import React from "react";
import { Lesson } from "@/lib/data/mock-data";

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
}

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  currentLessonId,
  onSelectLesson,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Course Content</h3>
      <div className="space-y-1">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson && onSelectLesson(lesson.id)}
            className={`w-full rounded-md px-4 py-2 text-left text-sm transition ${
              currentLessonId === lesson.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
                  {lesson.order}
                </span>
                <span className="font-medium">{lesson.title}</span>
              </div>
              <span className="text-xs text-gray-500">{lesson.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
