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



const InitialBOQList = () => {
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [boqList, setBoqList] = useState(null); // State to store the fetched data
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Items per page
    const [totalEntries, setTotalEntries] = useState(0);
    const [loading2, setLoading2] = useState(true);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessages, setResultMessages] = useState([]);

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
                    `${baseURL}boq_details.json?q[id_eq]=${projectId}&q[pms_sites_id_eq]=${siteId}&q[pms_wings_id_eq]=${wingId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

    const handleReset = async () => {
        // setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedSite(null);
        setSelectedWing(null)
        try {
            const response = await axios.get(
                `${baseURL}boq_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            );
            setBoqList(response.data); // or setData(response.data) as per your structure
            // Optionally, reset filter states here as well
        } catch (error) {
            console.error("Error fetching initial data:", error);
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
                `${baseURL}boq_details.json?q[company_company_name_or_pms_sites_name_or_pms_wings_name_cont]=${search}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
            // console.log("base64String:", base64String)
            try {
                const response = await axios.post(
                    `${baseURL}boq_details/import.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
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
                // if (error.response && error.response.status === 422) {
                //   console.log("422 response:", error.response.data);
                //   if (Array.isArray(error.response.data.errors)) {
                //     const firstError = error.response.data.errors[0];
                //     if (firstError && firstError.error) {
                //       toast.error(`${firstError.error}`);
                //     }
                //   } else if (typeof error.response.data.errors === "string") {
                //     toast.error(error.response.data.errors);
                //   }
                // } else {
                //   console.error(error);
                // }
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
                                        {/* <div className="col-md-3">
                                            <button type="" className="purple-btn2 mt-4" onClick={handleGoClick}>
                                                Go
                                            </button>
                                        </div> */}

                                        <div className="col-md-1 mt-4 ms-3">
                                            <button
                                                className="purple-btn2"
                                                onClick={handleGoClick}
                                            // onClick={fetchFilteredData}

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

                                {/* <BulkAction /> */}

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

                                        <button className="purple-btn2" onClick={() => setShowModal(true)}>Bulk Upload</button>


                                        {/* Create BOQ Button */}
                                        <button className="purple-btn2 me-3" onClick={handleClick}>
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

                            <div className="mx-3 mb-5 mt-3">
                                <div className="tbl-container mt-3" style={{ maxHeight: "650px" }}>
                                    <table className="w-100">
                                        <thead>
                                            <tr>
                                                <th className="text-start">Sr.No.</th>
                                                <th className="text-start">Project</th>
                                                <th className="text-start">Sub-Project</th>
                                                <th className="text-start">Wing</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {boqList?.projects?.map((project, projectIndex) =>
                                                project.pms_sites.map((site, siteIndex) =>
                                                    site.pms_wings.length > 0
                                                        ? site.pms_wings.map((wing, wingIndex) => (
                                                            <tr key={`${projectIndex}-${siteIndex}-${wingIndex}`}>
                                                                {/* Sr.No. */}
                                                                {wingIndex === 0 && siteIndex === 0 ? (
                                                                    <td className="text-start">{projectIndex + 1}</td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}

                                                                {/* Project Name */}
                                                                {wingIndex === 0 && siteIndex === 0 ? (
                                                                    <td className="text-start">
                                                                        {project.boq_id ? (
                                                                            <a
                                                                                href={`/view-BOQ/${project.boq_id}`}
                                                                                title={project.status ? `Status: ${project.status}` : ""}
                                                                                style={{
                                                                                    cursor: project.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {project.name}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span
                                                                                title={project.status ? `Status: ${project.status}` : ""}
                                                                                style={{
                                                                                    cursor: project.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                {project.name}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}

                                                                {/* Sub-Project Name */}
                                                                {wingIndex === 0 ? (
                                                                    <td className="text-start">
                                                                        {site.boq_id ? (
                                                                            <a
                                                                                href={`/view-BOQ/${site.boq_id}`}
                                                                                title={site.status ? `Status: ${site.status}` : ""}
                                                                                style={{
                                                                                    cursor: site.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {site.name}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span
                                                                                title={site.status ? `Status: ${site.status}` : ""}
                                                                                style={{
                                                                                    cursor: site.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                {site.name}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}

                                                                {/* Wing Name */}
                                                                <td className="text-start">
                                                                    {wing.boq_id ? (
                                                                        <a
                                                                            href={`/view-BOQ/${wing.boq_id}`}
                                                                            title={wing.status ? `Status: ${wing.status}` : ""}
                                                                            style={{
                                                                                cursor: wing.status ? "pointer" : "default",
                                                                                position: "relative",
                                                                            }}
                                                                        >
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {wing.name}
                                                                            </span>
                                                                        </a>
                                                                    ) : (
                                                                        <span
                                                                            title={wing.status ? `Status: ${wing.status}` : ""}
                                                                            style={{
                                                                                cursor: wing.status ? "pointer" : "default",
                                                                                position: "relative",
                                                                            }}
                                                                        >
                                                                            {wing.name}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                        : (
                                                            <tr key={`${projectIndex}-${siteIndex}`}>
                                                                {/* Sr.No. */}
                                                                {siteIndex === 0 ? (
                                                                    <td className="text-start">{projectIndex + 1}</td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}

                                                                {/* Project Name */}
                                                                {siteIndex === 0 ? (
                                                                    <td className="text-start">
                                                                        {project.boq_id ? (
                                                                            <a
                                                                                href={`/view-BOQ/${project.boq_id}`}
                                                                                title={project.status ? `Status: ${project.status}` : ""}
                                                                                style={{
                                                                                    cursor: project.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                    {project.name}
                                                                                </span>
                                                                            </a>
                                                                        ) : (
                                                                            <span
                                                                                title={project.status ? `Status: ${project.status}` : ""}
                                                                                style={{
                                                                                    cursor: project.status ? "pointer" : "default",
                                                                                    position: "relative",
                                                                                }}
                                                                            >
                                                                                {project.name}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ) : (
                                                                    <td className="text-start"></td>
                                                                )}

                                                                {/* Sub-Project Name */}
                                                                <td className="text-start">
                                                                    {site.boq_id ? (
                                                                        <a
                                                                            href={`/view-BOQ/${site.boq_id}`}
                                                                            title={site.status ? `Status: ${site.status}` : ""}
                                                                            style={{
                                                                                cursor: site.status ? "pointer" : "default",
                                                                                position: "relative",
                                                                            }}
                                                                        >
                                                                            <span style={{ color: "#8b0203", textDecoration: "underline" }}>
                                                                                {site.name}
                                                                            </span>
                                                                        </a>
                                                                    ) : (
                                                                        <span
                                                                            title={site.status ? `Status: ${site.status}` : ""}
                                                                            style={{
                                                                                cursor: site.status ? "pointer" : "default",
                                                                                position: "relative",
                                                                            }}
                                                                        >
                                                                            {site.name}
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                {/* Wing Name (empty) */}
                                                                <td className="text-start"></td>
                                                            </tr>
                                                        )
                                                )
                                            )}

                                        </tbody>
                                    </table>
                                </div>


                                <div className="d-flex justify-content-between align-items-center px-1 mt-2  mb-3">
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
                                        {console.log(".........", itemsPerPage)}
                                    </div>

                                </div>
                            </div>


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
                                            href={`/boq-details-page-master/${msg.boq_id}`}
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
        </>
    );
};

export default InitialBOQList;
