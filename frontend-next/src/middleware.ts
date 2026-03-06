import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/complaints/my',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/register',
];

// 2FA route: accessible only without auth token (mid-login flow)
const twoFactorRoute = '/two-factor';

// Admin/Staff only routes
const staffRoutes = [
  '/admin',
  '/staff',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block malformed server action requests from bots/crawlers
  // Server actions use the 'Next-Action' header - reject invalid ones
  const nextAction = request.headers.get('Next-Action');
  if (nextAction) {
    // Valid server action IDs are 40-character hex strings
    // Reject malformed action IDs like "x" from bots
    if (!/^[a-f0-9]{40}$/.test(nextAction)) {
      return new NextResponse('Bad Request', { status: 400 });
    }
  }

  // Get auth token from cookies (only auth_token indicates a logged-in user;
  // XSRF-TOKEN is set by Sanctum for all visitors and is not an auth indicator)
  const authToken = request.cookies.get('auth_token')?.value;

  // For API routes, let them pass through
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isStaffRoute = staffRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2FA page: redirect to dashboard if already authenticated,
  // redirect to login if no email param (not coming from login flow)
  if (pathname.startsWith(twoFactorRoute)) {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    const emailParam = request.nextUrl.searchParams.get('email');
    if (!emailParam) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Staff routes need additional role check (handled by the page itself)
  // Middleware can't easily check role from cookie, so we just ensure auth exists
  if (isStaffRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|public|assets).*)',
  ],
};
