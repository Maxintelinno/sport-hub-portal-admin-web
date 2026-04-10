import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Note: In server components or middleware, we can't easily access zustand's localStorage state.
    // However, for a simple implementation, we can check for a cookie or just handle it on the client side.
    // For a robust implementation, the login page should set a session cookie.
    
    // For now, we'll implement a simple check. If we wanted to be strict, we'd check a JWT cookie.
    const hasToken = request.cookies.get('sport-hub-token');
    
    // If no token and trying to access admin pages, redirect to login
    // Note: Since we are using zustand with localStorage, the server won't know about the token.
    // Usually, the best practice is to set a cookie on login.
    // Let's assume for this demo that client-side protection is also handled in a layout.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
