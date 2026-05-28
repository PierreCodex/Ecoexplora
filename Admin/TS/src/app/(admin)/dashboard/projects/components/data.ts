import auFlag from '@/assets/images/flags/au.svg'
import caFlag from '@/assets/images/flags/ca.svg'
import deFlag from '@/assets/images/flags/de.svg'
import frFlag from '@/assets/images/flags/fr.svg'
import gbFlag from '@/assets/images/flags/gb.svg'
import inFlag from '@/assets/images/flags/in.svg'
import jpFlag from '@/assets/images/flags/jp.svg'
import usFlag from '@/assets/images/flags/us.svg'

import user2 from '@/assets/images/users/user-2.jpg'
import user1 from '@/assets/images/users/user-5.jpg'

import { getColor } from '@/utils/helpers'
import { ApexOptions } from 'apexcharts'
import { StaticImageData } from 'next/image'

export type ProgressType = {
  title: string
  value: number
  progress: { label: string; value: number }
  icon: string
  variant: string
}

export const progressData: ProgressType[] = [
  {
    title: 'Active Projects',
    value: 28,
    progress: { label: 'PROGRESS', value: 75 },
    icon: 'tabler:clipboard-list',
    variant: 'info',
  },
  {
    title: 'Tasks Completed',
    value: 124,
    progress: { label: 'TARGET', value: 88 },
    icon: 'tabler:checklist',
    variant: 'success',
  },
  {
    title: 'Pending Tasks',
    value: 16,
    progress: { label: 'DEADLINES', value: 42 },
    icon: 'tabler:clock-hour-4',
    variant: 'warning',
  },
  {
    title: 'Project Managers',
    value: 9,
    progress: { label: 'ALLOCATED', value: 100 },
    icon: 'tabler:user-cog',
    variant: 'danger',
  },
]

function generateRandomData(count: number, min: number, max: number) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

function generateSessionAndPageViewData(count: number) {
  const sessions = generateRandomData(count, 250, 450)

  const pageViews = sessions.map((session) => Math.floor(session * (2 + Math.random() * 0.5)))

  return { sessions, pageViews }
}

export const getProjectOverviewChart = (): ApexOptions => {
  const { sessions, pageViews } = generateSessionAndPageViewData(19)

  return {
    chart: {
      height: 330,
      type: 'area',
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    colors: [getColor('chart-primary'), getColor('secondary')],
    series: [
      {
        name: 'Sessions',
        data: sessions,
      },
      {
        name: 'Page Views',
        data: pageViews,
      },
    ],
    legend: {
      offsetY: 5,
    },
    xaxis: {
      categories: ['', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM', ''],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 6,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val: number, { seriesIndex }: any): string {
          if (seriesIndex === 0) return val + ' Sessions'
          if (seriesIndex === 1) return val + ' Page Views'
          return String(val)
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.2,
        stops: [15, 120, 100],
      },
    },
    grid: {
      borderColor: getColor('chart-border-color'),
      padding: {
        bottom: 0,
      },
    },
  }
}

function generateData(baseval: number, count: number, yrange: { min: number; max: number }) {
  let i = 0
  const series: [number, number, number][] = []

  while (i < count) {
    const x = Math.floor(Math.random() * 750) + 1
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    const z = Math.floor(Math.random() * 60) + 15

    series.push([x, y, z])
    baseval += 86400000
    i++
  }

  return series
}

export const getTaskProgressChart = (): ApexOptions => ({
  chart: {
    height: 330,
    type: 'bubble',
    toolbar: { show: false },
  },
  dataLabels: {
    enabled: false,
  },
  series: [
    {
      name: 'Bubble 1',
      data: generateData(new Date().getTime(), 10, { min: 10, max: 60 }),
    },
    {
      name: 'Bubble 2',
      data: generateData(new Date().getTime(), 10, { min: 10, max: 60 }),
    },
    {
      name: 'Bubble 3',
      data: generateData(new Date().getTime(), 10, { min: 10, max: 60 }),
    },
  ],
  fill: {
    opacity: 0.8,
  },
  colors: [getColor('chart-primary'), getColor('secondary'), getColor('danger')],
  xaxis: {
    tickAmount: 12,
    type: 'category',
  },
  yaxis: {
    max: 70,
  },
  grid: {
    borderColor: getColor('chart-border-color'),
    padding: {
      top: -20,
      right: 0,
      bottom: -5,
      left: 10,
    },
  },
  legend: {
    offsetY: 7,
  },
})

export type ChatUser = {
  name: string
  image: StaticImageData
}

export type ChatMessageType = {
  message: string
  time: string
  user: ChatUser
}

export const chatUser: ChatUser[] = [
  { name: 'Carlos Méndez', image: user1 },
  { name: 'Sophie Laurent', image: user2 },
]

export const chatMessageData: ChatMessageType[] = [
  {
    message: 'Hey! Are you available for a quick call? 📞',
    time: '08:55 am',
    user: chatUser[0],
  },
  {
    message: 'Sure, give me 5 minutes. Just wrapping something up.',
    time: '08:57 am',
    user: chatUser[1],
  },
  {
    message: "Perfect. Let me know when you're ready 👍",
    time: '08:58 am',
    user: chatUser[0],
  },
  {
    message: 'Ready now. Calling you!',
    time: '09:00 am',
    user: chatUser[1],
  },
  {
    message: 'Thanks for your time earlier!',
    time: '09:45 am',
    user: chatUser[0],
  },
  {
    message: 'Of course! It was a productive discussion.',
    time: '09:46 am',
    user: chatUser[1],
  },
  {
    message: 'I’ll send over the updated files by noon.',
    time: '09:50 am',
    user: chatUser[0],
  },
]

export type ProjectType = {
  project: string
  totalTask: number
  completedTask: number
  deadline: string
}

export const projectData: ProjectType[] = [
  {
    project: 'E-Commerce Redesign',
    totalTask: 60,
    completedTask: 45,
    deadline: '15 Aug 2025',
  },
  {
    project: 'Mobile Banking App',
    totalTask: 40,
    completedTask: 28,
    deadline: '20 Sep 2025',
  },
  {
    project: 'Corporate Website',
    totalTask: 25,
    completedTask: 18,
    deadline: '05 Aug 2025',
  },
  {
    project: 'POS System Upgrade',
    totalTask: 50,
    completedTask: 32,
    deadline: '01 Oct 2025',
  },
  {
    project: 'Inventory Management Tool',
    totalTask: 20,
    completedTask: 12,
    deadline: '12 Aug 2025',
  },
]

export type TopCountryType = {
  name: string
  image: string
  project: string
  projectName: string
  change: number
}

export const topCountryData: TopCountryType[] = [
  {
    name: 'India',
    image: inFlag,
    project: '8 Active Projects',
    projectName: 'E-Commerce Revamp',
    change: 3.2,
  },
  {
    name: 'Germany',
    image: deFlag,
    project: '5 Active Projects',
    projectName: 'POS Upgrade',
    change: 1.5,
  },
  {
    name: 'France',
    image: frFlag,
    project: '4 Active Projects',
    projectName: 'Mobile App',
    change: -0.8,
  },
  {
    name: 'United States',
    image: usFlag,
    project: '10 Active Projects',
    projectName: 'SaaS Dashboard',
    change: 2.1,
  },
  {
    name: 'United Kingdom',
    image: gbFlag,
    project: '3 Active Projects',
    projectName: 'CRM System',
    change: -1.2,
  },
  {
    name: 'Canada',
    image: caFlag,
    project: '4 Active Projects',
    projectName: 'Inventory Tool',
    change: 0.9,
  },
  {
    name: 'Japan',
    image: jpFlag,
    project: '6 Active Projects',
    projectName: 'Retail App',
    change: 0.0,
  },
  {
    name: 'Australia',
    image: auFlag,
    project: '2 Active Projects',
    projectName: 'HR Platform',
    change: 1.1,
  },
]
