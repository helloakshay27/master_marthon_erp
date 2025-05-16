import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SettingIcon,
  StarIcon,
} from "../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { Link } from "react-router-dom";

const BillBookingList = () => {
  const navigate = useNavigate(); // Initialize navigation

  const [billData, setBillData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [meta, setMeta] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Items per page
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState("total"); // State to track the active tab
  // Fetch data from API
  // useEffect(() => {
  const fetchData = async (page) => {
    // const search = searchKeyword||"";
    try {
      setLoading(true); // Start loading
      const response = await axios.get(
        `${baseURL}bill_bookings?page=${page}&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      setBillData(response.data.bill_bookings); // Set fetched data
      setMeta(response.data.meta)
      setTotalPages(response.data.meta.total_pages); // Set total pages
      setTotalEntries(response.data.meta.total_count);
      setLoading(false); // Stop loading
    } catch (err) {
      setError("Failed to fetch data. Please try again."); // Set error message
      setLoading(false); // Stop loading
    }
  };

  //   fetchData();
  // }, []);
  // Add a new state to track the total number of entries
  const [totalEntries, setTotalEntries] = useState(0);

  // Fetch data on component mount and when the page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);
  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  // const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  // const [wingsOptions, setWingsOptions] = useState([]);


  // Fetch company data on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }))
      );
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

    if (selectedOption) {
      // Find the selected project from the list of projects of the selected company
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      // Set site options based on selected project
      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Map companies to options for the dropdown
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const [validationErrors, setValidationErrors] = useState({});

  // const validateAndFetchFilteredData = () => {
  //   const errors = {};

  //   if (!selectedCompany) {
  //     errors.company = "Please select a company.";
  //   }
  //   if (!selectedProject) {
  //     errors.project = "Please select a project.";
  //   }
  //   if (!selectedSite) {
  //     errors.site = "Please select a sub-project.";
  //   }

  //   setValidationErrors(errors);

  //   // If no errors, fetch filtered data
  //   if (Object.keys(errors).length === 0) {
  //     fetchFilteredData();
  //   }
  // };

  const fetchFilteredData = () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";
    const search = searchKeyword || "";
    console.log("ids filter:", companyId, projectId, siteId)
    const url = `${baseURL}bill_bookings?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}&q[project_id_eq]=${projectId}&q[site_id_eq]=${siteId}`;

    // console.log("url:",url)
    axios
      .get(url)
      .then((response) => {
        setBillData(response.data.bill_bookings); // Set fetched data
        // setReconciliationData(response.data.data); // Update table data
        setTotalPages(response.data.meta.total_pages); // Update total pages
        setTotalEntries(response.data.meta.total_count); // Update total entries
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  };
  const handleReset = () => {
    // Clear selected filters
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);

    // Fetch unfiltered data
    axios
      .get(`${baseURL}bill_bookings?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then((response) => {
        setBillData(response.data.bill_bookings); // Set fetched data
        setMeta(response.data.meta)
        setTotalPages(response.data.meta.total_pages); // Reset total pages
        setTotalEntries(response.data.meta.total_count); // Reset total entries
      })
      .catch((error) => {
        console.error("Error resetting data:", error);
      });
  };
  //  bulk action 
  //bulkaction options 
  const options = [
    {
      label: 'Select Status',
      value: '',
    },
    {
      label: 'Draft',
      value: 'draft',
    },
    {
      label: 'Verified',
      value: 'verified',
    },
    {
      label: 'Submitted',
      value: 'submitted',
    },
    {
      label: 'Proceed',
      value: 'proceed',
    },
    {
      label: 'Approved',
      value: 'approved',
    },

  ];

  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  // const [boqList, setBoqList] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleStatusChange = (selectedOption) => {
    // const { name, value } = e.target;
    // if (name === "fromStatus") {
    //   setFromStatus(selectedOption.value);
    // } else if (name === "toStatus") {
    //   setToStatus(selectedOption.value);
    // }

    setFromStatus(selectedOption.value);
  };

  // Handle status change for 'To Status'
  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };


  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const [selectedBoqDetails, setSelectedBoqDetails] = useState("");

  const handleSubmit = () => {
    // e.preventDefault();

    if (!fromStatus || !toStatus) {
      alert("Please select both 'From Status' and 'To Status'.");
      return;
    }

    // Prepare data to send
    const data = {
      bill_booking_ids: selectedBoqDetails,
      // from_status: fromStatus,
      to_status: toStatus,
      comments: remark,
    };
    console.log("data for bulk action", data)

    // Send data to API using axios
    axios
      .patch(
        `${baseURL}bill_bookings/update_bulk_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        data
      )
      .then((response) => {
        console.log('Success:', response.data);
        alert('Status updated successfully ....')
        // Handle success (e.g., show a success message, update UI, etc.)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show an error message)
      });
  };

  // Fetch the data when 'fromStatus' changes
  useEffect(() => {
    if (fromStatus) { // Only fetch data if a status is selected
      setLoading(true); // Show loading state while fetching
      axios
        .get(`${baseURL}bill_bookings?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[status_eq]=${fromStatus}`)
        .then((response) => {
          setBillData(response.data.bill_bookings); // Set fetched data
          setMeta(response.data.meta)
          setTotalPages(response.data.meta.total_pages); // Reset total pages
          setTotalEntries(response.data.meta.total_count); // Reset total entries
        })
        .catch((error) => {
          console.error("Error resetting data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when request is complete
        });
    }
  }, [fromStatus]);  // This will run every time 'fromStatus' changes



  // State to track selected bill detail IDs
  const handleCheckboxChange = (boqDetailId) => {
    setSelectedBoqDetails((prevSelected) => {
      const selectedArray = prevSelected ? prevSelected.split(",").map(Number) : [];
      if (selectedArray.includes(boqDetailId)) {
        // If already selected, remove it from the string
        const updatedArray = selectedArray.filter((id) => id !== boqDetailId);
        return updatedArray.join(",");
      } else {
        // If not selected, add it to the string
        const updatedArray = [...selectedArray, boqDetailId];
        return updatedArray.join(",");
      }
    });
  };

  console.log("selected bill id array :", selectedBoqDetails)

  //card filter
  const fetchFilteredData2 = (status) => {
    const url = `${baseURL}bill_bookings?page=1&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414${status ? `&q[status_eq]=${status}` : ""
      }`;

    axios
      .get(url)
      .then((response) => {
        setBillData(response.data.bill_bookings);
        // setCreditNotes(response.data.credit_notes);
        setTotalPages(response.data.meta.total_pages); // Set total pages
        setTotalEntries(response.data.meta.total_count);
        setMeta(response.data.meta);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  };

  const fetchSearchResults = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `${baseURL}bill_bookings?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_or_project_id_or_site_id_or_pms_supplier_id_or_invoice_number_or_einvoice_or_inventory_date_or_invoice_amount_or_type_of_certificate_or_department_id_or_other_deductions_or_other_deduction_remarks_or_other_additions_or_other_addition_remarks_or_retention_per_or_retention_amount_or_total_value_or_status_or_payee_name_or_payment_mode_or_payment_due_date_or_created_by_id_or_created_at_or_updated_at_or_total_amount_or_payable_amount_or_remark_or_base_cost_or_all_inclusive_cost_or_other_deduction_or_po_type_cont]=${searchKeyword}`
      );
      setBillData(response.data.bill_bookings);
      // setCreditNotes(response.data.credit_notes);
      setMeta(response.data.meta);
      setTotalPages(response.data.meta.total_pages);
      setTotalEntries(response.data.meta.total_count);
    } catch (err) {
      setError("Failed to fetch search results");
      console.error("Error fetching search results:", err);
    } finally {
      // setLoading(false);
    }
  };


  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Billing &amp; Accounts &gt; Bill Booking</a>
          <h5 className="mt-4 fw-bold">Bill Booking</h5>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto7 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button active"
                    data-tab="total"
                    className={`content-box tab-button ${activeTab === "total" ? "active" : ""}`}
                    onClick={() => {
                      if (activeTab !== "total") {
                        setActiveTab("total")
                        fetchFilteredData2("")
                      }
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Bill List</h4>
                    <p className="content-box-sub">{meta?.total_count}</p>
                    {/* {console.log("meta data ", billData)} */}
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button" 
                    data-tab="draft"
                    className={`content-box tab-button ${activeTab === "draft" ? "active" : ""}`}
                    onClick={() => {
                      if (activeTab !== "draft") {
                        setActiveTab("draft")
                        fetchFilteredData2("draft")
                      }
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Draft
                    </h4>
                    <p className="content-box-sub">{meta?.draft_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button" 
                    data-tab="verified"
                    className={`content-box tab-button ${activeTab === "verified" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("verified")
                      fetchFilteredData2("verified")
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Verified Bills
                    </h4>
                    <p className="content-box-sub">{meta?.verified_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="submitted"
                    className={`content-box tab-button ${activeTab === "submitted" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("submitted")
                      fetchFilteredData2("submitted")
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Submit</h4>
                    <p className="content-box-sub">{meta?.submited_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="approved"
                    className={`content-box tab-button ${activeTab === "approved" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("approved")
                      fetchFilteredData2("approved")
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Approved</h4>
                    <p className="content-box-sub">{meta?.approved_count}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="proceed"
                    className={`content-box tab-button ${activeTab === "proceed" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("proceed")
                      fetchFilteredData2("")
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Proceed</h4>
                    <p className="content-box-sub">{meta?.proceed_count}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content1 active" id="total-content">
            {/* Total Content Here */}
            <div className="card mt-3 pb-4 mb-5">
              <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Company
                      </label>

                      <SingleSelector
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder={`Select Company`}
                      />
                      {/* {validationErrors.company && (
                        <span className="text-danger">{validationErrors.company}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Project
                      </label>

                      <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`}
                      />
                      {/* {validationErrors.project && (
                        <span className="text-danger">{validationErrors.project}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Sub-Project
                      </label>
                      {/* Pass static data as options */}
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                      {/* {validationErrors.site && (
                        <span className="text-danger">{validationErrors.site}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button className="purple-btn2" onClick={fetchFilteredData}>Go</button>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button className="purple-btn2" onClick={handleReset}>Reset</button>
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
                <form
                  onSubmit={handleSubmit}
                >
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        {/* <select
                                      name="fromStatus"
                                      className="form-control form-select"
                                       classNamePrefix="react-select"
                                      value={fromStatus}
                                      onChange={handleStatusChange}
                                    // value={formValues.fromStatus}
                                    // onChange={handleChange}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="draft">Draft</option>
                                      <option value="submitted">Submitted</option>
                                      <option value="approved">Approved</option>
                                    </select> */}
                        {/* {errors.fromStatus && <div className="text-danger mt-2">{errors.fromStatus}</div>} */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          value={options.find(option => option.value === fromStatus)}
                          onChange={handleStatusChange}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                        {/* {console.log("options:", options.value)} */}
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        {/* <select
                                      name="toStatus"
                                      className="form-control form-select"
                                      value={toStatus}
                                      onChange={handleToStatusChange}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="draft">Draft</option>
                                      <option value="submitted">Submitted</option>
                                      <option value="approved">Approved</option>
                                    </select> */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          onChange={handleToStatusChange}
                          value={options.find(option => option.value === toStatus)}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          name="remark"
                          className="form-control"
                          rows={4}
                          placeholder="Enter ..."
                          value={remark}
                          onChange={handleRemarkChange}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button type="submit" className="purple-btn2 m-0">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </CollapsibleCard>
              <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                {/* Search Input */}
                <div className="col-md-4">
                  <form>
                    <div className="input-group ms-3">
                      <input
                        type="search"
                        id="searchInput"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                      />
                      <div className="input-group-append">
                        <button type="button" className="btn btn-md btn-default"
                          onClick={() => fetchSearchResults()}
                        >
                          <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203" />
                            <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Buttons & Filter Section */}
                <div className="col-md-6">
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    {/* Filter Icon */}
                    {/* <button className="btn btn-md btn-default">
                      <svg
                        width={28}
                        height={28}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.66604 5.64722C6.39997 5.64722 6.15555 5.7938 6.03024 6.02851C5.90494 6.26322 5.91914 6.54788 6.06718 6.76895L13.7378 18.2238V29.0346C13.7378 29.2945 13.8778 29.5343 14.1041 29.6622C14.3305 29.79 14.6081 29.786 14.8307 29.6518L17.9136 27.7927C18.13 27.6622 18.2622 27.4281 18.2622 27.1755V18.225L25.9316 6.76888C26.0796 6.5478 26.0938 6.26316 25.9685 6.02847C25.8432 5.79378 25.5987 5.64722 25.3327 5.64722H6.66604ZM15.0574 17.6037L8.01605 7.08866H23.9829L16.9426 17.6051C16.8631 17.7237 16.8207 17.8633 16.8207 18.006V26.7685L15.1792 27.7584V18.0048C15.1792 17.862 15.1368 17.7224 15.0574 17.6037Z"
                          fill="#8B0203"
                        />
                      </svg>
                    </button> */}

                    {/* Create BOQ Button */}
                    <button className="purple-btn2"
                      onClick={() => navigate("/bill-booking-create")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                      </svg>
                      <span> Add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="tbl-container mx-3 mt-3" style={{ width: "98%" }}>
                <table
                  style={{
                    width: "max-content",
                    maxHeight: "max-content",
                    height: "auto",
                  }}
                >
                  <thead>
                    <tr>
                      <th className="text-start">
                        <input type="checkbox" />
                      </th>
                      <th className="text-start">Sr.No.</th>
                      <th className="text-start">Bill No.</th>
                      {/* <th className="text-start">Mode of Submission</th> */}
                      <th className="text-start">Company</th>
                      <th className="text-start">Project</th>
                      <th className="text-start">Sub Project</th>
                      <th className="text-start">Vendor Name</th>
                      <th className="text-start">UAM No.</th>
                      <th className="text-start">PO No.</th>
                      <th className="text-start">Created On</th>
                      <th className="text-start">Accepted On</th>
                      <th className="text-start">Bill Date</th>
                      <th className="text-start">Bill Amount</th>
                      <th className="text-start">Bill Copies</th>
                      <th className="text-start">Due</th>
                      <th className="text-start">Due Date</th>
                      <th className="text-start">Certificate No.</th>
                      <th className="text-start">Advance adjust amount</th>
                      <th className="text-start">Payable Amount</th>
                      <th className="text-start">Paid</th>
                      <th className="text-start">Balance</th>
                      <th className="text-start">Status</th>
                      <th className="text-start">Overdue</th>
                      <th className="text-start">Assign to</th>
                      <th className="text-start">TAT</th>
                    </tr>
                  </thead>
                  <tbody>

                    {billData.length > 0 ? (
                      billData.map((bill, index) => (
                        <tr key={bill.id}>
                          <td className="text-start">
                            <input
                              className="ms-1 me-1 mb-1"
                              type="checkbox"
                              checked={selectedBoqDetails.includes(bill.id)} // Check if this ID is selected
                              onChange={() => handleCheckboxChange(bill.id)} // Handle checkbox change
                            />
                          </td>
                          <td className="text-start">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="text-start boq-id-link">
                            <Link
                              to={`/bill-booking-details/${bill.id}`}
                              className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
                              {bill.invoice_number}
                            </Link>
                          </td>
                          {/* <td className="text-start">{""}</td> */}
                          <td className="text-start">{bill.company_name}</td>
                          <td className="text-start">{bill.project_name}</td>
                          <td className="text-start">{bill.site_name || ""}</td>
                          <td className="text-start">{bill.pms_supplier || ""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{bill.po_number || ""}</td>
                          <td className="text-start">
                            {bill.created_at ? new Date(bill.created_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }) : ""}
                          </td>
                          <td className="text-start">
                            {/* {bill.accepted_on ? new Date(bill.accepted_on).toLocaleDateString() : ""} */}
                          </td>

                          <td className="text-start">
                            {bill.inventory_date ? new Date(bill.inventory_date).toLocaleDateString(
                              "en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }) : ""}
                          </td>
                          <td className="text-start">{bill.total_amount || ""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">
                            {bill.payment_due_date ? new Date(bill.payment_due_date).toLocaleDateString(
                              "en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                            ) : ""}
                          </td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{bill.payable_amount || ""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{bill.status
                            ? bill.status.charAt(0).toUpperCase() + bill.status.slice(1)
                            : ""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{""}</td>
                          <td className="text-start">{""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="28" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                <ul className="pagination justify-content-center d-flex">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries}{" "}
                  entries
                </div>
              </div>


            </div>
          </div>
          <div className="tab-content1" id="draft-content"></div>
        </div>
      </div>
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
          <p>Loading...</p>
        </div>
      )}

      {/* modal start */}
      <Modal
        centered
        size="lg"
        // show={filterModal}
        // onHide={closeFilterModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add</Modal.Title>
        </Modal.Header>
        <div
          className="modal-body "
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Mode of Submission</label>
                {/* <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Company</label>
                {/* <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Project </label>
                {/* <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Sub Project </label>
                {/* <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Vendor Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Is MSME</label>
                {/* <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                /> */}
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>PO No.</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Created on From </label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Created on To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Accepted On From</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Accepted On To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Bill No.</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Bill Date From &amp; To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Bill Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Bill Copies</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Due</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Due Date From &amp; To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Certificate No.</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Payable Amount</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Paid</label>
                <div className="">
                  <input
                    className="form-control"
                    type="text"
                    placeholder=""
                    fdprocessedid="qv9ju9"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Balance</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Status</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Overdue</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>Assign To</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-group">
                <label>TAT</label>
                <input
                  className="form-control"
                  type="date"
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer modal-footer-k justify-content-center">
          <a
            className="purple-btn2"
            href="/pms/admin/task_managements/kanban_list?type="
          >
            Go
          </a>
        </div>
      </Modal>

      <Modal
        centered
        size="sm"
        // show={layoutModal}
        // onHide={closeLayoutModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-between align-items-center">
            <div className="col-md-6">
              <button type="submit" className="btn btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                    fill="black"
                  />
                </svg>
              </button>
              <label htmlFor=""> Sr No.</label>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div
        className="modal fade"
        id="settings"
        tabIndex={-1}
        aria-labelledby="exampleModal2Label"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-sm">
          <div className="modal-content">
            <div className="modal-header modal-header-k">
              <h4
                className="modal-title text-center w-100"
                id="exampleModalLabel"
                style={{ fontWeight: 500 }}
              >
                Layout
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-between align-items-center">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 10C19 11.0609 18.5786 12.0783 17.8284 12.8284C17.0783 13.5786 16.0609 14 15 14C13.9391 14 12.9217 13.5786 12.1716 12.8284C11.4214 12.0783 11 11.0609 11 10C11 8.93913 11.4214 7.92172 12.1716 7.17157C12.9217 6.42143 13.9391 6 15 6C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10ZM15 28C16.0609 28 17.0783 27.5786 17.8284 26.8284C18.5786 26.0783 19 25.0609 19 24C19 22.9391 18.5786 21.9217 17.8284 21.1716C17.0783 20.4214 16.0609 20 15 20C13.9391 20 12.9217 20.4214 12.1716 21.1716C11.4214 21.9217 11 22.9391 11 24C11 25.0609 11.4214 26.0783 12.1716 26.8284C12.9217 27.5786 13.9391 28 15 28ZM15 42C16.0609 42 17.0783 41.5786 17.8284 40.8284C18.5786 40.0783 19 39.0609 19 38C19 36.9391 18.5786 35.9217 17.8284 35.1716C17.0783 34.4214 16.0609 34 15 34C13.9391 34 12.9217 34.4214 12.1716 35.1716C11.4214 35.9217 11 36.9391 11 38C11 39.0609 11.4214 40.0783 12.1716 40.8284C12.9217 41.5786 13.9391 42 15 42ZM37 10C37 11.0609 36.5786 12.0783 35.8284 12.8284C35.0783 13.5786 34.0609 14 33 14C31.9391 14 30.9217 13.5786 30.1716 12.8284C29.4214 12.0783 29 11.0609 29 10C29 8.93913 29.4214 7.92172 30.1716 7.17157C30.9217 6.42143 31.9391 6 33 6C34.0609 6 35.0783 6.42143 35.8284 7.17157C36.5786 7.92172 37 8.93913 37 10ZM33 28C34.0609 28 35.0783 27.5786 35.8284 26.8284C36.5786 26.0783 37 25.0609 37 24C37 22.9391 36.5786 21.9217 35.8284 21.1716C35.0783 20.4214 34.0609 20 33 20C31.9391 20 30.9217 20.4214 30.1716 21.1716C29.4214 21.9217 29 22.9391 29 24C29 25.0609 29.4214 26.0783 30.1716 26.8284C30.9217 27.5786 31.9391 28 33 28ZM33 42C34.0609 42 35.0783 41.5786 35.8284 40.8284C36.5786 40.0783 37 39.0609 37 38C37 36.9391 36.5786 35.9217 35.8284 35.1716C35.0783 34.4214 34.0609 34 33 34C31.9391 34 30.9217 34.4214 30.1716 35.1716C29.4214 35.9217 29 36.9391 29 38C29 39.0609 29.4214 40.0783 30.1716 40.8284C30.9217 41.5786 31.9391 42 33 42Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <label htmlFor=""> Sr No.</label>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillBookingList;
