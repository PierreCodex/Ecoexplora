'use client'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useAuth } from '@/hooks/useAuth'
import HorizontalLayout from '@/layouts/HorizontalLayout'
import VerticalLayout from '@/layouts/VerticalLayout'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { orientation } = useLayoutContext()
  const { isAuthenticated, sessionReady } = useAuth()

  if (!sessionReady || !isAuthenticated) {
    return null
  }

  return (
    <>
      {orientation === 'vertical' && <VerticalLayout>{children}</VerticalLayout>}
      {orientation === 'horizontal' && <HorizontalLayout>{children}</HorizontalLayout>}
    </>
  )
}

export default MainLayout