import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import TrafficSources from './components/ActiveProjects'
import Chat from './components/Chat'
import OverviewCard from './components/OverviewCard'
import ProjectOverview from './components/ProjectOverview'
import TaskProgress from './components/TaskProgress'
import TopCountries from './components/TopCountries'

export const metadata: Metadata = { title: 'Project' }

const Page = () => {
  return (
    <>
      <PageBreadcrumb title="Projects" subtitle="Dashboards" />

      <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1 g-3 align-items-center">
        <OverviewCard />
      </Row>

      <Row>
        <Col xxl={6}>
          <ProjectOverview />
        </Col>

        <Col xxl={6}>
          <TaskProgress />
        </Col>
      </Row>

      <Row>
        <Col xl={4}>
          <Chat />
        </Col>
        <Col xxl={4} lg={6}>
          <TrafficSources />
        </Col>
        <Col xxl={4} lg={6}>
          <TopCountries />
        </Col>
      </Row>
    </>
  )
}

export default Page
