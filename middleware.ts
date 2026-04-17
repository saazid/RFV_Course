import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin credentials for validation
const ADMIN_EMAIL = 'mdsaifullah77469@gmail.com';
const VALID_TOKENS = new Set<string>();

export function middleware(request: NextRequest) {
  // Check if the request is for admin dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // Check for admin token in cookies
    const tokenCookie = request.cookies.get('admin_token');
    
    if (!tokenCookie) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Validate token format and authenticity
    try {
      const token = tokenCookie.value;
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email, timestamp] = decoded.split(':');
      
      // Check if token has correct email and is not expired (less than 24 hours)
      const tokenTime = parseInt(timestamp);
      const currentTime = Date.now();
      const hoursDiff = (currentTime - tokenTime) / (1000 * 60 * 60);
      
      if (email !== ADMIN_EMAIL || hoursDiff >= 24 || isNaN(hoursDiff)) {
        // Redirect to login if token is invalid or expired
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (error) {
      // Invalid token format, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
