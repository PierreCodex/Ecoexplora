'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import { useLayoutContext } from '@/context/useLayoutContext'

const ReactApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

type PropsType = {
  type?: ApexChart['type']
  height?: number | string
  width?: number | string
  getOptions: () => ApexOptions
  series: ApexOptions['series']
  className?: string
}

const ApexChart = ({ type, height, width = '100%', getOptions, series, className }: PropsType) => {
  const { skin, theme } = useLayoutContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => getOptions(), [skin, theme, getOptions])

  return <ReactApexCharts key={`${theme}-${skin}`} type={type ?? options.chart?.type} height={height} width={width} options={options} series={series} className={`apex-charts ${className ?? ''}`} />
}

export default ApexChart
