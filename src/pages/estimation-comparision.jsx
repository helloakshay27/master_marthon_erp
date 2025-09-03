import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";

import {
    LayoutModal,
} from "../components"
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";



const EstimationComparision = () => {

    // State to manage collapsed rows
    const [collapsedRows, setCollapsedRows] = useState({});
    const toggleCollapse = (rowId) => {
        setCollapsedRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId],
        }));
    };
    const { id } = useParams();

    const [settingShow, setSettingShow] = useState(false);
    const handleSettingClose = () => setSettingShow(false);
    const handleSettingModalShow = () => setSettingShow(true);

    const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // API data state
    const [projectDetails, setProjectDetails] = useState({
        rera_area: null,
        construction_area: null,
        saleable_area: null,
        version_list: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVersionOne, setSelectedVersionOne] = useState("");
    const [selectedVersionTwo, setSelectedVersionTwo] = useState("");



    // Fetch project details with version IDs
    const fetchSubProjectDetails = async (versionOneId = "", versionTwoId = "") => {
        setLoading(true);
        setError(null);
        try {
            // Build query params for version IDs
            let params = `?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
            if (versionOneId) params += `&version_one_id=${versionOneId}`;
            if (versionTwoId) params += `&version_two_id=${versionTwoId}`;
            const res = await axios.get(
                `${baseURL}estimation_details/${id}/comparison.json${params}`
            );
            console.log("response cat:", res.data);
            setProjectDetails(res.data);
        } catch (err) {
            setError("Error fetching sub project details");
            console.error("Error fetching sub project details:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSubProjectDetails();
        //  setActiveTab("details");
    }, [id]);

    const [openCategoryId, setOpenCategoryId] = useState(null); // Track which category is open
    const [openSubCategory2Id, setOpenSubCategory2Id] = useState(null); // Track sub-category 2 visibility
    const [openSubCategory3Id, setOpenSubCategory3Id] = useState(null); // Track sub-category 3 visibility
    const [openSubCategory4Id, setOpenSubCategory4Id] = useState(null); // Track sub-category 3 visibility
    const [openSubCategory5Id, setOpenSubCategory5Id] = useState(null); // Track sub-category 3 visibility

    const [openBoqDetailId, setOpenBoqDetailId] = useState(null); // Track BOQ details visibility
    const [openBoqDetailId1, setOpenBoqDetailId1] = useState(null); // Track BOQ details visibility
    const [openBoqDetailId2, setOpenBoqDetailId2] = useState(null); // Track BOQ details visibility
    const [openBoqDetailId3, setOpenBoqDetailId3] = useState(null); // Track BOQ details visibility
    // Toggle category visibility
    const toggleCategory = (id) => {
        if (openCategoryId === id) {
            setOpenCategoryId(null); // Close the category if it's already open
        } else {
            setOpenCategoryId(id); // Open the selected category
        }
    };

    // Toggle sub-category 2 visibility
    const toggleSubCategory2 = (id) => {
        if (openSubCategory2Id === id) {
            setOpenSubCategory2Id(null); // Close the category if it's already open
        } else {
            setOpenSubCategory2Id(id); // Open the selected category
        }
    };

    // Toggle BOQ details visibility
    const toggleBoqDetail = (id) => {
        if (openBoqDetailId === id) {
            setOpenBoqDetailId(null); // Close the category if it's already open
        } else {
            setOpenBoqDetailId(id); // Open the selected category
        }
    };

    // Toggle BOQ details 1 visibility
    const toggleBoqDetail1 = (id) => {
        if (openBoqDetailId1 === id) {
            setOpenBoqDetailId1(null); // Close the category if it's already open
        } else {
            setOpenBoqDetailId1(id); // Open the selected category
        }
    };

    // Toggle BOQ details 2 visibility
    const toggleBoqDetail2 = (id) => {
        if (openBoqDetailId2 === id) {
            setOpenBoqDetailId2(null); // Close the category if it's already open
        } else {
            setOpenBoqDetailId2(id); // Open the selected category
        }
    };

    // Toggle BOQ details 3 visibility
    const toggleBoqDetail3 = (id) => {
        if (openBoqDetailId3 === id) {
            setOpenBoqDetailId3(null); // Close the category if it's already open
        } else {
            setOpenBoqDetailId3(id); // Open the selected category
        }
    };

    // Toggle sub-category 3 visibility
    const toggleSubCategory3 = (id) => {
        setOpenSubCategory3Id(openSubCategory3Id === id ? null : id);
    };

    // Toggle sub-category 3 visibility
    const toggleSubCategory4 = (id) => {
        setOpenSubCategory4Id(openSubCategory4Id === id ? null : id);
    };

    // Toggle sub-category 3 visibility
    const toggleSubCategory5 = (id) => {
        setOpenSubCategory5Id(openSubCategory5Id === id ? null : id);
    };

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Comparison</a>
                    </a>
                    <div className="card mt-3 pb-3 mb-5">
                        <CollapsibleCard title="Details">
                            <div className="card-body mt-0 pt-0">
                                {loading ? (
                                    <div>Loading...</div>
                                ) : error ? (
                                    <div className="text-danger">{error}</div>
                                ) : (
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Rera Area</label>
                                                <div className="d-flex gap-3">
                                                    <input disabled className="form-control" type="text" placeholder="Sq ft" value={projectDetails.rera_area ? `${projectDetails.rera_area} Sq.ft` : "-"} />
                                                    <input disabled className="form-control" type="text" placeholder="Sq.mt" value={projectDetails.rera_area ? `${(projectDetails.rera_area * 0.092903).toFixed(2)} Sq.mt` : "-"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Labour+Material Budget</label>
                                                <div className="d-flex gap-3">
                                                    <input disabled className="form-control" type="text" placeholder="Sq ft" value={projectDetails.labour_material_budget_sqft ? `${projectDetails.labour_material_budget_sqft} Sq.ft` : "-"} />
                                                    <input disabled className="form-control" type="text" placeholder="Sq.mt" value={projectDetails.labour_material_budget_sqmt ? `${projectDetails.labour_material_budget_sqmt} Sq.mt` : "-"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>Construction Area</label>
                                                <div className="d-flex gap-3">
                                                    <input disabled className="form-control" type="text" placeholder="Sq ft" value={projectDetails.construction_area ? `${projectDetails.construction_area} Sq.ft` : "-"} />
                                                    <input disabled className="form-control" type="text" placeholder="Sq.mt" value={projectDetails.construction_area ? `${(projectDetails.construction_area * 0.092903).toFixed(2)} Sq.mt` : "-"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Project Budget</label>
                                                <input disabled className="form-control" type="text" placeholder="" value={projectDetails.sub_project_budget ? `INR ${projectDetails.sub_project_budget}` : "-"} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>Saleable Area</label>
                                                <div className="d-flex gap-3">
                                                    <input disabled className="form-control" type="text" placeholder="" value={projectDetails.saleable_area ? `${projectDetails.saleable_area} Sq.ft` : "-"} />
                                                    <input disabled className="form-control" type="text" placeholder="" value={projectDetails.saleable_area ? `${(projectDetails.saleable_area * 0.092903).toFixed(2)} Sq.mt` : "-"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Project Budget Balance</label>
                                                <input disabled className="form-control" type="text" placeholder="INR" value={projectDetails.sub_project_budget_balance ? `INR ${projectDetails.sub_project_budget_balance}` : "-"} />
                                            </div>
                                        </div>

                                        <div className="col-md-12 mt-2">
                                            <div className="row align-items-end gap-3">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Select Version</label>

                                                        <SingleSelector
                                                            options={
                                                                Array.isArray(projectDetails.version_list)
                                                                    ? projectDetails.version_list.map(([id, name]) => ({
                                                                        value: id,
                                                                        label: name
                                                                    }))
                                                                    : []
                                                            }
                                                            value={
                                                                selectedVersionOne
                                                                    ? projectDetails.version_list
                                                                        .map(([id, name]) => ({ value: id, label: name }))
                                                                        .find(opt => opt.value === selectedVersionOne)
                                                                    : null
                                                            }
                                                            onChange={option => setSelectedVersionOne(option ? option.value : "")}
                                                            placeholder="Select Version"
                                                        />

                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Compare With</label>
                                                        <SingleSelector
                                                            options={
                                                                Array.isArray(projectDetails.version_list)
                                                                    ? projectDetails.version_list.map(([id, name]) => ({
                                                                        value: id,
                                                                        label: name
                                                                    }))
                                                                    : []
                                                            }
                                                            value={
                                                                selectedVersionTwo
                                                                    ? projectDetails.version_list
                                                                        .map(([id, name]) => ({ value: id, label: name }))
                                                                        .find(opt => opt.value === selectedVersionTwo)
                                                                    : null
                                                            }
                                                            onChange={option => setSelectedVersionTwo(option ? option.value : "")}
                                                            placeholder="Select Version"
                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        className="purple-btn2 mb-0"
                                                        onClick={() => fetchSubProjectDetails(selectedVersionOne, selectedVersionTwo)}
                                                        disabled={loading || !selectedVersionOne || !selectedVersionTwo}
                                                    >
                                                        {loading ? "Loading..." : "Show"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleCard>

                        <div className="d-flex justify-content-between mx-3">
                            <div className="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                                <span className="reference-label me-4" style={{ fontWeight: "bold" }}>Legend</span>
                                <span className="reference-label New">New</span>
                                <span className="reference-label Modify">Modify</span>
                                <span className="reference-label Remove">Remove</span>
                            </div>


                            <div>
                                {/* <button className="btn">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#8B0203"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M23 4v6h-6" />
                                        <path d="M1 20v-6h6" />
                                        <path d="M3.51 9a9 9 0 0 1 14.34-3.36L23 10M1 14l5.15 4.85A9 9 0 0 0 20.49 15" />
                                    </svg>
                                </button> */}

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
                                {/* <button
                                    className="purple-btn2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#copyModal"
                                    onClick={handleShow}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 400 500"
                                        className="me-2"
                                    >
                                        {/* <!--! Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com --> */}
                                {/* <path
                                            fill="#f7f7f7"
                                            d="M200 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                                        />
                                    </svg>
                                    Copy Budget
                                </button> */}
                            </div>
                        </div>

                        <div className="mx-3 mb-5 mt-3">


                            <div className="mx-3 ">
                                <div className="tbl-container mt-1" style={{
                                    maxHeight: "750px",
                                }}>
                                    <table
                                        className="w-100"
                                    >
                                        <thead style={{ zIndex: "111 " }}>
                                            <tr>
                                                <th className="text-center" colSpan="6">Category</th>
                                                <th className="text-center" colSpan="3">Version1</th>
                                                <th className="text-center" colSpan="3">Version2</th>
                                            </tr>
                                            <tr>
                                                <th className="text-start">Expand</th>
                                                <th className="text-start">Sr.no</th>
                                                <th className="text-start">Category level</th>
                                                <th className="text-start">WBS</th>
                                                <th className="text-start">Type</th>
                                                <th className="text-start">Category</th>
                                                <th className="text-start">Rate</th>
                                                <th className="text-start">QTY</th>
                                                <th className="text-start">Amount Allocated</th>
                                                <th className="text-start">Rate</th>
                                                <th className="text-start">QTY</th>
                                                <th className="text-start">Amount Allocated</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {/* Conditional rendering for categories under sub-project start */}
                                            {projectDetails &&
                                                projectDetails.categories &&
                                                projectDetails.categories.map((category, catIdx) => (
                                                    <React.Fragment key={category.id}>
                                                        <tr className="main-category">
                                                            <td>
                                                                <button
                                                                    className="btn btn-link p-0"
                                                                    onClick={() => toggleCategory(category.id)}
                                                                    aria-label="Toggle category visibility"
                                                                >
                                                                    {openCategoryId === category.id ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill=" #e0e0e0"
                                                                            stroke="black"
                                                                            strokeWidth="1"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            {/* Square */}
                                                                            <rect
                                                                                x="3"
                                                                                y="3"
                                                                                width="18"
                                                                                height="20"
                                                                                rx="1"
                                                                                ry="1"
                                                                            />
                                                                            {/* Minus Icon */}
                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill=" #e0e0e0"
                                                                            stroke="black"
                                                                            strokeWidth="1"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            {/* Square */}
                                                                            <rect
                                                                                x="3"
                                                                                y="3"
                                                                                width="18"
                                                                                height="20"
                                                                                rx="1"
                                                                                ry="1"
                                                                            />
                                                                            {/* Plus Icon */}
                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </td>
                                                            <td>{catIdx + 1}</td>
                                                            <td> Main Category</td>
                                                            <td></td>
                                                            <td>


                                                            </td>
                                                            <td>
                                                                {category.name}
                                                            </td>

                                                            <td>


                                                            </td>
                                                            {/* <td></td> */}
                                                            <td>


                                                            </td>

                                                            <td>
                                                                {
                                                                    (
                                                                        // Sum direct material_type_details amounts for main category
                                                                        (category.version_one.item_details
                                                                            ? category.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                            : 0
                                                                        )
                                                                        +
                                                                        // Sum all sub-category 2 material_type_details amounts for main category
                                                                        (category.sub_categories_2
                                                                            ? category.sub_categories_2.reduce(
                                                                                (subSum2, subCat2) =>
                                                                                    subSum2 +
                                                                                    (
                                                                                        // Sum direct item_details for level 2
                                                                                        (subCat2.version_one.item_details
                                                                                            ? subCat2.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                            : 0
                                                                                        )
                                                                                        +
                                                                                        // Sum all sub-category 3 material_type_details for level 2
                                                                                        (subCat2.sub_categories_3
                                                                                            ? subCat2.sub_categories_3.reduce(
                                                                                                (subSum3, subCat3) =>
                                                                                                    subSum3 +
                                                                                                    (
                                                                                                        // Sum direct item_details for level 3
                                                                                                        (subCat3.version_one.item_details
                                                                                                            ? subCat3.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                            : 0
                                                                                                        )
                                                                                                        +
                                                                                                        // Sum all sub-category 4 material_type_details for level 3
                                                                                                        (subCat3.sub_categories_4
                                                                                                            ? subCat3.sub_categories_4.reduce(
                                                                                                                (subSum4, subCat4) =>
                                                                                                                    subSum4 +
                                                                                                                    (
                                                                                                                        // Sum direct item_details for level 4
                                                                                                                        (subCat4.version_one.item_details
                                                                                                                            ? subCat4.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.version_one.item_details
                                                                                                                                        ? subCat5.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                    ),
                                                                                                                                0
                                                                                                                            )
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                    ),
                                                                                                                0
                                                                                                            )
                                                                                                            : 0
                                                                                                        )
                                                                                                    ),
                                                                                                0
                                                                                            )
                                                                                            : 0
                                                                                        )
                                                                                    ),
                                                                                0
                                                                            )
                                                                            : 0
                                                                        )
                                                                    )
                                                                }
                                                            </td>
                                                            <td>

                                                            </td>
                                                            <td></td>

                                                            <td>
                                                                {
                                                                    (
                                                                        // Sum direct material_type_details amounts for main category (version two)
                                                                        (category.version_two.item_details
                                                                            ? category.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                            : 0
                                                                        )
                                                                        +
                                                                        // Sum all sub-category 2 material_type_details amounts for main category (version two)
                                                                        (category.sub_categories_2
                                                                            ? category.sub_categories_2.reduce(
                                                                                (subSum2, subCat2) =>
                                                                                    subSum2 +
                                                                                    (
                                                                                        // Sum direct item_details for level 2
                                                                                        (subCat2.version_two.item_details
                                                                                            ? subCat2.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                            : 0
                                                                                        )
                                                                                        +
                                                                                        // Sum all sub-category 3 material_type_details for level 2
                                                                                        (subCat2.sub_categories_3
                                                                                            ? subCat2.sub_categories_3.reduce(
                                                                                                (subSum3, subCat3) =>
                                                                                                    subSum3 +
                                                                                                    (
                                                                                                        // Sum direct item_details for level 3
                                                                                                        (subCat3.version_two.item_details
                                                                                                            ? subCat3.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                            : 0
                                                                                                        )
                                                                                                        +
                                                                                                        // Sum all sub-category 4 material_type_details for level 3
                                                                                                        (subCat3.sub_categories_4
                                                                                                            ? subCat3.sub_categories_4.reduce(
                                                                                                                (subSum4, subCat4) =>
                                                                                                                    subSum4 +
                                                                                                                    (
                                                                                                                        // Sum direct item_details for level 4
                                                                                                                        (subCat4.version_two.item_details
                                                                                                                            ? subCat4.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.version_two.item_details
                                                                                                                                        ? subCat5.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                    ),
                                                                                                                                0
                                                                                                                            )
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                    ),
                                                                                                                0
                                                                                                            )
                                                                                                            : 0
                                                                                                        )
                                                                                                    ),
                                                                                                0
                                                                                            )
                                                                                            : 0
                                                                                        )
                                                                                    ),
                                                                                0
                                                                            )
                                                                            : 0
                                                                        )
                                                                    )
                                                                }
                                                            </td>
                                                        </tr>

                                                        {openCategoryId === category.id && (
                                                            <>
                                                                {/* Map item_details for version_one and version_two side by side */}
                                                                {(category.version_one?.item_details || []).map((item1, idx) => (
                                                                    <tr key={`v1-${item1.id || idx}`} className="labour">
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>

                                                                        <td>{item1.type}</td>
                                                                        <td>{item1.material_type} {item1.generic_info || item1.labour_activity || item1.composite_name}</td>
                                                                        <td>{item1.rate || "0"}</td>
                                                                        <td>{item1.excl_wastage_qty || "0"}</td>

                                                                        <td>{item1.amount || "0"}</td>
                                                                        {/* Version 2 columns */}
                                                                        {category.version_two?.item_details[idx] ? (
                                                                            <>
                                                                                <td>{category.version_two.item_details[idx].rate || "0"}</td>
                                                                                <td>{category.version_two.item_details[idx].excl_wastage_qty || "0"}</td>
                                                                                <td>{category.version_two.item_details[idx].amount || "0"}</td>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <td>-</td>
                                                                                <td>-</td>
                                                                                <td>-</td>
                                                                            </>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                                {/* If version_two has more items than version_one, render them too */}
                                                                {(category.version_two?.item_details || []).slice(category.version_one?.item_details?.length || 0).map((item2, idx) => (
                                                                    <tr key={`v2-extra-${item2.id || idx}`} className="labour">
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>

                                                                        <td>{item2.type}</td>
                                                                        <td>{item2.material_type} {item2.generic_info || item2.labour_activity || item2.composite_name}</td>
                                                                        <td>-</td>
                                                                        <td>-</td>
                                                                        <td>-</td>

                                                                        {/* Version 2 columns */}
                                                                        <td>{item2.rate || "0"}</td>
                                                                        <td>{item2.excl_wastage_qty || "0"}</td>
                                                                        <td>{item2.amount || "0"}</td>
                                                                    </tr>
                                                                ))}
                                                            </>
                                                        )}




                                                        {/* sub level 2 start */}
                                                        {openCategoryId === category.id &&
                                                            category.sub_categories_2 &&
                                                            category.sub_categories_2.length > 0 &&
                                                            category.sub_categories_2.map((subCategory, subCatIdx) => (
                                                                <React.Fragment key={subCategory.id}>
                                                                    <tr className="category-lvl2">
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-link p-0"
                                                                                onClick={() =>
                                                                                    toggleSubCategory2(subCategory.id)
                                                                                }
                                                                                aria-label="Toggle sub-category 2 visibility"
                                                                            >
                                                                                {openSubCategory2Id ===
                                                                                    subCategory.id ? (
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="24"
                                                                                        height="24"
                                                                                        viewBox="0 0 24 24"
                                                                                        fill=" #e0e0e0"
                                                                                        stroke="black"
                                                                                        strokeWidth="1"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                    >
                                                                                        {/* Square */}
                                                                                        <rect
                                                                                            x="3"
                                                                                            y="3"
                                                                                            width="18"
                                                                                            height="20"
                                                                                            rx="1"
                                                                                            ry="1"
                                                                                        />
                                                                                        {/* Minus Icon */}
                                                                                        <line
                                                                                            x1="8"
                                                                                            y1="12"
                                                                                            x2="16"
                                                                                            y2="12"
                                                                                        />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="24"
                                                                                        height="24"
                                                                                        viewBox="0 0 24 24"
                                                                                        fill=" #e0e0e0"
                                                                                        stroke="black"
                                                                                        strokeWidth="1"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                    >
                                                                                        {/* Square */}
                                                                                        <rect
                                                                                            x="3"
                                                                                            y="3"
                                                                                            width="18"
                                                                                            height="20"
                                                                                            rx="1"
                                                                                            ry="1"
                                                                                        />
                                                                                        {/* Plus Icon */}
                                                                                        <line
                                                                                            x1="12"
                                                                                            y1="8"
                                                                                            x2="12"
                                                                                            y2="16"
                                                                                        />
                                                                                        <line
                                                                                            x1="8"
                                                                                            y1="12"
                                                                                            x2="16"
                                                                                            y2="12"
                                                                                        />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        </td>

                                                                        <td></td>
                                                                        <td>Sub-Category Level 2</td>
                                                                        <td></td>
                                                                        <td>
                                                                            {/* {subCategory.estimation_item.location || "-"} */}

                                                                        </td>

                                                                        <td>
                                                                            {subCategory.name}
                                                                        </td>
                                                                        <td>

                                                                            {/* {subCategory.estimation_item.name || "-"} */}
                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        <td>
                                                                            {/* {subCategory.estimation_item.uom || "-"} */}
                                                                        </td>
                                                                        <td>
                                                                            {/* {subCategory.estimation_item.qty || "-"} */}

                                                                            {
                                                                                (
                                                                                    // Sum direct material_type_details amounts for level 2
                                                                                    (subCategory.version_one.item_details
                                                                                        ? subCategory.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                        : 0
                                                                                    )
                                                                                    +
                                                                                    // Sum all sub-category 3 material_type_details amounts for level 2
                                                                                    (subCategory.sub_categories_3
                                                                                        ? subCategory.sub_categories_3.reduce(
                                                                                            (subSum3, subCat3) =>
                                                                                                subSum3 +
                                                                                                (
                                                                                                    // Sum direct material_type_details for level 3
                                                                                                    (subCat3.version_one.item_details
                                                                                                        ? subCat3.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                        : 0
                                                                                                    )
                                                                                                    +
                                                                                                    // Sum all sub-category 4 material_type_details for level 3
                                                                                                    (subCat3.sub_categories_4
                                                                                                        ? subCat3.sub_categories_4.reduce(
                                                                                                            (subSum4, subCat4) =>
                                                                                                                subSum4 +
                                                                                                                (
                                                                                                                    // Sum direct material_type_details for level 4
                                                                                                                    (subCat4.version_one.item_details
                                                                                                                        ? subCat4.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details for level 4
                                                                                                                    (subCat4.sub_categories_5
                                                                                                                        ? subCat4.sub_categories_5.reduce(
                                                                                                                            (subSum5, subCat5) =>
                                                                                                                                subSum5 +
                                                                                                                                (subCat5.version_one.item_details
                                                                                                                                    ? subCat5.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                ),
                                                                                                            0
                                                                                                        )
                                                                                                        : 0
                                                                                                    )
                                                                                                ),
                                                                                            0
                                                                                        )
                                                                                        : 0
                                                                                    )
                                                                                )
                                                                            }

                                                                        </td>
                                                                        <td>

                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        {/* <td></td> */}
                                                                        <td>

                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                (
                                                                                    // Sum direct material_type_details amounts for level 2
                                                                                    (subCategory.version_two.item_details
                                                                                        ? subCategory.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                        : 0
                                                                                    )
                                                                                    +
                                                                                    // Sum all sub-category 3 material_type_details amounts for level 2
                                                                                    (subCategory.sub_categories_3
                                                                                        ? subCategory.sub_categories_3.reduce(
                                                                                            (subSum3, subCat3) =>
                                                                                                subSum3 +
                                                                                                (
                                                                                                    // Sum direct material_type_details for level 3
                                                                                                    (subCat3.version_two.item_details
                                                                                                        ? subCat3.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                        : 0
                                                                                                    )
                                                                                                    +
                                                                                                    // Sum all sub-category 4 material_type_details for level 3
                                                                                                    (subCat3.sub_categories_4
                                                                                                        ? subCat3.sub_categories_4.reduce(
                                                                                                            (subSum4, subCat4) =>
                                                                                                                subSum4 +
                                                                                                                (
                                                                                                                    // Sum direct material_type_details for level 4
                                                                                                                    (subCat4.version_two.item_details
                                                                                                                        ? subCat4.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details for level 4
                                                                                                                    (subCat4.sub_categories_5
                                                                                                                        ? subCat4.sub_categories_5.reduce(
                                                                                                                            (subSum5, subCat5) =>
                                                                                                                                subSum5 +
                                                                                                                                (subCat5.version_two.item_details
                                                                                                                                    ? subCat5.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                ),
                                                                                                            0
                                                                                                        )
                                                                                                        : 0
                                                                                                    )
                                                                                                ),
                                                                                            0
                                                                                        )
                                                                                        : 0
                                                                                    )
                                                                                )
                                                                            }
                                                                        </td>


                                                                    </tr>

                                                                    {openSubCategory2Id === subCategory.id && (
                                                                        <>
                                                                            {/* Map item_details for version_one and version_two side by side */}
                                                                            {(subCategory.version_one?.item_details || []).map((item1, idx) => (
                                                                                <tr key={`v1-${item1.id || idx}`} className="labour">
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>

                                                                                    <td>{item1.type}</td>
                                                                                    <td>{item1.material_type} {item1.generic_info || item1.labour_activity || item1.composite_name}</td>
                                                                                    <td>{item1.rate || "0"}</td>
                                                                                    <td>{item1.excl_wastage_qty || "0"}</td>

                                                                                    <td>{item1.amount || "0"}</td>
                                                                                    {/* Version 2 columns */}
                                                                                    {subCategory.version_two?.item_details[idx] ? (
                                                                                        <>
                                                                                            <td>{subCategory.version_two.item_details[idx].rate || "0"}</td>
                                                                                            <td>{subCategory.version_two.item_details[idx].excl_wastage_qty || "0"}</td>
                                                                                            <td>{subCategory.version_two.item_details[idx].amount || "0"}</td>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <td>-</td>
                                                                                            <td>-</td>
                                                                                            <td>-</td>
                                                                                        </>
                                                                                    )}
                                                                                </tr>
                                                                            ))}
                                                                            {/* If version_two has more items than version_one, render them too */}
                                                                            {(subCategory.version_two?.item_details || []).slice(subCategory.version_one?.item_details?.length || 0).map((item2, idx) => (
                                                                                <tr key={`v2-extra-${item2.id || idx}`} className="labour">
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>

                                                                                    <td>{item2.type}</td>
                                                                                    <td>{item2.material_type} {item2.generic_info || item2.labour_activity || item2.composite_name}</td>
                                                                                    <td>-</td>
                                                                                    <td>-</td>
                                                                                    <td>-</td>

                                                                                    {/* Version 2 columns */}
                                                                                    <td>{item2.rate || "0"}</td>
                                                                                    <td>{item2.excl_wastage_qty || "0"}</td>
                                                                                    <td>{item2.amount || "0"}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </>
                                                                    )}

                                                                    {/* Render material_type_details rows for sub-category 2  end */}







                                                                    {/* ...sub-category 3 rendering... */}

                                                                    {/* Render Sub-Category 3 for each Sub-Category 2 */}
                                                                    {openSubCategory2Id === subCategory.id &&
                                                                        subCategory.sub_categories_3 &&
                                                                        subCategory.sub_categories_3.length > 0 &&
                                                                        subCategory.sub_categories_3.map(
                                                                            (subCategory3, subCategory3Idx) => (
                                                                                <React.Fragment key={subCategory3.id}>
                                                                                    <tr className="sub-category-lvl3">
                                                                                        {/* {console.log("sub3", subCategory3)}
                                            {console.log(
                                              "sub4",
                                              subCategory3.sub_categories_4
                                            )}
                                            {console.log(
                                              "sub3id:",
                                              openSubCategory3Id
                                            )} */}
                                                                                        <td>
                                                                                            <button
                                                                                                className="btn btn-link p-0"
                                                                                                onClick={() =>
                                                                                                    toggleSubCategory3(
                                                                                                        subCategory3.id
                                                                                                    )
                                                                                                }
                                                                                                aria-label="Toggle sub-category 3 visibility"
                                                                                            >
                                                                                                {openSubCategory3Id ===
                                                                                                    subCategory3.id ? (
                                                                                                    <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        width="24"
                                                                                                        height="24"
                                                                                                        viewBox="0 0 24 24"
                                                                                                        fill=" #e0e0e0"
                                                                                                        stroke="black"
                                                                                                        strokeWidth="1"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                    >
                                                                                                        {/* Square */}
                                                                                                        <rect
                                                                                                            x="3"
                                                                                                            y="3"
                                                                                                            width="18"
                                                                                                            height="20"
                                                                                                            rx="1"
                                                                                                            ry="1"
                                                                                                        />
                                                                                                        {/* Minus Icon */}
                                                                                                        <line
                                                                                                            x1="8"
                                                                                                            y1="12"
                                                                                                            x2="16"
                                                                                                            y2="12"
                                                                                                        />
                                                                                                    </svg>
                                                                                                ) : (
                                                                                                    <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        width="24"
                                                                                                        height="24"
                                                                                                        viewBox="0 0 24 24"
                                                                                                        fill=" #e0e0e0"
                                                                                                        stroke="black"
                                                                                                        strokeWidth="1"
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                    >
                                                                                                        {/* Square */}
                                                                                                        <rect
                                                                                                            x="3"
                                                                                                            y="3"
                                                                                                            width="18"
                                                                                                            height="20"
                                                                                                            rx="1"
                                                                                                            ry="1"
                                                                                                        />
                                                                                                        {/* Plus Icon */}
                                                                                                        <line
                                                                                                            x1="12"
                                                                                                            y1="8"
                                                                                                            x2="12"
                                                                                                            y2="16"
                                                                                                        />
                                                                                                        <line
                                                                                                            x1="8"
                                                                                                            y1="12"
                                                                                                            x2="16"
                                                                                                            y2="12"
                                                                                                        />
                                                                                                    </svg>
                                                                                                )}
                                                                                            </button>
                                                                                        </td>
                                                                                        <td></td>
                                                                                        <td>Sub-Category Level 3</td>
                                                                                        <td></td>
                                                                                        <td>
                                                                                            {/* {subCategory3.estimation_item.location || "-"} */}
                                                                                        </td>
                                                                                        <td>
                                                                                            {subCategory3.name}
                                                                                        </td>
                                                                                        <td>

                                                                                            {/* {subCategory.estimation_item.name || "-"} */}
                                                                                        </td>


                                                                                        <td>
                                                                                            {/* {subCategory.estimation_item.uom || "-"} */}


                                                                                        </td>
                                                                                        <td>
                                                                                            {/* {subCategory.estimation_item.qty || "-"} */}
                                                                                            {
                                                                                                (
                                                                                                    // Sum direct material_type_details amounts for level 3
                                                                                                    (subCategory3.version_one.item_details
                                                                                                        ? subCategory3.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                        : 0
                                                                                                    )
                                                                                                    +
                                                                                                    // Sum all sub-category 4 material_type_details amounts for level 3
                                                                                                    (subCategory3.sub_categories_4
                                                                                                        ? subCategory3.sub_categories_4.reduce(
                                                                                                            (subSum, subCat4) =>
                                                                                                                subSum +
                                                                                                                (
                                                                                                                    // Sum direct material_type_details for level 4
                                                                                                                    (subCat4.version_one.item_details
                                                                                                                        ? subCat4.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details for level 4
                                                                                                                    (subCat4.sub_categories_5
                                                                                                                        ? subCat4.sub_categories_5.reduce(
                                                                                                                            (subSum5, subCat5) =>
                                                                                                                                subSum5 +
                                                                                                                                (subCat5.version_one.item_details
                                                                                                                                    ? subCat5.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                ),
                                                                                                            0
                                                                                                        )
                                                                                                        : 0
                                                                                                    )
                                                                                                )
                                                                                            }

                                                                                        </td>
                                                                                        {/* <td></td>
                                                                                        <td></td> */}
                                                                                        <td></td>
                                                                                        <td>

                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                (
                                                                                                    // Sum direct material_type_details amounts for level 3
                                                                                                    (subCategory3.version_two.item_details
                                                                                                        ? subCategory3.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                        : 0
                                                                                                    )
                                                                                                    +
                                                                                                    // Sum all sub-category 4 material_type_details amounts for level 3
                                                                                                    (subCategory3.sub_categories_4
                                                                                                        ? subCategory3.sub_categories_4.reduce(
                                                                                                            (subSum, subCat4) =>
                                                                                                                subSum +
                                                                                                                (
                                                                                                                    // Sum direct material_type_details for level 4
                                                                                                                    (subCat4.version_two.item_details
                                                                                                                        ? subCat4.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details for level 4
                                                                                                                    (subCat4.sub_categories_5
                                                                                                                        ? subCat4.sub_categories_5.reduce(
                                                                                                                            (subSum5, subCat5) =>
                                                                                                                                subSum5 +
                                                                                                                                (subCat5.version_two.item_details
                                                                                                                                    ? subCat5.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                ),
                                                                                                            0
                                                                                                        )
                                                                                                        : 0
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        </td>

                                                                                    </tr>
                                                                                    {openSubCategory3Id === subCategory3.id && (
                                                                                        <>
                                                                                            {/* Map item_details for version_one and version_two side by side */}
                                                                                            {(subCategory3.version_one?.item_details || []).map((item1, idx) => (
                                                                                                <tr key={`v1-${item1.id || idx}`} className="labour">
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>

                                                                                                    <td>{item1.type}</td>
                                                                                                    <td>{item1.material_type} {item1.generic_info || item1.labour_activity || item1.composite_name}</td>
                                                                                                    <td>{item1.rate || "0"}</td>
                                                                                                    <td>{item1.excl_wastage_qty || "0"}</td>

                                                                                                    <td>{item1.amount || "0"}</td>
                                                                                                    {/* Version 2 columns */}
                                                                                                    {subCategory3.version_two?.item_details[idx] ? (
                                                                                                        <>
                                                                                                            <td>{subCategory3.version_two.item_details[idx].rate || "0"}</td>
                                                                                                            <td>{subCategory3.version_two.item_details[idx].excl_wastage_qty || "0"}</td>
                                                                                                            <td>{subCategory3.version_two.item_details[idx].amount || "0"}</td>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <td>-</td>
                                                                                                            <td>-</td>
                                                                                                            <td>-</td>
                                                                                                        </>
                                                                                                    )}
                                                                                                </tr>
                                                                                            ))}
                                                                                            {/* If version_two has more items than version_one, render them too */}
                                                                                            {(subCategory3.version_two?.item_details || []).slice(subCategory3.version_one?.item_details?.length || 0).map((item2, idx) => (
                                                                                                <tr key={`v2-extra-${item2.id || idx}`} className="labour">
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>

                                                                                                    <td>{item2.type}</td>
                                                                                                    <td>{item2.material_type} {item2.generic_info || item2.labour_activity || item2.composite_name}</td>
                                                                                                    <td>-</td>
                                                                                                    <td>-</td>
                                                                                                    <td>-</td>

                                                                                                    {/* Version 2 columns */}
                                                                                                    <td>{item2.rate || "0"}</td>
                                                                                                    <td>{item2.excl_wastage_qty || "0"}</td>
                                                                                                    <td>{item2.amount || "0"}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </>
                                                                                    )}

                                                                                    {/* Render Level 4 for each BOQ level 3 */}
                                                                                    {openSubCategory3Id ===
                                                                                        subCategory3.id &&
                                                                                        subCategory3.sub_categories_4 &&
                                                                                        subCategory3.sub_categories_4
                                                                                            .length > 0 &&
                                                                                        subCategory3.sub_categories_4.map(
                                                                                            (subCategory4, subCategory4Idx) => (
                                                                                                <React.Fragment
                                                                                                    key={subCategory4.id}
                                                                                                >
                                                                                                    <tr className="sub-category-lvl4">
                                                                                                        {/* {console.log("sub3",subCategory3)}
                                                                            {console.log("sub4",subCategory3.sub_categories_4)}
                                                                            {console.log("sub3id:", openSubCategory3Id)} */}
                                                                                                        <td>
                                                                                                            <button
                                                                                                                className="btn btn-link p-0"
                                                                                                                onClick={() =>
                                                                                                                    toggleSubCategory4(
                                                                                                                        subCategory4.id
                                                                                                                    )
                                                                                                                }
                                                                                                                aria-label="Toggle sub-category 3 visibility"
                                                                                                            >
                                                                                                                {openSubCategory4Id ===
                                                                                                                    subCategory4.id ? (
                                                                                                                    <svg
                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                        width="24"
                                                                                                                        height="24"
                                                                                                                        viewBox="0 0 24 24"
                                                                                                                        fill=" #e0e0e0"
                                                                                                                        stroke="black"
                                                                                                                        strokeWidth="1"
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"
                                                                                                                    >
                                                                                                                        {/* Square */}
                                                                                                                        <rect
                                                                                                                            x="3"
                                                                                                                            y="3"
                                                                                                                            width="18"
                                                                                                                            height="20"
                                                                                                                            rx="1"
                                                                                                                            ry="1"
                                                                                                                        />
                                                                                                                        {/* Minus Icon */}
                                                                                                                        <line
                                                                                                                            x1="8"
                                                                                                                            y1="12"
                                                                                                                            x2="16"
                                                                                                                            y2="12"
                                                                                                                        />
                                                                                                                    </svg>
                                                                                                                ) : (
                                                                                                                    <svg
                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                        width="24"
                                                                                                                        height="24"
                                                                                                                        viewBox="0 0 24 24"
                                                                                                                        fill=" #e0e0e0"
                                                                                                                        stroke="black"
                                                                                                                        strokeWidth="1"
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"
                                                                                                                    >
                                                                                                                        {/* Square */}
                                                                                                                        <rect
                                                                                                                            x="3"
                                                                                                                            y="3"
                                                                                                                            width="18"
                                                                                                                            height="20"
                                                                                                                            rx="1"
                                                                                                                            ry="1"
                                                                                                                        />
                                                                                                                        {/* Plus Icon */}
                                                                                                                        <line
                                                                                                                            x1="12"
                                                                                                                            y1="8"
                                                                                                                            x2="12"
                                                                                                                            y2="16"
                                                                                                                        />
                                                                                                                        <line
                                                                                                                            x1="8"
                                                                                                                            y1="12"
                                                                                                                            x2="16"
                                                                                                                            y2="12"
                                                                                                                        />
                                                                                                                    </svg>
                                                                                                                )}
                                                                                                            </button>
                                                                                                        </td>
                                                                                                        <td></td>
                                                                                                        <td>
                                                                                                            Sub-Category Level 4
                                                                                                        </td>
                                                                                                        <td></td>
                                                                                                        <td>
                                                                                                            {/* {subCategory3.estimation_item.location || "-"} */}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {subCategory4.name}
                                                                                                        </td>
                                                                                                        <td>

                                                                                                            {/* {subCategory.estimation_item.name || "-"} */}
                                                                                                        </td>
                                                                                                        {/* <td>

                                                                                                        </td> */}
                                                                                                        <td>
                                                                                                            {/* {subCategory.estimation_item.uom || "-"} */}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {/* {subCategory.estimation_item.qty || "-"} */}

                                                                                                            {
                                                                                                                (
                                                                                                                    // Sum direct material_type_details amounts for level 4
                                                                                                                    (subCategory4.version_one.item_details
                                                                                                                        ? subCategory4.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                    (subCategory4.sub_categories_5
                                                                                                                        ? subCategory4.sub_categories_5.reduce(
                                                                                                                            (subSum, subCat5) =>
                                                                                                                                subSum +
                                                                                                                                (subCat5.version_one.item_details
                                                                                                                                    ? subCat5.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                )
                                                                                                            }
                                                                                                        </td>
                                                                                                        {/* <td></td>
                                                                                                        <td></td> */}
                                                                                                        <td></td>
                                                                                                        <td>

                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {
                                                                                                                (
                                                                                                                    // Sum direct material_type_details amounts for level 4
                                                                                                                    (subCategory4.version_two.item_details
                                                                                                                        ? subCategory4.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                    +
                                                                                                                    // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                    (subCategory4.sub_categories_5
                                                                                                                        ? subCategory4.sub_categories_5.reduce(
                                                                                                                            (subSum, subCat5) =>
                                                                                                                                subSum +
                                                                                                                                (subCat5.version_two.item_details
                                                                                                                                    ? subCat5.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                                ),
                                                                                                                            0
                                                                                                                        )
                                                                                                                        : 0
                                                                                                                    )
                                                                                                                )
                                                                                                            }
                                                                                                        </td>


                                                                                                    </tr>

                                                                                                    {openSubCategory4Id === subCategory4.id && (
                                                                                                        <>
                                                                                                            {/* Map item_details for version_one and version_two side by side */}
                                                                                                            {(subCategory4.version_one?.item_details || []).map((item1, idx) => (
                                                                                                                <tr key={`v1-${item1.id || idx}`} className="labour">
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>

                                                                                                                    <td>{item1.type}</td>
                                                                                                                    <td>{item1.material_type} {item1.generic_info || item1.labour_activity || item1.composite_name}</td>
                                                                                                                    <td>{item1.rate || "0"}</td>
                                                                                                                    <td>{item1.excl_wastage_qty || "0"}</td>

                                                                                                                    <td>{item1.amount || "0"}</td>
                                                                                                                    {/* Version 2 columns */}
                                                                                                                    {subCategory4.version_two?.item_details[idx] ? (
                                                                                                                        <>
                                                                                                                            <td>{subCategory4.version_two.item_details[idx].rate || "0"}</td>
                                                                                                                            <td>{subCategory4.version_two.item_details[idx].excl_wastage_qty || "0"}</td>
                                                                                                                            <td>{subCategory4.version_two.item_details[idx].amount || "0"}</td>
                                                                                                                        </>
                                                                                                                    ) : (
                                                                                                                        <>
                                                                                                                            <td>-</td>
                                                                                                                            <td>-</td>
                                                                                                                            <td>-</td>
                                                                                                                        </>
                                                                                                                    )}
                                                                                                                </tr>
                                                                                                            ))}
                                                                                                            {/* If version_two has more items than version_one, render them too */}
                                                                                                            {(subCategory4.version_two?.item_details || []).slice(subCategory4.version_one?.item_details?.length || 0).map((item2, idx) => (
                                                                                                                <tr key={`v2-extra-${item2.id || idx}`} className="labour">
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>

                                                                                                                    <td>{item2.type}</td>
                                                                                                                    <td>{item2.material_type} {item2.generic_info || item2.labour_activity || item2.composite_name}</td>
                                                                                                                    <td>-</td>
                                                                                                                    <td>-</td>
                                                                                                                    <td>-</td>

                                                                                                                    {/* Version 2 columns */}
                                                                                                                    <td>{item2.rate || "0"}</td>
                                                                                                                    <td>{item2.excl_wastage_qty || "0"}</td>
                                                                                                                    <td>{item2.amount || "0"}</td>
                                                                                                                </tr>
                                                                                                            ))}
                                                                                                        </>
                                                                                                    )}




                                                                                                    {/* Render Level 5 for each BOQ level 4*/}
                                                                                                    {openSubCategory4Id ===
                                                                                                        subCategory4.id &&
                                                                                                        subCategory4.sub_categories_5 &&
                                                                                                        subCategory4
                                                                                                            .sub_categories_5.length >
                                                                                                        0 &&
                                                                                                        subCategory4.sub_categories_5.map(
                                                                                                            (subCategory5, subCategory5Idx) => (
                                                                                                                <React.Fragment
                                                                                                                    key={subCategory5.id}
                                                                                                                >
                                                                                                                    <tr className="sub-category-lvl5">
                                                                                                                        {console.log(
                                                                                                                            "sub5",
                                                                                                                            subCategory5
                                                                                                                        )}
                                                                                                                        {/* {console.log("sub4",subCategory3.sub_categories_4)}
                                                                            {console.log("sub3id:", openSubCategory3Id)} */}
                                                                                                                        <td>
                                                                                                                            <button
                                                                                                                                className="btn btn-link p-0"
                                                                                                                                onClick={() =>
                                                                                                                                    toggleSubCategory5(
                                                                                                                                        subCategory5.id
                                                                                                                                    )
                                                                                                                                }
                                                                                                                                aria-label="Toggle sub-category 3 visibility"
                                                                                                                            >
                                                                                                                                {openSubCategory5Id ===
                                                                                                                                    subCategory5.id ? (
                                                                                                                                    <svg
                                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                                        width="24"
                                                                                                                                        height="24"
                                                                                                                                        viewBox="0 0 24 24"
                                                                                                                                        fill=" #e0e0e0"
                                                                                                                                        stroke="black"
                                                                                                                                        strokeWidth="1"
                                                                                                                                        strokeLinecap="round"
                                                                                                                                        strokeLinejoin="round"
                                                                                                                                    >
                                                                                                                                        {/* Square */}
                                                                                                                                        <rect
                                                                                                                                            x="3"
                                                                                                                                            y="3"
                                                                                                                                            width="18"
                                                                                                                                            height="20"
                                                                                                                                            rx="1"
                                                                                                                                            ry="1"
                                                                                                                                        />
                                                                                                                                        {/* Minus Icon */}
                                                                                                                                        <line
                                                                                                                                            x1="8"
                                                                                                                                            y1="12"
                                                                                                                                            x2="16"
                                                                                                                                            y2="12"
                                                                                                                                        />
                                                                                                                                    </svg>
                                                                                                                                ) : (
                                                                                                                                    <svg
                                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                                        width="24"
                                                                                                                                        height="24"
                                                                                                                                        viewBox="0 0 24 24"
                                                                                                                                        fill=" #e0e0e0"
                                                                                                                                        stroke="black"
                                                                                                                                        strokeWidth="1"
                                                                                                                                        strokeLinecap="round"
                                                                                                                                        strokeLinejoin="round"
                                                                                                                                    >
                                                                                                                                        {/* Square */}
                                                                                                                                        <rect
                                                                                                                                            x="3"
                                                                                                                                            y="3"
                                                                                                                                            width="18"
                                                                                                                                            height="20"
                                                                                                                                            rx="1"
                                                                                                                                            ry="1"
                                                                                                                                        />
                                                                                                                                        {/* Plus Icon */}
                                                                                                                                        <line
                                                                                                                                            x1="12"
                                                                                                                                            y1="8"
                                                                                                                                            x2="12"
                                                                                                                                            y2="16"
                                                                                                                                        />
                                                                                                                                        <line
                                                                                                                                            x1="8"
                                                                                                                                            y1="12"
                                                                                                                                            x2="16"
                                                                                                                                            y2="12"
                                                                                                                                        />
                                                                                                                                    </svg>
                                                                                                                                )}
                                                                                                                            </button>
                                                                                                                        </td>
                                                                                                                        <td></td>
                                                                                                                        <td>
                                                                                                                            Sub-Category Level 5
                                                                                                                        </td>
                                                                                                                        <td>

                                                                                                                        </td>
                                                                                                                        <td>

                                                                                                                            {/* {subCategory3.estimation_item.location || "-"} */}
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            {
                                                                                                                                subCategory5.name
                                                                                                                            }
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            {/* {subCategory.estimation_item.name || "-"} */}
                                                                                                                        </td>

                                                                                                                        <td>
                                                                                                                            {/* {subCategory.estimation_item.uom || "-"} */}

                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            {/* {subCategory.estimation_item.qty || "-"} */}
                                                                                                                            {
                                                                                                                                subCategory5.version_one.item_details
                                                                                                                                    ? subCategory5.version_one.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                            }
                                                                                                                        </td>

                                                                                                                        <td></td>
                                                                                                                        <td>

                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            {
                                                                                                                                subCategory5.version_two.item_details
                                                                                                                                    ? subCategory5.version_two.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                    : 0
                                                                                                                            }
                                                                                                                        </td>


                                                                                                                    </tr>
                                                                                                                    {openSubCategory5Id === subCategory5.id && (
                                                                                                                        <>
                                                                                                                            {/* Map item_details for version_one and version_two side by side */}
                                                                                                                            {(subCategory5.version_one?.item_details || []).map((item1, idx) => (
                                                                                                                                <tr key={`v1-${item1.id || idx}`} className="labour">
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>

                                                                                                                                    <td>{item1.type}</td>
                                                                                                                                    <td>{item1.material_type} {item1.generic_info || item1.labour_activity || item1.composite_name}</td>
                                                                                                                                    <td>{item1.rate || "0"}</td>
                                                                                                                                    <td>{item1.excl_wastage_qty || "0"}</td>

                                                                                                                                    <td>{item1.amount || "0"}</td>
                                                                                                                                    {/* Version 2 columns */}
                                                                                                                                    {subCategory5.version_two?.item_details[idx] ? (
                                                                                                                                        <>
                                                                                                                                            <td>{subCategory5.version_two.item_details[idx].rate || "0"}</td>
                                                                                                                                            <td>{subCategory5.version_two.item_details[idx].excl_wastage_qty || "0"}</td>
                                                                                                                                            <td>{subCategory5.version_two.item_details[idx].amount || "0"}</td>
                                                                                                                                        </>
                                                                                                                                    ) : (
                                                                                                                                        <>
                                                                                                                                            <td>-</td>
                                                                                                                                            <td>-</td>
                                                                                                                                            <td>-</td>
                                                                                                                                        </>
                                                                                                                                    )}
                                                                                                                                </tr>
                                                                                                                            ))}
                                                                                                                            {/* If version_two has more items than version_one, render them too */}
                                                                                                                            {(subCategory5.version_two?.item_details || []).slice(subCategory5.version_one?.item_details?.length || 0).map((item2, idx) => (
                                                                                                                                <tr key={`v2-extra-${item2.id || idx}`} className="labour">
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>

                                                                                                                                    <td>{item2.type}</td>
                                                                                                                                    <td>{item2.material_type} {item2.generic_info || item2.labour_activity || item2.composite_name}</td>
                                                                                                                                    <td>-</td>
                                                                                                                                    <td>-</td>
                                                                                                                                    <td>-</td>

                                                                                                                                    {/* Version 2 columns */}
                                                                                                                                    <td>{item2.rate || "0"}</td>
                                                                                                                                    <td>{item2.excl_wastage_qty || "0"}</td>
                                                                                                                                    <td>{item2.amount || "0"}</td>
                                                                                                                                </tr>
                                                                                                                            ))}
                                                                                                                        </>
                                                                                                                    )}
                                                                                                                </React.Fragment>
                                                                                                            )
                                                                                                        )}
                                                                                                </React.Fragment>
                                                                                            )
                                                                                        )}
                                                                                </React.Fragment>
                                                                            )
                                                                        )}

                                                                    {/* .. */}
                                                                </React.Fragment>
                                                            ))}
                                                        {/* sub level 2 end*/}
                                                    </React.Fragment>
                                                ))}
                                            {/* Conditional rendering for categories under sub-project  end*/}

                                            {/* subProject end */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>





                        {/* <div className="d-flex mt-2 justify-content-center">
                            <button className="purple-btn2">
                                Download
                            </button>
                            <button className="purple-btn1">
                                Print
                            </button>

                        </div> */}

                    </div>
                </div>
            </div>
            <LayoutModal show={settingShow} onHide={handleSettingClose} />
            <CopyBudgetModal show={show} handleClose={handleClose} />
        </>
    );
};

export default EstimationComparision;
