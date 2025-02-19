import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SingleSelector from "../../base/Select/SingleSelector";
import MultiSelector from "../../base/Select/MultiSelector";

const AddUsersModal = ({
  show,
  onClose,
  companies,
  departments,
  users,
  onSave,
}) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Handle user selection (toggle selection)
  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Select/Deselect All Users
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all
    }
  };

  // Handle Save
  const handleSave = () => {
    console.log("Selected Users:", selectedUsers);
    onSave({ selectedCompany, selectedDepartments, selectedUsers });
    onClose(); // Close modal
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={onClose}
      title="Add Users"
      size="md"
      footerButtons={[
        { label: "Save", onClick: handleSave },
        { label: "Cancel", onClick: onClose },
      ]}
    >
      <Form>
        {/* Company Dropdown (Single Selector) */}
        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <SingleSelector
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            placeholder="Select Company"
          />
        </Form.Group>

        {/* Department Dropdown (Multi-Selector) */}
        <Form.Group className="mb-3">
          <Form.Label>Departments</Form.Label>
          <MultiSelector
            options={departments}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
            placeholder="Select Departments"
          />
        </Form.Group>

        {/* Input Field */}
        <Form.Group className="mb-3">
          <Form.Label>Enter Group Name</Form.Label>
          <Form.Control
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Group Name"
          />
        </Form.Group>

        {/* Users List (Only show if company is selected) */}
        {selectedCompany && (
          <>
            {/* Add Users Label with "Select All" Button */}
            <Row className="align-items-center mb-2">
              <Col>
                <Form.Label>
                  <strong>Add Users</strong>
                </Form.Label>
              </Col>
              <Col className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleSelectAllUsers}
                >
                  {selectedUsers.length === users.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </Col>
            </Row>

            {/* User List with Checkboxes */}
            <Form.Group>
              {users.map((user) => (
                <Form.Check
                  key={user.id}
                  type="checkbox"
                  label={user.name}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                />
              ))}
            </Form.Group>
          </>
        )}
      </Form>
    </DynamicModalBox>
  );
};

export default AddUsersModal;
