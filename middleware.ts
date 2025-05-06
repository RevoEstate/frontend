import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axiosInstance from '@/lib/axiosInstance';
import env from '@/env';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/'].includes(
    path
  );

  // Get session token from cookies
  const token = request.cookies.get('better-auth.session_token')?.value;

  // Redirect unauthenticated users from protected paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Handle authenticated users
  if (token) {
    try {
      // Fetch user data to check role
      const response = await axiosInstance.get('/v1/auth/current-user', {
        headers: {
          Cookie: `better-auth.session_token=${token}`,
        },
      });

      const user = response.data.user;

      // Redirect authenticated users from public paths to role-specific routes
      if (isPublicPath) {
        switch (user?.role) {
          case 'systemAdmin':
          case 'support':
            return NextResponse.redirect(new URL('/dashboard', request.url));
          case 'agent':
            return NextResponse.redirect(new URL('/realestate', request.url));
          default:
            return NextResponse.redirect(new URL('/', request.url));
        }
      }

      // Protect dashboard routes for systemAdmin and admin
      if (path.startsWith('/dashboard')) {
        const allowedRoles = ['systemAdmin', 'admin'];
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
          // Redirect to role-specific route for unauthorized users
          switch (user?.role) {
            case 'support':
              return NextResponse.redirect(new URL('/dashboard', request.url)); // Support can access dashboard
            case 'agent':
              return NextResponse.redirect(new URL('/realestate', request.url));
            default:
              return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        }
      }

      // Protect realestate routes for agent
      if (path.startsWith('/realestate')) {
        if (!user || !user.role || user.role !== 'agent') {
          // Redirect to role-specific route
          switch (user?.role) {
            case 'systemAdmin':
            case 'support':
              return NextResponse.redirect(new URL('/dashboard', request.url));
            default:
              return NextResponse.redirect(new URL('/', request.url));
          }
        }
      }
    } catch (err) {
      // Handle API errors (e.g., invalid token)
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/realestate/:path*',
    '/profile/:path*',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
  ],
};
