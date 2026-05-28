'use client'
import Icon from '@/components/wrappers/Icon'
import { Button, Col, FormControl, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap'
import { useToggle } from 'usehooks-ts'

const AddRoleModal = () => {
  const [show, toggle] = useToggle(false)
  return (
    <>
      <Button variant="success" onClick={toggle}>
        <Icon icon="plus" className="me-1" /> Add New Role
      </Button>

      <Modal show={show} onHide={toggle} className="fade" dialogClassName="modal-lg" id="editRoleModal" tabIndex={-1} aria-labelledby="editRoleModalLabel" aria-hidden="true">
        <ModalHeader>
          <h5 className="modal-title" id="editRoleModalLabel">
            Add New Role
          </h5>
          <button type="button" onClick={toggle} className="btn-close" aria-label="Close" />
        </ModalHeader>
        <form id="editRoleForm">
          <ModalBody>
            <Row className="g-3">
              <Col md={6}>
                <FormLabel htmlFor="editRoleName">Role Name</FormLabel>
                <FormControl type="text" id="editRoleName" placeholder="e.g. Developer, Project Manager" required />
              </Col>
              <Col md={6}>
                <FormLabel htmlFor="editRoleDescription">Description</FormLabel>
                <FormControl type="text" id="editRoleDescription" placeholder="Brief description" required />
              </Col>
              <Col xs={12}>
                <FormLabel htmlFor="editRoleResponsibilities">Key Responsibilities</FormLabel>
                <textarea className="form-control" id="editRoleResponsibilities" rows={4} required placeholder="Enter responsibilities separated by commas or lines" />
                <small className="text-muted">Example: Codebase Maintenance, API Integration, Unit Testing</small>
              </Col>
              <Col md={6}>
                <FormLabel htmlFor="editRoleUsers">Assign Users</FormLabel>
                <FormSelect id="editRoleUsers" multiple>
                  <option value={1}>Leah Kim</option>
                  <option value={2}>David Tran</option>
                  <option value={3}>Michael Brown</option>
                  <option value={4}>Emma Wilson</option>
                </FormSelect>
                <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple users</small>
              </Col>
              <Col md={6}>
                <FormLabel htmlFor="editRoleIcon">Role Icon</FormLabel>
                <FormControl type="text" id="editRoleIcon" placeholder="e.g. ti ti-shield, ti ti-briefcase" />
                <small className="text-muted">Use icon class from your icon library</small>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" type="button" onClick={toggle}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  )
}

export default AddRoleModal
