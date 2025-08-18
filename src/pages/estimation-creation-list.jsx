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
import { baseURL } from "../confi/apiDomain";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";



const EstimationCreationList = () => {
    const urlParams = new URLSearchParams(location.search);
     const navigate = useNavigate();
    const token = urlParams.get("token");
    const [showModal, setShowModal] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState(null); // To store the API response
    const [loading, setLoading] = useState(true); // To manage the loading state
    const [error, setError] = useState(null); // To store any error that occurs during fetching
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessages, setResultMessages] = useState([]);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => setFile(e.target.files[0]);


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
        axios.get(`${baseURL}estimation_details.json?token=${token}`)
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
    const handleSubmitFile = async (e) => {
        e.preventDefault();
        if (!file) return;
        console.log("file:", file)
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result.split(",")[1];
            // console.log("base64String:", base64String)
            try {
                const response = await axios.post(
                    `${baseURL}estimation_details/import.json?token=${token}`,
                    { file: base64String },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.status === 200) {
                    console.log("Upload response:", response.data);
                    // toast.success(response.data.message);
                    if (Array.isArray(response.data.message)) {
                        setResultMessages(response.data.message);
                        setShowResultModal(true);
                    } else {
                        toast.success(response.data.message);
                    }
                    // alert("File uploaded successfully!");
                }
                setShowModal(false);
                setFile(null);
            } catch (error) {

                if (error.response && error.response.status === 422) {
                    console.log("422 response:", error.response.data);
                    if (Array.isArray(error.response.data.errors)) {
                        error.response.data.errors.forEach(errObj => {
                            const rowInfo = errObj.row ? `Row ${errObj.row}: ` : "";
                            toast.error(`${rowInfo}${errObj.error}`);
                            setShowModal(false);
                        });
                    } else if (typeof error.response.data.errors === "string") {
                        toast.error(error.response.data.errors);
                    } else if (error.response && error.response.status === 500) {
                        toast.error("Server error occurred. Please try again later.");
                        setShowModal(false);
                    }
                } else {
                    console.error(error);
                    toast.error("Failed to upload. Please try again.");
                    setShowModal(false);
                }
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    };


    const handleClick = () => {
    navigate("/estimation-creation"); // Navigate to create page
  };
    console.log("data:", data)
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
                                            <label>Wing</label>
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

                        </CollapsibleCard>

                        <div className="d-flex mt-3 align-items-end px-3">
                            <div className="col-md-12">
                                {/* <form> */}
                                {/* <div className="input-group">
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
                                    </div> */}

                                <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                                    {/* Search Input */}
                                    <div className="col-md-4">
                                        <form>
                                            <div className="input-group ms-3">
                                                <input
                                                    type="search"
                                                    id="searchInput"
                                                    // value={searchKeyword}
                                                    // onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                                                    className="form-control tbl-search"
                                                    placeholder="Type your keywords here"
                                                />
                                                <div className="input-group-append">
                                                    <button type="button" className="btn btn-md btn-default"
                                                    // onClick={handleApplyFilters} 
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
                                    <div className="col-md-6  ">
                                        <div className="d-flex justify-content-end align-items-center gap-3 ">

                                            {/* <button className="purple-btn2 me-2" onClick={() => setShowModal(true)}>Bulk Upload</button> */}


                                            {/* Create BOQ Button */}
                                            <button className="purple-btn2 me-3"
                                                onClick={handleClick}
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
                                                    <span> Create</span>
                                                </button>
                                        </div>
                                    </div>
                                </div>
                                {/* </form> */}
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
                                    <div className="col-md-4">
                                        {/* <button className="purple-btn2 m-0 me-5">
                                            <a style={{ color: "white" }} href="/estimation-creation">
                                                <span style={{ color: "white" }} className="material-symbols-outlined align-text-top me-2">add</span>
                                                <span style={{ color: "white" }}> Create</span>
                                            </a>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
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
                                                                                    title={project.status ? `Status: ${project.status}` : ""}
                                                                                    style={{
                                                                                        cursor: project.status ? "pointer" : "default",
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
                                                                                    title={project.status ? `Status: ${project.status}` : ""}
                                                                                    style={{
                                                                                        cursor: project.status ? "pointer" : "default",
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
                                                                                    title={site.status ? `Status: ${site.status}` : ""}
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
                                                                                    title={site.status ? `Status: ${site.status}` : ""}
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
                                                                                title={wing.status ? `Status: ${wing.status}` : ""}
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
                                                                                    title={project.status ? `Status: ${project.status}` : ""}
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
                                                                                    title={project.status ? `Status: ${project.status}` : ""}
                                                                                    style={{
                                                                                        cursor: project.status ? "pointer" : "default",
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
                                                                                title={site.status ? `Status: ${site.status}` : ""}
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
                                                                                title={site.status ? `Status: ${site.status}` : ""}
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



            <FilterModal show={show} handleClose={handleClose} />
            <LayoutModal show={settingShow} onHide={handleSettingClose} items={myArray} />



            {/* bulk upload modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitFile}>
                        <div className="form-group mb-3">
                            <label>Upload File</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            {/* Left: Download sample format */}
                            <a
                                href={`${baseURL}estimation_details/download_budget_sample.json?token=${token}`}
                                download
                                className="d-flex align-items-center text-decoration-none"
                                style={{ color: "#8b0203" }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="#8b0203"
                                    className="bi bi-download me-1"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v3.1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.1a.5.5 0 0 1 1 0v3.1A2 2 0 0 1 14 16H2a2 2 0 0 1-2-2v-3.1a.5.5 0 0 1 .5-.5z" />
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                </svg>
                                <span style={{ color: "#000" }}>Download Sample Format</span>
                            </a>
                            {/* Right: Submit and Cancel */}
                            <div className="d-flex justify-content-center gap-2 w-70">
                                <div className="flex-grow-1">
                                    <button type="submit" className="purple-btn2 w-70 mt-2">
                                        Upload
                                    </button>
                                </div>
                                <div className="flex-grow-1">
                                    <button
                                        type="button"
                                        className="purple-btn1 w-70"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </Modal.Body>
            </Modal>


            <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {resultMessages.map((msg, idx) => (
                        <div
                            className="d-flex justify-content-between align-items-center mx-3 p-3 rounded-3 mb-3"
                            style={{
                                background: "linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%)",
                                border: "2px solid #ffc107",
                                boxShadow: "0 2px 8px rgba(255,193,7,0.15)",
                                color: "#856404",
                            }}
                            key={idx}
                        >
                            <div>
                                <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: "#856404" }} />
                                    Row : {msg.row}

                                </p>
                                <span style={{ marginBottom: 0, fontSize: "16px" }}>
                                    {msg.message}
                                </span>
                                <div className="m-0">
                                    {msg.boq_id && (
                                        <a
                                            href={`/boq-details-page-master/${msg.boq_id}?token=${token}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#8b0203", textDecoration: "underline", marginLeft: 8 }}
                                        >
                                            <span>View Details</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <button className="purple-btn1" onClick={() => setShowResultModal(false)}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default EstimationCreationList;
