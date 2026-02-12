// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define paths that require specific roles
const protectedPaths = ['/dashboard', '/employer', '/admin','/creator'];
const authPaths = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the token from cookies
  const token = request.cookies.get('session_token')?.value;

  // 2. Verify the Token
  let payload = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload: decoded } = await jwtVerify(token, secret);
      payload = decoded;
    } catch (error) {
      // Token is invalid or expired
      // We leave payload as null
    }
  }

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isProtectedPage = protectedPaths.some((path) => pathname.startsWith(path));

  // SCENARIO 1: User is NOT logged in
  if (!payload) {
    // If trying to access a protected page, kick them to login
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public pages (home, login, signup)
    return NextResponse.next();
  }

  // SCENARIO 2: User IS logged in
  if (payload) {
    const role = payload.role as string;

    // A. If they are on Login/Signup, redirect them to their dashboard
    if (isAuthPage) {
      if (role === 'employer') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      } else if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (role === 'creator') {
        return NextResponse.redirect(new URL('/creator/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // B. Role-Based Access Control (RBAC)
    
    // If a Candidate tries to go to Employer pages
    if (pathname.startsWith('/employer') && role !== 'employer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If an Employer tries to go to Candidate pages (assuming /dashboard is for candidates)
    if (pathname.startsWith('/dashboard') && role !== 'candidate') {
      return NextResponse.redirect(new URL('/employer/dashboard', request.url));
    }

    // If anyone non-admin tries to go to Admin pages
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
      if (pathname.startsWith('/creator') && role !== 'creator') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api (API routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. favicon.ico, images, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)',
  ],
};