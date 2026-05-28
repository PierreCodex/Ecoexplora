'use client'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import dynamic from 'next/dynamic'
import { Spinner } from 'react-bootstrap'

const ReservasCalendar = dynamic(() => import('./components/ReservasCalendar'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-3 mb-0">Cargando calendario…</p>
    </div>
  ),
})

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Calendario" subtitle="Reservas" />
      <ReservasCalendar />
    </>
  )
}

export default Page