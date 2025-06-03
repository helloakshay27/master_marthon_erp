import React, { useState, useEffect, useRef } from "react";

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
import { useParams, useNavigation, useNavigate } from "react-router-dom";
import { citiesList, participantsTabColumns } from "../constant/data";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PopupBox from "../components/base/Popup/Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../confi/apiDomain";
import { set } from "lodash";
import { specificationColumns } from "../constant/data";

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
  const [specificationData, setSpecificationData] = useState([]);

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

    const adjustTimeZone = (dateTime) => {
      const date = new Date(dateTime);
      const utcDate = new Date(
        date.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone }));
      return localDate;
    };

    const startDateTime = formatDateTime(adjustTimeZone(data.start_time));
    const endDateTime = formatDateTime(adjustTimeZone(data.end_time_duration));

    const scheduleText = `${startDateTime} to ${endDateTime}`;
    setEventScheduleText(scheduleText);
  };

  const [eventScheduleText, setEventScheduleText] = useState("");

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

  // useEffect(() => {
  //   const newlyFetchedIds = materialFormData
  //     ?.filter((item) => item?.inventory_type_id)
  //     ?.map((item) => item?.inventory_type_id);
  //   setInventoryTypeId([...new Set(newlyFetchedIds)]); // Ensure unique IDs
  //   fetchData(1, searchTerm, selectedCity); // Fetch data whenever inventoryTypeId changes
  // }, [materialFormData]); // Triggered when materialFormData changes

  const fetchTermsAndConditions = async () => {
    try {
      const response = await fetch(
        `${baseURL}rfq/events/terms_and_conditions?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
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

  const [isSaving, setIsSaving] = useState(false);
  const [eventStatus, setEventStatus] = useState("pending");

  const fetchEventData = async () => {
    try {
      const response = await fetch(
        `${baseURL}rfq/events/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

      // Wait for the inventoryTypeId to settle (with a timeout)
      setTimeout(async () => {
        if (inventoryTypeId.length > 0) {
          const response = await fetch(
            `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&event_id=${id}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(
              inventoryTypeId
            )}`
          );
          const data = await response.json();

          const vendors = Array.isArray(data.vendors)
            ? data.vendors
            : Array.isArray(data.data?.vendors)
              ? data.data.vendors
              : [];


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
        } else {
          const response = await fetch(
            `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
          );
          const data = await response.json();
          const vendors = Array.isArray(data.vendors) ? data.vendors : [];

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
          const filteredData = formattedData.filter(
            (vendor) =>
              !selectedVendors.some(
                (selected) => selected.pms_supplier_id === vendor.id
              )
          );

          setTableData(filteredData);
          setCurrentPage(page);
          setTotalPages(totalPages);
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

  const [termsOptions, setTermsOptions] = useState([]);

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

  useEffect(() => {
    if (eventDetails && !documentRowsInitialized) {
      seteventName(eventDetails?.event_title);
      setSelectedTemplate(
        eventDetails?.applied_event_template?.event_template_id
      );
      setEventStatus(eventDetails?.status);
      setEventTypeText(eventDetails?.event_type_detail?.event_type);
      setEventDescription(eventDetails?.event_description);
      setEventScheduleText(
        `${new Date(eventDetails?.start_time).toLocaleString()} ~ ${new Date(
          eventDetails?.end_time
        ).toLocaleString()}`
      );
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
      selectedVendors.some((vendor) => vendor.id === vendorId)
    );
  };

  const handleAddTextarea = () => {
    setTextareas([...textareas, { id: Date.now(), value: "", textareaId: 0 }]);
    setShowSelectBox(false);
    setAddTerm(true);
  };

  const handleRemoveTextarea = (index) => {
    const updatedTextareas = textareas.filter(
      (textarea) => textarea.id !== index
    );
    setTextareas([...updatedTextareas]);
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
    const newRow = { srNo: documentRows.length + 1, upload: null };
    documentRowsRef.current.push(newRow);
    setDocumentRows([...documentRowsRef.current]);
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
    const url = `${baseURL}rfq/events/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
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

  const toISTISOString = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      console.warn("Invalid dateTime passed to toISTISOString:", dateTime);
      return "";
    }
    date.setMinutes(date.getMinutes());
    return date.toISOString().replace('Z', '+05:30');
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
            toISTISOString(scheduleData.start_time) ||
            (start_time) ||
            (eventDetails?.event_schedule?.start_time) ||
            "",
          end_time:
            toISTISOString(scheduleData.end_time_duration) ||
            (end_time) ||
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
          console.log("material",material);
          

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
        status_logs_attributes: [
          {
            status: "pending",
            created_by_id: 2,
            remarks: "Initial status",
            comments: "No comments",
          },
        ],
        resource_term_conditions_attributes: textareas.map((textarea) => {
  // Only include id if it's a string and length < 10 (likely a real DB id)
  // or if it's a number and less than 1e9 (to avoid Date.now() values)
  const isValidId =
    (typeof textarea.id === "string" && textarea.id.length < 10) ||
    (typeof textarea.id === "number" && String(textarea.id).length < 10);

  return isValidId
    ? {
        id: textarea.id,
        term_condition_id: textarea.textareaId,
        condition_type: "general",
        condition: textarea.value,
      }
    : {
        term_condition_id: textarea.textareaId,
        condition_type: "general",
        condition: textarea.value,
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
      const response = await fetch(
        `${baseURL}rfq/events/${id}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
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
            "/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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

    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
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
      fetchData();
    } else {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      handleResetSearch();
    }
  }, [searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      // Extract inventory_id values from existingData
      const inventoryIds = Object.values(existingData)
        .flatMap((subType) => Object.values(subType))
        .map((item) => item.inventory_id);

      const response = await fetch(
        `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${query}&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(
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

    setTableData((prevTableData) =>
      prevTableData.filter(
        (vendor) =>
          !selectedRows.some(
            (selectedVendor) => selectedVendor.id === vendor.id
          )
      )
    );

    setVendorModal(false);
    setSelectedRows([]);
    setResetSelectedRows(true);
  };

  const handleRemoveVendor = (id) => {
    const updatedSelected = selectedVendors.filter(
      (vendor) => vendor.pms_supplier_id !== id
    );

    const removedVendor = selectedVendors.find(
      (vendor) => vendor.pms_supplier_id === id
    );

    if (removedVendor) {
      const alreadyExists = filteredTableData.some(
        (vendor) => vendor.pms_supplier_id === removedVendor.pms_supplier_id
      );

      if (!alreadyExists) {
        const updatedFiltered = [...filteredTableData, removedVendor];
        setFilteredTableData(updatedFiltered);
      }
    }

    setSelectedVendors(updatedSelected);
  };

  useEffect(() => { }, [filteredTableData]);

  const validateInviteVendorForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number validation
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
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
      inviteVendorData.gstNumber &&
      !gstRegex.test(inviteVendorData.gstNumber)
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
    name: "",
    email: "",
    mobile: "",
    gstNumber: "",
    panNumber: "",
    company: "",
    organization: "",
  });

  const [companyList, setCompanyList] = useState([]);

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

  const handleInviteVendor = async (event) => {
    event.preventDefault(); // Prevent page reload

    const errors = validateInviteVendorForm();
    if (Object.keys(errors).length > 0) return;

    setIsInvite(true); // ✅ Start loader

    try {
      const response = await fetch(
        `${baseURL}rfq/events/3/invite_vendor?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&add_vendor=true&organization_name=${inviteVendorData?.organization}&company_id=${inviteVendorData?.company}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inviteVendorData.name,
            email: inviteVendorData.email,
            mobile: inviteVendorData.mobile,
            gst_number: inviteVendorData.gstNumber,
            pan_number: inviteVendorData.panNumber,
          }),
        }
      );

      if (response.ok) {
        const newVendor = await response.json();
        toast.success("Vendor invited successfully!");

        const vendorData = {
          id: null,
          pms_supplier_id: newVendor?.id,
          name: newVendor?.full_name,
          phone: newVendor?.mobile,
          organisation: newVendor?.organization_name,
        };

        setSelectedVendors((prev) => [...prev, vendorData]);
        setFilteredTableData((prev) => [...prev, vendorData]);

        setInviteVendorData({
          name: "",
          email: "",
          mobile: "",
          gstNumber: "",
          panNumber: "",
          company: "",
        });

        handleInviteModalClose();
      } else {
        const errorData = await response.json();
        console.error("Error inviting vendor:", errorData);
        toast.error("Failed to invite vendor.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while inviting the vendor.");
    } finally {
      setIsInvite(false); // ✅ Stop loader
    }
  };

  const handleInviteVendorChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "gstNumber" || name === "panNumber"
        ? value.replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
        : value;

    const capitalizedValue =
      name === "gstNumber" || name === "panNumber"
        ? sanitizedValue.toUpperCase() // Convert to uppercase
        : sanitizedValue;
    setInviteVendorData((prevData) => ({
      ...prevData,
      [name]: capitalizedValue,
    }));
  };

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
      try {
        const response = await fetch(
          `${baseURL}rfq/events/material_types?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const data = await response.json();

        if (response.ok && data.inventory_types) {
          const formattedMaterials = data.inventory_types?.map((item) => ({
            label: item.name,
            value: item.value,
          }));

          setMaterialSelectList(formattedMaterials);
        }
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
                      Event Number <span style={{ color: "red" }}>*</span>
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
                    placeholder="From [dd-mm-yy hh:mm] To [dd-mm-yy hh:mm] ([DD] Days [HH] Hrs [MM] Mins)"
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
                      // { label: "Draft", value: "draft" },
                    ]}
                    onChange={handleStatusChange}
                    defaultValue={eventStatus}
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
                        <th>Vendor Name</th>
                        <th>Organization</th>
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
                            <td>{vendor.organisation}</td>
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
                      {console.log("documentRows:-",documentRows)}
                <Table
                  columns={[
                    { label: "Sr No", key: "srNo" },
                    { label: "File Name", key: "fileName" },
                    { label: "Upload File", key: "upload" },
                    { label: "Action", key: "action" },
                  ]}
                  onRowSelect={undefined}
                  resetSelectedRows={undefined}
                  onResetComplete={undefined}
                  data={documentRows.map((row, index) => ({
                    srNo: row.srNo,
                    fileName: (
                      <td
                      >
                        { row?.upload?.filename || row.filename || "No File Selected"}
                      </td>
                    ),
                    upload: (
                      <td style={{ border: "none" }}>
                        <input
                          type="file"
                          id={`file-input-${index}`}
                          key={row?.srNo}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(index, e.target.files[0])}
                          accept=".xlsx,.csv,.pdf,.docx,.doc,.xls,.txt,.png,.jpg,.jpeg,.zip,.rar,.jfif,.svg,.mp4,.mp3,.avi,.flv,.wmv"
                        />
                        <label
                          htmlFor={`file-input-${index}`}
                          style={{
                            display: "inline-block",
                            width: "120px",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "#555",
                            backgroundColor: "#f5f5f5",
                            textAlign: "center",
                          }}
                        >
                          Upload
                        </label>
                      </td>
                    ),
                    action: (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveDocumentRow(index)}
                        disabled={documentRows.length === 1}
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
    {(!textareas || textareas.filter(t => t.id !== null).length === 0) ? (
      <tr>
        <td colSpan={3} className="text-center">No Terms & Conditions available</td>
      </tr>
    ) : (
      textareas.map((textarea, idx) => {
        if (textarea.id === null) {
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
                disabled={idx === 0}
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
                  <table className="tbl-container w-100">
                    <thead>
                      <tr>
                        <th>Comment</th>
                        <th>Remark</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Created at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusLogData?.map((item, idx) => {
                        if (item.id === null) {
                          return null;
                        }
                        return (
                          <tr key={idx}>
                            <td>{item.comment || "-"}</td>
                            <td>{item.remark || "-"}</td>
                            <td>{item.status || "-"}</td>
                            <td>{item.created_by_name || "-"}</td>
                            <td>{new Date(item.created_at).toLocaleString() || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}

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
                            onChange={async (selectedOptions) => {
                              try {
                                if (
                                  selectedOptions &&
                                  selectedOptions.length > 0
                                ) {
                                  // Extract selected values and format them into an array
                                  const selectedValues = selectedOptions.map(
                                    (option) => option.value
                                  );

                                  // Call the API with the selected values
                                  const response = await fetch(
                                    `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=&q[supplier_product_and_services_resource_id_in]=${JSON.stringify(
                                      selectedValues
                                    )}`
                                  );

                                  const data = await response.json();
                                  const vendors = Array.isArray(data.vendors)
                                    ? data.vendors
                                    : [];
                                  const formattedData = vendors.map(
                                    (vendor) => ({
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
                                    })
                                  );

                                  setFilteredTableData(formattedData);
                                } else {
                                  // If no option is selected, reset to show all vendors
                                  const response = await fetch(
                                    `${baseURL}rfq/events/vendor_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
                                  );

                                  const data = await response.json();
                                  const vendors = Array.isArray(data.vendors)
                                    ? data.vendors
                                    : [];
                                  const formattedData = vendors.map(
                                    (vendor) => ({
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
                                    })
                                  );

                                  setFilteredTableData(formattedData);
                                }
                              } catch (error) {
                                console.error(
                                  "Error fetching vendor data:",
                                  error
                                );
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
                  {/* {console.log("filteredTableData", filteredTableData)} */}

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
                        {filteredTableData.length > 0
                          ? currentPage * pageSize - (pageSize - 1)
                          : 0}{" "}
                        to{" "}
                        {filteredTableData.length > 0
                          ? Math.min(
                            currentPage * pageSize,
                            filteredTableData.length
                          )
                          : 0}{" "}
                        of {filteredTableData.length} entries
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
              // footerButtons={[
              //   {
              //     label: "Close",
              //     onClick: handleInviteModalClose,
              //     props: {

              //       className: "purple-btn1",
              //     },
              //   },
              //   {
              //     label: "Save Changes",
              //     onClick: handleInviteVendor,
              //     props: {
              //       className: "purple-btn2",
              //     },
              //   },
              // ]}
              children={
                <>
                  <form className="p-2">
                    <div className="form-group mb-3">
                      <label className="po-fontBold">POC - Full Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        placeholder="Enter POC Name"
                        value={inviteVendorData.name}
                        onChange={handleInviteVendorChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">Email <span style={{ color: "red" }}>*</span></label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="Enter Email Address"
                        value={inviteVendorData.email}
                        onChange={handleInviteVendorChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">Phone Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="mobile"
                        inputMode="numeric" // mobile-friendly numeric keyboard
                        pattern="[0-9]*" // restricts to digits only
                        onKeyDown={(e) => {
                          // Allow only numbers
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
                        value={inviteVendorData.mobile}
                        onChange={handleInviteVendorChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">GST Number</label>
                      <input
                        className="form-control"
                        type="text"
                        name="gstNumber"
                        placeholder="Enter GST Number"
                        value={ inviteVendorData.gstNumber || ""}
                        onChange={handleInviteVendorChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">PAN Number</label>
                      <input
                        className="form-control"
                        type="text"
                        name="panNumber"
                        placeholder="Enter PAN Number"
                        value={inviteVendorData.panNumber || ""}
                        onChange={handleInviteVendorChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">Company <span style={{ color: "red" }}>*</span></label>
                      <SelectBox
                        options={companyList}
                        value={companyList.find(
                          (option) => option.value === inviteVendorData.company
                        )} // Ensure the selected value is displayed
                        onChange={(selectedOption) => {
                          const updatedCompany = selectedOption || null; // Get the numeric value or null
                          setInviteVendorData((prev) => ({
                            ...prev,
                            company: updatedCompany, // Update the company field
                          }));
                        }}
                      />
                                       </div>
                    <div className="form-group mb-3">
                      <label className="po-fontBold">Organization <span style={{ color: "red" }}>*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="organization"
                        placeholder="Enter Organization Name"
                        value={inviteVendorData.organization || ""}
                        onChange={handleInviteVendorChange}
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
                        onClick={handleInviteVendor}
                      >
                        Save Changes
                      </button>
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
