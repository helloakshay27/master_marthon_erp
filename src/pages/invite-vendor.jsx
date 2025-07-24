import React, { useState, useEffect } from 'react';
import SingleSelector from '../components/base/Select/SingleSelector';
import { baseURL } from "../confi/apiDomain";
import axios from 'axios';

const gstinApplicableOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const InviteVendor = () => {
  const [inviteVendorData, setInviteVendorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gstinApplicable: '',
    gstNumber: '',
    vendorOrganization: '',
    vendorType: '',
    organizationType: '',
    natureOfBusiness: '',
    panNumber: '',
    department: '',
  });

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);

   const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
  useEffect(() => {
    // Fetch organization type list from API
    fetch(`${baseURL}/rfq/events/type_of_organizations_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.type_of_organizations)) {
          setOrganizationTypeOptions(
            data.type_of_organizations.map((org) => ({
              value: org.value,
              label: org.name,
            }))
          );
        }
      });
    // Fetch department list from API
    fetch(`${baseURL}/rfq/events/department_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.list)) {
          setDepartmentOptions(
            data.list.map((dept) => ({
              value: dept.value,
              label: dept.name,
            }))
          );
        }
      });
    // Fetch vendor type list from API
    fetch(`${baseURL}/rfq/events/supplier_type_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.supplier_type)) {
          setVendorTypeOptions(
            data.supplier_type.map((type) => ({
              value: type.value,
              label: type.name,
            }))
          );
        }
      });
    // Fetch nature of business list from API
    fetch(`${baseURL}/rfq/events/nature_of_business_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.list)) {
          setNatureOfBusinessOptions(
            data.list.map((item) => ({
              value: item.value,
              label: item.name,
            }))
          );
        }
      });
  }, []);

  const handleInviteVendorChange = (e) => {
    const { name, value } = e.target;
    setInviteVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrganizationTypeChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ ...prev, organizationType: selectedOption ? selectedOption.value : '' }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ ...prev, department: selectedOption ? selectedOption.value : '' }));
  };

  const handleVendorTypeChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ ...prev, vendorType: selectedOption ? selectedOption.value : '' }));
  };

  const handleNatureOfBusinessChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ ...prev, natureOfBusiness: selectedOption ? selectedOption.value : '' }));
  };

  const handleInviteVendor = async (e) => {
    e.preventDefault();
    // Build payload as per API requirements
    const payload = {
      supplier_type_id: inviteVendorData.vendorType,
      department_id: inviteVendorData.department,
      nature_of_business_id: inviteVendorData.natureOfBusiness,
      type_of_organization_id: inviteVendorData.organizationType,
      first_name: inviteVendorData.firstName,
      last_name: inviteVendorData.lastName,
      gstin_applicable: inviteVendorData.gstinApplicable,
      gstin: inviteVendorData.gstNumber,
      name: inviteVendorData.lastName, // as per user instruction
      email: inviteVendorData.email,
      mobile: inviteVendorData.mobile,
      pan_number: inviteVendorData.panNumber,
    };
    try {
      const response = await axios.post(
        `${baseURL}rfq/events/3/invite_vendor?token=${token}&add_vendor=true`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert('Vendor invited successfully!');
        // Optionally reset form here
      } else {
        alert('Failed to invite vendor: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to invite vendor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInviteModalClose = (e) => {
    e.preventDefault();
    setInviteVendorData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      gstinApplicable: '',
      gstNumber: '',
      vendorOrganization: '',
      vendorType: '',
      organizationType: '',
      natureOfBusiness: '',
      panNumber: '',
      department: '',
    });
  };

  return (
    <div className="website-content overflow-auto">
      <div className="module-data-section p-4">
        <div className="card card-default mt-5 p-2b-4" id="invite-vendor-card">
          <div className="card-header3">
            <h3 className="card-title">Invite New Vendor</h3>
          </div>
          <div className="card-body">
            <form className="p-2" onSubmit={handleInviteVendor}>
              <div className="row">
                {/* Vendor Organization Name */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Vendor Organization Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="vendorOrganization"
                      placeholder="Enter Vendor Organization Name"
                      value={inviteVendorData.vendorOrganization}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* First Name */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      First Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="firstName"
                      placeholder="Enter First Name"
                      value={inviteVendorData.firstName}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* Last Name */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Last Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="lastName"
                      placeholder="Enter Last Name"
                      value={inviteVendorData.lastName}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Email <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Enter Email Address"
                      value={inviteVendorData.email}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* Phone Number */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Phone Number <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="mobile"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      onKeyDown={(e) => {
                        const invalidChars = ['e', 'E', '+', '-', '.', ','];
                        if (
                          invalidChars.includes(e.key) ||
                          (isNaN(Number(e.key)) &&
                            e.key !== 'Backspace' &&
                            e.key !== 'Delete' &&
                            e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight' &&
                            e.key !== 'Tab')
                        ) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter Phone Number"
                      value={inviteVendorData.mobile}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* GSTIN Applicable */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      GSTIN Applicable <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-control"
                      name="gstinApplicable"
                      value={inviteVendorData.gstinApplicable}
                      onChange={handleInviteVendorChange}
                      required
                    >
                      <option value="">Select</option>
                      {gstinApplicableOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* GSTIN - only show if GSTIN Applicable is 'yes' */}
                {inviteVendorData.gstinApplicable === 'yes' && (
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="po-fontBold">
                        GSTIN <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="gstNumber"
                        placeholder="Enter GSTIN"
                        value={inviteVendorData.gstNumber}
                        onChange={handleInviteVendorChange}
                        required
                      />
                    </div>
                  </div>
                )}
                {/* Vendor Type (SingleSelector) */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Vendor Type
                    </label>
                    <SingleSelector
                      options={vendorTypeOptions}
                      value={vendorTypeOptions.find(opt => opt.value === inviteVendorData.vendorType) || null}
                      onChange={handleVendorTypeChange}
                      placeholder="Select Vendor Type"
                    />
                  </div>
                </div>
                {/* Organization Type (SingleSelector) */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Organization Type
                    </label>
                    <SingleSelector
                      options={organizationTypeOptions}
                      value={organizationTypeOptions.find(opt => opt.value === inviteVendorData.organizationType) || null}
                      onChange={handleOrganizationTypeChange}
                      placeholder="Select Organization Type"
                    />
                  </div>
                </div>
                {/* Nature of Business (SingleSelector) */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Nature of Business
                    </label>
                    <SingleSelector
                      options={natureOfBusinessOptions}
                      value={natureOfBusinessOptions.find(opt => opt.value === inviteVendorData.natureOfBusiness) || null}
                      onChange={handleNatureOfBusinessChange}
                      placeholder="Select Nature Of Business"
                    />
                  </div>
                </div>
                {/* PAN No. */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      PAN No. <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name="panNumber"
                      placeholder="Enter PAN Number"
                      value={inviteVendorData.panNumber}
                      onChange={handleInviteVendorChange}
                      required
                    />
                  </div>
                </div>
                {/* Department (SingleSelector) */}
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label className="po-fontBold">
                      Department <span style={{ color: 'red' }}>*</span>
                    </label>
                    <SingleSelector
                      options={departmentOptions}
                      value={departmentOptions.find(opt => opt.value === inviteVendorData.department) || null}
                      onChange={handleDepartmentChange}
                      placeholder="Select Department"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2 gap-2">
                <button className="purple-btn2" onClick={handleInviteModalClose} type="button">
                  Close
                </button>
                <button className="purple-btn2" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteVendor;
