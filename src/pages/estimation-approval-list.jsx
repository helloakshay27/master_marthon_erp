import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import {
  LayoutModal,
  FilterModal,
  BulkAction,
  DownloadIcon,
  FilterIcon,
  QuickFilter,
  SearchIcon,
  SettingIcon,
  StarIcon,
  Table,
} from "../components";
import EstimationQuickFilter from "../components/EstimationQuickFilter";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";

const EstimationApprovolList = () => {
  const urlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const token = urlParams.get("token");
  const [selectedValue, setSelectedValue] = useState(""); // Holds the selected value
    const [activeTab, setActiveTab] = useState("total"); // State to track the active tab

  const [showModal, setShowModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null); // To store the API response
  const [loading, setLoading] = useState(true); // To manage the loading state
  const [error, setError] = useState(null); // To store any error that occurs during fetching

  // States to store data
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [wingsOptions, setWingsOptions] = useState([]);

  // Fetch company data on component mount
  useEffect(() => {
    axios.get('https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
      .then(response => {
        setCompanies(response.data.companies);
      })
      .catch(error => {
        console.error('Error fetching company data:', error);
      });
  }, []);

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);  // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection
    setSelectedWing(null); // Reset wing selection
    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(company => company.id === selectedOption.value);
      setProjects(
        selectedCompanyData?.projects.map(prj => ({
          value: prj.id,
          label: prj.name
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
    setSelectedWing(null); // Reset wing selection
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected project from the list of projects of the selected company
      const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
      const selectedProjectData = selectedCompanyData?.projects.find(project => project.id === selectedOption.value);

      // Set site options based on selected project
      setSiteOptions(
        selectedProjectData?.pms_sites.map(site => ({
          value: site.id,
          label: site.name
        })) || []
      );
    }
  };


  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null); // Reset wing selection
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected project and site data
      const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
      const selectedProjectData = selectedCompanyData.projects.find(project => project.id === selectedProject.value);
      const selectedSiteData = selectedProjectData?.pms_sites.find(site => site.id === selectedOption.value);

      // Set wings options based on selected site
      setWingsOptions(
        selectedSiteData?.pms_wings.map(wing => ({
          value: wing.id,
          label: wing.name
        })) || []
      );
    }
  };

  // Handle wing selection
  const handleWingChange = (selectedOption) => {
    setSelectedWing(selectedOption);
  };

  // Map companies to options for the dropdown
  const companyOptions = companies.map(company => ({
    value: company.id,
    label: company.company_name
  }));
  // Fetch company data on component mount
  useEffect(() => {
    axios.get(`${baseURL}estimation_details.json?token=${token}`)
      .then(response => {
        // setCompanies(response.data.companies);
        setData(response.data);  // Set the data from the API to state
        setLoading(false);  // Update the loading state
      })
      .catch(error => {
        console.error('Error fetching company data:', error);
        setLoading(false);
      });
  }, []);

  const fetchFilteredData = async () => {
    const companyId = selectedCompany?.value || "";
    const projectId = selectedProject?.value || "";
    const siteId = selectedSite?.value || "";
    const wingId = selectedWing?.value || ""
    try {
      const response = await axios.get(
        `${baseURL}estimation_details.json?q[id_eq]=${companyId}&q[projects_id_eq]=${projectId}&q[pms_sites_id_eq]=${siteId}&q[pms_wings_id_eq]=${wingId}&token=${token}`
      );
      // setCompanies(response.data.companies);
      setData(response.data);
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };


  const handleReset = async () => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedWing(null)
    try {
      const response = await axios.get(
        `${baseURL}estimation_details.json?token=${token}`
      );
      // setCompanies(response.data.companies);
      setData(response.data); // or setData(response.data) as per your structure
      // Optionally, reset filter states here as well
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };


  //card filter
  const fetchFilteredData2 = (status) => {
    const url = `${baseURL}estimation_detailsjson?token=${token}${status ? `&q[status_eq]=${status}` : ""
      }`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        // setMeta(response.data.meta);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  };
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            <a href="">Home &gt; Engineering &gt; Estimation &gt; Approvals</a>
          </a>
          {/* <h5 className="mt-3">RFQ &amp; Auction Events</h5> */}
          {/* <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row justify-content-between mt-5">
                <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                  <div className="content-box">
                    <h4 className="content-box-title">Total</h4>
                    <p className="content-box-sub">0</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Draft</h4>
                    <p className="content-box-sub">2</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Pending to Approval</h4>
                    <p className="content-box-sub">3</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Approved</h4>
                    <p className="content-box-sub">2</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Reject</h4>
                    <p className="content-box-sub">2</p>
                  </div>
                </div>
                <div className="col-md-2" style={{ opacity: 1 }}>
                  <div className="content-box text-center">
                    <h4 className="content-box-title">Updated</h4>
                    <p className="content-box-sub">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

<div className="material-boxes mt-4">
            <div className="container-fluid">
              <div className="row separteinto6 justify-content-center">
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button active"
                    data-tab="total"
                    className={`content-box tab-button ${activeTab === "total" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("total");
                      fetchFilteredData2("");
                    }} // Fetch all data (no status filter)
                  >
                    <h4 className="content-box-title fw-semibold">Total</h4>
                    <p className="content-box-sub">{data?.total_count || 0}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="draft"
                    className={`content-box tab-button ${activeTab === "draft" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("draft");
                      fetchFilteredData2("draft");
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">
                      Draft
                    </h4>
                    <p className="content-box-sub">{data?.draft_count || 0}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="pending_to_approve"
                    className={`content-box tab-button ${activeTab === "pending_to_approve" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("pending_to_approve");
                      fetchFilteredData2("pending_to_approve");
                    }}
                  >
                    <h4 className="content-box-title fw-semibold" title="Received for Verification">
                      Pending to Approval
                    </h4>
                    <p className="content-box-sub">
                      {data?.pending_to_approval_count || 0}
                    </p>
                  </div>
                </div>
                <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="self-overdue"
                    className={`content-box tab-button ${activeTab === "approved" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("approved");
                      fetchFilteredData2("approved");
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Approved</h4>
                    <p className="content-box-sub">{data?.approved_count || 0}</p>
                  </div>
                </div>

                 <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="self-overdue"
                    className={`content-box tab-button ${activeTab === "rejected" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("rejected");
                      fetchFilteredData2("rejected");
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Reject</h4>
                    <p className="content-box-sub">{data?.rejected_count || 0}</p>
                  </div>
                </div>
                 <div className="col-md-2 text-center">
                  <div
                    // className="content-box tab-button"
                    data-tab="self-overdue"
                    className={`content-box tab-button ${activeTab === "updated" ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab("updated");
                      fetchFilteredData2("updated");
                    }}
                  >
                    <h4 className="content-box-title fw-semibold">Updated</h4>
                    <p className="content-box-sub">{data?.updated_count || 0}</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>






          <div className="card mt-5 pb-3">
            {/* <QuickFilter /> */}
            {/* <EstimationQuickFilter/> */}

            <CollapsibleCard title="Quick Filter">
              <div className="card-body">
                <div className="row my-2 align-items-end">
                  {/* Company Dropdown */}
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>
                        Company
                      </label>
                      <SingleSelector
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        value={selectedCompany}
                        placeholder={`Select Company`} // Dynamic placeholder
                      />
                    </div>
                  </div>

                  {/* Project Dropdown */}
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Project</label>
                      <SingleSelector
                        options={projects}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>

                  </div>

                  {/* Sub-Project Dropdown */}
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Sub-Project</label>
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>
                  </div>

                  {/* Wings Dropdown */}
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Wings</label>
                      <SingleSelector
                        options={wingsOptions}
                        value={selectedWing}
                        onChange={handleWingChange}
                        placeholder={`Select Wing`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="purple-btn2 m-0"
                      onClick={fetchFilteredData}
                    // onClick={() => console.log("Selected Values:", values)} // Log selected values on button click
                    >
                      Go
                    </button>
                  </div>
                </div>

              </div>
            </CollapsibleCard>

            {/* bulk Action */}
            {/* <BulkAction /> */}
            <div className="d-flex mt-3 align-items-end px-3 mt-4">
              <div className="col-md-6">
                <form>
                  <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default"
                        style={{
                          borderTopRightRadius: '5px', // Top-right corner
                          borderBottomRightRadius: '5px', // Bottom-right corner
                          borderTopLeftRadius: '0px', // Top-left corner
                          borderBottomLeftRadius: '0px', // Bottom-left corner
                        }}
                      >
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>

            <div className="mx-2 mb-5 mt-3">
              <div className="mx-2">
                <div className="tbl-container  mt-3" style={{ maxHeight: "500px" }}>
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th className="text-start">Sr.No.</th>
                        <th className="text-start">Certifying Company</th>
                        <th className="text-start">Project</th>
                        <th className="text-start">Sub-Project</th>
                        <th className="text-start">Wing</th>
                        <th className="text-start">Location</th>
                      </tr>
                    </thead>
                    <tbody>




                      {data?.companies?.map((company, companyIndex) =>
                        company.projects.map((project, projectIndex) =>
                          project.pms_sites.map((site, siteIndex) =>
                            site.pms_wings.length > 0
                              ? site.pms_wings.map((wing, wingIndex) => (
                                <tr key={`${companyIndex}-${projectIndex}-${siteIndex}-${wingIndex}`}>
                                  {/* Sr.No. */}
                                  {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
                                    <td className="text-start">{companyIndex + 1}</td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Company Name */}
                                  {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
                                    <td className="text-start">{company.company_name}</td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Project Name */}
                                  {wingIndex === 0 && siteIndex === 0 ? (
                                    <td className="text-start">
                                      {project.budget_id ? (
                                        <a href={`/estimation-creation-details/${project.budget_id}?token=${token}`}
                                          title={project.budget_status ? `Status: ${project.budget_status}` : ""}
                                          style={{
                                            cursor: project.budget_status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}
                                        >
                                          <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                            {project.name}
                                            {/* {console.log("token inn:",token)} */}
                                          </span>
                                        </a>
                                      ) : (
                                        <span
                                          title={project.budget_status ? `Status: ${project.budget_status}` : ""}
                                          style={{
                                            cursor: project.budget_status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}
                                        >{project.name}</span>
                                      )}
                                      {/* <a href={`/details-rate/${project.rate_id}`}>
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {project.name}
                                                                            </span>
                                                                        </a> */}
                                    </td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Sub-Project Name */}
                                  {wingIndex === 0 ? (
                                    <td className="text-start">
                                      {site.budget_id ? (
                                        <a href={`/estimation-creation-details/${site.budget_id}?token=${token}`}
                                          title={site.budget_status ? `Status: ${site.budget_status}` : ""}
                                          style={{
                                            cursor: site.status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}
                                        >
                                          <span style={{ color: "#8b0203", textDecoration: "underline" }}

                                          >
                                            {site.name}
                                          </span>
                                        </a>
                                      ) : (
                                        <span
                                          title={site.budget_status ? `Status: ${site.budget_status}` : ""}
                                          style={{
                                            cursor: site.status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}
                                        >{site.name}</span>
                                      )}

                                    </td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Wing Name */}
                                  <td className="text-start">
                                    {/* {wing.name} */}
                                    {wing.budget_id ? (
                                      // <a href={`/details-rate/${wing.budget_id}?token=${token}`}
                                      //     title={wing.status ? `Status: ${wing.status}` : ""}
                                      //     style={{
                                      //         cursor: wing.status ? "pointer" : "default",
                                      //         // textDecoration: "underline",
                                      //         // color: "#8b0203",
                                      //         position: "relative"
                                      //     }}
                                      // >
                                      <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                        {wing.name}
                                      </span>
                                      // </a>
                                    ) : (
                                      <span
                                        title={wing.budget_status ? `Status: ${wing.budget_status}` : ""}
                                        style={{
                                          cursor: wing.status ? "pointer" : "default",
                                          // textDecoration: "underline",
                                          // color: "#8b0203",
                                          position: "relative"
                                        }}
                                      >{wing.name}</span>
                                    )}
                                  </td>
                                  {/* Location */}
                                  {/* <td className="text-start"></td> */}
                                </tr>
                              ))
                              : (
                                <tr key={`${companyIndex}-${projectIndex}-${siteIndex}`}>
                                  {/* Sr.No. */}
                                  {siteIndex === 0 && projectIndex === 0 ? (
                                    <td className="text-start">{companyIndex + 1}</td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Company Name */}
                                  {siteIndex === 0 && projectIndex === 0 ? (
                                    <td className="text-start">{company.company_name}</td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Project Name */}
                                  {siteIndex === 0 ? (
                                    <td className="text-start">
                                      {project.budget_id ? (
                                        <a href={`/estimation-creation-details/${project.budget_id}?token=${token}`}
                                          title={project.budget_status ? `Status: ${project.budget_status}` : ""}
                                          style={{
                                            cursor: project.status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}>
                                          <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                            {project.name}
                                          </span>
                                        </a>
                                      ) : (
                                        <span
                                          title={project.budget_status ? `Status: ${project.status}` : ""}
                                          style={{
                                            cursor: project.budget_status ? "pointer" : "default",
                                            // textDecoration: "underline",
                                            // color: "#8b0203",
                                            position: "relative"
                                          }}
                                        >{project.name}</span>
                                      )}
                                      {/* <a href={`/details-rate/${project.rate_id}`}>
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {project.name}
                                                                            </span>
                                                                        </a> */}
                                    </td>
                                  ) : (
                                    <td className="text-start"></td>
                                  )}
                                  {/* Sub-Project Name */}
                                  <td className="text-start">
                                    {site.budget_id ? (
                                      <a href={`/estimation-creation-details/${site.budget_id}?token=${token}`}
                                        title={site.budget_status ? `Status: ${site.budget_status}` : ""}
                                        style={{
                                          cursor: site.status ? "pointer" : "default",
                                          // textDecoration: "underline",
                                          // color: "#8b0203",
                                          position: "relative"
                                        }}>
                                        <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                          {site.name}
                                        </span>
                                      </a>
                                    ) : (
                                      <span
                                        title={site.budget_status ? `Status: ${site.budget_status}` : ""}
                                        style={{
                                          cursor: site.status ? "pointer" : "default",
                                          // textDecoration: "underline",
                                          // color: "#8b0203",
                                          position: "relative"
                                        }}>{site.name}</span>
                                    )}

                                  </td>
                                  {/* Wing Name */}
                                  <td className="text-start"></td>
                                  {/* Location */}
                                  {/* <td className="text-start"></td> */}
                                </tr>
                              )
                          )
                        )
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


    </>
  );
}

export default EstimationApprovolList;