'use client'
// creating a provider to make it available to all the components
import { SessionProvider } from "next-auth/react"
export default function AuthProvider({
  children,
  
}:{children:React.ReactNode}) {
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}