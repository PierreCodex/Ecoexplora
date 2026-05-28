'use client'

import logo from '@/assets/images/logole1.png'
import Icon from '@/components/wrappers/Icon'
import { useLayoutContext } from '@/context/useLayoutContext'
import useScrollEvent from '@/hooks/useScrollEvent'
import { Icon as IconifyIcon } from '@iconify/react'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Container, Nav, Navbar, NavbarCollapse, NavbarToggle, NavLink } from 'react-bootstrap'
import { buildWaLink, ECOEXPLORA } from '../config'
import { navItems } from '../data'

export default function Header() {
  const { theme, updateSettings } = useLayoutContext()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { scrollY } = useScrollEvent()

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <header>
      <Navbar expand="lg" className={`py-2 sticky-top ${scrollY > 100 && 'top-scroll-up top-fixed'}`} id="landing-navbar">
        <Container>
          <div className="auth-brand mb-0">
            <a href="/" className="logo-dark d-flex align-items-center gap-2">
              <img src={logo.src} alt={ECOEXPLORA.brand} height={24} />
            </a>
          </div>

          <NavbarToggle aria-controls="navbarSupportedContent" onClick={() => setIsCollapsed(!isCollapsed)} />
          <NavbarCollapse in={!isCollapsed} id="navbarSupportedContent">
            <Nav className="text-uppercase fw-bold gap-2 fs-sm mx-auto mt-2 mt-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.href}>
                  <NavLink className="nav-link fs-xs" href={item.href}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </Nav>
            <div className="d-flex align-items-center gap-2">
              <Button variant="link" className="btn-icon fw-semibold nav-link" onClick={toggleTheme}>
                <Icon icon="contrast" className="fs-22" />
              </Button>
              <Link
                href={buildWaLink('¡Hola! Quiero información sobre los tours.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-success d-inline-flex align-items-center gap-1">
                <IconifyIcon icon="tabler:brand-whatsapp" className="fs-base" />
                <span className="d-none d-sm-inline">Chatea con el bot</span>
              </Link>
              <Link href="/auth/sign-in" className="btn btn-sm btn-light">
                Ingresar al panel
              </Link>
            </div>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  )
}