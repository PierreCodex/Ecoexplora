'use client'
import User1 from '@/assets/images/users/user-1.jpg'
import Icon from '@/components/wrappers/Icon'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const UserDropdown = () => {
  const { user, logout } = useAuth()

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Administrador'

  return (
    <div id="simple-user-dropdown" className="topbar-item nav-user">
      <Dropdown>
        <DropdownToggle className="topbar-link drop-arrow-none" type="button">
          <Image src={User1} width={32} className="rounded-circle me-lg-2 d-flex" alt="user-image" />
          <div className="d-lg-flex align-items-center gap-1 d-none">
            <h5 className="my-0">{displayName}</h5>
            <Icon icon="chevron-down" className="align-middle" />
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
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
  )
}

export default UserDropdown