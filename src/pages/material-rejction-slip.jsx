import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";

import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SelectBox,
  SettingIcon,
  StarIcon,
} from "../components";

import ButtonChnageIcon from "../components/common/Icon/ButtonChnageIcon";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";

const MaterialRejctionSlip = () => {
  const [tableData, setTableData] = useState([]); // Store API Data
  const [loading, setLoading] = useState(true); // Loading State
  const [error, setError] = useState(null); // Error Handling
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);

  const [columnVisibility, setColumnVisibility] = useState({
    srNo: true,
    company: true,
    project: true,
    subProject: true,
    rejectionSlipNo: true,
    poNo: true,
    challanNo: true,
    grnNo: true,
    grnDate: true,
    rejectionSlipDate: true,
    createdOn: true,
    morNo: true,
    materialType: true,
    subType: true,
    material: true,
    supplierName: true,
    defectiveQty: true,
    defectiveRemark: true,
    store: true,
    status: true,
    dueDate: true,
    overdue: true,
    dueAt: true,
  });

  const handleToggleChange = (colKey) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [colKey]: !prev[colKey],
    }));
  };

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);
  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/mor_rejection_slips.json`);
        setTableData(response.data);
      } catch (error) {
        setError("Failed to fetch data!");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options

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

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

    setSiteOptions([]); // Reset site options

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

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);

    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        site_id: selectedOption.value, // Update formData with site_id
      }));
    }
  };

  return (
    <main className="h-100 w-100">
      <div className="main-content">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <a href="">
              Home &gt; Purchase &gt; MOR &gt; Material Rejection Slip
            </a>
            <h5 className="mt-3">Material Rejection Slip</h5>
            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row justify-content-center gap-4">
                  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                    <div className="content-box">
                      <h4 className="content-box-title">Rejection Slip List</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Accepted</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Rejected</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3 pb-4">
              <CollapsibleCard title="Quick Filter">
                <div>
                  <div className="row my-2 align-items-end">
                    {/* Event Title */}
                    <div className="col-md-2">
                      <label htmlFor="event-title-select">Company</label>

                      <SingleSelector
                        options={companyOptions}
                        // onChange={(selectedOption) =>
                        //   handleFilterChange("company", selectedOption?.value)
                        // }
                        // value={
                        //   filters.company
                        //     ? companyOptions.find(
                        //         (opt) => opt.value === filters.company
                        //       )
                        //     : null
                        // }
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder="Select Company"
                        isSearchable={true}
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-2">
                      <label htmlFor="event-no-select">Project</label>

                      <SingleSelector
                        options={projects}
                        // onChange={(selectedOption) =>
                        //   handleFilterChange("project", selectedOption?.value)
                        // }
                        // value={
                        //   filters.project
                        //     ? projects.find(
                        //         (opt) => opt.value === filters.project
                        //       )
                        //     : null
                        // }
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder="Select Project"
                      />
                    </div>

                    <div className="col-md-2">
                      <label htmlFor="event-no-select"> Sub Project</label>

                      <SingleSelector
                        options={siteOptions}
                        // onChange={(selectedOption) =>
                        //   handleFilterChange("site", selectedOption?.value)
                        // }
                        // value={
                        //   filters.site
                        //     ? siteOptions.find(
                        //         (opt) => opt.value === filters.site
                        //       )
                        //     : null
                        // }
                        onChange={(option) => setSelectedSite(option)}
                        value={selectedSite}
                        placeholder="Select Sub-project"
                      />
                    </div>

                    {/* Status */}

                    <button
                      type="submit"
                      className="col-md-1 purple-btn2 ms-4 mt-5"
                      // onClick={handleFilterSubmit}
                    >
                      Go{" "}
                    </button>

                    <button
                      className="col-md-1 purple-btn2 ms-2 mt-4"
                      // onClick={handleResetFilters}
                    >
                      Reset
                    </button>
                  </div>
                  {/* </form> */}
                </div>
              </CollapsibleCard>
              {/* <div className="card mx-3 collapsed-card"> */}
              <CollapsibleCard title="Bulk Action">
                {/* <div className="card-header3">
                  <h3 className="card-title">Bulk Action</h3> */}
                <div className="card-tools"></div>
                {/* </div> */}
                <div className="card-body mt-0 pt-0">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        <select
                          name="from_status"
                          id="from_status"
                          className="form-control form-select from"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        <select
                          name="to_status"
                          id="to_status"
                          className="form-control form-select to"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          className="form-control remark"
                          rows={4}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button className="purple-btn2 m-0 status">
                        <a style={{ color: "white !important" }}> Submit </a>
                      </button>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </CollapsibleCard>
              <div className="d-flex mt-3 align-items-end px-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      //  value={searchTerm}
                      //  onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                        //  onClick={() => handleSearch()}
                      >
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-end">
                    <div className="col-md-5">
                      <div className="row justify-content-end px-3">
                        <div className="col-md-3">
                          <button
                            type="submit"
                            className="btn btn-md"
                            data-bs-toggle="modal"
                            data-bs-target="#settings"
                          >
                            <SettingIcon></SettingIcon>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
              <div className="tbl-container mt-3">
                <table className="w-100 table  ">
                  {loading ? (
                    <p>Loading data...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <>
                      <thead
                      // style={{
                      //   maxWidth: "100%",
                      //   overflowX: "auto",
                      //   paddingRight: "20px",
                      // }}
                      >
                        <tr>
                          {columnVisibility.srNo && <th>Sr. No.</th>}
                          {columnVisibility.company && <th>Company</th>}
                          {columnVisibility.project && <th>Project</th>}
                          {columnVisibility.subProject && <th>Sub Project</th>}
                          {columnVisibility.rejectionSlipNo && (
                            <th>Rejection Slip No.</th>
                          )}
                          {columnVisibility.poNo && <th>PO No.</th>}
                          {columnVisibility.challanNo && <th>Challan No.</th>}
                          {columnVisibility.grnNo && <th>GRN No.</th>}
                          {columnVisibility.grnDate && <th>GRN Date</th>}
                          {columnVisibility.rejectionSlipDate && (
                            <th>Rejection Slip Date</th>
                          )}
                          {columnVisibility.createdOn && <th>Created On</th>}
                          {columnVisibility.morNo && <th>MOR No.</th>}
                          {columnVisibility.materialType && (
                            <th>Material Type</th>
                          )}
                          {columnVisibility.subType && <th>Sub Type</th>}
                          {columnVisibility.material && <th>Material</th>}
                          {columnVisibility.supplierName && (
                            <th>Supplier Name</th>
                          )}
                          {columnVisibility.defectiveQty && (
                            <th>Defective Qty</th>
                          )}
                          {columnVisibility.defectiveRemark && (
                            <th>Defective Remark</th>
                          )}
                          {columnVisibility.store && <th>Store</th>}
                          {columnVisibility.status && <th>Status</th>}
                          {columnVisibility.dueDate && <th>Due Date</th>}
                          {columnVisibility.overdue && <th>Overdue</th>}
                          {columnVisibility.dueAt && <th>Due At</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((item, index) => (
                            <tr key={item.id}>
                              {columnVisibility.srNo && <td>{index + 1}</td>}
                              {columnVisibility.company && (
                                <td>{item.company}</td>
                              )}
                              {columnVisibility.project && (
                                <td>{item.project}</td>
                              )}
                              {columnVisibility.subProject && (
                                <td>{item.sub_project}</td>
                              )}
                              {columnVisibility.rejectionSlipNo && (
                                <td>{item.rejection_slip_number}</td>
                              )}
                              {columnVisibility.poNo && (
                                <td>{item.po_number}</td>
                              )}
                              {columnVisibility.challanNo && (
                                <td>{item.challan_number}</td>
                              )}
                              {columnVisibility.grnNo && (
                                <td>{item.grn_number}</td>
                              )}
                              {columnVisibility.grnDate && (
                                <td>{item.grn_date}</td>
                              )}
                              {columnVisibility.rejectionSlipDate && (
                                <td>{item.rejection_slip_date}</td>
                              )}
                              {columnVisibility.createdOn && (
                                <td>
                                  {new Date(
                                    item.created_on
                                  ).toLocaleDateString()}
                                </td>
                              )}
                              {columnVisibility.morNo && (
                                <td>{item.mor_number}</td>
                              )}
                              {columnVisibility.materialType && (
                                <td>{item.material_type}</td>
                              )}
                              {columnVisibility.subType && (
                                <td>{item.sub_type}</td>
                              )}
                              {columnVisibility.material && (
                                <td>{item.material}</td>
                              )}
                              {columnVisibility.supplierName && (
                                <td>{item.supplier_name}</td>
                              )}
                              {columnVisibility.defectiveQty && (
                                <td>{item.defective_qty}</td>
                              )}
                              {columnVisibility.defectiveRemark && (
                                <td>{item.defective_remark}</td>
                              )}
                              {columnVisibility.store && (
                                <td>{item.store || "N/A"}</td>
                              )}
                              {columnVisibility.status && (
                                <td>{item.status}</td>
                              )}
                              {columnVisibility.dueDate && (
                                <td>{item.due_date || "N/A"}</td>
                              )}
                              {columnVisibility.overdue && (
                                <td>{item.overdue || "N/A"}</td>
                              )}
                              {columnVisibility.dueAt && (
                                <td>{item.due_at || "N/A"}</td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="23" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </div>
          </div>
          {/* filter modal */}
        </div>
      </div>
      <div
        className="modal fade"
        id="settings"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title text-center w-100">Layout</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {/* Modal Body with Inline Scrolling */}
            <div
              className="modal-body"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {Object.keys(columnVisibility).map((colKey, index) => (
                <div
                  className="row justify-content-between align-items-center mt-2"
                  key={index}
                >
                  <div className="col-md-8">
                    <label className="ms-2">
                      {colKey.replace(/([A-Z])/g, " $1")}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check form-switch mt-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={columnVisibility[colKey]}
                        onChange={() => handleToggleChange(colKey)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MaterialRejctionSlip;
