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
import { Modal, Button } from 'react-bootstrap';
import SingleSelector from "../../base/Select/SingleSelector";
import axios from 'axios';


export default function ParticipantsTab({ id }) {
  const [isSelectCheckboxes, setIsSelectCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalFilteredTableData, setModalFilteredTableData] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // For main table
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false); // For main table
  const [modalSuggestions, setModalSuggestions] = useState([]); // For modal
  const [isModalSuggestionsVisible, setIsModalSuggestionsVisible] = useState(false); // For modal
  const [loading, setLoading] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
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
  const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

  // const [inviteForm, setInviteForm] = useState({
  //   name: "",
  //   email: "",
  //   mobile: "",
  //   gstNumber: "",
  //   panNumber: "",
  //   company: "",
  //   organization: "",
  // });
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
    setIsInvite(true); // Start loader
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      setIsInvite(false); // Stop loader
      return;
    }
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    try {
      const response = await fetch(
        `${baseURL}rfq/events/${id}/invite_vendor?token=${token}&name=${inviteForm.name}&mobile=${inviteForm.mobile}&email=${inviteForm.email}&add_vendor=true&organization_name=${inviteForm?.organization}&company_id=${inviteForm.company}`,
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
          organisation: newVendor.organization_name || "_",
        };

        setVendorData((prev) => [...prev, formattedVendor]);
        setFilteredData((prev) => [...prev, formattedVendor]);

        // Refresh participants data immediately
        const participantsResponse = await fetch(
          `${baseURL}rfq/events/${id}/event_vendors?token=${token}&page=${currentParticipantPage}`
        );
        if (participantsResponse.ok) {
          const participantsData = await participantsResponse.json();
          setParticipants(participantsData || []);
          setTotalParticipantPages(participantsData?.pagination?.total_pages || 1);
        }

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
      setIsInvite(false); // Stop loader
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

  // console.log("totalParticipantPages", totalParticipantPages);
  // console.log("currentParticipantPage", currentParticipantPage);
  

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
        const response = await fetch(
          `${baseURL}rfq/events/${id}/event_vendors?token=${token}&page=${currentParticipantPage}`
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
            const { id,full_name, organization_name, mobile, email } =
              vendor.pms_supplier || {};
              console.log("vendor.pms_supplier",vendor.pms_supplier);
              
            return {
              id: id,
              name: full_name || "_",
              phone: mobile || "_",
              email: email || "_",
              organisation: organization_name || "_",
            };
          })
        : []
    );
  }, [participants]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    fetch(
      `${baseURL}/rfq/events/company_list?token=${token}`
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
    const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
    try {
      const response = await fetch(
        `${baseURL}rfq/events/vendor_list?token=${token}&event_id=${id}&page=${page}&q[first_name_or_last_name_or_email_or_mobile_or_nature_of_business_name_cont]=${searchTerm}`
      );
      const data = await response.json();

      const vendors = Array.isArray(data.vendors) ? data.vendors : [];

      const formattedData = vendors
        .map((vendor) => ({
          id: vendor.id,
          name: vendor.full_name || vendor.organization_name || "_",
          email: vendor.email || "_",
          organisation: vendor.organization_name || "_",
          phone: vendor.contact_number || vendor.mobile || "_",
          city: vendor.city_id || "_",
          tags: vendor.tags || "_",
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
    setModalFilteredTableData(tableData);
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
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const url = `${baseURL}rfq/events/${id}/add_vendors?token=${token}&pms_supplier_ids=[${selectedVendorIds.join(
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
        
        // Refresh participants data immediately
        const participantsResponse = await fetch(
          `${baseURL}rfq/events/${id}/event_vendors?token=${token}&page=${currentParticipantPage}`
        );
        if (participantsResponse.ok) {
          const participantsData = await participantsResponse.json();
          setParticipants(participantsData || []);
          setTotalParticipantPages(participantsData?.pagination?.total_pages || 1);
        }
        
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

  const handleIndividualSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredData(vendorData); // Reset to original data
    } else {
      const filteredResults = vendorData.filter(
        (vendor) =>
          (vendor.name && vendor.name.toLowerCase().includes(searchValue)) ||
          (vendor.phone && vendor.phone.toLowerCase().includes(searchValue)) ||
          (vendor.email && vendor.email.toLowerCase().includes(searchValue))
      );
      setFilteredData(filteredResults); // Update filtered data
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setFilteredTableData([suggestion]); // Show only the selected suggestion
    setSuggestions([]); // Clear suggestions
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setModalSearchTerm(value);
    if (value === "") {
      setModalSuggestions([]);
      setModalFilteredTableData(tableData);
      setIsModalSuggestionsVisible(false);
    } else {
      const allData = [...tableData, ...vendorData];
      const filteredSuggestions = allData.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(value.toLowerCase()) ||
          vendor.phone?.toLowerCase().includes(value.toLowerCase()) ||
          vendor.email?.toLowerCase().includes(value.toLowerCase())
      );
      setModalSuggestions(filteredSuggestions);
      setModalFilteredTableData(filteredSuggestions);
      setIsModalSuggestionsVisible(true);
    }
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

  ;

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
    if (inviteVendorData.gstinApplicable === 'yes' && (!inviteVendorData.gstNumber || !gstRegex.test(inviteVendorData.gstNumber))) {
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
    };
    try {
      const response = await axios.post(
        `${baseURL}rfq/events/${id}/invite_vendor?token=${token}&add_vendor=true`,
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
          // Add to vendorData and filteredData for main table
          const formattedVendor = {
            key: newVendor.id,
            serialNumber: vendorData.length + 1,
            name: newVendor.full_name || `${inviteVendorData.firstName} ${inviteVendorData.lastName}`,
            phone: newVendor.mobile || inviteVendorData.mobile,
            email: newVendor.email || inviteVendorData.email,
            organisation: newVendor.organization_name || '',
          };
          setVendorData((prev) => [formattedVendor, ...prev]);
          setFilteredData((prev) => [formattedVendor, ...prev]);
          // Reset the form fields
          setInviteVendorData({
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
          });
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

  // const

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
          <div className="input-group position-relative">
            <input
              type="search"
              id="searchInput"
              className="w-50 tbl-search"
              placeholder="Type your vendors here"
              style={{ paddingLeft: "10px" }}
              value={searchTerm}
              onChange={handleIndividualSearchChange}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-md btn-default"
                onClick={() => setFilteredTableData(vendorData)} // Reset table data on button click
              >
                <SearchIcon />
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul
                className="suggestions-list position-absolute bg-white border rounded w-100"
                style={{
                  zIndex: 1000,
                  top: "100%",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 cursor-pointer"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
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
          isInvite ? (
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
            <div className="tbl-container" style={{ height: '600px', overflowY: 'auto' }}>
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Name</th>
                    <th>Mob No.</th>
                    <th>Email</th>
                    {/* <th>Organisation</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((vendor, index) => (
                    
                    <tr key={vendor.key}>
                      <td style={{ textAlign: "left" }}>
                        {(currentParticipantPage - 1) * participantPageSize +
                          index +
                          1}
                      </td>
                      <td style={{ textAlign: "left" }}>{vendor.name}</td>
                      <td style={{ textAlign: "left" }}>{vendor.phone}</td>
                      <td style={{ textAlign: "left" }}>{vendor.email}</td>
                      {/* <td style={{ textAlign: "left" }}>
                        {vendor.organisation || "_"}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      id="modalSearchInput"
                      className="tbl-search form-control"
                      placeholder="Search Vendors"
                      value={modalSearchTerm}
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
                    {isModalSuggestionsVisible && modalSuggestions.length > 0 && (
                      <ul
                        className="suggestions-list position-absolute bg-white border rounded w-100"
                        style={{
                          zIndex: 1000,
                          top: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {modalSuggestions.map((suggestion, id) => (
                          <li
                            key={id}
                            onClick={() => {
                              setModalSearchTerm(suggestion.name);
                              setModalFilteredTableData([suggestion]);
                              setModalSuggestions([]);
                              setIsModalSuggestionsVisible(false);
                            }}
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
                {console.log("filteredData:-",filteredData,"modalFilteredTableData:-",modalFilteredTableData)
                }
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                  {modalFilteredTableData.length > 0 ? (
                    <Table
                      scrollable={true}
                      columns={participantsTabColumns}
                      showCheckbox={true}
                      data={modalFilteredTableData.map((vendor, index) => ({
                        ...vendor,
                        srNo: (currentPage - 1) * pageSize + index + 1,
                      }))}
                      handleCheckboxChange={handleCheckboxChange}
                      isRowSelected={(vendorId) => {
  const modalVendor = modalFilteredTableData.find(v => v.id === vendorId || v.key === vendorId);
  if (!modalVendor) return false;
  return filteredData.some(fd =>
    fd.name === modalVendor.name &&
    fd.email === modalVendor.email &&
    fd.phone === modalVendor.phone &&
    fd.organisation === modalVendor.organisation
  );
}}
                      resetSelectedRows={resetSelectedRows}
                      onResetComplete={() => setResetSelectedRows(false)}
                      onRowSelect={undefined}
                      cellClass="text-start"
                      currentPage={currentPage}
                      pageSize={pageSize}
                      fullWidth={true}
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

        {/* <DynamicModalBox
          show={inviteModal}
          onHide={handleInviteModalClose}
          modalType={true}
          title="Invite New Vendor"
          children={
            <>
              <form className="p-2" onSubmit={handleInviteSubmit}>
                <div className="form-group mb-3">
                  <label className="po-fontBold">POC - Full Name <span style={{ color: "red" }}>*</span></label>
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
                  <label className="po-fontBold">Email <span style={{ color: "red" }}>*</span></label>
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
                  <label className="po-fontBold">Phone Number <span style={{ color: "red" }}>*</span></label>
                  <input
                    className="form-control"
                    type="text"
                    name="mobile"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      const invalidChars = ["e", "E", "+", "_", ".", ","];
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
                  <label className="po-fontBold">Company <span style={{ color: "red" }}>*</span></label>
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
                  <label className="po-fontBold">Organization </label>
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
        /> */}
         <Modal show={inviteModal} onHide={handleInviteModalClose} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Invite New Vendor</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <form className="p-2" onSubmit={handleInviteVendor}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">First Name <span style={{ color: 'red' }}>*</span></label>
                        <input className="form-control" type="text" name="firstName" placeholder="Enter First Name" value={inviteVendorData.firstName} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Last Name <span style={{ color: 'red' }}>*</span></label>
                        <input className="form-control" type="text" name="lastName" placeholder="Enter Last Name" value={inviteVendorData.lastName} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Email <span style={{ color: 'red' }}>*</span></label>
                        <input className="form-control" type="email" name="email" placeholder="Enter Email Address" value={inviteVendorData.email} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Phone Number <span style={{ color: 'red' }}>*</span></label>
                        <input className="form-control" type="text" name="mobile" inputMode="numeric" pattern="[0-9]*" maxLength={10} onKeyDown={(e) => { const invalidChars = ['e', 'E', '+', '-', '.', ',']; if (invalidChars.includes(e.key) || (isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab')) { e.preventDefault(); } }} placeholder="Enter Phone Number" value={inviteVendorData.mobile} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">GSTIN Applicable <span style={{ color: 'red' }}>*</span></label>
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
                          <label className="po-fontBold">GSTIN <span style={{ color: 'red' }}>*</span></label>
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
                        <label className="po-fontBold">PAN No. <span style={{ color: 'red' }}>*</span></label>
                        <input className="form-control" type="text" name="panNumber" placeholder="Enter PAN Number" value={inviteVendorData.panNumber} onChange={handleInviteVendorChange} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="po-fontBold">Department <span style={{ color: 'red' }}>*</span></label>
                        <SingleSelector options={departmentOptions} value={departmentOptions.find(opt => opt.value === inviteVendorData.department) || null} onChange={handleDepartmentChange} placeholder="Select Department" />
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
      </div>

      <ToastContainer />
    </>
  );
}
