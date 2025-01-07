import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/admin/default', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
}; 