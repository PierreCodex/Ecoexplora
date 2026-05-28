import { type MenuItemType } from '@/types'

export const menuItems: MenuItemType[] = [
  {
    icon: 'layout-dashboard',
    slug: 'main',
    label: 'Principal',
    isTitle: true,
    children: [
      {
        url: '/dashboard',
        icon: 'layout-dashboard',
        slug: 'pages:dashboard',
        label: 'Dashboard',
      },
    ],
  },
  {
    icon: 'briefcase',
    slug: 'operaciones',
    label: 'Operaciones',
    isTitle: true,
    children: [
      {
        icon: 'clipboard-list',
        slug: 'reservas',
        label: 'Reservas',
        children: [
          {
            url: '/reservas',
            slug: 'pages:reservas-lista',
            label: 'Lista (Kanban)',
          },
          {
            url: '/reservas/calendario',
            slug: 'pages:reservas-calendario',
            label: 'Calendario',
          },
        ],
      },
      {
        url: '/conversaciones',
        icon: 'message-square-text',
        slug: 'pages:conversaciones',
        label: 'Conversaciones',
      },
      {
        url: '/disponibilidad',
        icon: 'calendar-check',
        slug: 'pages:disponibilidad',
        label: 'Disponibilidad',
      },
      {
        url: '/horarios',
        icon: 'clock',
        slug: 'pages:horarios',
        label: 'Horarios de atención',
      },
    ],
  },
  {
    icon: 'leaf',
    slug: 'catalogo',
    label: 'Catálogo',
    isTitle: true,
    children: [
      {
        icon: 'leaf',
        slug: 'catalogo-menu',
        label: 'Catálogo',
        children: [
          {
            url: '/catalogo/tours',
            slug: 'pages:catalogo-tours',
            label: 'Tours',
          },
          {
            url: '/catalogo/destinos',
            slug: 'pages:catalogo-destinos',
            label: 'Destinos',
          },
          {
            url: '/catalogo/politicas',
            slug: 'pages:catalogo-politicas',
            label: 'Políticas',
          },
          {
            url: '/catalogo/faqs',
            slug: 'pages:catalogo-faqs',
            label: 'FAQs',
          },
          {
            url: '/catalogo/empresa',
            slug: 'pages:catalogo-empresa',
            label: 'Info empresa',
          },
        ],
      },
    ],
  },
  {
    icon: 'settings',
    slug: 'sistema',
    label: 'Sistema',
    isTitle: true,
    children: [
      {
        url: '/settings',
        icon: 'settings',
        slug: 'pages:settings',
        label: 'Settings',
      },
      {
        url: '/administradores',
        icon: 'users-round',
        slug: 'pages:administradores',
        label: 'Administradores',
      },
    ],
  },
]