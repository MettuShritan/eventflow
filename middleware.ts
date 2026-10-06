import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = ['/dashboard', '/profile', '/register/', '/admin', '/conductor'];

function protectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/login' || pathname === '/register') return NextResponse.next();
  if (!protectedPath(pathname)) return NextResponse.next();
  if (!request.cookies.get('eventflow_session')?.value) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/login', '/register', '/register/:path*', '/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/conductor/:path*'] };
