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

    //  project ,sub project wing api 
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [wingsOptions, setWingsOptions] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    // Fetch projects on mount
    useEffect(() => {
        // Replace this with your actual API URL
        axios.get('https://marathon.lockated.com/pms/projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
            .then(response => {
                setProjects(response.data.projects);
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
            });
    }, []);

    // Handle project selection change
    const handleProjectChange = (selectedOption) => {
        // Reset selected site and wing when a new project is selected
        setSelectedProject(selectedOption);
        setSelectedSite(null); // Reset selected site
        setSelectedWing(null); // Reset selected wing
        setWingsOptions([]); // Clear wings options
        setSiteOptions([]);

        // Fetch sites based on the selected project
        if (selectedOption) {
            const selectedProjectData = projects.find(project => project.id === selectedOption.value);
            setSiteOptions(selectedProjectData.pms_sites.map(site => ({
                value: site.id,   // Use id as value for the site
                label: site.name  // Display the site name
            })));
        }
    };

    // Handle site selection change
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
        setSelectedWing(null); // Reset selected wing
        setWingsOptions([]); // Clear wings options

        // Fetch wings for the selected site
        if (selectedOption) {
            const selectedProjectData = projects.find(project => project.id === selectedProject.value);
            const selectedSiteData = selectedProjectData.pms_sites.find(site => site.id === selectedOption.value);
            setWingsOptions(selectedSiteData.pms_wings.map(wing => ({
                value: wing.id,    // Use id as value for the wing
                label: wing.name   // Display the wing name
            })));
        }
    };

    // Handle wing selection change
    const handleWingChange = (selectedOption) => {
        setSelectedWing(selectedOption);
        // You can perform further actions with the selected wing value if necessary
    };

    // Mapping projects for the dropdown
    const projectOptions = projects.map(project => ({
        value: project.id,         // Use id as value for the project
        label: project.formatted_name
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
                                                Company <span>*</span>
                                            </label>
                                            <SingleSelector
                                                // options={wingsOptions}
                                                // value={selectedWing}
                                                // onChange={handleWingChange}
                                                placeholder={`Select Company`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>

                                    {/* Project Dropdown */}
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>Project</label>
                                            <SingleSelector
                                                options={projectOptions}
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
                                            <a style={{ color: "white" }} href="./erp-material-order-request-create.html">
                                                <span className="material-symbols-outlined align-text-top me-2">add</span>
                                                Create
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
                            <Table columns={estimationListColumns} data={estimationListData} />
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
