import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { DownloadIcon, FilterIcon, StarIcon, SettingIcon } from "../components";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";

const BillEntryList = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [billEntries, setBillEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);

  // Company, Project, Site states
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);

  // Bulk Action states
  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedBillDetails, setSelectedBillDetails] = useState("");

  // Status options for bulk action
  const statusOptions = [
    { label: "Select Status", value: "" },
    { label: "Draft", value: "draft" },
    { label: "Verified", value: "verified" },
    { label: "Submitted", value: "submitted" },
    { label: "Proceed", value: "proceed" },
    { label: "Approved", value: "approved" },
  ];

  // Add modal states
  const [filterModal, setFilterModal] = useState(false);
  const [layoutModal, setLayoutModal] = useState(false);

  // Add modal handlers
  const openFilterModal = () => setFilterModal(true);
  const closeFilterModal = () => setFilterModal(false);
  const openLayoutModal = () => setLayoutModal(true);
  const closeLayoutModal = () => setLayoutModal(false);

  // Add handleChange function
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  // Fetch bill entries
  const fetchData = async (page) => {
    const search = searchKeyword || "";
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}bill_entries?page=${page}&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[invoice_number_or_einvoice_or_inventory_date_or_invoice_amount_or_other_deductions_or_total_value_or_status_or_total_amount_or_company_company_name_or_pms_site_name_or_project_name_or_supplier_first_name_or_supplier_last_name_or_bill_purchase_orders_purchase_order_po_number_eq]=${search}`
      );
      setBillEntries(response.data.bill_entries || []);
      setMeta(response.data.meta);
      setTotalPages(response.data.meta.total_pages);
      setTotalEntries(response.data.meta.total_count);
    } catch (error) {
      console.error("Error fetching bill entries:", error);
      setError("Failed to fetch bill entries");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when page/search changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchKeyword]);

  // Fetch companies on component mount
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
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);

    if (selectedOption) {
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

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);

    if (selectedOption) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
    }
  };

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Map companies to options
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch filtered data
  const fetchFilteredData = () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";
    const search = searchKeyword || "";

    const url = `${baseURL}bill_entries?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}&q[project_id_eq]=${projectId}&q[site_id_eq]=${siteId}`;

    axios
      .get(url)
      .then((response) => {
        setBillEntries(response.data.bill_entries);
        setTotalPages(response.data.meta.total_pages);
        setTotalEntries(response.data.meta.total_count);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  };

  // Handle reset
  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);

    axios
      .get(
        `${baseURL}bill_entries?page=1&per_page=10&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setBillEntries(response.data.bill_entries);
        setMeta(response.data.meta);
        setTotalPages(response.data.meta.total_pages);
        setTotalEntries(response.data.meta.total_count);
      })
      .catch((error) => {
        console.error("Error resetting data:", error);
      });
  };

  // Handle bulk action status changes
  const handleStatusChange = (selectedOption) => {
    setFromStatus(selectedOption.value);
  };

  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  // Handle bulk action submit
  const handleSubmit = () => {
    if (!fromStatus || !toStatus) {
      alert("Please select both 'From Status' and 'To Status'.");
      return;
    }

    const data = {
      bill_entry_ids: selectedBillDetails,
      to_status: toStatus,
      comments: remark,
    };

    axios
      .patch(
        `${baseURL}bill_entries/update_bulk_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        data
      )
      .then((response) => {
        console.log("Success:", response.data);
        alert("Status updated successfully");
        fetchData(currentPage); // Refresh the data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (billDetailId) => {
    setSelectedBillDetails((prevSelected) => {
      const selectedArray = prevSelected
        ? prevSelected.split(",").map(Number)
        : [];
      if (selectedArray.includes(billDetailId)) {
        const updatedArray = selectedArray.filter((id) => id !== billDetailId);
        return updatedArray.join(",");
      } else {
        const updatedArray = [...selectedArray, billDetailId];
        return updatedArray.join(",");
      }
    });
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Billing &gt; MOR &gt; Bill Entry List</a>
          <h5 className="mt-4 fw-bold">Bill Entry List</h5>
          <div className="mor-tabs mt-4">
            <ul
              className="nav nav-pills mb-3 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#create-mor"
                  type="button"
                  role="tab"
                  aria-controls="create-mor"
                  aria-selected="false"
                >
                  Material
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#mor-approval-create"
                  type="button"
                  role="tab"
                  aria-controls="mor-approval-create"
                  aria-selected="true"
                >
                  Service
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  Misc.
                </button>
              </li>
              <li className="nav-item" role="presentation" />
            </ul>
          </div>
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row separteinto6 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    className="content-box tab-button active"
                    data-tab="total"
                  >
                    <h4 className="content-box-title fw-semibold">Bill List</h4>
                    <p className="content-box-sub">{totalEntries}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div className="content-box tab-button" data-tab="draft">
                    <h4 className="content-box-title fw-semibold">
                      Open Bills
                    </h4>
                    <p className="content-box-sub">{meta?.open || 0}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className="content-box tab-button"
                    data-tab="pending-approval"
                  >
                    <h4 className="content-box-title fw-semibold">
                      Online Bills
                    </h4>
                    <p className="content-box-sub">{meta?.online || 0}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    className="content-box tab-button"
                    data-tab="self-overdue"
                  >
                    <h4 className="content-box-title fw-semibold">
                      Offline Bills
                    </h4>
                    <p className="content-box-sub">{meta?.offline || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content1 active" id="total-content">
            {/* Total Content Here */}
            <div className="card mt-3 pb-4">
              <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Company</label>
                      <SingleSelector
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder="Select Company"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Project</label>
                      <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder="Select Project"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder="Select Sub-project"
                      />
                    </div>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button className="purple-btn2" onClick={fetchFilteredData}>
                      Go
                    </button>
                  </div>
                  <div className="col-md-1 mt-4 d-flex justify-content-center">
                    <button className="purple-btn2" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </div>
              </CollapsibleCard>
              <div className="card mx-3 mt-2">
                <div className="card-header3">
                  <h3 className="card-title">Bulk Action</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={16} cy={16} r={16} fill="#8B0203" />
                        <path
                          d="M16 24L9.0718 12L22.9282 12L16 24Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="card-body mt-0 pt-0">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>From Status</label>
                          <SingleSelector
                            options={statusOptions}
                            value={statusOptions.find(
                              (option) => option.value === fromStatus
                            )}
                            onChange={handleStatusChange}
                            placeholder="Select Status"
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label>To Status</label>
                          <SingleSelector
                            options={statusOptions}
                            value={statusOptions.find(
                              (option) => option.value === toStatus
                            )}
                            onChange={handleToStatusChange}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Remark</label>
                          <textarea
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
                  </div>
                </form>
              </div>
              <div className="row mt-2">
                <div className="col-md-5 ms-3">
                  <form>
                    <div className="input-group">
                      <input
                        type="search"
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-md btn-default"
                        >
                          <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                              fill="#8B0203"
                            />
                            <path
                              d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                              fill="#8B0203"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-end">
                    <div className="col-md-5">
                      <div className="row justify-content-end px-3">
                        <div className="col-md-3">
                          <button
                            className="btn btn-md"
                            data-bs-toggle="modal"
                            data-bs-target="#sidebarModal"
                          >
                            <FilterIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button type="submit" className="btn btn-md">
                            <StarIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button
                            id="downloadButton"
                            type="submit"
                            className="btn btn-md"
                          >
                            <DownloadIcon />
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button
                            type="submit"
                            className="btn btn-md"
                            data-bs-toggle="modal"
                            data-bs-target="#settings"
                          >
                            <SettingIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end me-3">
                <button className="purple-btn2 m-0 p-1 px-3">
                  <div style={{ color: "white" }}>
                    <span className="material-symbols-outlined align-text-top me-2">
                      add{" "}
                    </span>
                    Add
                  </div>
                </button>
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
                      <th className="text-start">ID</th>
                      <th className="text-start">Mode of Submission</th>
                      <th className="text-start">Company</th>
                      <th className="text-start">Project</th>
                      <th className="text-start">Sub Project</th>
                      <th className="text-start">Vendor Name</th>
                      <th className="text-start">UAM No.</th>
                      <th className="text-start">PO No.</th>
                      <th className="text-start">Created On</th>
                      <th className="text-start">Accepted On</th>
                      <th className="text-start">Bill No.</th>
                      <th className="text-start">Bill Date</th>
                      <th className="text-start">Bill Amount</th>
                      <th className="text-start">Bill Copies</th>
                      <th className="text-start">Due</th>
                      <th className="text-start">Due Date</th>
                      <th className="text-start">Certificate No.</th>
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
                    {loading ? (
                      <tr>
                        <td colSpan="26" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="26" className="text-center text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : billEntries.length === 0 ? (
                      <tr>
                        <td colSpan="26" className="text-center">
                          No bill entries found
                        </td>
                      </tr>
                    ) : (
                      billEntries.map((entry, index) => (
                        <tr key={entry.id}>
                          <td className="text-start">
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(entry.id)}
                              checked={selectedBillDetails
                                .split(",")
                                .includes(entry.id.toString())}
                            />
                          </td>
                          <td className="text-start">{index + 1}</td>
                          <td className="text-start">{entry.id || "-"}</td>
                          <td className="text-start">
                            {entry.mode_of_submission || "-"}
                          </td>
                          <td className="text-start">
                            {entry.company_name || "-"}
                          </td>
                          <td className="text-start">
                            {entry.project_name || "-"}
                          </td>
                          <td className="text-start">
                            {entry.site_name || "-"}
                          </td>
                          <td className="text-start">
                            {entry.pms_supplier || "-"}
                          </td>
                          <td className="text-start">
                            {entry.uam_number || "-"}
                          </td>
                          <td className="text-start">
                            {entry.po_number || "-"}
                          </td>
                          <td className="text-start">
                            {entry.created_at
                              ? new Date(entry.created_at).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">
                            {entry.accepted_at
                              ? new Date(entry.accepted_at).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="text-start">{entry.bill_no || "-"}</td>
                          <td className="text-start">
                            {entry.bill_date || "-"}
                          </td>
                          <td className="text-start">
                            {entry.bill_amount || "-"}
                          </td>
                          <td className="text-start">
                            {entry.bill_copies || "-"}
                          </td>
                          <td className="text-start">{entry.due || "-"}</td>
                          <td className="text-start">
                            {entry.due_date || "-"}
                          </td>
                          <td className="text-start">
                            {entry.certificate_no || "-"}
                          </td>
                          <td className="text-start">
                            {entry.payable_amount || "-"}
                          </td>
                          <td className="text-start">{entry.paid || "-"}</td>
                          <td className="text-start">{entry.balance || "-"}</td>
                          <td className="text-start">{entry.status || "-"}</td>
                          <td className="text-start">{entry.overdue || "-"}</td>
                          <td className="text-start">
                            {entry.assign_to || "-"}
                          </td>
                          <td className="text-start">{entry.tat || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add pagination */}
              <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                <ul className="pagination justify-content-center d-flex">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
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

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}
                  {totalEntries} entries
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content1" id="draft-content"></div>
        </div>
      </div>

      {/* Add back the modals */}
      <Modal
        centered
        size="lg"
        show={filterModal}
        onHide={closeFilterModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <div
          className="modal-body"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Mode of Submission</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Company</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Project</label>
                <SingleSelector
                  options={companyOptions}
                  selectedValue={selectedValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* ... rest of your filter modal content ... */}
          </div>
        </div>
        <div className="modal-footer modal-footer-k justify-content-center">
          <button className="purple-btn2" onClick={closeFilterModal}>
            Close
          </button>
        </div>
      </Modal>

      <Modal
        centered
        size="sm"
        show={layoutModal}
        onHide={closeLayoutModal}
        backdrop="static"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body>{/* ... your layout modal content ... */}</Modal.Body>
      </Modal>
    </>
  );
};

export default BillEntryList;
