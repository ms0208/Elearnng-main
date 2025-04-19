import React from "react";
import { Navbar } from "./Navbar";
import { TeacherSidebar } from "./TeacherSidebar";
import { StudentSidebar } from "./StudentSidebar";
import { useAuthStore } from "@/lib/store/auth-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user } = useAuthStore();

  return (
    <div>
      <Navbar />
      {user?.role === "teacher" && <TeacherSidebar />}
      {user?.role === "student" && <StudentSidebar />}
      <main className={`pt-16 ${user ? "ml-64" : ""}`}>{children}</main>
    </div>
  );
};
