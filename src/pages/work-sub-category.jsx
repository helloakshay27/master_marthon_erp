import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, SelectBox, ShowIcon } from "../components";
import AddUsersModal from "../components/common/Modal/AddUserModel";
import { baseURL } from "../confi/apiDomain";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal } from "react-bootstrap"; // Ensure you have react-bootstrap installed
import { useNavigate } from "react-router-dom"; // Add this import

const WorkSubCategory = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [projectDetails, setProjectDetails] = useState({
    categories: [
    ],
  });

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
  const [showAddModal, setShowAddModal] = useState(false);

  // **Filter & Paginate Data**
  const handleOpenAddUserModal = () => {
    setShowAddUserModal(true);
  };



  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item); // Set the item to edit
    setShowAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    // Reset modal inputs and selection state
    setNewSubCategory({
      name: "",
      Description: "",
      Benchmark_Lead_Time: "",
      SAC_Code: ""
    });

    setAddLocation({
      level: null,
      parentId: null
    });
  };

  const handleOpenAddModal = () => {
    // setModalMode("add");
    // setSelectedItem(null); // Clear selected item
    setShowAddModal(true);
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

  // State for the new category form
  const [newCategory, setNewCategory] = useState({
    name: "",
    Description: "",
    Benchmark_Lead_Time: "",
    SAC_Code: "",
  });

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewCategory({
      name: "",
      Description: "",
      Benchmark_Lead_Time: "",
      SAC_Code: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    const newCategoryObj = {
      id: Date.now(), // Generate a unique ID (you might want a better ID system)
      name: newCategory.name,
      Description: newCategory.Description,
      Benchmark_Lead_Time: newCategory.Benchmark_Lead_Time,
      SAC_Code: newCategory.SAC_Code,
      material_type_details: [],
      sub_categories_2: []
    };

    setProjectDetails(prev => ({
      ...prev,
      categories: [...prev.categories, newCategoryObj]
    }));

    handleCloseAddModal();
  };


  // sub category

  // State for tracking where to add
  const [addLocation, setAddLocation] = useState({
    parentId: null,
    // parentId: "id-of-parent-category", // ID of the category to add to
    level: 2,
    level: 2,
    parentName: "",
    categoryPath: []
  });

  const [addLocation3, setAddLocation3] = useState({
    parentId: null,
    level: 3,
    parentName: "",
    categoryPath: []
  });

  // State for new sub-category form
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    Description: "",
    Benchmark_Lead_Time: "",
    SAC_Code: "",
  });


  // Function to open modal
  const openAddSubCategoryModal = (parentId, level, parentName, categoryPath) => {
    setAddLocation({
      parentId,
      level,
      parentName,
      categoryPath
    });
    setShowAddUserModal(true);
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;

    // Extract the field name from the input name
    const fieldName = name.replace('work_sub_category[', '').replace(']', '');

    // Map the field names to match your state structure
    const stateFieldName = {
      'name': 'name',
      'description': 'Description', // Note capital D to match state
      'benchmark_lead_time': 'Benchmark_Lead_Time',
      'sac_code': 'SAC_Code'
    }[fieldName] || fieldName;

    setNewSubCategory(prev => ({
      ...prev,
      [stateFieldName]: value
    }));
  };



  const handleAddSubCategory = () => {
    const newSubCategoryObj = {
      id: Date.now(),
      name: newSubCategory.name,
      Description: newSubCategory.Description,
      Benchmark_Lead_Time: newSubCategory.Benchmark_Lead_Time,
      SAC_Code: newSubCategory.SAC_Code,
      material_type_details: [],
      ...(addLocation.level < 4 ? { [`sub_categories_${addLocation.level + 1}`]: [] } : {})
    };

    setProjectDetails(prev => {
      const updateCategories = (categories, currentDepth = 1) => {
        return categories.map(category => {
          // If we're at the parent level where we need to add
          if (currentDepth === addLocation.level - 1) {
            if (category.id === addLocation.parentId) {
              const subCategoryKey = `sub_categories_${addLocation.level}`;
              return {
                ...category,
                [subCategoryKey]: [
                  ...(category[subCategoryKey] || []),
                  newSubCategoryObj
                ]
              };
            }
            return category;
          }

          // Otherwise, go deeper if possible
          const nextDepth = currentDepth + 1;
          const subCategoryKey = `sub_categories_${nextDepth}`;

          if (category[subCategoryKey]) {
            return {
              ...category,
              [subCategoryKey]: updateCategories(
                category[subCategoryKey],
                nextDepth
              )
            };
          }

          return category;
        });
      };

      return {
        ...prev,
        categories: updateCategories(prev.categories)
      };
    });

    // Automatically open the parent category
    if (addLocation.level === 2) {
      setOpenCategoryId(addLocation.parentId);
    } else if (addLocation.level === 3) {
      setOpenSubCategory2Id(addLocation.parentId);
    } else if (addLocation.level === 4) {
      setOpenSubCategory3Id(addLocation.parentId);
    }

    handleCloseAddUserModal();
  };


  // In openAddSubCategoryModal:
  // console.log("Opening modal for:", { parentId, level, parentName });

  // In handleAddSubCategory:
  console.log("Adding to parent ID:", addLocation.parentId);
  console.log("Current categories:", projectDetails.categories);
  console.log("all data :", projectDetails)
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
                    // onClick={() => navigate("/add-work-sub-category")} // Use navigate
                    onClick={handleOpenAddModal} // ← Open the modal here
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
                      <th className="text-center">Expand</th>
                      <th className="text-center">Sr No.</th>
                      <th className="text-center">Parent Work Category</th>
                      <th className="text-center">Sub category Name</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Benchmark Lead Time</th>
                      <th className="text-center">SAC Code</th>
                      <th className="text-center">Action</th>
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
                            <td>
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn p-0"
                                  onClick={() =>
                                    openAddSubCategoryModal(category.id, 2, "Main Category Name")
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-plus-circle"
                                    viewBox="0 0 16 16"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                  </svg>
                                </button>
                                <button className="btn  mt-0">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      cursor: "pointer",
                                      width: "20px",
                                      height: "20px",
                                    }}
                                  >
                                    <path
                                      d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                      fill="#3A3A3A"
                                    />
                                  </svg>
                                </button>
                                <span className="mt-2 pt-1 ">
                                  <input type="checkbox" />
                                </span>
                                <button className="btn  mt-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-square"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                  </svg>
                                </button>
                                {/* dustbin add here */}
                                <button className="btn  mt-0 ps-0">
                                  <svg
                                    width="16"
                                    height="20"
                                    viewBox="0 0 16 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                      fill="#B25657"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* sub level 2 start */}
                          {openCategoryId === category.id &&
                            category.sub_categories_2 &&
                            // category.sub_categories_2.length > 0 &&
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
                                      {openSubCategory2Id === subCategory.id ? (
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
                                  <td>{subCategory.Description}</td>
                                  <td>{subCategory.Benchmark_Lead_Time}</td>
                                  <td>{subCategory.SAC_Code}</td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <button
                                        className="btn p-0"
                                        onClick={() =>
                                          openAddSubCategoryModal(subCategory.id, 3, "Sub Category Name")
                                        }
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          fill="currentColor"
                                          className="bi bi-plus-circle"
                                          viewBox="0 0 16 16"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                        </svg>
                                      </button>
                                      <button className="btn  mt-0">
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          style={{
                                            cursor: "pointer",
                                            width: "20px",
                                            height: "20px",
                                          }}
                                        >
                                          <path
                                            d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                            fill="#3A3A3A"
                                          />
                                        </svg>
                                      </button>
                                      <span className="mt-2 pt-1 ">
                                        <input type="checkbox" />
                                      </span>
                                      <button className="btn  mt-0">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-pencil-square"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                          <path
                                            fillRule="evenodd"
                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                          />
                                        </svg>
                                      </button>
                                      {/* dustbin add here */}
                                      <button className="btn  mt-0 ps-0">
                                        <svg
                                          width="16"
                                          height="20"
                                          viewBox="0 0 16 20"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                            fill="#B25657"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
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
                                  // subCategory.sub_categories_3.length > 0 &&
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
                                          <td>{subCategory3.Description}</td>
                                          <td>{subCategory3.Benchmark_Lead_Time}</td>
                                          <td>{subCategory3.SAC_Code}</td>
                                          <td>
                                            <div className="d-flex justify-content-center">
                                              <button
                                                className="btn p-0"
                                                onClick={() =>
                                                  openAddSubCategoryModal(subCategory3.id, 4, "Sub Category Name")
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="20"
                                                  height="20"
                                                  fill="currentColor"
                                                  className="bi bi-plus-circle"
                                                  viewBox="0 0 16 16"
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                                </svg>
                                              </button>
                                              <button className="btn  mt-0">
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 16 16"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  style={{
                                                    cursor: "pointer",
                                                    width: "20px",
                                                    height: "20px",
                                                  }}
                                                >
                                                  <path
                                                    d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                                    fill="#3A3A3A"
                                                  />
                                                </svg>
                                              </button>
                                              <span className="mt-2 pt-1 ">
                                                <input type="checkbox" />
                                              </span>
                                              <button className="btn  mt-0">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  className="bi bi-pencil-square"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                  />
                                                </svg>
                                              </button>
                                              {/* dustbin add here */}
                                              <button className="btn  mt-0 ps-0">
                                                <svg
                                                  width="16"
                                                  height="20"
                                                  viewBox="0 0 16 20"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                    fill="#B25657"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
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
                                                  <td></td>
                                                </tr>
                                              </React.Fragment>
                                            )
                                          )}

                                        {/* Render Level 4 for each BOQ level 3 */}
                                        {openSubCategory3Id ===
                                          subCategory3.id &&
                                          subCategory3.sub_categories_4 &&
                                          subCategory3.sub_categories_4.length >
                                          0 &&
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
                                                  <td>{subCategory4.name}</td>
                                                  <td></td>
                                                  <td>{subCategory4.Description}</td>
                                                  <td>{subCategory4.Benchmark_Lead_Time}</td>
                                                  <td>{subCategory4.SAC_Code}</td>
                                                  <td>
                                                    <div className="d-flex justify-content-center">

                                                      <button
                                                        className="btn p-0"

                                                        onClick={handleOpenAddUserModal} // ← Open the modal here
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="20"
                                                          height="20"
                                                          fill="currentColor"
                                                          className="bi bi-plus-circle"
                                                          viewBox="0 0 16 16"
                                                          style={{ cursor: "pointer" }}
                                                        >
                                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                                        </svg>
                                                      </button>
                                                      <button className="btn  mt-0">
                                                        <svg
                                                          width="16"
                                                          height="16"
                                                          viewBox="0 0 16 16"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          style={{
                                                            cursor: "pointer",
                                                            width: "20px",
                                                            height: "20px",
                                                          }}
                                                        >
                                                          <path
                                                            d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                                            fill="#3A3A3A"
                                                          />
                                                        </svg>
                                                      </button>
                                                      <span className="mt-2 pt-1 ">
                                                        <input type="checkbox" />
                                                      </span>
                                                      <button className="btn  mt-0">
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="16"
                                                          height="16"
                                                          fill="currentColor"
                                                          className="bi bi-pencil-square"
                                                          viewBox="0 0 16 16"
                                                        >
                                                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                          <path
                                                            fillRule="evenodd"
                                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                          />
                                                        </svg>
                                                      </button>
                                                      {/* dustbin add here */}
                                                      <button className="btn  mt-0 ps-0">
                                                        <svg
                                                          width="16"
                                                          height="20"
                                                          viewBox="0 0 16 20"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                            fill="#B25657"
                                                          />
                                                        </svg>
                                                      </button>
                                                    </div>
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
                                                          <td>
                                                            {" "}
                                                            {boqDetail2.name}
                                                          </td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                        </tr>
                                                      </React.Fragment>
                                                    )
                                                  )}
                                                {/*  */}
                                                {/* Render Level 5 for each BOQ level 4*/}
                                                {openSubCategory4Id ===
                                                  subCategory4.id &&
                                                  subCategory4.sub_categories_5 &&
                                                  subCategory4.sub_categories_5
                                                    .length > 0 &&
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
                                                            {subCategory5.name}
                                                          </td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td>
                                                            <div className="d-flex justify-content-center">

                                                              <button
                                                                className="btn p-0"

                                                                onClick={handleOpenAddUserModal} // ← Open the modal here
                                                              >
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width="20"
                                                                  height="20"
                                                                  fill="currentColor"
                                                                  className="bi bi-plus-circle"
                                                                  viewBox="0 0 16 16"
                                                                  style={{ cursor: "pointer" }}
                                                                >
                                                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                                                </svg>
                                                              </button>
                                                              <button className="btn  mt-0">
                                                                <svg
                                                                  width="16"
                                                                  height="16"
                                                                  viewBox="0 0 16 16"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  style={{
                                                                    cursor: "pointer",
                                                                    width: "20px",
                                                                    height: "20px",
                                                                  }}
                                                                >
                                                                  <path
                                                                    d="M13.722 6.84688C12.2407 3.72656 10.0017 2.15625 7.00009 2.15625C3.99697 2.15625 1.75947 3.72656 0.278215 6.84844C0.218802 6.97425 0.187988 7.11165 0.187988 7.25078C0.187988 7.38991 0.218802 7.52732 0.278215 7.65312C1.75947 10.7734 3.99853 12.3438 7.00009 12.3438C10.0032 12.3438 12.2407 10.7734 13.722 7.65156C13.8423 7.39844 13.8423 7.10469 13.722 6.84688ZM7.00009 11.2188C4.47978 11.2188 2.63447 9.94063 1.3329 7.25C2.63447 4.55938 4.47978 3.28125 7.00009 3.28125C9.5204 3.28125 11.3657 4.55938 12.6673 7.25C11.3673 9.94063 9.52197 11.2188 7.00009 11.2188ZM6.93759 4.5C5.41884 4.5 4.18759 5.73125 4.18759 7.25C4.18759 8.76875 5.41884 10 6.93759 10C8.45634 10 9.68759 8.76875 9.68759 7.25C9.68759 5.73125 8.45634 4.5 6.93759 4.5ZM6.93759 9C5.9704 9 5.18759 8.21719 5.18759 7.25C5.18759 6.28281 5.9704 5.5 6.93759 5.5C7.90478 5.5 8.68759 6.28281 8.68759 7.25C8.68759 8.21719 7.90478 9 6.93759 9Z"
                                                                    fill="#3A3A3A"
                                                                  />
                                                                </svg>
                                                              </button>
                                                              <span className="mt-2 pt-1 ">
                                                                <input type="checkbox" />
                                                              </span>
                                                              <button className="btn  mt-0">
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width="16"
                                                                  height="16"
                                                                  fill="currentColor"
                                                                  className="bi bi-pencil-square"
                                                                  viewBox="0 0 16 16"
                                                                >
                                                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                  <path
                                                                    fillRule="evenodd"
                                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                                  />
                                                                </svg>
                                                              </button>
                                                              {/* dustbin add here */}
                                                              <button className="btn  mt-0 ps-0">
                                                                <svg
                                                                  width="16"
                                                                  height="20"
                                                                  viewBox="0 0 16 20"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                                    fill="#B25657"
                                                                  />
                                                                </svg>
                                                              </button>
                                                            </div>
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
                                                                  <td>
                                                                    {" "}
                                                                    {
                                                                      boqDetail2.name
                                                                    }
                                                                  </td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
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

{/* sub category modal */}
      <Modal
        centered
        size="lg"
        show={showAddUserModal}
        onHide={handleCloseAddUserModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Level {addLocation.level} Sub-Category
            {addLocation.parentName && ` to ${addLocation.parentName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* {renderCategoryPath()} */}

            <div className="row">
              {/* Subcategory Name */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>Subcategory Name<span>*</span></label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    required
                    type="text"
                    // name="work_sub_category[name]"
                    // value={newSubCategory.name}
                    // onChange={handleInputChange2}
                    spellCheck="false"

                    name="name"
                    value={newSubCategory.name}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-md-4">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows={1}
                    // name="work_sub_category[description]"
                    // value={newSubCategory.Description}
                    // onChange={handleInputChange2}

                    name="Description"
                    value={newSubCategory.Description}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, Description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Benchmark Lead Time */}
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>Benchmark Lead Time<span>*</span></label>
                  <input
                    className="form-control"
                    required
                    type="number"
                    // name="work_sub_category[benchmark_lead_time]"
                    // value={newSubCategory.Benchmark_Lead_Time}
                    // onChange={handleInputChange2}

                    name="Benchmark_Lead_Time"
                    value={newSubCategory.Benchmark_Lead_Time}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, Benchmark_Lead_Time: e.target.value }))}
                  />
                </div>
              </div>

              {/* SAC Code */}
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>SAC Code<span>*</span></label>
                  <input
                    placeholder="Sub-Category Code"
                    className="form-control"
                    required
                    type="text"
                    // name="work_sub_category[sac_code]"
                    // value={newSubCategory.SAC_Code}
                    // onChange={handleInputChange2}

                    name="SAC_Code"
                    value={newSubCategory.SAC_Code}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, SAC_Code: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-4">
                <button
                  type="submit"
                  className="purple-btn2 w-100"
                  onClick={handleAddSubCategory}
                >
                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="purple-btn1 w-100"
                  onClick={handleCloseAddUserModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* add */}

      <Modal
        centered
        size="m"
        show={showAddModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Work Category Master</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="row">
              {/* Category Name */}
              <div className="col-md-6">
                <div className="form-group">
                  <label>Category Name <span>*</span></label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    required
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    spellCheck="false"
                  />
                </div>
              </div>

              {/* Description */}

              <div className="col-md-6">
                <div className="form-group">
                  <label>Category Code  <span>*</span></label>

                  <input
                    className="form-control"
                    id="inv_name"
                    autoComplete="off"
                    required="required"
                    type="text"
                    name="work_sub_category[name]"
                    spellCheck="false"

                  />
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="Description"
                    value={newCategory.Description}
                    onChange={handleInputChange}
                    spellCheck="false"
                  />
                </div>
              </div> */}
            </div>

            {/* <div className="row mt-2">
            
              <div className="col-md-6">
                <div className="form-group">
                  <label>Benchmark Lead Time</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="Benchmark_Lead_Time"
                    value={newCategory.Benchmark_Lead_Time}
                    onChange={handleInputChange}
                    spellCheck="false"
                  />
                </div>
              </div>

             
              <div className="col-md-6">
                <div className="form-group">
                  <label>SAC Code <span>*</span></label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    required
                    type="text"
                    name="SAC_Code"
                    value={newCategory.SAC_Code}
                    onChange={handleInputChange}
                    spellCheck="false"
                  />
                </div>
              </div>
            </div> */}

            <div className="row mt-2 justify-content-center">
              <div className="col-md-4">
                <button
                  type="submit"
                  className="purple-btn2 w-100"
                  onClick={handleAddCategory}
                >
                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="purple-btn1 w-100"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>


  );
};

export default WorkSubCategory;
