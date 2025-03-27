// @ts-nocheck
import React, { useState, useEffect } from "react";
import Table from "../../base/Table/Table";
import { participantsTabColumns, citiesList } from "../../../constant/data";
import SearchIcon from "../Icon/SearchIcon";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import PopupBox from "../../base/Popup/Popup";
import SelectBox from "../../base/Select/SelectBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../confi/apiDomain";

export default function ParticipantsTab({ data, id }) {
  const [isSelectCheckboxes, setIsSelectCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  // @ts-ignore
  const [tableData, setTableData] = useState([]); // State to hold dynamic data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Default total pages
  const pageSize = 100; // Number of items per page
  const pageRange = 6; // Number of pages to display in the pagination
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [formErrors, setFormErrors] = useState({});


  const validateForm = () => {
    const errors = {};
    if (!inviteForm.name) {
      errors.name = "Name is required";
      toast.error(errors.name);
    }
    if (!inviteForm.email) {
      errors.email = "Email is required";
      toast.error(errors.email);
    }
    if (!inviteForm.mobile) {
      errors.mobile = "Mobile number is required";
      toast.error(errors.mobile);
    }
    return errors;
  };

  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    setInviteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}rfq/events/${id}/invite_vendor?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&name=${inviteForm.name}&mobile=${inviteForm.mobile}&email=${inviteForm.email}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Vendor invited successfully!", {
          autoClose: 1000,
        });
        setInviteModal(false);
        setInviteForm({ name: "", email: "", mobile: "" });
        setFormErrors({});
      } else {
        throw new Error("Failed to invite vendor.");
      }
    } catch (error) {
      console.error("Error inviting vendor:", error);
      toast.error("Failed to invite vendor.", {
        autoClose: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
  };

  useEffect(() => {
    const formattedData = (data?.event_vendors || []).map((vendor, index) => ({
      key: vendor.id,
      serialNumber: index + 1,
      name: vendor.pms_supplier.full_name,
      phone: vendor.pms_supplier.mobile,
      email: vendor.pms_supplier.email,
    }));
    setVendorData(formattedData);
  }, [data, vendorData]);


  useEffect(() => {
    setFilteredData(
      Array.isArray(data?.event_vendors)
        ? data.event_vendors.map((vendor) => {
            const { organization_name, contact_number, email } =
              vendor.pms_supplier || {};
            return {
              name: organization_name || "_",
              phone: contact_number || "_",
              email: email || "_",
            };
          })
        : []
    );
  }, [data]);

  const handleSwitchChange = (e) => {
    const checked = e.target.checked;
    setIsSelectCheckboxes(checked);

    if (!checked) {
      setSelectedRows([]);
    }
  };

  const fetchData = async (page = 1, searchTerm = "", selectedCity = "") => {
    if (searchTerm == "") {
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
      );
      const data = await response.json();

      const vendors = Array.isArray(data.vendors) ? data.vendors : [];

      const formattedData = vendors.map((vendor) => ({
        id: vendor.id,
        name: vendor.full_name || vendor.organization_name || "N/A",
        email: vendor.email || "N/A",
        phone: vendor.contact_number || vendor.mobile || "N/A",
        city: vendor.city_id || "N/A",
        tags: vendor.tags || "N/A",
      }));

      setTableData(formattedData);

      setCurrentPage(page);
      setTotalPages(data?.pagination?.total_pages || 1); // Assume the API returns total pages
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTableData(tableData);
  }, [tableData]);

  useEffect(() => {
    // This useEffect will trigger whenever vendorData is updated
    setVendorData(vendorData);
  }, [vendorData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage);
    }
  };

  const getPageRange = () => {
    // Calculate the starting page for the range
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = startPage + pageRange - 1;

    // Ensure the range doesn't exceed the total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleCheckboxChange = (vendor, isChecked) => {
    if (isChecked) {
      setSelectedRows((prev) => [...prev, vendor]);
    } else {
      setSelectedRows((prev) => prev.filter((item) => item.id !== vendor.id));
    }
  };

  const handleSaveButtonClick = async () => {
    if (isSaving) return; // Prevent multiple submissions
    setIsSaving(true);
    const selectedVendorIds = selectedRows.map((vendor) => vendor.id);

    const url = `${baseURL}rfq/events/${id}/add_vendors?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_supplier_ids=[${selectedVendorIds.join(
      ","
    )}]`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        // Remove selected vendors from tableData
        const updatedTableData = tableData.filter(
          (vendor) =>
            !selectedRows.some(
              (selectedVendor) => selectedVendor.id === vendor.id
            )
        );
        setTableData(updatedTableData);

        // Add selected vendors to vendorData
        const updatedVendorData = [...vendorData, ...selectedRows];
        setVendorData(updatedVendorData);

        setSelectedVendors((prev) => [...prev, ...selectedRows]);
        setVendorModal(false);
        setSelectedRows([]);
        setResetSelectedRows(true);
        toast.success("Vendors added successfully!", {
          autoClose: 1000,
        });
      } else {
        throw new Error("Failed to add vendors.");
      }
    } catch (error) {
      console.error("Error adding vendors:", error);
      toast.error("Failed to add vendors.", {
        autoClose: 1000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isVendorSelected = (vendorId) => {
    return (
      selectedRows.some((vendor) => vendor.id === vendorId) ||
      selectedVendors.some((vendor) => vendor.id === vendorId)
    );
  };

  const handleInviteModalShow = () => {
    setVendorModal(false);
    setInviteModal(true);
  };
  const handleInviteModalClose = () => {
    setInviteModal(false);
  };

  // const tableData = filteredData.map((vendor, index) => ({
  //   srNo: index + 1, // Add serial number
  //   ...vendor,
  // }));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    } else {
      const filteredSuggestions = vendorData.filter(
        (vendor) =>
          vendor.full_name
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          vendor.mobile?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          vendor.email?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);

      setIsSuggestionsVisible(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setIsSuggestionsVisible(false);
    fetchData(1, suggestion.name, selectedCity);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === "") {
      setFilteredTableData(tableData);
    } else {
      const filteredSuggestions = tableData.filter((vendor) =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTableData(filteredSuggestions);
    }
    setIsSuggestionsVisible(true);
  };

  const handleApply = () => {
    setShowPopup(false);
  };

  const handleChange = (selectedOption) => {
    setSelectedTags(selectedOption);
  };
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    fetchData(1, searchTerm, selectedOption);
  };

  return (
    <div
      className="tab-pane fade"
      id="participants"
      role="tabpanel"
      aria-labelledby="participants-tab"
      tabIndex={0}
    >
      <div>
        <div className="d-flex justify-content-between mt-4 align-items-center">
          <div className="input-group">
            <input
              type="search"
              id="searchInput"
              className="w-50 tbl-search"
              placeholder="Type your vendors here"
              style={{ paddingLeft: "10px" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-md btn-default"
                onClick={handleSearchClick}
              >
                <SearchIcon />
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* <div className="d-flex align-items-center">
              <p className="eventList-p1 mb-0 me-2" style={{ textWrap: "nowrap" }}>
                Show only selected vendors
              </p>
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={isSelectCheckboxes}
                  onChange={handleSwitchChange}
                />
              </div>
            </div> */}
            {/* <div>
              <img
                className="me-2"
                src="../erp_event_module/img/Separator-dark.svg"
                alt=""
              />
              asd
            </div> */}
            {/* <select
              name="language"
              className="event-participant-select eventD-forms buyEvent-forms"
              required
            >
              <option value="" disabled selected hidden>
                Filter by city
              </option>
              <option value="indian">xxxxxxxx</option>
              <option value="nepali">xxxxxxxx</option>
              <option value="others">Others</option>
            </select> */}
          </div>
          <button
            className="purple-btn2 mt-3"
            onClick={handleVendorTypeModalShow}
          >
            <span className="material-symbols-outlined align-text-top me-2">
              add
            </span>
            <span>Add</span>
          </button>
        </div>
        {vendorData.length > 0 ? (
          <Table
            columns={participantsTabColumns} // Use columns with serial number
            data={vendorData}
          />
        ) : (
          <div className="text-center mt-4">No data found</div>
        )}
      </div>
      <DynamicModalBox
        size="xl"
        title="All Vendors"
        show={vendorModal}
        onHide={handleVendorTypeModalClose}
        footerButtons={[
          {
            label: "Cancel",
            onClick: handleVendorTypeModalClose,
            props: { className: "purple-btn1" },
          },
          {
            label: "Save",
            onClick: handleSaveButtonClick,
            props: { className: "purple-btn2" },
          },
        ]}
        children={
          <>
            <div className="d-flex justify-content-between align-items-center">
              <div className="input-group w-50 position-relative">
                <input
                  type="search"
                  id="searchInput"
                  className="tbl-search form-control"
                  placeholder="Search Vendors"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSuggestionsVisible(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSuggestionsVisible(false), 200)
                  }
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-md btn-default"
                    onClick={handleSearchClick}
                  >
                    <SearchIcon />
                  </button>
                </div>
                {isSuggestionsVisible && suggestions.length > 0 && (
                  <ul
                    className="suggestions-list position-absolute bg-white border rounded w-100"
                    style={{ zIndex: 1000, top: "100%" }}
                  >
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 cursor-pointer"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="d-flex">
                <button
                  className="purple-btn2 viewBy-main-child2P mb-0"
                  onClick={handleInviteModalShow}
                >
                  <i className="bi bi-person-plus"></i>
                  <span className="ms-2">Invite</span>
                </button>
                {/* <button
                      className="purple-btn2 viewBy-main-child2P mb-0"
                      onClick={() => setShowPopup(true)}
                    >
                      <i className="bi bi-filter"></i>
                      <span className="ms-2">Filters</span>
                    </button> */}

                <PopupBox
                  title="Filter by"
                  show={showPopup}
                  onClose={() => setShowPopup(false)}
                  footerButtons={[
                    {
                      label: "Cancel",
                      onClick: () => setShowPopup(false),
                      props: {
                        className: "purple-btn1",
                      },
                    },
                    {
                      label: "Apply",
                      onClick: handleApply,
                      props: {
                        className: "purple-btn2",
                      },
                    },
                  ]}
                  children={
                    <div>
                      <div style={{ marginBottom: "12px" }}>
                        <SelectBox
                          label={"City"}
                          options={citiesList}
                          defaultValue={""}
                          onChange={handleCityChange}
                          isDisableFirstOption={true}
                        />
                      </div>

                      {/* <div style={{ marginBottom: "12px" }}>
                            <p>Filter By Tags</p>
                            <MultiSelector
                              options={options}
                              value={selectedTags}
                              onChange={handleChange}
                              placeholder={"Filter by tags"}
                            />
                          </div> */}
                      {/* <div className="d-flex align-items-center">
                            <div className="form-check form-switch mt-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                              />
                            </div>
                            <p className="mb-0 pe-1">
                              Show only selected vendors
                            </p>
                          </div> */}
                    </div>
                  }
                />
              </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
              {filteredTableData.length > 0 ? (
                <Table
                  columns={participantsTabColumns}
                  showCheckbox={true}
                  data={filteredTableData.map((vendor, index) => ({
                    ...vendor,
                    srNo: (currentPage - 1) * pageSize + index + 1,
                  }))}
                  handleCheckboxChange={handleCheckboxChange}
                  isRowSelected={isVendorSelected}
                  resetSelectedRows={resetSelectedRows}
                  onResetComplete={() => setResetSelectedRows(false)}
                  onRowSelect={undefined}
                  cellClass="text-start"
                  currentPage={currentPage}
                  pageSize={pageSize}
                />
              ) : (
                <p>No vendors found</p>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center px-1 mt-2">
              <ul className="pagination justify-content-center d-flex ">
                {/* First Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    First
                  </button>
                </li>

                {/* Previous Button */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                </li>

                {/* Dynamic Page Numbers */}
                {getPageRange().map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>

                {/* Last Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </li>
              </ul>
              {/* Display Data */}

              {/* Showing entries count */}
              <div>
                <p>
                  Showing {currentPage * pageSize - (pageSize - 1)} to{" "}
                  {Math.min(currentPage * pageSize, totalPages * pageSize)} of{" "}
                  {totalPages * pageSize} entries
                </p>
              </div>
            </div>
          </>
        }
      />

      <DynamicModalBox
        show={inviteModal}
        onHide={handleInviteModalClose}
        modalType={true}
        title="Invite New Vendor"
        footerButtons={[
          {
            label: "Close",
            onClick: handleInviteModalClose,
            props: {
              className: "purple-btn1",
            },
          },
          {
            label: "Save Changes",
            onClick: handleInviteSubmit,
            props: {
              className: "purple-btn2",
            },
          },
        ]}
        children={
          <>
            <form className="p-2" onSubmit={handleInviteSubmit}>
              <div className="form-group mb-3">
                <label className="po-fontBold">POC - Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="Enter POC Name"
                  value={inviteForm.name}
                  onChange={handleInviteInputChange}
                />
                {formErrors.name && (
                  <small className="text-danger">{formErrors.name}</small>
                )}
              </div>
              <div className="form-group mb-3">
                <label className="po-fontBold">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={inviteForm.email}
                  onChange={handleInviteInputChange}
                />
                {formErrors.email && (
                  <small className="text-danger">{formErrors.email}</small>
                )}
              </div>
              <div className="form-group mb-3">
                <label className="po-fontBold">Phone Number</label>
                <input
                  className="form-control"
                  type="text"
                  name="mobile"
                  inputMode="tel"
                  placeholder="Enter Phone Number"
                  value={inviteForm.mobile}
                  onChange={handleInviteInputChange}
                />
                {formErrors.mobile && (
                  <small className="text-danger">{formErrors.mobile}</small>
                )}
              </div>
            </form>
          </>
        }
      />
      <ToastContainer />
    </div>
  );
}
