"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Logo from "../../../public/images/CodeCraftedLogo.png";

interface DecodedToken {
  name: string;
  avatar: string;
  role: string;
  exp: number; // for token expiration
}

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        // Optional: Check if token expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="logo" width={30} height={30} />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              CodeCrafted
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium ${pathname === "/"
              ? "text-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            Home
          </Link>

          <Link
            href="/courses"
            className={`text-sm font-medium ${pathname === "/courses"
              ? "text-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            Courses
          </Link>

          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={
                  user.role === "teacher"
                    ? "/dashboard/teacher/dashboard"
                    : "/dashboard/student/dashboard"
                }
                className={`text-sm font-medium ${pathname?.includes(
                  user.role === "teacher" ? "/teacher" : "/student"
                )
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                {user.role === "teacher" ? "Teacher Dashboard" : "My Dashboard"}
              </Link>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={Logo}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {user?.name && (
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile navigation button */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>

            {!user ? (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    user.role === "teacher"
                      ? "/dashboard/teacher/dashboard"
                      : "/dashboard/student/dashboard"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {user.role === "teacher"
                    ? "Teacher Dashboard"
                    : "My Dashboard"}
                </Link>

                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

