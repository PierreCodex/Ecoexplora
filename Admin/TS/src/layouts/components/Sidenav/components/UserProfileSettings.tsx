'use client'
import bgPattern from '@/assets/images/user-bg-pattern.svg'
import user1 from '@/assets/images/users/user-1.jpg'
import Icon from '@/components/wrappers/Icon'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const UserProfileSettings = () => {
  const { user, logout } = useAuth()

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Administrador'
  const role = (user?.app_metadata?.role as string | undefined) ?? user?.user_metadata?.role ?? 'Admin'

  return (
    <div id="user-profile-settings" className="sidenav-user" style={{ background: `url(${bgPattern.src})` }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Link href="/settings" className="link-reset">
            <Image src={user1} alt="user-image" className="rounded-circle mb-2 avatar-md" />
            <span className="sidenav-user-name fw-bold">{displayName}</span>
            <span className="fs-12 fw-semibold text-capitalize" data-lang="user-role">
              {role}
            </span>
          </Link>
        </div>
        <div>
          <Dropdown align="end">
            <DropdownToggle as="a" href="#" className="drop-arrow-none link-reset sidenav-user-set-icon" aria-haspopup="false" aria-expanded={false}>
              <Icon icon="settings" className="fs-24 align-middle ms-1" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownHeader className="noti-title">
                <h6 className="text-overflow m-0">¡Hola de nuevo!</h6>
                {user?.email && <small className="text-muted">{user.email}</small>}
              </DropdownHeader>
              <DropdownItem href="/settings">
                <Icon icon="bolt" className="me-1 fs-lg align-middle" />
                <span className="align-middle">Settings</span>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                as="button"
                type="button"
                onClick={() => {
                  void logout()
                }}
                className="text-danger fw-semibold">
                <Icon icon="log-out" className="me-1 fs-lg align-middle" />
                <span className="align-middle">Cerrar sesión</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default UserProfileSettings