import Icon from '@/components/wrappers/Icon'
import { Card, CardBody, CardFooter, Col, Container, Row } from 'react-bootstrap'
import { pricingData, PricingPlanType } from './data'

const PricingCard = ({ plan }: { plan: PricingPlanType }) => {
  return (
    <Card className={`h-100 my-4 my-lg-0 ${plan.isPopular ? 'text-bg-primary' : 'border bg-light bg-opacity-40 border-dashed shadow-none'}`}>
      <CardBody className="p-lg-4 pb-0 text-center">
        <h3 className="fw-bold mb-1">{plan.name}</h3>
        <p className={`mb-0 ${plan.isPopular ? 'text-white-50' : 'text-muted'}`}>{plan.description}</p>
        <div className="my-4">
          <h1 className="display-6 fw-bold mb-0">${plan.price}</h1>
          <small className={`d-block fs-base ${plan.isPopular ? 'text-white-50' : 'text-muted'}`}>Billed monthly</small>

          <small className={`d-block ${plan.isPopular ? 'text-white-50' : 'text-muted'}`}>{plan.title}</small>
        </div>

        <ul className="list-unstyled text-start fs-sm mb-0">
          {plan.features.map((feature, index) => (
            <li key={index} className="mb-2">
              {feature.included ? <Icon icon="check" className="me-2 fs-5 text-success" /> : <Icon icon="x" className="me-2 fs-5 text-danger" />}
              {feature.title}
            </li>
          ))}
        </ul>
      </CardBody>

      <CardFooter className="bg-transparent border-0 px-5 pb-4">
        <button className={`btn w-100 py-2 fw-semibold rounded-pill ${plan.btnClass}`}>Choose {plan.name.split(' ')[0]}</button>
      </CardFooter>
    </Card>
  )
}

const PricingPlans = () => {
  return (
    <section className="section-custom" id="plans">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted rounded-3 d-inline-block">💰 Simple & Transparent Plans</span>
            <h2 className="mt-3 fw-bold mb-5">
              Choose the <span className="text-primary">Pricing</span> Plan That Fits Your Needs
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xxl={11}>
            <Row>
              {pricingData.map((plan, idx) => (
                <Col lg={4} key={idx} className={`${plan.isPopular && 'my-4 my-lg-0'}`}>
                  <PricingCard plan={plan} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default PricingPlans
