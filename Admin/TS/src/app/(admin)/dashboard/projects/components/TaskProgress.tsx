'use client'

import ApexChart from '@/components/wrappers/ApexChart'
import Icon from '@/components/wrappers/Icon'
import { Card, CardBody, CardHeader, CardTitle, Nav, NavItem, NavLink } from 'react-bootstrap'
import { getTaskProgressChart } from './data'

const TaskProgress = () => {
  return (
    <Card>
      <CardHeader className="border-dashed card-tabs d-flex align-items-center">
        <div className="flex-grow-1">
          <CardTitle as="h4" className="card-title">
            Task Progress
          </CardTitle>
        </div>
        <Nav as="ul" className="nav-tabs nav-justified card-header-tabs nav-bordered">
          <NavItem>
            <NavLink href="#today-ct" data-bs-toggle="tab" aria-expanded="false">
              <Icon icon="home" className="d-md-none d-block"></Icon>
              <span className="d-none d-md-block">Today</span>
            </NavLink>
          </NavItem>
          <NavItem className="nav-item">
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
          <ApexChart getOptions={getTaskProgressChart} series={getTaskProgressChart().series} type="bubble" height={330} />
        </div>
      </CardBody>
    </Card>
  )
}

export default TaskProgress
