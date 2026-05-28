import Icon from '@/components/wrappers/Icon'
import { Metadata } from 'next'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import MemberRoleCard from './components/MemberRoleCard'
import UserTable from './components/UserTable'

export const metadata: Metadata = { title: 'Role Details' }

const Page = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="d-flex align-items-sm-center flex-sm-row flex-column my-3">
            <div className="flex-grow-1">
              <h4 className="fs-xl mb-1">Role Details</h4>
              <p className="text-muted mb-0">Define and manage roles to streamline operations and ensure secure access control.</p>
            </div>
            <div className="text-end">
              <Link href="" className="btn btn-success">
                <Icon icon="plus" className="me-1" /> Add New Role
              </Link>
            </div>
          </div>
          <Row>
            <Col md={4} lg={3}>
              <MemberRoleCard />
            </Col>
            <Col md={8} lg={9}>
              <UserTable />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Page
