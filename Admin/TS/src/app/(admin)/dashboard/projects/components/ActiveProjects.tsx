import ComponentCard from '@/components/cards/ComponentCard'
import { CountUp } from '@/components/wrappers/CountUp'
import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { projectData } from './data'

const ActiveProjects = () => {
  return (
    <>
      <ComponentCard title="Active Projects Overview" isCloseable isRefreshable isCollapsible>
        <Row className="mb-2">
          <Col lg>
            <h3 className="mb-2 fw-bold">
              <CountUp start={0} end={4852} duration={1} />
            </h3>
            <p className="mb-2 fw-semibold text-muted">Projects in Progress</p>
          </Col>
          <Col lg="auto" className="align-self-center">
            <ul className="list-unstyled mb-0 lh-lg">
              <li>
                <IconifyIcon icon="tabler:caret-right-filled" className="fs-lg align-middle text-primary me-1" />
                <span className="text-muted">Web Development</span>
              </li>
              <li>
                <IconifyIcon icon="tabler:caret-right-filled" className="fs-lg align-middle text-success me-1" />
                <span className="text-muted">Mobile Apps</span>
              </li>
              <li>
                <IconifyIcon icon="tabler:caret-right-filled" className="fs-lg align-middle text-info me-1" />
                <span className="text-muted">UI/UX Design</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="progress mb-3" style={{ height: 10 }}>
          <div className="progress-bar" role="progressbar" style={{ width: '40%' }} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} />
          <div className="progress-bar bg-success" role="progressbar" style={{ width: '35%' }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100} />
          <div className="progress-bar bg-info" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-custom table-nowrap table-hover table-centered mb-0">
            <thead className="bg-light align-middle bg-opacity-25 thead-sm">
              <tr className="text-uppercase fs-xxs">
                <th className="text-muted">Project</th>
                <th className="text-muted text-end">Tasks Completed</th>
                <th className="text-muted text-end">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-decoration-underline">{item.project}</td>
                  <td className="text-end">
                    {item.completedTask}/{item.totalTask}
                  </td>
                  <td className="text-end">{item.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-3">
          <Link href="" className="link-reset text-decoration-underline fw-semibold link-offset-3">
            View all Projects <IconifyIcon icon="tabler:link" />
          </Link>
        </div>
      </ComponentCard>
    </>
  )
}

export default ActiveProjects
