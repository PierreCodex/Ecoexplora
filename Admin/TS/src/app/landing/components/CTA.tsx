import ctaImg from '@/assets/images/landing-cta.jpg'
import Link from 'next/link'

const CTA = () => {
  return (
    <section>
      <div className="section-cta position-relative card-side-img overflow-hidden" style={{ backgroundImage: `url(${ctaImg.src})` }}>
        <div className="card-img-overlay d-flex align-items-center flex-column gap-3 justify-content-center auth-overlay text-center">
          <h3 className="text-white fs-24 mb-0 fw-bold">Power Your Project with Our Premium Admin Dashboard</h3>
          <p className="text-white text-opacity-75 fs-md">
            Launch faster with a sleek, responsive, and developer-focused admin panel. <br /> Get started today — free 14-day trial, no credit card required.
          </p>
          <Link href="" className="btn btn-light rounded-pill">
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
