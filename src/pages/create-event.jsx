import React, { useState, useEffect, useRef } from "react";
import {
  CreateRFQForm,
  DynamicModalBox,
  EventScheduleModal,
  EventTypeModal,
  SearchIcon,
  SelectBox,
  Table,
  MultiSelector,
} from "../components";
import { baseURL } from "../confi/apiDomain";
import { citiesList, participantsTabColumns } from "../constant/data";
import { useNavigate, useLocation } from "react-router-dom";
import PopupBox from "../components/base/Popup/Popup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateEvent() {
  const fileInputRef = useRef(null);
  const myRef = useRef(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableData, setFilteredTableData] = useState([]);
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
    },
  ]);
  const [selectedStrategy, setSelectedStrategy] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(false);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState(false);
  const [eventStatus, setEventStatus] = useState("draft");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [isTrafficSelected, setIsTrafficSelected] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [eventNo, setEventNo] = useState("");
  const [eventName, seteventName] = useState("");
  const [textareas, setTextareas] = useState([
    { id: Date.now(), value: "", textareaId: 0 },
  ]);
  const documentRowsRef = useRef([{ srNo: 1, upload: null }]);
  const [documentRows, setDocumentRows] = useState([{ srNo: 1, upload: null }]);
  const [eventDescription, setEventDescription] = useState("");

  const [createdOn] = useState(new Date().toISOString().split("T")[0]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [eventSchedule, setEventSchedule] = useState("");
  const [eventScheduleText, setEventScheduleText] = useState("");
  const [scheduleData, setScheduleData] = useState({});
  const [data, setData] = useState([
    { user: "", date: "", status: "", remark: "" },
  ]);
  // State to manage invite vendor form data
  const [inviteVendorData, setInviteVendorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gstinApplicable: "",
    gstNumber: "",
    vendorType: "",
    organizationType: "",
    natureOfBusiness: "",
    panNumber: "",
    department: "",
    organizationName: "",
    company: "",
    organization: "",
  });
  
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [vendorTypeOptions, setVendorTypeOptions] = useState([]);
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  
  // Material selection state for vendor filtering
  const [materialSelectList, setMaterialSelectList] = useState([]);
  const [multiSelectorValue, setMultiSelectorValue] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [apiTotalPages, setApiTotalPages] = useState(1);

  const location = useLocation()

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  console.log("Token from URL params:", token, "location:", location, "urlParams:", urlParams);

  useEffect(() => {
    fetch(
      `${baseURL}/rfq/events/company_list?token=${token}` // Use the token from URL params
    )
      .then((response) => response.json())
      .then((data) =>
        setCompanyList(
          data.list.map((item) => ({ label: item.name, value: item.value }))
        )
      )
      .catch((error) => console.error("Error fetching company list:", error));
  }, []);

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
    // if (!dynamicExtensionConfigurations.delivery_date) {
    //   toast.warn("Please fill the delivery date on Event Type");
    // } else {
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
    setEventScheduleText(scheduleText);
  };

  const handleVendorTypeModalShow = async () => {
    setVendorModal(true);
    
    // Load initial vendor data with material filter - same pattern as edit-event.jsx
    const selectedMaterialIds = multiSelectorValue?.map(opt => opt.value) || 
                               eventDetails?.event_materials?.map(mat => mat.inventory_id) || 
                               inventoryTypeId || [];
    
    await fetchVendorsWithMaterialFilter(1, "", selectedMaterialIds);
  };
  const handleVendorTypeModalClose = () => {
    setVendorModal(false);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleTrafficChange = (value) => {
    setIsTrafficSelected(value);
  };

  const handleAwardTypeChange = (e) => {
    setAwardType(e);
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

  const [loading, setLoading] = useState(false);

  // Enhanced vendor fetching function with MultiSelector support
  const fetchVendorsWithMaterialFilter = async (page = 1, searchTerm = "", selectedMaterialIds = [], selectedCity = "") => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      
      // Determine which material IDs to use for filtering
      let materialIdsForFilter;
      if (selectedMaterialIds && selectedMaterialIds.length > 0) {
        materialIdsForFilter = selectedMaterialIds;
      } else {
        // Use materialFormData inventory_id as fallback
        materialIdsForFilter = materialFormData?.map(mat => mat.inventory_id).filter(id => id) || [];
      }

      // Construct API URL with proper parameters - format array as [63,64]
      let apiUrl = `${baseURL}rfq/events/vendor_list?token=${token}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${encodeURIComponent(searchTerm)}`;
      
      if (materialIdsForFilter.length > 0) {
        const formattedIds = `[${materialIdsForFilter.join(',')}]`;
        apiUrl += `&q[supplier_product_and_services_resource_id_in]=${formattedIds}`;
      }
      
      console.log("Fetching vendors with URL:", apiUrl);
      console.log("Material IDs for filtering:", materialIdsForFilter);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log("Vendor API response:", data);

      const vendors = Array.isArray(data.vendors) ? data.vendors : [];
      
      const formattedData = vendors.map((vendor) => ({
        id: vendor.id,
        pms_supplier_id: vendor.id,
        name: vendor.full_name || vendor.organization_name || "-",
        email: vendor.email || "-",
        organisation: vendor.organization_name || "-",
        phone: vendor.contact_number || vendor.mobile || "-",
        city: vendor.city_id || "-",
        tags: vendor.tags || "-",
        pms_inventory_type_id: vendor.pms_inventory_type_id || [],
      }));

      // Show all vendors, including already selected ones (they will appear with checked checkboxes)
      setTableData(formattedData);
      setFilteredTableData(formattedData);
      setCurrentPage(page);
      setTotalCount(data?.pagination?.total_count || 0);
      setApiTotalPages(data?.pagination?.total_pages || 1);
      setTotalPages(data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (page = 1, searchTerm = "", selectedCity = "") => {
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    if (searchTerm == "") {
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}rfq/events/vendor_list?token=${token}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
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
      }));

      // Show all vendors, including already selected ones (they will appear with checked checkboxes)
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
    
    // Fetch material types for MultiSelector
    const fetchMaterialTypes = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get("token");
        const response = await fetch(`${baseURL}rfq/events/material_types?token=${token}`);
        const data = await response.json();
        
        console.log("Raw material types API response:", data);
        
        setMaterialSelectList(
          (data.inventory_types || []).map((material) => ({
            label: material.name,
            value: material.value,
          }))
        );
        
        console.log("Processed material types for MultiSelector:", (data.inventory_types || []).map((material) => ({
          label: material.name,
          value: material.value,
        })));
      } catch (error) {
        console.error("Error fetching material types:", error);
      }
    };
    
    fetchMaterialTypes();
  }, []);

  // Set default MultiSelector value when materialFormData changes - same pattern as edit-event.jsx
  useEffect(() => {
    console.log("materialFormData:-",materialFormData);
    
    if (materialFormData?.[0]?.inventory_type_id && materialSelectList?.length > 0) {
      const defaultOption = materialSelectList.find(
        (opt) => String(opt.value) === String(materialFormData[0].inventory_type_id)
      );
      if (defaultOption) {
        setMultiSelectorValue([defaultOption]);
      }
    }
  }, [materialFormData, materialSelectList]);

  // Initialize selectedRows with already selected vendors when vendor data is fetched
  useEffect(() => {
    if (vendorModal && filteredTableData.length > 0 && selectedVendors.length > 0) {
      const currentlySelectedVendors = filteredTableData.filter(vendor =>
        selectedVendors.some(selectedVendor => 
          selectedVendor.id === vendor.id || 
          selectedVendor.pms_supplier_id === vendor.id ||
          selectedVendor.id === vendor.pms_supplier_id ||
          selectedVendor.pms_supplier_id === vendor.pms_supplier_id
        )
      );
      
      if (currentlySelectedVendors.length > 0) {
        console.log("Setting selectedRows from already selected vendors:", currentlySelectedVendors);
        setSelectedRows(currentlySelectedVendors);
      }
    }
  }, [vendorModal, filteredTableData, selectedVendors]);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= apiTotalPages) {
      const selectedMaterialIds = multiSelectorValue?.map(opt => opt.value) || [];
      await fetchVendorsWithMaterialFilter(newPage, searchTerm, selectedMaterialIds);
    }
  };

  const getPageRange = () => {
    // Calculate the starting page for the range
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = startPage + pageRange - 1;

    // Ensure the range doesn't exceed the total pages
    if (endPage > apiTotalPages) {
      endPage = apiTotalPages;
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleCheckboxChange = (vendor, isChecked) => {
    console.log("Checkbox change:", vendor, isChecked);
    
    if (isChecked) {
      // Add vendor to selectedRows if not already present
      setSelectedRows((prev) => {
        const isAlreadySelected = prev.some(item => 
          item.id === vendor.id || 
          item.pms_supplier_id === vendor.id ||
          item.id === vendor.pms_supplier_id ||
          item.pms_supplier_id === vendor.pms_supplier_id
        );
        
        if (!isAlreadySelected) {
          return [...prev, vendor];
        }
        return prev;
      });
    } else {
      // Remove vendor from selectedRows
      setSelectedRows((prev) => prev.filter((item) => 
        item.id !== vendor.id && 
        item.pms_supplier_id !== vendor.id &&
        item.id !== vendor.pms_supplier_id &&
        item.pms_supplier_id !== vendor.pms_supplier_id
      ));
      
      // Also remove from selectedVendors if it's there (for immediate deselection)
      setSelectedVendors((prev) => prev.filter((item) => 
        item.id !== vendor.id && 
        item.pms_supplier_id !== vendor.id &&
        item.id !== vendor.pms_supplier_id &&
        item.pms_supplier_id !== vendor.pms_supplier_id
      ));
    }
  };

  const handleSaveButtonClick = () => {
    console.log("Save button clicked. Selected rows:", selectedRows);
    console.log("Current selected vendors:", selectedVendors);
    
    // Update selectedVendors to match current selectedRows state
    const newSelectedVendors = selectedRows.map((vendor) => ({
      ...vendor,
      id: vendor.id || vendor.pms_supplier_id,
      pms_supplier_id: vendor.pms_supplier_id || vendor.id,
    }));
    
    console.log("New selected vendors:", newSelectedVendors);
    setSelectedVendors(newSelectedVendors);

    // Remove deselected vendors from filteredTableData and add them back to tableData
    const deselectedVendors = selectedVendors.filter(selectedVendor =>
      !selectedRows.some(row => 
        row.id === selectedVendor.id || 
        row.pms_supplier_id === selectedVendor.id ||
        row.id === selectedVendor.pms_supplier_id ||
        row.pms_supplier_id === selectedVendor.pms_supplier_id
      )
    );

    if (deselectedVendors.length > 0) {
      console.log("Adding deselected vendors back to table:", deselectedVendors);
      setTableData((prevTableData) => [...prevTableData, ...deselectedVendors]);
    }

    // Remove newly selected vendors from tableData
    setTableData((prevTableData) =>
      prevTableData.filter(
        (vendor) =>
          !selectedRows.some(
            (selectedVendor) => selectedVendor.id === vendor.id || selectedVendor.pms_supplier_id === vendor.id
          )
      )
    );

    setVendorModal(false);
    setSelectedRows([]);
    setResetSelectedRows(true);
  };

  const handleRemoveVendor = (id) => {
    const removedVendor = selectedVendors.find((vendor) => vendor.id === id);

    setSelectedVendors((prev) => prev.filter((vendor) => vendor.id !== id));

    if (removedVendor) {
      setTableData((prevTableData) => [...prevTableData, removedVendor]); // Restore vendor to main table
    }
  };

  const isVendorSelected = (vendorId) => {
    // Check if vendor is in selectedRows (currently being selected in modal)
    const isInSelectedRows = selectedRows.some((vendor) => vendor.id === vendorId || vendor.pms_supplier_id === vendorId);
    
    // Check if vendor is already in selectedVendors (previously saved selections)
    const isInSelectedVendors = selectedVendors.some((vendor) => 
      vendor.id === vendorId || 
      vendor.pms_supplier_id === vendorId ||
      (vendor.id && vendor.id === vendorId) ||
      (vendor.pms_supplier_id && vendor.pms_supplier_id === vendorId)
    );
    
    return isInSelectedRows || isInSelectedVendors;
  };

  const handleAddTextarea = () => {
    setTextareas([...textareas, { id: Date.now(), value: "", textareaId: 0 }]);
  };

  const handleRemoveTextarea = (id) => {
    const updatedTextareas = textareas.filter((textarea) => textarea.id !== id);
    setTextareas([...updatedTextareas]);
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
                id: textarea.id,
                value: selectedCondition.condition,
                textareaId: selectedCondition.value,
              }
            : textarea
        )
      );
    }
  };

  const handleAddDocumentRow = () => {
    setDocumentRows(prevRows => [
      ...prevRows,
      { srNo: prevRows.length + 1, upload: null }
    ]);
  };

  const handleRemoveDocumentRow = (index) => {
    if (documentRows.length > 1) {
      const updatedRows = documentRows.filter((_, i) => i !== index);

      // Reset row numbers properly
      updatedRows.forEach((row, i) => {
        row.srNo = i + 1;
      });

      documentRowsRef.current = updatedRows;
      setDocumentRows([...updatedRows]);
    }
  };

  const handleFileChange = (index, file) => {
    if (!file) return; // Ensure a file is selected

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

    // Reset the input field to allow re-selecting the same file
    const inputElement = document.getElementById(`file-input-${index}`);
    if (inputElement) {
      inputElement.value = ""; // Clear input value
    }
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

  const scrollToTop = () => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth", top: 0 });
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [bidTemplateFields, setBidTemplateFields] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);

  // console.log("materialFormData:--------",materialFormData);

  // Utility to get ISO string in UTC format with Z
  const toUTCISOString = (dateTime) => {
    if (!dateTime) return "";
    
    // If dateTime is already in correct ISO format, return as is
    if (typeof dateTime === "string" && dateTime.endsWith("Z")) {
      return dateTime;
    }
    
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      console.warn("Invalid dateTime passed to toUTCISOString:", dateTime);
      return "";
    }
    
    // Return ISO string in UTC format with Z
    return date.toISOString();
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
      scrollToTop();
      toast.error("Please fill all the required fields.", {
        autoClose: 1000,
      });
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
          start_time: toUTCISOString(scheduleData.start_time),
          end_time: toUTCISOString(scheduleData.end_time_duration),
          evaluation_time: scheduleData.evaluation_time,
        },
        event_type_detail_attributes: {
          event_type: eventType,
          award_scheme: awardType,
          event_configuration: selectedStrategy,
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
        event_materials_attributes: materialFormData.map((material) => {
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
                "brand_id",
                "generic_info_id",
                "colour_id",
              ].includes(key)
            ) {
              acc[key] = material[key] || null; // Include dynamic fields
            }
            return acc;
          }, {});

          return {
            inventory_id: Number(material.inventory_id) || null,
            quantity: Number(material.quantity),
            uom: material.unit,
            location: material.location,
            rate: Number(material.rate) || 0,
            amount: material.amount,
            sub_section_name: material.sub_section_id,
            section_name: material.section_id,
            inventory_type_id: material.inventory_type_id,
            inventory_sub_type_id: material.inventory_sub_type_id,
            pms_brand: material.brand_id || null,
            pms_colour: material.colour_id || null,
            generic_info_id: material.generic_info_id || null, // Use generic_info_id here
            _destroy: material._destroy || false,
            ...dynamicFields, // Add dynamic fields
          };
        }),
        event_vendors_attributes: selectedVendors.map((vendor) => ({
          status: 1,
          pms_supplier_id: vendor.pms_supplier_id,
          id: null,
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
          term_condition_id: textarea.textareaId,
          condition_type: "general",
          condition: textarea.value,
        })),
        attachments: documentRows.map((row) => row.upload),
        applied_event_template: {
          event_template_id: selectedTemplate,
          applied_bid_template_fields_attributes: bidTemplateFields.map(
            (field) => ({
              field_name: field.field_name,
              is_required: field.is_required,
              is_read_only: field.is_read_only,
              field_owner: field.field_owner,
              extra_fields: field.extra_fields || null,
            })
          ),
          applied_bid_material_template_fields_attributes: additionalFields
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

    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

    try {
      const response = await fetch(
        `${baseURL}rfq/events?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );
      console.log('scheduleData:--', scheduleData);
      
      console.log('eventData:--', eventData);
      
      
      if (response.ok) {
        const responseData = await response.json(); // Parse the response to get event details
        console.log("Response data:", responseData);

        // Show modal instead of toast
        setCreatedEventInfo({
          event_title: responseData?.event_title,
          event_no: responseData?.event_no,
        });
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event.", {
        autoClose: 1000,
      });
    } finally {
      setSubmitted(false);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventInfo, setCreatedEventInfo] = useState({ event_title: "", event_no: "" });

  const handleSuccessModalClose = () => {
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    setShowSuccessModal(false);
    navigate(`/event-list?token=${token}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTableData(tableData);
  }, [tableData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    } else {
      const fetchSuggestions = async (query) => {
        try {
          const urlParams = new URLSearchParams(location.search);
          const token = urlParams.get("token");
          const response = await fetch(
            `${baseURL}rfq/events/vendor_list?token=${token}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${query}&per_page=10`
          );
          const data = await response.json();
          const vendors = Array.isArray(data.vendors) ? data.vendors : [];
          setSuggestions(vendors);
          setIsSuggestionsVisible(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setIsSuggestionsVisible(false);
        }
      };

      if (e.target.value.length > 2) {
        fetchSuggestions(e.target.value);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.full_name);
    setIsSuggestionsVisible(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const selectedMaterialIds = multiSelectorValue?.map(opt => opt.value) || [];
    await fetchVendorsWithMaterialFilter(1, searchTerm, selectedMaterialIds);
  };

  const handleResetSearch = async () => {
    setSearchTerm("");
    const selectedMaterialIds = multiSelectorValue?.map(opt => opt.value) || [];
    await fetchVendorsWithMaterialFilter(1, "", selectedMaterialIds);
  };

  const [termsOptions, setTermsOptions] = useState([]);

  // Fetch terms and conditions from the API
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
        condition: term.condition, // Include condition text here
      }));
      setTermsOptions(termsList);
    } catch (error) {
      console.error("Error fetching terms and conditions:", error);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
    
    // Fetch organization type list from API
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    
    fetch(`${baseURL}rfq/events/type_of_organizations_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.type_of_organizations)) {
          const options = data.type_of_organizations.map((org) => ({
            value: org.value,
            label: org.name,
          }));
          console.log("Organization type options loaded:", options);
          setOrganizationTypeOptions(options);
        }
      });
      
    // Fetch department list from API
    fetch(`${baseURL}rfq/events/department_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.list)) {
          const options = data.list.map((dept) => ({
            value: dept.value,
            label: dept.name,
          }));
          console.log("Department options loaded:", options);
          setDepartmentOptions(options);
        }
      });
      
    // Fetch vendor type list from API
    fetch(`${baseURL}rfq/events/supplier_type_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.supplier_type)) {
          const options = data.supplier_type.map((type) => ({
            value: type.value,
            label: type.name,
          }));
          console.log("Vendor type options loaded:", options);
          setVendorTypeOptions(options);
        }
      });
      
    // Fetch nature of business list from API
    fetch(`${baseURL}rfq/events/nature_of_business_list?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.list)) {
          const options = data.list.map((item) => ({
            value: item.value,
            label: item.name,
          }));
          console.log("Nature of business options loaded:", options);
          setNatureOfBusinessOptions(options);
        }
      });
  }, []);

  const [savingsSummaryModal, setSavingsSummaryModal] = useState(false);
  const [savingsSummary, setSavingsSummary] = useState("");
  const [localMeasureSavings, setLocalMeasureSavings] = useState("gross_total");
  const [selectedSavingsColumn, setSelectedSavingsColumn] = useState("total");

  const handleSavingsSummaryModalShow = () => {
    const inventoryIds = materialFormData
      .map((material) => material.inventory_id)
      .join(",");
    const savingType =
      selectedSavingsColumn === "quantity" ? "material_cost" : "material_total";
    const url = `${baseURL}rfq/events/saving_modal?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&inventory_ids=${inventoryIds}&saving_type=${savingType}`;
    // Fetch or navigate to the URL as needed
    setSavingsSummaryModal(true);
  };

  const handleSavingsColumnChange = (selectedOption) => {
    setSelectedSavingsColumn(selectedOption.value);
  };

  const handleSavingsSummaryModalClose = () => {
    setSavingsSummaryModal(false);
  };

  const handleStatusChange = (selectedOption) => {
    setEventStatus(selectedOption);
  };

  const handleInviteVendor = async (event) => {
    event.preventDefault();

    console.log("Submit button clicked - validating invite vendor form...");
    const errors = validateInviteVendorForm();
    if (Object.keys(errors).length > 0) return;

    setIsInvite(true);
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    
    try {
      const response = await fetch(
        `${baseURL}rfq/events/invite_vendors?token=${token}&add_vendor=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplier_type_id: parseInt(inviteVendorData.vendorType),
            department_id: parseInt(inviteVendorData.department),
            nature_of_business_id: parseInt(inviteVendorData.natureOfBusiness),
            type_of_organization_id: parseInt(inviteVendorData.organizationType),
            first_name: inviteVendorData.firstName,
            last_name: inviteVendorData.lastName,
            gstin_applicable: inviteVendorData.gstinApplicable,
            gstin: inviteVendorData.gstNumber || "",
            name: inviteVendorData.lastName, // Using last name as 'name'
            email: inviteVendorData.email,
            mobile: inviteVendorData.mobile,
            pan_number: inviteVendorData.panNumber || "",
            organization_name: inviteVendorData.organizationName || "",
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
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          gstNumber: "",
          panNumber: "",
          company: "",
          vendorType: "",
          organizationType: "",
          department: "",
          natureOfBusiness: "",
          gstinApplicable: "",
          organizationName: "",
        });

        handleInviteModalClose();
      } else {
        const errorData = await response.json();
        console.error("Error inviting vendor:", errorData);
        
        // Handle specific status codes
        if (response.status === 402) {
          // Show API error message for 402 status
          const errorMessage = errorData?.message || errorData?.error;
          toast.error(errorMessage);
        } else if (response.status === 422) {
          // Handle 422 validation errors
          if (errorData?.errors && Array.isArray(errorData.errors)) {
            // Show first error from the errors array
            toast.error(errorData.errors[0]);
          } else {
            const errorMessage = errorData?.message || errorData?.error || "Validation failed";
            toast.error(errorMessage);
          }
        } else {
          toast.error("Failed to invite vendor.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while inviting the vendor.");
    } finally {
      setIsInvite(false);
    }
  };

  const validateInviteVendorForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number validation
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    // Debug logging to see the current state
    console.log("Validating invite vendor form data:", inviteVendorData);
    console.log("vendorType:", inviteVendorData.vendorType);
    console.log("organizationType:", inviteVendorData.organizationType);
    console.log("department:", inviteVendorData.department);
    console.log("natureOfBusiness:", inviteVendorData.natureOfBusiness);

    if (!inviteVendorData.firstName) {
      errors.firstName = "First Name is required";
      toast.error(errors.firstName);
    }
    if (!inviteVendorData.lastName) {
      errors.lastName = "Last Name is required";
      toast.error(errors.lastName);
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
    if (inviteVendorData.gstinApplicable === 'yes' && !inviteVendorData.gstNumber) {
      errors.gstNumber = "Valid GSTIN is required";
      toast.error(errors.gstNumber);
    }
    if (
      inviteVendorData.panNumber &&
      !panRegex.test(inviteVendorData.panNumber)
    ) {
      errors.panNumber = "Invalid PAN number format";
      toast.error(errors.panNumber);
    }
    if (!inviteVendorData.vendorType) {
      errors.vendorType = "Vendor Type is required";
      toast.error(errors.vendorType);
    }
    if (!inviteVendorData.organizationType) {
      errors.organizationType = "Organization Type is required";
      toast.error(errors.organizationType);
    }
    if (!inviteVendorData.natureOfBusiness) {
      errors.natureOfBusiness = "Nature of Business is required";
      toast.error(errors.natureOfBusiness);
    }
    if (!inviteVendorData.department) {
      errors.department = "Department is required";
      toast.error(errors.department);
    }
    
    console.log("Validation errors:", errors);
    return errors;
  };

  // console.log("inviteVendorData", inviteVendorData.company);

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

  const handleOrganizationTypeChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ 
      ...prev, 
      organizationType: selectedOption ? selectedOption.value : '' 
    }));
  };
  
  const handleDepartmentChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ 
      ...prev, 
      department: selectedOption ? selectedOption.value : '' 
    }));
  };
  
  const handleVendorTypeChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ 
      ...prev, 
      vendorType: selectedOption ? selectedOption.value : '' 
    }));
  };
  
  const handleNatureOfBusinessChange = (selectedOption) => {
    setInviteVendorData((prev) => ({ 
      ...prev, 
      natureOfBusiness: selectedOption ? selectedOption.value : '' 
    }));
  };

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
        <div className="pt-3" ref={myRef}>
          <div className="module-data-section mx-3">
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
                      style={{
                        backgroundColor: "#f5f5f5", // Light gray background to show it is readonly
                        color: "#888", // Light gray text color to indicate it's not editable
                        cursor: "not-allowed", // Show the cursor as not allowed
                        borderColor: "#ddd", // Lighter border color
                      }}
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
                    placeholder="Select Event Schedule Details"
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
                {/* <div className="col-md-4 col-sm-6 mt-2">
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
                </div> */}
                {/* <div className="col-md-4 col-sm-6 mt-2">
                  <div className="form-group">
                    <label className="po-fontBold">
                      Savings Summary
                    </label>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Enter Savings Summary"
                    readOnly
                    value={savingsSummary}
                    onClick={handleSavingsSummaryModalShow}
                  />
                </div> */}
              </div>
              <CreateRFQForm
                data={materialFormData}
                setData={setMaterialFormData}
                isService={isService}
                deliveryData={[]}
                updateSelectedTemplate={setSelectedTemplate}
                updateBidTemplateFields={setBidTemplateFields}
                updateAdditionalFields={setAdditionalFields}
                isMor={true}
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
                        <tr>
                          <td colSpan="6">
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
                          </td>
                        </tr>
                      ) : selectedVendors.length > 0 ? (
                        selectedVendors
                          .filter(
                            (vendor, index, self) =>
                              index ===
                              self.findIndex((v) => v.id === vendor.id)
                          )
                          .map((vendor, index) => (
                            <tr key={vendor.id}>
                              <td style={{ width: "100px" }}>{index + 1}</td>
                              <td>{vendor.name}</td>
                              <td>{vendor.organisation || "-"}</td>
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
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
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
                {/* Show filename in a separate column, like edit event */}
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
      {documentRows.map((row, index) => (
        <tr key={row.id || index}>
          <td>
            <input
              className="form-control document_content_type"
              readOnly
              disabled
              value={row.fileType || row.content_type || ""}
              placeholder="File Type"
            />
          </td>
          <td>
            <input
              className="form-control file_name"
              required
              value={row.fileName || row.document_name || "no files selected yet"}
              onChange={e => {
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
                row.uploadDate ||
                (row.created_at
                  ? new Date(row.created_at).toISOString().slice(0, 19)
                  : "")
              }
            />
          </td>
          <td>
            {!row.isExisting && (
              <input
                type="file"
                className="form-control"
                required
                onChange={e => {
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
                {row.isExisting && row.fileUrl && (
                  <div className="file-box">
                    <div className="image">
                      <a href={row.fileUrl} target="_blank" rel="noreferrer">
                        <img
                          alt="preview"
                          className="img-responsive"
                          height={50}
                          width={50}
                          src={row.fileUrl}
                        />
                      </a>
                    </div>
                    <div className="file-name">
                      <a href={row.fileUrl} download>
                        <span className="material-symbols-outlined">file_download</span>
                      </a>
                      <span>{row.fileName || row.filename}</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-danger"
                onClick={() => {
                  setDocumentRows(prev => {
                    // if (prev.length === 1) return prev;
                    const updated = [...prev];
                    updated.splice(index, 1);
                    return updated;
                  });
                }}
                disabled={documentRows.length === 1}
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
                            // disabled={idx === 0}
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
                  deliveryDate={dynamicExtensionConfigurations.delivery_date}
                  show={eventScheduleModal}
                  onHide={handleEventScheduleModalClose}
                  handleSaveSchedule={handleSaveSchedule}
                />
              </div>
              <div className="row mt-2 justify-content-end align-items-center mt-4">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Preview</button>
                </div>
                <div className="col-md-2">
                  <button
                    className={
                      submitted ? "disabled-btn w-100" : "purple-btn2 w-100"
                    }
                    onClick={handleSubmit}
                    disabled={submitted}
                  >
                    {submitted ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    onClick={() => {
                      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
                      navigate(
                        `/event-list?token=${token}/event-list`
                      );
                    }}
                  >
                    Cancel
                  </button>
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
                    <div className="w-75 h-[40px] position-relative">
                      <div className="input-group d-flex w-100 align-items-end">
                        <input
                          type="search"
                          id="searchInput"
                          className="tbl-search form-control w-50"
                          style={{ height: "38.2px" }}
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
                        
                        <div className="w-25 ms-3">
                          <MultiSelector
                            options={materialSelectList}
                            value={multiSelectorValue}
                            onChange={async (selectedOptions) => {
                              setMultiSelectorValue(selectedOptions);
                              try {
                                let selectedValues;
                                if (selectedOptions && selectedOptions.length > 0) {
                                  selectedValues = selectedOptions.map((option) => option.value);
                                } else {
                                  // Use materialFormData inventory_id for default
                                  selectedValues = eventDetails?.event_materials?.[0]?.inventory_id
                                    ? [eventDetails.event_materials[0].inventory_id]
                                    : [];
                                }
                                
                                // Call the enhanced function
                                await fetchVendorsWithMaterialFilter(1, searchTerm, selectedValues);
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
                        style={{ width: "100%" }}
                        scrollable={true}
                        fullWidth={true}
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
                          currentPage === apiTotalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === apiTotalPages}
                        >
                          Next
                        </button>
                      </li>

                      {/* Last Button */}
                      <li
                        className={`page-item ${
                          currentPage === apiTotalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(apiTotalPages)}
                          disabled={currentPage === apiTotalPages}
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
                          ? Math.min(currentPage * pageSize, totalCount)
                          : 0}{" "}
                        of {totalCount} entries
                      </p>
                    </div>
                  </div>
                </>
              }
            />
            <DynamicModalBox
              show={inviteModal}
              onHide={handleInviteModalClose}
              // modalType={true}
              title="Invite New Vendor"
              children={
                <>
                  <form className="p-2">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="firstName"
                            placeholder="Enter First Name"
                            value={inviteVendorData.firstName}
                            onChange={handleInviteVendorChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={inviteVendorData.lastName}
                            onChange={handleInviteVendorChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={inviteVendorData.email}
                            onChange={handleInviteVendorChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Phone Number <span className="text-danger">*</span>
                          </label>
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
                            value={inviteVendorData.mobile}
                            onChange={handleInviteVendorChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            GSTIN Applicable <span className="text-danger">*</span>
                          </label>
                          <SelectBox
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" }
                            ]}
                            value={
                              inviteVendorData.gstinApplicable
                                ? { label: inviteVendorData.gstinApplicable === 'yes' ? 'Yes' : 'No', value: inviteVendorData.gstinApplicable }
                                : null
                            }
                            onChange={(selectedOption) => {
                              setInviteVendorData((prev) => ({
                                ...prev,
                                gstinApplicable: selectedOption?.value || '',
                                gstNumber: selectedOption?.value === 'no' ? '' : prev.gstNumber
                              }));
                            }}
                            placeholder="Select GSTIN Applicable"
                          />
                        </div>
                      </div>
                      {inviteVendorData.gstinApplicable === 'yes' && (
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label className="po-fontBold">
                              GST Number <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="gstNumber"
                              placeholder="Enter GST Number"
                              value={inviteVendorData.gstNumber || ""}
                              onChange={handleInviteVendorChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
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
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Vendor Type <span className="text-danger">*</span>
                          </label>
                          <SelectBox
                            options={vendorTypeOptions}
                            defaultValue={inviteVendorData.vendorType}
                            onChange={(selectedValue) => {
                              console.log("Vendor type changed to:", selectedValue);
                              setInviteVendorData((prev) => ({
                                ...prev,
                                vendorType: selectedValue || ''
                              }));
                            }}
                            placeholder="Select Vendor Type"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Organization Type <span className="text-danger">*</span>
                          </label>
                          <SelectBox
                            options={organizationTypeOptions}
                            defaultValue={inviteVendorData.organizationType}
                            onChange={(selectedValue) => {
                              console.log("Organization type changed to:", selectedValue);
                              setInviteVendorData((prev) => ({
                                ...prev,
                                organizationType: selectedValue || ''
                              }));
                            }}
                            placeholder="Select Organization Type"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Department <span className="text-danger">*</span>
                          </label>
                          <SelectBox
                            options={departmentOptions}
                            defaultValue={inviteVendorData.department}
                            onChange={(selectedValue) => {
                              console.log("Department changed to:", selectedValue);
                              setInviteVendorData((prev) => ({
                                ...prev,
                                department: selectedValue || ''
                              }));
                            }}
                            placeholder="Select Department"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Nature of Business <span className="text-danger">*</span>
                          </label>
                          <SelectBox
                            options={natureOfBusinessOptions}
                            defaultValue={inviteVendorData.natureOfBusiness}
                            onChange={(selectedValue) => {
                              console.log("Nature of business changed to:", selectedValue);
                              setInviteVendorData((prev) => ({
                                ...prev,
                                natureOfBusiness: selectedValue || ''
                              }));
                            }}
                            placeholder="Select Nature of Business"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Company
                          </label>
                          <SelectBox
                            options={companyList}
                            value={companyList.find(
                              (option) => option.value === inviteVendorData.company
                            )}
                            onChange={(selectedOption) => {
                              setInviteVendorData((prev) => ({
                                ...prev,
                                company: selectedOption?.value || ''
                              }));
                            }}
                            placeholder="Select Company"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <label className="po-fontBold">
                            Organization Name
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="organizationName"
                            placeholder="Enter Organization Name"
                            value={inviteVendorData.organizationName || ""}
                            onChange={handleInviteVendorChange}
                          />
                        </div>
                      </div>
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
            <DynamicModalBox
              title="Saving Summary"
              size="lg"
              show={savingsSummaryModal}
              onHide={handleSavingsSummaryModalClose}
              modalType={true}
              footerButtons={[
                {
                  label: "Close",
                  onClick: handleSavingsSummaryModalClose,
                  props: {
                    className: "purple-btn1",
                  },
                },
                {
                  label: "Save",
                  onClick: handleSavingsSummaryModalClose,
                  props: {
                    className: "purple-btn2",
                  },
                },
              ]}
              children={
                <>
                  <div className="ant-col ant-form-item-label">
                    <label title="How do you want to measure savings?">
                      How do you want to measure savings?
                    </label>
                  </div>

                  <div className="ant-col ant-form-item-control-wrapper">
                    <div className="ant-form-item-control">
                      <span className="ant-form-item-children">
                        <div style={{ maxWidth: 700 }}>
                          <div
                            className="pro-radio-tabs"
                            style={{ gridTemplateColumns: "1fr 1fr" }}
                          >
                            <div
                              className={`pro-radio-tabs__tab ${
                                localMeasureSavings === "gross_total"
                                  ? "pro-radio-tabs__tab__selected"
                                  : ""
                              }`}
                              role="radio"
                              aria-checked={
                                localMeasureSavings === "gross_total"
                              }
                              onClick={() =>
                                setLocalMeasureSavings("gross_total")
                              }
                              tabIndex={-1}
                            >
                              <div className="pro-radio-tabs__check-icon">
                                <label
                                  className={`ant-radio-wrapper ${
                                    localMeasureSavings === "gross_total"
                                      ? "ant-radio-wrapper-checked"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`ant-radio ${
                                      localMeasureSavings === "gross_total"
                                        ? "ant-radio-checked"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      className="ant-radio-input"
                                      value="gross_total"
                                      checked={
                                        localMeasureSavings === "gross_total"
                                      }
                                      onChange={() =>
                                        setLocalMeasureSavings("gross_total")
                                      }
                                      tabIndex={-1}
                                    />
                                    <div className="ant-radio-inner"></div>
                                  </span>
                                </label>
                              </div>
                              <p className="pro-text pro-body pro-text--normal">
                                Gross Total
                              </p>
                            </div>
                            <div
                              className={`pro-radio-tabs__tab ${
                                localMeasureSavings === "line_item"
                                  ? "pro-radio-tabs__tab__selected"
                                  : ""
                              }`}
                              role="radio"
                              aria-checked={localMeasureSavings === "line_item"}
                              onClick={() =>
                                setLocalMeasureSavings("line_item")
                              }
                              tabIndex={0}
                            >
                              <div className="pro-radio-tabs__check-icon">
                                <label
                                  className={`ant-radio-wrapper ${
                                    localMeasureSavings === "line_item"
                                      ? "ant-radio-wrapper-checked"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`ant-radio ${
                                      localMeasureSavings === "line_item"
                                        ? "ant-radio-checked"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      className="ant-radio-input"
                                      value="line_item"
                                      checked={
                                        localMeasureSavings === "line_item"
                                      }
                                      onChange={() =>
                                        setLocalMeasureSavings("line_item")
                                      }
                                      tabIndex={-1}
                                    />
                                    <div className="ant-radio-inner"></div>
                                  </span>
                                </label>
                              </div>
                              <p className="pro-text pro-body pro-text--normal">
                                Line Item
                              </p>
                            </div>
                          </div>
                          {localMeasureSavings === "gross_total" && (
                            <div className="col-12 mt-4">
                              <div className="form-group">
                                <label className="po-fontBold">
                                  Enter Reference Amount for Gross Total
                                </label>
                              </div>
                              <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-3">
                                <div className="w-50">
                                  <p>Gross Total :</p>
                                </div>
                                <div className="d-flex align-items-center justify-content-start w-50">
                                  <input
                                    type="text"
                                    className="form-control w-75"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <input type="checkbox" /> history
                          {localMeasureSavings === "line_item" && (
                            <div className="col-12 mt-4">
                              <SelectBox
                                label={"Choose column to calculate savings on"}
                                options={[
                                  { label: "Quantity", value: "quantity" },
                                  { label: "Total", value: "total" },
                                ]}
                                onChange={handleSavingsColumnChange}
                              />

                              <div className="col-12 mt-4">
                                <div className="form-group">
                                  <label className="po-fontBold">
                                    Enter Reference Amount for Product(s)
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                </div>

                                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-3">
                                  <div className="">
                                    <p>1.5sqmm Black Wire</p>
                                    <span>Variant 1</span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="text"
                                      className="form-control"
                                    />{" "}
                                    <p>/Metre</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </span>
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </div>
        <ToastContainer />
        <DynamicModalBox
          show={showSuccessModal}
          onHide={handleSuccessModalClose}
          size="md"
          title=""
          centered={true}
          footerButtons={[]}
          modalType={false}
          children={
            <div
              style={{
                minWidth: 320,
                padding: "10px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ marginTop: 2 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    background: "#d1fae5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                    style={{ color: "#22c55e" }}
                  >
                    <circle cx="10" cy="10" r="10" fill="#22c55e" opacity="0.15" />
                    <path
                      d="M6 10.5l3 3 5-5"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#22c55e", fontSize: 18, marginBottom: 4 }}>
                  Success
                </div>
                <div style={{ fontWeight: 500, color: "#222", textTransform: "capitalize" }}>
                  Event Successfully created: {createdEventInfo?.event_title}
                  <br />
                  (Event No: {createdEventInfo?.event_no})
                </div>
                <button
                  className="btn btn-success btn-sm mt-3"
                  style={{ minWidth: 60 }}
                  onClick={handleSuccessModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
