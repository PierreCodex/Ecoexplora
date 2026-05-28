import { CountUp } from '@/components/wrappers/CountUp'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'
import { stats1, stats2 } from './data'

const Features = () => {
  return (
    <section className="section-custom bg-light bg-opacity-30 border-top border-light border-bottom" id="features">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">🚀 Designed for Performance & Scalability</span>
            <h2 className="mt-3 fw-bold mb-5">
              Discover the Core <span className="text-primary">Features</span> of UBold
            </h2>
          </Col>
        </Row>
        <Row className="align-items-center pb-5">
          <Col lg={6} xl={5} className="py-3">
            <div className="text-center">
              <Image src="https://illustrations.popsy.co/violet/paper-plane.svg" className="rounded-3 img-fluid" width={530} height={530} alt="saas-img" />
              <small className="fst-italic">
                Image by:{' '}
                <Link href="https://popsy.co/illustrations" target="_blank">
                  Popsy.co
                </Link>
              </small>
            </div>
          </Col>
          <Col lg={5} className="ms-auto py-3">
            <h3 className="mb-3 fs-xl lh-base">Powering Smart Admin Experiences with UBold</h3>
            <p className="mb-2 lead">UBold is a feature-rich, high-performance admin dashboard template built for modern web applications and enterprise-grade interfaces.</p>
            <p className="text-muted fs-sm mb-4">Streamline your workflow, monitor key metrics, and manage data seamlessly with intuitive UI and powerful components.</p>
            <Link href="" className="btn btn-primary mb-4">
              Launch Dashboard
            </Link>
            <div className="d-flex flex-wrap justify-content-between gap-4 mt-4">
              {stats1.map((state, idx) => (
                <div key={idx}>
                  <h3 className="mb-2">
                    <CountUp start={0} end={state.value} decimals={Number.isInteger(state.value) ? 0 : 2} duration={1} />
                    <span className="text-primary">{state.suffix}</span>
                  </h3>
                  <p className="text-muted mb-0">{state.label}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="align-items-center py-5">
          <Col lg={5} className="py-3 order-2 order-lg-1">
            <h2 className="mb-3 fs-xl lh-base">Control Everything from One Unified Dashboard</h2>
            <p className="mb-2 lead">UBold empowers admins with a smart, responsive interface to manage users, analytics, content, and workflows effortlessly.</p>
            <p className="text-muted fs-sm mb-4">Track performance, automate tasks, and make data-driven decisions — all from a secure and scalable admin panel.</p>
            <Link href="/" className="btn btn-primary mb-4">
              Explore UBold Admin
            </Link>
            <div className="d-flex flex-wrap gap-4 mt-4">
              {stats2.map((state, idx) => (
                <div key={idx}>
                  <h3 className="mb-2">
                    <CountUp start={0} end={state.value} decimals={Number.isInteger(state.value) ? 0 : 2} duration={1} />
                    <span className="text-primary">{state.suffix}</span>
                  </h3>
                  <p className="text-muted mb-0">{state.label}</p>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={6} xl={5} className="ms-auto py-3 order-1 order-lg-2">
            <div className="text-center">
              <Image src="https://illustrations.popsy.co/violet/success.svg" className="rounded-3 img-fluid" width={530} height={530} alt="saas-img" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Features
