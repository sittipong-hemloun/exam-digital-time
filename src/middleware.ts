import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Get forwarded protocol from IIS proxy
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')

  // Log forwarded headers for debugging (remove in production)
  if (forwardedProto || forwardedHost) {
    console.log('IIS Forwarded Headers:', {
      proto: forwardedProto,
      host: forwardedHost,
      pathname: request.nextUrl.pathname,
    })
  }

  // Pass through all requests with IIS headers intact
  // Server Actions will automatically handle the forwarded headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
