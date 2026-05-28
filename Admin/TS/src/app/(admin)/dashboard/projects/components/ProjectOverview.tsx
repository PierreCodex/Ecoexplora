'use client'

import ApexChart from '@/components/wrappers/ApexChart'
import Icon from '@/components/wrappers/Icon'
import { Card, CardBody, CardHeader, CardTitle, Nav, NavItem, NavLink } from 'react-bootstrap'
import { getProjectOverviewChart } from './data'

const ProjectOverview = () => {
  return (
    <Card>
      <CardHeader className="border-dashed card-tabs d-flex align-items-center">
        <div className="flex-grow-1">
          <CardTitle as="h4">Project Overview</CardTitle>
        </div>
        <Nav as="ul" className="nav nav-tabs nav-justified card-header-tabs nav-bordered">
          <NavItem>
            <NavLink href="#today-ct" data-bs-toggle="tab" aria-expanded="false">
              <Icon icon="home" className="d-md-none d-block"></Icon>
              <span className="d-none d-md-block">Today</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#monthly-ct" data-bs-toggle="tab" aria-expanded="true" className="active">
              <Icon icon="circle-user-round" className="d-md-none d-block"></Icon>
              <span className="d-none d-md-block">Monthly</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#annual-ct" data-bs-toggle="tab" aria-expanded="false">
              <Icon icon="settings" className="d-md-none d-block"></Icon>
              <span className="d-none d-md-block">Annual</span>
            </NavLink>
          </NavItem>
        </Nav>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ApexChart getOptions={getProjectOverviewChart} series={getProjectOverviewChart().series} height={330} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ProjectOverview
