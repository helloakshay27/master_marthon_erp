import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import axios from "axios";

import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import ExpandableTable from "../components/ExpandableTable";

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
import { auditLogColumns, auditLogData } from "../constant/data";
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import calculateBudget from "../utils/calculateBudget";
import calculateOrderValues from "../utils/calculateOrderValues";

const EstimationDetailsSubProject = () => {
  const [settingShow, setSettingShow] = useState(false);
  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);

  const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const myArray = [
    "Sr.no	",
    "Category level",
    "WBS Code",
    "Type",
    "Category",
    "Budget",
    "Order Draft Value (WO/PO)",
    "Order Submit Value (WO/PO)",
    "Order Approved Value (WO/PO)",
    "Miscellaneous Expenses Certified",
    "Miscellaneous Expenses Paid",
    "Balance Budget",
    "% Balance",
    "Debit Note WO/PO",
    "Abstract & GRN Total Value",
    "Abstract & GRN Certified",
    "Material Issued",
    "Material Consumed",
    "Stock at Site (Inventory)",
    "Abstract & GRN - Pending",
    "% Completion",
    "Total Bills Value (WO/PO)",
    "Total Bills Paid Value (WO/PO)",
    "Bill Balance Value",
    "Total Advance Paid (WO/PO)",
    "Total Advance Adjusted (WO/PO)",
    "Total Outstanding Advance (WO/PO)",
    "Balance yet to be Paid",
  ];

  const { id } = useParams();
  const [subProjectDetails, setSubProjectDetails] = useState(null);
  console.log("sub detail:", subProjectDetails);

  // const [subProjectDetails, setSubProjectDetails] = useState(
  //     {
  //         "rera_area": "",
  //         "construction_area": "",
  //         "saleble_area": "",
  //         "project_budget": "",
  //         "material_labour_budget": "",
  //         "material_total": "",
  //         "labour_total": "",
  //         "categories": [
  //             {
  //                 "id": 36,
  //                 "name": "CIVIL WORK",
  //                 "budget": "",
  //                 "material_type_details": [],
  //                 "sub_categories_2": [
  //                     {
  //                         "id": 31,
  //                         "name": "Super structure",
  //                         "budget": "",
  //                         "material_type_details": [
  //                             {
  //                                 "id": 69,
  //                                 "name": "CONCRETE",
  //                                 "budget": 785.2099990844727
  //                             },
  //                             {
  //                                 "id": 70,
  //                                 "name": "STEEL-TMT",
  //                                 "budget": 1.0
  //                             },
  //                             {
  //                                 "id": 72,
  //                                 "name": "COVER BLOCK",
  //                                 "budget": 367.510009765625
  //                             }
  //                         ],
  //                         "sub_categories_3": []
  //                     }
  //                 ]
  //             },
  //             {
  //                 "id": 37,
  //                 "name": "FINISHING",
  //                 "budget": "",
  //                 "material_type_details": [],
  //                 "sub_categories_2": [
  //                     {
  //                         "id": 32,
  //                         "name": "FLAT FINISHING ",
  //                         "budget": "",
  //                         "material_type_details": [
  //                             {
  //                                 "id": 69,
  //                                 "name": "CONCRETE",
  //                                 "budget": 785.2099990844727
  //                             },
  //                             {
  //                                 "id": 70,
  //                                 "name": "STEEL-TMT",
  //                                 "budget": 1.0
  //                             },
  //                             {
  //                                 "id": 72,
  //                                 "name": "COVER BLOCK",
  //                                 "budget": 367.510009765625
  //                             }
  //                         ],
  //                         "sub_categories_3": [
  //                             {
  //                                 "id": 33,
  //                                 "name": "Tiling FF",
  //                                 "budget": "",
  //                                 "material_type_details": [
  //                                     {
  //                                         "id": 63,
  //                                         "name": "DOOR WORK",
  //                                         "budget": 89.77999877929688
  //                                     },
  //                                     {
  //                                         "id": 64,
  //                                         "name": "CEMENT",
  //                                         "budget": 59.0
  //                                     },
  //                                     {
  //                                         "id": 66,
  //                                         "name": "SAND",
  //                                         "budget": 185.0
  //                                     },
  //                                     {
  //                                         "id": 67,
  //                                         "name": "ADHESIVE",
  //                                         "budget": 278.489990234375
  //                                     },
  //                                     {
  //                                         "id": 75,
  //                                         "name": "TILES",
  //                                         "budget": 2355.760009765625
  //                                     },
  //                                     {
  //                                         "id": 78,
  //                                         "name": "STONE",
  //                                         "budget": 1516.219970703125
  //                                     }
  //                                 ],
  //                                 "sub_categories_4": []
  //                             },
  //                             {
  //                                 "id": 44,
  //                                 "name": "Water Proofing FF",
  //                                 "budget": "",
  //                                 "material_type_details": [
  //                                     {
  //                                         "id": 63,
  //                                         "name": "DOOR WORK",
  //                                         "budget": 89.77999877929688
  //                                     },
  //                                     {
  //                                         "id": 64,
  //                                         "name": "CEMENT",
  //                                         "budget": 59.0
  //                                     },
  //                                     {
  //                                         "id": 66,
  //                                         "name": "SAND",
  //                                         "budget": 185.0
  //                                     },
  //                                     {
  //                                         "id": 67,
  //                                         "name": "ADHESIVE",
  //                                         "budget": 278.489990234375
  //                                     },
  //                                     {
  //                                         "id": 75,
  //                                         "name": "TILES",
  //                                         "budget": 2355.760009765625
  //                                     },
  //                                     {
  //                                         "id": 78,
  //                                         "name": "STONE",
  //                                         "budget": 1516.219970703125
  //                                     }
  //                                 ],
  //                                 "sub_categories_4": []
  //                             },
  //                             {
  //                                 "id": 50,
  //                                 "name": "Door - Flats",
  //                                 "budget": "",
  //                                 "material_type_details": [
  //                                     {
  //                                         "id": 63,
  //                                         "name": "DOOR WORK",
  //                                         "budget": 89.77999877929688
  //                                     },
  //                                     {
  //                                         "id": 64,
  //                                         "name": "CEMENT",
  //                                         "budget": 59.0
  //                                     },
  //                                     {
  //                                         "id": 66,
  //                                         "name": "SAND",
  //                                         "budget": 185.0
  //                                     },
  //                                     {
  //                                         "id": 67,
  //                                         "name": "ADHESIVE",
  //                                         "budget": 278.489990234375
  //                                     },
  //                                     {
  //                                         "id": 75,
  //                                         "name": "TILES",
  //                                         "budget": 2355.760009765625
  //                                     },
  //                                     {
  //                                         "id": 78,
  //                                         "name": "STONE",
  //                                         "budget": 1516.219970703125
  //                                     }
  //                                 ],
  //                                 "sub_categories_4": []
  //                             }
  //                         ]
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // );
  console.log("id sub:", id);

  useEffect(() => {
    // Fetch project details from API based on projectId
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `${baseURL}estimation_details.json?object_id=${id}&object_type=site&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        const data = await response.json();
        data?.categories?.forEach((category) => {
          calculateBudget(category);
          calculateOrderValues(category);
        });
        setSubProjectDetails(data);
        console.log("data sub prj:", data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // estimation list table
  // const [openProjectId, setOpenProjectId] = useState(null);
  // const [openSubProjectId, setOpenSubProjectId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null); // Track which category is open
  const [openSubCategory2Id, setOpenSubCategory2Id] = useState(null); // Track sub-category 2 visibility
  const [openSubCategory3Id, setOpenSubCategory3Id] = useState(null); // Track sub-category 3 visibility
  const [openSubCategory4Id, setOpenSubCategory4Id] = useState(null); // Track sub-category 3 visibility
  const [openSubCategory5Id, setOpenSubCategory5Id] = useState(null); // Track sub-category 3 visibility

  const [openBoqDetailId, setOpenBoqDetailId] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId1, setOpenBoqDetailId1] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId2, setOpenBoqDetailId2] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId3, setOpenBoqDetailId3] = useState(null); // Track BOQ details visibility

  // Toggle project visibility
  // const toggleProject = (id) => {
  //   if (openProjectId === id) {
  //     setOpenProjectId(null);  // Close the project if it's already open
  //   } else {
  //     setOpenProjectId(id);  // Open the selected project
  //   }
  // };

  // // Toggle sub-project visibility
  // const toggleSubProject = (id) => {
  //   if (openSubProjectId === id) {
  //     setOpenSubProjectId(null);  // Close the sub-project if it's already open
  //   } else {
  //     setOpenSubProjectId(id);  // Open the selected sub-project
  //   }
  // };

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

  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for handling errors
  // Loading, error, and data display logic
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // return <div>{error}</div>;
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            <a href="">Home &gt; Engineering &gt; Estimation &gt; Budget</a>
          </a>
          <div className="card mt-3 pb-3">
            <CollapsibleCard title="Sub-Project Details">
              <div className="card-body mt-0 pt-0">
                <div className="row align-items-center">
                  {[
                    {
                      label: "RERA Area",
                      placeholder: "",
                      value: subProjectDetails?.rera_area || "",
                    },
                    {
                      label: "Construction Area",
                      placeholder: "",
                      className: "",
                      value: subProjectDetails?.construction_area || "",
                    },
                    {
                      label: "Saleable Area Sq.ft.",
                      placeholder: "",
                      value: subProjectDetails?.saleble_area || "",
                    },
                    {
                      label: "Material Total",
                      placeholder: "",
                      value: subProjectDetails?.material_total || "",
                    },
                    {
                      label: "Project Budget",
                      placeholder: "",
                      value: subProjectDetails?.project_budget || "",
                    },
                    {
                      label: "M+L Budget Sq.ft",
                      placeholder: "",
                      className: "mt-2",
                      value: subProjectDetails?.material_labour_budget || "",
                    },
                    {
                      label: "Budget Type",
                      placeholder: "",
                      className: "mt-2",
                      value: "",
                    },
                    {
                      label: "Labour Total",
                      placeholder: "",
                      value: subProjectDetails?.labour_total || "",
                    },
                  ].map((field, index) => (
                    <div
                      className={`col-md-3 ${field.className || ""}`}
                      key={index}
                    >
                      <div className="form-group">
                        <label>{field.label}</label>
                        <input
                          disabled
                          className={
                            field.label === "Construction Area"
                              ? "construction-css form-control"
                              : "form-control"
                          }
                          type="text"
                          placeholder={field.placeholder}
                          value={field.value}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row mt-2">
                  <div className="col-md-4 my-2">
                    <h6
                      style={{
                        textDecoration: "underline",
                        color: "var(--red)",
                        fontWeight: 600,
                      }}
                    >
                      Previous
                    </h6>
                  </div>
                  <div className="col-md-4"></div>
                  <div className="col-md-4 my-2">
                    <h6
                      style={{
                        textDecoration: "underline",
                        color: "var(--red)",
                        fontWeight: 600,
                      }}
                    >
                      Current
                    </h6>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Sub-Project M+L Budget</label>
                      <input
                        disabled
                        class="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="pi363i"
                        value="INR 250000000.00"
                      />
                    </div>
                  </div>
                  <div class="col-md-4"></div>

                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Sub-Project M+L Budget</label>
                      <input
                        disabled
                        class="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="pi363i"
                      />
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Sub-Project Budget Balance</label>
                      <input
                        disabled
                        class="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="pi363i"
                      />
                    </div>
                  </div>
                  <div class="col-md-4"></div>

                  <div class="col-md-4">
                    <div class="form-group">
                      <label>Sub-Project Budget Balance</label>
                      <input
                        disabled
                        class="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="pi363i"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleCard>
            <div className="d-flex justify-content-between mx-3">
              <div class="legend-container d-flex justify-content-start align-items-center px-4 my-3">
                <span
                  className="reference-label me-4"
                  style={{ fontWeight: "bold" }}
                >
                  Legend
                </span>

                <span className="reference-label main-category">
                  Main Category
                </span>

                <span className="reference-label category-lvl2">
                  Category lvl 2
                </span>

                <span className="reference-label sub-category-lvl3">
                  Sub-category lvl 3
                </span>

                <span className="reference-label sub-category-lvl4">
                  Sub-category lvl 4
                </span>

                <span className="reference-label sub-category-lvl5">
                  Sub-category lvl 5
                </span>

                <span className="reference-label labour">
                  Material/Labour Sub
                </span>
                <span className="reference-label Over-Budget">Over Budget</span>
              </div>
              <div>
                {/* <div>
                  <button class="btn">
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
                  </button>
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

                  <button
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
                      <path
                        fill="#f7f7f7"
                        d="M200 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                      />
                    </svg>
                    Copy Budget
                  </button>
                </div> */}
              </div>
            </div>

            <div className="mx-3">
              {/* <ExpandableTable /> */}

              <div className="mx-3">
                <div className="tbl-container mt-1">
                  <table
                    className=""
                    style={{
                      width: "max-content",
                      maxHeight: "max-content",
                      height: "auto",
                    }}
                  >
                    <thead style={{ zIndex: "111 " }}>
                      <tr>
                        <th className="text-center" colSpan={7}>
                          BUDGET
                        </th>
                        <th className="text-center" colSpan={3}>
                          Amount Contracted
                        </th>
                        <th className="text-center" colSpan={2}>
                          Miscellaneous Expenses
                        </th>
                        <th className="text-center" colSpan={2}>
                          Budget Balance
                        </th>
                        <th className="text-center" colSpan={2}>
                          Overdue Balance
                        </th>
                        <th className="text-center" colSpan={1}>
                          Debit
                        </th>
                        <th className="text-center" colSpan={7}>
                          Abstract & GRN
                        </th>
                        <th className="text-center" colSpan={3}>
                          BILL Certified
                        </th>
                        <th className="text-center" colSpan={3}>
                          Advance Details
                        </th>
                        <th className="text-center">Balance</th>
                      </tr>

                      <tr>
                        <th className="text-start">Expand</th>
                        <th className="text-start">Sr.no</th>
                        <th className="text-start">Category level</th>
                        <th className="text-start">WBS Code</th>
                        <th className="text-start">Type</th>
                        <th className="text-start">Category</th>
                        <th className="text-start">Budget</th>
                        <th className="text-start">
                          Order Draft Value (WO/PO)
                        </th>
                        <th className="text-start">
                          Order Submit Value (WO/PO)
                        </th>
                        <th className="text-start">
                          Order Approved Value (WO/PO)
                        </th>
                        <th className="text-start">
                          Miscellaneous Expenses Certified
                        </th>
                        <th className="text-start">
                          Miscellaneous Expenses Paid
                        </th>
                        <th className="text-start">Balance Budget</th>
                        <th className="text-start">% Balance</th>
                        <th className="text-start">Balance Overdue</th>
                        <th className="text-start">% Overdue</th>
                        <th className="text-start">Debit Note WO/PO</th>
                        <th className="text-start">
                          Abstract & GRN Total Value
                        </th>
                        <th className="text-start">Abstract & GRN Certified</th>
                        <th className="text-start">Material Issued</th>
                        <th className="text-start">Material Consumed</th>
                        <th className="text-start">
                          Stock at Site (Inventory)
                        </th>
                        <th className="text-start">Abstract & GRN - Pending</th>
                        <th className="text-start">% Completion</th>
                        <th className="text-start">
                          Total Bills Value (WO/PO)
                        </th>
                        <th className="text-start">
                          Total Bills Paid Value (WO/PO)
                        </th>
                        <th className="text-start">Bill Balance Value</th>
                        <th className="text-start">
                          Total Advance Paid (WO/PO)
                        </th>
                        <th className="text-start">
                          Total Advance Adjusted (WO/PO)
                        </th>
                        <th className="text-start">
                          Total Outstanding Advance (WO/PO)
                        </th>
                        <th className="text-start">Balance yet to be Paid</th>
                      </tr>
                      <tr>
                        <th className="text-center" colSpan={6}>
                          References
                        </th>
                        <th className="text-center">A</th>
                        <th className="text-center">B</th>
                        <th className="text-center">C</th>
                        <th className="text-center">D</th>
                        <th className="text-center">E</th>
                        <th className="text-center">F</th>
                        <th className="text-center">G = A-B-E</th>
                        <th className="text-center">H</th>
                        <th className="text-center">G = A-B-E</th>
                        <th className="text-center">H</th>
                        <th className="text-center">I</th>
                        <th className="text-center">J</th>
                        <th className="text-center">K</th>
                        <th className="text-center">L</th>
                        <th className="text-center">M</th>
                        <th className="text-center">N = J-M</th>
                        <th className="text-center">O = J-K</th>
                        <th className="text-center">P = (J-N)/A</th>
                        <th className="text-center">Q</th>
                        <th className="text-center">R</th>
                        <th className="text-center">S = Q-R</th>
                        <th className="text-center">T</th>
                        <th className="text-center">U</th>
                        <th className="text-center">V = T - U</th>
                        <th className="text-center">W = A-Q-T-F</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Conditional rendering for categories under sub-project start */}
                      {subProjectDetails &&
                        subProjectDetails.categories &&
                        subProjectDetails.categories.map((category, index) => (
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
                              <td>{index + 1}</td>
                              <td> Main Category</td>
                              <td></td>
                              <td></td>
                              <td>{category.name}</td>
                              <td>{category.budget}</td>
                              <td>{category.order_draft_value}</td>
                              <td>{category.order_submitted_value}</td>
                              <td>{category.order_approved_value}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>{category.balance_bugdet % 1 !== 0 && category.balance_bugdet !== undefined ? category.balance_bugdet.toFixed(2) : category.balance_bugdet}</td>
                              <td>{category.balance_per % 1 !== 0 && category.balance_per !== undefined ? category.balance_per.toFixed(2) : category.balance_per}</td>
                              <td>{category.overdue_budget % 1 !== 0 && category.overdue_budget !== undefined ? category.overdue_budget.toFixed(2) : category.overdue_budget}</td>
                              <td>{category.overdue_per % 1 !== 0 && category.overdue_per !== undefined ? category.overdue_per.toFixed(2) : category.overdue_per}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                            </tr>

                            {/* sub level 2 start */}
                            {openCategoryId === category.id &&
                              category.sub_categories_2 &&
                              category.sub_categories_2.length > 0 &&
                              category.sub_categories_2.map((subCategory) => (
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
                                    <td></td>
                                    <td>{subCategory.name}</td>
                                    <td>{subCategory.budget}</td>
                                    <td>{subCategory.order_draft_value}</td>
                                    <td>{subCategory.order_submitted_value}</td>
                                    <td>{subCategory.order_approved_value}</td>
                                    <td>-</td>
                                    <td>{subCategory.balance_bugdet % 1 !== 0 && subCategory.balance_bugdet !== undefined ? subCategory.balance_bugdet.toFixed(2) : subCategory.balance_bugdet}</td>
                                    <td>{subCategory.balance_per % 1 !== 0 && subCategory.balance_per !== undefined ? subCategory.balance_per.toFixed(2) : subCategory.balance_per}</td>
                                    <td>{subCategory.overdue_budget % 1 !== 0 && subCategory.overdue_budget !== undefined ? subCategory.overdue_budget.toFixed(2) : subCategory.overdue_budget}</td>
                                    <td>{subCategory.overdue_per % 1 !== 0 && subCategory.overdue_per !== undefined ? subCategory.overdue_per.toFixed(2) : subCategory.overdue_per}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                  </tr>

                                  {openSubCategory2Id === subCategory.id &&
                                    subCategory.material_type_details &&
                                    subCategory.material_type_details.map(
                                      (boqDetail2) => (
                                        <React.Fragment key={boqDetail2.id}>
                                          <tr className="labour">
                                            <td>
                                              <button
                                                className="btn btn-link p-0"
                                                onClick={() =>
                                                  toggleBoqDetail(boqDetail2.id)
                                                }
                                                aria-label="Toggle BOQ detail visibility"
                                              ></button>
                                            </td>

                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{boqDetail2.name}</td>
                                            <td>{boqDetail2.budget}</td>
                                            {console.log(
                                              "boqDetail2",
                                              boqDetail2
                                            )}
                                            <td>
                                              {boqDetail2.order_draft_value}
                                            </td>
                                            <td>
                                              {boqDetail2.order_submitted_value}
                                            </td>
                                            <td>
                                              {boqDetail2.order_approved_value}
                                            </td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>{boqDetail2.balance_bugdet % 1 !== 0 && boqDetail2.balance_bugdet !== undefined ? boqDetail2.balance_bugdet.toFixed(2) : boqDetail2.balance_bugdet}</td>
                                            <td>{boqDetail2.balance_per % 1 !== 0 && boqDetail2.balance_per !== undefined ? boqDetail2.balance_per.toFixed(2) : boqDetail2.balance_per}</td>
                                            <td>{boqDetail2.overdue_budget% 1 !== 0 && boqDetail2.overdue_budget !== undefined ? boqDetail2.overdue_budget.toFixed(2) : boqDetail2.overdue_budget}</td>
                                            <td>{boqDetail2.overdue_per% 1 !== 0 && boqDetail2.overdue_per !== undefined ? boqDetail2.overdue_per.toFixed(2) : boqDetail2.overdue_per}</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                          </tr>
                                        </React.Fragment>
                                      )
                                    )}

                                  {/* ................. */}

                                  {/* Render Sub-Category 3 for each Sub-Category 2 */}
                                  {openSubCategory2Id === subCategory.id &&
                                    subCategory.sub_categories_3 &&
                                    subCategory.sub_categories_3.length > 0 &&
                                    subCategory.sub_categories_3.map(
                                      (subCategory3) => (
                                        <React.Fragment key={subCategory3.id}>
                                          <tr className="sub-category-lvl3">
                                            {console.log("sub3", subCategory3)}
                                            {console.log(
                                              "sub4",
                                              subCategory3.sub_categories_4
                                            )}
                                            {console.log(
                                              "sub3id:",
                                              openSubCategory3Id
                                            )}
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
                                            <td></td>
                                            <td>{subCategory3.name}</td>
                                            <td>{subCategory3.budget}</td>
                                            <td>
                                              {subCategory3.order_draft_value}
                                            </td>
                                            <td>
                                              {
                                                subCategory3.order_submitted_value
                                              }
                                            </td>
                                            <td>
                                              {
                                                subCategory3.order_approved_value
                                              }
                                            </td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>{subCategory3.balance_bugdet % 1 !== 0 && subCategory3.balance_bugdet !== undefined ? subCategory3.balance_bugdet.toFixed(2) : subCategory3.balance_bugdet}</td>
                                            <td>{subCategory3.balance_per % 1 !== 0 && subCategory3.balance_per !== undefined ? subCategory3.balance_per.toFixed(2) : subCategory3.balance_per}</td>
                                            <td>{subCategory3.overdue_budget % 1 !== 0 && subCategory3.overdue_budget !== undefined ? subCategory3.overdue_budget.toFixed(2) : subCategory3.overdue_budget}</td>
                                            <td>{subCategory3.overdue_per % 1 !== 0 && subCategory3.overdue_per !== undefined ? subCategory3.overdue_per.toFixed(2) : subCategory3.overdue_per}</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                          </tr>

                                          {/* Render BOQ Details for Sub-Category 3 */}
                                          {openSubCategory3Id ===
                                            subCategory3.id &&
                                            subCategory3.material_type_details &&
                                            subCategory3.material_type_details.map(
                                              (boqDetail2) => (
                                                <React.Fragment
                                                  key={boqDetail2.id}
                                                >
                                                  <tr className="labour">
                                                    <td>
                                                      <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                          toggleBoqDetail1(
                                                            boqDetail2.id
                                                          )
                                                        }
                                                        aria-label="Toggle BOQ detail visibility"
                                                      ></button>
                                                    </td>

                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>{boqDetail2.name}</td>
                                                    <td>{boqDetail2.budget}</td>
                                                    <td>
                                                      {
                                                        boqDetail2.order_draft_value
                                                      }
                                                    </td>
                                                    <td>
                                                      {
                                                        boqDetail2.order_submitted_value
                                                      }
                                                    </td>
                                                    <td>
                                                      {
                                                        boqDetail2.order_approved_value
                                                      }
                                                    </td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>{boqDetail2.balance_bugdet % 1 !== 0 && boqDetail2.balance_bugdet !== undefined ? boqDetail2.balance_bugdet.toFixed(2) : boqDetail2.balance_bugdet}</td>
                                                    <td>{boqDetail2.balance_per % 1 !== 0 && boqDetail2.balance_per !== undefined ? boqDetail2.balance_per.toFixed(2) : boqDetail2.balance_per}</td>
                                                    <td>{boqDetail2.overdue_budget% 1 !== 0 && boqDetail2.overdue_budget !== undefined ? boqDetail2.overdue_budget.toFixed(2) : boqDetail2.overdue_budget}</td>
                                                    <td>{boqDetail2.overdue_per% 1 !== 0 && boqDetail2.overdue_per !== undefined ? boqDetail2.overdue_per.toFixed(2) : boqDetail2.overdue_per}</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                  </tr>
                                                </React.Fragment>
                                              )
                                            )}

                                          {/* Render Level 4 for each BOQ level 3 */}
                                          {openSubCategory3Id ===
                                            subCategory3.id &&
                                            subCategory3.sub_categories_4 &&
                                            subCategory3.sub_categories_4
                                              .length > 0 &&
                                            subCategory3.sub_categories_4.map(
                                              (subCategory4) => (
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
                                                    <td></td>
                                                    <td>{subCategory4.name}</td>
                                                    <td>
                                                      {subCategory4.budget}
                                                    </td>
                                                    <td>
                                                      {
                                                        subCategory4.order_draft_value
                                                      }
                                                    </td>
                                                    <td>
                                                      {
                                                        subCategory4.order_submitted_value
                                                      }
                                                    </td>
                                                    <td>
                                                      {
                                                        subCategory4.order_approved_value
                                                      }
                                                    </td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>{subCategory4.balance_bugdet % 1 !== 0 && subCategory4.balance_bugdet !== undefined ? subCategory4.balance_bugdet.toFixed(2) : subCategory4.balance_bugdet}</td>
                                                    <td>{subCategory4.balance_per % 1 !== 0 && subCategory4.balance_per !== undefined ? subCategory4.balance_per.toFixed(2) : subCategory4.balance_per}</td>
                                                    <td>{subCategory4.overdue_budget % 1 !== 0 && subCategory4.overdue_budget !== undefined ? subCategory4.overdue_budget.toFixed(2) : subCategory4.overdue_budget}</td>
                                                    <td>{subCategory4.overdue_per % 1 !== 0 && subCategory4.overdue_per !== undefined ? subCategory4.overdue_per.toFixed(2) : subCategory4.overdue_per}</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                  </tr>

                                                  {/* Render BOQ Details for Sub-Category 4 */}
                                                  {openSubCategory4Id ===
                                                    subCategory4.id &&
                                                    subCategory4.material_type_details &&
                                                    subCategory4.material_type_details.map(
                                                      (boqDetail2) => (
                                                        <React.Fragment
                                                          key={boqDetail2.id}
                                                        >
                                                          <tr className="labour">
                                                            <td>
                                                              <button
                                                                className="btn btn-link p-0"
                                                                onClick={() =>
                                                                  toggleBoqDetail1(
                                                                    boqDetail2.id
                                                                  )
                                                                }
                                                                aria-label="Toggle BOQ detail visibility"
                                                              ></button>
                                                            </td>

                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>
                                                              {boqDetail2.name}
                                                            </td>
                                                            <td>
                                                              {
                                                                boqDetail2.budget
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                boqDetail2.order_draft_value
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                boqDetail2.order_submitted_value
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                boqDetail2.order_approved_value
                                                              }
                                                            </td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>{boqDetail2.balance_bugdet % 1 !== 0 && boqDetail2.balance_bugdet !== undefined ? boqDetail2.balance_bugdet.toFixed(2) : boqDetail2.balance_bugdet}</td>
                                                            <td>{boqDetail2.balance_per % 1 !== 0 && boqDetail2.balance_per !== undefined ? boqDetail2.balance_per.toFixed(2) : boqDetail2.balance_per}</td>
                                                            <td>{boqDetail2.overdue_budget% 1 !== 0 && boqDetail2.overdue_budget !== undefined ? boqDetail2.overdue_budget.toFixed(2) : boqDetail2.overdue_budget}</td>
                                                            <td>{boqDetail2.overdue_per% 1 !== 0 && boqDetail2.overdue_per !== undefined ? boqDetail2.overdue_per.toFixed(2) : boqDetail2.overdue_per}</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                          </tr>
                                                        </React.Fragment>
                                                      )
                                                    )}
                                                  {/*  */}
                                                  {/* Render Level 5 for each BOQ level 4*/}
                                                  {openSubCategory4Id ===
                                                    subCategory4.id &&
                                                    subCategory4.sub_categories_5 &&
                                                    subCategory4
                                                      .sub_categories_5.length >
                                                      0 &&
                                                    subCategory4.sub_categories_5.map(
                                                      (subCategory5) => (
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
                                                              Sub-Category Level
                                                              5
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>
                                                              {
                                                                subCategory5.name
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                subCategory5.budget
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                subCategory5.order_draft_value
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                subCategory5.order_submitted_value
                                                              }
                                                            </td>
                                                            <td>
                                                              {
                                                                subCategory5.order_approved_value
                                                              }
                                                            </td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>{subCategory5.balance_bugdet % 1 !== 0 && subCategory5.balance_bugdet !== undefined ? subCategory5.balance_bugdet.toFixed(2) : subCategory5.balance_bugdet}</td>
                                                            <td>{subCategory5.balance_per % 1 !== 0 && subCategory5.balance_per !== undefined ? subCategory5.balance_per.toFixed(2) : subCategory5.balance_per}</td>
                                                            <td>{subCategory5.overdue_budget % 1 !== 0 && subCategory5.overdue_budget !== undefined ? subCategory5.overdue_budget.toFixed(2) : subCategory5.overdue_budget}</td>
                                                            <td>{subCategory5.overdue_per % 1 !== 0 && subCategory5.overdue_per !== undefined ? subCategory5.overdue_per.toFixed(2) : subCategory5.overdue_per}</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                          </tr>

                                                          {/* Render BOQ Details for Sub-Category 3 */}
                                                          {openSubCategory5Id ===
                                                            subCategory5.id &&
                                                            subCategory5.material_type_details &&
                                                            subCategory5.material_type_details.map(
                                                              (boqDetail2) => (
                                                                <React.Fragment
                                                                  key={
                                                                    boqDetail2.id
                                                                  }
                                                                >
                                                                  <tr className="labour">
                                                                    <td>
                                                                      <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() =>
                                                                          toggleBoqDetail1(
                                                                            boqDetail2.id
                                                                          )
                                                                        }
                                                                        aria-label="Toggle BOQ detail visibility"
                                                                      ></button>
                                                                    </td>

                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td>
                                                                      {
                                                                        boqDetail2.name
                                                                      }
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        boqDetail2.budget
                                                                      }
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        boqDetail2.order_draft_value
                                                                      }
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        boqDetail2.order_submitted_value
                                                                      }
                                                                    </td>
                                                                    <td>
                                                                      {
                                                                        boqDetail2.order_approved_value
                                                                      }
                                                                    </td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>{boqDetail2.balance_bugdet % 1 !== 0 && boqDetail2.balance_bugdet !== undefined ? boqDetail2.balance_bugdet.toFixed(2) : boqDetail2.balance_bugdet}</td>
                                                                    <td>{boqDetail2.balance_per % 1 !== 0 && boqDetail2.balance_per !== undefined ? boqDetail2.balance_per.toFixed(2) : boqDetail2.balance_per}</td>
                                                                    <td>{boqDetail2.overdue_budget% 1 !== 0 && boqDetail2.overdue_budget !== undefined ? boqDetail2.overdue_budget.toFixed(2) : boqDetail2.overdue_budget}</td>
                                                                    <td>{boqDetail2.overdue_per% 1 !== 0 && boqDetail2.overdue_per !== undefined ? boqDetail2.overdue_per.toFixed(2) : boqDetail2.overdue_per}</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                  </tr>
                                                                </React.Fragment>
                                                              )
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

            {/* <div className="d-flex justify-content-end mx-3">
              <button className="purple-btn2">Bulk Upload</button>
              <button className="purple-btn2">Download Template</button>
              <button className="purple-btn2">Print</button>
              <button className="purple-btn2">Download</button>
              <button className="purple-btn2">Import</button>
              <button className="purple-btn2">Modify</button>
            </div> */}
            <div className="row mt-4 px-2">
              <div className="col-md-12">
                <div className="form-group mx-3">
                  <label>Remark</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder=""
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-2">
                <button className="purple-btn2 w-100">Submit</button>
              </div>
            </div>
            <div className="mx-4">
              <h5>Audit Log</h5>
              <div className="">
                <Table columns={auditLogColumns} data={auditLogData} />
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      <LayoutModal
        show={settingShow}
        onHide={handleSettingClose}
        items={myArray}
      />
      <CopyBudgetModal show={show} handleClose={handleClose} />
    </>
  );
};

export default EstimationDetailsSubProject;
