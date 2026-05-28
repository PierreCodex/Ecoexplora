import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import ChatPage from './components/ChatPage'

export const metadata: Metadata = { title: 'Chat' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Chat" subtitle="Apps" />
      <ChatPage />
    </>
  )
}

export default Page
