import CoursesPage from "@/components/courses/CoursePage";
import { Suspense } from "react";
// import CoursesPage from "./CoursesPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesPage />
    </Suspense>
  );
}
