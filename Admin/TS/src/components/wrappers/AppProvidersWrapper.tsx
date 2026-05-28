'use client'
import { LayoutProvider } from '@/context/useLayoutContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const PUBLIC_PATH_PREFIXES = ['/auth', '/landing']

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === '/') return true
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

const AppProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const { isAuthenticated, sessionReady } = useAuth()
  useEffect(() => {
    if (sessionReady && !isAuthenticated && !isPublicPath(pathname)) {
      router.replace('/auth/sign-in')
    }
  }, [sessionReady, isAuthenticated, router, pathname])

  return (
    <LayoutProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </LayoutProvider>
  )
}

export default AppProvidersWrapper