import authcard from '@/assets/images/auth-card-bg.svg'
import AuthLogo from '@/components/AuthLogo'
import Icon from '@/components/wrappers/Icon'
import { currentYear, META_DATA } from '@/config/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import { Button, Card, CardBody, Col, FormControl, Row } from 'react-bootstrap'
import CountdownTimer from './components/CountdownTimer'

export const metadata: Metadata = { title: 'Coming Soon!' }

const Page = () => {
  return (
    <>
      <div className="auth-box p-0 w-100">
        <Row className="w-100 g-0">
          <Col xl={6} xxl={4}>
            <Card className="border-0 mb-0">
              <div className="position-absolute top-0 end-0" style={{ width: 180 }}>
                <Image src={authcard} className="auth-card-bg-img" alt="auth-card-bg" />
              </div>

              <CardBody className="min-vh-100 d-flex flex-column justify-content-center">
                <div className="auth-brand mb-0 text-center">
                  <AuthLogo />
                </div>
                <div className="mt-auto">
                  <div className="p-2 text-center">
                    <h3 className="fw-bold my-2">Something Exciting is Coming</h3>
                    <p className="text-muted mb-0">We&apos;re working hard to bring you something amazing. Stay tuned!</p>
                    <CountdownTimer />
                    <div className="error-text-alt fs-xl">Stay tunned!</div>
                    <div className="app-search w-xl-75 mx-auto input-group mt-3 rounded-pill">
                      <FormControl type="text" className="py-2" placeholder="Enter email..." />
                      <Icon icon="mail" className="app-search-icon text-muted" />
                      <Button variant="secondary" type="button">
                        Notify me!
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-muted mt-auto mb-0">
                  © {currentYear} {META_DATA.name} — by <span className="fw-bold">{META_DATA.author}</span>
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <div className="h-100 position-relative card-side-img rounded-0 overflow-hidden">
              <div className="p-4 card-img-overlay auth-overlay d-flex align-items-end justify-content-center" />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Page
