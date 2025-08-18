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
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
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
import { baseURL } from "../confi/apiDomain";




const EstimationCreationDetails = () => {
    // States to store data
    const navigate = useNavigate(); // ✅ define navigate here
    const { id } = useParams();

    // console.log("details selected:", details)
    const [subProjectDetails, setSubProjectDetails] = useState(null);
    const [budgetType, setBudgetType] = useState("");


    useEffect(() => {
        axios
            .get(
                `${baseURL}estimation_details/${id}/budget_info.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,

            )
            .then((res) => {
                console.log("responce cat:", res.data)
                setSubProjectDetails(res.data); // store response
                setBudgetType(res.data?.budget_type || "");
            })
            .catch((err) => {
                console.error("Error fetching sub project details:", err);
            });
    }, [id]); // runs once on mount


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
    const [status, setStatus] = useState('');
    const [remark, setRemark] = useState('');

    const statusOptions = [
        // {
        //     label: "Select Status",
        //     value: "",
        // },
        ...(subProjectDetails?.status_list || []).map((status) => ({
            label: status,
            value: status.toLowerCase(),
        })),
    ];

    // Step 2: Handle status change
    const handleStatusChange = (selectedOption) => {
        // setStatus(e.target.value);
        setStatus(selectedOption.value);
        console.log("Selected Status:", selectedOption.value); // Optional: Log the selected status for debugging
        // handleStatusChange(selectedOption); // Handle status change
    };

    // Step 3: Handle remark change
    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    };

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
                    </a>
                    <div className="card mt-3 pb-3 ">

                        <div className="details_page mt-5 mb-5 mx-3">
                            <div className="row px-3">
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>RERA Area</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {subProjectDetails?.rera_area || ""}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Construction Area</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {subProjectDetails?.construction_area || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Saleable Area</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {subProjectDetails?.saleble_area || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Number of Floors</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {subProjectDetails?.number_of_floors || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Number of Flats</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {subProjectDetails?.number_of_flats || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Budget Type</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">
                                                <span className="text-dark">:</span>
                                            </span>
                                            {/* {subProjectDetails?.budget_type || "-"} */}
                                            {budgetType === "non_wbs"
                                                ? "non wbs"
                                                : budgetType
                                                    ? budgetType
                                                    : "-"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

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

                        </div>


                        {/* <pre>{JSON.stringify(subProjectDetails, null, 2)}</pre> */}

                        {/* ______________________________________________________________________________________________________ */}
                        {budgetType === "wbs" && (
                            <div className="mx-3 mb-5 mt-3">


                                <div className="mx-3 ">
                                    <div className="tbl-container mt-1" style={{
                                        maxHeight: "750px",
                                    }}>
                                        <table
                                            className=""
                                        >
                                            <thead style={{ zIndex: "111 " }}>
                                                <tr>
                                                    <th className="text-start">Expand</th>
                                                    <th className="text-start">Sr No.</th>
                                                    <th className="text-start" style={{ width: "250px" }}>Level</th>
                                                    <th className="text-start">Category</th>
                                                    <th className="text-start">Location</th>
                                                    <th className="text-start">Type</th>
                                                    <th className="text-start">Items</th>
                                                    <th className="text-start">Factor</th>
                                                    <th className="text-start" style={{ width: "200px" }}>UOM</th>
                                                    {/* <th className="text-start">Area</th> */}
                                                    <th className="text-start">QTY Excl Wastage</th>
                                                    <th className="text-start">Wastage</th>
                                                    <th className="text-start">QTY incl Waste</th>
                                                    <th className="text-start">Rate</th>
                                                    <th className="text-start">Amount</th>
                                                    <th className="text-start">Cost Per Unit</th>

                                                </tr>
                                                <tr>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start">A</th>
                                                    <th className="text-start">B</th>
                                                    {/* <th className="text-start"></th> */}
                                                    <th className="text-start">C=C*A</th>
                                                    <th className="text-start">D</th>
                                                    <th className="text-start">E=C+C*D</th>
                                                    <th className="text-start">F</th>
                                                    <th className="text-start">G=E*F</th>
                                                    <th className="text-start">H=G/C</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Conditional rendering for categories under sub-project start */}
                                                {subProjectDetails &&
                                                    subProjectDetails.categories &&
                                                    subProjectDetails.categories.map((category, catIdx) => (
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
                                                                <td>{category.name}</td>
                                                                <td>
                                                                    {category.estimation_item.location || "-"}

                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    {category?.estimation_item.name || "-"}

                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    {category.estimation_item.uom || "-"}

                                                                </td>
                                                                {/* <td></td> */}
                                                                <td>
                                                                    {category.estimation_item.qty || "-"}

                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td>
                                                                    {
                                                                        (
                                                                            // Sum direct material_type_details amounts for main category
                                                                            (category.item_details
                                                                                ? category.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                            (subCat2.item_details
                                                                                                ? subCat2.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                            (subCat3.item_details
                                                                                                                ? subCat3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                            (subCat4.item_details
                                                                                                                                ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                : 0
                                                                                                                            )
                                                                                                                            +
                                                                                                                            // Sum all sub-category 5 material_type_details for level 4
                                                                                                                            (subCat4.sub_categories_5
                                                                                                                                ? subCat4.sub_categories_5.reduce(
                                                                                                                                    (subSum5, subCat5) =>
                                                                                                                                        subSum5 +
                                                                                                                                        (subCat5.item_details
                                                                                                                                            ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                <td></td>


                                                            </tr>


                                                            {openCategoryId === category.id &&
                                                                category.item_details &&
                                                                category.item_details.map((item, itemIdx) => (
                                                                    <tr key={item.id} className="labour">
                                                                        <td></td>
                                                                        <td>
                                                                            {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td>{item.type}</td>
                                                                        <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                        {/* Add other columns as needed */}
                                                                        <td>
                                                                            {item.factor || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.uom || "-"}
                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        <td>
                                                                            {item.excl_wastage_qty || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.wastage || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.incl_wastage_qty || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.rate || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.amount || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.cost_per_unit || "0"}

                                                                        </td>

                                                                    </tr>
                                                                ))
                                                            }

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
                                                                            <td>{subCategory.name}</td>
                                                                            <td>
                                                                                {subCategory.estimation_item.location || "-"}

                                                                            </td>

                                                                            <td>

                                                                            </td>
                                                                            <td>

                                                                                {subCategory.estimation_item.name || "-"}
                                                                            </td>
                                                                            <td></td>
                                                                            <td>
                                                                                {subCategory.estimation_item.uom || "-"}
                                                                            </td>
                                                                            <td>
                                                                                {subCategory.estimation_item.qty || "-"}

                                                                            </td>
                                                                            <td>

                                                                            </td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td>
                                                                                {
                                                                                    (
                                                                                        // Sum direct material_type_details amounts for level 2
                                                                                        (subCategory.item_details
                                                                                            ? subCategory.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                        (subCat3.item_details
                                                                                                            ? subCat3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.item_details
                                                                                                                            ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                            <td></td>


                                                                        </tr>

                                                                        {/* Render material_type_details rows for sub-category 2 */}
                                                                        {openSubCategory2Id === subCategory.id &&
                                                                            subCategory.item_details &&
                                                                            subCategory.item_details.map((item, itemIdx) => (
                                                                                <tr key={item.id} className="labour">
                                                                                    <td></td>
                                                                                    <td>
                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>{item.type}</td>
                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                    {/* Add other columns as needed */}
                                                                                    <td>
                                                                                        {item.factor || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.uom || "-"}
                                                                                    </td>
                                                                                    {/* <td></td> */}
                                                                                    <td>
                                                                                        {item.excl_wastage_qty || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.wastage || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.incl_wastage_qty || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.rate || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.amount || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.cost_per_unit || "0"}

                                                                                    </td>

                                                                                </tr>
                                                                            ))
                                                                        }
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
                                                                                            <td>{subCategory3.name}</td>
                                                                                            <td>
                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>
                                                                                            <td>

                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>

                                                                                            <td>
                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                            </td>
                                                                                            <td>
                                                                                                {subCategory.estimation_item.qty || "-"}

                                                                                            </td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td>
                                                                                                {
                                                                                                    (
                                                                                                        // Sum direct material_type_details amounts for level 3
                                                                                                        (subCategory3.item_details
                                                                                                            ? subCategory3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.item_details
                                                                                                                            ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                            <td></td>

                                                                                        </tr>

                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                        {openSubCategory3Id === subCategory3.id &&
                                                                                            subCategory3.item_details &&
                                                                                            subCategory3.item_details.map((item, itemIdx) => (
                                                                                                <tr key={item.id} className="labour">
                                                                                                    <td></td>
                                                                                                    <td>
                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                    </td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td>{item.type}</td>
                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                    {/* Add other columns as needed */}
                                                                                                    <td>
                                                                                                        {item.factor || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.uom || "-"}
                                                                                                    </td>
                                                                                                    {/* <td></td> */}
                                                                                                    <td>
                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.wastage || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.incl_wastage_qty || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.rate || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.amount || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.cost_per_unit || "0"}

                                                                                                    </td>

                                                                                                </tr>
                                                                                            ))
                                                                                        }


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
                                                                                                            <td>{subCategory4.name}</td>
                                                                                                            <td>
                                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>

                                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {subCategory.estimation_item.qty || "-"}
                                                                                                            </td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    (
                                                                                                                        // Sum direct material_type_details amounts for level 4
                                                                                                                        (subCategory4.item_details
                                                                                                                            ? subCategory4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                        (subCategory4.sub_categories_5
                                                                                                                            ? subCategory4.sub_categories_5.reduce(
                                                                                                                                (subSum, subCat5) =>
                                                                                                                                    subSum +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                    ),
                                                                                                                                0
                                                                                                                            )
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                    )
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td></td>


                                                                                                        </tr>


                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                        {openSubCategory4Id === subCategory4.id &&
                                                                                                            subCategory4.item_details &&
                                                                                                            subCategory4.item_details.map((item, itemIdx) => (
                                                                                                                <tr key={item.id} className="labour">

                                                                                                                    <td></td>
                                                                                                                    <td>
                                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                                    </td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item.type}</td>
                                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                                    {/* Add other columns as needed */}
                                                                                                                    <td>
                                                                                                                        {item.factor || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.uom || "-"}
                                                                                                                    </td>
                                                                                                                    {/* <td></td> */}
                                                                                                                    <td>
                                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.wastage || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.incl_wastage_qty || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.rate || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.amount || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.cost_per_unit || "0"}

                                                                                                                    </td>








                                                                                                                </tr>
                                                                                                            ))
                                                                                                        }

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
                                                                                                                            <td>{
                                                                                                                                subCategory5.name
                                                                                                                            }</td>
                                                                                                                            <td>

                                                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.qty || "-"}
                                                                                                                            </td>
                                                                                                                            <td></td>
                                                                                                                            <td></td>
                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                {
                                                                                                                                    subCategory5.item_details
                                                                                                                                        ? subCategory5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                }
                                                                                                                            </td>
                                                                                                                            <td></td>


                                                                                                                        </tr>


                                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                                        {openSubCategory5Id === subCategory5.id &&
                                                                                                                            subCategory5.item_details &&
                                                                                                                            subCategory5.item_details.map((item, itemIdx) => (
                                                                                                                                <tr key={item.id} className="labour">
                                                                                                                                    <td></td>
                                                                                                                                    <td>
                                                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                                                    </td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td>{item.type}</td>
                                                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                                                    {/* Add other columns as needed */}
                                                                                                                                    <td>
                                                                                                                                        {item.factor || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.uom || "-"}
                                                                                                                                    </td>
                                                                                                                                    {/* <td></td> */}
                                                                                                                                    <td>
                                                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.wastage || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.incl_wastage_qty || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.rate || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.amount || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.cost_per_unit || "0"}

                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            ))
                                                                                                                        }



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
                        )}
                        {/* ______________________________________________________________________________________________________ */}

                        {budgetType === "non_wbs" && (
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
                                                    <th className="text-start">Expand</th>
                                                    <th className="text-start">Sr No.</th>
                                                    <th className="text-start" style={{ width: "250px" }}>Level</th>
                                                    <th className="text-start">Category</th>
                                                    <th className="text-start">Location</th>
                                                    <th className="text-start">Type</th>
                                                    <th className="text-start">Items</th>
                                                    {/* <th className="text-start">Factor</th> */}
                                                    <th className="text-start" style={{ width: "200px" }}>UOM</th>
                                                    {/* <th className="text-start">Area</th> */}
                                                    <th className="text-start">QTY Excl Wastage</th>
                                                    {/* <th className="text-start">Wastage</th> */}
                                                    {/* <th className="text-start">QTY incl Waste</th> */}
                                                    <th className="text-start">Rate</th>
                                                    <th className="text-start">Amount</th>
                                                    {/* <th className="text-start">Cost Per Unit</th> */}

                                                </tr>
                                                <tr>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    <th className="text-start"></th>
                                                    {/* <th className="text-start">A</th> */}
                                                    <th className="text-start">A</th>
                                                    {/* <th className="text-start"></th> */}
                                                    <th className="text-start">B</th>
                                                    {/* <th className="text-start">D</th> */}
                                                    {/* <th className="text-start">E=C+C*D</th> */}
                                                    <th className="text-start">C</th>
                                                    <th className="text-start">D=B*C</th>
                                                    {/* <th className="text-start">H=G/C</th> */}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Conditional rendering for categories under sub-project start */}
                                                {subProjectDetails &&
                                                    subProjectDetails.categories &&
                                                    subProjectDetails.categories.map((category, catIdx) => (
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
                                                                <td>{category.name}</td>
                                                                <td>
                                                                    {category.estimation_item.location || "-"}

                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    {category?.estimation_item.name || "-"}

                                                                </td>

                                                                <td>
                                                                    {category.estimation_item.uom || "-"}

                                                                </td>
                                                                {/* <td></td> */}
                                                                <td>
                                                                    {category.estimation_item.qty || "-"}

                                                                </td>

                                                                <td></td>
                                                                <td>
                                                                    {
                                                                        (
                                                                            // Sum direct material_type_details amounts for main category
                                                                            (category.item_details
                                                                                ? category.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                            (subCat2.item_details
                                                                                                ? subCat2.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                            (subCat3.item_details
                                                                                                                ? subCat3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                            (subCat4.item_details
                                                                                                                                ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                : 0
                                                                                                                            )
                                                                                                                            +
                                                                                                                            // Sum all sub-category 5 material_type_details for level 4
                                                                                                                            (subCat4.sub_categories_5
                                                                                                                                ? subCat4.sub_categories_5.reduce(
                                                                                                                                    (subSum5, subCat5) =>
                                                                                                                                        subSum5 +
                                                                                                                                        (subCat5.item_details
                                                                                                                                            ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                {/* <td></td> */}


                                                            </tr>


                                                            {openCategoryId === category.id &&
                                                                category.item_details &&
                                                                category.item_details.map((item, itemIdx) => (
                                                                    <tr key={item.id} className="labour">
                                                                        <td></td>
                                                                        <td>
                                                                            {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                        </td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td>{item.type}</td>
                                                                        <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                        {/* Add other columns as needed */}
                                                                        {/* <td>
                                                                        {item.factor || "0"}

                                                                    </td> */}
                                                                        <td>
                                                                            {item.uom || "-"}
                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        <td>
                                                                            {item.excl_wastage_qty || "0"}

                                                                        </td>
                                                                        {/* <td>
                                                                        {item.wastage || "0"}

                                                                    </td>
                                                                    <td>
                                                                        {item.incl_wastage_qty || "0"}

                                                                    </td> */}
                                                                        <td>
                                                                            {item.rate || "0"}

                                                                        </td>
                                                                        <td>
                                                                            {item.amount || "0"}

                                                                        </td>
                                                                        {/* <td>
                                                                        {item.cost_per_unit || "0"}

                                                                    </td> */}

                                                                    </tr>
                                                                ))
                                                            }

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
                                                                            <td>{subCategory.name}</td>
                                                                            <td>
                                                                                {subCategory.estimation_item.location || "-"}

                                                                            </td>

                                                                            <td>

                                                                            </td>
                                                                            <td>

                                                                                {subCategory.estimation_item.name || "-"}
                                                                            </td>
                                                                            {/* <td></td> */}
                                                                            <td>
                                                                                {subCategory.estimation_item.uom || "-"}
                                                                            </td>
                                                                            <td>
                                                                                {subCategory.estimation_item.qty || "-"}

                                                                            </td>
                                                                            <td>

                                                                            </td>
                                                                            {/* <td></td> */}
                                                                            {/* <td></td> */}
                                                                            <td>
                                                                                {
                                                                                    (
                                                                                        // Sum direct material_type_details amounts for level 2
                                                                                        (subCategory.item_details
                                                                                            ? subCategory.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                        (subCat3.item_details
                                                                                                            ? subCat3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.item_details
                                                                                                                            ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                            {/* <td></td> */}


                                                                        </tr>

                                                                        {/* Render material_type_details rows for sub-category 2 */}
                                                                        {openSubCategory2Id === subCategory.id &&
                                                                            subCategory.item_details &&
                                                                            subCategory.item_details.map((item, itemIdx) => (
                                                                                <tr key={item.id} className="labour">
                                                                                    <td></td>
                                                                                    <td>
                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>{item.type}</td>
                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                    {/* Add other columns as needed */}
                                                                                    {/* <td>
                                                                                    {item.factor || "0"}

                                                                                </td> */}
                                                                                    <td>
                                                                                        {item.uom || "-"}
                                                                                    </td>
                                                                                    {/* <td></td> */}
                                                                                    <td>
                                                                                        {item.excl_wastage_qty || "0"}

                                                                                    </td>
                                                                                    {/* <td>
                                                                                    {item.wastage || "0"}

                                                                                </td> */}
                                                                                    {/* <td>
                                                                                    {item.incl_wastage_qty || "0"}

                                                                                </td> */}
                                                                                    <td>
                                                                                        {item.rate || "0"}

                                                                                    </td>
                                                                                    <td>
                                                                                        {item.amount || "0"}

                                                                                    </td>
                                                                                    {/* <td>
                                                                                    {item.cost_per_unit || "0"}

                                                                                </td> */}

                                                                                </tr>
                                                                            ))
                                                                        }
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
                                                                                            <td>{subCategory3.name}</td>
                                                                                            <td>
                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>
                                                                                            <td>

                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                            </td>


                                                                                            <td>
                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                            </td>
                                                                                            <td>
                                                                                                {subCategory.estimation_item.qty || "-"}

                                                                                            </td>
                                                                                            {/* <td></td>
                                                                                        <td></td> */}
                                                                                            <td></td>
                                                                                            <td>
                                                                                                {
                                                                                                    (
                                                                                                        // Sum direct material_type_details amounts for level 3
                                                                                                        (subCategory3.item_details
                                                                                                            ? subCategory3.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.item_details
                                                                                                                            ? subCat4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                            {/* <td></td> */}

                                                                                        </tr>

                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                        {openSubCategory3Id === subCategory3.id &&
                                                                                            subCategory3.item_details &&
                                                                                            subCategory3.item_details.map((item, itemIdx) => (
                                                                                                <tr key={item.id} className="labour">
                                                                                                    <td></td>
                                                                                                    <td>
                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                    </td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td>{item.type}</td>
                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                    {/* Add other columns as needed */}
                                                                                                    {/* <td>
                                                                                                    {item.factor || "0"}

                                                                                                </td> */}
                                                                                                    <td>
                                                                                                        {item.uom || "-"}
                                                                                                    </td>
                                                                                                    {/* <td></td> */}
                                                                                                    <td>
                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                    </td>
                                                                                                    {/* <td>
                                                                                                    {item.wastage || "0"}

                                                                                                </td>
                                                                                                <td>
                                                                                                    {item.incl_wastage_qty || "0"}

                                                                                                </td> */}
                                                                                                    <td>
                                                                                                        {item.rate || "0"}

                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {item.amount || "0"}

                                                                                                    </td>
                                                                                                    {/* <td>
                                                                                                    {item.cost_per_unit || "0"}

                                                                                                </td> */}

                                                                                                </tr>
                                                                                            ))
                                                                                        }


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
                                                                                                            <td>{subCategory4.name}</td>
                                                                                                            <td>
                                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>

                                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                                            </td>
                                                                                                            {/* <td>

                                                                                                        </td> */}
                                                                                                            <td>
                                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {subCategory.estimation_item.qty || "-"}
                                                                                                            </td>
                                                                                                            {/* <td></td>
                                                                                                        <td></td> */}
                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    (
                                                                                                                        // Sum direct material_type_details amounts for level 4
                                                                                                                        (subCategory4.item_details
                                                                                                                            ? subCategory4.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                        (subCategory4.sub_categories_5
                                                                                                                            ? subCategory4.sub_categories_5.reduce(
                                                                                                                                (subSum, subCat5) =>
                                                                                                                                    subSum +
                                                                                                                                    (subCat5.item_details
                                                                                                                                        ? subCat5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                    ),
                                                                                                                                0
                                                                                                                            )
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                    )
                                                                                                                }
                                                                                                            </td>
                                                                                                            {/* <td></td> */}


                                                                                                        </tr>


                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                        {openSubCategory4Id === subCategory4.id &&
                                                                                                            subCategory4.item_details &&
                                                                                                            subCategory4.item_details.map((item, itemIdx) => (
                                                                                                                <tr key={item.id} className="labour">

                                                                                                                    <td></td>
                                                                                                                    <td>
                                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                                    </td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item.type}</td>
                                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                                    {/* Add other columns as needed */}
                                                                                                                    {/* <td>
                                                                                                                    {item.factor || "0"}

                                                                                                                </td> */}
                                                                                                                    <td>
                                                                                                                        {item.uom || "-"}
                                                                                                                    </td>
                                                                                                                    {/* <td></td> */}
                                                                                                                    <td>
                                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                                    </td>
                                                                                                                    {/* <td>
                                                                                                                    {item.wastage || "0"}

                                                                                                                </td>
                                                                                                                <td>
                                                                                                                    {item.incl_wastage_qty || "0"}

                                                                                                                </td> */}
                                                                                                                    <td>
                                                                                                                        {item.rate || "0"}

                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {item.amount || "0"}

                                                                                                                    </td>
                                                                                                                    {/* <td>
                                                                                                                    {item.cost_per_unit || "0"}

                                                                                                                </td> */}


                                                                                                                </tr>
                                                                                                            ))
                                                                                                        }

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
                                                                                                                            <td>{
                                                                                                                                subCategory5.name
                                                                                                                            }</td>
                                                                                                                            <td>

                                                                                                                                {subCategory3.estimation_item.location || "-"}
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.name || "-"}
                                                                                                                            </td>

                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.uom || "-"}
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {subCategory.estimation_item.qty || "-"}
                                                                                                                            </td>

                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                {
                                                                                                                                    subCategory5.item_details
                                                                                                                                        ? subCategory5.item_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                }
                                                                                                                            </td>
                                                                                                                            {/* <td></td> */}


                                                                                                                        </tr>


                                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                                        {openSubCategory5Id === subCategory5.id &&
                                                                                                                            subCategory5.item_details &&
                                                                                                                            subCategory5.item_details.map((item, itemIdx) => (
                                                                                                                                <tr key={item.id} className="labour">
                                                                                                                                    <td></td>
                                                                                                                                    <td>
                                                                                                                                        {/* {catIdx + 1}.{itemIdx + 1} */}
                                                                                                                                    </td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td>{item.type}</td>
                                                                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                                                                    {/* Add other columns as needed */}
                                                                                                                                    {/* <td>
                                                                                                                                    {item.factor || "0"}

                                                                                                                                </td> */}
                                                                                                                                    <td>
                                                                                                                                        {item.uom || "-"}
                                                                                                                                    </td>
                                                                                                                                    {/* <td></td> */}
                                                                                                                                    <td>
                                                                                                                                        {item.excl_wastage_qty || "0"}

                                                                                                                                    </td>
                                                                                                                                    {/* <td>
                                                                                                                                    {item.wastage || "0"}

                                                                                                                                </td>
                                                                                                                                <td>
                                                                                                                                    {item.incl_wastage_qty || "0"}

                                                                                                                                </td> */}
                                                                                                                                    <td>
                                                                                                                                        {item.rate || "0"}

                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {item.amount || "0"}

                                                                                                                                    </td>
                                                                                                                                    {/* <td>
                                                                                                                                    {item.cost_per_unit || "0"}

                                                                                                                                </td> */}
                                                                                                                                </tr>
                                                                                                                            ))
                                                                                                                        }



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
                        )}



                        {/* <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Save</button>
                            <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Export</button>
                        </div> */}


                        <div className="row  mx-3 ">
                            <div className="col-md-12 ">
                                <div className="form-group">
                                    <label>Remark</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter ..."
                                        defaultValue={""}
                                        value={remark}
                                        onChange={handleRemarkChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4 justify-content-end align-items-center mx-2 mb-5">
                            <div className="col-md-3">
                                <div className="form-group d-flex gap-3 align-items-center mx-3">
                                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                                        Status
                                    </label>

                                    <SingleSelector
                                        options={statusOptions}
                                        // options={filteredOptions}
                                        onChange={handleStatusChange}
                                        // options.find(option => option.value === status)
                                        // value={filteredOptions.find(option => option.value === status)}
                                        value={statusOptions.find(option => option.value === status.toLowerCase())}
                                        // value={selectedSite}
                                        placeholder={`Select Status`} // Dynamic placeholder
                                        // isDisabled={boqDetails.disabled}
                                        classNamePrefix="react-select"
                                    />
                                    {console.log("status", status)}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row mt-5 mb-5 justify-content-center">
                        <div className="col-md-2">
                            <button className="purple-btn2 w-100 mt-2" > Submit</button>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="purple-btn1 w-100"
                                onClick={() => navigate("/estimation-creation-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414")}
                            // onClick={closeAdvanceNoteModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default EstimationCreationDetails;
