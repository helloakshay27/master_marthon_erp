// @ts-nocheck
import React, { useState, useEffect } from "react";
import Table from "../../base/Table/Table";
import { participantsTabColumns, citiesList } from "../../../constant/data";
import SearchIcon from "../Icon/SearchIcon";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import PopupBox from "../../base/Popup/Popup";
import SelectBox from "../../base/Select/SelectBox";


export default function ParticipantsTab({ data }) {
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
  // @ts-ignore
  const [tableData, setTableData] = useState([]); // State to hold dynamic data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Default total pages
  const pageSize = 100; // Number of items per page
  const pageRange = 6; // Number of pages to display in the pagination

  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
  };

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
        `https://marathon.lockated.com/rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
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
      console.log("Formatted data:", formattedData.length, formattedData, tableData);

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

  const handleSaveButtonClick = () => {
    const updatedTableData = tableData.filter(
      (vendor) =>
        !selectedRows.some((selectedVendor) => selectedVendor.id === vendor.id)
    );

    setTableData(updatedTableData);
    setSelectedVendors((prev) => [...prev, ...selectedRows]);
    setVendorModal(false);
    setSelectedRows([]);
    setResetSelectedRows(true);
  };

  const isVendorSelected = (vendorId) => {
    return (
      selectedRows.some((vendor) => vendor.id === vendorId) ||
      selectedVendors.some((vendor) => vendor.id === vendorId)
    );
  };

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  //   if (e.target.value === "") {
  //     setFilteredData(
  //       Array.isArray(data?.event_vendors)
  //         ? data.event_vendors.map((vendor) => {
  //             const { organization_name, contact_number, email } =
  //               vendor.pms_supplier || {};
  //             return {
  //               name: organization_name || "_",
  //               phone: contact_number || "_",
  //               email: email || "_",
  //             };
  //           })
  //         : []
  //     );
  //   }
  // };

  // const handleSearchClick = () => {
  //   const filtered = Array.isArray(data?.event_vendors)
  //     ? data.event_vendors
  //         .map((vendor) => {
  //           const { organization_name, contact_number, email } =
  //             vendor.pms_supplier || {};
  //           return {
  //             name: organization_name || "_",
  //             phone: contact_number || "_",
  //             email: email || "_",
  //           };
  //         })
  //         .filter((vendor) =>
  //           vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  //         )
  //     : [];
  //   setFilteredData(filtered);
  // };

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
      const filteredSuggestions = tableData.filter((vendor) =>
        vendor.name?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      console.log(
        "Filtered suggestions:",
        filteredSuggestions.length,
        filteredSuggestions
      );
      setSuggestions(filteredSuggestions);
      console.log("Suggestions:", suggestions.length, suggestions);

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
      console.log("search", searchTerm);
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
        {tableData.length > 0 ? (
          <Table
            columns={participantsTabColumns} // Use columns with serial number
            data={tableData}
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
            onClick: handleInviteModalClose,
            props: {
              className: "purple-btn2",
            },
          },
        ]}
        children={
          <>
            <form className="p-2">
              <div className="form-group mb-3">
                <label className="po-fontBold">POC - Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter POC Name"
                />
              </div>
              <div className="form-group mb-3">
                <label className="po-fontBold">Email</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter Email Address"
                />
              </div>
              <div className="form-group mb-3">
                <label className="po-fontBold">Phone Number</label>
                <input
                  className="form-control"
                  type="text"
                  inputMode="tel"
                  placeholder="Enter Phone Number"
                />
              </div>
              {/* <label>Choose vendor profile</label>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className={`pro-radio-tabs__tab ${
                        // @ts-ignore
                        selectedVendorProfile === "Manufacturer /Trader"
                          ? "pro-radio-tabs__tab__selected"
                          : ""
                      }`}
                      style={{ width: "50%" }}
                      tabIndex={0}
                      role="radio"
                      // @ts-ignore
                      aria-checked={
                        // @ts-ignore
                        selectedVendorProfile === "Manufacturer /Trader"
                      }
                      onClick={() =>
                        handleVendorProfileChange("Manufacturer /Trader")
                      }
                    >
                      <span
                        className={`ant-radio ${
                          // @ts-ignore
                          selectedVendorProfile === "Manufacturer /Trader"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          // @ts-ignore
                          checked={
                            // @ts-ignore
                            selectedVendorProfile === "Manufacturer /Trader"
                          }
                          onChange={() =>
                            handleVendorProfileChange("Manufacturer /Trader")
                          }
                        />
                        <div className="ant-radio-inner" />
                      </span>
                      <p className="pro-text pro-body pro-text--medium ps-2">
                        Manufacturer /Trader
                      </p>
                    </div>
                    <div
                      className={`pro-radio-tabs__tab col-md-6 ${
                        // @ts-ignore
                        selectedVendorProfile === "Enter Details Manually"
                          ? "pro-radio-tabs__tab__selected"
                          : ""
                      }`}
                      style={{ width: "50%" }}
                      tabIndex={0}
                      role="radio"
                      // @ts-ignore
                      aria-checked={selectedVendorProfile === "Broker"}
                      onClick={() => handleVendorProfileChange("Broker")}
                    >
                      <span
                        className={`ant-radio ${
                          // @ts-ignore
                          selectedVendorProfile === "Broker"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          // @ts-ignore
                          checked={selectedVendorProfile === "Broker"}
                          onChange={() => handleVendorProfileChange("Broker")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                      <p className="pro-text pro-body pro-text--medium ps-2">
                        Broker
                      </p>
                    </div>
                  </div>
                  <label>Invite Vendor via</label>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className={`pro-radio-tabs__tab ${
                        // @ts-ignore
                        selectedVendorDetails === "GST Number"
                          ? "pro-radio-tabs__tab__selected"
                          : ""
                      }`}
                      style={{ width: "50%" }}
                      tabIndex={0}
                      role="radio"
                      // @ts-ignore
                      aria-checked={selectedVendorDetails === "GST Number"}
                      onClick={() => handleVendorDetailChange("GST Number")}
                    >
                      <span
                        className={`ant-radio ${
                          // @ts-ignore
                          selectedVendorDetails === "GST Number"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          // @ts-ignore
                          checked={selectedVendorDetails === "GST Number"}
                          onChange={() =>
                            handleVendorDetailChange("GST Number")
                          }
                        />
                        <div className="ant-radio-inner" />
                      </span>
                      <p className="pro-text pro-body pro-text--medium ps-2">
                        GST Number
                      </p>
                    </div>
                    <div
                      className={`pro-radio-tabs__tab col-md-6 ${
                        // @ts-ignore
                        selectedVendorDetails === "Enter Details Manually"
                          ? "pro-radio-tabs__tab__selected"
                          : ""
                      }`}
                      style={{ width: "50%" }}
                      tabIndex={0}
                      role="radio"
                      // @ts-ignore
                      aria-checked={
                        // @ts-ignore
                        selectedVendorDetails === "Enter Details Manually"
                      }
                      onClick={() =>
                        handleVendorDetailChange("Enter Details Manually")
                      }
                    >
                      <span
                        className={`ant-radio ${
                          // @ts-ignore
                          selectedVendorDetails === "Enter Details Manually"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          // @ts-ignore
                          checked={
                            // @ts-ignore
                            selectedVendorDetails === "Enter Details Manually"
                          }
                          onChange={() =>
                            handleRadioChange("Enter Details Manually")
                          }
                        />
                        <div className="ant-radio-inner" />
                      </span>
                      <p className="pro-text pro-body pro-text--medium ps-2">
                        Enter Details Manually
                      </p>
                    </div>
                  </div>
                  {
                    // @ts-ignore
                    selectedVendorDetails === "GST Number" && (
                      <>
                        <div className="form-group mb-3">
                          <label className="po-fontBold">GST Number</label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter GST Number"
                          />
                        </div>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    selectedVendorDetails === "Enter Details Manually" && (
                      <>
                        <div className="form-group mb-3">
                          <label className="po-fontBold">Company Name</label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Company Name"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label className="po-fontBold">Address</label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter Address"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label className="po-fontBold">City</label>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Enter City"
                          />
                        </div>
                      </>
                    )
                  } */}
            </form>
          </>
        }
      />
    </div>
  );
}
