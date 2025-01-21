// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";

import {
  CreateRFQForm,
  DynamicModalBox,
  EventScheduleModal,
  EventTypeModal,
  SearchIcon,
  SelectBox,
  Table,
} from "../components";

import { citiesList, participantsTabColumns } from "../constant/data";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PopupBox from "../components/base/Popup/Popup";

export default function CreateEvent() {
  const fileInputRef = useRef(null);
  const [eventTypeModal, setEventTypeModal] = useState(false);
  const [isService, setIsService] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [publishEventModal, setPublishEventModal] = useState(false);
  const [eventScheduleModal, setEventScheduleModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [eventType, setEventType] = useState(false);
  const [awardType, setAwardType] = useState(false);
  const [dynamicExtension, setDynamicExtension] = useState(false);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [dynamicExtensionConfigurations, setDynamicExtensionConfigurations] =
    useState({
      time_extension_type: "",
      triggered_time_extension_on_last: "",
      extend_event_time_by: "",
      time_extension_on_change_in: "",
      delivery_date: "",
    });

  const [materialFormData, setMaterialFormData] = useState([
    {
      descriptionOfItem: [],
      inventory_id: "",
      quantity: "",
      unit: [],
      location: [],
      rate: 0,
      amount: 0,
    },
  ]);
  const [selectedStrategy, setSelectedStrategy] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(false);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  // @ts-ignore
  const [selectedCity, setSelectedCity] = useState([]);
  const [isTrafficSelected, setIsTrafficSelected] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [eventNo, setEventNo] = useState("");
  const [eventName, seteventName] = useState("");
  const [textareas, setTextareas] = useState([{ id: Date.now(), value: "" }]);
  const documentRowsRef = useRef([{ srNo: 1, upload: null }]);
  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);
  const [eventDescription, setEventDescription] = useState("");

  // @ts-ignore
  const [createdOn] = useState(new Date().toISOString().split("T")[0]);
  // @ts-ignore
  const [selectedVendors, setSelectedVendors] = useState([]);
  // @ts-ignore
  // @ts-ignore
  const [eventSchedule, setEventSchedule] = useState("");
  // @ts-ignore
  const [scheduleData, setScheduleData] = useState({});

  // @ts-ignore
  // @ts-ignore
  const [data, setData] = useState([
    { user: "", date: "", status: "", remark: "" },
  ]);

  const options = [
    { value: "BUILDING MATERIAL", label: "BUILDING MATERIAL" },
    { value: "MIVAN MA", label: "MIVAN MA" },
    { value: "MIVAN MATERIAL", label: "MIVAN MATERIAL" },
  ];
  const handleDynamicExtensionBid = (key, value) => {
    setDynamicExtensionConfigurations((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleChange = (selectedOption) => {
    setSelectedTags(selectedOption);
  };
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    fetchData(1, searchTerm, selectedOption);
  };

  const navigate = useNavigate();

  const handleApply = () => {
    setShowPopup(false);
  };

  const handleEventTypeModalShow = () => {
    setEventTypeModal(true);
  };
  const handleEventTypeModalClose = () => {
    setEventTypeModal(false);
  };
  // @ts-ignore
  const handleInviteModalShow = () => {
    setVendorModal(false);
    setInviteModal(true);
  };
  const handleInviteModalClose = () => {
    setInviteModal(false);
  };
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  const handlePublishEventModalShow = () => {
    setPublishEventModal(true);
  };
  const handlePublishEventModalClose = () => {
    setPublishEventModal(false);
  };
  const handleEventScheduleModalShow = () => {
    setEventScheduleModal(true);
  };
  const handleEventScheduleModalClose = () => {
    setEventScheduleModal(false);
  };

  const handleSaveSchedule = (data) => {
    setScheduleData(data);
    handleEventScheduleModalClose();
    const scheduleText = `${data.start_time} ~ ${data.end_time_duration}`;
    setEventScheduleText(scheduleText);
  };

  const [eventScheduleText, setEventScheduleText] = useState("");

  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e);
  };

  const handleTrafficChange = (value) => {
    setIsTrafficSelected(value);
  };

  const handleAwardTypeChange = (e) => {
    setAwardType(e);
  };

  const handleDynamicExtensionChange = (id, isChecked) => {
    setDynamicExtension((prevState) => ({
      // @ts-ignore
      ...prevState,
      [id]: isChecked,
    }));
  };

  const handleRadioChange = (strategy) => {
    setSelectedStrategy(strategy);
  };
  const handleVendorDetailChange = (vendor) => {
    setSelectedVendorDetails(vendor);
  };
  const handleVendorProfileChange = (profile) => {
    setSelectedVendorProfile(profile);
  };

  const handleEventConfigurationSubmit = () => {
    handleEventTypeModalClose();
    let eventTypeText = "";
    // @ts-ignore
    if (eventType === "rfq") {
      eventTypeText = "RFQ";
      setIsService(false);
      // @ts-ignore
    } else if (eventType === "auction") {
      eventTypeText = "Auction";
      setIsService(false);
    } else {
      eventTypeText = "Contract";
      setIsService(true);
    }
    setEventTypeText(eventTypeText);
  };

  const [eventTypeText, setEventTypeText] = useState("");

  const [tableData, setTableData] = useState([]); // State to hold dynamic data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Default total pages
  const pageSize = 100; // Number of items per page
  const pageRange = 6; // Number of pages to display in the pagination

  // @ts-ignore
  // @ts-ignore
  const [loading, setLoading] = useState(true);

  const fetchData = async (page = 1, searchTerm = "", selectedCity = "") => {
    if (searchTerm == "") {
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://vendors.lockated.com/rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
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
      console.log("Formatted data:", formattedData.length, formattedData); 
      

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

  const handleAddTextarea = () => {
    setTextareas([...textareas, { id: Date.now(), value: "" }]);
  };

  const handleRemoveTextarea = (id) => {
    setTextareas(textareas.filter((textarea) => textarea.id !== id));
  };

  const handleTextareaChange = (id, value) => {
    setTextareas(
      textareas.map((textarea) =>
        textarea.id === id ? { ...textarea, value } : textarea
      )
    );
  };

  const handleConditionChange = (id, selectedOption) => {

    const selectedCondition = termsOptions.find(
      (option) => String(option.value) === String(selectedOption)
    );

    console.log("selectedCondition:", selectedCondition);

    if (selectedCondition) {
      setTextareas(
        textareas.map((textarea) =>
          textarea.id === id
            ? { ...textarea, value: selectedCondition.condition }
            : textarea
        )
      );
      console.log("Updated textareas:", textareas);
    }
  };

  const handleAddDocumentRow = () => {
    const newRow = { srNo: documentRows.length + 1, upload: null };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      documentRowsRef.current = documentRowsRef.current.filter(
        (_, i) => i !== index
      );
      setDocumentRows([...documentRowsRef.current]);
    }
  };

  const handleFileChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      documentRowsRef.current[index].upload = {
        filename: file.name,
        content: base64String,
        content_type: file.type,
      };
      setDocumentRows([...documentRowsRef.current]);
    };
    reader.readAsDataURL(file);
  };

  const appendFormData = (formData, data, parentKey = "") => {
    if (data && typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        appendFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      formData.append(parentKey, data);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !eventName ||
      !createdOn ||
      !scheduleData.start_time ||
      !scheduleData.end_time_duration ||
      !scheduleData.evaluation_time ||
      selectedVendors.length === 0
    ) {
      alert("Please fill all the required fields.");
      return;
    }

    const eventData = {
      event: {
        event_title: eventName,
        created_on: createdOn,
        status: "pending",
        created_by_id: 2,
        event_description: eventDescription,
        event_schedule_attributes: {
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time_duration,
          evaluation_time: scheduleData.evaluation_time,
          event_type_id: 1,
        },
        event_type_detail_attributes: {
          event_type: eventType,
          award_scheme: awardType,
          event_configuration: selectedStrategy,
          dynamic_time_extension: dynamicExtension[1],
          time_extension_type:
            dynamicExtensionConfigurations.time_extension_type,
          triggered_time_extension_on_last:
            dynamicExtensionConfigurations.triggered_time_extension_on_last,
          extend_event_time_by: Number(
            dynamicExtensionConfigurations.extend_event_time_by
          ),
          enable_english_auction: true,
          extension_time_min: 5,
          extend_time_min: 10,
          time_extension_change:
            dynamicExtensionConfigurations.time_extension_on_change_in,
          delivery_date: dynamicExtensionConfigurations.delivery_date,
        },
        event_materials_attributes: materialFormData.map((material) => ({
          descriptionOfItem: material.descriptionOfItem,
          inventory_id: material.inventory_id,
          quantity: material.quantity,
          unit: material.unit,
          location: material.location,
          rate: material.rate,
          amount: material.amount,
          sub_section_id: material.sub_section_id,
          section_id: material.section_id,
        })),
        event_vendors_attributes: selectedVendors.map((vendor) => ({
          status: 1,
          pms_supplier_id: vendor.id,
        })),
        status_logs_attributes: [
          {
            status: "pending",
            created_by_id: 2,
            remarks: "Initial status",
            comments: "No comments",
          },
        ],
        resource_term_conditions_attributes: textareas.map((textarea) => ({
          term_condition_id: 1,
          condition_type: "general",
          condition: textarea.value,
        })),
        attachments: documentRows.map((row) => row.upload),
      },
    };

    console.log("Payload:", eventData);

    try {
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );
      if (response.ok) {
        alert("Event created successfully!");
        navigate(
          "/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableData, setFilteredTableData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTableData(tableData);
  }, [tableData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    } else {
      const filteredSuggestions = tableData.filter((vendor) =>
        vendor.name?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      console.log("Filtered suggestions:", filteredSuggestions.length ,filteredSuggestions);
      setSuggestions(filteredSuggestions);
      console.log("Suggestions:", suggestions.length, suggestions);
      
      setIsSuggestionsVisible(true);
    }
    console.log("Search term:", e.target.value, filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setIsSuggestionsVisible(false);
    fetchData(1, suggestion.name, selectedCity);
  };

  const handleSearchClick = () => {
    fetchData(1, searchTerm, selectedCity);
  };

  const [termsOptions, setTermsOptions] = useState([]);

  // Fetch terms and conditions from the API
  const fetchTermsAndConditions = async () => {
    try {
      const response = await fetch(
        "https://vendors.lockated.com/rfq/events/terms_and_conditions?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1"
      );
      const data = await response.json();
      const termsList = data.list.map((term) => ({
        label: term.condition_category,
        value: term.id,
        condition: term.condition, // Include condition text here
      }));
      setTermsOptions(termsList);
      console.log("Terms and conditions:", termsList);
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  return (
    <>
      <div className="website-content overflowY-auto">
        <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none text-primary">
                  Event List
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Create Event
              </li>
            </ol>
          </nav>
          <h5 className="mt-3 ms-3">Create RFQ &amp; Auction</h5>
          <div style={{ width: "15%" }}></div>
        </div>
        <div className="module-data-section mx-3">
          <div className="card p-3 mt-3">
            <div className="row align-items-end justify-items-end mb-5 mt-3">
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Name <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  className="form-control"
                  placeholder="Enter Event Name"
                  value={eventName}
                  onChange={(e) => seteventName(e.target.value)}
                />
              </div>
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Type <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  className="form-control"
                  onClick={handleEventTypeModalShow}
                  placeholder="Configure The Event"
                  value={eventTypeText} // Display the selected event type
                  readOnly
                />
              </div>
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">Created On</label>
                  <input
                    className="form-control"
                    type="date"
                    defaultValue={createdOn} // Sets default value to today's date
                    readOnly // Prevents user from changing the value
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Schedule <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  className="form-control"
                  onClick={handleEventScheduleModalShow}
                  placeholder="From [dd-mm-yy hh:mm] To [dd-mm-yy hh:mm] ([DD] Days [HH] Hrs [MM] Mins)"
                  value={eventScheduleText} // Display the selected event schedule
                  readOnly
                />
              </div>
              <div className="col-md-4 col-sm-6 mt-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Description <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <textarea
                  className="form-control"
                  placeholder="Enter Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
            </div>
            <CreateRFQForm
              data={materialFormData}
              setData={setMaterialFormData}
              isService={isService}
            />
            <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
              <h5 className=" ">
                Select Vendors{" "}
                <span style={{ color: "red", fontSize: "16px" }}>*</span>
              </h5>
              <div className="card-tools">
                <button
                  className="purple-btn2"
                  data-bs-toggle="modal"
                  data-bs-target="#venderModal"
                  onClick={handleVendorTypeModalShow}
                >
                  <span className="material-symbols-outlined align-text-top me-2">
                    add{" "}
                  </span>
                  <span>Add</span>
                </button>
              </div>
            </div>
            <div className="row justify-content-center mx-1">
              <div
                className="tbl-container px-0 mx-5 mt-3"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr No.</th> {/* Add serial number column header */}
                      <th>Vendor Name</th>
                      <th>Mob No.</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedVendors.length > 0 ? (
                      selectedVendors
                        .filter(
                          (vendor, index, self) =>
                            index === self.findIndex((v) => v.id === vendor.id)
                        )
                        .map((vendor, index) => (
                          <tr key={vendor.id}>
                            <td>{index + 1}</td>
                            <td>{vendor.name}</td>
                            <td>{vendor.phone}</td>
                            <td>Invited</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  setSelectedVendors((prev) =>
                                    prev.filter((v) => v.id !== vendor.id)
                                  )
                                }
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          // @ts-ignore
                          colSpan="5"
                          className="text-center"
                        >
                          No vendors selected
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                <h5 className="mt-3">
                  Document Attachments{" "}
                  <span style={{ color: "red", fontSize: "16px" }}>*</span>
                </h5>
                <button
                  className="purple-btn2 mt-3"
                  onClick={handleAddDocumentRow}
                >
                  <span className="material-symbols-outlined align-text-top me-2">
                    add
                  </span>
                  <span>Add</span>
                </button>
              </div>

              <Table
                columns={[
                  { label: "Sr No", key: "srNo" },
                  { label: "Upload File", key: "upload" },
                  { label: "Action", key: "action" },
                ]}
                onRowSelect={undefined}
                resetSelectedRows={undefined}
                onResetComplete={undefined}
                data={documentRows.map((row, index) => ({
                  ...row,
                  upload: (
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                      ref={fileInputRef}
                      multiple
                      accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                    />
                  ),
                  action: (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveDocumentRow(index)}
                      disabled={index === 0}
                    >
                      Remove
                    </button>
                  ),
                }))}
              />
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-end mx-1 mt-5">
                <h5 className="mt-3">
                  Terms & Conditions{" "}
                  <span style={{ color: "red", fontSize: "16px" }}>*</span>
                </h5>
                <button
                  className="purple-btn2 mt-3"
                  onClick={handleAddTextarea}
                >
                  <span className="material-symbols-outlined align-text-top me-2">
                    add
                  </span>
                  <span>Add</span>
                </button>
              </div>

              <table className="tbl-container w-100">
                <thead>
                  <tr>
                    <th>Condition Category</th>
                    <th>Condition</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {textareas.map((textarea, idx) => (
                    <tr key={idx}>
                      <td>
                        <SelectBox
                          options={termsOptions.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          onChange={(option) =>
                            handleConditionChange(textarea.id, option)
                          }
                          defaultValue={termsOptions.find(
                            (option) => option.condition === textarea.value
                          )}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={textarea.value}
                          readOnly
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveTextarea(textarea.id)}
                          disabled={idx === 0}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row mt-4 mt-3">
              {/* <h5>Audit Log</h5>
            <div className="mx-0">
              <div className="tbl-container px-0 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter User Name"
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Date"
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Status"
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Remark"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}

              <EventScheduleModal
                show={eventScheduleModal}
                onHide={handleEventScheduleModalClose}
                handleSaveSchedule={handleSaveSchedule}
              />
            </div>
            <div className="row mt-2 justify-content-end mt-4">
              <div className="col-md-2">
                <button className="purple-btn2 w-100">Preview</button>
              </div>
              <div className="col-md-2">
                <button className="purple-btn2 w-100" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
              <div className="col-md-2">
                <button
                  className="purple-btn1 w-100"
                  onClick={() => {
                    navigate(
                      "/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414/event-list"
                    );
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {/* // vendor model with vendor data */}
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

                    {/* Previous Button */}
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
                      {Math.min(currentPage * pageSize, totalPages * pageSize)}{" "}
                      of {totalPages * pageSize} entries
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
                  <label>Choose vendor profile</label>
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
                  }
                </form>
              </>
            }
          />
          <EventTypeModal
            show={eventTypeModal}
            handleDynamicExtensionBid={handleDynamicExtensionBid}
            onHide={handleEventTypeModalClose}
            handleEventConfigurationSubmit={handleEventConfigurationSubmit}
            title={"Configuration for Event"}
            eventType={eventType}
            handleEventTypeChange={handleEventTypeChange}
            eventTypeModal={eventTypeModal}
            handleEventTypeModalClose={handleEventTypeModalClose}
            selectedStrategy={selectedStrategy}
            handleRadioChange={handleRadioChange}
            awardType={awardType}
            handleAwardTypeChange={handleAwardTypeChange}
            dynamicExtension={dynamicExtension}
            dynamicExtensionConfigurations={dynamicExtensionConfigurations}
            handleDynamicExtensionChange={handleDynamicExtensionChange}
            size={"xl"}
            footerButtons={[
              {
                label: "Close",
                onClick: handleEventTypeModalClose,
                props: {
                  className: "purple-btn1",
                },
              },
              {
                label: "Save Changes",
                onClick: handleEventTypeModalClose,
                props: {
                  className: "purple-btn2",
                },
              },
            ]}
            trafficType={isTrafficSelected}
            handleTrafficChange={handleTrafficChange}
          />{" "}
        </div>
      </div>
    </>
  );
}
