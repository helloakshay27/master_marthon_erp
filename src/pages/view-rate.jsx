import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { toast, ToastContainer } from "react-toastify";



const ViewRate = () => {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessages, setResultMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result.split(",")[1];

            try {
                const response = await axios.post(
                    `${baseURL}rate_details/import.json?token=${token}`,
                    { file: base64String },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.status === 200) {
                    console.log("Upload response:", response.data);
                    // toast.success(response.data.message);
                    // If response.data.message is an array, show modal with all messages
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
                        setShowModal(false);
                    } else if (error.response && error.response.status === 500) {
                        toast.error("Server error occurred. Please try again later.");
                        setShowModal(false);
                    }
                } else {
                    console.error(error);
                    toast.error("Failed to upload. Please try again.");
                    setShowModal(false);
                }
                //   alert("File upload failed!");
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${baseURL}rate_details.json?q[id_eq]=&q[projects_id_eq]=&q[pms_sites_id_eq]=&q[pms_wings_id_eq]=&token=${token}`
            )
            // .then((response) => setData(response.data))
            // .catch((error) => console.error("Error fetching data:", error));
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleClick = () => {
        // Optionally, show the modal here if needed before navigating
        // setShowModal(true);
        navigate(`/create-rate?token=${token}`); // This will navigate to /create-rate
    };

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
        axios.get(`${baseURL}pms/company_setups.json?token=${token}`)
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


    const fetchFilteredData = async () => {
        const companyId = selectedCompany?.value || "";
        const projectId = selectedProject?.value || "";
        const siteId = selectedSite?.value || "";
        const wingId = selectedWing?.value || ""
        try {
            const response = await axios.get(
                `${baseURL}rate_details.json?q[id_eq]=${companyId}&q[projects_id_eq]=${projectId}&q[pms_sites_id_eq]=${siteId}&q[pms_wings_id_eq]=${wingId}&token=${token}`
            );
            setData(response.data);
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
                `${baseURL}rate_details.json?token=${token}`
            );
            setData(response.data); // or setData(response.data) as per your structure
            // Optionally, reset filter states here as well
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    // console.log("Token value inside render:", token);
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Rate Card</h5>
                    <div className="card mt-3 pb-">

                        <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                            <div className="card-body mt-0 pt-0">

                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Company</label>
                                            <SingleSelector
                                                options={companyOptions}
                                                onChange={handleCompanyChange}
                                                value={selectedCompany}
                                                placeholder={`Select Project`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Project</label>

                                            <SingleSelector
                                                options={siteOptions}
                                                onChange={handleSiteChange}
                                                value={selectedSite}
                                                placeholder={`Select Sub-Project`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
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
                                    {/* <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Category`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Type</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material Type`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Sub-Type</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material Sub-Type`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="col-md-2 mt-4 pt-3">
                                        <button className="purple-btn2">Go</button>
                                         <button className="purple-btn1 ms-2">Reset</button>
                                    </div> */}

                                    <div className="col-md-1 mt-4 ms-3">
                                        <button
                                            className="purple-btn2"
                                            onClick={fetchFilteredData}

                                        >
                                            Go
                                        </button>
                                    </div>
                                    <div className="col-md-1 mt-3 ms-2">
                                        <button
                                            className="purple-btn1"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </CollapsibleCard>
                        <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                            {/* Search Input */}
                            <div className="col-md-4">
                                <form>
                                    {/* <div className="input-group ms-3">
                                        <input
                                            type="search"
                                            id="searchInput"
                                            // value={searchKeyword}
                                            // onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                                            className="form-control tbl-search"
                                            placeholder="Type your keywords here"
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
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
                                    </div> */}
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

                                    <button className="purple-btn2" onClick={() => setShowModal(true)}>Bulk Upload</button>
                                    {/* Create BOQ Button */}
                                    <button
                                        className="purple-btn2 me-2"
                                        //   onClick={() =>
                                        //     // navigate("/material-reconciliation-create")
                                        //   } // Navigate to the specified path
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



                        <div className="mx-3 mb-5 mt-3">
                            <div className="tbl-container mt-3">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Sr.No.</th>
                                            <th className="text-start">Company</th>
                                            <th className="text-start">Project</th>
                                            <th className="text-start">Sub-Project</th>
                                            <th className="text-start">Wing</th>
                                            {/* <th className="text-start">Location</th> */}
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
                                                                        {project.rate_id ? (
                                                                            <a href={`/details-rate/${project.rate_id}?token=${token}`}>
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {project.name}
                                                                                    {/* {console.log("token inn:",token)} */}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{project.name}</span>
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
                                                                        {site.rate_id ? (
                                                                            <a href={`/details-rate/${site.rate_id}?token=${token}`}>
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {site.name}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{site.name}</span>
                                                                        )}

                                                                    </td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}
                                                                {/* Wing Name */}
                                                                <td className="text-start">
                                                                    {/* {wing.name} */}
                                                                    {wing.rate_id ? (
                                                                        <a href={`/details-rate/${wing.rate_id}?token=${token}`}>
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {wing.name}
                                                                            </span>
                                                                        </a>
                                                                    ) : (
                                                                        <span>{wing.name}</span>
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
                                                                        {project.rate_id ? (
                                                                            <a href={`/details-rate/${project.rate_id}?token=${token}`}>
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {project.name}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span>{project.name}</span>
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
                                                                    {site.rate_id ? (
                                                                        <a href={`/details-rate/${site.rate_id}?token=${token}`}>
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {site.name}
                                                                            </span>
                                                                        </a>
                                                                    ) : (
                                                                        <span>{site.name}</span>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
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
                                href={`${baseURL}rate_details/download_rate_sample.json?token=${token}`}
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


            <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* {resultMessages.map((msg, idx) => (
            <div key={idx} className="mb-3">
                <div> Row : {msg.row}</div>
                <div>Message : {msg.message}</div>
                
            </div>
        ))} */}

                    {resultMessages.map((msg, idx) => (
                        <div
                            className="d-flex justify-content-between align-items-center mx-3 p-3 rounded-3"
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
                                <p style={{ marginBottom: 0 }}>
                                    {msg.message}
                                </p>
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
        </>
    )
}

export default ViewRate;