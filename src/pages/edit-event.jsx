import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from 'react-bootstrap';

import {
  CreateRFQForm,
  DynamicModalBox,
  EventScheduleModal,
  EventTypeModal,
  SearchIcon,
  MultiSelector,
  SelectBox,
  Table,
} from "../components";
import { useParams, useNavigation, useNavigate, useLocation } from "react-router-dom";
import { citiesList, participantsTabColumns } from "../constant/data";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PopupBox from "../components/base/Popup/Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../confi/apiDomain";
import { set } from "lodash";
import { specificationColumns } from "../constant/data";
import SingleSelector from '../components/base/Select/SingleSelector';
import axios from 'axios';

export default function EditEvent() {
  const { id } = useParams(); // Get the id from the URL
  const fileInputRef = useRef(null);
  const myRef = useRef(null);
  const [eventTypeModal, setEventTypeModal] = useState(false);
  const [isService, setIsService] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [publishEventModal, setPublishEventModal] = useState(false);
  const [eventScheduleModal, setEventScheduleModal] = useState(false);
  const [eventScheduleText, setEventScheduleText] = useState("");
  const [eventScheduleInputText, setEventScheduleInputText] = useState("");
  const [vendorModal, setVendorModal] = useState(false);
  const [eventType, setEventType] = useState("");
  const [awardType, setAwardType] = useState("");
  const [dynamicExtension, setDynamicExtension] = useState(false);
  const [resetSelectedRows, setResetSelectedRows] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [bidTemplateFields, setBidTemplateFields] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [isTextId, setIsTextId] = useState(false);
  const [end_time, setEnd_time] = useState("");
  const [start_time, setStart_time] = useState("");
  const [evaluation_time, setEvaluation_time] = useState("");
  const [inventoryTypeId, setInventoryTypeId] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isInvite, setIsInvite] = useState(false);
  const [termsOptions, setTermsOptions] = useState([]);
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
      attachments: [],
    },
  ]);
  const [selectedStrategy, setSelectedStrategy] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(false);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [isTrafficSelected, setIsTrafficSelected] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [eventNo, setEventNo] = useState("");
  const [eventName, seteventName] = useState("");
  const [eventNumber, seteventNumber] = useState("");
  const [textareaId, setTextareaId] = useState(0);
  const [textareas, setTextareas] = useState([{ id: Date.now(), value: "" }]);
  const documentRowsRef = useRef([{ srNo: 1, upload: null }]);
  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);
  const [eventDescription, setEventDescription] = useState("");
  const [eventDetails, setEventDetails] = useState([]);
  const [onLoadScheduleData, setOnLoadScheduleData] = useState({});
  const [matchedTerm, setMatchedTerm] = useState({});
  const [materialSelectList, setMaterialSelectList] = useState([]);
  // MultiSelector value state, default to selected material type
  const selectedMaterialType = materialFormData?.[0]?.inventory_id;
  const defaultMaterialOption = materialSelectList.find(opt => opt.value === selectedMaterialType);
  const [multiSelectorValue, setMultiSelectorValue] = useState(defaultMaterialOption ? [defaultMaterialOption] : []);
  const [createdOn] = useState(new Date().toISOString().split("T")[0]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [eventSchedule, setEventSchedule] = useState("");
  const [scheduleData, setScheduleData] = useState({});
  const [addTerm, setAddTerm] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [data, setData] = useState([
    { user: "", date: "", status: "", remark: "" },
  ]);
  const [statusLogData, setStatusLogData] = useState([]);
  const [editableStatusLogData, setEditableStatusLogData] = useState([]);
  const [specificationData, setSpecificationData] = useState([]);
  const [eventTypeText, setEventTypeText] = useState("");
  const [tableData, setTableData] = useState([]); // State to hold dynamic data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Default total pages
  const [totalCount, setTotalCount] = useState(0); // Add this new state
  const [isSaving, setIsSaving] = useState(false);
  const [eventStatus, setEventStatus] = useState("pending");

  const pageSize = 100; // Number of items per page
  const pageRange = 6; // Number of pages to display in the pagination
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  console.log("Token from URL:", token, "Location:", location, "urlParams:", urlParams);

  const Loader = () => (
    <div className="loader-container">
      <div className="lds-ring">
        <div></div>
      </div>
      <p>fetching existing Data</p>
    </div>
  );
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

  const handleStatusLogChange = (index, field, value) => {
    setEditableStatusLogData(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
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
    setEventScheduleModal(true);
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

    // Since data is already in UTC format, format it directly for display
    const startDateTime = formatDateTime(data.start_time);
    const endDateTime = formatDateTime(data.end_time_duration);

    const scheduleText = `${startDateTime} to ${endDateTime}`;
    console.log("startDateTime", startDateTime, endDateTime);

    setEventScheduleText(scheduleText);
  };


  const handleVendorTypeModalShow = () => {
    setVendorModal(true);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
    setSelectedRows([]);
    setResetSelectedRows(true);
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
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    try {
      const response = await fetch(
        `${baseURL}rfq/events/terms_and_conditions?token=${token}&page=1`
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

  const fetchEventData = async () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    try {
      const response = await fetch(
        `${baseURL}rfq/events/${id}?token=${token}`
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
    setLoading(true);
    try {
      let formattedData = [];
      let totalPages = 1;
      let totalCount = 0; // Add this variable
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      // Wait for the inventoryTypeId to settle (with a timeout)
      setTimeout(async () => {
        if (inventoryTypeId.length > 0) {
          const response = await fetch(
            `${baseURL}rfq/events/vendor_list?token=${token}&event_id=${id}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(
              inventoryTypeId
            )}`
          );
          const data = await response.json();

          const vendors = Array.isArray(data.vendors)
            ? data.vendors
            : Array.isArray(data.data?.vendors)
              ? data.data.vendors
              : [];

          console.log("vendors on fetch :-----------", vendors);
          formattedData = vendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.full_name || vendor.organization_name || "-",
            email: vendor.email || "-",
            organisation: vendor.organization_name || "-",
            phone: vendor.contact_number || vendor.mobile || "-",
            city: vendor.city_id || "-",
            tags: vendor.tags || "-",
            pms_inventory_type_id: vendor.pms_inventory_type_id,
          }));

          totalPages =
            data?.pagination?.total_pages ||
            data?.data?.pagination?.total_pages ||
            1;
          totalCount =
            data?.pagination?.total_count ||
            data?.data?.pagination?.total_count ||
            0; // Get total count from API

          setTableData(formattedData);
          setSelectedVendors((prev) => {
            const newVendors = formattedData.filter(
              (vendor) =>
                !prev.some(
                  (existingVendor) => existingVendor.phone === vendor.phone
                )
            );
            return [
              ...prev,
              ...newVendors.map((vendor) => ({
                ...vendor,
                id: null,
                pms_supplier_id: vendor.id, // Assuming pms_supplier_id is the same as id
              })),
            ];
          });
          setCurrentPage(page);
          setTotalPages(totalPages);
          setTotalCount(totalCount); // Set the total count
        } else {
          const response = await fetch(
            `${baseURL}rfq/events/vendor_list?token=${token}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
          );
          const data = await response.json();
          const vendors = Array.isArray(data.vendors) ? data.vendors : [];
          console.log("vendors2 :-----------", vendors);
          
          formattedData = vendors.map((vendor) => ({
            id: vendor.id,
            name: vendor.full_name || vendor.organization_name || "-",
            email: vendor.email || "-",
            organisation: vendor.organization_name || "-",
            phone: vendor.contact_number || vendor.mobile || "-",
            city: vendor.city_id || "-",
            tags: vendor.tags || "-",
          }));

          totalPages = data?.pagination?.total_pages || 1;
          totalCount = data?.pagination?.total_count || 0; // Get total count from API

          setTableData(formattedData);
          setCurrentPage(page);
          setTotalPages(totalPages);
          setTotalCount(totalCount); // Set the total count
        }
      }, 2000); // Delay API call by 2 seconds
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    fetch(`${baseURL}rfq/events/material_types?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setMaterialSelectList(
          (data.inventory_types || []).map(item => ({
            value: item.value, // or item.value, depending on API
            label: item.name // or item.label
          }))
        );

        console.log("Fetched material types:", data, materialSelectList);

      });
  }, [eventDetails?.event_materials]);

  useEffect(() => {
    if (eventDetails?.event_materials?.[0]?.inventory_type_id && materialSelectList?.length > 0) {
      const defaultOption = materialSelectList.find(
        (opt) => String(opt.value) === String(eventDetails.event_materials[0].inventory_type_id)
      );
      if (defaultOption) {
        setMultiSelectorValue([defaultOption]);
      }
    }
  }, [eventDetails?.event_materials, materialSelectList]);


  useEffect(() => {
    if (eventDetails) {
      seteventName(eventDetails?.event_title);
      seteventNumber(eventDetails?.event_no);
      setSelectedTemplate(eventDetails?.applied_event_template?.event_template_id);
      setEventStatus(eventDetails?.status);
      setEventTypeText(eventDetails?.event_type_detail?.event_type);
      setEventDescription(eventDetails?.event_description);
      setScheduleData({
        start_time: eventDetails?.event_schedule?.start_time,
        end_time_duration: eventDetails?.event_schedule?.end_time,
        evaluation_time: eventDetails?.event_schedule?.evaluation_time,
      });
      setStart_time(eventDetails?.event_schedule?.start_time);
      setEnd_time(eventDetails?.event_schedule?.end_time);
      setEvaluation_time(eventDetails?.event_schedule?.evaluation_time);
      setStatusLogData(eventDetails?.status_logs);
      setEditableStatusLogData(eventDetails?.status_logs || []);
      setDocumentRows(eventDetails?.attachments || []);
      setGroupedData(eventDetails?.grouped_event_materials);

      const materials = eventDetails?.event_materials || [];
      const parsedMaterials = materials.map((material) => {
        const dynamicFields = Object.keys(material).reduce((acc, key) => {
          if (
            ![
              "id", "inventory_id", "quantity", "uom", "location", "rate",
              "amount", "section_name", "inventory_type_id", "inventory_sub_type_id", "_destroy"
            ].includes(key)
          ) {
            acc[key] = material[key] || "";
          }
          return acc;
        }, {});

        return {
          id: material.id,
          descriptionOfItem: material.descriptionOfItem || material.inventory_name || "",
          inventory_id: material.inventory_id,
          quantity: material.quantity,
          unit: material.unit,
          location: material.location,
          rate: material.rate,
          amount: material.amount,
          section_id: material.section_name || material.section_id,
          inventory_type_id: material.inventory_type_id,
          inventory_sub_type_id: material.inventory_sub_type_id,
          ...dynamicFields,
        };
      });

      setMaterialFormData(parsedMaterials);

      setSelectedVendors(
        eventDetails?.event_vendors?.map((vendor) => ({
          id: vendor.id,
          name: vendor.full_name,
          organisation: vendor.organization_name,
          phone: vendor.phone,
          pms_supplier_id: vendor.pms_supplier_id,
        }))
      );

      setSpecificationData(eventDetails?.mor_inventory_specifications);
    }
  }, [eventDetails, termsOptions]);

  const [documentRowsInitialized, setDocumentRowsInitialized] = useState(false);

  console.log("event", eventDetails?.start_time, eventDetails?.end_time, eventDetails?.event_schedule?.start_time, eventDetails?.event_schedule?.end_time);

  useEffect(() => {
    if (eventDetails?.start_time && !documentRowsInitialized) {
      seteventName(eventDetails?.event_title);
      setSelectedTemplate(
        eventDetails?.applied_event_template?.event_template_id
      );
      setEventStatus(eventDetails?.status);
      setEventTypeText(eventDetails?.event_type_detail?.event_type);
      setEventDescription(eventDetails?.event_description);
      console.log("eventSchedule", eventDetails);

      // Format the schedule text with proper timezone handling
      if (eventDetails?.event_schedule?.start_time && eventDetails?.event_schedule?.end_time) {
        const formatDateTime = (dateTime) => {
          const date = new Date(dateTime);
          return new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(date);
        };

        const startDateTime = formatDateTime(eventDetails.event_schedule.start_time);
        const endDateTime = formatDateTime(eventDetails.event_schedule.end_time);
        setEventScheduleText(`${startDateTime} to ${endDateTime}`);
      }

      // Fix: Update console.log to use the correct properties
      console.log("eventScheduleText:-", eventScheduleText, `${new Date(eventDetails?.event_schedule?.start_time).toLocaleString()} ~ ${new Date(
        eventDetails?.event_schedule?.end_time
      ).toLocaleString()}`);

      setStart_time(eventDetails?.event_schedule?.start_time);
      setEnd_time(eventDetails?.event_schedule?.end_time);
      setEvaluation_time(eventDetails?.event_schedule?.evaluation_time);
      setStatusLogData(eventDetails?.status_logs);
      setDocumentRows(eventDetails?.attachments || []);
      setDocumentRowsInitialized(true);
      setGroupedData(
        eventDetails?.grouped_event_materials
      )
      setMaterialFormData(
        eventDetails?.event_materials?.map((material) => {
          const dynamicFields = Object.keys(material).reduce((acc, key) => {
            if (
              ![
                "id",
                "inventory_id",
                "quantity",
                "uom",
                "location",
                "rate",
                "amount",
                "section_name",
                "inventory_type_id",
                "inventory_sub_type_id",
                "_destroy",
              ].includes(key)
            ) {
              acc[key] = material[key] || ""; // Default to an empty string if null
            }
            return acc;
          }, {});

          return {
            id: material.id,
            descriptionOfItem:
              material.descriptionOfItem || material.inventory_name || "",
            inventory_id: material.inventory_id,
            quantity: material.quantity,
            unit: material.unit,
            location: material.location,
            rate: material.rate,
            amount: material.amount,
            section_id: material.section_name || material.section_id,
            inventory_type_id: material.inventory_type_id,
            inventory_sub_type_id: material.inventory_sub_type_id,
            ...dynamicFields, // Include all dynamic fields
          };
        })
      );
      // setInventoryTypeId(
      //   ...new Set(
      //     materialFormData
      //       ?.filter((item) => item?.inventory_type_id)
      //       .map((item) => item?.inventory_type_id)
      //   )
      // );
      // console.log("materialFormData", materialFormData, inventoryTypeId); // Debug line

      setSelectedVendors(
        eventDetails?.event_vendors?.map((vendor) => ({
          id: vendor.id,
          name: vendor.full_name,
          organisation: vendor.organization_name,
          phone: vendor.phone,
          pms_supplier_id: vendor.pms_supplier_id,
        }))
      );
      // console.log("eventDetails:---",eventDetails);

      setSpecificationData(eventDetails?.mor_inventory_specifications);
    }
  }, [eventDetails, termsOptions, documentRowsInitialized]);

  useEffect(() => {
    if (eventDetails?.resource_term_conditions?.length > 0) {
      setIsTextId(true);
    }

    setTextareas(
      eventDetails?.resource_term_conditions?.map((term) => {
        return {
          textareaId: term.term_condition_id,
          id: term.id || null,
          value: term.term_condition.condition,
          defaultOption: matchedTerm
            ? { label: matchedTerm?.label, value: matchedTerm?.value }
            : { label: "Select Condition", value: "" },
        };
      })
    );
    eventDetails?.resource_term_conditions?.forEach((term) => {
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

  const isVendorSelected = (vendorId) => {
    return (
      selectedRows.some((vendor) => vendor.id === vendorId) ||
      selectedVendors.some((vendor) => vendor.pms_supplier_id === vendorId)
    );
  };

  const handleAddTextarea = () => {
    setTextareas([...textareas, { id: Date.now(), value: "", textareaId: 0 }]);
    setShowSelectBox(false);
    setAddTerm(true);
  };

  const handleRemoveTextarea = (index) => {
    const updatedTextareas = textareas.map((textarea) => {
      if (textarea.id === index) {
        // If it's an existing item (has a valid database ID), mark it for destruction
        const isValidId =
          (typeof textarea.id === "string" && textarea.id.length < 10) ||
          (typeof textarea.id === "number" && String(textarea.id).length < 10);

        if (isValidId) {
          return { ...textarea, _destroy: true };
        } else {
          // If it's a new item (Date.now() id), return null to filter it out
          return null;
        }
      }
      return textarea;
    }).filter(Boolean); // Remove null items (new items that were deleted)

    setTextareas(updatedTextareas);
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
              id: textarea.id,
              value: selectedCondition.condition,
              textareaId: selectedCondition.value,
            }
            : textarea
        )
      );
      setShowSelectBox(true);
    }
  };

  const handleAddDocumentRow = () => {
    setDocumentRows(prevRows => [
      ...prevRows,
      { srNo: prevRows.length + 1, upload: null }
    ]);
  };

  const handleRemoveDocumentRow = (index) => {
    setDocumentRows((prevRows) => {
      if (prevRows.length === 1) return prevRows;
      const updatedRows = [...prevRows];
      updatedRows.splice(index, 1);
      updatedRows.forEach((row, i) => (row.srNo = i + 1));
      documentRowsRef.current = updatedRows;
      return updatedRows;
    });
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setDocumentRows((prevRows) => {
        const updatedRows = [...prevRows];
        if (updatedRows[index]) {
          const { id, blob_id, created_at, updated_at, ...rest } =
            updatedRows[index];
          updatedRows[index] = {
            ...rest,
            upload: {
              filename: file.name,
              content: base64String,
              content_type: file.type,
            },
          };
        }
        documentRowsRef.current = updatedRows;
        return updatedRows;
      });
    };

    reader.readAsDataURL(file);

    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = "";
    }
  };


  const fetcher = (url, options) =>
    fetch(url, options).then((res) => res.json());

  const updateEvent = async (id, eventData) => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const url = `${baseURL}rfq/events/${id}?token=${token}`;
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

  const scrollToTop = () => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", top: 0 });
    }
  };

  const validateForm = () => {
    if (!eventName) {
      toast.error("Event name is required");
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
      !onLoadScheduleData?.end_time_duration ||
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

  const eventData2 = {
    event: {
      event_vendors_attributes:
        selectedVendors ||
        [].map((vendor) => ({
          status: 1,
          pms_supplier_id: vendor.pms_supplier_id,
          id: vendor.id,
        })),
      status_logs_attributes: [
        {
          status: "pending",
          created_by_id: 2,
          remarks: "Initial status",
          comments: "No comments",
        },
      ],
    },
  };

  const [eventData1, setEventData1] = useState(eventData2);

  // Convert datetime to UTC ISO string format with Z
  const toUTCISOString = (dateTime) => {
    if (!dateTime) return "";

    // If dateTime is already in correct ISO string format with Z, just return it
    if (typeof dateTime === "string" && dateTime.endsWith("Z")) {
      return dateTime;
    }

    // If it's a Date object or timestamp, convert it to UTC
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "";

    // Return ISO string in UTC format with Z
    return date.toISOString();
  };

  // Convert datetime to UTC ISO string format with Z for end time
  const toUTCEndTimeString = (dateTime) => {
    if (!dateTime) return "";

    // If dateTime is already in correct ISO string format with Z, just return it
    if (typeof dateTime === "string" && dateTime.endsWith("Z")) {
      return dateTime;
    }

    // If it's a Date object or timestamp, convert it to UTC
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "";

    // Return ISO string in UTC format with Z
    return date.toISOString();
  };

  // Convert datetime to UTC ISO string format with Z for start time
  const toUTCStartTimeString = (dateTime) => {
    if (!dateTime) return "";

    // If dateTime is already in correct ISO string format with Z, just return it
    if (typeof dateTime === "string" && dateTime.endsWith("Z")) {
      return dateTime;
    }

    // If it's a Date object or timestamp, convert it to UTC
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "";

    // Return ISO string in UTC format with Z
    return date.toISOString();
  };


  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!eventName || !createdOn || selectedVendors.length === 0) {
      scrollToTop();
      toast.error("Please fill all the required fields.", {
        autoClose: 1000,
      });
      setTimeout(() => {
        setLoading(false);
      }, 500);

      return;
    }

    setSubmitted(true);

    const attachments = documentRows
      .filter(row =>
        (row.upload && row.upload.filename) ||
        (row.id && row.filename && row.content_type)
      )
      .map(row => row.upload ? row.upload : {
        id: row.id,
        filename: row.filename,
        content_type: row.content_type,
        ...(row.blob_id ? { blob_id: row.blob_id } : {}),
      });
    console.log("attachments:--", attachments);


    // Build attachments ONLY from current documentRows (UI state)
    const eventData = {
      event: {
        event_title: eventName || eventDetails?.event_title || "",
        created_on: createdOn || eventDetails?.created_on || "",
        status: eventStatus || eventDetails?.status || "",
        event_description: eventDescription || eventDetails?.event_description || "",
        event_schedule_attributes: {
          start_time:
            toUTCStartTimeString(scheduleData.start_time) ||
            toUTCISOString(start_time) ||
            (eventDetails?.event_schedule?.start_time) ||
            "",
          end_time:
            toUTCEndTimeString(scheduleData.end_time_duration) ||
            toUTCISOString(end_time) ||
            (eventDetails?.event_schedule?.end_time) ||
            "",
          evaluation_time:
            scheduleData.evaluation_time ||
            evaluation_time ||
            eventDetails?.event_schedule?.evaluation_time ||
            "",
        },
        event_type_detail_attributes: {
          event_type: eventType || eventDetails?.event_type_detail?.event_type || "",
          award_scheme: awardType || eventDetails?.event_type_detail?.award_scheme || "",
          event_configuration: selectedStrategy || eventDetails?.event_type_detail?.event_configuration || "",
          time_extension_type:
            dynamicExtensionConfigurations.time_extension_type ||
            eventDetails?.event_type_detail?.time_extension_type ||
            "",
          triggered_time_extension_on_last:
            dynamicExtensionConfigurations.triggered_time_extension_on_last ||
            eventDetails?.event_type_detail?.triggered_time_extension_on_last ||
            "",
          extend_event_time_by:
            Number(dynamicExtensionConfigurations.extend_event_time_by) ||
            eventDetails?.event_type_detail?.extend_event_time_by ||
            0,
          enable_english_auction:
            typeof eventDetails?.event_type_detail?.enable_english_auction === "boolean"
              ? eventDetails?.event_type_detail?.enable_english_auction
              : true,
          extension_time_min: eventDetails?.event_type_detail?.extension_time_min || 5,
          extend_time_min: eventDetails?.event_type_detail?.extend_time_min || 10,
          time_extension_change:
            dynamicExtensionConfigurations.time_extension_on_change_in ||
            eventDetails?.event_type_detail?.time_extension_change ||
            "",
          delivery_date:
            dynamicExtensionConfigurations.delivery_date ||
            eventDetails?.event_type_detail?.delivery_date ||
            "",
        },
        event_materials_attributes: (materialFormData.length > 0
          ? materialFormData
          : eventDetails?.event_materials || []
        ).map((material) => {
          const dynamicFields = Object.keys(material).reduce((acc, key) => {
            if (
              ![
                "id",
                "inventory_id",
                "quantity",
                "unit",
                "location",
                "rate",
                "amount",
                "section_id",
                "inventory_type_id",
                "inventory_sub_type_id",
                "_destroy",
                "descriptionOfItem",
                "subMaterialType",
                "pms_brand_id",
                "generic_info_id",
                "pms_colour_id",
                "attachments",
              ].includes(key)
            ) {
              acc[key] = material[key] || null;
            }
            return acc;
          }, {});
          console.log("material", material.unit);


          return {
            id: material.id || null,
            inventory_id: Number(material.inventory_id) || null,
            quantity: Number(material.quantity),
            uom: material.unit,
            location: material.location,
            rate: Number(material.rate),
            amount: material.amount,
            sub_section_name: material.sub_section_id,
            section_name: material.section_id,
            inventory_type_id: material.inventory_type_id,
            inventory_sub_type_id: material.inventory_sub_type_id,
            pms_brand_id: material.pms_brand_id || null,
            pms_colour_id: material.pms_colour_id || null,
            generic_info_id: material.generic_info_id || null,
            attachments: material.attachments || [],
            _destroy: material._destroy || false,
            ...dynamicFields,
          };
        }),
        event_vendors_attributes: (selectedVendors.length > 0
          ? selectedVendors
          : eventDetails?.event_vendors || []
        ).map((vendor) => ({
          status: 1,
          pms_supplier_id: vendor.pms_supplier_id,
          id: vendor.id,
        })),
        status_logs_attributes: editableStatusLogData.map((log) => ({
          id: log.id || null,
          status: log.status || "pending",
          created_by_id: log.created_by_id || 2,
          remarks: log.remark || log.remarks || "",
          comments: log.comment || log.comments || "",
        })),
        resource_term_conditions_attributes: textareas.map((textarea) => {
          // Only include id if it's a string and length < 10 (likely a real DB id)
          // or if it's a number and less than 1e9 (to avoid Date.now() values)
          const isValidId =
            (typeof textarea.id === "string" && textarea.id.length < 10) ||
            (typeof textarea.id === "number" && String(textarea.id).length < 10);

          const baseAttributes = {
            term_condition_id: textarea.textareaId,
            condition_type: "general",
            condition: textarea.value,
          };

          // If marked for destruction, add the _destroy flag
          if (textarea._destroy) {
            return {
              id: textarea.id,
              _destroy: true,
              ...baseAttributes,
            };
          }

          return isValidId
            ? {
              id: textarea.id,
              ...baseAttributes,
            }
            : {
              ...baseAttributes,
            };
        }),
        attachments,
        applied_event_template: {
          event_template_id:
            selectedTemplate || eventDetails?.applied_event_template?.event_template_id,
          applied_bid_template_fields_attributes: (bidTemplateFields.length > 0
            ? bidTemplateFields
            : eventDetails?.applied_event_template?.applied_bid_template_fields || []
          ).map((field) => ({
            field_name: field.field_name,
            is_required: field.is_required,
            is_read_only: field.is_read_only,
            field_owner: field.field_owner,
            extra_fields: field.extra_fields || null,
          })),
          applied_bid_material_template_fields_attributes: (additionalFields.length > 0
            ? additionalFields
            : eventDetails?.applied_event_template?.applied_bid_material_template_fields || []
          )
            .filter((field) => field.field_name !== "Sr no.")
            .map((field) => ({
              field_name: field.field_name,
              is_required: field.is_required || false,
              is_read_only: field.is_read_only || false,
              field_owner: field.field_owner || "user",
              field_type: field.field_type || "string",
              extra_fields: field.extra_fields || null,
            })),
        },
      },
    };

    console.log("eventData:--", JSON.stringify(eventData, null, 2));

    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      const response = await fetch(
        `${baseURL}rfq/events/${id}?token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );
      console.log("eventData:--", eventData, attachments);

      if (response.ok) {
        const data = await response.json();
        toast.success("Event updated successfully!", { autoClose: 1000 });
        setTimeout(() => {
          navigate(
            `/event-list?token=${token}`
          );
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to update event. Please try again.",
          { autoClose: 1000 }
        );
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("An unexpected error occurred. Please try again.", {
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

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      // Reset to show all data when search is empty
      setFilteredTableData(tableData);
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    } else {
      // Filter table data based on search query across all columns
      const filtered = tableData.filter((vendor) => {
        const searchFields = [
          vendor.name,
          vendor.email,
          vendor.organisation,
          vendor.phone,
          vendor.city,
          vendor.tags,
          vendor.id?.toString()
        ];

        return searchFields.some(field =>
          field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
      });

      setFilteredTableData(filtered);

      // Still fetch suggestions for the dropdown
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setIsSuggestionsVisible(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setIsSuggestionsVisible(false);
    fetchData(1, suggestion.first_name, "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsVisible(false);
    fetchData(1, searchTerm, selectedCity);
  };

  const handleResetSearch = async () => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredTableData(tableData);
    } else {
      setSearchTerm("");
      setFilteredTableData(tableData);
    }
  };

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredTableData(tableData);
    }
  }, [searchTerm, tableData]);

  const fetchSuggestions = async (query) => {
    try {
      // Extract inventory_id values from existingData
      const inventoryIds = Object.values(existingData)
        .flatMap((subType) => Object.values(subType))
        .map((item) => item.inventory_id);

      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      const response = await fetch(
        `${baseURL}rfq/events/vendor_list?token=${token}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${query}&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(
          inventoryIds
        )}`
      );
      const data = await response.json();
      setSuggestions(data.vendors || []);

      setIsSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => { }, [eventType, awardType]);

  const handleStatusChange = (selectedOption) => {
    setEventStatus(selectedOption);
  };

  const handleSaveButtonClick = () => {
    setSelectedVendors((prev) => {
      const newVendors = selectedRows.filter(
        (vendor) =>
          !prev.some((existingVendor) => existingVendor.id === vendor.id)
      );

      return [
        ...prev,
        ...newVendors.map((vendor) => ({
          ...vendor,
          id: null,
          pms_supplier_id: vendor.id,
        })),
      ];
    });

    setVendorModal(false);
    setSelectedRows([]);
    setResetSelectedRows(true);
  };

  const handleRemoveVendor = (id) => {
    const updatedSelected = selectedVendors.filter(
      (vendor) => vendor.pms_supplier_id !== id
    );

    setSelectedVendors(updatedSelected);
  };

  useEffect(() => { }, [filteredTableData]);

  const validateInviteVendorForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number validation
    // const gstRegex =
    //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!inviteVendorData.name) {
      errors.name = "Name is required";
      toast.error(errors.name);
    }
    if (!inviteVendorData.email || !emailRegex.test(inviteVendorData.email)) {
      errors.email = "Valid email is required";
      toast.error(errors.email);
    }
    if (
      !inviteVendorData.mobile ||
      !mobileRegex.test(inviteVendorData.mobile)
    ) {
      errors.mobile = "Valid mobile number is required";
      toast.error(errors.mobile);
    }
    if (
      inviteVendorData.gstNumber 
      // !gstRegex.test(inviteVendorData.gstNumber)
    ) {
      errors.gstNumber = "Invalid GST number format";
      toast.error(errors.gstNumber);
    }
    if (
      inviteVendorData.panNumber &&
      !panRegex.test(inviteVendorData.panNumber)
    ) {
      errors.panNumber = "Invalid PAN number format";
      toast.error(errors.panNumber);
    }
    if (!inviteVendorData.company) {
      errors.company = "Company is required";
      toast.error(errors.company);
    }
    if (!inviteVendorData.organization) {
      errors.organization = "Organization Name is required";
      toast.error(errors.organization);
    }
    return errors;
  };

  const [inviteVendorData, setInviteVendorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gstinApplicable: '',
    gstNumber: '',
    vendorType: '',
    organizationType: '',
    natureOfBusiness: '',
    panNumber: '',
    department: '',
    organizationName: '',
  });
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);

  useEffect(() => {
    // Fetch organization type list from API
    fetch(`${baseURL}rfq/events/type_of_organizations_list?token=${token}`)
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
    fetch(`${baseURL}rfq/events/department_list?token=${token}`)
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
    fetch(`${baseURL}rfq/events/supplier_type_list?token=${token}`)
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
    fetch(`${baseURL}rfq/events/nature_of_business_list?token=${token}`)
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

  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const handleInviteVendor = async (event) => {
    event.preventDefault();
    setIsInviteLoading(true);
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!inviteVendorData.firstName) {
      toast.error('First Name is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.lastName) {
      toast.error('Last Name is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.email || !emailRegex.test(inviteVendorData.email)) {
      toast.error('Valid Email is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.mobile || !mobileRegex.test(inviteVendorData.mobile)) {
      toast.error('Valid Mobile Number is required');
      setIsInviteLoading(false);
      return;
    }
    if (inviteVendorData.gstinApplicable === 'yes' && (!inviteVendorData.gstNumber )) {
      toast.error('Valid GSTIN is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.panNumber || !panRegex.test(inviteVendorData.panNumber)) {
      toast.error('Valid PAN Number is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.vendorType) {
      toast.error('Vendor Type is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.organizationType) {
      toast.error('Organization Type is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.natureOfBusiness) {
      toast.error('Nature of Business is required');
      setIsInviteLoading(false);
      return;
    }
    if (!inviteVendorData.department) {
      toast.error('Department is required');
      setIsInviteLoading(false);
      return;
    }
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
      organization_name: inviteVendorData.organizationName,
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
        toast.success('Vendor invited successfully!');
        // Add the new vendor to the selectedVendors table
        const newVendor = response.data;
        if (newVendor) {
          setSelectedVendors((prev) => [
            ...prev,
            {
              id: null,
              pms_supplier_id: newVendor?.id,
              name: newVendor?.full_name || `${inviteVendorData.firstName} ${inviteVendorData.lastName}`,
              phone: newVendor?.mobile || inviteVendorData.mobile,
              organisation: newVendor?.organization_name || '',
              email: newVendor?.email || inviteVendorData.email,
            },
          ]);
        }
        // Optionally reset form here
        handleInviteModalClose();
      } else {
        toast.error('Failed to invite vendor: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Failed to invite vendor: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsInviteLoading(false);
    }
  };

  // const handleInviteModalClose = () => {
  //   setInviteModal(false);
  // };

  useEffect(() => {
    if (eventDetails?.event_vendors?.length > 0) {
      const existingVendors = eventDetails.event_vendors.map((vendor) => ({
        id: vendor.id,
        name: vendor.full_name || vendor.organization_name || "-",
        email: vendor.email || "-",
        organisation: vendor.organization_name || "-",
        phone: vendor.contact_number || vendor.mobile || "-",
        city: vendor.city_id || "-",
        tags: vendor.tags || "-",
        pms_supplier_id: vendor.pms_supplier_id,
      }));
    }
  }, [eventDetails, tableData]);
  // console.log("inventoryTypeId", inventoryTypeId);

  useEffect(() => {
    // console.log("inventoryTypeId changed:", inventoryTypeId); // Debugging line

    const fetchMaterialTypes = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      try {
        const response = await fetch(
          `${baseURL}rfq/events/material_types?token=${token}`
        );
        // You may want to handle the response here
      } catch (error) {
        console.error("Error fetching material types:", error);
      }
    };

    // if (inventoryTypeId.length > 0) {
    fetchMaterialTypes();
    // }
  }, [inventoryTypeId]); // Trigger when inventoryTypeId changes

  return (
    <>
      <div className="website-content overflowY-auto">
        <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a
                  href={`/event-list?token=${token}`}
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
          <h5 className="mt-3 ms-3">Edit Event</h5>
          <div style={{ width: "15%" }}></div>
        </div>
        <div className="pt-3" ref={myRef}>
          <div className="module-data-section mx-3">
            {/* <div className="card p-3 mt-3"> */}
            <div className="row align-items-end justify-items-end mb-5 mt-3">
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Name
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
                    Event Number
                  </label>
                </div>
                <input
                  className="form-control"
                  placeholder="Enter Event Name"
                  value={eventNumber}
                  onChange={(e) => seteventName(e.target.value)}
                  disabled
                />
              </div>
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">Created On</label>
                  <input
                    className="form-control"
                    type="date"
                    defaultValue={createdOn}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-6 mt-0 mb-2">
                <div className="form-group">
                  <label className="po-fontBold">
                    Event Type <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <input
                  className="form-control"
                  style={{ textTransform: "uppercase" }}
                  onClick={handleEventTypeModalShow}
                  placeholder="Configure The Event"
                  value={eventTypeText}
                  readOnly
                />
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
                  placeholder="Select Event Schedule"
                  value={eventScheduleText}
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
                    { label: "Draft", value: "draft" },
                  ]}
                  onChange={handleStatusChange}
                  defaultValue={eventStatus || "draft"}
                />
              </div>
            </div>

            <CreateRFQForm
              data={materialFormData}
              setData={setMaterialFormData}
              eventId={eventDetails?.id}
              isService={isService}
              templateData={eventDetails?.applied_event_template}
              existingData={eventDetails?.grouped_event_materials}
              deliveryData={eventDetails?.delivery_schedules}
              isMorSelected={eventDetails?.from_mor}
              updateSelectedTemplate={setSelectedTemplate}
              updateBidTemplateFields={setBidTemplateFields}
              updateAdditionalFields={setAdditionalFields}
              isMor={false}
              morNumber={eventDetails?.event_title}
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
                      <th>Name</th>
                      {/* <th>Organization</th> */}
                      <th>Mob No.</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isInvite ? (
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
                    ) : selectedVendors?.length === 0 ? (
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
                          {/* <td>{vendor.organisation}</td> */}
                          <td>{vendor.phone}</td>
                          <td>Invited</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                handleRemoveVendor(vendor.pms_supplier_id)
                              }
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
              {/* New Document Attachments Table */}
              <div className="tbl-container mb-4" style={{ maxHeight: "500px" }}>

                <table className="w-100">
                  <thead>
                    <tr>
                      <th className="main2-th">File Type</th>
                      <th className="main2-th">File Name </th>
                      <th className="main2-th">Upload At</th>
                      <th className="main2-th">Upload File</th>
                      <th className="main2-th" style={{ width: 100 }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentRows.map((att, index) => (
                      <tr key={att.id || index}>
                        <td>
                          <input
                            className="form-control document_content_type"
                            readOnly
                            disabled
                            value={att.fileType || att.content_type || ""}
                            placeholder="File Type"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control file_name"
                            required
                            value={att.fileName || att.document_name || "no files selected yet"}
                            onChange={e => {
                              // Update fileName in documentRows
                              setDocumentRows(prev => {
                                const updated = [...prev];
                                updated[index] = {
                                  ...updated[index],
                                  fileName: e.target.value,
                                };
                                return updated;
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control created_at"
                            readOnly
                            disabled
                            type="datetime-local"
                            step="1"
                            value={
                              att.uploadDate ||
                              (att.created_at
                                ? new Date(att.created_at).toISOString().slice(0, 19)
                                : "")
                            }
                          />
                        </td>

                        <td>
                          {!att.isExisting && (
                            <input
                              type="file"
                              className="form-control"
                              required
                              onChange={e => {
                                // Update file in documentRows
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result.split(",")[1];
                                  setDocumentRows(prev => {
                                    const updated = [...prev];
                                    updated[index] = {
                                      ...updated[index],
                                      upload: {
                                        filename: file.name,
                                        content: base64String,
                                        content_type: file.type,
                                      },
                                      fileName: file.name,
                                      fileType: file.type,
                                      isExisting: false,
                                      uploadDate: new Date().toISOString().slice(0, 19),
                                    };
                                    return updated;
                                  });
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          )}
                        </td>
                        <td className="document">
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="attachment-placeholder">
                              {att.isExisting && att.fileUrl && (
                                <div className="file-box">
                                  <div className="image">
                                    <a href={att.fileUrl} target="_blank" rel="noreferrer">
                                      <img
                                        alt="preview"
                                        className="img-responsive"
                                        height={50}
                                        width={50}
                                        src={att.fileUrl}
                                      />
                                    </a>
                                  </div>
                                  <div className="file-name">
                                    <a href={att.fileUrl} download>
                                      <span className="material-symbols-outlined">file_download</span>
                                    </a>
                                    <span>{att.fileName || att.document_name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger"
                              onClick={() => {
                                // Remove document row
                                setDocumentRows(prev => {
                                  // if (prev.length === 1) return prev;
                                  const updated = [...prev];
                                  updated.splice(index, 1);
                                  return updated;
                                });
                              }}
                            >
                              <span className="material-symbols-outlined">cancel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  {(!textareas || textareas.filter(t => t.id !== null && !t._destroy).length === 0) ? (
                    <tr>
                      <td colSpan={3} className="text-center">No Terms & Conditions available</td>
                    </tr>
                  ) : (
                    textareas.map((textarea, idx) => {
                      if (textarea.id === null || textarea._destroy) {
                        return null;
                      }
                      return (
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
                              defaultValue={
                                termsOptions.find(
                                  (option) => option.condition === textarea.value
                                )?.value
                              }
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
                            // disabled={textareas.length === 1}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {statusLogData?.length > 0 && (
              <>
                <h5 className="mt-5">Audit Log</h5>
                <div className="tbl-container mt-1" style={{ maxHeight: "450px" }}>
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Status</th>
                        {/* <th>Remark</th> */}
                        {/* <th>Comment</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {editableStatusLogData?.slice(0, 10).map((log, idx) => {
                        if (log.id === null) return null;
                        return (
                          <tr key={log.id || idx}>
                            <td className="text-start">{idx + 1}</td>
                            <td className="text-start">{log.created_by_name || "-"}</td>
                            <td className="text-start">
                              {log.created_at
                                ? `${new Date(log.created_at).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }).replaceAll("/", "-")}, ${new Date(log.created_at).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }).toUpperCase()}`
                                : "-"}
                            </td>
                            <td className="text-start">
                              {log.status
                                ? log.status.charAt(0).toUpperCase() + log.status.slice(1)
                                : ""}
                            </td>
                            {/* <td className="text-start">{log.remarks || ""}</td>
                              <td className="text-start">{log.comments || ""}</td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {editableStatusLogData?.length > 10 && (
                    <div className="mt-2 text-start">
                      <span
                        className="boq-id-link"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {/* setShowAuditModal(true) or your logic here */ }}
                      >
                        Show More
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="row mt-2 justify-content-end align-items-center mt-4">
              {/* <div className class="col-md-2">
                  <button className="purple-btn2 w-100">Preview</button>
                </div> */}
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
                      `/event-list?token=${token}`
                    );
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
            {/* </div> */}
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
                    <div className="input-group w-75 position-relative">
                      <div className="d-flex w-100">
                        <input
                          type="search"
                          id="searchInput"
                          className="tbl-search form-control w-75"
                          placeholder="Search Vendors"
                          value={searchTerm}
                          onChange={handleInputChange}
                          onFocus={() => setIsSuggestionsVisible(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setIsSuggestionsVisible(false),
                              200
                            )
                          }
                        />
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-md btn-default"
                            onClick={handleSearchSubmit}
                          >
                            <SearchIcon />
                          </button>
                        </div>
                        <div className="w-25">
                          {/* <MultiSelector
                            options={materialSelectList}
                            onChange={async (selectedOptions) => {
                              if (selectedOptions && selectedOptions.length > 0) {
                                const selectedValues = selectedOptions.map((option) => option.value);
                                const filteredData = tableData.filter((vendor) =>
                                  selectedValues.some((value) =>
                                    Array.isArray(vendor.pms_inventory_type_id)
                                      ? vendor.pms_inventory_type_id.includes(value)
                                      : vendor.pms_inventory_type_id === value
                                  )
                                );
                                setFilteredTableData(filteredData);
                              } else {
                                // Reset to show all vendors if no option is selected
                                try {
                                  const response = await fetch(
                                    `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
                                  );
                                  const data = await response.json();
                                  const vendors = Array.isArray(data.vendors) ? data.vendors : [];
                                  const formattedData = vendors.map((vendor) => ({
                                    id: vendor.id,
                                    name: vendor.full_name || vendor.organization_name || "-",
                                    email: vendor.email || "-",
                                    organisation: vendor.organization_name || "-",
                                    phone: vendor.contact_number || vendor.mobile || "-",
                                    city: vendor.city_id || "-",
                                    tags: vendor.tags || "-",
                                    pms_inventory_type_id: vendor.pms_inventory_type_id,
                                  }));
                                  setFilteredTableData(formattedData); // Reset to the full data
                                } catch (error) {
                                  console.error("Error fetching full vendor data:", error);
                                }
                              }
                            }}
                          /> */}
                          <MultiSelector
                            options={materialSelectList}
                            value={multiSelectorValue}
                            onChange={async (selectedOptions) => {
                              setMultiSelectorValue(selectedOptions);
                              try {
                                const urlParams = new URLSearchParams(location.search);
                                const token = urlParams.get("token");
                                let selectedValues;
                                if (selectedOptions && selectedOptions.length > 0) {
                                  selectedValues = selectedOptions.map((option) => option.value);
                                } else {
                                  // Use eventDetails?.event_materials?.[0]?.inventory_id for default
                                  selectedValues = eventDetails?.event_materials?.[0]?.inventory_id
                                    ? [eventDetails.event_materials[0].inventory_id]
                                    : [];
                                }
                                const response = await fetch(
                                  `${baseURL}rfq/events/vendor_list?token=${token}&page=1&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(selectedValues)}`
                                );
                                const data = await response.json();
                                const vendors = Array.isArray(data.vendors)
                                  ? data.vendors
                                  : [];
                                  console.log("vendors :-----------", vendors);
                                  
                                const formattedData = vendors.map((vendor) => ({
                                  id: vendor.id,
                                  name:
                                    vendor.full_name ||
                                    vendor.organization_name ||
                                    "-",
                                  email: vendor.email || "-",
                                  organisation:
                                    vendor.organization_name || "-",
                                  phone:
                                    vendor.contact_number ||
                                    vendor.mobile ||
                                    "-",
                                  city: vendor.city_id || "-",
                                  tags: vendor.tags || "-",
                                  pms_inventory_type_id:
                                    vendor.pms_inventory_type_id,
                                }));
                                setFilteredTableData(formattedData);
                              } catch (error) {
                                console.error("Error fetching vendor data:", error);
                              }
                            }}
                          />
                        </div>
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
                              style={{ cursor: "pointer" }}
                              className="p-2 w-100"
                            >
                              {suggestion.full_name}
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
                        {console.log("filteredTableData", filteredTableData)
                        }
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
                        style={{ width: "100%" }}
                        scrollable={true}
                      />
                    ) : (
                      <p>No vendors found</p>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center px-1 mt-2">
                    <ul className="pagination justify-content-center d-flex ">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""
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
                        className={`page-item ${currentPage === 1 ? "disabled" : ""
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
                          className={`page-item ${currentPage === pageNumber ? "active" : ""
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
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
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

                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
                        Showing{" "}
                        {totalCount > 0
                          ? (currentPage - 1) * pageSize + 1
                          : 0}{" "}
                        to{" "}
                        {totalCount > 0
                          ? (currentPage - 1) * pageSize + filteredTableData.length
                          : 0}{" "}
                        of {totalCount} entries
                      </p>
                    </div>
                  </div>
                </>
              }
            />
            <Modal show={inviteModal} onHide={handleInviteModalClose} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Invite New Vendor</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <form className="p-2" onSubmit={handleInviteVendor}>
                    <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">First Name</label>
                        <input className="form-control" type="text" name="firstName" placeholder="Enter First Name" value={inviteVendorData.firstName} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Last Name</label>
                        <input className="form-control" type="text" name="lastName" placeholder="Enter Last Name" value={inviteVendorData.lastName} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Email</label>
                        <input className="form-control" type="email" name="email" placeholder="Enter Email Address" value={inviteVendorData.email} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Phone Number</label>
                        <input className="form-control" type="text" name="mobile" inputMode="numeric" pattern="[0-9]*" maxLength={10} onKeyDown={(e) => { const invalidChars = ['e', 'E', '+', '-', '.', ',']; if (invalidChars.includes(e.key) || (isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab')) { e.preventDefault(); } }} placeholder="Enter Phone Number" value={inviteVendorData.mobile} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">GSTIN Applicable</label>
                        <select className="form-control" name="gstinApplicable" value={inviteVendorData.gstinApplicable} onChange={handleInviteVendorChange} required>
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                    {inviteVendorData.gstinApplicable === 'yes' && (
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">GSTIN</label>
                          <input className="form-control" type="text" name="gstNumber" placeholder="Enter GSTIN" value={inviteVendorData.gstNumber} onChange={handleInviteVendorChange} required />
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Vendor Type</label>
                        <SingleSelector options={vendorTypeOptions} value={vendorTypeOptions.find(opt => opt.value === inviteVendorData.vendorType) || null} onChange={handleVendorTypeChange} placeholder="Select Vendor Type" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Organization Type</label>
                        <SingleSelector options={organizationTypeOptions} value={organizationTypeOptions.find(opt => opt.value === inviteVendorData.organizationType) || null} onChange={handleOrganizationTypeChange} placeholder="Select Organization Type" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Nature of Business</label>
                        <SingleSelector options={natureOfBusinessOptions} value={natureOfBusinessOptions.find(opt => opt.value === inviteVendorData.natureOfBusiness) || null} onChange={handleNatureOfBusinessChange} placeholder="Select Nature Of Business" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">PAN No.</label>
                        <input className="form-control" type="text" name="panNumber" placeholder="Enter PAN Number" value={inviteVendorData.panNumber} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">Department</label>
                          <SingleSelector options={departmentOptions} value={departmentOptions.find(opt => opt.value === inviteVendorData.department) || null} onChange={handleDepartmentChange} placeholder="Select Department" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">Organization Name</label>
                          <input className="form-control" type="text" name="organizationName" placeholder="Enter Organization Name" value={inviteVendorData.organizationName} onChange={handleInviteVendorChange} />
                        </div>
                      </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2 gap-2">
                    <button className="purple-btn2" onClick={handleInviteModalClose} type="button" disabled={isInviteLoading}>Close</button>
                    <button className="purple-btn2" type="submit" disabled={isInviteLoading}>
                      {isInviteLoading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      Save Changes
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
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