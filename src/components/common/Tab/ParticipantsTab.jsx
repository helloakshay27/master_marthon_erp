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
import { se } from "date-fns/locale";

export default function ParticipantsTab({ id }) {
  const [isSelectCheckboxes, setIsSelectCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);
  const [selectedCity, setSelectedCity] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 100;
  const pageRange = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [currentParticipantPage, setCurrentParticipantPage] = useState(1);
  const [totalParticipantPages, setTotalParticipantPages] = useState(1);
  const participantPageSize = 10; // or as per backend pagination
  const options = [
    { value: "BUILDING MATERIAL", label: "BUILDING MATERIAL" },
    { value: "MIVAN MA", label: "MIVAN MA" },
    { value: "MIVAN MATERIAL", label: "MIVAN MATERIAL" },
  ]; // Example tag options

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    mobile: "",
    gstNumber: "",
    panNumber: "",
    company: "",
    organization: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!inviteForm.name) {
      errors.name = "Name is required";
      toast.error(errors.name);
    }
    if (!inviteForm.email || !emailRegex.test(inviteForm.email)) {
      errors.email = "Valid email is required";
      toast.error(errors.email);
    }
    if (!inviteForm.mobile || !mobileRegex.test(inviteForm.mobile)) {
      errors.mobile = "Valid mobile number is required";
      toast.error(errors.mobile);
    }
    if (inviteForm.gstNumber && !gstRegex.test(inviteForm.gstNumber)) {
      errors.gstNumber = "Invalid GST number format";
      toast.error(errors.gstNumber);
    }
    if (inviteForm.panNumber && !panRegex.test(inviteForm.panNumber)) {
      errors.panNumber = "Invalid PAN number format";
      toast.error(errors.panNumber);
    }
    if (!inviteForm.organization) {
      errors.organization = "Organization Name is required";
      toast.error(errors.organization);
    }
    return errors;
  };

  const handleParticipantPageChange = (page) => {
    if (page >= 1 && page <= totalParticipantPages) {
      setCurrentParticipantPage(page);
    }
  };

  const getPageParticipantRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentParticipantPage - 2);
    let end = Math.min(totalParticipantPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "gstNumber" || name === "panNumber"
        ? value.replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
        : value;

    const capitalizedValue =
      name === "gstNumber" || name === "panNumber"
        ? sanitizedValue.toUpperCase() // Convert to uppercase
        : sanitizedValue;
    setInviteForm((prev) => ({ ...prev, [name]: capitalizedValue }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true); // Start loader
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      setIsLoading(false); // Stop loader
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}rfq/events/${id}/invite_vendor?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&name=${inviteForm.name}&mobile=${inviteForm.mobile}&email=${inviteForm.email}&add_vendor=true&organization_name=${inviteForm?.organization}&company_id=${inviteForm.company}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const newVendor = await response.json();

        const formattedVendor = {
          key: newVendor.id,
          serialNumber: vendorData.length + 1,
          name: newVendor.full_name,
          phone: newVendor.mobile,
          email: newVendor.email,
          organisation: newVendor.organization_name || "N/A",
        };

        setVendorData((prev) => [...prev, formattedVendor]);

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
      setIsLoading(false); // Stop loader
    }
  };

  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
    setSelectedVendors([]);
    setSelectedRows([]);
    setResetSelectedRows(true);
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          `${baseURL}rfq/events/${id}/event_vendors?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${currentParticipantPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setParticipants(data || []);
        setTotalParticipantPages(data?.pagination?.total_pages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id, currentParticipantPage]);

  useEffect(() => {
    const formattedData = (participants?.event_vendors || []).map(
      (vendor, index) => ({
        key: vendor.id,
        serialNumber: index + 1,
        name: vendor.pms_supplier.full_name,
        phone: vendor.pms_supplier.mobile,
        email: vendor.pms_supplier.email,
        organisation: vendor.organization_name,
      })
    );
    setVendorData(formattedData);
  }, [participants, vendorData]);

  useEffect(() => {
    setFilteredData(
      Array.isArray(participants?.event_vendors)
        ? participants.event_vendors.map((vendor) => {
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
  }, [participants]);

  useEffect(() => {
    fetch(
      `${baseURL}/rfq/events/company_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
    )
      .then((response) => response.json())
      .then((data) =>
        setCompanyList(
          data.list.map((item) => ({ label: item.name, value: item.value }))
        )
      )
      .catch((error) => console.error("Error fetching company list:", error));
  }, []);

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

      const formattedData = vendors
        .map((vendor) => ({
          id: vendor.id,
          name: vendor.full_name || vendor.organization_name || "N/A",
          email: vendor.email || "N/A",
          organisation: vendor.organization_name || "N/A",
          phone: vendor.contact_number || vendor.mobile || "N/A",
          city: vendor.city_id || "N/A",
          tags: vendor.tags || "N/A",
        }))
        .filter(
          (vendor) =>
            !selectedVendors.some(
              (selected) => selected.pms_supplier_id === vendor.id
            )
        );

      setTableData(formattedData);

      setCurrentPage(page);
      setTotalPages(data?.pagination?.total_pages || 1);
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
    setVendorData(vendorData);
  }, [vendorData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage);
    }
  };

  const getPageRange = () => {
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = startPage + pageRange - 1;

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
    if (isSaving) return;
    setIsSaving(true);
    setIsVendorLoading(true); // Start loader
    const selectedVendorIds = selectedRows.map((vendor) => vendor.id);

    const url = `${baseURL}rfq/events/${id}/add_vendors?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&pms_supplier_ids=[${selectedVendorIds.join(
      ","
    )}]`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });
      setVendorModal(false);

      if (response.ok) {
        const updatedTableData = tableData.filter(
          (vendor) =>
            !selectedRows.some(
              (selectedVendor) => selectedVendor.id === vendor.id
            )
        );
        setTableData(updatedTableData);

        const updatedVendorData = [...vendorData, ...selectedRows];
        setVendorData(updatedVendorData);

        setSelectedVendors((prev) => [...prev, ...selectedRows]);

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
      setIsVendorLoading(false); // Stop loader
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
    <>
        <div
          className="tab-pane fade participants"
          id="participants"
          role="tabpanel"
          aria-labelledby="participants-tab"
          tabIndex={0}
        >
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
            <div className="d-flex align-items-center"></div>
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
          {vendorData?.length > 0 ? (
            !isVendorLoading || !isLoading ? (
              <div className="tbl-container">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Name</th>
                      <th>Mob No.</th>
                      <th>Email</th>
                      <th>Organisation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorData.map((vendor, index) => (
                      <tr key={vendor.key}>
                        <td style={{ textAlign: "left" }}>
                          {(currentParticipantPage - 1) * participantPageSize +
                            index +
                            1}
                        </td>
                        <td style={{ textAlign: "left" }}>{vendor.name}</td>
                        <td style={{ textAlign: "left" }}>{vendor.phone}</td>
                        <td style={{ textAlign: "left" }}>{vendor.email}</td>
                        <td style={{ textAlign: "left" }}>
                          {vendor.organisation || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="loader-container">
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p>Loading...</p>
                </div>
              </>
            )
          ) : (
            <div className="text-center mt-4">No data found</div>
          )}
          {totalParticipantPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-1 mt-2">
              <ul className="pagination justify-content-center d-flex">
                <li
                  className={`page-item ${
                    currentParticipantPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleParticipantPageChange(1)}
                  >
                    First
                  </button>
                </li>

                <li
                  className={`page-item ${
                    currentParticipantPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handleParticipantPageChange(currentParticipantPage - 1)
                    }
                  >
                    Prev
                  </button>
                </li>

                {getPageParticipantRange().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentParticipantPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handleParticipantPageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentParticipantPage === totalParticipantPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handleParticipantPageChange(currentParticipantPage + 1)
                    }
                  >
                    Next
                  </button>
                </li>

                <li
                  className={`page-item ${
                    currentParticipantPage === totalParticipantPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      handleParticipantPageChange(totalParticipantPages)
                    }
                  >
                    Last
                  </button>
                </li>
              </ul>

              <div>
                <p>
                  Showing{" "}
                  {vendorData.length > 0
                    ? (currentParticipantPage - 1) * participantPageSize + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentParticipantPage * participantPageSize,
                    totalParticipantPages * participantPageSize
                  )}{" "}
                  of {totalParticipantPages * participantPageSize} entries
                </p>
              </div>
            </div>
          )}

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
              isVendorLoading ? (
                <>
                  <div className="loader-container">
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p>Loading...</p>
                  </div>
                </>
              ) : (
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
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                        >
                          First
                        </button>
                      </li>

                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                      </li>

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

                    <div>
                      <p>
                        Showing {currentPage * pageSize - (pageSize - 1)} to{" "}
                        {Math.min(
                          currentPage * pageSize,
                          totalPages * pageSize
                        )}{" "}
                        of {totalPages * pageSize} entries
                      </p>
                    </div>
                  </div>
                </>
              )
            }
          />

          <DynamicModalBox
            show={inviteModal}
            onHide={handleInviteModalClose}
            modalType={true}
            title="Invite New Vendor"
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onKeyDown={(e) => {
                        const invalidChars = ["e", "E", "+", "-", ".", ","];
                        if (
                          invalidChars.includes(e.key) ||
                          (isNaN(Number(e.key)) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab")
                        ) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter Phone Number"
                      value={inviteForm.mobile}
                      onChange={handleInviteInputChange}
                    />
                    {formErrors.mobile && (
                      <small className="text-danger">{formErrors.mobile}</small>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="po-fontBold">GST Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name="gstNumber"
                      placeholder="Enter GST Number"
                      value={inviteForm.gstNumber || ""}
                      onChange={handleInviteInputChange}
                    />
                    {formErrors.gstNumber && (
                      <small className="text-danger">
                        {formErrors.gstNumber}
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="po-fontBold">PAN Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name="panNumber"
                      placeholder="Enter PAN Number"
                      value={inviteForm.panNumber || ""}
                      onChange={handleInviteInputChange}
                    />
                    {formErrors.panNumber && (
                      <small className="text-danger">
                        {formErrors.panNumber}
                      </small>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="po-fontBold">Company</label>
                    <SelectBox
                      options={companyList}
                      onChange={(selectedOption) =>
                        setInviteForm((prev) => ({
                          ...prev,
                          company: selectedOption,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="po-fontBold">Organization</label>
                    <input
                      className="form-control"
                      type="text"
                      name="organization"
                      placeholder="Enter Organization Name"
                      value={inviteForm.organization || ""}
                      onChange={handleInviteInputChange}
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <button
                      className="purple-btn1"
                      onClick={handleInviteModalClose}
                    >
                      Close
                    </button>
                    <button
                      className="purple-btn2"
                      onClick={handleInviteSubmit}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </>
            }
          />
        </div>
      
      <ToastContainer />
    </>
  );
}
