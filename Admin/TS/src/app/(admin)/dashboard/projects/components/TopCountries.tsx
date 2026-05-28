import ComponentCard from '@/components/cards/ComponentCard'
import { Icon as IconifyIcon } from '@iconify/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { topCountryData } from './data'

const TopCountries = () => {
  return (
    <>
      <ComponentCard title="Top Projects by Country" isCloseable isRefreshable isCollapsible>
        {topCountryData.map((item, idx) => (
          <div className="d-flex align-items-center gap-2 mb-3" key={idx}>
            <Image src={item.image} alt={item.name} className="avatar-xxs rounded" />
            <h5 className="mb-0 fw-medium">
              <Link href="" className="link-reset">
                {item.name}
              </Link>
              <small className="text-muted ms-1">{item.project}</small>
            </h5>
            <div className="ms-auto">
              <div className="d-flex align-items-center gap-3 text-end">
                <p className="mb-0 fw-medium">{item.projectName}</p>
                <p className={clsx('badge badge-label fs-xxs mb-0', item.change < 0 ? 'badge-soft-danger' : item.change > 0 ? 'badge-soft-success' : 'badge-soft-warning')}>
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="text-center mt-4">
          <Link href="" className="link-reset text-decoration-underline fw-semibold link-offset-3">
            View all Projects <IconifyIcon icon="tabler:briefcase" />
          </Link>
        </div>
      </ComponentCard>
    </>
  )
}

export default TopCountries
