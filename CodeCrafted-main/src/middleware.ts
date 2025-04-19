import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public pages that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/';

  // Read token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token && !isPublicPath) {
    // If user is not authenticated and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicPath) {
    // If user is already authenticated and trying to visit login/signup, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard/student/dashboard', request.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ['/dashboard/teacher/dashboard', '/dashboard/student/dashboard'], // Protect dashboard routes
};
