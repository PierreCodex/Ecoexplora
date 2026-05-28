import PageBreadcrumb from '@/components/PageBreadcrumb'
import type { Metadata } from 'next'
import FileManagerPage from './components/FileManagerPage'

export const metadata: Metadata = { title: 'File Manager' }
const Page = () => {
  return (
    <>
      <PageBreadcrumb title="File Manager" subtitle="Apps" />
      <FileManagerPage />
    </>
  )
}

export default Page
