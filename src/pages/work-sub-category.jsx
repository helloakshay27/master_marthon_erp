import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, SelectBox, ShowIcon } from "../components";
import AddUsersModal from "../components/common/Modal/AddUserModel";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal } from "react-bootstrap"; // Ensure you have react-bootstrap installed
const WorkSubCategory = () => {


   const [projectDetails, setProjectDetails] = useState(
      {
          "categories": [

            {
              "id": 36,
              "name": "Civil Work",
              "Description": "Excavation and backfilling work",
              "Benchmark_Lead_Time": "15 days",
              "SAC_Code": "1234566",
              "material_type_details": [],
              "sub_categories_2": [
                  {
                      "id": 32,
                      "name": "Level 2 Example ",
                      "Description": "",
              "Benchmark_Lead_Time": "",
              "SAC_Code": "12345",
                      // "material_type_details": [
                      //     {
                      //         "id": 69,
                      //         "name": "CONCRETE",
                      //         "budget": 785.2099990844727
                      //     },
                      //     {
                      //         "id": 70,
                      //         "name": "STEEL-TMT",
                      //         "budget": 1.0
                      //     },
                      //     {
                      //         "id": 72,
                      //         "name": "COVER BLOCK",
                      //         "budget": 367.510009765625
                      //     }
                      // ],
                      "sub_categories_3": [
                          {
                              "id": 33,
                              "name": "Level 3 Example",
                              "Description": "",
              "Benchmark_Lead_Time": "",
              "SAC_Code": "12345",
                              // "material_type_details": [
                              //     {
                              //         "id": 63,
                              //         "name": "DOOR WORK",
                              //         "budget": 89.77999877929688
                              //     },
                              //     {
                              //         "id": 64,
                              //         "name": "CEMENT",
                              //         "budget": 59.0
                              //     },
                              //     {
                              //         "id": 66,
                              //         "name": "SAND",
                              //         "budget": 185.0
                              //     },
                              //     {
                              //         "id": 67,
                              //         "name": "ADHESIVE",
                              //         "budget": 278.489990234375
                              //     },
                              //     {
                              //         "id": 75,
                              //         "name": "TILES",
                              //         "budget": 2355.760009765625
                              //     },
                              //     {
                              //         "id": 78,
                              //         "name": "STONE",
                              //         "budget": 1516.219970703125
                              //     }
                              // ],
                              "sub_categories_4": [
                                {
                                  "id": 33,
                              "name": "Level 4 Example",
                              "Description": "",
              "Benchmark_Lead_Time": "",
              "SAC_Code": "12345",
                              "material_type_details": [
                                  {
                                      "id": 63,
                                      "name": "Excavation",
                                      "budget": 89.77999877929688
                                  },
                                 
                              ],
                                }
                              ]
                          },
                         
                         
                      ]
                  }
              ]
          },
             
              {
                  "id": 37,
                  "name": "FINISHING WORK",
                  "Description": "Internal and external plastering",
                  "Benchmark_Lead_Time": "10 days",
                  "SAC_Code": "12345",
                  "material_type_details": [],
                  "sub_categories_2": [
                      {
                          "id": 321,
                          "name": "Level 2 Example ",
                          "Description": "",
                  "Benchmark_Lead_Time": "",
                  "SAC_Code": "12345",
                          // "material_type_details": [
                          //     {
                          //         "id": 69,
                          //         "name": "CONCRETE",
                          //         "budget": 785.2099990844727
                          //     },
                          //     {
                          //         "id": 70,
                          //         "name": "STEEL-TMT",
                          //         "budget": 1.0
                          //     },
                          //     {
                          //         "id": 72,
                          //         "name": "COVER BLOCK",
                          //         "budget": 367.510009765625
                          //     }
                          // ],
                          "sub_categories_3": [
                              {
                                  "id": 331,
                                  "name": "Level 3 Example",
                                  "Description": "",
                  "Benchmark_Lead_Time": "",
                  "SAC_Code": "12345",
                                  // "material_type_details": [
                                  //     {
                                  //         "id": 63,
                                  //         "name": "DOOR WORK",
                                  //         "budget": 89.77999877929688
                                  //     },
                                  //     {
                                  //         "id": 64,
                                  //         "name": "CEMENT",
                                  //         "budget": 59.0
                                  //     },
                                  //     {
                                  //         "id": 66,
                                  //         "name": "SAND",
                                  //         "budget": 185.0
                                  //     },
                                  //     {
                                  //         "id": 67,
                                  //         "name": "ADHESIVE",
                                  //         "budget": 278.489990234375
                                  //     },
                                  //     {
                                  //         "id": 75,
                                  //         "name": "TILES",
                                  //         "budget": 2355.760009765625
                                  //     },
                                  //     {
                                  //         "id": 78,
                                  //         "name": "STONE",
                                  //         "budget": 1516.219970703125
                                  //     }
                                  // ],
                                  "sub_categories_4": [
                                    {
                                      "id": 332,
                                  "name": "Level 4 Example",
                                  "Description": "",
                  "Benchmark_Lead_Time": "",
                  "SAC_Code": "12345",
                                  "material_type_details": [
                                      {
                                          "id": 631,
                                          "name": "Plastering",
                                          "budget": 89.77999877929688
                                      },
                                     
                                  ],
                                    }
                                  ]
                              },
                             
                             
                          ]
                      }
                  ]
              },

             
          ]
      }
  );



   // estimation list table
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


  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const pageSize = 10; // Items per page

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // **Filter & Paginate Data**
  // const handleOpenAddUserModal = () => {
  //   setShowAddUserModal(true);
  // };

  const handleOpenAddUserModal = () => {
    setModalMode("add");
    setSelectedItem(null); // Clear selected item
    setShowAddUserModal(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item); // Set the item to edit
    setShowAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedItem, setSelectedItem] = useState(null); // Item to edit
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 5; // Number of items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Setup &gt; Engineering Setup &gt; Work Sub-Category Master
          </a>
          <h5 className="mt-4">Work Sub-Category Master</h5>

          {/* Search Bar */}
          <div className="card mt-4 pb-4">
            <div className="card-body">
              <div className="d-flex justify-content-end align-items-center px-3 py-2">
                {/* Search Bar */}
                <div className="d-flex align-items-center me-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      spellCheck="false"
                      // value={searchTerm}
                      // onChange={handleSearch}
                      style={{ width: "400px" }} // Inline CSS to increase width
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-md btn-default">
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Users Button */}
                <div>
                  <button
                    className="purple-btn2"
                    // onClick={handleOpenAddUserModal}
                  >
                    + Add
                  </button>
                </div>
              </div>
              {/* Table Data */}
            
                            {/* <ExpandableTable projectDetails={projectDetails} /> */}
                            
                              <div className="tbl-container m-4 mt-4 ms-1">
                                <table
                                 
                                  style={{
                                    width: "max-content",
                                    maxHeight: "max-content",
                                    height: "auto",
                                  }}

                                  className="w-100"
                                >
                                  <thead style={{ zIndex: "111 " }}>
                                    <tr>
                                      <th className="text-center" >
                                        Expand
                                      </th>
                                      <th className="text-center" >
                                      Sr No.
                                      </th>
                                      <th className="text-center" >
                                      Parent Work Category
                                      </th>
                                      <th className="text-center" >
                                      Sub category Name
                                      </th>
                                      <th className="text-center" >
                                      Description
                                      </th>
                                      <th className="text-center" >
                                      Benchmark Lead Time
                                      </th>
                                      <th className="text-center" >
                                      SAC Code
                                      </th>
                                      <th className="text-center" >
                                      Action
                                      </th>
                                      
                                    </tr>
              
                                   
                                    
                                  </thead>
                                  <tbody>
                                    {/* Conditional rendering for categories under sub-project start */}
                                    {projectDetails &&
                                      projectDetails.categories &&
                                      projectDetails.categories.map((category, index) => (
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
                                            <td>{category.name}</td>
                                            <td></td>
                                            <td>{category.Description}</td>
                                            <td>{category.Benchmark_Lead_Time}</td>
                                            <td>{category.SAC_Code}</td>
                                            <td></td>
                                            
                                            
                                            
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
                                                  <td>{subCategory.name}</td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                 
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
                                                          <td>{boqDetail2.name}</td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>

                                                        </tr>
                                                      </React.Fragment>
                                                    )
                                                  )}
              
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
                                                          <td>{subCategory3.name}</td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td>
                                                           
                                                          </td>
                                                          
                                                          
                                                         
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
                                                                  <td>{boqDetail2.name}</td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td>
                                                                   
                                                                  </td>
                                                                 
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
                                                                  {subCategory4.name}
                                                                  </td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td>
                                                                   
                                                                  </td>
                                                                 
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
                                                                          <td> {boqDetail2.name}</td>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td>
                                                                           
                                                                          </td>
                                                                          <td>
                                                                          </td>
                                                                         
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
                                                                          {
                                                                              subCategory5.name
                                                                            }
                                                                          </td>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td>
                                                                            
                                                                          </td>
                                                                          <td>
                                                                           
                                                                          </td>
                                                                         
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
                                                                                  <td> {
                                                                                      boqDetail2.name
                                                                                    }</td>
                                                                                  <td></td>
                                                                                  <td></td>
                                                                                  <td>
                                                                                   
                                                                                  </td>
                                                                                  <td>
                                                                                   
                                                                                  </td>
                                                                                  
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
                           

              {/* Pagination Controls */}
              {/* <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                <ul className="pagination justify-content-center d-flex">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                    >
                      First
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Prev
                    </button>
                  </li>

                  {Array.from(
                    { length: Math.ceil(tableData.length / itemsPerPage) },
                    (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(tableData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(tableData.length / itemsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          Math.ceil(tableData.length / itemsPerPage)
                        )
                      }
                    >
                      Last
                    </button>
                  </li>
                </ul>
                <div>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, tableData.length)} of{" "}
                  {tableData.length} entries
                </div>
              </div> */}
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default WorkSubCategory;
