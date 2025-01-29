import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { Link } from "react-router-dom";
import BulkAction from "./common/Card/BulkAction";



const BOQListTable = ({ boqList }) => {

  const [openProjectId, setOpenProjectId] = useState(null);
  const [openSubProjectId, setOpenSubProjectId] = useState(null);
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
  const toggleProject = (id) => {
    if (openProjectId === id) {
      setOpenProjectId(null);  // Close the project if it's already open
    } else {
      setOpenProjectId(id);  // Open the selected project
    }
  };

  // Toggle sub-project visibility
  const toggleSubProject = (id) => {
    if (openSubProjectId === id) {
      setOpenSubProjectId(null);  // Close the sub-project if it's already open
    } else {
      setOpenSubProjectId(id);  // Open the selected sub-project
    }
  };

  // Toggle category visibility
  const toggleCategory = (id) => {
    if (openCategoryId === id) {
      setOpenCategoryId(null);  // Close the category if it's already open
    } else {
      setOpenCategoryId(id);  // Open the selected category
    }
  };

  // Toggle sub-category 2 visibility
  const toggleSubCategory2 = (id) => {


    if (openSubCategory2Id === id) {
      setOpenSubCategory2Id(null);  // Close the category if it's already open
    } else {
      setOpenSubCategory2Id(id);  // Open the selected category
    }
  };


  // Toggle BOQ details visibility
  const toggleBoqDetail = (id) => {

    if (openBoqDetailId === id) {
      setOpenBoqDetailId(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 1 visibility
  const toggleBoqDetail1 = (id) => {

    if (openBoqDetailId1 === id) {
      setOpenBoqDetailId1(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId1(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 2 visibility
  const toggleBoqDetail2 = (id) => {

    if (openBoqDetailId2 === id) {
      setOpenBoqDetailId2(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId2(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 3 visibility
  const toggleBoqDetail3 = (id) => {

    if (openBoqDetailId3 === id) {
      setOpenBoqDetailId3(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId3(id);  // Open the selected category
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
 


  console.log(" list in child", boqList)





  const handleClick = () => {
    setOpenProjectId(null);
    setOpenSubProjectId(null);
    setOpenCategoryId(null);
    setOpenSubCategory2Id(null);
    openSubCategory3Id(null); // Track sub-category 3 visibility
    openSubCategory4Id(null); // Track sub-category 3 visibility
    openSubCategory5Id(null)
    openBoqDetailId(null); // Track BOQ details visibility
    openBoqDetailId1(null); // Track BOQ details visibility
    openBoqDetailId2(null); // Track BOQ details visibility
    openBoqDetailId3(null)

  }

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">


          {/* <BulkAction/> */}
          <div className="m-0 p-0">
          <CollapsibleCard title="Bulk Action">
            <form
            // onSubmit={handleSubmit}
            >
              <div className="row align-items-center">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>From Status</label>
                    <select
                      name="fromStatus"
                      className="form-control form-select"
                    // value={formValues.fromStatus}
                    // onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                    </select>
                    {/* {errors.fromStatus && <div className="text-danger mt-2">{errors.fromStatus}</div>} */}
                  </div>
                  <div className="form-group mt-3">
                    <label>To Status</label>
                    <select
                      name="toStatus"
                      className="form-control form-select"
                    // value={formValues.toStatus}
                    // onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                    </select>
                    {/* {errors.toStatus && <div className="text-danger mt-2">{errors.toStatus}</div>} */}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Remark</label>
                    <textarea
                      name="remark"
                      className="form-control"
                      rows={4}
                      placeholder="Enter ..."
                    // value={formValues.remark}
                    // onChange={handleChange}
                    />
                    {/* {errors.remark && <div className="text-danger mt-2">{errors.remark}</div>} */}
                  </div>
                </div>
                <div className="offset-md-1 col-md-2">
                  <button type="submit" className="purple-btn2 m-0">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </CollapsibleCard>
          </div>

          <div className="d-flex justify-content-start ms-3">
            <button className="purple-btn2" onClick={handleClick}>Collapse All</button>
          </div>
          <div className="mx-3">
            <div className="tbl-container mt-1">
              <table className="w-100">
                <thead>
                  <tr>
                    <th className="text-start"> <input className="ms-1 me-1 mb-1" type="checkbox" /></th>
                    <th className="text-start">Expand</th>
                    <th className="text-start">Project/Sub-Project</th>
                    <th className="text-start">BOQ ID</th>
                    <th className="text-start">Unit</th>
                    <th className="text-start">Cost Qty</th>
                    <th className="text-start">Cost Rate</th>
                    <th className="text-start">Cost Value</th>
                    <th>
                      <div className="d-flex justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
                          fill="currentColor"
                          style={{ marginTop: 3 }}
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                        {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                        <p>Status</p>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boqList && boqList.projects && boqList.projects.map(project => (
                    <React.Fragment key={project.id}>

                      <tr>
                        <td>
                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                        </td>
                        <td>
                          <button
                            className="btn btn-link p-0"
                            // onClick={handleSubProject}
                            onClick={() => toggleProject(project.id)}
                            aria-label="Toggle row visibility"
                          >
                            {openProjectId === project.id ?
                              (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  {/* Square */}
                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                  {/* Minus Icon */}
                                  <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  {/* Square */}
                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                  {/* Plus Icon */}
                                  <line x1="12" y1="8" x2="12" y2="16" />
                                  <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                              )
                            }
                          </button>
                        </td>
                        <td className="text-start">{project.name}</td>
                        <td className="text-start"></td>
                        <td className="text-start"></td>
                        <td className="text-start"></td>
                        <td className="text-start"></td>
                        <td className="text-start"></td>
                        <td className="text-start">
                          <div className="d-flex justify-content-center">
                            {/* <input className="pe-2" type="checkbox" /> */}
                            <img
                              data-bs-toggle="modal"
                              data-bs-target="#addnewModal"
                              className="pe-1"
                              src="../Data_Mapping/img/Edit.svg"
                              alt=""
                            />
                            <img
                              className="pe-1"
                              src="../Data_Mapping/img/Delete_red.svg"
                              alt=""
                            />

                          </div>
                        </td>
                      </tr>
                      {/* subProject  start */}

                      {openProjectId === project.id && project.sub_projects && project.sub_projects.map((subProject) => (
                        <React.Fragment key={subProject.id}>
                          <tr>
                            <td>
                              {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                            </td>

                            <td>
                              <button
                                className="btn btn-link p-0"

                                onClick={() => toggleSubProject(subProject.id)}
                                aria-label="Toggle row visibility"
                              >
                                {openSubProjectId === subProject.id ?
                                  (

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                      {/* Circle */}
                                      <circle cx="12" cy="12" r="9" />
                                      {/* Minus Icon (for when toggled) */}
                                      <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                  ) : (

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                      {/* Circle */}
                                      <circle cx="12" cy="12" r="9" />
                                      {/* Plus Icon */}
                                      <line x1="12" y1="8" x2="12" y2="16" />
                                      <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                  )
                                }
                              </button>
                            </td>
                            <td className="text-start">{subProject.name}</td>
                            <td className="text-start"></td>
                            <td className="text-start"></td>
                            <td className="text-start"></td>
                            <td className="text-start"></td>
                            <td className="text-start"></td>
                            <td className="text-start">
                              <div className="d-flex justify-content-center">
                                {/* <input className="pe-2" type="checkbox" /> */}
                                <img
                                  data-bs-toggle="modal"
                                  data-bs-target="#addnewModal"
                                  className="pe-1"
                                  src="../Data_Mapping/img/Edit.svg"
                                  alt=""
                                />
                                <img
                                  className="pe-1"
                                  src="../Data_Mapping/img/Delete_red.svg"
                                  alt=""
                                />
                              </div>
                            </td>
                            <td></td>

                          </tr>

                          {/* Conditional rendering for categories under sub-project start */}
                          {openSubProjectId === subProject.id && subProject.categories && subProject.categories.length > 0 && (
                            subProject.categories.map((category) => (
                              <React.Fragment key={category.id}>
                                <tr>
                                  <td>
                                    {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                  </td>
                                  <td></td>

                                  <td>
                                    <button
                                      className="btn btn-link p-0"
                                      onClick={() => toggleCategory(category.id)}
                                      aria-label="Toggle category visibility"
                                    >
                                      {openCategoryId === category.id ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="black"
                                          className="bi bi-caret-up"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M3.204 9h9.592L8 4.48 3.204 9z" />

                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="black"
                                          className="bi bi-caret-up"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                        </svg>
                                      )}
                                    </button>
                                    {category.name}
                                  </td>

                                  <td className="text-start"></td>
                                  <td className="text-start"></td>
                                  <td className="text-start"></td>
                                  <td className="text-start"></td>
                                  <td className="text-start"></td>
                                  <td className="text-start">
                                    <div className="d-flex justify-content-center">
                                      {/* <input className="pe-2" type="checkbox" /> */}
                                      <img
                                        data-bs-toggle="modal"
                                        data-bs-target="#addnewModal"
                                        className="pe-1"
                                        src="../Data_Mapping/img/Edit.svg"
                                        alt=""
                                      />
                                      <img
                                        className="pe-1"
                                        src="../Data_Mapping/img/Delete_red.svg"
                                        alt=""
                                      />
                                    </div>
                                  </td>
                                </tr>

                                {/* sub level 2 start */}
                                {openCategoryId === category.id && category.sub_categories_2 && category.sub_categories_2.length > 0 && (
                                  category.sub_categories_2.map((subCategory) => (
                                    <React.Fragment key={subCategory.id}>
                                      <tr>
                                        <td>
                                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                        </td>
                                        <td></td>

                                        <td style={{ paddingLeft: '40px' }}>
                                          <button
                                            className="btn btn-link p-0"
                                            onClick={() => toggleSubCategory2(subCategory.id)}
                                            aria-label="Toggle sub-category 2 visibility"
                                          >
                                            {openSubCategory2Id === subCategory.id ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                              </svg>
                                            ) : (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="black"
                                                className="bi bi-caret-up"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                              </svg>
                                            )}
                                          </button>
                                          {subCategory.name}
                                        </td>

                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start">
                                          <div className="d-flex justify-content-center">
                                            {/* <input className="pe-2" type="checkbox" /> */}
                                            <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                            <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                          </div>
                                        </td>
                                      </tr>


                                      {openSubCategory2Id === subCategory.id && subCategory.boq_details && subCategory.boq_details.length > 0 && (
                                        subCategory.boq_details.map((boqDetail2) => (
                                          <React.Fragment key={boqDetail2.id}>
                                            <tr>
                                              <td>
                                                <input className="ms-1 me-1 mb-1" type="checkbox" />
                                              </td>
                                              <td></td>

                                              <td style={{ paddingLeft: '80px' }}>
                                                <button
                                                  className="btn btn-link p-0"
                                                  onClick={() => toggleBoqDetail(boqDetail2.id)}
                                                  aria-label="Toggle BOQ detail visibility"
                                                >
                                                  {openBoqDetailId === boqDetail2.id ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                      <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                    </svg>
                                                  ) : (
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      fill="black"
                                                      className="bi bi-caret-up"
                                                      viewBox="0 0 16 16"
                                                    >
                                                      <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                    </svg>
                                                  )}
                                                </button>
                                                {boqDetail2.item_name}
                                              </td>

                                              <td className="text-start">

                                                <Link to={`/boq-details-page-master/${boqDetail2.id}`}>
                                                  {boqDetail2.id}
                                                </Link>
                                              </td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start">
                                                <div className="d-flex justify-content-center">
                                                  {/* <input className="pe-2" type="checkbox" /> */}
                                                  <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                  <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                  {boqDetail2.status}
                                                </div>
                                              </td>
                                            </tr>

                                            {/* Render Materials Table for BOQ Detail in Sub-Category  */}
                                            {openBoqDetailId === boqDetail2.id && boqDetail2.materials && boqDetail2.materials.length > 0 && (
                                              <React.Fragment>
                                                <tr>
                                                  <td colSpan={13}>
                                                    <div>
                                                      <CollapsibleCard title="Material Type">
                                                        <div className="card-body mt-0 pt-0">
                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                            <table className="w-100">
                                                              <thead>
                                                                <tr>
                                                                  <th rowSpan={2}>Material Type</th>
                                                                  <th rowSpan={2}>Material</th>
                                                                  <th rowSpan={2}>Material Sub-Type</th>
                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                  <th rowSpan={2}>Colour</th>
                                                                  <th rowSpan={2}>Brand</th>
                                                                  <th rowSpan={2}>UOM</th>
                                                                  {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                  <th colSpan={3}>Cost</th>
                                                                  <th rowSpan={2}>Wastage</th>
                                                                  <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                </tr>
                                                                <tr>
                                                                  <th>Co-Efficient Factor</th>
                                                                  <th colSpan={2}>Estimated Qty</th>
                                                                </tr>
                                                              </thead>
                                                              <tbody>
                                                                {boqDetail2.materials.map((material) => (
                                                                  <tr key={material.id}>
                                                                    <td>{material.material_type}</td>
                                                                    <td>{material.material_name}</td>
                                                                    <td>{material.material_sub_type}</td>
                                                                    <td>{material.generic_info}</td>
                                                                    <td>{material.color}</td>
                                                                    <td>{material.brand}</td>
                                                                    <td>{material.uom}</td>
                                                                    {/* <td>{material.generic_info}</td> */}
                                                                    <td>{material.co_efficient_factor}</td>
                                                                    <td colSpan={2}>{material.estimated_quantity}</td>
                                                                    <td>{material.wastage}</td>
                                                                    <td>{material.estimated_quantity_wastage}</td>
                                                                  </tr>
                                                                ))}
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                        </div>
                                                      </CollapsibleCard>


                                                      <CollapsibleCard title="Asset Type">
                                                        <div className="card-body mt-0 pt-0">
                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                            <table className="w-100">
                                                              <thead>
                                                                <tr>
                                                                  <th rowSpan={2}>Asset Type</th>
                                                                  <th rowSpan={2}>Asset</th>
                                                                  <th rowSpan={2}>Asset Sub-Type</th>
                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                  <th rowSpan={2}>Colour</th>
                                                                  <th rowSpan={2}>Brand</th>
                                                                  <th rowSpan={2}>UOM</th>
                                                                  {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                  <th colSpan={3}>Cost</th>
                                                                  <th rowSpan={2}>Wastage</th>
                                                                  <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                </tr>
                                                                <tr>
                                                                  <th>Co-Efficient Factor</th>
                                                                  <th colSpan={2}>Estimated Qty</th>
                                                                </tr>
                                                              </thead>
                                                              <tbody>
                                                                {boqDetail2.assets.map((asset) => (
                                                                  <tr key={asset.id}>
                                                                    <td>{asset.asset_type}</td>
                                                                    <td>{asset.asset_name}</td>
                                                                    <td>{asset.asset_sub_type}</td>
                                                                    <td>{asset.generic_info}</td>
                                                                    <td>{asset.color}</td>
                                                                    <td>{asset.brand}</td>
                                                                    <td>{asset.uom}</td>
                                                                    {/* <td>{asset.asset_quantity}</td> */}
                                                                    <td>{asset.co_efficient_factor}</td>
                                                                    <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                    <td>{asset.wastage}</td>
                                                                    <td>{asset.estimated_quantity_wastage}</td>
                                                                  </tr>
                                                                ))}
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                        </div>
                                                      </CollapsibleCard>

                                                    </div>
                                                  </td>
                                                </tr>
                                              </React.Fragment>
                                            )}

                                          </React.Fragment>
                                        ))
                                      )}


                                      {/* ................. */}


                                      {/* Render Sub-Category 3 for each Sub-Category 2 */}
                                      {openSubCategory2Id === subCategory.id && subCategory.sub_categories_3 && subCategory.sub_categories_3.length > 0 && (
                                        subCategory.sub_categories_3.map((subCategory3) => (
                                          <React.Fragment key={subCategory3.id}>
                                            <tr>
                                              <td>
                                                {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                              </td>
                                              <td></td>
                                              <td style={{ paddingLeft: '60px' }}>
                                                <button
                                                  className="btn btn-link p-0"
                                                  onClick={() => toggleSubCategory3(subCategory3.id)}
                                                  aria-label="Toggle sub-category 3 visibility"
                                                >
                                                  {openSubCategory3Id === subCategory3.id ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                      <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                    </svg>
                                                  ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                      <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                    </svg>
                                                  )}
                                                </button>
                                                {subCategory3.name}
                                              </td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start"></td>
                                              <td className="text-start">
                                                <div className="d-flex justify-content-center">
                                                  {/* <input className="pe-2" type="checkbox" /> */}
                                                  <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                  <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                </div>
                                              </td>
                                            </tr>

                                            {/* Render BOQ Details for Sub-Category 3 */}
                                            {openSubCategory3Id === subCategory3.id && subCategory3.boq_details && subCategory3.boq_details.length > 0 && (
                                              subCategory3.boq_details.map((boqDetail3) => (
                                                <React.Fragment key={boqDetail3.id}>
                                                  <tr>
                                                    <td>
                                                      <input className="ms-1 me-1 mb-1" type="checkbox" />
                                                    </td>
                                                    <td></td>
                                                    <td style={{ paddingLeft: '80px' }}>
                                                      <button
                                                        className="btn btn-link p-0"
                                                        onClick={() => toggleBoqDetail1(boqDetail3.id)}
                                                        aria-label="Toggle BOQ detail visibility"
                                                      >
                                                        {openBoqDetailId1 === boqDetail3.id ? (
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                            <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                          </svg>
                                                        ) : (
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                            <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                          </svg>
                                                        )}
                                                      </button>
                                                      {boqDetail3.item_name}
                                                    </td>
                                                    <td className="text-start">
                                                      <Link to={`/boq-details-page-master/${boqDetail3.id}`}>
                                                        {boqDetail3.id}
                                                      </Link>
                                                    </td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start">
                                                      <div className="d-flex justify-content-center">
                                                        {/* <input className="pe-2" type="checkbox" /> */}
                                                        <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                        <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                        {boqDetail3.status}
                                                      </div>
                                                    </td>
                                                  </tr>

                                                  {/* Render Materials Table for BOQ Detail in Sub-Category 3 */}
                                                  {openBoqDetailId1 === boqDetail3.id && boqDetail3.materials && boqDetail3.materials.length > 0 && (
                                                    <React.Fragment>
                                                      <tr>
                                                        <td colSpan={13}>
                                                          <div>
                                                            <CollapsibleCard title="Material Type">
                                                              <div className="card-body mt-0 pt-0">
                                                                <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                  <table className="w-100">
                                                                    <thead>
                                                                      <tr>
                                                                        <th rowSpan={2}>Material Type</th>
                                                                        <th rowSpan={2}>Material</th>
                                                                        <th rowSpan={2}>Material Sub-Type</th>
                                                                        <th rowSpan={2}>Generic Specification</th>
                                                                        <th rowSpan={2}>Colour</th>
                                                                        <th rowSpan={2}>Brand</th>
                                                                        <th rowSpan={2}>UOM</th>
                                                                        {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                        <th colSpan={3}>Cost</th>
                                                                        <th rowSpan={2}>Wastage</th>
                                                                        <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                      </tr>
                                                                      <tr>
                                                                        <th>Co-Efficient Factor</th>
                                                                        <th colSpan={2}>Estimated Qty</th>
                                                                      </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                      {boqDetail3.materials.map((material) => (
                                                                        <tr key={material.id}>
                                                                          <td>{material.material_type}</td>
                                                                          <td>{material.material_name}</td>
                                                                          <td>{material.material_sub_type}</td>
                                                                          <td>{material.generic_info}</td>
                                                                          <td>{material.color}</td>
                                                                          <td>{material.brand}</td>
                                                                          <td>{material.uom}</td>
                                                                          {/* <td>{material.generic_info}</td> */}
                                                                          <td>{material.co_efficient_factor}</td>
                                                                          <td colSpan={2}>{material.estimated_quantity}</td>
                                                                          <td>{material.wastage}</td>
                                                                          <td>{material.estimated_quantity_wastage}</td>
                                                                        </tr>
                                                                      ))}
                                                                    </tbody>
                                                                  </table>
                                                                </div>
                                                              </div>
                                                            </CollapsibleCard>

                                                            <CollapsibleCard title="Asset Type">
                                                              <div className="card-body mt-0 pt-0">
                                                                <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                  <table className="w-100">
                                                                    <thead>
                                                                      <tr>
                                                                        <th rowSpan={2}>Asset Type</th>
                                                                        <th rowSpan={2}>Asset</th>
                                                                        <th rowSpan={2}>Asset Sub-Type</th>

                                                                        <th rowSpan={2}>Generic Specification</th>
                                                                        <th rowSpan={2}>Colour</th>
                                                                        <th rowSpan={2}>Brand</th>
                                                                        <th rowSpan={2}>UOM</th>
                                                                        {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                        <th colSpan={3}>Cost</th>
                                                                        <th rowSpan={2}>Wastage</th>
                                                                        <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                      </tr>
                                                                      <tr>
                                                                        <th>Co-Efficient Factor</th>
                                                                        <th colSpan={2}>Estimated Qty</th>
                                                                      </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                      {boqDetail3.assets.map((asset) => (
                                                                        <tr key={asset.id}>
                                                                          <td>{asset.asset_type}</td>
                                                                          <td>{asset.asset_name}</td>
                                                                          <td>{asset.asset_sub_type}</td>
                                                                          <td>{asset.asset_specification}</td>
                                                                          <td>{asset.color}</td>
                                                                          <td>{asset.brand}</td>
                                                                          <td>{asset.uom}</td>
                                                                          {/* <td>{asset.asset_quantity}</td> */}
                                                                          <td>{asset.co_efficient_factor}</td>
                                                                          <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                          <td>{asset.wastage}</td>
                                                                          <td>{asset.estimated_quantity_wastage}</td>
                                                                        </tr>
                                                                      ))}
                                                                    </tbody>
                                                                  </table>
                                                                </div>
                                                              </div>
                                                            </CollapsibleCard>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    </React.Fragment>
                                                  )}




                                                  {/* Render Level 4 for each BOQ level 3 */}
                                                  {openSubCategory3Id === subCategory3.id && subCategory3.sub_categories_4 && subCategory3.sub_categories_4.length > 0 && (
                                                    subCategory3.sub_categories_4.map((subCategory4) => (
                                                      <React.Fragment key={subCategory4.id}>
                                                        <tr>
                                                          <td>
                                                            {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                          </td>
                                                          <td></td>
                                                          <td style={{ paddingLeft: '100px' }}>
                                                            <button
                                                              className="btn btn-link p-0"
                                                              onClick={() => toggleSubCategory4(subCategory4.id)}
                                                              aria-label="Toggle sub-category 4 visibility"
                                                            >
                                                              {openSubCategory4Id === subCategory4.id ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                  <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                </svg>
                                                              ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                  <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                </svg>
                                                              )}
                                                            </button>
                                                            {subCategory4.name}
                                                          </td>
                                                          <td className="text-start"></td>
                                                          <td className="text-start"></td>
                                                          <td className="text-start"></td>
                                                          <td className="text-start"></td>
                                                          <td className="text-start"></td>
                                                          <td className="text-start">
                                                            <div className="d-flex justify-content-center">
                                                              {/* <input className="pe-2" type="checkbox" /> */}
                                                              <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                              <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                            </div>
                                                          </td>
                                                        </tr>

                                                        {/* Render BOQ Details for Sub-Category 4 */}
                                                        {openSubCategory4Id === subCategory4.id && subCategory4.boq_details && subCategory4.boq_details.length > 0 && (
                                                          subCategory4.boq_details.map((boqDetail4) => (
                                                            <React.Fragment key={boqDetail4.id}>
                                                              <tr>
                                                                <td>
                                                                  <input className="ms-1 me-1 mb-1" type="checkbox" />
                                                                </td>
                                                                <td></td>
                                                                <td style={{ paddingLeft: '120px' }}>
                                                                  <button
                                                                    className="btn btn-link p-0"
                                                                    onClick={() => toggleBoqDetail2(boqDetail4.id)}
                                                                    aria-label="Toggle BOQ detail visibility"
                                                                  >
                                                                    {openBoqDetailId2 === boqDetail4.id ? (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                        <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                      </svg>
                                                                    ) : (
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                        <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                      </svg>
                                                                    )}
                                                                  </button>
                                                                  {boqDetail4.item_name}
                                                                </td>
                                                                <td className="text-start">
                                                                  <Link to={`/boq-details-page-master/${boqDetail4.id}`}>
                                                                    {boqDetail4.id}
                                                                  </Link>
                                                                </td>
                                                                <td className="text-start"></td>
                                                                <td className="text-start"></td>
                                                                <td className="text-start"></td>
                                                                <td className="text-start"></td>
                                                                <td className="text-start">
                                                                  <div className="d-flex justify-content-center">
                                                                    {/* <input className="pe-2" type="checkbox" /> */}
                                                                    <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                    <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                    {boqDetail4.status}
                                                                  </div>
                                                                </td>
                                                              </tr>

                                                              {/* Render Materials Table for BOQ Detail in Sub-Category 4 */}
                                                              {openBoqDetailId2 === boqDetail4.id && boqDetail4.materials && boqDetail4.materials.length > 0 && (
                                                                <React.Fragment>
                                                                  <tr>
                                                                    <td colSpan={12}>
                                                                      <div>
                                                                        <CollapsibleCard title="Material Type">
                                                                          <div className="card-body mt-0 pt-0">
                                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                              <table className="w-100">
                                                                                <thead>
                                                                                  <tr>
                                                                                    <th rowSpan={2}>Material Type</th>
                                                                                    <th rowSpan={2}>Material</th>
                                                                                    <th rowSpan={2}>Material Sub-Type</th>
                                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                                    <th rowSpan={2}>Colour</th>
                                                                                    <th rowSpan={2}>Brand</th>
                                                                                    <th rowSpan={2}>UOM</th>
                                                                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                                    <th colSpan={3}>Cost</th>
                                                                                    <th rowSpan={2}>Wastage</th>
                                                                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <th>Co-Efficient Factor</th>
                                                                                    <th colSpan={2}>Estimated Qty</th>
                                                                                  </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                  {boqDetail4.materials.map((material) => (
                                                                                    <tr key={material.id}>
                                                                                      <td>{material.material_type}</td>
                                                                                      <td>{material.material_name}</td>
                                                                                      <td>{material.material_sub_type}</td>
                                                                                      <td>{material.generic_info}</td>
                                                                                      <td>{material.color}</td>
                                                                                      <td>{material.brand}</td>
                                                                                      <td>{material.uom}</td>
                                                                                      {/* <td>{material.generic_info}</td> */}
                                                                                      <td>{material.co_efficient_factor}</td>
                                                                                      <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                      <td>{material.wastage}</td>
                                                                                      <td>{material.estimated_quantity_wastage}</td>
                                                                                    </tr>
                                                                                  ))}
                                                                                </tbody>
                                                                              </table>
                                                                            </div>
                                                                          </div>
                                                                        </CollapsibleCard>

                                                                        <CollapsibleCard title="Asset Type">
                                                                          <div className="card-body mt-0 pt-0">
                                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                              <table className="w-100">
                                                                                <thead>
                                                                                  <tr>
                                                                                    <th rowSpan={2}>Asset Type</th>
                                                                                    <th rowSpan={2}>Asset</th>
                                                                                    <th rowSpan={2}>Asset Sub-Type</th>

                                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                                    <th rowSpan={2}>Colour</th>
                                                                                    <th rowSpan={2}>Brand</th>
                                                                                    <th rowSpan={2}>UOM</th>
                                                                                    {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                                    <th colSpan={3}>Cost</th>
                                                                                    <th rowSpan={2}>Wastage</th>
                                                                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                  </tr>
                                                                                  <tr>
                                                                                    <th>Co-Efficient Factor</th>
                                                                                    <th colSpan={2}>Estimated Qty</th>
                                                                                  </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                  {boqDetail4.assets.map((asset) => (
                                                                                    <tr key={asset.id}>
                                                                                      <td>{asset.asset_type}</td>
                                                                                      <td>{asset.asset_name}</td>
                                                                                      <td>{asset.asset_sub_type}</td>
                                                                                      <td>{asset.asset_specification}</td>
                                                                                      <td>{asset.color}</td>
                                                                                      <td>{asset.brand}</td>
                                                                                      <td>{asset.uom}</td>
                                                                                      {/* <td>{asset.asset_quantity}</td> */}
                                                                                      <td>{asset.co_efficient_factor}</td>
                                                                                      <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                      <td>{asset.wastage}</td>
                                                                                      <td>{asset.estimated_quantity_wastage}</td>
                                                                                    </tr>
                                                                                  ))}
                                                                                </tbody>
                                                                              </table>
                                                                            </div>
                                                                          </div>
                                                                        </CollapsibleCard>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </React.Fragment>
                                                              )}

                                                              {/* Render Level 5 for each BOQ level 4 */}

                                                              {openSubCategory4Id === subCategory4.id && subCategory4.sub_categories_5 && subCategory4.sub_categories_5.length > 0 && (
                                                                subCategory4.sub_categories_5.map((subCategory5) => (
                                                                  <React.Fragment key={subCategory5.id}>
                                                                    <tr>
                                                                      <td>
                                                                        {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                      </td>
                                                                      <td></td>
                                                                      <td style={{ paddingLeft: '140px' }}>
                                                                        <button
                                                                          className="btn btn-link p-0"
                                                                          onClick={() => toggleSubCategory5(subCategory5.id)}
                                                                          aria-label="Toggle sub-category 5 visibility"
                                                                        >
                                                                          {openSubCategory5Id === subCategory5.id ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                              <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                            </svg>
                                                                          ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                              <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                            </svg>
                                                                          )}
                                                                        </button>
                                                                        {subCategory5.name}
                                                                      </td>
                                                                      <td className="text-start"></td>
                                                                      <td className="text-start"></td>
                                                                      <td className="text-start"></td>
                                                                      <td className="text-start"></td>
                                                                      <td className="text-start"></td>
                                                                      <td className="text-start">
                                                                        <div className="d-flex justify-content-center">
                                                                          {/* <input className="pe-2" type="checkbox" /> */}
                                                                          <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                          <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                        </div>
                                                                      </td>
                                                                    </tr>

                                                                    {/* Render BOQ Details for Sub-Category 5 */}

                                                                    {openSubCategory5Id === subCategory5.id && subCategory5.boq_details && subCategory5.boq_details.length > 0 && (
                                                                      subCategory5.boq_details.map((boqDetail5) => (
                                                                        <React.Fragment key={boqDetail5.id}>
                                                                          <tr>
                                                                            <td>
                                                                              <input className="ms-1 me-1 mb-1" type="checkbox" />
                                                                            </td>
                                                                            <td></td>
                                                                            <td style={{ paddingLeft: '160px' }}>
                                                                              <button
                                                                                className="btn btn-link p-0"
                                                                                onClick={() => toggleBoqDetail3(boqDetail5.id)}
                                                                                aria-label="Toggle BOQ detail visibility"
                                                                              >
                                                                                {openBoqDetailId3 === boqDetail5.id ? (
                                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                    <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                                  </svg>
                                                                                ) : (
                                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                    <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                                  </svg>
                                                                                )}
                                                                              </button>
                                                                              {boqDetail5.item_name}
                                                                            </td>
                                                                            <td className="text-start">
                                                                              <Link to={`/boq-details-page-master/${boqDetail5.id}`}>
                                                                                {boqDetail5.id}
                                                                              </Link>
                                                                            </td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start">
                                                                              <div className="d-flex justify-content-center">
                                                                                {/* <input className="pe-2" type="checkbox" /> */}
                                                                                <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                                <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                                {boqDetail5.status}
                                                                              </div>
                                                                            </td>
                                                                          </tr>

                                                                          {/* Render Materials Table for BOQ Detail in Sub-Category 5 */}
                                                                          {openBoqDetailId3 === boqDetail5.id && boqDetail5.materials && boqDetail5.materials.length > 0 && (
                                                                            <React.Fragment>
                                                                              <tr>
                                                                                <td colSpan={13}>
                                                                                  <div>
                                                                                    <CollapsibleCard title="Material Type">
                                                                                      <div className="card-body mt-0 pt-0">
                                                                                        <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                          <table className="w-100">
                                                                                            <thead>
                                                                                              <tr>
                                                                                                <th rowSpan={2}>Material Type</th>
                                                                                                <th rowSpan={2}>Material</th>
                                                                                                <th rowSpan={2}>Material Sub-Type</th>
                                                                                                <th rowSpan={2}>Generic Specification</th>
                                                                                                <th rowSpan={2}>Colour</th>
                                                                                                <th rowSpan={2}>Brand</th>
                                                                                                <th rowSpan={2}>UOM</th>
                                                                                                {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                                                <th colSpan={3}>Cost</th>
                                                                                                <th rowSpan={2}>Wastage</th>
                                                                                                <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                              </tr>
                                                                                              <tr>
                                                                                                <th>Co-Efficient Factor</th>
                                                                                                <th colSpan={2}>Estimated Qty</th>
                                                                                              </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                              {boqDetail5.materials.map((material) => (
                                                                                                <tr key={material.id}>
                                                                                                  <td>{material.material_type}</td>
                                                                                                  <td>{material.material_name}</td>
                                                                                                  <td>{material.material_sub_type}</td>
                                                                                                  <td>{material.generic_info}</td>
                                                                                                  <td>{material.color}</td>
                                                                                                  <td>{material.brand}</td>
                                                                                                  <td>{material.uom}</td>
                                                                                                  {/* <td>{material.generic_info}</td> */}
                                                                                                  <td>{material.co_efficient_factor}</td>
                                                                                                  <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                                  <td>{material.wastage}</td>
                                                                                                  <td>{material.estimated_quantity_wastage}</td>
                                                                                                </tr>
                                                                                              ))}
                                                                                            </tbody>
                                                                                          </table>
                                                                                        </div>
                                                                                      </div>
                                                                                    </CollapsibleCard>

                                                                                    <CollapsibleCard title="Asset Type">
                                                                                      <div className="card-body mt-0 pt-0">
                                                                                        <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                          <table className="w-100">
                                                                                            <thead>
                                                                                              <tr>
                                                                                                <th rowSpan={2}>Asset Type</th>
                                                                                                <th rowSpan={2}>Asset</th>
                                                                                                <th rowSpan={2}>Asset Sub-Type</th>

                                                                                                <th rowSpan={2}>Generic Specification</th>
                                                                                                <th rowSpan={2}>Colour</th>
                                                                                                <th rowSpan={2}>Brand</th>
                                                                                                <th rowSpan={2}>UOM</th>
                                                                                                {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                                                <th colSpan={3}>Cost</th>
                                                                                                <th rowSpan={2}>Wastage</th>
                                                                                                <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                              </tr>
                                                                                              <tr>
                                                                                                <th>Co-Efficient Factor</th>
                                                                                                <th colSpan={2}>Estimated Qty</th>
                                                                                              </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                              {boqDetail2.assets.map((asset) => (
                                                                                                <tr key={asset.id}>
                                                                                                  <td>{asset.asset_type}</td>
                                                                                                  <td>{asset.asset_name}</td>
                                                                                                  <td>{asset.asset_sub_type}</td>
                                                                                                  <td>{asset.asset_specification}</td>
                                                                                                  <td>{asset.color}</td>
                                                                                                  <td>{asset.brand}</td>
                                                                                                  <td>{asset.uom}</td>
                                                                                                  {/* <td>{asset.asset_quantity}</td> */}
                                                                                                  <td>{asset.co_efficient_factor}</td>
                                                                                                  <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                                  <td>{asset.wastage}</td>
                                                                                                  <td>{asset.estimated_quantity_wastage}</td>
                                                                                                </tr>
                                                                                              ))}
                                                                                            </tbody>
                                                                                          </table>
                                                                                        </div>
                                                                                      </div>
                                                                                    </CollapsibleCard>
                                                                                  </div>
                                                                                </td>
                                                                              </tr>
                                                                            </React.Fragment>
                                                                          )}
                                                                        </React.Fragment>
                                                                      ))
                                                                    )}
                                                                  </React.Fragment>
                                                                ))
                                                              )}
                                                            </React.Fragment>
                                                          ))
                                                        )}

                                                      </React.Fragment>
                                                    ))
                                                  )}
                                                </React.Fragment>
                                              ))
                                            )}
                                          </React.Fragment>
                                        ))
                                      )}

                                      {/* .. */}

                                    </React.Fragment>
                                  ))
                                )}
                                {/* sub level 2 end*/}

                              </React.Fragment>
                            ))
                          )}
                          {/* Conditional rendering for categories under sub-project  end*/}
                        </React.Fragment>
                      ))}

                    </React.Fragment>


                  ))}
                  {/* subProject end */}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BOQListTable;

