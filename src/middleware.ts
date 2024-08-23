import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"  // the middlewear are available to all the routes
import { getToken } from "next-auth/jwt" // getting Tokens
 //todo middleware configuration
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({req:request})
  const url =request.nextUrl 
// if the user has the token than route him to the dashboard
  if(token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname === '/' 
   )){
    return NextResponse.redirect(new URL('/dashboard', request.url))
   }
  //  if the user does not have the token he will route to the signin
   if(!token && (url.pathname.startsWith('/dashboard'))){
    url.pathname.startsWith('/sign-in')
   }
  return NextResponse.next() //if no condition runs than the custom route will run
}
 
// middleware are activate on matchers
export const config = {
  matcher:[ '/sign-in','/','/sign-up','/dashboard/:path*','/verify/:path*']
}