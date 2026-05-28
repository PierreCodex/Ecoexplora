'use client'

import { Icon as IconifyIcon } from '@iconify/react'
import { useLayoutContext } from '@/context/useLayoutContext'
import useScrollEvent from '@/hooks/useScrollEvent'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Container, Nav, Navbar, NavbarCollapse, NavbarToggle, NavLink } from 'react-bootstrap'

const navItems = [
  { label: 'Inicio', href: '#home' },
  { label: 'Cómo funciona', href: '#demo' },
  { label: 'Tours', href: '#services' },
  { label: 'Características', href: '#features' },
  { label: 'Contacto', href: '#contact' },
]

export default function Header() {
  const { theme, updateSettings } = useLayoutContext()

  const toggleTheme = () => {
    if (theme === 'dark') {
      updateSettings({ theme: 'light' })
      return
    }
    updateSettings({ theme: 'dark' })
    return
  }
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { scrollY } = useScrollEvent()

  return (
    <>
      <header>
        <Navbar expand="lg" className={`py-2 sticky-top ${scrollY > 100 && 'top-scroll-up top-fixed'}`} id="landing-navbar">
          <Container>
            <div className="auth-brand mb-0 d-flex align-items-center gap-2">
              <a href="/" className="d-flex align-items-center gap-2 text-decoration-none">
                <div className="bg-success rounded-circle p-1">
                  <IconifyIcon icon="tabler:leaf" className="text-white" width={20} />
                </div>
                <span className="fw-bold fs-5 text-body">EcoExplora</span>
              </a>
            </div>

            <NavbarToggle aria-controls="navbarSupportedContent" onClick={() => setIsCollapsed(!isCollapsed)} />
            <NavbarCollapse in={!isCollapsed} id="navbarSupportedContent">
              <Nav className="fw-semibold gap-3 fs-sm mx-auto mt-2 mt-lg-0">
                {navItems.map((item, idx) => (
                  <li className="nav-item" key={idx}>
                    <NavLink className="nav-link" href={item.href}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </Nav>
              <div className="d-flex align-items-center gap-2">
                <Button variant="link" className="btn-icon fw-semibold nav-link" onClick={toggleTheme}>
                  <IconifyIcon icon="tabler:sun-moon" width={20} />
                </Button>
                <Link 
                  href="https://wa.me/51964261277?text=Hola%20EcoExplora" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm"
                >
                  <IconifyIcon icon="tabler:brand-whatsapp" width={16} className="me-1" />
                  Reservar
                </Link>
              </div>
            </NavbarCollapse>
          </Container>
        </Navbar>
      </header>
    </>
  )
}
