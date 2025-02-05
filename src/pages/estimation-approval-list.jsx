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

const EstimationApprovolList = () => {
  const [settingShow, setSettingShow] = useState(false);
  const handleSettingClose = () => setSettingShow(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleSettingModalShow = () => setSettingShow(true);
  const handleModalShow = () => setShow(true);

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


  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            <a href="">Home &gt; Engineering &gt; Estimation &gt; Approvals</a>
          </a>
          {/* <h5 className="mt-3">RFQ &amp; Auction Events</h5> */}
          <div className="material-boxes mt-3">
            <div className="container-fluid">
              <div className="row justify-content-between">
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
          </div>
          <div className="card mt-3 pb-3">
            {/* <QuickFilter /> */}
            {/* <EstimationQuickFilter/> */}

            <CollapsibleCard title="Quick Filter">
              {/* <div className="card-body pt-0 mt-0">
                <div className="row my-2 align-items-end">
                  {["Company", "Project", "Sub-Project", "Wings"].map((label, idx) => (
                    <div className="col-md-2" key={idx}>
                      <div className="form-group">
                        <label>{label}</label>
                        <select className="form-control form-select" style={{ width: "100%" }}>
                          <option selected="selected">Alabama</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <div className="col-md-2">
                    <button className="purple-btn2 m-0">Go</button>
                  </div>
                </div>
              </div> */}
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
                      onClick={() => console.log("Selected Values:", values)} // Log selected values on button click
                    >
                      Go
                    </button>
                  </div>
                </div>

              </div>
              {/* <div className="card-body pt-0 mt-0">
                    <div className="row my-2 align-items-end">
                        {["Company", "Project", "Sub-Project", "Wings"].map((label, idx) => (
                            <div className="col-md-2" key={idx}>
                                <div className="form-group">
                                    <label>{label}</label>
                                    <SingleSelector
                                        options={options}
                                        value={values[label]} // Pass current value
                                        onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                        placeholder={`Select ${label}`} // Dynamic placeholder
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="col-md-2">
                            <button
                                className="purple-btn2 m-0"
                                onClick={() => console.log("Selected Values:", values)} // Log selected values on button click
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div> */}
            </CollapsibleCard>

            {/* bulk Action */}
            <BulkAction />
            <div className="d-flex mt-3 align-items-end px-3">
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
              <div className="col-md-6">
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <div className="row justify-content-end px-3">
                      <div className="col-md-3">
                        {/* <button
                          className="btn btn-md"
                          onClick={handleModalShow}
                        >
                          <FilterIcon />
                        </button> */}
                      </div>
                      <div className="col-md-3">
                        {/* <button type="submit" className="btn btn-md">
                          <StarIcon />
                        </button> */}
                      </div>
                      <div className="col-md-3">
                        {/* <button
                          id="downloadButton"
                          type="submit"
                          className="btn btn-md"
                        >
                          <DownloadIcon />
                        </button> */}
                      </div>
                      <div className="col-md-3">
                        {/* <button
                          type="submit"
                          className="btn btn-md"
                          onClick={handleSettingModalShow}
                        >
                          <SettingIcon
                            color={"#8B0203"}
                            style={{ width: "25px", height: "25px" }}
                          />
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="tbl-container mx-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th><input type="checkbox" name="" id="" className="ms-2" /></th>
                      <th>Certifying Company</th>
                      <th>Project</th>
                      <th>Sub-Project</th>
                      <th>Wing</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type="checkbox" name="" id="" /></td>
                      <td>Marathon Next-Gen Realty Limited</td>
                      <td>Admin -MNRL</td>
                      <td>Shreeram ceramics</td>
                      <td>Wing A</td>
                      <td>STR 1</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox" name="" id="" /></td>
                      <td>Marathon Next-Gen Realty Limited</td>
                      <td>Admin -MNRL</td>
                      <td>Shreeram ceramics</td>
                      <td>Wing A</td>
                      <td>STR 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-3  px-3">
              {/* <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="">Rows Per Page</label>
                  <select
                    className="form-control form-select per_page"
                    style={{ width: "100%" }}
                  >
                    <option value={10} selected>
                      10 Rows
                    </option>
                    <option value={20}>20 Rows</option>
                    <option value={50}>50 Rows</option>
                    <option value={100}>100 Rows</option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <FilterModal show={show} handleClose={handleClose} />
      <LayoutModal show={settingShow} onHide={handleSettingClose} />
    </>
  );
}

export default EstimationApprovolList;