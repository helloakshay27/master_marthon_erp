import React, { useState, useEffect } from "react";
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
} from "../components"
import { estimationListColumns, estimationListData } from "../constant/data";
import EstimationQuickFilter from "../components/EstimationQuickFilter";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import axios from "axios";


const EstimationList = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState(null); // To store the API response
    const [loading, setLoading] = useState(true); // To manage the loading state
    const [error, setError] = useState(null); // To store any error that occurs during fetching


    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(e.target.value);
    };


    const [settingShow, setSettingShow] = useState(false);
    const handleSettingClose = () => setSettingShow(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleSettingModalShow = () => setSettingShow(true);
    const handleModalShow = () => setShow(true);

    const myArray = ['Sr.No.', 'Certifying Company', 'Project', 'Sub-Project', 'Wing', 'Location'];

    // States to store data company, project ,subproject ,wing
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
        axios.get('https://newerp.marathonrealty.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
            .then(response => {
                setCompanies(response.data.companies);
                setData(response.data);  // Set the data from the API to state
                setLoading(false);  // Update the loading state
            })
            .catch(error => {
                console.error('Error fetching company data:', error);
                setLoading(false);
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
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Estimation List</a>
                    </a>
                    <div className="card mt-3 pb-3 mb-5">
                        {/* <QuickFilter /> */}
                        {/* <EstimationQuickFilter/> */}

                        <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
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
                                                Company <span>*</span>
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
                                                <button
                                                    type="submit"
                                                    className="btn btn-md"
                                                    onClick={handleSettingModalShow}
                                                >
                                                    <SettingIcon
                                                        color={"#8B0203"}
                                                        style={{ width: "25px", height: "25px" }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <button className="purple-btn2 m-0 me-5">
                                            <a style={{ color: "white" }} href="/estimation-creation">
                                                <span style={{ color: "white" }} className="material-symbols-outlined align-text-top me-2">add</span>
                                                <span style={{ color: "white" }}> Create</span>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
                            {/* <Table columns={estimationListColumns} data={estimationListData} /> */}
                            {/* <div className="tbl-container mx-3 mt-1">
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
                                    <tr>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

                            <div className="mx-2">
                                <div className="tbl-container  mt-3">
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

                                            {/* Map through the companies, projects, sites, and wings */}



                                            {data?.companies?.map((company, companyIndex) => {
                                                return company.projects.map((project, projectIndex) => {
                                                    return project.pms_sites.map((site, siteIndex) => {
                                                        // Check if there are wings for the site
                                                        if (site.pms_wings.length > 0) {
                                                            return site.pms_wings.map((wing, wingIndex) => (
                                                                <tr key={`${companyIndex}-${projectIndex}-${siteIndex}-${wingIndex}`}>
                                                                    {/* Render Sr. No. for Company only */}
                                                                    {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
                                                                        <td className="text-start">{companyIndex + 1}</td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Company Name only once per company */}
                                                                    {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
                                                                        <td className="text-start">{company.company_name}</td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Project Name only once per project */}
                                                                    {wingIndex === 0 && siteIndex === 0 ? (
                                                                        <td className="text-start">
                                                                            <a href={`/estimation-details-project/${project.id}`}>
                                                                                <span style={{ color: "#8b0203", textDecoration: 'underline' }}>{project.name}</span>
                                                                            </a>
                                                                        </td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Sub-Project Name only once per site */}
                                                                    {wingIndex === 0 ? (
                                                                        <td className="text-start">
                                                                            <a href={`/estimation-details-sub-project/${site.id}`}>
                                                                                {/* {site.name} */}
                                                                                <span style={{ color: "#8b0203", textDecoration: 'underline' }}>{site.name}</span>
                                                                            </a>
                                                                        </td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Wing Name */}
                                                                    <td className="text-start">{wing.name}</td>

                                                                    {/* Render Location (empty or can be added later) */}
                                                                    <td className="text-start"></td>
                                                                </tr>
                                                            ));
                                                        } else {
                                                            // If there are no wings for a particular site
                                                            return (
                                                                <tr key={`${companyIndex}-${projectIndex}-${siteIndex}`}>
                                                                    {/* Render Sr. No. for Company only */}
                                                                    {siteIndex === 0 && projectIndex === 0 ? (
                                                                        <td className="text-start">{companyIndex + 1}</td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Company Name only once per company */}
                                                                    {siteIndex === 0 && projectIndex === 0 ? (
                                                                        <td className="text-start">{company.company_name}</td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Project Name only once per project */}
                                                                    {siteIndex === 0 ? (
                                                                        <td className="text-start">
                                                                            <a href={`/estimation-details-project/${project.id}`}>
                                                                                {/* {project.name} */}
                                                                                <span style={{ color: "#8b0203", textDecoration: 'underline' }}>{project.name}</span>
                                                                            </a>
                                                                        </td>
                                                                    ) : (
                                                                        <td className="text-start"></td>
                                                                    )}

                                                                    {/* Render Sub-Project Name */}
                                                                    <td className="text-start">
                                                                        <a href={`/estimation-details-sub-project/${site.id}`}>
                                                                            <span style={{ color: "#8b0203", textDecoration: 'underline' }}>{site.name}</span>
                                                                        </a>
                                                                    </td>

                                                                    {/* Render Wing Name as empty (no wings for this site) */}
                                                                    <td className="text-start"></td>

                                                                    {/* Render Location (empty or can be added later) */}
                                                                    <td className="text-start"></td>
                                                                </tr>
                                                            );
                                                        }
                                                    });
                                                });
                                            })}



                                            {/* {data?.companies?.map((company, companyIndex) => {
  return company.projects.map((project, projectIndex) => {
    // Check if the project has no sites
    if (project.pms_sites.length === 0) {
      // If there are no sites, render the project with no sub-projects or wings
      return (
        <tr key={`${companyIndex}-${projectIndex}`}>
          {/* Render Sr. No. for Company only */}
                                            {/* {projectIndex === 0 && companyIndex === 0 ? (
            <td className="text-start">{companyIndex + 1}</td>
          ) : (
            <td className="text-start"></td>
          )}

          {/* Render Company Name only once per company */}
                                            {/* {projectIndex === 0 && companyIndex === 0 ? (
            <td className="text-start">{company.company_name}</td>
          ) : (
            <td className="text-start"></td>
          )} */}

                                            {/* Render Project Name only once per project */}
                                            {/* {projectIndex === 0 ? (
            <td className="text-start">{project.name}</td>
          ) : (
            <td className="text-start"></td>
          )} */}

                                            {/* Render Sub-Project Name (empty, as no sites) */}
                                            {/* <td className="text-start"></td> */}

                                            {/* Render Wing Name as empty (no wings for this site) */}
                                            {/* <td className="text-start"></td> */}

                                            {/* Render Location (empty or can be added later) */}
                                            {/* <td className="text-start"></td> */}
                                            {/* </tr>
      );
    } */}

                                            {/* // If there are sites, loop through them
    return project.pms_sites.map((site, siteIndex) => { */}
                                            {/* // Check if there are wings for the site
      if (site.pms_wings.length > 0) {
        return site.pms_wings.map((wing, wingIndex) => (
          <tr key={`${companyIndex}-${projectIndex}-${siteIndex}-${wingIndex}`}> */}
                                            {/* Render Sr. No. for Company only */}
                                            {/* {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
              <td className="text-start">{companyIndex + 1}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Company Name only once per company */}
                                            {/* {wingIndex === 0 && siteIndex === 0 && projectIndex === 0 ? (
              <td className="text-start">{company.company_name}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Project Name only once per project */}
                                            {/* {wingIndex === 0 && siteIndex === 0 ? (
              <td className="text-start">{project.name}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Sub-Project Name only once per site */}
                                            {/* {wingIndex === 0 ? (
              <td className="text-start">{site.name}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Wing Name */}
                                            {/* <td className="text-start">{wing.name}</td> */}

                                            {/* Render Location (empty or can be added later) */}
                                            {/* <td className="text-start"></td> */}
                                            {/* </tr>
        ));
      } else { */}
                                            {/* // If there are no wings for a particular site
        return (
          <tr key={`${companyIndex}-${projectIndex}-${siteIndex}`}> */}
                                            {/* Render Sr. No. for Company only */}
                                            {/* {siteIndex === 0 && projectIndex === 0 ? (
              <td className="text-start">{companyIndex + 1}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Company Name only once per company */}
                                            {/* {siteIndex === 0 && projectIndex === 0 ? (
              <td className="text-start">{company.company_name}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Project Name only once per project */}
                                            {/* {siteIndex === 0 ? (
              <td className="text-start">{project.name}</td>
            ) : (
              <td className="text-start"></td>
            )} */}

                                            {/* Render Sub-Project Name */}
                                            {/* <td className="text-start">{site.name}</td> */}

                                            {/* Render Wing Name as empty (no wings for this site) */}
                                            {/* <td className="text-start"></td> */}

                                            {/* Render Location (empty or can be added later) */}
                                            {/* <td className="text-start"></td>
          </tr>
        );
      }
    });
  });
})} */}



                                        </tbody>
                                    </table>
                                </div>
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
            <LayoutModal show={settingShow} onHide={handleSettingClose} items={myArray} />

        </>
    );
};

export default EstimationList;
