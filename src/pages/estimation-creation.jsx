import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import ExpandableTable from "../components/ExpandableTable";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";

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
import { auditLogColumns, auditLogData } from "../constant/data";




const EstimationCreation = () => {

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
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
                    </a>
                    <div className="card mt-3 pb-3">
                        <div className="card mt-1 mx-3 mt-4">
                            <div className="card-header3">
                                <h3 className="card-title">Budget</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Company Dropdown */}
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                    <div className="col-md-3">
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
                                </div>
                            </div>
                        </div>

                        <CollapsibleCard title="Sub-Project Details">
                            <div className="card-body mt-0 pt-0">
                                <div className="row align-items-center">
                                    {/* RERA Area */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>RERA Area</label>
                                            <input
                                                className="form-control"
                                                disabled
                                                type="text"
                                                placeholder="Sq. Ft."
                                                value='60,000 Sq. Ft.'
                                            />
                                        </div>
                                    </div>
                                    {/* Construction Area */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Construction Area</label>
                                            <input
                                                disabled
                                                className="form-control construction-css"
                                                type="text"
                                                placeholder="Sq. Ft."
                                                value='500,000.00 Sq. Ft.'

                                            />
                                        </div>
                                    </div>
                                    {/* Saleable Area */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Saleable Area Sq.ft.</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    {/* Version */}
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Version</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder=""
                                                value="V1"
                                            />
                                        </div>
                                    </div>
                                    {/* No. of Flats */}
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>No. of Flat</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder="Nos"
                                                value="150 Nos"
                                            />
                                        </div>
                                    </div>
                                    {/* No. of Floors */}
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>No of Floors</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder="Floors"
                                                value="22 Floors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>
                        <div className="d-flex justify-content-between mx-3">
                            {/* Legend Section */}
                            <div className="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                                <span className="reference-label me-4" style={{ fontWeight: "bold" }}>Legend</span>
                                <span className="reference-label main-category">Main Category</span>
                                <span className="reference-label category-lvl2">Category lvl 2</span>
                                <span className="reference-label sub-category-lvl3">Sub-category lvl 3</span>
                                <span className="reference-label sub-category-lvl4">Sub-category lvl 4</span>
                                <span className="reference-label sub-category-lvl5">Sub-category lvl 5</span>
                                <span className="reference-label labour">Labour</span>
                            </div>

                            {/* Add Button */}
                            <div>
                                <button
                                    className="purple-btn2 rounded-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-plus"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                    </svg>
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>

                        <div className="mx-3">
                            <div className="tbl-container  mt-3" >
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Expand</th>
                                            <th className="text-start">Sr No.</th>
                                            <th className="text-start">Level</th>
                                            <th className="text-start">WBS CODE</th>
                                            <th className="text-start">Category</th>
                                            <th className="text-start">Location</th>
                                            <th className="text-start">Type</th>
                                            <th className="text-start">Items</th>
                                            <th className="text-start">Factor</th>
                                            <th className="text-start">UOM</th>
                                            <th className="text-start">Area</th>
                                            <th className="text-start">QTY Excl Wastage</th>
                                            <th className="text-start">Wastage</th>
                                            <th className="text-start">QTY incl Waste</th>
                                            <th className="text-start">Rate</th>
                                            <th className="text-start">Amount</th>
                                            <th className="text-start">Cost Per Unit</th>
                                            <th className="text-start" style={{ width: "12px" }}>
                                                Action
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start"></th>
                                            <th className="text-start">A</th>
                                            <th className="text-start">B</th>
                                            <th className="text-start">C</th>
                                            <th className="text-start">D=C*A</th>
                                            <th className="text-start">E</th>
                                            <th className="text-start">F=D+D*E</th>
                                            <th className="text-start">I</th>
                                            <th className="text-start">J=F*I</th>
                                            <th className="text-start">K=J/C</th>
                                            <th className="text-start">

                                            </th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        <tr className="main-category">
                                            <td>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="1"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                >
                                                    {/* <!-- Square --> */}
                                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                    {/* <!-- Plus Icon --> */}
                                                    <line x1="12" y1="8" x2="12" y2="16" />
                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                </svg>

                                            </td>
                                            <td>1</td>
                                            <td style={{ width: "100px" }}>Main Category</td>
                                            <td>FF</td>
                                            <td>Flat Finishing</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Total Here</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>5,654,88</td>
                                            <td></td>
                                            <td>
                                                <button
                                                    className="btn p-0 pb-0"
                                                    onClick={() => addSubCondition()}
                                                >
                                                    <i
                                                        className="fa-solid fa-plus"
                                                        style={{
                                                            border: "unset",
                                                            fontSize: "12px",
                                                            color: "black",
                                                        }}
                                                    ></i>
                                                </button>
                                                <button
                                                    className="btn p-0 removeSubCondition"
                                                    onClick={(e) => removeSubCondition(e.currentTarget)}
                                                >

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="48"
                                                        viewBox="0 0 24 48"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    >
                                                        {/* <!-- Plus Icon (Top) --> */}
                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                        <line x1="8" y1="14" x2="16" y2="14" />

                                                        {/* <!-- Minus Icon (Bottom) --> */}
                                                        <line x1="8" y1="34" x2="16" y2="34" />
                                                    </svg>

                                                </button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Save</button>
                            <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Export</button>
                        </div>

                        <div className="row mt-2 justify-content-center">
                            <div className="col-md-2">
                                <button className="purple-btn2 w-100">Create</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
};

export default EstimationCreation;
