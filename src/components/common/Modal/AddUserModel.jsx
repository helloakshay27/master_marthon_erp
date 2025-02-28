import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SingleSelector from "../../base/Select/SingleSelector";
import MultiSelector from "../../base/Select/MultiSelector";
import { baseURL } from "../../../confi/apiDomain";

const AddUsersModal = ({
  show,
  onClose,
  selectedGroup,
  departments,
  onSave,
}) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [loading, setLoading] = useState(false);

  // Fetch Companies
  useEffect(() => {
    if (show) {
      axios
        .get(
          `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((res) => {
          if (Array.isArray(res.data.companies)) {
            setCompanies(
              res.data.companies.map((company) => ({
                value: company.id,
                label: company.company_name,
              }))
            );
          } else {
            setCompanies([]);
          }
        })
        .catch((error) => console.error("Error fetching companies:", error));
    }
  }, [show]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    if (!selectedCompany) {
      alert("Please select a company.");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    const payload = {
      name: groupName.trim(),
      company_id: selectedCompany.value,
      user_ids: selectedUsers.map((user) => user.id), //  Send only user IDs
    };

    try {
      setLoading(true); // Start loader
      let response;
      if (selectedGroup) {
        //  Update existing user group (PATCH request)
        response = await axios.patch(
          `${baseURL}/user_groups/${selectedGroup.id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
          { user_ids: payload.user_ids } //  Only updating user IDs
        );

        alert(" Group updated successfully!");
      } else {
        //  Create new user group (POST request)
        response = await axios.post(
          `${baseURL}/user_groups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
          payload
        );

        alert(" Group created successfully!");
      }

      console.log(" Full API Response:", response.data);

      // const updatedGroups = await axios.get(
      //   `${baseURL}/user_groups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      // );

      // onSave(updatedGroups.data); // Pass updated groups list to parent component

      // // Reset form & notify parent
      // resetForm();
      // onSave({ selectedCompany, selectedDepartments, selectedUsers });
      // fetchUserGroups();
      // onSave(updatedGroups.data);
      onSave();
      onClose();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("❌ Full Error Response:", error.response?.data || error);

      const errorMessage = error.response?.data;

      if (errorMessage === "Name has already been taken") {
        alert(
          "⚠️ Group name is already taken! Please choose a different name."
        );
      } else {
        alert("❌ Failed to save group. Please try again.");
      }
      setLoading(false);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const resetForm = () => {
    setGroupName("");
    setSelectedCompany(null);
    setSelectedDepartments([]);
    setUsers([]); //  Clears fetched users
    setSelectedUsers([]); //  Clears selected users
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Fetch Users Based on Selected Company & Departments
  useEffect(() => {
    if (selectedCompany) {
      setCurrentPage(1);
      const departmentIds = selectedDepartments
        .map((dept) => dept.value)
        .join(",");
      const companyId = selectedCompany.value;

      let url = `${baseURL}/users.json?q[user_sites_pms_site_project_company_id_eq]=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      if (departmentIds) {
        url += `&q[department_id_in]=${departmentIds}`;
      }

      axios
        .get(url)
        .then((res) => {
          const fetchedUsers = res.data.map((user) => ({
            id: user.id,
            name: user.full_name,
          }));

          //  Ensure preselected users remain selected
          setUsers(fetchedUsers);
          setSelectedUsers((prevSelected) =>
            prevSelected.length > 0
              ? [...prevSelected]
              : selectedGroup
              ? fetchedUsers.filter((user) =>
                  selectedGroup.group_members.some(
                    (member) => member.user_id === user.id
                  )
                )
              : []
          );
        })
        .catch((error) => console.error("Error fetching users:", error));
    } else {
      setUsers([]);
    }
  }, [selectedCompany, selectedDepartments]);

  // Fetch Group Data (Preselected Users)
  useEffect(() => {
    if (selectedGroup && show) {
      setSelectedUsers([]);
      axios
        .get(
          `${baseURL}/user_groups/${selectedGroup.id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((res) => {
          const groupData = res.data;

          setGroupName(groupData.name || "");

          if (groupData.company_id && groupData.company) {
            setSelectedCompany({
              value: groupData.company_id,
              label: groupData.company,
            });
          }

          if (
            Array.isArray(groupData.department_id) &&
            groupData.department_name
          ) {
            setSelectedDepartments(
              groupData.department_id.map((id, index) => ({
                value: id,
                label: groupData.department_name.split(", ")[index],
              }))
            );
          } else {
            setSelectedDepartments([]);
          }

          // ✅ Set Preselected Users
          if (Array.isArray(groupData.group_members)) {
            setSelectedUsers(
              groupData.group_members.map((member) => ({
                id: member.user_id,
                name: member.user,
              }))
            );
          } else {
            setSelectedUsers([]);
          }
        })
        .catch((error) =>
          console.error("Error fetching selected group details:", error)
        );
    }
  }, [selectedGroup, show]);

  useEffect(() => {
    if (show && !selectedGroup) {
      resetForm(); // ✅ Ensure form resets when adding a new group
    }
  }, [show, selectedGroup]);

  // Apply search across all pages before pagination
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle selecting and unselecting users
  const handleUserSelection = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.some((u) => u.id === user.id)
        ? prevUsers.filter((u) => u.id !== user.id)
        : [...prevUsers, user]
    );
  };

  // ✅ Select All Users Toggle
  const handleSelectAllUsers = () => {
    const allUsersSelected = selectedUsers.length === filteredUsers.length;

    if (allUsersSelected) {
      // If all are selected, unselect all
      setSelectedUsers([]);
    } else {
      // Select all users (keeping preselected ones in edit mode)
      setSelectedUsers([...filteredUsers]);
    }
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={onClose}
      title="Add Users"
      size="md"
      // footerButtons={[
      //   { label: "Save", onClick: handleSave },
      //   { label: "Cancel", onClick: onClose, className: "purple-btn1 ms-4" },
      // ]}

      footerButtons={[
        {
          label: loading ? (
            <div className="loader-container">
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p>Submitting ...</p>
            </div>
          ) : (
            "Save"
          ),
          onClick: handleSave,
          disabled: loading, // Disable button while loading
        },
        { label: "Cancel", onClick: onClose, className: "purple-btn1 ms-4" },
      ]}
    >
      <Form>
        {/* Company Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>
            Company <span className="text-danger">*</span>
          </Form.Label>
          <SingleSelector
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            placeholder="Select Company"
            isDisabled={!!selectedGroup} // ✅
          />
        </Form.Group>

        {/* Department Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Departments</Form.Label>
          <MultiSelector
            options={departments}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
            placeholder="Select Departments"
          />
        </Form.Group>

        {/* Group Name Input */}
        <Form.Group className="mb-3">
          <Form.Label>
            Group Name
            <span className="text-danger ms-2">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={!!selectedGroup} // ✅ Disable if editingDisable if editing
          />
        </Form.Group>

        {/* Users Section */}
        {selectedCompany && (
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="fw-bold">
                {selectedGroup ? "Preselected & Available Users" : "Add Users"}
              </Form.Label>

              {/* Always show "Select All" button for both new & edit modes */}
              <Button
                variant="outline"
                className="purple-btn2"
                size="sm"
                onClick={handleSelectAllUsers}
              >
                {selectedUsers.length === filteredUsers.length
                  ? "Unselect All"
                  : "Select All"}
              </Button>
            </div>

            {/* Search Bar */}
            <Form.Control
              type="text"
              placeholder="Search users..."
              className="mb-2 mt-2"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* User List */}
            {currentUsers.map((user) => (
              <Form.Check
                key={user.id}
                type="checkbox"
                label={user.name}
                checked={selectedUsers.some((u) => u.id === user.id)}
                onChange={() => handleUserSelection(user)}
              />
            ))}

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </Button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(filteredUsers.length / usersPerPage)}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={
                  currentPage === Math.ceil(filteredUsers.length / usersPerPage)
                }
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </Button>
            </div>
          </Form.Group>
        )}
      </Form>
    </DynamicModalBox>
  );
};

export default AddUsersModal;
