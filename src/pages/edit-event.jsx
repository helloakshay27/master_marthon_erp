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
import { useParams, useNavigation, useNavigate } from "react-router-dom";
import { citiesList, participantsTabColumns } from "../constant/data";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PopupBox from "../components/base/Popup/Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditEvent() {
  const { id } = useParams(); // Get the id from the URL
  const fileInputRef = useRef(null);
  const myRef = useRef(null);
  const [eventTypeModal, setEventTypeModal] = useState(false);
  const [isService, setIsService] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [publishEventModal, setPublishEventModal] = useState(false);
  const [eventScheduleModal, setEventScheduleModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [eventType, setEventType] = useState("");
  const [awardType, setAwardType] = useState("");
  const [dynamicExtension, setDynamicExtension] = useState(false);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const Loader = () => (
    <div className="loader-container">
      <div className="lds-ring">
        <div></div>
      </div>
      <p>fetching existing Data</p>
    </div>
  );
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
  const [eventDetails, setEventDetails] = useState([]);
  const [onLoadScheduleData, setOnLoadScheduleData] = useState({});
  const [matchedTerm, setMatchedTerm] = useState({});

  // @ts-ignore
  const [createdOn] = useState(new Date().toISOString().split("T")[0]);
  // @ts-ignore
  const [selectedVendors, setSelectedVendors] = useState([]);
  // @ts-ignore
  // @ts-ignore
  const [eventSchedule, setEventSchedule] = useState("");
  // @ts-ignore
  const [scheduleData, setScheduleData] = useState({});
  const [addTerm, setAddTerm] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
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
  const handlePublishEventModalShow = () => {
    setPublishEventModal(true);
  };
  const handlePublishEventModalClose = () => {
    setPublishEventModal(false);
  };
  const handleEventScheduleModalShow = () => {
    if (!dynamicExtensionConfigurations.delivery_date) {
      toast.warn("Please fill the delivery date on Event Type");
    } else {
      setEventScheduleModal(true);
    }
  };
  const handleEventScheduleModalClose = () => {
    setEventScheduleModal(false);
  };

  const handleSaveSchedule = (data) => {
    setScheduleData(data);
    handleEventScheduleModalClose();

    const timeZone = "Asia/Kolkata";

    const formatDateTime = (dateTime) => {
      const date = new Date(dateTime);
      return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    };

    const adjustTimeZone = (dateTime) => {
      const date = new Date(dateTime);
      date.setHours(date.getHours() - 5);
      date.setMinutes(date.getMinutes() - 30);
      return date;
    };

    const startDateTime = formatDateTime(data.start_time);
    const endDateTime = formatDateTime(adjustTimeZone(data.end_time_duration));

    const scheduleText = `${startDateTime} to ${endDateTime}`;
    setEventScheduleText(scheduleText);
    console.log("scheduleText", scheduleText, data.end_time_duration);
  };

  const [eventScheduleText, setEventScheduleText] = useState("");

  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value;
    if (["rfq", "contract", "auction"].includes(value)) {
      setEventType(value);
    } else {
      alert("Please select a valid event type.");
    }
  };

  const handleTrafficChange = (value) => {
    setIsTrafficSelected(value);
  };

  const handleAwardTypeChange = (e) => {
    const value = e;
    if (["single_vendor", "multiple_vendors"].includes(value)) {
      setAwardType(value);
    } else {
      alert("Please select a valid award scheme.");
    }
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

  const fetchTermsAndConditions = async () => {
    try {
      const response = await fetch(
        "https://marathon.lockated.com/rfq/events/terms_and_conditions?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1"
      );
      const data = await response.json();
      const termsList = data.list.map((term) => ({
        label: term.condition_category,
        value: term.id,
        condition: term.condition,
      }));
      setTermsOptions(termsList);
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const handleEventConfigurationSubmit = (config) => {
    setEventType(config.event_type);
    setAwardType(config.award_scheme);
    setSelectedStrategy(config.event_configuration);
    setDynamicExtension(config.dynamic_time_extension);
    setDynamicExtensionConfigurations({
      time_extension_type: config.time_extension_type,
      triggered_time_extension_on_last: config.triggered_time_extension_on_last,
      extend_event_time_by: config.extend_event_time_by,
      time_extension_change: config.time_extension_change,
      delivery_date: config.delivery_date,
    });
    handleEventTypeModalClose();

    let eventTypeText = "";
    if (config.event_type === "rfq") {
      eventTypeText = "RFQ";
      setIsService(false);
    } else if (config.event_type === "auction") {
      eventTypeText = "Auction";
      setIsService(false);
    } else if (config.event_type === "contract") {
      eventTypeText = "Contract";
      setIsService(true);
    } else {
      alert("Please select a valid event type.");
      return;
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
  // const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [eventStatus, setEventStatus] = useState("pending"); // Add state for event status

  const fetchEventData = async () => {
    try {
      const response = await fetch(
        `https://marathon.lockated.com/rfq/events/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );

      const data = await response.json();

      if (response.ok) {
        setEventDetails(data);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventData();
  }, [setEventDetails]);

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

      setCurrentPage(page);
      setTotalPages(data?.pagination?.total_pages || 1); // Assume the API returns total pages
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
    fetchData();
  }, []);

  const [termsOptions, setTermsOptions] = useState([]);

  useEffect(() => {
    if (eventDetails) {
      seteventName(eventDetails?.event_title);
      setEventTypeText(eventDetails?.event_type_detail?.event_type);
      setEventDescription(eventDetails?.event_description);
      setEventScheduleText(
        `${new Date(eventDetails?.start_time).toLocaleString()} ~ ${new Date(
          eventDetails?.end_time
        ).toLocaleString()}`
      );
      setMaterialFormData(
        eventDetails?.event_materials?.map((material) => ({
          descriptionOfItem: material.inventory_name,
          inventory_id: material.inventory_id,
          quantity: material.quantity,
          unit: material.uom,
          location: material.location,
          rate: material.rate,
          amount: material.amount,
          inventory_type_id: material.inventory_type_id, // Add inventory_type_id
          inventory_sub_type_id: material.inventory_sub_type_id, // Add inventory_sub_type_id
        }))
      );
      setSelectedVendors(
        eventDetails?.event_vendors?.map((vendor) => ({
          id: vendor.id,
          name: vendor.full_name,
          phone: vendor.organization_name,
          pms_supplier_id: vendor.pms_supplier_id,
        }))
      );
    }
  }, [eventDetails, termsOptions]);

  useEffect(() => {
    setTextareas(
      eventDetails?.resource_term_conditions?.map((term) => {
        return {
          id: term.term_condition_id,
          value: term.term_condition.condition,
          defaultOption: matchedTerm
            ? { label: matchedTerm?.label, value: matchedTerm?.value }
            : { label: "Select Condition", value: "" },
        };
      })
    );
    eventDetails?.resource_term_conditions?.map((term) => {
      setMatchedTerm(
        termsOptions.find((option) => option.value === term.term_condition_id)
      );
    });
  }, [eventDetails, matchedTerm]);

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
    setSelectedVendors((prev) => [
      ...prev,
      ...selectedRows.map((vendor) => ({
        ...vendor,
        id: null,
        pms_supplier_id: vendor.id,
      })),
    ]);
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
    setShowSelectBox(false);
    setAddTerm(true);
  };

  const handleRemoveTextarea = (index) => {
    setTextareas((prev) => prev.filter((_, idx) => idx !== index));
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

    if (selectedCondition) {
      setTextareas(
        textareas.map((textarea) =>
          textarea.id === id
            ? {
                ...textarea,
                id: selectedCondition.value,
                value: selectedCondition.condition,
                defaultOption: {
                  label: selectedCondition.label,
                  value: selectedCondition.value,
                },
              }
            : textarea
        )
      );
      setShowSelectBox(true);
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

  const handleFileChange = (srNo, file) => {
    const index = documentRows.findIndex((row) => row.srNo === srNo);
    if (index === -1) {
      console.error("Invalid index for file upload:", srNo);
      return;
    }

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

  const fetcher = (url, options) =>
    fetch(url, options).then((res) => res.json());

  const updateEvent = async (id, eventData) => {
    const url = `https://marathon.lockated.com/rfq/events/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update event.");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleOnLoadScheduleData = (startTime, endTime, evaluationTime) => {
    setOnLoadScheduleData({
      start_time: startTime,
      end_time_duration: endTime,
      evaluation_time: evaluationTime,
    });
  };

  // ("eventDetails:----", eventDetails);

  const scrollToTop = () => {
    if (myRef.current) {
      console.log("scrolling to top", myRef.current);

      myRef.current.scrollIntoView({ behavior: "smooth", top: 0 });
    }
  };

  const validateForm = () => {
    if (!eventName) {
      toast.error("Event name is required");
      scrollToTop();
      return false;
    }
    if (
      !eventType ||
      !awardType ||
      !dynamicExtensionConfigurations.delivery_date
    ) {
      toast.error("Please select event type details");
      scrollToTop();
      return false;
    }
    if (!createdOn) {
      toast.error("Created on date is required");
      scrollToTop();
      return false;
    }
    if (!onLoadScheduleData?.start_time && !scheduleData?.start_time) {
      toast.error("Start time is required");
      scrollToTop();
      return false;
    }
    if (
      !onLoadScheduleData?.end_time_duration &&
      !scheduleData?.end_time_duration
    ) {
      toast.error("End time duration is required");
      scrollToTop();
      return false;
    }
    if (
      !onLoadScheduleData?.evaluation_time &&
      !scheduleData?.evaluation_time
    ) {
      toast.error("Evaluation time is required");
      scrollToTop();
      return false;
    }
    if (selectedVendors.length === 0) {
      toast.error("At least one vendor must be selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSubmitted(true);
    const eventData = {
      event: {
        event_title: eventName,
        created_on: createdOn,
        status: eventStatus,
        event_description: eventDescription,
        event_schedule_attributes: {
          start_time:
            onLoadScheduleData?.start_time || scheduleData?.start_time,
          end_time:
            onLoadScheduleData?.end_time_duration ||
            scheduleData?.end_time_duration,
          evaluation_time:
            onLoadScheduleData?.evaluation_time ||
            scheduleData?.evaluation_time,
        },
        event_type_detail_attributes: {
          event_type: eventType,
          award_scheme: awardType,
          event_configuration: selectedStrategy,
          time_extension_type:
            dynamicExtensionConfigurations.time_extension_type || "",
          triggered_time_extension_on_last:
            dynamicExtensionConfigurations.triggered_time_extension_on_last ||
            "",
          extend_event_time_by:
            Number(dynamicExtensionConfigurations.extend_event_time_by) || 0,
          enable_english_auction: true,
          extension_time_min: 5,
          extend_time_min: 10,
          time_extension_change:
            dynamicExtensionConfigurations.time_extension_on_change_in || "",
          delivery_date: dynamicExtensionConfigurations.delivery_date || "",
        },
        event_materials_attributes: materialFormData.map((material) => ({
          id: material.id || null, // Set id to null for new rows
          inventory_id: Number(material.inventory_id),
          quantity: Number(material.quantity),
          uom: material.unit,
          location: material.location,
          rate: Number(material.rate),
          amount: material.amount,
          sub_section_name: material.sub_section_id,
          section_name: material.section_id,
          inventory_type_id: material.inventory_type_id, // Add inventory_type_id
          inventory_sub_type_id: material.inventory_sub_type_id, // Add inventory_sub_type_id
          _destroy: material._destroy || false,
        })),
        event_vendors_attributes: selectedVendors.map((vendor) => ({
          id: vendor.id === null ? null : vendor.id,
          status: "invited",
          pms_supplier_id: vendor.pms_supplier_id || vendor.id,
        })),
        status_logs_attributes: [
          {
            status: "pending",
            created_by_id: 2,
            remarks: "Initial status",
          },
        ],
        resource_term_conditions_attributes: textareas.map((textarea) => {
          const existingCondition = eventDetails.resource_term_conditions.find(
            (condition) => condition.term_condition_id === textarea.id
          );
          return {
            id: existingCondition ? existingCondition.id : null,
            term_condition_id: textarea.id,
            condition_type: "general",
            condition: textarea.value,
          };
        }),
        attachments: documentRows?.map((row) => row?.upload),
      },
    };

    console.log("eventData :---", eventData);

    try {
      const data = await updateEvent(id, eventData);
      toast.success("Event updated successfully!", {
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate(
          "/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
      }, 1500); // Increase the delay to 1.5 seconds before navigating
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.", {
        autoClose: 1000,
      });
    } finally {
      setSubmitted(false);
      setLoading(false);
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

  useEffect(() => {}, [eventType, awardType]);

  const handleStatusChange = (selectedOption) => {
    setEventStatus(selectedOption);
  };

  const handleRemoveVendor = (id) => {
    setSelectedVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  };

  return (
    <>
      <div className="website-content overflowY-auto">
        <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a
                  href="/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
                  className="text-decoration-none text-primary"
                >
                  Event List
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Event
              </li>
            </ol>
          </nav>
          <h5 className="mt-3 ms-3">Edit RFQ &amp; Auction</h5>
          <div style={{ width: "15%" }}></div>
        </div>
        <div className="pt-3" ref={myRef}>
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
                <div className="col-md-4 col-sm-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">Event Status</label>
                  </div>
                  <SelectBox
                    options={[
                      { label: "Submitted", value: "submitted" },
                      { label: "Approved", value: "approved" },
                      { label: "Published", value: "published" },
                      { label: "Expired", value: "expired" },
                      { label: "Closed", value: "closed" },
                      { label: "Pending", value: "pending" },
                    ]}
                    onChange={handleStatusChange}
                    defaultValue={eventStatus}
                  />
                </div>
              </div>
              <CreateRFQForm
                data={materialFormData}
                setData={setMaterialFormData}
                isService={isService}
                existingData={eventDetails?.grouped_event_materials}
                deliveryData={eventDetails?.delivery_schedules}
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
                        <th style={{ width: "100px" }}>Sr No.</th>
                        <th>Vendor Name</th>
                        <th>Mob No.</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedVendors?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No vendors selected
                          </td>
                        </tr>
                      ) : (
                        selectedVendors?.map((vendor, index) => (
                          <tr key={vendor.id}>
                            <td style={{ width: "100px" }}>{index + 1}</td>
                            <td>{vendor.name}</td>
                            <td>{vendor.phone}</td>
                            <td>Invited</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveVendor(vendor.id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
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
                  data={documentRows.map((row) => ({
                    ...row,
                    upload: (
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(row.srNo, e.target.files[0])
                        }
                        ref={fileInputRef}
                        multiple
                        accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                      />
                    ),
                    action: (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveDocumentRow(row.srNo)}
                        disabled={row.srNo === 1}
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
                    {textareas?.map((textarea, idx) => {
                      if (textarea.id === null) {
                        return null;
                      }
                      return (
                        <tr key={idx}>
                          <td>
                            {textarea?.defaultOption?.value && termsOptions && (
                              <SelectBox
                                options={termsOptions}
                                onChange={(option) =>
                                  handleConditionChange(textarea.id, option)
                                }
                                defaultValue={textarea?.defaultOption?.value}
                              />
                            )}
                            {addTerm && !textarea?.defaultOption?.value && (
                              <SelectBox
                                options={termsOptions}
                                onChange={(option) =>
                                  handleConditionChange(textarea.id, option)
                                }
                                defaultValue={termsOptions.find(
                                  (option) =>
                                    option.condition === textarea.value
                                )}
                              />
                            )}
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
                              onClick={() => handleRemoveTextarea(idx)}
                              disabled={idx === 0}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="row mt-2 justify-content-end align-items-center mt-4">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Preview</button>
                </div>
                <div className="col-md-2">
                  {loading && (
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
                      <p>Loading ..</p>
                    </div>
                  )}
                  <button
                    className={
                      submitted ? "disabled-btn w-100" : "purple-btn2 w-100"
                    }
                    onClick={handleSubmit}
                    disabled={submitted}
                  >
                    Update
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
                        {Math.min(
                          currentPage * pageSize,
                          totalPages * pageSize
                        )}{" "}
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
                    <div className="form-group mb-3">
                      <label className="po-fontBold">Phone Number</label>
                      <input
                        className="form-control"
                        type="text"
                        inputMode="tel"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </form>
                </>
              }
            />
            <EventTypeModal
              existingData={eventDetails?.event_type_detail}
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
            />
            <EventScheduleModal
              deliveryDate={dynamicExtensionConfigurations.delivery_date}
              show={eventScheduleModal}
              onHide={handleEventScheduleModalClose}
              handleSaveSchedule={handleSaveSchedule}
              existingData={eventDetails?.event_schedule}
              onLoadScheduleData={handleOnLoadScheduleData}
            />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
