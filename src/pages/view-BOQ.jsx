import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import BOQListTable from "../components/BOQListTabe";
// import { Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { BulkAction } from "../components";
import axios from "axios";
import { Link } from 'react-router-dom'
import { baseURL } from "../confi/apiDomain";
import { toast, ToastContainer } from "react-toastify";



const BOQList = () => {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [boqList, setBoqList] = useState(null); // State to store the fetched data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Items per page
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading2, setLoading2] = useState(true);

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const [searchKeyword, setSearchKeyword] = useState('');

  const navigate = useNavigate(); // hook to get navigate function

  const handleClick = () => {
    // Navigate to '/about' when the button is clicked
    navigate('/create-BOQ');
  };

  const handleModalShow = () => setShow(true);


  const [copyModal, setcopyModal] = useState(false);

  const openCopyModal = () => setcopyModal(true);
  const closeCopyModal = () => setcopyModal(false);



  const [expandedRows, setExpandedRows] = useState([]);


  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const [openSubProject2, setOpenSubProject2] = useState(false)
  const handleSubProject2 = () => {
    setOpenSubProject2(!openSubProject2)
  }
  const [openSubProject2_1, setOpenSubProject2_1] = useState(false)
  const handleSubProject2_1 = () => {
    setOpenSubProject2_1(!openSubProject2_1)
  }

  const [openSubProject2_11, setOpenSubProject2_11] = useState(false)
  const handleSubProject2_11 = () => {
    setOpenSubProject2_11(!openSubProject2_11)
  }

  const [openSubProject2_12, setOpenSubProject2_12] = useState(false)
  const handleSubProject2_12 = () => {
    setOpenSubProject2_12(!openSubProject2_12)
  }

  const [openSubProject2_13, setOpenSubProject2_13] = useState(false)
  const handleSubProject2_13 = () => {
    setOpenSubProject2_13(!openSubProject2_13)
  }

  const [openSubProjectDetails, setOpenSubProjectDetails] = useState(false)
  const handleSubProjectDetails = () => {
    setOpenSubProjectDetails(!openSubProjectDetails)
  }


  const [openSubProject3, setOpenSubProject3] = useState(false)
  const handleSubProject3 = () => {
    setOpenSubProject3(!openSubProject3)
  }

  const [openSubProject, setOpenSubProject] = useState(false)
  const handleSubProject = () => {
    setOpenSubProject(!openSubProject)
  }



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
    axios.get(`${baseURL}pms/projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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


  const [boqDetailsSub, setBoqDetailsSub] = useState(true);
  // Fetch data from the API when the component mounts
  const fetchData = (page) => {
    setLoading(true);
    axios
      .get(`${baseURL}boq_details.json?page=${page}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then((response) => {
        setBoqList(response.data); // Set the data in state
        // console.log("data list ", response.data.pagination.total_entries)
        setTotalPages(response.data?.pagination.total_pages); // Set total pages
        setTotalEntries(response.data?.pagination.total_entries);
        setLoading2(false);
        setLoading(false);
        if (response.data.boq_sub_items && response.data.boq_sub_items.length > 0) {
          setBoqDetailsSub(false); // Set to true if uom is not null
        }

      })
      .catch((error) => {
        console.log('error', error)
        setLoading2(false);
        setLoading(false);

      });
  }



  // Fetch data on component mount and when the page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  // useEffect(() => {
  //   const search = searchKeyword||"";
  //   console.log("search", search)



  // }, []); // Empty dependency array ensures it runs only once when the component mounts

  // console.log('boq list', boqList)


  // Handle Go button click
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const handleGoClick = () => {
    // if (!selectedProject || !selectedSite || !selectedWing) {
    //   alert("Please select Project, Site, and Wing");
    //   return;
    // }
    let validationErrors = {};
    // Validate required fields
    if (!selectedProject) validationErrors.project = 'Project is required.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // setLoading(true);

      const projectId = selectedProject ? selectedProject.value : "";
      const siteId = selectedSite ? selectedSite.value : "";
      const wingId = selectedWing ? selectedWing.value : "";

      setLoading(true); // Set loading to true before making the request

      axios
        .get(
          `${baseURL}boq_details.json?project_id=${projectId}&site_id=${siteId}&wing_id=${wingId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          setBoqList(response.data); // Set the fetched data to state
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when request completes
        });

    }
  };

  // boq list table 
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
  const [openBoqDetailId4, setOpenBoqDetailId4] = useState(null); // Track BOQ details visibility
  // const [openBoqDetailId3, setOpenBoqDetailId3] = useState(null); // Track BOQ details visibility


  const [openBoqDetailIdSub, setOpenBoqDetailIdSub] = useState(null); // Track BOQ details visibility


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

  const toggleBoqDetailSub1 = (id) => {

    if (openBoqDetailIdSub === id) {
      setOpenBoqDetailIdSub(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailIdSub(id);  // Open the selected category
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

  // // Toggle BOQ details 3 visibility
  const toggleBoqDetail3 = (id) => {

    if (openBoqDetailId3 === id) {
      setOpenBoqDetailId3(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId3(id);  // Open the selected category
    }
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory3 = (id) => {
    // setOpenSubCategory3Id(openSubCategory3Id === id ? null : id);

    if (openSubCategory3Id === id) {
      setOpenSubCategory3Id(null);  // Close the category if it's already open
    } else {
      setOpenSubCategory3Id(id);  // Open the selected category
    }
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory4 = (id) => {
    // setOpenSubCategory4Id(openSubCategory4Id === id ? null : id);
    if (openSubCategory4Id === id) {
      setOpenSubCategory4Id(null);  // Close the category if it's already open
    } else {
      setOpenSubCategory4Id(id);  // Open the selected category
    }
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory5 = (id) => {
    // setOpenSubCategory5Id(openSubCategory5Id === id ? null : id);
    if (openSubCategory5Id === id) {
      setOpenSubCategory5Id(null);  // Close the category if it's already open
    } else {
      setOpenSubCategory5Id(id);  // Open the selected category
    }
  };

  const handleClickCollapse = () => {
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
    openBoqDetailId4(null)

  }

  //bulk action 
  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  // const [boqList, setBoqList] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleStatusChange = (selectedOption) => {
    // const { name, value } = e.target;
    // if (name === "fromStatus") {
    //   setFromStatus(selectedOption.value);
    // } else if (name === "toStatus") {
    //   setToStatus(selectedOption.value);
    // }

    setFromStatus(selectedOption.value);
  };

  // Handle status change for 'To Status'
  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };


  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };


  // Handle form submission
  const handleSubmit = () => {
    // e.preventDefault();

    if (!fromStatus || !toStatus) {
      alert("Please select both 'From Status' and 'To Status'.");
      return;
    }

    // Prepare data to send
    const data = {
      boq_detail_ids: selectedBoqDetails,
      from_status: fromStatus,
      to_status: toStatus,
      comments: remark,
    };
    console.log("data for bulk action", data)

    // Send data to API using axios
    axios
      .patch(
        `${baseURL}boq_details/update_bulk_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        data
      )
      .then((response) => {
        console.log('Success:', response.data);
        alert('Status updated successfully ....')
        // Handle success (e.g., show a success message, update UI, etc.)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show an error message)
      });
  };



  // Fetch the data when 'fromStatus' changes
  useEffect(() => {
    if (fromStatus) { // Only fetch data if a status is selected
      setLoading(true); // Show loading state while fetching
      axios
        .get(
          `${baseURL}boq_details.json?q[status_eq]=${fromStatus}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          setBoqList(response.data); // Set the fetched data to state
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when request is complete
        });
    }
  }, [fromStatus]);  // This will run every time 'fromStatus' changes




  const [selectedBoqDetails, setSelectedBoqDetails] = useState([]); // State to track selected boq detail IDs

  // Function to toggle the checkbox selection
  const handleCheckboxChange = (boqDetailId) => {
    setSelectedBoqDetails((prevSelected) => {
      if (prevSelected.includes(boqDetailId)) {
        // If already selected, remove it from the array
        return prevSelected.filter((id) => id !== boqDetailId);
      } else {
        // If not selected, add it to the array
        return [...prevSelected, boqDetailId];
      }
    });
  };

  // console.log("selected boq id array :", selectedBoqDetails)


  //bulkaction options 
  const options = [
    {
      label: 'Select Status',
      value: '',
    },
    {
      label: 'Draft',
      value: 'draft',
    },
    {
      label: 'Submitted',
      value: 'submitted',
    },
    {
      label: 'Approved',
      value: 'approved',
    },
  ];

  //unit
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  // Fetching the unit of measures data on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}unit_of_measures.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        // Mapping the response to the format required by react-select
        const options = response.data.map((unit) => ({
          value: unit.id,
          label: unit.name,
        }));
        setUnitOfMeasures(options); // Save the formatted options to state
      })
      .catch((error) => {
        console.error("Error fetching unit of measures:", error);
      });
  }, []);

  // Handler for unit of measure selection
  const handleUnitChange = (selectedOption) => {
    setSelectedUnit(selectedOption); // Update selected unit state
  };

  //work categories 
  const [workCategories, setWorkCategories] = useState([]); // To store work categories fetched from the API
  const [selectedCategory, setSelectedCategory] = useState(null); // To store the selected work category
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // To store the selected work subcategory
  const [subCategoryOptions, setSubCategoryOptions] = useState([]); // To
  // / Fetching work categories on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}work_categories/work_categories_and_subcategories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      ) // Replace with your API endpoint
      .then((response) => {
        setWorkCategories(response.data.work_categories); // Save the categories to state
      })
      .catch((error) => {
        console.error("Error fetching work categories:", error);
      });
  }, []);

  // Handler for selecting a work category
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    // setSelectedSubCategory(null); // Clear subcategory selection when the category changes
    // setSubCategoryOptions([]); // Reset subcategories list
    // setSubCategoryLevel3Options([]); // Clear sub-subcategory options
    // setSubCategoryLevel4Options([]); // Clear level 4 options
    // setSubCategoryLevel5Options([]); // Clear level 5 options
    // setSelectedSubCategoryLevel3(null);
    // setSelectedSubCategoryLevel4(null);
    // setSelectedSubCategoryLevel5(null);

    // If there are subcategories for this category, update the subcategory options
    // if (selectedOption && selectedOption.work_sub_categories.length > 0) {
    //   setSubCategoryOptions(
    //     selectedOption.work_sub_categories.map((subCategory) => ({
    //       value: subCategory.id,
    //       label: subCategory.name,
    //     }))
    //   );
    // }
    console.log("list category to sub:", selectedOption)

    // Fetch sub-subcategories using the selected subcategory
    axios
      .get(
        `${baseURL}work_sub_categories.json?q[work_category_id_eq]=${selectedOption.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        console.log("sub responce:", response)
        const subSubCategories = response.data || [];
        setSubCategoryOptions(
          subSubCategories.map((subSubCategory) => ({
            value: subSubCategory.id,
            label: subSubCategory.formatted_name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching sub-subcategories:", error);
      });
  };


  // Handler for selecting a work subcategory
  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);

  };

  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusChangeFilter = (selectedOption) => {
    setSelectedStatus(selectedOption);
    console.log('Selected Status:', selectedOption);
  };

  const [expandAll, setExpandAll] = useState(false);
  const handleApplyFilters = () => {

    const categoryId = selectedCategory?.value || "";
    const subCategoryId = selectedSubCategory?.value || "";
    const inventoryTypeId = selectedInventory?.value || ""
    const inventoryMaterialId = selectedInventoryMaterialTypes?.value || ""
    const status = selectedStatus?.value || "";
    const unitId = selectedUnit?.value || "";
    console.log("filter ids:", categoryId, subCategoryId, status, inventoryTypeId, inventoryMaterialId)

    const search = searchKeyword || "";
    console.log("search", search)

    setLoading(true); // Set loading to true before making the request

    axios
      .get(
        `${baseURL}boq_details.json?q[work_category_id]=${categoryId}&q[work_sub_category_id]=${subCategoryId}&q[status]=${status}&q[inventory_id]=${inventoryMaterialId}&q[inventory_type_id]=${inventoryTypeId}&search=${search}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        // https://marathon.lockated.com/boq_details.json?q[work_category_id]=&q[work_sub_category_id]=&q[status]=approved&q[inventory_id]=&q[inventory_type_id]=&search=FINES&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414
      )
      .then((response) => {
        setBoqList(response.data); // Set the fetched data to state
        setTotalPages(response.data?.pagination.total_pages); // Update total pages
        setTotalEntries(response.data?.pagination.total_entries); // Update total entries
        console.log("filterrrrr", response.data)


        const projects = response.data.projects || [];

        const openStates = [];

        projects.forEach((project) => {
          if (!project?.id) return;

          const subProject = project.sub_projects?.[0];
          const category = subProject?.categories?.[0];

          // ✅ Skip if subProject or category is not present
          if (!subProject || !category) return;

          openStates.push({
            projectId: project.id,
            subProjectId: subProject.id,
            categoryId: category.id,
            subCategory2Id: category?.sub_categories_2?.[0]?.id || null,
            subCategory3Id: category?.sub_categories_2?.[0]?.sub_categories_3?.[0]?.id || null,
            subCategory4Id: category?.sub_categories_2?.[0]?.sub_categories_3?.[0]?.sub_categories_4?.[0]?.id || null,
            subCategory5Id: category?.sub_categories_2?.[0]?.sub_categories_3?.[0]?.sub_categories_4?.[0]?.sub_categories_5?.[0]?.id || null,
          });
        });

        openStates.forEach((state, index) => {
          setTimeout(() => {
            console.log(`Opening item ${index + 1}`, state);
            setOpenProjectId(state.projectId);
            setOpenSubProjectId(state.subProjectId);
            setOpenCategoryId(state.categoryId);
            setOpenSubCategory2Id(state.subCategory2Id);
            setOpenSubCategory3Id(state.subCategory3Id);
            setOpenSubCategory4Id(state.subCategory4Id);
            setOpenSubCategory5Id(state.subCategory5Id);
          }, index * 500);
        });



        setExpandAll(true)
        setShow(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading when request completes
      });

  };



  // useEffect(() => {
  //   axios
  //     .get(
  //       `${baseURL}work_categories.json?search=${searchKeyword}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //     ) // Replace with your API endpoint
  //     .then((response) => {
  //       setBoqList(response.data); // Save the categories to state
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching search", error);
  //     });
  // }, [searchKeyword]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedStatus(null);
    setSelectedUnit(null);
    setSelectedInventory(null)
    setSelectedInventoryMaterialTypes(null)
    // Optionally, reset other states like `searchKeyword` if needed
    // console.log("Filters reset");
  };

  // material type options 
  const [inventoryTypes, setInventoryTypes] = useState([]);  // State to hold the fetched data
  const [selectedInventory, setSelectedInventory] = useState(null);  // State to hold selected inventory type
  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubType, setSelectedSubType] = useState(null); // State to hold selected sub-type
  const [inventoryMaterialTypes, setInventoryMaterialTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedInventoryMaterialTypes, setSelectedInventoryMaterialTypes] = useState(null); // State to hold selected sub-type

  // Fetching inventory types data from API on component mount
  useEffect(() => {
    axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then(response => {
        // Map the fetched data to the format required by react-select
        const options = response.data.map(inventory => ({
          value: inventory.id,
          label: inventory.name
        }));
        setInventoryTypes(options);  // Set the inventory types to state
      })
      .catch(error => {
        console.error('Error fetching inventory types:', error);
      });
  }, []);  // Empty dependency array to run only once on mount

  // Handler for inventory type selection change
  const handleInventoryChange = (selectedOption) => {
    setSelectedInventory(selectedOption); // Set the selected inventory type
    setSelectedSubType(null); // Clear the selected sub-type when inventory type changes
    setInventorySubTypes([]); // Reset the sub-types list
    setInventoryMaterialTypes([])
    setSelectedInventoryMaterialTypes(null)
  };
  // / Fetch inventory Material when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      console.log("selected inventory:", selectedInventory)
      // const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

      axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${selectedInventory.value}&q[material_category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then(response => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map(subType => ({
            value: subType.id,
            label: subType.name
          }));
          setInventoryMaterialTypes(options); // Set the fetched sub-types to state
        })
        .catch(error => {
          console.error('Error fetching inventory sub-types:', error);
        });
    }
  }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes

  // Handler for inventory Material selection change
  const handleInventoryMaterialTypeChange = (selectedOption) => {
    setSelectedInventoryMaterialTypes(selectedOption); // Set the selected inventory sub-type
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!file) return;
    console.log("file:", file)
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result.split(",")[1];
      console.log("base64String:", base64String)
      try {
        const response = await axios.post(
          `${baseURL}boq_details/import.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
          { file: base64String },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          console.log("Upload response:", response.data);
          toast.success(response.data.message);
          // alert("File uploaded successfully!");
        }
        setShowModal(false);
        setFile(null);
      } catch (error) {

        // if (error.response && error.response.status === 422) {
        //   console.log("422 response:", error.response.data);
        //   if (Array.isArray(error.response.data.errors)) {
        //     error.response.data.errors.forEach(errObj => {
        //       toast.error(`${errObj.error}`);
        //     });
        //   } else if (typeof error.response.data.errors === "string") {
        //     toast.error(error.response.data.errors);
        //   }
        // } else {
        //   console.error(error);
        // }
        if (error.response && error.response.status === 422) {
          console.log("422 response:", error.response.data);
          if (Array.isArray(error.response.data.errors)) {
            const firstError = error.response.data.errors[0];
            if (firstError && firstError.error) {
              toast.error(`${firstError.error}`);
            }
          } else if (typeof error.response.data.errors === "string") {
            toast.error(error.response.data.errors);
          }
        } else {
          console.error(error);
        }
        //   alert("File upload failed!");
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>

      {loading2 ? (
        // <div className="loading-container">
        //   <div className="spinner"></div> {/* Spinner element */}
        //   <p style={{ fontSize:"18px",fontWeight:"400px"}}>Loading...</p>
        // </div>
        <div id="full-screen-loader" className="full-screen-loader">
          <div className="loader-container">
            <img
              src="https://newerp.marathonrealty.com/assets/loader.gif"
              alt="Loading..."
              width={50}
            />
            <h5>Please wait</h5>
          </div>
        </div>

      ) : (

        <div className="website-content">
          <div className="module-data-section p-4">
            <a href="" style={{ color: 'black' }}>Home &gt; Engineering  &gt; BOQ List</a>
            {/* <h5 className="mt-4">BOQ</h5> */}
            <div className="d-flex justify-content-end mt-4">
              {/* <button className="purple-btn2" onClick={handleClick}>
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
              <span> Create BOQ</span>
            </button> */}
              {/* <button className="purple-btn2">Import</button>
            <button className="purple-btn2">Export</button>
            <button className="purple-btn2">Delete</button> */}
              {/* <button
              className="purple-btn2"
              // data-bs-toggle="modal"
              // data-bs-target="#copyModal"
              // onClick={openCopyModal}
              onClick={handleShow}
            >
              Copy
            </button> */}
            </div>
            {/* <div className="tab-content1 active" id="total-content"> */}
            {/* Total Content Here */}


            <div className="card mt-2 There is no selected portion. The entire code file is provided. If you could specify the portion of the code you would like me to improve, I can help you with that.mb-5 ">
              <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
                <div className="card-body mt-0 pt-0">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Project <span>*</span></label>
                        <SingleSelector
                          options={projectOptions}
                          onChange={handleProjectChange}
                          value={selectedProject}
                          placeholder={`Select Project`} // Dynamic placeholder
                        />
                        {errors.project && (
                          <div className="error-message">{errors.project}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={siteOptions}
                          onChange={handleSiteChange}
                          value={selectedSite}
                          placeholder={`Select Sub-project`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
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
                    <div className="col-md-3">
                      <button type="" className="purple-btn2 mt-4" onClick={handleGoClick}>
                        Go
                      </button>
                    </div>
                  </div>
                  {/* <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Main Category</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Main Category`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 2</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 2`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 3</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 3`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 4</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 4`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 5</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 5`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                </div> */}
                  {/* <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ Name</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select BOQ Name`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ ID</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ Description</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Status`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>From Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>To Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="d-flex">
                      <div className="form-group d-flex mt-1">
                        <label className="form-check-label me-3">
                          View BOQ Version List
                        </label>
                        <div className="form-check pe-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select BOQ Version`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                </div>

                {/* <BulkAction /> */}

              </CollapsibleCard>

              <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
                <form
                  onSubmit={handleSubmit}
                >
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        {/* <select
                        name="fromStatus"
                        className="form-control form-select"
                         classNamePrefix="react-select"
                        value={fromStatus}
                        onChange={handleStatusChange}
                      // value={formValues.fromStatus}
                      // onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select> */}
                        {/* {errors.fromStatus && <div className="text-danger mt-2">{errors.fromStatus}</div>} */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          value={options.find(option => option.value === fromStatus)}
                          onChange={handleStatusChange}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                        {/* {console.log("options:", options.value)} */}
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        {/* <select
                        name="toStatus"
                        className="form-control form-select"
                        value={toStatus}
                        onChange={handleToStatusChange}
                      >
                        <option value="">Select Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select> */}

                        <SingleSelector
                          options={options}
                          // value={options.value}
                          onChange={handleToStatusChange}
                          value={options.find(option => option.value === toStatus)}
                          // onChange={handleStatusChange}
                          // options.find(option => option.value === status)
                          // value={filteredOptions.find(option => option.value === status)}
                          // value={options.find(option => option.value === status)}
                          // value={selectedSite}
                          placeholder={`Select Status`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
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
                          value={remark}
                          onChange={handleRemarkChange}
                        />
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

              {/* <BOQListTable boqList={boqList} setBoqList={setBoqList} /> */}

              {/* boq list table is here  start */}

              <div className="d-flex justify-content-between align-items-center me-2 mt-4">
                {/* Search Input */}
                <div className="col-md-4">
                  <form>
                    <div className="input-group ms-3">
                      <input
                        type="search"
                        id="searchInput"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)} // <- Add this line
                        className="form-control tbl-search"
                        placeholder="Type your keywords here"
                      />
                      <div className="input-group-append">
                        <button type="button" className="btn btn-md btn-default" onClick={handleApplyFilters} >
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
                <div className="col-md-6">
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    {/* Filter Icon */}
                    <button className="btn btn-md btn-default" onClick={handleModalShow}>
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
                    </button>
                    <button className="purple-btn2" onClick={() => setShowModal(true)}>Bulk Upload</button>
                    {/* Reset Button */}
                    <button className="purple-btn2" onClick={handleClickCollapse}>Reset</button>

                    {/* Create BOQ Button */}
                    <button className="purple-btn2" onClick={handleClick}>
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
                      <span> Create BOQ</span>
                    </button>
                  </div>
                </div>
              </div>


              <div className="mx-3">
                <div className="tbl-container mt-1">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr.No.</th>
                        <th className="text-start"> <input className="ms-1 me-1 mb-1" type="checkbox" /></th>
                        <th className="text-start">Expand</th>
                        <th className="text-start">Project/Sub-Project</th>
                        <th className="text-start">BOQ ID</th>
                        <th className="text-start">Unit</th>
                        <th className="text-start">Cost Qty</th>
                        <th className="text-start">Cost Rate</th>
                        <th className="text-start">Cost Value</th>
                        <th className="text-start">

                          Status

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {boqList && boqList.projects && boqList.projects.map((project, index) => (
                        <React.Fragment key={project.id}>

                          <tr>
                            <td>
                              {/* {index + 1} */}
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td>
                              {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                            </td>
                            <td>
                              <button
                                className="btn btn-link p-0"
                                // onClick={handleSubProject}
                                // onClick={() => toggleProject(project.id)}
                                onClick={() => {
                                  toggleProject(project.id); // disable manual toggle when auto-expand is active
                                }}
                                aria-label="Toggle row visibility"
                              >
                                {openProjectId === project.id ?
                                  (
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
                                      fill=" #e0e0e0"
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

                          </tr>
                          {/* subProject  start */}

                          {openProjectId === project.id && project.sub_projects && project.sub_projects.map((subProject) => (
                            <React.Fragment key={subProject.id}>
                              <tr>
                                <td></td>
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

                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill=" #e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                          {/* Square */}
                                          <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                          {/* Circle */}
                                          {/* <circle cx="12" cy="12" r="9" /> */}
                                          {/* Minus Icon (for when toggled) */}
                                          <line x1="8" y1="12" x2="16" y2="12" />
                                        </svg>
                                        //   <svg
                                        //   xmlns="http://www.w3.org/2000/svg"
                                        //   width="16"
                                        //   height="16"
                                        //   fill="black"
                                        //   className="bi bi-caret-up"
                                        //   viewBox="0 0 16 16"
                                        // >
                                        //   <path d="M3.204 9h9.592L8 4.48 3.204 9z" />

                                        // </svg>
                                      ) : (

                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill=" #e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                          {/* Square */}
                                          <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                          {/* Circle */}
                                          {/* <circle cx="12" cy="12" r="9" /> */}
                                          {/* Plus Icon */}
                                          <line x1="12" y1="8" x2="12" y2="16" />
                                          <line x1="8" y1="12" x2="16" y2="12" />
                                        </svg>

                                        //   <svg
                                        //   xmlns="http://www.w3.org/2000/svg"
                                        //   width="16"
                                        //   height="16"
                                        //   fill="black"
                                        //   className="bi bi-caret-up"
                                        //   viewBox="0 0 16 16"
                                        // >
                                        //   <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                        // </svg>
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
                                {/* <td className="text-start">
                               
                              </td> */}
                                <td></td>

                              </tr>

                              {/* Conditional rendering for categories under sub-project start */}
                              {openSubProjectId === subProject.id && subProject.categories && subProject.categories.length > 0 && (
                                subProject.categories.map((category) => (
                                  <React.Fragment key={category.id}>
                                    <tr>
                                      <td></td>
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
                                    {/* main start  */}
                                    {openCategoryId === category.id && category.boq_details && category.boq_details.length > 0 && (
                                      category.boq_details.map((boqDetail2) => (
                                        <React.Fragment key={boqDetail2.id}>
                                          <tr>
                                            <td></td>
                                            <td>
                                              {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                              <input
                                                className="ms-1 me-1 mb-1"
                                                type="checkbox"
                                                checked={selectedBoqDetails.includes(boqDetail2.id)} // Check if this ID is selected
                                                onChange={() => handleCheckboxChange(boqDetail2.id)} // Handle checkbox change
                                              />
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
                                                <span style={{ color: ' #8b0203', textDecoration: 'underline' }}> {boqDetail2.id}</span>
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
                                                {/* {boqDetail2.status} */}
                                                {/* {boqDetail2.status ? boqDetail2.status.charAt(0).toUpperCase() + boqDetail2.status.slice(1) : ""} */}
                                                {boqDetail2.list_status}
                                              </div>
                                            </td>
                                          </tr>
                                          {/* Render Materials Table for BOQ Detail in Sub-Category */}
                                          {openBoqDetailId === boqDetail2.id && (
                                            <React.Fragment>
                                              <tr>
                                                <td colSpan={13}>
                                                  <div className="m-3">
                                                    {/* Check if BOQ Sub Items are present */}
                                                    {boqDetail2?.boq_sub_items && boqDetail2.boq_sub_items.length > 0 ? (
                                                      <div className="tbl-container mt-1">
                                                        <table className="w-100">
                                                          <thead>
                                                            <tr colSpan={13}>
                                                              <th className="text-start">Sr.No.</th>
                                                              <th className="text-start">Expand</th>
                                                              <th className="text-start">Sub Item Name</th>
                                                              <th className="text-start">Description</th>
                                                              <th className="text-start">Notes</th>
                                                              <th className="text-start">Remarks</th>
                                                              <th className="text-start">UOM</th>
                                                              <th className="text-start">Quantity</th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {boqDetail2.boq_sub_items.map((boqSubItem, index) => (
                                                              <React.Fragment key={boqSubItem.id}>
                                                                <tr>
                                                                  <td className="text-start">{index + 1}</td>
                                                                  <td className="text-start">
                                                                    <button
                                                                      className="btn btn-link p-0"
                                                                      onClick={() => toggleBoqDetailSub1(boqSubItem.id)}
                                                                    >
                                                                      {openBoqDetailIdSub === boqSubItem.id ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                          <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                          <line x1="8" y1="12" x2="16" y2="12" />
                                                                        </svg>
                                                                      ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                          <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                          <line x1="12" y1="8" x2="12" y2="16" />
                                                                          <line x1="8" y1="12" x2="16" y2="12" />
                                                                        </svg>
                                                                      )}
                                                                    </button>
                                                                  </td>
                                                                  <td className="text-start">{boqSubItem.name}</td>
                                                                  <td className="text-start">{boqSubItem.description}</td>
                                                                  <td className="text-start">{boqSubItem.notes}</td>
                                                                  <td className="text-start">{boqSubItem.remarks}</td>
                                                                  <td className="text-start">{boqSubItem.uom}</td>
                                                                  <td className="text-start">{boqSubItem.cost_quantity}</td>
                                                                </tr>

                                                                {/* Render Materials and Assets Table if BOQ Sub Item is Expanded */}
                                                                {openBoqDetailIdSub === boqSubItem.id && (boqSubItem?.materials || boqSubItem?.assets) && (
                                                                  <React.Fragment>
                                                                    <tr>
                                                                      <td colSpan={13}>
                                                                        <div>
                                                                          <CollapsibleCard title="Materials">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Sr.No</th>
                                                                                      <th rowSpan={2}>Material Type</th>
                                                                                      <th rowSpan={2}>Material</th>
                                                                                      <th rowSpan={2}>Material Sub-Type</th>
                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
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
                                                                                    {boqSubItem?.materials?.map((material, index) => (
                                                                                      <tr key={material.id}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{material.material_type}</td>
                                                                                        <td>{material.material_name}</td>
                                                                                        <td>{material.material_sub_type}</td>
                                                                                        <td>{material.generic_info}</td>
                                                                                        <td>{material.color}</td>
                                                                                        <td>{material.brand}</td>
                                                                                        <td>{material.uom}</td>
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

                                                                          <CollapsibleCard title="Assets">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Sr.No</th>
                                                                                      <th rowSpan={2}>Asset Type</th>
                                                                                      <th rowSpan={2}>Asset</th>
                                                                                      <th rowSpan={2}>Asset Sub-Type</th>
                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
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
                                                                                    {boqSubItem.assets?.map((asset, index) => (
                                                                                      <tr key={asset.id}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{asset.material_type}</td>
                                                                                        <td>{asset.material_name}</td>
                                                                                        <td>{asset.material_sub_type}</td>
                                                                                        <td>{asset.generic_info}</td>
                                                                                        <td>{asset.color}</td>
                                                                                        <td>{asset.brand}</td>
                                                                                        <td>{asset.uom}</td>
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
                                                            ))}
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    ) : (
                                                      <div>
                                                        {/* Render Materials and Assets Card when no Sub Items */}
                                                        <CollapsibleCard title="Materials">
                                                          <div className="card-body mt-0 pt-0">
                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                              <table className="w-100">
                                                                <thead>
                                                                  <tr>
                                                                    <th rowSpan={2}>Sr.No</th>
                                                                    <th rowSpan={2}>Material Type</th>
                                                                    <th rowSpan={2}>Material</th>
                                                                    <th rowSpan={2}>Material Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour</th>
                                                                    <th rowSpan={2}>Brand</th>
                                                                    <th rowSpan={2}>UOM</th>
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
                                                                  {boqDetail2?.materials?.map((material, index) => (
                                                                    <tr key={material.id}>
                                                                      <td>{index + 1}</td>
                                                                      <td>{material.material_type}</td>
                                                                      <td>{material.material_name}</td>
                                                                      <td>{material.material_sub_type}</td>
                                                                      <td>{material.generic_info}</td>
                                                                      <td>{material.color}</td>
                                                                      <td>{material.brand}</td>
                                                                      <td>{material.uom}</td>
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

                                                        <CollapsibleCard title="Assets">
                                                          <div className="card-body mt-0 pt-0">
                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                              <table className="w-100">
                                                                <thead>
                                                                  <tr>
                                                                    <th rowSpan={2}>Sr.No</th>
                                                                    <th rowSpan={2}>Asset Type</th>
                                                                    <th rowSpan={2}>Asset</th>
                                                                    <th rowSpan={2}>Asset Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour</th>
                                                                    <th rowSpan={2}>Brand</th>
                                                                    <th rowSpan={2}>UOM</th>
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
                                                                  {boqDetail2?.assets?.map((asset, index) => (
                                                                    <tr key={asset.id}>
                                                                      <td>{index + 1}</td>
                                                                      <td>{asset.material_type}</td>
                                                                      <td>{asset.material_name}</td>
                                                                      <td>{asset.material_sub_type}</td>
                                                                      <td>{asset.generic_info}</td>
                                                                      <td>{asset.color}</td>
                                                                      <td>{asset.brand}</td>
                                                                      <td>{asset.uom}</td>
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
                                                    )}
                                                  </div>
                                                </td>
                                              </tr>
                                            </React.Fragment>
                                          )}
                                          {/* Render Materials Table for BOQ Detail in Sub-Category */}





                                        </React.Fragment>
                                      ))
                                    )}

                                    {/* main end  */}

                                    {/* sub level 2 start */}
                                    {openCategoryId === category.id && category.sub_categories_2 && category.sub_categories_2.length > 0 && (
                                      category.sub_categories_2.map((subCategory) => (
                                        <React.Fragment key={subCategory.id}>
                                          <tr>
                                            <td></td>
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
                                                  <td></td>
                                                  <td>
                                                    {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                    <input
                                                      className="ms-1 me-1 mb-1"
                                                      type="checkbox"
                                                      checked={selectedBoqDetails.includes(boqDetail2.id)} // Check if this ID is selected
                                                      onChange={() => handleCheckboxChange(boqDetail2.id)} // Handle checkbox change
                                                    />
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
                                                      <span style={{ color: ' #8b0203', textDecoration: 'underline' }}> {boqDetail2.id}</span>
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
                                                      {/* {boqDetail2.status} */}
                                                      {/* {boqDetail2.status ? boqDetail2.status.charAt(0).toUpperCase() + boqDetail2.status.slice(1) : ""} */}
                                                      {boqDetail2.list_status}
                                                    </div>
                                                  </td>
                                                </tr>


                                                {/* Render Materials Table for BOQ Detail in Sub-Category  */}
                                                {/* sub start  */}




                                                {/* Render Materials Table for BOQ Detail in Sub-Category */}
                                                {openBoqDetailId === boqDetail2.id && (
                                                  <React.Fragment>
                                                    <tr>
                                                      <td colSpan={13}>
                                                        <div className="m-3">
                                                          {/* Check if BOQ Sub Items are present */}
                                                          {boqDetail2?.boq_sub_items && boqDetail2.boq_sub_items.length > 0 ? (
                                                            <div className="tbl-container mt-1">
                                                              <table className="w-100">
                                                                <thead>
                                                                  <tr colSpan={13}>
                                                                    <th className="text-start">Sr.No.</th>
                                                                    <th className="text-start">Expand</th>
                                                                    <th className="text-start">Sub Item Name</th>
                                                                    <th className="text-start">Description</th>
                                                                    <th className="text-start">Notes</th>
                                                                    <th className="text-start">Remarks</th>
                                                                    <th className="text-start">UOM</th>
                                                                    <th className="text-start">Quantity</th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {boqDetail2.boq_sub_items.map((boqSubItem, index) => (
                                                                    <React.Fragment key={boqSubItem.id}>
                                                                      <tr>
                                                                        <td className="text-start">{index + 1}</td>
                                                                        <td className="text-start">
                                                                          <button
                                                                            className="btn btn-link p-0"
                                                                            onClick={() => toggleBoqDetailSub1(boqSubItem.id)}
                                                                          >
                                                                            {openBoqDetailIdSub === boqSubItem.id ? (
                                                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                              </svg>
                                                                            ) : (
                                                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                              </svg>
                                                                            )}
                                                                          </button>
                                                                        </td>
                                                                        <td className="text-start">{boqSubItem.name}</td>
                                                                        <td className="text-start">{boqSubItem.description}</td>
                                                                        <td className="text-start">{boqSubItem.notes}</td>
                                                                        <td className="text-start">{boqSubItem.remarks}</td>
                                                                        <td className="text-start">{boqSubItem.uom}</td>
                                                                        <td className="text-start">{boqSubItem.cost_quantity}</td>
                                                                      </tr>

                                                                      {/* Render Materials and Assets Table if BOQ Sub Item is Expanded */}
                                                                      {openBoqDetailIdSub === boqSubItem.id && (boqSubItem?.materials || boqSubItem?.assets) && (
                                                                        <React.Fragment>
                                                                          <tr>
                                                                            <td colSpan={13}>
                                                                              <div>
                                                                                <CollapsibleCard title="Materials">
                                                                                  <div className="card-body mt-0 pt-0">
                                                                                    <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                      <table className="w-100">
                                                                                        <thead>
                                                                                          <tr>
                                                                                            <th rowSpan={2}>Sr.No</th>
                                                                                            <th rowSpan={2}>Material Type</th>
                                                                                            <th rowSpan={2}>Material</th>
                                                                                            <th rowSpan={2}>Material Sub-Type</th>
                                                                                            <th rowSpan={2}>Generic Specification</th>
                                                                                            <th rowSpan={2}>Colour</th>
                                                                                            <th rowSpan={2}>Brand</th>
                                                                                            <th rowSpan={2}>UOM</th>
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
                                                                                          {boqSubItem?.materials?.map((material, index) => (
                                                                                            <tr key={material.id}>
                                                                                              <td>{index + 1}</td>
                                                                                              <td>{material.material_type}</td>
                                                                                              <td>{material.material_name}</td>
                                                                                              <td>{material.material_sub_type}</td>
                                                                                              <td>{material.generic_info}</td>
                                                                                              <td>{material.color}</td>
                                                                                              <td>{material.brand}</td>
                                                                                              <td>{material.uom}</td>
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

                                                                                <CollapsibleCard title="Assets">
                                                                                  <div className="card-body mt-0 pt-0">
                                                                                    <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                      <table className="w-100">
                                                                                        <thead>
                                                                                          <tr>
                                                                                            <th rowSpan={2}>Sr.No</th>
                                                                                            <th rowSpan={2}>Asset Type</th>
                                                                                            <th rowSpan={2}>Asset</th>
                                                                                            <th rowSpan={2}>Asset Sub-Type</th>
                                                                                            <th rowSpan={2}>Generic Specification</th>
                                                                                            <th rowSpan={2}>Colour</th>
                                                                                            <th rowSpan={2}>Brand</th>
                                                                                            <th rowSpan={2}>UOM</th>
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
                                                                                          {boqSubItem.assets?.map((asset, index) => (
                                                                                            <tr key={asset.id}>
                                                                                              <td>{index + 1}</td>
                                                                                              <td>{asset.material_type}</td>
                                                                                              <td>{asset.material_name}</td>
                                                                                              <td>{asset.material_sub_type}</td>
                                                                                              <td>{asset.generic_info}</td>
                                                                                              <td>{asset.color}</td>
                                                                                              <td>{asset.brand}</td>
                                                                                              <td>{asset.uom}</td>
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
                                                                  ))}
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          ) : (
                                                            <div>
                                                              {/* Render Materials and Assets Card when no Sub Items */}
                                                              <CollapsibleCard title="Materials">
                                                                <div className="card-body mt-0 pt-0">
                                                                  <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                    <table className="w-100">
                                                                      <thead>
                                                                        <tr>
                                                                          <th rowSpan={2}>Sr.No</th>
                                                                          <th rowSpan={2}>Material Type</th>
                                                                          <th rowSpan={2}>Material</th>
                                                                          <th rowSpan={2}>Material Sub-Type</th>
                                                                          <th rowSpan={2}>Generic Specification</th>
                                                                          <th rowSpan={2}>Colour</th>
                                                                          <th rowSpan={2}>Brand</th>
                                                                          <th rowSpan={2}>UOM</th>
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
                                                                        {boqDetail2?.materials?.map((material, index) => (
                                                                          <tr key={material.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{material.material_type}</td>
                                                                            <td>{material.material_name}</td>
                                                                            <td>{material.material_sub_type}</td>
                                                                            <td>{material.generic_info}</td>
                                                                            <td>{material.color}</td>
                                                                            <td>{material.brand}</td>
                                                                            <td>{material.uom}</td>
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

                                                              <CollapsibleCard title="Assets">
                                                                <div className="card-body mt-0 pt-0">
                                                                  <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                    <table className="w-100">
                                                                      <thead>
                                                                        <tr>
                                                                          <th rowSpan={2}>Sr.No</th>
                                                                          <th rowSpan={2}>Asset Type</th>
                                                                          <th rowSpan={2}>Asset</th>
                                                                          <th rowSpan={2}>Asset Sub-Type</th>
                                                                          <th rowSpan={2}>Generic Specification</th>
                                                                          <th rowSpan={2}>Colour</th>
                                                                          <th rowSpan={2}>Brand</th>
                                                                          <th rowSpan={2}>UOM</th>
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
                                                                        {boqDetail2?.assets?.map((asset, index) => (
                                                                          <tr key={asset.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{asset.material_type}</td>
                                                                            <td>{asset.material_name}</td>
                                                                            <td>{asset.material_sub_type}</td>
                                                                            <td>{asset.generic_info}</td>
                                                                            <td>{asset.color}</td>
                                                                            <td>{asset.brand}</td>
                                                                            <td>{asset.uom}</td>
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
                                                          )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  </React.Fragment>
                                                )}
                                                {/* Render Materials Table for BOQ Detail in Sub-Category */}





                                              </React.Fragment>
                                            ))
                                          )}

                                          {/* ................. */}


                                          {/* Render Sub-Category 3 for each Sub-Category 2 */}
                                          {openSubCategory2Id === subCategory.id && subCategory.sub_categories_3 && subCategory.sub_categories_3.length > 0 && (
                                            subCategory.sub_categories_3.map((subCategory3) => (
                                              <React.Fragment key={subCategory3.id}>
                                                <tr>
                                                  <td></td>
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
                                                        {console.log("sub3:", subCategory3)}
                                                        <td></td>
                                                        <td>
                                                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                          <input
                                                            className="ms-1 me-1 mb-1"
                                                            type="checkbox"
                                                            checked={selectedBoqDetails.includes(boqDetail3.id)} // Check if this ID is selected
                                                            onChange={() => handleCheckboxChange(boqDetail3.id)} // Handle checkbox change
                                                          />
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
                                                        <td className="text-start" >
                                                          <Link to={`/boq-details-page-master/${boqDetail3.id}`}>
                                                            <span style={{ color: ' #8b0203', textDecoration: 'underline' }}>{boqDetail3.id}</span>
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
                                                            {/* {boqDetail3.status} */}
                                                            {/* {boqDetail3.status ? boqDetail3.status.charAt(0).toUpperCase() + boqDetail3.status.slice(1) : ""} */}
                                                            {boqDetail3.list_status}
                                                          </div>
                                                        </td>
                                                      </tr>

                                                      {/* Render Materials Table for BOQ Detail in Sub-Category 3 */}


                                                      {/* Render Materials Table for BOQ Detail in Sub-Category */}
                                                      {openBoqDetailId1 === boqDetail3.id && (
                                                        <React.Fragment>
                                                          <tr>
                                                            <td colSpan={13}>
                                                              <div className="m-3">
                                                                {/* Check if BOQ Sub Items are present */}
                                                                {boqDetail3?.boq_sub_items && boqDetail3.boq_sub_items.length > 0 ? (
                                                                  <div className="tbl-container mt-1">
                                                                    <table className="w-100">
                                                                      <thead>
                                                                        <tr colSpan={13}>
                                                                          <th className="text-start">Sr.No.</th>
                                                                          <th className="text-start">Expand</th>
                                                                          <th className="text-start">Sub Item Name</th>
                                                                          <th className="text-start">Description</th>
                                                                          <th className="text-start">Notes</th>
                                                                          <th className="text-start">Remarks</th>
                                                                          <th className="text-start">UOM</th>
                                                                          <th className="text-start">Quantity</th>
                                                                        </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                        {boqDetail3.boq_sub_items.map((boqSubItem, index) => (
                                                                          <React.Fragment key={boqSubItem.id}>
                                                                            <tr>
                                                                              <td className="text-start">{index + 1}</td>
                                                                              <td className="text-start">
                                                                                <button
                                                                                  className="btn btn-link p-0"
                                                                                  onClick={() => toggleBoqDetailSub1(boqSubItem.id)}
                                                                                >
                                                                                  {openBoqDetailIdSub === boqSubItem.id ? (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                      <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                      <line x1="8" y1="12" x2="16" y2="12" />
                                                                                    </svg>
                                                                                  ) : (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                      <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                      <line x1="12" y1="8" x2="12" y2="16" />
                                                                                      <line x1="8" y1="12" x2="16" y2="12" />
                                                                                    </svg>
                                                                                  )}
                                                                                </button>
                                                                              </td>
                                                                              <td className="text-start">{boqSubItem.name}</td>
                                                                              <td className="text-start">{boqSubItem.description}</td>
                                                                              <td className="text-start">{boqSubItem.notes}</td>
                                                                              <td className="text-start">{boqSubItem.remarks}</td>
                                                                              <td className="text-start">{boqSubItem.uom}</td>
                                                                              <td className="text-start">{boqSubItem.cost_quantity}</td>
                                                                            </tr>

                                                                            {/* Render Materials and Assets Table if BOQ Sub Item is Expanded */}
                                                                            {openBoqDetailIdSub === boqSubItem.id && (boqSubItem?.materials || boqSubItem?.assets) && (
                                                                              <React.Fragment>
                                                                                <tr>
                                                                                  <td colSpan={13}>
                                                                                    <div>
                                                                                      <CollapsibleCard title="Materials">
                                                                                        <div className="card-body mt-0 pt-0">
                                                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                            <table className="w-100">
                                                                                              <thead>
                                                                                                <tr>
                                                                                                  <th rowSpan={2}>Sr.No</th>
                                                                                                  <th rowSpan={2}>Material Type</th>
                                                                                                  <th rowSpan={2}>Material</th>
                                                                                                  <th rowSpan={2}>Material Sub-Type</th>
                                                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                                                  <th rowSpan={2}>Colour</th>
                                                                                                  <th rowSpan={2}>Brand</th>
                                                                                                  <th rowSpan={2}>UOM</th>
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
                                                                                                {boqSubItem?.materials?.map((material, index) => (
                                                                                                  <tr key={material.id}>
                                                                                                    <td>{index + 1}</td>
                                                                                                    <td>{material.material_type}</td>
                                                                                                    <td>{material.material_name}</td>
                                                                                                    <td>{material.material_sub_type}</td>
                                                                                                    <td>{material.generic_info}</td>
                                                                                                    <td>{material.color}</td>
                                                                                                    <td>{material.brand}</td>
                                                                                                    <td>{material.uom}</td>
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

                                                                                      <CollapsibleCard title="Assets">
                                                                                        <div className="card-body mt-0 pt-0">
                                                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                            <table className="w-100">
                                                                                              <thead>
                                                                                                <tr>
                                                                                                  <th rowSpan={2}>Sr.No</th>
                                                                                                  <th rowSpan={2}>Asset Type</th>
                                                                                                  <th rowSpan={2}>Asset</th>
                                                                                                  <th rowSpan={2}>Asset Sub-Type</th>
                                                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                                                  <th rowSpan={2}>Colour</th>
                                                                                                  <th rowSpan={2}>Brand</th>
                                                                                                  <th rowSpan={2}>UOM</th>
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
                                                                                                {boqSubItem.assets?.map((asset, index) => (
                                                                                                  <tr key={asset.id}>
                                                                                                    <td>{index + 1}</td>
                                                                                                    <td>{asset.material_type}</td>
                                                                                                    <td>{asset.material_name}</td>
                                                                                                    <td>{asset.material_sub_type}</td>
                                                                                                    <td>{asset.generic_info}</td>
                                                                                                    <td>{asset.color}</td>
                                                                                                    <td>{asset.brand}</td>
                                                                                                    <td>{asset.uom}</td>
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
                                                                        ))}
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                                                ) : (
                                                                  <div>
                                                                    {/* Render Materials and Assets Card when no Sub Items */}
                                                                    <CollapsibleCard title="Materials">
                                                                      <div className="card-body mt-0 pt-0">
                                                                        <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                          <table className="w-100">
                                                                            <thead>
                                                                              <tr>
                                                                                <th rowSpan={2}>Sr.No</th>
                                                                                <th rowSpan={2}>Material Type</th>
                                                                                <th rowSpan={2}>Material</th>
                                                                                <th rowSpan={2}>Material Sub-Type</th>
                                                                                <th rowSpan={2}>Generic Specification</th>
                                                                                <th rowSpan={2}>Colour</th>
                                                                                <th rowSpan={2}>Brand</th>
                                                                                <th rowSpan={2}>UOM</th>
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
                                                                              {boqDetail3?.materials?.map((material, index) => (
                                                                                <tr key={material.id}>
                                                                                  <td>{index + 1}</td>
                                                                                  <td>{material.material_type}</td>
                                                                                  <td>{material.material_name}</td>
                                                                                  <td>{material.material_sub_type}</td>
                                                                                  <td>{material.generic_info}</td>
                                                                                  <td>{material.color}</td>
                                                                                  <td>{material.brand}</td>
                                                                                  <td>{material.uom}</td>
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

                                                                    <CollapsibleCard title="Assets">
                                                                      <div className="card-body mt-0 pt-0">
                                                                        <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                          <table className="w-100">
                                                                            <thead>
                                                                              <tr>
                                                                                <th rowSpan={2}>Sr.No</th>
                                                                                <th rowSpan={2}>Asset Type</th>
                                                                                <th rowSpan={2}>Asset</th>
                                                                                <th rowSpan={2}>Asset Sub-Type</th>
                                                                                <th rowSpan={2}>Generic Specification</th>
                                                                                <th rowSpan={2}>Colour</th>
                                                                                <th rowSpan={2}>Brand</th>
                                                                                <th rowSpan={2}>UOM</th>
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
                                                                              {boqDetail3?.assets?.map((asset, index) => (
                                                                                <tr key={asset.id}>
                                                                                  <td>{index + 1}</td>
                                                                                  <td>{asset.material_type}</td>
                                                                                  <td>{asset.material_name}</td>
                                                                                  <td>{asset.material_sub_type}</td>
                                                                                  <td>{asset.generic_info}</td>
                                                                                  <td>{asset.color}</td>
                                                                                  <td>{asset.brand}</td>
                                                                                  <td>{asset.uom}</td>
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
                                                                )}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        </React.Fragment>
                                                      )}





                                                    </React.Fragment>
                                                  ))
                                                )}


                                                {/* level4 start */}

                                                {/* Render Sub-Category 4 for each Sub-Category 3*/}
                                                {openSubCategory3Id === subCategory3.id && subCategory3.sub_categories_4 && subCategory3.sub_categories_4.length > 0 && (
                                                  subCategory3.sub_categories_4.map((subCategory4) => (
                                                    <React.Fragment key={subCategory4.id}>
                                                      <tr>
                                                        <td></td>
                                                        <td>
                                                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                        </td>
                                                        <td></td>
                                                        <td style={{ paddingLeft: '80px' }}>
                                                          <button
                                                            className="btn btn-link p-0"
                                                            onClick={() => toggleSubCategory4(subCategory4.id)}
                                                            aria-label="Toggle sub-category 3 visibility"
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
                                                              {console.log("sub4:", subCategory4)}
                                                              <td></td>
                                                              <td>
                                                                {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                <input
                                                                  className="ms-1 me-1 mb-1"
                                                                  type="checkbox"
                                                                  checked={selectedBoqDetails.includes(boqDetail4.id)} // Check if this ID is selected
                                                                  onChange={() => handleCheckboxChange(boqDetail4.id)} // Handle checkbox change
                                                                />
                                                              </td>
                                                              <td></td>
                                                              <td style={{ paddingLeft: '100px' }}>
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
                                                              <td className="text-start" >
                                                                <Link to={`/boq-details-page-master/${boqDetail4.id}`}>
                                                                  <span style={{ color: ' #8b0203', textDecoration: 'underline' }}>{boqDetail4.id}</span>
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
                                                                  {/* {boqDetail4.status} */}
                                                                  {/* {boqDetail4.status ? boqDetail4.status.charAt(0).toUpperCase() + boqDetail4.status.slice(1) : ""} */}
                                                                  {boqDetail4.list_status}
                                                                </div>
                                                              </td>
                                                            </tr>

                                                            {/* Render Materials Table for BOQ Detail in Sub-Category 4 */}
                                                            {/* Render Materials Table for BOQ Detail in Sub-Category */}
                                                            {openBoqDetailId2 === boqDetail4.id && (
                                                              <React.Fragment>
                                                                <tr>
                                                                  <td colSpan={13}>
                                                                    <div className="m-3">
                                                                      {/* Check if BOQ Sub Items are present */}
                                                                      {boqDetail4?.boq_sub_items && boqDetail4.boq_sub_items.length > 0 ? (
                                                                        <div className="tbl-container mt-1">
                                                                          <table className="w-100">
                                                                            <thead>
                                                                              <tr colSpan={13}>
                                                                                <th className="text-start">Sr.No.</th>
                                                                                <th className="text-start">Expand</th>
                                                                                <th className="text-start">Sub Item Name</th>
                                                                                <th className="text-start">Description</th>
                                                                                <th className="text-start">Notes</th>
                                                                                <th className="text-start">Remarks</th>
                                                                                <th className="text-start">UOM</th>
                                                                                <th className="text-start">Quantity</th>
                                                                              </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                              {boqDetail4.boq_sub_items.map((boqSubItem, index) => (
                                                                                <React.Fragment key={boqSubItem.id}>
                                                                                  <tr>
                                                                                    <td className="text-start">{index + 1}</td>
                                                                                    <td className="text-start">
                                                                                      <button
                                                                                        className="btn btn-link p-0"
                                                                                        onClick={() => toggleBoqDetailSub1(boqSubItem.id)}
                                                                                      >
                                                                                        {openBoqDetailIdSub === boqSubItem.id ? (
                                                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                          </svg>
                                                                                        ) : (
                                                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                          </svg>
                                                                                        )}
                                                                                      </button>
                                                                                    </td>
                                                                                    <td className="text-start">{boqSubItem.name}</td>
                                                                                    <td className="text-start">{boqSubItem.description}</td>
                                                                                    <td className="text-start">{boqSubItem.notes}</td>
                                                                                    <td className="text-start">{boqSubItem.remarks}</td>
                                                                                    <td className="text-start">{boqSubItem.uom}</td>
                                                                                    <td className="text-start">{boqSubItem.cost_quantity}</td>
                                                                                  </tr>

                                                                                  {/* Render Materials and Assets Table if BOQ Sub Item is Expanded */}
                                                                                  {openBoqDetailIdSub === boqSubItem.id && (boqSubItem?.materials || boqSubItem?.assets) && (
                                                                                    <React.Fragment>
                                                                                      <tr>
                                                                                        <td colSpan={13}>
                                                                                          <div>
                                                                                            <CollapsibleCard title="Materials">
                                                                                              <div className="card-body mt-0 pt-0">
                                                                                                <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                                  <table className="w-100">
                                                                                                    <thead>
                                                                                                      <tr>
                                                                                                        <th rowSpan={2}>Sr.No</th>
                                                                                                        <th rowSpan={2}>Material Type</th>
                                                                                                        <th rowSpan={2}>Material</th>
                                                                                                        <th rowSpan={2}>Material Sub-Type</th>
                                                                                                        <th rowSpan={2}>Generic Specification</th>
                                                                                                        <th rowSpan={2}>Colour</th>
                                                                                                        <th rowSpan={2}>Brand</th>
                                                                                                        <th rowSpan={2}>UOM</th>
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
                                                                                                      {boqSubItem?.materials?.map((material, index) => (
                                                                                                        <tr key={material.id}>
                                                                                                          <td>{index + 1}</td>
                                                                                                          <td>{material.material_type}</td>
                                                                                                          <td>{material.material_name}</td>
                                                                                                          <td>{material.material_sub_type}</td>
                                                                                                          <td>{material.generic_info}</td>
                                                                                                          <td>{material.color}</td>
                                                                                                          <td>{material.brand}</td>
                                                                                                          <td>{material.uom}</td>
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

                                                                                            <CollapsibleCard title="Assets">
                                                                                              <div className="card-body mt-0 pt-0">
                                                                                                <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                                  <table className="w-100">
                                                                                                    <thead>
                                                                                                      <tr>
                                                                                                        <th rowSpan={2}>Sr.No</th>
                                                                                                        <th rowSpan={2}>Asset Type</th>
                                                                                                        <th rowSpan={2}>Asset</th>
                                                                                                        <th rowSpan={2}>Asset Sub-Type</th>
                                                                                                        <th rowSpan={2}>Generic Specification</th>
                                                                                                        <th rowSpan={2}>Colour</th>
                                                                                                        <th rowSpan={2}>Brand</th>
                                                                                                        <th rowSpan={2}>UOM</th>
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
                                                                                                      {boqSubItem.assets?.map((asset, index) => (
                                                                                                        <tr key={asset.id}>
                                                                                                          <td>{index + 1}</td>
                                                                                                          <td>{asset.material_type}</td>
                                                                                                          <td>{asset.material_name}</td>
                                                                                                          <td>{asset.material_sub_type}</td>
                                                                                                          <td>{asset.generic_info}</td>
                                                                                                          <td>{asset.color}</td>
                                                                                                          <td>{asset.brand}</td>
                                                                                                          <td>{asset.uom}</td>
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
                                                                              ))}
                                                                            </tbody>
                                                                          </table>
                                                                        </div>
                                                                      ) : (
                                                                        <div>
                                                                          {/* Render Materials and Assets Card when no Sub Items */}
                                                                          <CollapsibleCard title="Materials">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Sr.No</th>
                                                                                      <th rowSpan={2}>Material Type</th>
                                                                                      <th rowSpan={2}>Material</th>
                                                                                      <th rowSpan={2}>Material Sub-Type</th>
                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
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
                                                                                    {boqDetail4?.materials?.map((material, index) => (
                                                                                      <tr key={material.id}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{material.material_type}</td>
                                                                                        <td>{material.material_name}</td>
                                                                                        <td>{material.material_sub_type}</td>
                                                                                        <td>{material.generic_info}</td>
                                                                                        <td>{material.color}</td>
                                                                                        <td>{material.brand}</td>
                                                                                        <td>{material.uom}</td>
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

                                                                          <CollapsibleCard title="Assets">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Sr.No</th>
                                                                                      <th rowSpan={2}>Asset Type</th>
                                                                                      <th rowSpan={2}>Asset</th>
                                                                                      <th rowSpan={2}>Asset Sub-Type</th>
                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
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
                                                                                    {boqDetail4?.assets?.map((asset, index) => (
                                                                                      <tr key={asset.id}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{asset.material_type}</td>
                                                                                        <td>{asset.material_name}</td>
                                                                                        <td>{asset.material_sub_type}</td>
                                                                                        <td>{asset.generic_info}</td>
                                                                                        <td>{asset.color}</td>
                                                                                        <td>{asset.brand}</td>
                                                                                        <td>{asset.uom}</td>
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
                                                                      )}
                                                                    </div>
                                                                  </td>
                                                                </tr>
                                                              </React.Fragment>
                                                            )}





                                                          </React.Fragment>
                                                        ))
                                                      )}


                                                      {/* 5 start */}

                                                      {/* Render Sub-Category 5 for each Sub-Category 4*/}
                                                      {openSubCategory4Id === subCategory4.id && subCategory4.sub_categories_5 && subCategory4.sub_categories_5.length > 0 && (
                                                        subCategory4.sub_categories_5.map((subCategory5) => (
                                                          <React.Fragment key={subCategory5.id}>
                                                            <tr>
                                                              <td></td>
                                                              <td>
                                                                {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                              </td>
                                                              <td></td>
                                                              <td style={{ paddingLeft: '100px' }}>
                                                                <button
                                                                  className="btn btn-link p-0"
                                                                  onClick={() => toggleSubCategory5(subCategory5.id)}
                                                                  aria-label="Toggle sub-category 3 visibility"
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

                                                            {/* Render BOQ Details for Sub-Category 5*/}
                                                            {openSubCategory5Id === subCategory5.id && subCategory5.boq_details && subCategory5.boq_details.length > 0 && (
                                                              subCategory5.boq_details.map((boqDetail5) => (
                                                                <React.Fragment key={boqDetail5.id}>
                                                                  <tr>
                                                                    {console.log("sub5:", subCategory5)}
                                                                    <td></td>
                                                                    <td>
                                                                      {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                      <input
                                                                        className="ms-1 me-1 mb-1"
                                                                        type="checkbox"
                                                                        checked={selectedBoqDetails.includes(boqDetail5.id)} // Check if this ID is selected
                                                                        onChange={() => handleCheckboxChange(boqDetail5.id)} // Handle checkbox change
                                                                      />
                                                                    </td>
                                                                    <td></td>
                                                                    <td style={{ paddingLeft: '110px' }}>
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
                                                                    <td className="text-start" >
                                                                      <Link to={`/boq-details-page-master/${boqDetail5.id}`}>
                                                                        <span style={{ color: ' #8b0203', textDecoration: 'underline' }}>{boqDetail5.id}</span>
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
                                                                        {/* {boqDetail5.status} */}
                                                                        {/* {boqDetail5.status ? boqDetail5.status.charAt(0).toUpperCase() + boqDetail5.status.slice(1) : ""} */}
                                                                        {boqDetail5.list_status}
                                                                      </div>
                                                                    </td>
                                                                  </tr>

                                                                  {/* Render Materials Table for BOQ Detail in Sub-Category 5 */}

                                                                  {/* Render Materials Table for BOQ Detail in Sub-Category */}
                                                                  {openBoqDetailId3 === boqDetail5.id && (
                                                                    <React.Fragment>
                                                                      <tr>
                                                                        <td colSpan={13}>
                                                                          <div className="m-3">
                                                                            {/* Check if BOQ Sub Items are present */}
                                                                            {boqDetail5?.boq_sub_items && boqDetail5.boq_sub_items.length > 0 ? (
                                                                              <div className="tbl-container mt-1">
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr colSpan={13}>
                                                                                      <th className="text-start">Sr.No.</th>
                                                                                      <th className="text-start">Expand</th>
                                                                                      <th className="text-start">Sub Item Name</th>
                                                                                      <th className="text-start">Description</th>
                                                                                      <th className="text-start">Notes</th>
                                                                                      <th className="text-start">Remarks</th>
                                                                                      <th className="text-start">UOM</th>
                                                                                      <th className="text-start">Quantity</th>
                                                                                    </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                    {boqDetail5.boq_sub_items.map((boqSubItem, index) => (
                                                                                      <React.Fragment key={boqSubItem.id}>
                                                                                        <tr>
                                                                                          <td className="text-start">{index + 1}</td>
                                                                                          <td className="text-start">
                                                                                            <button
                                                                                              className="btn btn-link p-0"
                                                                                              onClick={() => toggleBoqDetailSub1(boqSubItem.id)}
                                                                                            >
                                                                                              {openBoqDetailIdSub === boqSubItem.id ? (
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                  <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                </svg>
                                                                                              ) : (
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                  <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                  <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                  <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                </svg>
                                                                                              )}
                                                                                            </button>
                                                                                          </td>
                                                                                          <td className="text-start">{boqSubItem.name}</td>
                                                                                          <td className="text-start">{boqSubItem.description}</td>
                                                                                          <td className="text-start">{boqSubItem.notes}</td>
                                                                                          <td className="text-start">{boqSubItem.remarks}</td>
                                                                                          <td className="text-start">{boqSubItem.uom}</td>
                                                                                          <td className="text-start">{boqSubItem.cost_quantity}</td>
                                                                                        </tr>

                                                                                        {/* Render Materials and Assets Table if BOQ Sub Item is Expanded */}
                                                                                        {openBoqDetailIdSub === boqSubItem.id && (boqSubItem?.materials || boqSubItem?.assets) && (
                                                                                          <React.Fragment>
                                                                                            <tr>
                                                                                              <td colSpan={13}>
                                                                                                <div>
                                                                                                  <CollapsibleCard title="Materials">
                                                                                                    <div className="card-body mt-0 pt-0">
                                                                                                      <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                                        <table className="w-100">
                                                                                                          <thead>
                                                                                                            <tr>
                                                                                                              <th rowSpan={2}>Sr.No</th>
                                                                                                              <th rowSpan={2}>Material Type</th>
                                                                                                              <th rowSpan={2}>Material</th>
                                                                                                              <th rowSpan={2}>Material Sub-Type</th>
                                                                                                              <th rowSpan={2}>Generic Specification</th>
                                                                                                              <th rowSpan={2}>Colour</th>
                                                                                                              <th rowSpan={2}>Brand</th>
                                                                                                              <th rowSpan={2}>UOM</th>
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
                                                                                                            {boqSubItem?.materials?.map((material, index) => (
                                                                                                              <tr key={material.id}>
                                                                                                                <td>{index + 1}</td>
                                                                                                                <td>{material.material_type}</td>
                                                                                                                <td>{material.material_name}</td>
                                                                                                                <td>{material.material_sub_type}</td>
                                                                                                                <td>{material.generic_info}</td>
                                                                                                                <td>{material.color}</td>
                                                                                                                <td>{material.brand}</td>
                                                                                                                <td>{material.uom}</td>
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

                                                                                                  <CollapsibleCard title="Assets">
                                                                                                    <div className="card-body mt-0 pt-0">
                                                                                                      <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                                        <table className="w-100">
                                                                                                          <thead>
                                                                                                            <tr>
                                                                                                              <th rowSpan={2}>Sr.No</th>
                                                                                                              <th rowSpan={2}>Asset Type</th>
                                                                                                              <th rowSpan={2}>Asset</th>
                                                                                                              <th rowSpan={2}>Asset Sub-Type</th>
                                                                                                              <th rowSpan={2}>Generic Specification</th>
                                                                                                              <th rowSpan={2}>Colour</th>
                                                                                                              <th rowSpan={2}>Brand</th>
                                                                                                              <th rowSpan={2}>UOM</th>
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
                                                                                                            {boqSubItem.assets?.map((asset, index) => (
                                                                                                              <tr key={asset.id}>
                                                                                                                <td>{index + 1}</td>
                                                                                                                <td>{asset.material_type}</td>
                                                                                                                <td>{asset.material_name}</td>
                                                                                                                <td>{asset.material_sub_type}</td>
                                                                                                                <td>{asset.generic_info}</td>
                                                                                                                <td>{asset.color}</td>
                                                                                                                <td>{asset.brand}</td>
                                                                                                                <td>{asset.uom}</td>
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
                                                                                    ))}
                                                                                  </tbody>
                                                                                </table>
                                                                              </div>
                                                                            ) : (
                                                                              <div>
                                                                                {/* Render Materials and Assets Card when no Sub Items */}
                                                                                <CollapsibleCard title="Materials">
                                                                                  <div className="card-body mt-0 pt-0">
                                                                                    <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                      <table className="w-100">
                                                                                        <thead>
                                                                                          <tr>
                                                                                            <th rowSpan={2}>Sr.No</th>
                                                                                            <th rowSpan={2}>Material Type</th>
                                                                                            <th rowSpan={2}>Material</th>
                                                                                            <th rowSpan={2}>Material Sub-Type</th>
                                                                                            <th rowSpan={2}>Generic Specification</th>
                                                                                            <th rowSpan={2}>Colour</th>
                                                                                            <th rowSpan={2}>Brand</th>
                                                                                            <th rowSpan={2}>UOM</th>
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
                                                                                          {boqDetail5?.materials?.map((material, index) => (
                                                                                            <tr key={material.id}>
                                                                                              <td>{index + 1}</td>
                                                                                              <td>{material.material_type}</td>
                                                                                              <td>{material.material_name}</td>
                                                                                              <td>{material.material_sub_type}</td>
                                                                                              <td>{material.generic_info}</td>
                                                                                              <td>{material.color}</td>
                                                                                              <td>{material.brand}</td>
                                                                                              <td>{material.uom}</td>
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

                                                                                <CollapsibleCard title="Assets">
                                                                                  <div className="card-body mt-0 pt-0">
                                                                                    <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                      <table className="w-100">
                                                                                        <thead>
                                                                                          <tr>
                                                                                            <th rowSpan={2}>Sr.No</th>
                                                                                            <th rowSpan={2}>Asset Type</th>
                                                                                            <th rowSpan={2}>Asset</th>
                                                                                            <th rowSpan={2}>Asset Sub-Type</th>
                                                                                            <th rowSpan={2}>Generic Specification</th>
                                                                                            <th rowSpan={2}>Colour</th>
                                                                                            <th rowSpan={2}>Brand</th>
                                                                                            <th rowSpan={2}>UOM</th>
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
                                                                                          {boqDetail5?.assets?.map((asset, index) => (
                                                                                            <tr key={asset.id}>
                                                                                              <td>{index + 1}</td>
                                                                                              <td>{asset.material_type}</td>
                                                                                              <td>{asset.material_name}</td>
                                                                                              <td>{asset.material_sub_type}</td>
                                                                                              <td>{asset.generic_info}</td>
                                                                                              <td>{asset.color}</td>
                                                                                              <td>{asset.brand}</td>
                                                                                              <td>{asset.uom}</td>
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
                                                                            )}
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


                                                      {/* 5 end */}
                                                    </React.Fragment>
                                                  ))
                                                )}

                                                {/* level4 end */}
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
                <div className="d-flex justify-content-between align-items-center px-3 mt-2  mb-3">
                  <ul className="pagination justify-content-center d-flex">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                    </li>
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index + 1}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <div>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}

                    {totalEntries} entries
                    {/* {console.log(".........", itemsPerPage)} */}
                  </div>

                </div>
              </div>

              {/* boq list table is here  end*/}

            </div>

            {/* <CopyBudgetModal show={show} handleClose={handleClose} /> */}
          </div>
        </div>

      )}
      {/* advance fiter Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-right"
        className="setting-modal"
        backdrop={true}
      >
        <Modal.Header>
          <div className="container-fluid p-0">
            <div className="border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <svg
                    width="10"
                    height="16"
                    viewBox="0 0 10 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L1 9L9 17"
                      stroke="#8B0203"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3 className="modal-title m-0" style={{ fontWeight: 500 }}>
                  Filter
                </h3>
              </div>
              <Link
                className="resetCSS"
                style={{ fontSize: "14px", textDecoration: "underline" }}
                to="#"
                onClick={handleResetFilters}
              >
                Reset
              </Link>
            </div>
          </div>
        </Modal.Header>
        <div className="modal-body" style={{ overflowY: scroll }}>
          <div className="row">
            <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Work Category</label>

                  <SingleSelector
                    options={workCategories?.map((category) => ({
                      value: category.id,
                      label: category.name,
                      // work_sub_categories: category.work_sub_categories, // Include subcategories in the category option
                    }))}
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                    placeholder="Select Work Category"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Work SubCategory</label>
                  <SingleSelector
                    options={subCategoryOptions}
                    onChange={handleSubCategoryChange}
                    value={selectedSubCategory}
                    placeholder="Select Work SubCategory"
                  />
                </div>
              </div>

            </div>
            <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Material Type</label>
                  <SingleSelector
                    options={inventoryTypes}
                    value={selectedInventory}
                    onChange={handleInventoryChange}
                    placeholder="Select Material Type"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Material</label>
                  <SingleSelector
                    options={inventoryMaterialTypes}
                    value={selectedInventoryMaterialTypes}
                    onChange={handleInventoryMaterialTypeChange}
                    placeholder="Select Material"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Status</label>
                  <SingleSelector
                    options={options}
                    value={selectedStatus}
                    onChange={handleStatusChangeFilter}
                    placeholder="Select Status"
                  />
                </div>
              </div>
            </div>

            {/* <div className="row mt-3 align-items-end">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Unit</label>

                  <SingleSelector
                  options={unitOfMeasures} // Providing the options to the select component
                  onChange={handleUnitChange} // Setting the handler when an option is selected
                  value={selectedUnit} // Setting the selected value
                  placeholder="Select Unit"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#8b0203", color: "#fff" }}
            // onClick={handleClose}
            onClick={handleApplyFilters} // Use the new handler here
          >
            Go
          </button>
        </div>
      </Modal>
      {/* Loader */}
      {loading && (
        <div id="full-screen-loader" className="full-screen-loader">
          <div className="loader-container">
            <img
              src="https://newerp.marathonrealty.com/assets/loader.gif"
              alt="Loading..."
              width={50}
            />
            <h5>Please wait</h5>
          </div>
        </div>
      )}

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
                href={`${baseURL}boq_details/download_boq_sample.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`}
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

      {/* copy modal */}
      {/* <Modal
        size="m"
        show={copyModal}
        onHide={closeCopyModal}
        centered
        className="modal fade"
      >
        <Modal.Header closeButton>
          <h5>Copy</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>From</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                >
                  <option selected="selected">Select</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>To</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                >
                  <option selected="selected">Select</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={closeCopyModal}
                fdprocessedid="u33pye"
              >
                Copy
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* copy modal end */}
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

export default BOQList;
