import { Icon as IconifyIcon } from '@iconify/react'
import clsx from 'clsx'
import { Badge } from 'react-bootstrap'
import { RESERVA_STATUS_META, type ReservaStatus } from '@/types/reservation'

interface Props {
  status: ReservaStatus
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
}

const StatusBadge = ({ status, size = 'sm', showIcon = true, className }: Props) => {
  const meta = RESERVA_STATUS_META[status]

  return (
    <Badge
      bg={`${meta.variant}-subtle`}
      text={meta.variant}
      className={clsx(
        'd-inline-flex align-items-center gap-1 fw-semibold',
        size === 'sm' ? 'fs-11' : 'fs-13 px-2 py-1',
        className,
      )}>
      {showIcon && <IconifyIcon icon={meta.icon} className="fs-14" />}
      <span className="text-uppercase">{meta.label}</span>
    </Badge>
  )
}

export default StatusBadge