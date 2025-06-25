// middleware.js
import { NextResponse } from 'next/server'
import { decode } from 'next-auth/jwt'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
  runtime: 'edge'
}

export async function middleware(request) {
  try {
    const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                       request.cookies.get('__Secure-next-auth.session-token')?.value

    const { pathname } = request.nextUrl
    const protectedPaths = ['/dashboard', '/admin']
    const authPaths = ['/login', '/register']

    // Skip middleware for non-protected paths
    if (!protectedPaths.some(path => pathname.startsWith(path)) {
      return NextResponse.next()
    }

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const secret = process.env.NEXTAUTH_SECRET
    const decoded = await decode({
      token: sessionToken,
      secret
    })

    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin route protection
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}