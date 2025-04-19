import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CodeCrafted</h3>
            <p className="text-gray-600 text-sm">
              A platform for online learning and teaching. Join thousands of
              students and teachers.
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses?category=Web Development"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Data Science"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Data Science
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Mobile Development"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Design"
                  className="text-sm text-gray-600 hover:text-blue-600">
                  Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                <span className="block">Email: info@CodeCrafted.com</span>
              </li>
              <li className="text-sm text-gray-600">
                <span className="block">Phone: +1 (123) 456-7890</span>
              </li>
              <li className="text-sm text-gray-600">
                <span className="block">
                  Address: 123 Education St, Learning City
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} CodeCrafted. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
