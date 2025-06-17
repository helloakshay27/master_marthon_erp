import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { MultiSelector, SelectBox } from "../components";
import Select from "react-select/base";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useState, useEffect } from "react";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useParams } from "react-router-dom"; // Import useParams
import { baseURL } from "../confi/apiDomain";

const VendorApprovalEdit = () => {
  const navigate = useNavigate(); //  navigate
  const { id } = useParams(); // Get ID from URL
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] }, // Initial level remains open
  ]);
  const [selectedKYCType, setSelectedKYCType] = useState([]);

  const [users, setUsers] = useState([]);
  const kycTypes = [
    { value: " General Rekyc", label: "General Re-KYC" },
    { value: "MSME Rekyc", label: "MSME Re-KYC" },
    { value: "E-invoicing Rekyc", label: "E-invoicing Re-KYC" },
    { value: "Bank Rekyc", label: "Bank Rekyc Re-KYC" },
    { value: "GSTIN Rekyc", label: "GSTIN Rekyc" },
  ];

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: null,
    approval_type: "",
  });
  // Fetch Companies and Departments
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [departmentRes, userRes] = await Promise.all([
          axios.get(
            `${baseURL}/pms/departments.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
          axios.get(
            `${baseURL}/users.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
        ]);

        console.log("Raw Department Data:", departmentRes.data);
        console.log("Raw User Data:", userRes.data);

        // Map departments directly from array of objects
        const departmentOptions = departmentRes.data.map((dept) => ({
          value: dept.id,
          label: dept.name,
        }));

        console.log("Processed Departments:", departmentOptions);
        setDepartments(departmentOptions);

        // Map users directly from array of objects
        const userOptions = userRes.data.map((user) => ({
          value: user.id,
          label: user.full_name,
        }));

        console.log("Processed Users:", userOptions);
        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setDepartments([]);
        setUsers([]);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/pms/admin/invoice_approvals/${id}/edit.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        setFormData({
          department_id: data.invoice_approval.department_id,
          approval_type: data.invoice_approval.approval_function,
        });

        // Find the matching KYC Type
        const matchedKYCType = kycTypes.find(
          (kyc) => kyc.value === data.invoice_approval.approval_function
        );

        console.log(
          "Fetched KYC Type:",
          data.invoice_approval.approval_function
        );
        console.log("Matched KYC Type:", matchedKYCType);

        if (matchedKYCType) {
          setSelectedKYCType(matchedKYCType);
        } else {
          setSelectedKYCType(null); // Reset if not found
        }

        setApprovalLevels(
          data.invoice_approval_levels.map((level) => ({
            order: level.order ? level.order.toString() : "",
            name: level.name || "",
            users: level.escalate_to_users.map((userId) => ({
              value: userId,
              label: "",
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    fetchApprovalData();
  }, [id]);

  useEffect(() => {
    if (
      users.length > 0 &&
      approvalLevels.some((level) =>
        level.users.some((user) => user.label === "")
      )
    ) {
      setApprovalLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          users: level.users.map((user) => ({
            value: user.value,
            label:
              users.find((u) => u.value === user.value)?.label || user.label, // Keep existing label if already set
          })),
        }))
      );
    }
  }, [users, approvalLevels]); // ✅ Update when users or approvalLevels change

  useEffect(() => {
    if (departments.length > 0 && formData.department_id) {
      const matchedDepartment = departments.find(
        (dept) => dept.value === formData.department_id
      );
      if (matchedDepartment) {
        setSelectedDepartment(matchedDepartment);
      }
    }
  }, [departments, formData.department_id]); // Dependencies: Run when these change

  // Runs when `id` or `users` change

  // Add Approval Level
  // const handleAddLevel = () => {
  //   setApprovalLevels([...approvalLevels, { order: "", name: "", users: [] }]);
  // };

  // // Remove Approval Level
  // const handleRemoveLevel = (index) => {
  //   setApprovalLevels(approvalLevels.filter((_, i) => i !== index));
  // };

  // Handle Input Change
  const handleInputChange = (index, field, value) => {
    const updatedLevels = [...approvalLevels];
    updatedLevels[index][field] = value;
    setApprovalLevels(updatedLevels);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      department_id: selectedDepartment
        ? selectedDepartment.value
        : prev.department_id,
      approval_type: selectedKYCType
        ? selectedKYCType.value
        : prev.approval_type,
    }));
  }, [selectedDepartment, selectedKYCType]);

  // const handleCompanyChange = (selected) => {
  //   console.log("Selected Company:", selected);
  //   setSelectedCompany(selected);
  // };

  const handleDepartmentChange = (selected) => {
    console.log("Selected Department:", selected);
    setSelectedDepartment(selected);
  };

  const handleKYCTypeChange = (selected) => {
    console.log("Selected KYC Types:", selected);
    setSelectedKYCType(selected); // Store all selected values
  };

  const handleUpdate = async () => {
    const payload = {
      invoice_approval: {
        // Static or Dynamic
        approval_type: "vendor_rekyc",
        approval_function: selectedKYCType ? selectedKYCType.value : null,

        // company_id: selectedCompany ? selectedCompany.value : null,

        department_id: selectedDepartment ? selectedDepartment.value : null,

        invoice_approval_levels_attributes: approvalLevels.map((level) => ({
          name: level.name,
          order: Number(level.order),
          active: true,
          escalate_to_users: level.users.map((user) => user.value),
        })),
      },
    };

    console.log("Final Payload for Update:", payload);

    if (
      // !payload.invoice_approval.company_id ||
      !payload.invoice_approval.department_id ||
      !payload.invoice_approval.approval_type
    ) {
      alert("Please select  Department, and KYC Type.");
      return;
    }

    for (let i = 0; i < approvalLevels.length; i++) {
      const level = approvalLevels[i];

      if (!level.order || level.order.toString().trim() === "") {
        alert(`Please enter an order `);
        return;
      }

      if (!level.name.trim()) {
        alert(`Please enter a name `);
        return;
      }

      if (!level.users || level.users.length === 0) {
        alert(`Please select at least one user`);
        return;
      }
    }

    // try {
    //   const response = await axios.put(
    //     `https://vendors.lockated.com/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
    //     payload
    //   );

    //   console.log("API Response:", response.data);
    //   alert("Approval Matrix Updated Successfully!");

    //   navigate("/approval-list");
    // } catch (error) {
    //   console.error("Error updating approval matrix:", error);
    //   alert("Failed to update approval matrix.");
    // }

    try {
      const response = await axios.put(
        `${baseURL}/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      );

      console.log("API Response:", response.data);
      alert("Approval Matrix Updated Successfully!");

      navigate("/approval-list");
    } catch (error) {
      console.error("Error updating approval matrix:", error);

      if (error.response?.data?.error) {
        alert(error.response.data.error[0]); // Show the exact error message
      } else {
        alert("Failed to update approval matrix.");
      }
    }
  };

  return (
    <div>
      <div
        className="website-content"
        data-select2-id="select2-data-192-0lua"
        style={{ overflowY: "auto" }}
      >
        <footer className="footer"></footer>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {/* Dynamic tabs will be inserted here */}
        </ul>
        <div
          className="tab-content"
          id="myTabContent"
          data-select2-id="select2-data-myTabContent"
        >
          <link
            rel="stylesheet"
            href="/assets/mail_room.debug-e60240217d99fc10e84cb08195762eaefdebfa65453cfc4907927bd997f6f9e5.css"
          />
          <div className="ms-3 mt-3" data-select2-id="select2-data-191-fles">
            <p>Setup &gt; Re-Kyc Approvals</p>
            <h5 className="mt-2">INVOICE APPROVAL</h5>
            <div
              className="container-fluid p-3"
              data-select2-id="select2-data-190-iiua"
            >
              <div className="row">
                <div>
                  <input
                    type="hidden"
                    name="authenticity_token"
                    defaultValue="M7lSHxX9HuyNx5l_jkvdgnhAmhQ7gh3Vnv_wr6fKS30l24vqwHbNTnaUsp_NJu9LeGEhKm1hyNeP7XjH6dt6pA"
                    autoComplete="off"
                  />
                  <input
                    type="hidden"
                    name="subaction"
                    id="subaction"
                    autoComplete="off"
                  />
                  <div
                    className="row my-4 align-items-center"
                    data-select2-id="select2-data-188-ekbm"
                  >
                    <div
                      className="col-md-12 "
                      data-select2-id="select2-data-187-y2ya"
                    >
                      <div className="card mt-3 pb-4">
                        <CollapsibleCard title="Configure Details">
                          <div>
                            <div className="row my-2 align-items-end">
                              {/* Event Title */}
                              {/* <div className="col-md-3">
                                <label htmlFor="event-title-select">
                                  Select Comapny
                                </label>

                                <SingleSelector
                                  options={companies}
                                  value={selectedCompany}
                                  onChange={handleCompanyChange}
                                  placeholder="select comapny"
                                />
                              </div> */}

                              {/* Status */}
                              <div className="col-md-3">
                                <label htmlFor="status-select">
                                  Department
                                </label>
                                <SingleSelector
                                  id="status-select"
                                  options={departments}
                                  value={selectedDepartment}
                                  onChange={handleDepartmentChange} //
                                  placeholder="Select Department"
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  KYC Type
                                </label>
                                <SingleSelector
                                  id="module-select"
                                  options={kycTypes}
                                  value={selectedKYCType} // Store selected KYC type
                                  onChange={handleKYCTypeChange}
                                  isClearable
                                />
                              </div>
                            </div>
                          </div>
                        </CollapsibleCard>
                        <div className="card mt-3 pb-4 ms-3 ">
                          <div className="card-header mb-3 ">
                            <h3 className="card-title">Approval Levels</h3>
                          </div>

                          {approvalLevels.map((level, index) => (
                            <div
                              // key={index}
                              className="px-4"
                              style={{
                                display: "flex",
                                columnGap: 20,
                                alignItems: "center",
                              }}
                            >
                              <fieldset className="border">
                                <legend className="float-none">
                                  Order{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group order"
                                  value={level.order}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "order",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter Order"
                                  required
                                />
                              </fieldset>
                              <fieldset className="border ms-4">
                                <legend className="float-none">
                                  Name of Level{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group name"
                                  value={level.name}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter Name of Level"
                                  required
                                  type="text"
                                />
                              </fieldset>
                              <fieldset
                                className="user-list ms-3 mb-3"
                                style={{ width: "15%" }} //
                              >
                                <legend className="float-none mb-2">
                                  Users{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <MultiSelector
                                  options={users}
                                  value={level.users}
                                  onChange={(selected) =>
                                    handleInputChange(index, "users", selected)
                                  }
                                  placeholder="Select Users"
                                />
                              </fieldset>
                              {/* <button
                                className="remove-item ms-4 mb-3 px-2 rounded purple-btn1"
                                style={{ padding: "1px 3px" }}
                                onClick={() => handleRemoveLevel(index)}
                              >
                                x
                              </button> */}
                            </div>
                          ))}
                          <div className="ms-3 mt-2">
                            {/* <button
                              className=" purple-btn1 submit-btn"
                              onClick={handleAddLevel}
                            >
                              +
                            </button> */}
                          </div>
                        </div>
                        <div></div>
                      </div>

                      {/* </div> */}
                      <div style={{ textAlign: "center" }}>
                        <button
                          className="purple-btn1 submit-btn"
                          onClick={handleUpdate}
                        >
                          update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dynamic tab content will be inserted here */}
        </div>
      </div>
    </div>
  );
};

export default VendorApprovalEdit;
