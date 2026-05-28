import PageBreadcrumb from '@/components/PageBreadcrumb'
import Icon from '@/components/wrappers/Icon'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Badge, Card, CardBody, Col, FormSelect, Row } from 'react-bootstrap'
import { contactData, ContactType } from './data'

export const metadata: Metadata = { title: 'Contacts' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Contacts" subtitle="Users" />
      <Row>
        <Col lg={12}>
          <form className="card border p-3">
            <Row className="gap-3">
              <Col lg={4}>
                <div className="app-search">
                  <input type="text" className="form-control" placeholder="Search contact name..." />
                  <Icon icon="search" className="app-search-icon text-muted" />
                </div>
              </Col>
              <Col>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="me-2 fw-semibold">Filter By:</span>

                  <div className="app-search">
                    <FormSelect className="form-control my-1 my-md-0">
                      <option>Designation</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Content Strategist">Content Strategist</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </FormSelect>
                    <Icon icon="user-check" className="app-search-icon text-muted" />
                  </div>

                  <div className="app-search">
                    <FormSelect className="form-control my-1 my-md-0">
                      <option>Location</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                      <option value="Canada">Canada</option>
                    </FormSelect>
                    <Icon icon="map-pin" className="app-search-icon text-muted" />
                  </div>

                  <div className="app-search">
                    <FormSelect className="form-control my-1 my-md-0">
                      <option>Department</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                    </FormSelect>
                    <Icon icon="layers" className="app-search-icon text-muted" />
                  </div>
                  <button type="submit" className="btn btn-secondary">
                    Apply
                  </button>
                  <div role="group" aria-label="Layout toggle button group" className="ms-auto flex-shrink-0">
                    <input type="radio" className="btn-check " name="btnradio" id="btnradio1" defaultChecked />
                    <label className="btn btn-soft-primary btn-icon me-1" htmlFor="btnradio1">
                      <Icon icon="layout-grid" className="fs-lg" />
                    </label>
                    <input type="radio" className="btn-check" name="btnradio" id="btnradio2" />
                    <label className="btn btn-soft-primary btn-icon" htmlFor="btnradio2">
                      <Icon icon="list-check" className="fs-lg" />
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
      <Row>
        {contactData.map((contact, idx) => (
          <Col xxl={3} md={6} key={idx}>
            <ContactCard contact={contact} />
          </Col>
        ))}
      </Row>
      <ul className="pagination pagination-rounded pagination-boxed justify-content-center">
        <li className="page-item">
          <Link className="page-link" href="" aria-label="Previous">
            <span aria-hidden="true">«</span>
          </Link>
        </li>
        <li className="page-item active">
          <Link className="page-link" href="">
            1
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="">
            2
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="">
            3
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="">
            4
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="">
            5
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link" href="" aria-label="Next">
            <span aria-hidden="true">»</span>
          </Link>
        </li>
      </ul>
    </>
  )
}
export default Page

const ContactCard = ({ contact }: { contact: ContactType }) => {
  const { flag, updatedTime, role, user, badge, stats, website } = contact
  return (
    <Card>
      <CardBody className="text-center">
        <Image src={user.image} alt="avatar" className="rounded-circle" width={72} height={72} />
        <h5 className="mb-0 mt-2 d-flex align-items-center justify-content-center">
          <Link href="/apps/users/profile" className="link-reset">
            {user.name}
          </Link>
          <Image src={flag} alt="UK" className="ms-1 rounded" height={16} />
        </h5>
        <span className="text-muted fs-xs">{role}</span>
        <br />
        <Badge bg={badge.variant} className="my-1">
          {badge.label}
        </Badge>
        <br />
        <span className="text-muted">
          {user.username} |{' '}
          <Link href="" className="text-decoration-none text-danger">
            {website}
          </Link>
        </span>
        <div className="mt-3">
          <button className="btn btn-primary btn-sm me-1">Message</button>
          &nbsp;
          <button className="btn btn-outline-secondary btn-sm">Follow</button>
        </div>
        <hr className="my-3 border-dashed" />
        <div className="d-flex justify-content-between text-center">
          <div>
            <h5 className="mb-0">{stats.posts}</h5>
            <span className="text-muted">Posts</span>
          </div>
          <div>
            <h5 className="mb-0">{stats.followers}</h5>
            <span className="text-muted">Followers</span>
          </div>
          <div>
            <h5 className="mb-0">{stats.followings}</h5>
            <span className="text-muted">Followings</span>
          </div>
        </div>
        <hr className="mt-3 border-dashed" />
        <div className="text-end text-muted fs-xs">
          <Icon icon="refresh-ccw" className="me-1" /> Updated {updatedTime}
        </div>
      </CardBody>
    </Card>
  )
}
