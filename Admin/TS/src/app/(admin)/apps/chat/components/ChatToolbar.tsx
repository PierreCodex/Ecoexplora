'use client'
import user3 from '@/assets/images/users/user-3.jpg'
import Icon from '@/components/wrappers/Icon'
import Image from 'next/image'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap'
import { useToggle } from 'usehooks-ts'

const ChatToolbar = () => {
  const [showVideo, toggleVideo] = useToggle()
  const [showAudio, toggleAudio] = useToggle()
  return (
    <>
      <div className="d-flex align-items-center gap-1">
        <button className="btn btn-default btn-icon" onClick={toggleVideo}>
          <Icon icon="video" className="fs-lg" />
        </button>

        <button className="btn btn-default btn-icon" onClick={toggleAudio}>
          <Icon icon="phone-call" className="fs-lg" />
        </button>

        <Dropdown align="end">
          <DropdownToggle as="button" className="btn btn-default btn-icon drop-arrow-none">
            <Icon icon="ellipsis-vertical" className="fs-lg" />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem>
              <Icon icon="user" className="me-2" /> View Profile
            </DropdownItem>
            <DropdownItem>
              <Icon icon="bell-off" className="me-2" /> Mute Notifications
            </DropdownItem>
            <DropdownItem>
              <Icon icon="trash-2" className="me-2" /> Delete Chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Modal show={showVideo} onHide={toggleVideo} centered size="xl" contentClassName="bg-dark text-white">
        <ModalHeader closeButton className="border-0" closeVariant="white">
          <ModalTitle as="h5" id="videoCallModalLabel">
            Starting Video Call
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div className="mb-4">
            <Image src={user3} className="rounded-circle shadow" alt="User Photo" width={150} height={150} />
          </div>

          <h3 className="fw-semibold mb-1">Alex Johnson</h3>
          <p className="text-muted mb-4">Connecting to call...</p>

          <div className="d-flex gap-2">
            <Button variant="light" className="d-flex align-items-center gap-2">
              <Icon icon="video" />
              Camera On
            </Button>
            <Button variant="light" className="d-flex align-items-center gap-2">
              <Icon icon="mic" />
              Mic On
            </Button>
            <Button variant="danger" className="d-flex align-items-center gap-2" onClick={toggleVideo}>
              <Icon icon="phone-call" />
              End Call
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="border-0 justify-content-center">
          <span className="text-muted fst-italic">Make sure your devices are connected before starting the call</span>
        </ModalFooter>
      </Modal>

      <Modal show={showAudio} onHide={toggleAudio} centered contentClassName="bg-dark text-white">
        <ModalHeader closeButton closeVariant="white" className="border-0">
          <ModalTitle as="h5" id="audioCallModalLabel">
            Starting Audio Call
          </ModalTitle>
        </ModalHeader>

        <ModalBody className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div className="mb-4">
            <Image src={user3} className="rounded-circle shadow" alt="User Photo" width={120} height={120} />
          </div>

          <h4 className="fw-semibold mb-1">Alex Johnson</h4>
          <p className="text-muted mb-4">Calling...</p>

          <div className="d-flex gap-2">
            <Button variant="light" className="d-flex align-items-center gap-2">
              <Icon icon="mic" />
              Mic On
            </Button>
            <Button variant="light" className="d-flex align-items-center gap-2">
              <Icon icon="volume-2" />
              Speaker On
            </Button>
            <Button variant="danger" className="d-flex align-items-center gap-2" onClick={toggleAudio}>
              <Icon icon="phone-call" />
              End Call
            </Button>
          </div>
        </ModalBody>

        <ModalFooter className="border-0 justify-content-center">
          <span className="text-muted fst-italic">Ensure your microphone is working properly</span>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ChatToolbar
