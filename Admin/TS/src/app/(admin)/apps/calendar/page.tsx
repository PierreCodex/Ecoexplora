import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import CalendarPage from './components/CalendarPage'

export const metadata: Metadata = { title: 'Calendar' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Calendar" subtitle="Apps" />
      <CalendarPage />
    </>
  )
}

export default Page
