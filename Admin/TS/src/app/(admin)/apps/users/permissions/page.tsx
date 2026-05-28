import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import PermissionTable from './components/PermissionTable'

export const metadata: Metadata = { title: 'User Permissions' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Permissions" subtitle="Users" />

      <Row className="justify-content-center">
        <Col xs={12}>
          <PermissionTable />
        </Col>
      </Row>
    </>
  )
}

export default Page
