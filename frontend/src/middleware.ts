import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiter } from 'limiter';

// Tạo một Map để lưu trữ limiters cho mỗi IP
const limiters = new Map<string, RateLimiter>();

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
  // Tạo limiter mới nếu chưa có cho IP này
  if (!limiters.has(ip)) {
    // Cho phép 100 requests trong 15 phút
    limiters.set(ip, new RateLimiter({
      tokensPerInterval: 100,
      interval: 15 * 60 * 1000
    }));
  }
  
  const limiter = limiters.get(ip)!;
  const hasToken = await limiter.tryRemoveTokens(1);

  if (!hasToken) {
    return new NextResponse(JSON.stringify({ 
      error: 'Too many requests' 
    }), { 
      status: 429,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return NextResponse.next();
}

// Chỉ định các routes cần áp dụng rate limiting
export const config = {
  matcher: '/api/:path*'
}