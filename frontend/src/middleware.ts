import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 lần thử đăng nhập
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
});

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