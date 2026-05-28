'use client'

import ApexChart from '@/components/wrappers/ApexChart'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { CardBody, CardTitle } from 'react-bootstrap'
import type { DashboardStats } from './types'

interface Props {
  data: DashboardStats['reservas_por_dia']
}

const ReservasAnalytics = ({ data }: Props) => {
  const series = [
    {
      name: 'Reservas',
      data: data.map((d) => d.count),
    },
  ]

  const categories = data.map((d) => dayjs(d.date).format('DD MMM'))

  const getOptions = (): ApexOptions => ({
    chart: {
      type: 'area',
      height: 330,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories,
      labels: { rotate: -45, style: { fontSize: '11px' } },
    },
    yaxis: {
      labels: { formatter: (v) => Math.round(v).toString() },
    },
    grid: { strokeDashArray: 4 },
    tooltip: {
      x: { format: 'dd MMM' },
      y: { formatter: (v) => `${v} reservas` },
    },
    colors: ['#7367f0'],
  })

  return (
    <CardBody className="px-4 py-3">
      <div className="d-flex justify-content-between mb-3">
        <CardTitle as="h4">Reservas por día</CardTitle>
        <small className="text-muted">Últimos {data.length} días</small>
      </div>
      <ApexChart type="area" height={330} series={series} getOptions={getOptions} />
    </CardBody>
  )
}

export default ReservasAnalytics