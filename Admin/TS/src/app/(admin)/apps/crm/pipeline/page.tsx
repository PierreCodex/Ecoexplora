import PageBreadcrumb from '@/components/PageBreadcrumb'
import type { Metadata } from 'next'
import PipelinePage from './components/PipelinePage'

export const metadata: Metadata = { title: 'CRM Pipeline' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Pipeline" subtitle="CRM" />
      <PipelinePage />
    </>
  )
}

export default Page
