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
import { estimationListColumns, estimationListData } from "../constant/data";
import { auditLogColumns, auditLogData } from "../constant/data";
import { baseURL } from "../confi/apiDomain";




const EstimationCreationEdit = () => {
    // States to store data
    const navigate = useNavigate(); // ✅ define navigate here
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    const [wingsOptions, setWingsOptions] = useState([]);
    const handleAddModalRow = () => setModalRows([...modalRows, {/* default row object */ }]);
    const handleRemoveModalRow = idx => setModalRows(modalRows.filter((_, i) => i !== idx));

    // Fetch company data on component mount
    useEffect(() => {
        axios.get(`${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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

    //   console.log("selected company:",selectedCompany)
    //   console.log("selected  prj...",projects)

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


    //   console.log("selected prj:",selectedProject)
    //   console.log("selected sub prj...",siteOptions)

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

    const [details, setDetails] = useState(null);
    const [type, setType] = useState("project"); // Track the type
    const [budgetType, setBudgetType] = useState(""); // ✅ new state

    useEffect(() => {
        if (!selectedProject && !selectedSite) return;

        const fetchDetails = async () => {
            try {
                let type;
                if (selectedWing) {
                    type = "wing";
                } else if (selectedSite) {
                    type = "sub_project";
                } else {
                    type = "project";
                }
                setType(type);

                const id = selectedWing
                    ? selectedWing.value
                    : selectedSite
                        ? selectedSite.value
                        : selectedProject.value;

                const res = await axios.get(
                    `${baseURL}estimation_details/${id}/budget_details.json?type=${type}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                );

                setDetails(res.data);
                setBudgetType(res.data?.data?.budget_type || "");
            } catch (err) {
                console.error("Error fetching sub-project details", err);
            }
        };

        fetchDetails();
    }, [selectedProject, selectedSite, selectedWing]);


    const cardTitle =
        type === "wing"
            ? "Wing Details"
            : type === "sub_project"
                ? "Sub-Project Details"
                : "Project Details";

    // console.log("details selected:", details)
    const [subProjectDetails, setSubProjectDetails] = useState(
        // {
        //     categories: [],
        // }


        // {
        //   "rera_area": "",
        //   "construction_area": "",
        //   "saleble_area": "",
        //   "project_budget": "",
        //   "material_labour_budget": "",
        //   "material_total": "",
        //   "labour_total": "",
        //   "categories": [
        //     {
        //       "id": 36,
        //       "name": "CIVIL WORK",
        //       "budget": "",
        //       "material_type_details": [],
        //       "sub_categories_2": [
        //         {
        //           "id": 31,
        //           "name": "Super structure",
        //           "budget": "",
        //           "material_type_details": [
        //           ],
        //           "sub_categories_3": []
        //         }
        //       ]
        //     },
        //     {
        //       "id": 37,
        //       "name": "FINISHING",
        //       "budget": "",
        //       "material_type_details": [],
        //       "sub_categories_2": [
        //         {
        //           "id": 32,
        //           "name": "FLAT FINISHING ",
        //           "budget": "",
        //           "material_type_details": [
        //           ],
        //           "sub_categories_3": [
        //             {
        //               "id": 33,
        //               "name": "Tiling FF",
        //               "budget": "",
        //               "material_type_details": [

        //               ],
        //               "sub_categories_4": []
        //             },
        //             {
        //               "id": 44,
        //               "name": "Water Proofing FF",
        //               "budget": "",
        //               "material_type_details": [

        //               ],
        //               "sub_categories_4": []
        //             },
        //             {
        //               "id": 50,
        //               "name": "Door - Flats",
        //               "budget": "",
        //               "material_type_details": [

        //               ],
        //               "sub_categories_4": []
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // }
    );

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

    // ...existing code...

    const [showAddModal, setShowAddModal] = useState(false);
    const [modalCategoryIdx, setModalCategoryIdx] = useState(null);
    const [modalSubCategoryIdx, setModalSubCategoryIdx] = useState(null);
    const [modalRows, setModalRows] = useState([
        { materialType: "", materialTypeLabel: "", specification: "", specificationLabel: "", labourType: "", labourTypeLabel: "", compositeValue: "", rate: "", type: "material" }
    ]);

    // Dummy options for dropdowns
    const materialTypeOptions = [
        { value: "Concrete", label: "Concrete" },
        { value: "Steel", label: "Steel" },
        // Add more as needed
    ];
    const specificationOptions = [
        { value: "GenSpec1", label: "Generic Spec 1" },
        { value: "GenSpec2", label: "Generic Spec 2" },
        // Add more as needed
    ];

    const handleModalRowChange = async (idx, field, newValue) => {
        const updatedRows = [...modalRows];

        // If object {value, label}, split into value & label
        if (newValue && typeof newValue === "object" && "value" in newValue) {
            updatedRows[idx] = {
                ...updatedRows[idx],
                [field]: newValue.value,
                [`${field}Label`]: newValue.label
            };
        } else {
            updatedRows[idx] = { ...updatedRows[idx], [field]: newValue };
        }

        // Check if both Material Type & Specification are selected → fetch rate
        const row = updatedRows[idx];
        if (row.materialType && row.type === "material") {
            try {
                const res = await axios.get(
                    `${baseURL}estimation_details/get_material_rate.json`,
                    {
                        params: {
                            material_type_id: row.materialType,
                            generic_info: row.specificationLabel, // assuming label contains "GRADE" etc.
                            project_id: selectedProject?.value,
                            pms_site_id: selectedSite?.value,
                            pms_wing_id: "",
                            token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
                        }
                    }
                );

                // updatedRows[idx].rate = res.data?.rate || 0;
                updatedRows[idx].rate = budgetType === "wbs" ? (res.data?.rate || 0) : "";
            } catch (err) {
                console.error("Error fetching material rate", err);
                // updatedRows[idx].rate = 0;
                updatedRows[idx].rate = budgetType === "wbs" ? 0 : "";
            }
        }

        setModalRows(updatedRows);
    };


    const [modalSubCategory3Idx, setModalSubCategory3Idx] = useState(null);
    const [modalSubCategory4Idx, setModalSubCategory4Idx] = useState(null);
    const [modalSubCategory5Idx, setModalSubCategory5Idx] = useState(null);


    // 2. Update handleOpenAddModal to set indices for each level:


    const handleOpenAddModal = (
        catIdx,
        subCatIdx,
        categoryOrSubCatId,
        subCategory3Idx = null,
        subCategory4Idx = null,
        subCategory5Idx = null
    ) => {

        setModalCategoryIdx(catIdx);
        setModalSubCategoryIdx(subCatIdx);
        setModalSubCategory3Idx(subCategory3Idx);
        setModalSubCategory4Idx(subCategory4Idx);
        setModalSubCategory5Idx(subCategory5Idx);
        // setModalRows([{ materialType: "", specification: "", type: "Material" }]);
        setModalRows([{ materialType: "", materialTypeLabel: "", specification: "", specificationLabel: "", labourType: "", labourTypeLabel: "", compositeValue: "", rate: "", type: "material" }]);
        setShowAddModal(true);

        setOpenCategoryId(subCatIdx === null ? categoryOrSubCatId : subProjectDetails.categories[catIdx].id);

        // setOpenSubCategory2Id(subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].id);

        // if (subCatIdx !== null) setOpenSubCategory2Id(categoryOrSubCatId);
        // Open sub category 2
        if (subCatIdx !== null) {
            setOpenSubCategory2Id(subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].id);
        }

        if (subCategory3Idx !== null) {
            const subCat3 = subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx];
            console.log("sub cat 3:", subCat3)
            if (subCat3) setOpenSubCategory3Id(subCat3.id);


        }


        if (subCategory4Idx !== null) {
            const subCat4 = subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx];
            if (subCat4) setOpenSubCategory4Id(subCat4.id);
        }
        if (subCategory5Idx !== null) {
            const subCat5 = subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.sub_categories_5[subCategory5Idx];
            if (subCat5) setOpenSubCategory5Id(subCat5.id);
        }
    };

    // console.log("modal rows:", modalRows)

    const [lastCreatedLevelIds, setLastCreatedLevelIds] = useState({
        level_one_id: null,
        level_two_id: null,
        level_three_id: null,
        level_four_id: null,
        level_five_id: null,
    });

    const [lastMaterialDetails, setLastMaterialDetails] = useState([]);

    const handleCreateRows = (
        subCategory3Idx = modalSubCategory3Idx,
        subCategory4Idx = modalSubCategory4Idx,
        subCategory5Idx = modalSubCategory5Idx
    ) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            let targetArr;
            let levelIds = {
                level_one_id: null,
                level_two_id: null,
                level_three_id: null,
                level_four_id: null,
                level_five_id: null,
            };

            // 🛠 Level ID mapping
            if (
                modalSubCategoryIdx === null &&
                subCategory3Idx === null &&
                subCategory4Idx === null &&
                subCategory5Idx === null
            ) {
                const category = updated.categories[modalCategoryIdx];
                targetArr = category.material_type_details;
                levelIds.level_one_id = category.id;
            } else if (
                modalSubCategoryIdx !== null &&
                subCategory3Idx === null &&
                subCategory4Idx === null &&
                subCategory5Idx === null
            ) {
                const subCat2 = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx];
                targetArr = subCat2.material_type_details;
                levelIds.level_one_id = updated.categories[modalCategoryIdx].id;
                levelIds.level_two_id = subCat2.id;
            } else if (
                modalSubCategoryIdx !== null &&
                subCategory3Idx !== null &&
                subCategory4Idx === null &&
                subCategory5Idx === null
            ) {
                const subCat3 = updated.categories[modalCategoryIdx]
                    .sub_categories_2[modalSubCategoryIdx]
                    .sub_categories_3[subCategory3Idx];
                targetArr = subCat3.material_type_details;
                levelIds.level_one_id = updated.categories[modalCategoryIdx].id;
                levelIds.level_two_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].id;
                levelIds.level_three_id = subCat3.id;
            } else if (
                modalSubCategoryIdx !== null &&
                subCategory3Idx !== null &&
                subCategory4Idx !== null &&
                subCategory5Idx === null
            ) {
                const subCat4 = updated.categories[modalCategoryIdx]
                    .sub_categories_2[modalSubCategoryIdx]
                    .sub_categories_3[subCategory3Idx]
                    .sub_categories_4[subCategory4Idx];
                targetArr = subCat4.material_type_details;
                levelIds.level_one_id = updated.categories[modalCategoryIdx].id;
                levelIds.level_two_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].id;
                levelIds.level_three_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].id;
                levelIds.level_four_id = subCat4.id;
            } else if (
                modalSubCategoryIdx !== null &&
                subCategory3Idx !== null &&
                subCategory4Idx !== null &&
                subCategory5Idx !== null
            ) {
                const subCat5 = updated.categories[modalCategoryIdx]
                    .sub_categories_2[modalSubCategoryIdx]
                    .sub_categories_3[subCategory3Idx]
                    .sub_categories_4[subCategory4Idx]
                    .sub_categories_5[subCategory5Idx];
                targetArr = subCat5.material_type_details;
                levelIds.level_one_id = updated.categories[modalCategoryIdx].id;
                levelIds.level_two_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].id;
                levelIds.level_three_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].id;
                levelIds.level_four_id = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].id;
                levelIds.level_five_id = subCat5.id;
            }

            if (!targetArr) return prev;

            // Loop through all modalRows
            modalRows.forEach(row => {
                // Duplicate check
                let isDuplicate = false;
                if (row.type === "material") {
                    isDuplicate = targetArr.some(item =>
                        item.type === "material" &&
                        item.name === row.materialTypeLabel &&
                        item.specification === row.specificationLabel
                    );
                } else if (row.type === "labour") {
                    isDuplicate = targetArr.some(item =>
                        item.type === "labour" &&
                        item.labourActLabel === row.labourTypeLabel
                    );
                } else if (row.type === "composite") {
                    isDuplicate = targetArr.some(item =>
                        item.type === "composite" &&
                        item.compositeValue === row.compositeValue
                    );
                }

                if (!isDuplicate) {
                    targetArr.push({
                        id: Date.now() + Math.random(),
                        materilTypeId: row.materialType,
                        name: row.materialTypeLabel,
                        specificationId: row.specification,
                        specification: row.specificationLabel,
                        labourAct: row.labourType,
                        labourActLabel: row.labourTypeLabel,
                        compositeValue: row.compositeValue,
                        type: row.type,
                        location: "",
                        qty: "",
                        rate: row.rate,
                        wastage: "",
                    });
                }
            });

            // ✅ Store both level IDs and targetArr in state
            setLastCreatedLevelIds(levelIds);
            setLastMaterialDetails([...targetArr]);

            return updated;
        });

        setShowAddModal(false);
    };


    // console.log("last ids:", lastCreatedLevelIds)
    // console.log("last material details:", lastMaterialDetails)


    const handleRemoveMainCategoryRow = (catIdx, itemIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            // Make a copy of categories array
            updated.categories = [...updated.categories];
            // Make a copy of material_type_details array
            updated.categories[catIdx].material_type_details = [
                ...updated.categories[catIdx].material_type_details
            ];
            // Remove the item
            updated.categories[catIdx].material_type_details.splice(itemIdx, 1);
            return updated;
        });
    };

    // Handler for removing a row from sub-category 2
    const handleRemoveSubCategory2Row = (catIdx, subCatIdx, itemIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].material_type_details =
                [...updated.categories[catIdx].sub_categories_2[subCatIdx].material_type_details];
            updated.categories[catIdx].sub_categories_2[subCatIdx].material_type_details.splice(itemIdx, 1);
            return updated;
        });
    };

    const handleRemoveSubCategory3Row = (catIdx, subCatIdx, subCategory3Idx, itemIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].material_type_details =
                [...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].material_type_details];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].material_type_details.splice(itemIdx, 1);
            return updated;
        });
    };

    const handleRemoveSubCategory4Row = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].material_type_details =
                [...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].material_type_details];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].material_type_details.splice(itemIdx, 1);
            return updated;
        });
    };

    const handleRemoveSubCategory5Row = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5[subCategory5Idx].material_type_details =
                [...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5[subCategory5Idx].material_type_details];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5[subCategory5Idx].material_type_details.splice(itemIdx, 1);
            return updated;
        });
    };



    const handleEditMainCategoryField = (catIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories]; // avoid mutation

        updatedDetails.categories[catIdx] = {
            ...updatedDetails.categories[catIdx],
            [field]: value
        };

        if (field === "qty") {
            const mainQty = parseFloat(value) || 0;
            updatedDetails.categories[catIdx].material_type_details =
                updatedDetails.categories[catIdx].material_type_details.map(item => {
                    const factor = parseFloat(item.factor) || 0;
                    const wastage = parseFloat(item.wastage) || 0;
                    const qty = mainQty * factor;
                    const qtyInclWastage = qty + (qty * wastage / 100);
                    const amount = qtyInclWastage * (item.rate);
                    const costPerUnit = qty > 0 ? (amount / qty) : 0;
                    return {
                        ...item,
                        qty,
                        qtyInclWastage,
                        amount,
                        costPerUnit
                    };
                });
        }

        setSubProjectDetails(updatedDetails);
    };





    const handleEditMaterial = (catIdx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        const mainQty = parseFloat(updatedDetails.categories[catIdx].qty) || 0;

        // Recalculate qty when factor changes
        if (field === "factor") {
            const factor = parseFloat(value) || 0;
            material.qty = mainQty * factor;
        }

        // Recalculate qtyInclWastage when wastage or qty changes
        const qty = parseFloat(material.qty) || 0;
        const wastage = parseFloat(material.wastage) || 0;
        material.qtyInclWastage = qty + (qty * wastage / 100);

        // Always recalculate amount
        const rate = parseFloat(material.rate) || 0;
        material.amount = material.qtyInclWastage * rate;

        // New: Cost Per Unit
        material.costPerUnit = qty > 0 ? (material.amount / qty) : 0;


        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };


    // --- Handle editing fields in Sub Category 2 ---

    const handleEditSubCategory2Field = (catIdx, subCatIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories]; // avoid mutation

        const subCat2List = updatedDetails.categories[catIdx].sub_categories_2 || [];
        if (!subCat2List[subCatIdx]) return; // safety

        subCat2List[subCatIdx] = {
            ...subCat2List[subCatIdx],
            [field]: value
        };

        // Recalculate material details if qty changes
        if (field === "qty") {
            const mainQty = parseFloat(value) || 0;

            subCat2List[subCatIdx].material_type_details =
                (subCat2List[subCatIdx].material_type_details || []).map(item => {
                    const factor = parseFloat(item.factor) || 0;
                    const wastage = parseFloat(item.wastage) || 0;
                    const rate = parseFloat(item.rate) || 0;

                    const qty = mainQty * factor;
                    const qtyInclWastage = qty + (qty * wastage / 100);
                    const amount = qtyInclWastage * rate;
                    const costPerUnit = qty > 0 ? (amount / qty) : 0;

                    return {
                        ...item,
                        qty,
                        qtyInclWastage,
                        amount,
                        costPerUnit
                    };
                });
        }

        setSubProjectDetails(updatedDetails);
    };

    // --- Handle editing inside material_type_details for Sub Category 2 ---


    const handleEditSubCategory2Material = (catIdx, subCatIdx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const subCat2 = { ...updatedDetails.categories[catIdx].sub_categories_2[subCatIdx] };
        if (!subCat2 || !subCat2.material_type_details[itemIdx]) return;

        const materials = [...subCat2.material_type_details];
        const material = { ...materials[itemIdx] };

        // Update the field value
        material[field] = value;

        // Get subCat2 qty for calculations
        const subCatQty = parseFloat(subCat2.qty) || 0;

        // Recalculate qty when factor changes
        if (field === "factor") {
            const factor = parseFloat(value) || 0;
            material.qty = subCatQty * factor;
        }

        // Recalculate qtyInclWastage
        const qty = parseFloat(material.qty) || 0;
        const wastage = parseFloat(material.wastage) || 0;
        material.qtyInclWastage = qty + (qty * wastage / 100);

        // Always recalculate amount
        const rate = parseFloat(material.rate) || 0;
        material.amount = material.qtyInclWastage * rate;

        // Cost Per Unit
        material.costPerUnit = qty > 0 ? (material.amount / qty) : 0;

        // Update back into materials array
        materials[itemIdx] = material;
        subCat2.material_type_details = materials;

        // Put subCat2 back into categories
        updatedDetails.categories[catIdx].sub_categories_2[subCatIdx] = subCat2;

        // Update state
        setSubProjectDetails(updatedDetails);
    };



    const handleEditSubCategory3Field = (catIdx, subCatIdx2, subCatIdx3, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories]; // avoid mutation

        const subCat3List =
            updatedDetails.categories[catIdx]?.sub_categories_2?.[subCatIdx2]?.sub_categories_3 || [];
        if (!subCat3List[subCatIdx3]) return; // safety

        subCat3List[subCatIdx3] = {
            ...subCat3List[subCatIdx3],
            [field]: value
        };

        // Recalculate material details if qty changes
        if (field === "qty") {
            const mainQty = parseFloat(value) || 0;

            subCat3List[subCatIdx3].material_type_details =
                (subCat3List[subCatIdx3].material_type_details || []).map(item => {
                    const factor = parseFloat(item.factor) || 0;
                    const wastage = parseFloat(item.wastage) || 0;
                    const rate = parseFloat(item.rate) || 0;

                    const qty = mainQty * factor;
                    const qtyInclWastage = qty + (qty * wastage / 100);
                    const amount = qtyInclWastage * rate;
                    const costPerUnit = qty > 0 ? (amount / qty) : 0;

                    return {
                        ...item,
                        qty,
                        qtyInclWastage,
                        amount,
                        costPerUnit
                    };
                });
        }

        setSubProjectDetails(updatedDetails);
    };


    const handleEditSubCategory3Material = (catIdx, subCatIdx2, subCatIdx3, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const subCat3 = {
            ...updatedDetails.categories[catIdx]
                .sub_categories_2[subCatIdx2]
                .sub_categories_3[subCatIdx3]
        };
        if (!subCat3 || !subCat3.material_type_details[itemIdx]) return;

        const materials = [...subCat3.material_type_details];
        const material = { ...materials[itemIdx] };

        // Update field
        material[field] = value;

        const mainQty = parseFloat(subCat3.qty) || 0;

        // Factor-based qty
        if (field === "factor") {
            const factor = parseFloat(value) || 0;
            material.qty = mainQty * factor;
        }

        // Qty incl wastage
        const qty = parseFloat(material.qty) || 0;
        const wastage = parseFloat(material.wastage) || 0;
        material.qtyInclWastage = qty + (qty * wastage / 100);

        // Amount
        const rate = parseFloat(material.rate) || 0;
        material.amount = material.qtyInclWastage * rate;

        // Cost per unit
        material.costPerUnit = qty > 0 ? (material.amount / qty) : 0;

        materials[itemIdx] = material;
        subCat3.material_type_details = materials;

        updatedDetails.categories[catIdx]
            .sub_categories_2[subCatIdx2]
            .sub_categories_3[subCatIdx3] = subCat3;

        setSubProjectDetails(updatedDetails);
    };


    // For editing fields in sub category 4
    const handleEditSubCategory4Field = (
        catIdx,
        subCatIdx2,
        subCatIdx3,
        subCatIdx4,
        field,
        value
    ) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories]; // avoid mutation

        const subCat4List =
            updatedDetails.categories[catIdx]?.sub_categories_2?.[subCatIdx2]?.sub_categories_3?.[subCatIdx3]?.sub_categories_4 || [];
        if (!subCat4List[subCatIdx4]) return; // safety

        subCat4List[subCatIdx4] = {
            ...subCat4List[subCatIdx4],
            [field]: value
        };

        // Recalculate material details if qty changes
        if (field === "qty") {
            const mainQty = parseFloat(value) || 0;

            subCat4List[subCatIdx4].material_type_details =
                (subCat4List[subCatIdx4].material_type_details || []).map(item => {
                    const factor = parseFloat(item.factor) || 0;
                    const wastage = parseFloat(item.wastage) || 0;
                    const rate = parseFloat(item.rate) || 0;

                    const qty = mainQty * factor;
                    const qtyInclWastage = qty + (qty * wastage / 100);
                    const amount = qtyInclWastage * rate;
                    const costPerUnit = qty > 0 ? (amount / qty) : 0;

                    return {
                        ...item,
                        qty,
                        qtyInclWastage,
                        amount,
                        costPerUnit
                    };
                });
        }

        setSubProjectDetails(updatedDetails);
    };

    // For editing materials inside sub category 4
    const handleEditSubCategory4Material = (
        catIdx,
        subCatIdx2,
        subCatIdx3,
        subCatIdx4,
        itemIdx,
        field,
        value
    ) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const subCat4 = {
            ...updatedDetails.categories[catIdx]
                .sub_categories_2[subCatIdx2]
                .sub_categories_3[subCatIdx3]
                .sub_categories_4[subCatIdx4]
        };
        if (!subCat4 || !subCat4.material_type_details[itemIdx]) return;

        const materials = [...subCat4.material_type_details];
        const material = { ...materials[itemIdx] };

        // Update field
        material[field] = value;

        const mainQty = parseFloat(subCat4.qty) || 0;

        // Factor-based qty
        if (field === "factor") {
            const factor = parseFloat(value) || 0;
            material.qty = mainQty * factor;
        }

        // Qty incl wastage
        const qty = parseFloat(material.qty) || 0;
        const wastage = parseFloat(material.wastage) || 0;
        material.qtyInclWastage = qty + (qty * wastage / 100);

        // Amount
        const rate = parseFloat(material.rate) || 0;
        material.amount = material.qtyInclWastage * rate;

        // Cost per unit
        material.costPerUnit = qty > 0 ? (material.amount / qty) : 0;

        materials[itemIdx] = material;
        subCat4.material_type_details = materials;

        updatedDetails.categories[catIdx]
            .sub_categories_2[subCatIdx2]
            .sub_categories_3[subCatIdx3]
            .sub_categories_4[subCatIdx4] = subCat4;

        setSubProjectDetails(updatedDetails);
    };

    const handleEditSubCategory5Field = (
        catIdx,
        subCatIdx2,
        subCatIdx3,
        subCatIdx4,
        subCatIdx5,
        field,
        value
    ) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories]; // avoid mutation

        const subCat5List =
            updatedDetails.categories[catIdx]
                ?.sub_categories_2?.[subCatIdx2]
                ?.sub_categories_3?.[subCatIdx3]
                ?.sub_categories_4?.[subCatIdx4]
                ?.sub_categories_5 || [];
        if (!subCat5List[subCatIdx5]) return; // safety

        subCat5List[subCatIdx5] = {
            ...subCat5List[subCatIdx5],
            [field]: value
        };

        // Recalculate material details if qty changes
        if (field === "qty") {
            const mainQty = parseFloat(value) || 0;

            subCat5List[subCatIdx5].material_type_details =
                (subCat5List[subCatIdx5].material_type_details || []).map(item => {
                    const factor = parseFloat(item.factor) || 0;
                    const wastage = parseFloat(item.wastage) || 0;
                    const rate = parseFloat(item.rate) || 0;

                    const qty = mainQty * factor;
                    const qtyInclWastage = qty + (qty * wastage / 100);
                    const amount = qtyInclWastage * rate;
                    const costPerUnit = qty > 0 ? (amount / qty) : 0;

                    return {
                        ...item,
                        qty,
                        qtyInclWastage,
                        amount,
                        costPerUnit
                    };
                });
        }

        setSubProjectDetails(updatedDetails);
    };

    const handleEditSubCategory5Material = (
        catIdx,
        subCatIdx2,
        subCatIdx3,
        subCatIdx4,
        subCatIdx5,
        itemIdx,
        field,
        value
    ) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const subCat5 = {
            ...updatedDetails.categories[catIdx]
                .sub_categories_2[subCatIdx2]
                .sub_categories_3[subCatIdx3]
                .sub_categories_4[subCatIdx4]
                .sub_categories_5[subCatIdx5]
        };
        if (!subCat5 || !subCat5.material_type_details[itemIdx]) return;

        const materials = [...subCat5.material_type_details];
        const material = { ...materials[itemIdx] };

        // Update field
        material[field] = value;

        const mainQty = parseFloat(subCat5.qty) || 0;

        // Factor-based qty
        if (field === "factor") {
            const factor = parseFloat(value) || 0;
            material.qty = mainQty * factor;
        }

        // Qty incl wastage
        const qty = parseFloat(material.qty) || 0;
        const wastage = parseFloat(material.wastage) || 0;
        material.qtyInclWastage = qty + (qty * wastage / 100);

        // Amount
        const rate = parseFloat(material.rate) || 0;
        material.amount = material.qtyInclWastage * rate;

        // Cost per unit
        material.costPerUnit = qty > 0 ? (material.amount / qty) : 0;

        materials[itemIdx] = material;
        subCat5.material_type_details = materials;

        updatedDetails.categories[catIdx]
            .sub_categories_2[subCatIdx2]
            .sub_categories_3[subCatIdx3]
            .sub_categories_4[subCatIdx4]
            .sub_categories_5[subCatIdx5] = subCat5;

        setSubProjectDetails(updatedDetails);
    };


    const handleEditMaterial2 = (catIdx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        // Always recalculate amount when qty or rate changes
        const qty = parseFloat(material.qty) || 0;
        const rate = parseFloat(material.rate) || 0;
        material.amount = qty * rate;

        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };
    // Sub-Category 2
    const handleEditMaterial2SubCat2 = (catIdx, subCatIdx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        const qty = parseFloat(material.qty) || 0;
        const rate = parseFloat(material.rate) || 0;
        material.amount = qty * rate;

        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };

    // Sub-Category 3
    const handleEditMaterial2SubCat3 = (catIdx, subCatIdx, subCat3Idx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        const qty = parseFloat(material.qty) || 0;
        const rate = parseFloat(material.rate) || 0;
        material.amount = qty * rate;

        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };

    // Sub-Category 4
    const handleEditMaterial2SubCat4 = (catIdx, subCatIdx, subCat3Idx, subCat4Idx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].sub_categories_4[subCat4Idx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        const qty = parseFloat(material.qty) || 0;
        const rate = parseFloat(material.rate) || 0;
        material.amount = qty * rate;

        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].sub_categories_4[subCat4Idx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };

    // Sub-Category 5
    const handleEditMaterial2SubCat5 = (catIdx, subCatIdx, subCat3Idx, subCat4Idx, subCat5Idx, itemIdx, field, value) => {
        const updatedDetails = { ...subProjectDetails };
        updatedDetails.categories = [...updatedDetails.categories];

        const materials = [...updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].sub_categories_4[subCat4Idx].sub_categories_5[subCat5Idx].material_type_details];
        const material = { ...materials[itemIdx] };

        material[field] = value;

        const qty = parseFloat(material.qty) || 0;
        const rate = parseFloat(material.rate) || 0;
        material.amount = qty * rate;

        materials[itemIdx] = material;
        updatedDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCat3Idx].sub_categories_4[subCat4Idx].sub_categories_5[subCat5Idx].material_type_details = materials;

        setSubProjectDetails(updatedDetails);
    };

    const labourTypeOptions = [
        { value: "skilled", label: "Skilled" },
        { value: "unskilled", label: "Unskilled" },
        { value: "supervisor", label: "Supervisor" },
    ];

    const [inventoryTypes2, setInventoryTypes2] = useState([]);  // State to hold the fetched data
    const [selectedInventory2, setSelectedInventory2] = useState(null);  // State to hold selected inventory type

    useEffect(() => {
        axios.get(`${baseURL}pms/inventory_types.json?q[category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
            .then(response => {
                // Map the fetched data to the format required by react-select
                const options = response.data.map(inventory => ({
                    value: inventory.id,
                    label: inventory.name
                }));

                setInventoryTypes2(options)
            })
            .catch(error => {
                console.error('Error fetching inventory types:', error);
            });
    }, []);  // Empty dependency array to run only once on mount

    // for generic specification
    const [genericSpecifications, setGenericSpecifications] = useState([]); // State to hold the fetched generic specifications
    const [selectedGenericSpecifications, setSelectedGenericSpecifications] = useState(null); // Holds the selected generic specifications for each material
    const [genericSpecificationsByRow, setGenericSpecificationsByRow] = useState([]); // Array of arrays

    useEffect(() => {
        // For each modal row, fetch generic specifications if materialType is set
        const fetchAllSpecs = async () => {
            const promises = modalRows.map(row => {
                if (row.materialType) {
                    return axios
                        .get(`${baseURL}pms/generic_infos.json?q[inventory_type_id_eq]=${row.materialType}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                        .then(response =>
                            response.data.map(specification => ({
                                value: specification.id,
                                label: specification.generic_info,
                            }))
                        )
                        .catch(() => []);
                }
                return Promise.resolve([]);
            });

            const allSpecs = await Promise.all(promises);
            setGenericSpecificationsByRow(allSpecs);
        };

        fetchAllSpecs();
    }, [modalRows, baseURL]);

    const [labourActivities, setLabourActivities] = useState([]);
    const [selectedLabourActivity, setSelectedLabourActivity] = useState(null);
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}labour_activities.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,

                );
                // Assuming the API returns an array of objects with { id, name }
                const options = response.data.labour_activities.map(act => ({
                    value: act.id,
                    label: act.name
                }));
                // console.log("options cat:***********************", options)
                setLabourActivities(options);
            } catch (error) {
                console.error("Error fetching labour activities:", error);
            }
        };

        fetchActivities();
    }, []);

    const [unitOfMeasures, setUnitOfMeasures] = useState([]);
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
                // console.log("unit options without materials:",options)
                setUnitOfMeasures(options); // Save the formatted options to state
            })
            .catch((error) => {
                console.error("Error fetching unit of measures:", error);
            });
    }, []);




    // console.log("cat :",subProjectDetails.categories)

    const mappedData = [];

    subProjectDetails?.categories?.forEach(level1 => {
        // Level 1 data
        if (level1.material_type_details?.length) {
            mappedData.push({
                name: level1.items,
                location: level1.location || "",
                qty: level1.qty || "",
                unit_of_measure_id: level1.uom || null,
                level_one_id: level1.id || null,
                level_two_id: null,
                level_three_id: null,
                level_four_id: null,
                level_five_id: null,
                // materials: level1.material_type_details

                item_details: (level1.material_type_details || []).map(item => ({
                    type: item.type,
                    material_type_id: item.materilTypeId || null,
                    generic_info_id: item.specificationId || null,
                    labour_activity_id: item.labourAct || null,
                    name: item.compositeValue || null,
                    factor: item.factor || 0,
                    excl_wastage_qty: item.qty || 0,
                    incl_wastage_qty: item.qtyInclWastage || 0,
                    unit_of_measure_id: item.uom || null,
                    wastage: item.wastage || 0,
                    rate: item.rate || 0,
                    amount: item.amount || 0,
                    cost_per_unit: item.costPerUnit || 0
                }))
            });
        }
        // Level 2
        level1.sub_categories_2?.forEach(level2 => {
            if (level2.material_type_details?.length) {
                mappedData.push({
                    name: level2.items,
                    location: level2.location || "",
                    qty: level2.qty || "",
                    unit_of_measure_id: level2.uom || null,
                    level_one_id: level1.id || null,
                    level_two_id: level2.id || null,
                    level_three_id: null,
                    level_four_id: null,
                    level_five_id: null,
                    item_details: (level2.material_type_details || []).map(item => ({
                        type: item.type,
                        material_type_id: item.materilTypeId || null,
                        generic_info_id: item.specificationId || null,
                        labour_activity_id: item.labourAct || null,
                        name: item.compositeValue || null,
                        factor: item.factor || 0,
                        excl_wastage_qty: item.qty || 0,
                        incl_wastage_qty: item.qtyInclWastage || 0,
                        unit_of_measure_id: item.uom || null,
                        wastage: item.wastage || 0,
                        rate: item.rate || 0,
                        amount: item.amount || 0,
                        cost_per_unit: item.costPerUnit || 0
                    }))
                });
            }

            // Level 3
            level2.sub_categories_3?.forEach(level3 => {
                if (level3.material_type_details?.length) {
                    mappedData.push({
                        name: level3.items,
                        location: level3.location || "",
                        qty: level3.qty || "",
                        unit_of_measure_id: level3.uom || null,
                        level_one_id: level1.id || null,
                        level_two_id: level2.id || null,
                        level_three_id: level3.id || null,
                        level_four_id: null,
                        level_five_id: null,
                        item_details: (level3.material_type_details || []).map(item => ({
                            type: item.type,
                            material_type_id: item.materilTypeId || null,
                            generic_info_id: item.specificationId || null,
                            labour_activity_id: item.labourAct || null,
                            name: item.compositeValue || null,
                            factor: item.factor || 0,
                            excl_wastage_qty: item.qty || 0,
                            incl_wastage_qty: item.qtyInclWastage || 0,
                            unit_of_measure_id: item.uom || null,
                            wastage: item.wastage || 0,
                            rate: item.rate || 0,
                            amount: item.amount || 0,
                            cost_per_unit: item.costPerUnit || 0
                        }))
                    });
                }

                // Level 4
                level3.sub_categories_4?.forEach(level4 => {
                    if (level4.material_type_details?.length) {
                        mappedData.push({
                            name: level4.items,
                            location: level4.location || "",
                            qty: level4.qty || "",
                            unit_of_measure_id: level4.uom || null,
                            level_one_id: level1.id || null,
                            level_two_id: level2.id || null,
                            level_three_id: level3.id || null,
                            level_four_id: level4.id || null,
                            level_five_id: null,
                            item_details: (level4.material_type_details || []).map(item => ({
                                type: item.type,
                                material_type_id: item.materilTypeId || null,
                                generic_info_id: item.specificationId || null,
                                labour_activity_id: item.labourAct || null,
                                name: item.compositeValue || null,
                                factor: item.factor || 0,
                                excl_wastage_qty: item.qty || 0,
                                incl_wastage_qty: item.qtyInclWastage || 0,
                                unit_of_measure_id: item.uom || null,
                                wastage: item.wastage || 0,
                                rate: item.rate || 0,
                                amount: item.amount || 0,
                                cost_per_unit: item.costPerUnit || 0
                            }))
                        });
                    }

                    // Level 5
                    level4.sub_categories_5?.forEach(level5 => {
                        if (level5.material_type_details?.length) {
                            mappedData.push({
                                name: level5.items,
                                location: level5.location || "",
                                qty: level5.qty || "",
                                unit_of_measure_id: level5.uom || null,
                                level_one_id: level1.id || null,
                                level_two_id: level2.id || null,
                                level_three_id: level3.id || null,
                                level_four_id: level4.id || null,
                                level_five_id: level5.id || null,
                                item_details: (level5.material_type_details || []).map(item => ({
                                    type: item.type,
                                    material_type_id: item.materilTypeId || null,
                                    generic_info_id: item.specificationId || null,
                                    labour_activity_id: item.labourAct || null,
                                    name: item.compositeValue || null,
                                    factor: item.factor || 0,
                                    excl_wastage_qty: item.qty || 0,
                                    incl_wastage_qty: item.qtyInclWastage || 0,
                                    unit_of_measure_id: item.uom || null,
                                    wastage: item.wastage || 0,
                                    rate: item.rate || 0,
                                    amount: item.amount || 0,
                                    cost_per_unit: item.costPerUnit || 0
                                }))
                            });
                        }


                    });
                });
            });
        });
    });



    // console.log("data paylod on**********************", mappedData);



    const payload = {
        company_id: selectedCompany?.value,
        project_id: selectedProject?.value,
        pms_site_id: selectedSite?.value,
        // pms_wing_id: wingId,
        estimation_items: mappedData
    };
    // console.log("payload create budget****:", payload)


    const handleSubmit = async () => {
        try {
            const payload = {
                company_id: selectedCompany?.value,
                project_id: selectedProject?.value,
                pms_site_id: selectedSite?.value,
                // pms_wing_id: wingId,
                estimation_items: mappedData
            };

            const response = await axios.post(
                `${baseURL}estimation_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                payload,

            );

            // alert("Estimation details submitted successfully!");

            // console.log("Success:", response.data);
            // navigate("/estimation-creation-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414");


            if (response.status === 201) {
                alert("Estimation details submitted successfully!");
                console.log("Success:", response.data);
                navigate(
                    "/estimation-creation-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
                );
            } else {
                alert("Something went wrong. Please try again.");
            }
            // Optional: show toast or reset form
        } catch (error) {
            console.error("Error submitting estimation details:", error);
            // Optional: show error message
        }
    };


    // main category and sub level2

    const [workCategories, setWorkCategories] = useState([]); // To store work categories fetched from the API
    const [selectedCategory, setSelectedCategory] = useState(null); // To store the selected work category
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); // To store the selected work subcategory
    const [subCategoryOptions, setSubCategoryOptions] = useState([]); // To store subcategories for the selected category
    const [subCategoryLevel3Options, setSubCategoryLevel3Options] = useState([]);
    const [subCategoryLevel4Options, setSubCategoryLevel4Options] = useState([]); // Sub-category level 4 options
    const [subCategoryLevel5Options, setSubCategoryLevel5Options] = useState([]); // Sub-category level 5 options
    const [selectedSubCategoryLevel3, setSelectedSubCategoryLevel3] =
        useState(null); // State for selected subcategory level 3
    const [selectedSubCategoryLevel4, setSelectedSubCategoryLevel4] =
        useState(null); // State for selected subcategory level 4
    const [selectedSubCategoryLevel5, setSelectedSubCategoryLevel5] =
        useState(null); // State for selected subcategory level 5

    // Fetching work categories on component mount
    useEffect(() => {
        axios
            .get(
                `${baseURL}work_categories/work_sub_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            ) // Replace with your API endpoint
            .then((response) => {
                setWorkCategories(response.data.categories); // Save the categories to state
                // console.log("work cat:", response.data.work_categories)
            })
            .catch((error) => {
                console.error("Error fetching work categories:", error);
            });
    }, []);

    // Handler for selecting a work category
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setSelectedSubCategory(null); // Clear subcategory selection when the category changes
        setSubCategoryOptions([]); // Reset subcategories list
        setSubCategoryLevel3Options([]); // Clear sub-subcategory options
        setSubCategoryLevel4Options([]); // Clear level 4 options
        setSubCategoryLevel5Options([]); // Clear level 5 options
        setSelectedSubCategoryLevel3(null);
        setSelectedSubCategoryLevel4(null);
        setSelectedSubCategoryLevel5(null);

        // If there are subcategories for this category, update the subcategory options
        if (selectedOption && selectedOption.work_sub_categories.length > 0) {
            setSubCategoryOptions(
                selectedOption.work_sub_categories.map((subCategory) => ({
                    value: subCategory.id,
                    label: subCategory.name,
                }))
            );
        }
    };

    const handleMainCategorySelect = (catIdx, selectedOption) => {

        const subCategoryOptions =
            selectedOption?.sub_categories_2?.map(subCat => ({
                value: subCat.id,
                label: subCat.name,
                sub_categories_3: subCat.sub_categories_3 // pass for next level
            })) || [];
        console.log("sub options in main:", subCategoryOptions)

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...updated.categories];
            updatedCategories[catIdx] = {
                ...updatedCategories[catIdx],
                id: selectedOption.value,
                name: selectedOption.label,
                selectedSubCategory: null, // reset selection
                subCategoryOptions,        // store options for this main category
                //   selectedSubCategoryLevel3: null,
                //   subCategoryLevel3Options: [],
                //   selectedSubCategoryLevel4: null,
                //   subCategoryLevel4Options: [],
                //   selectedSubCategoryLevel5: null,
                //   subCategoryLevel5Options: []
            };
            updated.categories = updatedCategories;
            return updated;
        });

    };

    const handleAddMainCategory = () => {
        const newCategory = {
            id: Date.now(), // unique ID
            name: "",
            budget: "",
            material_type_details: [],
            sub_categories_2: [],
            location: "",
            items: "",
            uom: "",
            qty: "",
        };

        setSubProjectDetails(prev => ({
            ...prev,
            categories: [...prev.categories, newCategory],
        }));
    };


    const handleSubCategorySelect = (catIdx, subCatIdx, selectedOption) => {
        // console.log("selected option sub 2:",selectedOption)
        // Find sub-subcategories for the selected sub-category
        const subCategoryLevel3Options =
            selectedOption?.sub_categories_3?.map(subCat => ({
                value: subCat.id,
                label: subCat.name,
                sub_categories_4: subCat.sub_categories_4 // for deeper levels
            })) || [];

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...updated.categories];

            // Find the last sub-category 2 (the one just added or being edited)
            const subCategories2 = updatedCategories[catIdx].sub_categories_2;
            if (subCategories2 && subCategories2.length > 0) {
                const lastIdx = subCategories2.length - 1;
                subCategories2[lastIdx] = {
                    ...subCategories2[lastIdx],
                    id: selectedOption.value,
                    name: selectedOption.label,
                    selectedSubCategory: selectedOption,
                    subCategoryLevel3Options,
                    selectedSubCategoryLevel3: null,
                    // subCategoryLevel4Options: [],
                    // selectedSubCategoryLevel4: null,
                    // subCategoryLevel5Options: [],
                    // selectedSubCategoryLevel5: null
                };
            }

            updatedCategories[catIdx].sub_categories_2 = subCategories2;
            updated.categories = updatedCategories;
            return updated;
        });
    };

    // 3. Select Sub-Category Level 3
    const handleLevel3Change = (catIdx, subCatIdx, subCategory3Idx, selectedOption) => {
        const subCategoryLevel4Options =
            selectedOption?.sub_categories_4?.map(subCat4 => ({
                value: subCat4.id,
                label: subCat4.name,
                sub_categories_5: subCat4.sub_categories_5
            })) || [];
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...updated.categories];
            const subCategories3 = updatedCategories[catIdx].sub_categories_2[subCatIdx].sub_categories_3;
            if (subCategories3 && subCategories3[subCategory3Idx]) {
                subCategories3[subCategory3Idx] = {
                    ...subCategories3[subCategory3Idx],
                    id: selectedOption.value,
                    name: selectedOption.label,
                    selectedSubCategoryLevel3: selectedOption,
                    subCategoryLevel4Options,
                    selectedSubCategoryLevel4: null
                };
            }
            updatedCategories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = subCategories3;
            updated.categories = updatedCategories;
            return updated;
        });
    };

    const handleLevel4Change = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, selectedOption) => {
        const subCategoryLevel5Options =
            selectedOption?.sub_categories_5?.map(subCat5 => ({
                value: subCat5.id,
                label: subCat5.name
            })) || [];
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...updated.categories];
            const subCategories4 = updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4;
            if (subCategories4 && subCategories4[subCategory4Idx]) {
                subCategories4[subCategory4Idx] = {
                    ...subCategories4[subCategory4Idx],
                    id: selectedOption.value,
                    name: selectedOption.label,
                    selectedSubCategoryLevel4: selectedOption,
                    subCategoryLevel5Options,
                    selectedSubCategoryLevel5: null
                };
            }
            updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4 = subCategories4;
            updated.categories = updatedCategories;
            return updated;
        });
    };

    const handleLevel5Change = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, selectedOption) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...updated.categories];
            const subCategories5 = updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4[subCategory4Idx]
                .sub_categories_5;
            if (subCategories5 && subCategories5[subCategory5Idx]) {
                subCategories5[subCategory5Idx] = {
                    ...subCategories5[subCategory5Idx],
                    id: selectedOption.value,
                    name: selectedOption.label,
                    selectedSubCategoryLevel5: selectedOption
                };
            }
            updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4[subCategory4Idx]
                .sub_categories_5 = subCategories5;
            updated.categories = updatedCategories;
            return updated;
        });
    };




    // Handler for selecting a work subcategory
    const handleSubCategoryChange = (selectedOption) => {
        setSelectedSubCategory(selectedOption);
        setSubCategoryLevel3Options([]); // Clear sub-subcategory options on subcategory change
        setSubCategoryLevel4Options([]); // Clear subcategory level 4 options
        setSubCategoryLevel5Options([]); // Clear subcategory level 5 options
        setSelectedSubCategoryLevel3(null);
        setSelectedSubCategoryLevel4(null);
        setSelectedSubCategoryLevel5(null);

        // Fetch sub-subcategories using the selected subcategory ID-- level3
        axios
            .get(
                `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((response) => {
                const subSubCategories = response.data.work_sub_categories || [];
                setSubCategoryLevel3Options(
                    subSubCategories.map((subSubCategory) => ({
                        value: subSubCategory.id,
                        label: subSubCategory.name,
                    }))
                );
            })
            .catch((error) => {
                console.error("Error fetching sub-subcategories:", error);
            });
    };



    const handleEditMainCategoryField2 = (catIdx, field, value) => {
        const updatedCategories = [...(subProjectDetails.categories || [])];
        updatedCategories[catIdx] = {
            ...updatedCategories[catIdx],
            [field]: value
        };

        // If the field being updated is "id", also update the name
        if (field === "id") {
            const selected = mainCategoryOptions.find(opt => opt.value === value);
            updatedCategories[catIdx].name = selected ? selected.label : "";
        }

        setSubProjectDetails(prev => ({
            ...prev,
            categories: updatedCategories
        }));
    };




    const handleAddSubCategory = (catIdx) => {
        // console.log("Add sub-category called for index:", catIdx); // Debug log
        const newSubCat = {
            id: Date.now(), // temp unique ID
            name: "",
            budget: "",
            material_type_details: [],
            sub_categories_3: []
        };

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...(updated.categories || [])];

            // Ensure sub_categories_2 exists as an array
            if (!Array.isArray(updatedCategories[catIdx].sub_categories_2)) {
                updatedCategories[catIdx].sub_categories_2 = [];
            }

            updatedCategories[catIdx].sub_categories_2.push(newSubCat);

            updated.categories = updatedCategories;
            return updated;
        });
    };
    const handleRemoveSubCategory2 = (catIdx, subCatIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [
                ...updated.categories[catIdx].sub_categories_2
            ];
            updated.categories[catIdx].sub_categories_2.splice(subCatIdx, 1);
            return updated;
        });

    };

    // Remove Main Category (Level 1)
    const handleRemoveMainCategory = (catIdx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories.splice(catIdx, 1);
            return updated;
        });
    };

    // Remove Sub-Category 3 (Level 3)
    const handleRemoveSubCategory3 = (catIdx, subCatIdx, subCategory3Idx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3.splice(subCategory3Idx, 1);
            return updated;
        });
    };

    // Remove Sub-Category 4 (Level 4)
    const handleRemoveSubCategory4 = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4.splice(subCategory4Idx, 1);
            return updated;
        });
    };

    // Remove Sub-Category 5 (Level 5)
    const handleRemoveSubCategory5 = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx) => {
        setSubProjectDetails(prev => {
            const updated = { ...prev };
            updated.categories = [...updated.categories];
            updated.categories[catIdx].sub_categories_2 = [...updated.categories[catIdx].sub_categories_2];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5 = [
                ...updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5
            ];
            updated.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5.splice(subCategory5Idx, 1);
            return updated;
        });
    };


    const handleAddSubCategory3 = (catIdx, subCatIdx) => {
        const newSubCat3 = {
            id: Date.now(), // temp unique ID
            name: "",
            budget: "",
            material_type_details: [],
            sub_categories_4: []
        };

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...(updated.categories || [])];

            // Ensure sub_categories_3 exists as an array
            if (!Array.isArray(updatedCategories[catIdx].sub_categories_2[subCatIdx].sub_categories_3)) {
                updatedCategories[catIdx].sub_categories_2[subCatIdx].sub_categories_3 = [];
            }

            updatedCategories[catIdx].sub_categories_2[subCatIdx].sub_categories_3.push(newSubCat3);

            updated.categories = updatedCategories;
            return updated;
        });
    };

    const handleAddSubCategory4 = (catIdx, subCatIdx, subCategory3Idx) => {
        const newSubCat4 = {
            id: Date.now(), // temp unique ID
            name: "",
            budget: "",
            material_type_details: [],
            sub_categories_5: []
        };

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...(updated.categories || [])];

            // Safety: Ensure sub_categories_4 exists as an array
            if (!Array.isArray(updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4)) {
                updatedCategories[catIdx]
                    .sub_categories_2[subCatIdx]
                    .sub_categories_3[subCategory3Idx]
                    .sub_categories_4 = [];
            }

            updatedCategories[catIdx]
                .sub_categories_2[subCatIdx]
                .sub_categories_3[subCategory3Idx]
                .sub_categories_4.push(newSubCat4);

            updated.categories = updatedCategories;
            return updated;
        });
    };

    const handleAddSubCategory5 = (catIdx, subCatIdx, subCategory3Idx, subCategory4Idx) => {
        const newSubCat5 = {
            id: Date.now(), // temp unique ID
            name: "",
            budget: "",
            material_type_details: []
        };

        setSubProjectDetails(prev => {
            const updated = { ...prev };
            const updatedCategories = [...(updated.categories || [])];

            // Safety: Ensure sub_categories_5 exists as an array
            const subCat4 = updatedCategories[catIdx]
                ?.sub_categories_2?.[subCatIdx]
                ?.sub_categories_3?.[subCategory3Idx]
                ?.sub_categories_4?.[subCategory4Idx];

            if (!subCat4) return prev;

            if (!Array.isArray(subCat4.sub_categories_5)) {
                subCat4.sub_categories_5 = [];
            }

            subCat4.sub_categories_5.push(newSubCat5);

            updated.categories = updatedCategories;
            return updated;
        });
    };


    function isOtherLevelFrozen(category, currentLevel, currentIdxs) {
        // Level 1 (main)
        if (currentLevel === "main") {
            // Freeze if any sub2, sub3, sub4, sub5 has material_type_details
            return (
                category.sub_categories_2?.some(sub2 =>
                    sub2.material_type_details?.length > 0 ||
                    sub2.sub_categories_3?.some(sub3 =>
                        sub3.material_type_details?.length > 0 ||
                        sub3.sub_categories_4?.some(sub4 =>
                            sub4.material_type_details?.length > 0 ||
                            sub4.sub_categories_5?.some(sub5 =>
                                sub5.material_type_details?.length > 0
                            )
                        )
                    )
                )
            );
        }

        // Level 2 (sub2)
        if (currentLevel === "sub2") {
            // Freeze if main, sub3, sub4, sub5 have material details
            return (
                category.material_type_details?.length > 0 ||
                category.sub_categories_2?.[currentIdxs.subCatIdx]?.sub_categories_3?.some(sub3 =>
                    sub3.material_type_details?.length > 0 ||
                    sub3.sub_categories_4?.some(sub4 =>
                        sub4.material_type_details?.length > 0 ||
                        sub4.sub_categories_5?.some(sub5 =>
                            sub5.material_type_details?.length > 0
                        )
                    )
                )
            );
        }

        // Level 3 (sub3)
        if (currentLevel === "sub3") {
            const sub2 = category.sub_categories_2?.[currentIdxs.subCatIdx];
            if (!sub2) return false;
            const sub3 = sub2.sub_categories_3?.[currentIdxs.subCategory3Idx];
            if (!sub3) return false;
            // Freeze if main, sub2, sub4, sub5 have material details
            return (
                category.material_type_details?.length > 0 ||
                sub2.material_type_details?.length > 0 ||
                sub3.sub_categories_4?.some(sub4 =>
                    sub4.material_type_details?.length > 0 ||
                    sub4.sub_categories_5?.some(sub5 =>
                        sub5.material_type_details?.length > 0
                    )
                )
            );
        }

        // Level 4 (sub4)
        if (currentLevel === "sub4") {
            const sub2 = category.sub_categories_2?.[currentIdxs.subCatIdx];
            const sub3 = sub2?.sub_categories_3?.[currentIdxs.subCategory3Idx];
            const sub4 = sub3?.sub_categories_4?.[currentIdxs.subCategory4Idx];
            if (!sub4) return false;
            // Freeze if main, sub2, sub3, sub5 have material details
            return (
                category.material_type_details?.length > 0 ||
                sub2.material_type_details?.length > 0 ||
                sub3.material_type_details?.length > 0 ||
                sub4.sub_categories_5?.some(sub5 =>
                    sub5.material_type_details?.length > 0
                )
            );
        }

        // Level 5 (sub5)
        if (currentLevel === "sub5") {
            const sub2 = category.sub_categories_2?.[currentIdxs.subCatIdx];
            const sub3 = sub2?.sub_categories_3?.[currentIdxs.subCategory3Idx];
            const sub4 = sub3?.sub_categories_4?.[currentIdxs.subCategory4Idx];
            const sub5 = sub4?.sub_categories_5?.[currentIdxs.subCategory5Idx];
            if (!sub5) return false;
            // Freeze if main, sub2, sub3, sub4 have material details
            return (
                category.material_type_details?.length > 0 ||
                sub2.material_type_details?.length > 0 ||
                sub3.material_type_details?.length > 0 ||
                sub4.material_type_details?.length > 0
            );
        }

        return false;
    }


    function mapApiToForm(apiData) {
        return {
            ...apiData,
            categories: apiData.categories.map(cat => ({
                ...cat,
                items: cat.estimation_item?.name || "",
                location: cat.estimation_item?.location || "",
                qty: cat.estimation_item?.qty || "",
                uom: cat.estimation_item?.unit_of_measure_id || "",
                unit_of_measure_id: cat.estimation_item?.unit_of_measure_id || "",
                material_type_details: cat.item_details?.map(item => ({
                    ...item,
                    materialType: item.material_type_id || item.materilTypeId || "",
                    materialTypeLabel: item.material_type || "",
                    specification: item.generic_info_id || "",
                    specificationLabel: item.generic_info || "",
                    labourType: item.labour_activity || "",
                    labourTypeLabel: item.labour_activity || "",
                    compositeValue: item.composite_name || "",
                    rate: item.rate || "",
                    type: item.type || "material",
                    qty: item.excl_wastage_qty || "",
                    wastage: item.wastage || "",
                    uom: item.unit_of_measure_id || "",
                    amount: item.amount || "",
                    factor: item.factor || "",
                    qtyInclWastage: item.incl_wastage_qty || "",
                    costPerUnit: item.cost_per_unit || ""
                })) || [],
                selectedSubCategory: cat.sub_categories_2?.find(
                    sub => sub.id === cat.selectedSubCategory?.value
                ) || null,
                subCategoryOptions: cat.sub_categories_options.sub_categories_2?.map(sub => ({
                    value: sub.id,
                    label: sub.name,
                    subCategoryLevel3Options: sub.sub_categories_3?.map(sub3 => ({
                        value: sub3.id,
                        label: sub3.name,
                        sub_categories_4: sub3.sub_categories_4 || [],
                    })) || [],

                    // sub_categories_3: sub.sub_categories_3 || [],
                })) || [],

                sub_categories_2: cat.sub_categories_2?.map(sub => ({
                    ...sub,
                    items: sub.estimation_item?.name || "",
                    location: sub.estimation_item?.location || "",
                    qty: sub.estimation_item?.qty || "",
                    uom: sub.estimation_item?.unit_of_measure_id || "",
                    unit_of_measure_id: sub.estimation_item?.unit_of_measure_id || "",
                    material_type_details: sub.item_details?.map(item => ({
                        ...item,
                        materialType: item.materialTypeId || item.materilTypeId || "",
                        materialTypeLabel: item.name || "",
                        specification: item.specificationId || "",
                        specificationLabel: item.specification || "",
                        labourType: item.labourAct || "",
                        labourTypeLabel: item.labourActLabel || "",
                        compositeValue: item.compositeValue || "",
                        rate: item.rate || "",
                        type: item.type || "material",
                        qty: item.excl_wastage_qty || "",
                        wastage: item.wastage || "",
                        uom: item.unit_of_measure_id || "",
                        amount: item.amount || "",
                        factor: item.factor || "",
                        qtyInclWastage: item.incl_wastage_qty || "",
                        costPerUnit: item.cost_per_unit || ""
                    })) || [],
                    selectedSubCategoryLevel3: sub.sub_categories_3?.find(
                        sub3 => sub3.id === sub.selectedSubCategoryLevel3?.value
                    ) || null,
                    // subCategoryLevel3Options: sub.sub_categories_3?.map(sub3 => ({
                    //     value: sub3.id,
                    //     label: sub3.name,
                    //     sub_categories_4: sub3.sub_categories_4 || [],
                    // })) || [],
                    sub_categories_3: sub.sub_categories_3?.map(sub3 => ({
                        ...sub3,
                        items: sub3.estimation_item?.name || "",
                        location: sub3.estimation_item?.location || "",
                        qty: sub3.estimation_item?.qty || "",
                        uom: sub3.estimation_item?.unit_of_measure_id || "",
                        unit_of_measure_id: sub3.estimation_item?.unit_of_measure_id || "",
                        material_type_details: sub3.item_details?.map(item => ({
                            ...item,
                            materialType: item.materialTypeId || item.materilTypeId || "",
                            materialTypeLabel: item.name || "",
                            specification: item.specificationId || "",
                            specificationLabel: item.specification || "",
                            labourType: item.labourAct || "",
                            labourTypeLabel: item.labourActLabel || "",
                            compositeValue: item.compositeValue || "",
                            rate: item.rate || "",
                            type: item.type || "material",
                            qty: item.excl_wastage_qty || "",
                            wastage: item.wastage || "",
                            uom: item.unit_of_measure_id || "",
                            amount: item.amount || "",
                            factor: item.factor || "",
                            qtyInclWastage: item.incl_wastage_qty || "",
                            costPerUnit: item.cost_per_unit || ""
                        })) || [],
                        selectedSubCategoryLevel4: sub3.sub_categories_4?.find(
                            sub4 => sub4.id === sub3.selectedSubCategoryLevel4?.value
                        ) || null,
                        subCategoryLevel4Options: sub3.sub_categories_4?.map(sub4 => ({
                            value: sub4.id,
                            label: sub4.name,
                            sub_categories_5: sub4.sub_categories_5 || [],
                        })) || [],
                        sub_categories_4: sub3.sub_categories_4?.map(sub4 => ({
                            ...sub4,
                            items: sub4.estimation_item?.name || "",
                            location: sub4.estimation_item?.location || "",
                            qty: sub4.estimation_item?.qty || "",
                            uom: sub4.estimation_item?.unit_of_measure_id || "",
                            unit_of_measure_id: sub4.estimation_item?.unit_of_measure_id || "",
                            material_type_details: sub4.item_details?.map(item => ({
                                ...item,
                                materialType: item.materialTypeId || item.materilTypeId || "",
                                materialTypeLabel: item.name || "",
                                specification: item.specificationId || "",
                                specificationLabel: item.specification || "",
                                labourType: item.labourAct || "",
                                labourTypeLabel: item.labourActLabel || "",
                                compositeValue: item.compositeValue || "",
                                rate: item.rate || "",
                                type: item.type || "material",
                                qty: item.excl_wastage_qty || "",
                                wastage: item.wastage || "",
                                uom: item.unit_of_measure_id || "",
                                amount: item.amount || "",
                                factor: item.factor || "",
                                qtyInclWastage: item.incl_wastage_qty || "",
                                costPerUnit: item.cost_per_unit || ""
                            })) || [],
                            selectedSubCategoryLevel5: sub4.sub_categories_5?.find(
                                sub5 => sub5.id === sub4.selectedSubCategoryLevel5?.value
                            ) || null,
                            subCategoryLevel5Options: sub4.sub_categories_5?.map(sub5 => ({
                                value: sub5.id,
                                label: sub5.name,
                            })) || [],
                            sub_categories_5: sub4.sub_categories_5?.map(sub5 => ({
                                ...sub5,
                                items: sub5.estimation_item?.name || "",
                                location: sub5.estimation_item?.location || "",
                                qty: sub5.estimation_item?.qty || "",
                                uom: sub5.estimation_item?.unit_of_measure_id || "",
                                unit_of_measure_id: sub5.estimation_item?.unit_of_measure_id || "",
                                material_type_details: sub5.item_details?.map(item => ({
                                    ...item,
                                    materialType: item.materialTypeId || item.materilTypeId || "",
                                    materialTypeLabel: item.name || "",
                                    specification: item.specificationId || "",
                                    specificationLabel: item.specification || "",
                                    labourType: item.labourAct || "",
                                    labourTypeLabel: item.labourActLabel || "",
                                    compositeValue: item.compositeValue || "",
                                    rate: item.rate || "",
                                    type: item.type || "material",
                                    qty: item.excl_wastage_qty || "",
                                    wastage: item.wastage || "",
                                    uom: item.unit_of_measure_id || "",
                                    amount: item.amount || "",
                                    factor: item.factor || "",
                                    qtyInclWastage: item.incl_wastage_qty || "",
                                    costPerUnit: item.cost_per_unit || ""
                                })) || [],
                            })) || [],
                        })) || [],
                    })) || [],
                })) || [],
            })),
        };
    }

    const fetchSubProjectDetails = async () => {
        try {
            const res = await axios.get(
                `${baseURL}estimation_details/11/budget_info.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            );
            console.log("response cat:", res.data);
            // setSubProjectDetails(res.data);
            setSubProjectDetails(mapApiToForm(res.data));
            setBudgetType(res.data?.budget_type || "");
            // setStatus(res.data?.selected_status || "");
        } catch (err) {
            console.error("Error fetching sub project details:", err);
        }
    };
    useEffect(() => {
        fetchSubProjectDetails();
    }, []);
    // console.log(" subProjectDetails", subProjectDetails);

    useEffect(() => {
        axios
            .get(
                `${baseURL}work_categories/work_sub_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,

            )
            .then((res) => {
                // console.log("responce cat:", res.data)
                // setSubProjectDetails(res.data); // store response
            })
            .catch((err) => {
                console.error("Error fetching sub project details:", err);
            });
    }, []); // runs once on mount







    // useEffect(() => {
    //     if (!subProjectDetails || !subProjectDetails.categories) return;

    //     // Only run if subCategoryOptions is not set yet
    //     const hasOptions = subProjectDetails.categories.every(cat => Array.isArray(cat.subCategoryOptions));
    //     if (hasOptions) return;

    //     setSubProjectDetails(prev => {
    //         if (!prev || !prev.categories) return prev;
    //         const updated = { ...prev };
    //         updated.categories = updated.categories.map(cat => ({
    //             ...cat,
    //             subCategoryOptions: (cat.sub_categories_2 || []).map(subCat => ({
    //                 value: subCat.id,
    //                 label: subCat.name,
    //                 sub_categories_3: subCat.sub_categories_3 || [],
    //             })),
    //         }));
    //         return updated;
    //     });
    // }, [subProjectDetails]);

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
                                                options={companyOptions}
                                                onChange={handleCompanyChange}
                                                value={selectedCompany}
                                                placeholder={`Select Company`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>

                                    {/* Project Dropdown */}
                                    <div className="col-md-3">
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
                                            <label>Wing</label>
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

                        <CollapsibleCard title={cardTitle}>
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
                                                value={details?.data.rera_area || "-"}
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
                                                value={details?.data.const_area || "-"}

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
                                                value={details?.data.saleable_area || "-"}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    {/* Version */}
                                    {/* <div className="col-md-4 mt-2">
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
                  </div> */}
                                    {/* No. of Flats */}
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>No. of Flat</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder="Nos"
                                                value={details?.data.number_of_saleable_unit || "-"}
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
                                                value={details?.data.number_of_floor || "-"}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Budget Type</label>
                                            <input
                                                disabled
                                                className="form-control"
                                                type="text"
                                                placeholder=""
                                                // value={details?.data.budget_type || "-"}
                                                // value={
                                                //     details?.data.budget_type === "non_wbs"
                                                //         ? "Non WBS"
                                                //         : details?.data.budget_type || "-"
                                                // }

                                                value={
                                                    details?.data.budget_type === "non_wbs"
                                                        ? "Non WBS"
                                                        : details?.data.budget_type === "wbs"
                                                            ? "WBS"
                                                            : details?.data.budget_type || "-"
                                                }
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
                                {/* <button
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
                                </button> */}
                            </div>
                        </div>


                        <pre>{JSON.stringify(subProjectDetails, null, 2)}</pre>

                        {/* ______________________________________________________________________________________________________ */}
                        {budgetType === "wbs" && (
                            <div className="mx-3 mb-5 mt-3">
                                {/* <button
                                    className="btn btn-primary mb-2"
                                    onClick={handleAddMainCategory}
                                >
                                    + Add Main Category
                                </button> */}

                                <div className="d-flex justify-content-end">
                                    <button
                                        className="purple-btn2 me-3 mb-3"
                                        onClick={handleAddMainCategory}
                                    >
                                        + Add Main Category
                                    </button>
                                </div>

                                <div className="mx-3 ">
                                    <div className="tbl-container mt-1 "
                                        style={{
                                            maxHeight: "500px",
                                        }}
                                    >
                                        <table
                                            // className=""
                                            className={subProjectDetails && subProjectDetails.categories && subProjectDetails.categories.length > 0 ? "" : "w-100"}
                                        >
                                            <thead style={{ zIndex: "111 " }}>
                                                <tr>
                                                    {/* <th className="text-start">Expand</th> */}
                                                    <th className="text-start">Sr No.</th>
                                                    <th className="text-start">Level</th>
                                                    <th className="text-start">Category</th>
                                                    <th className="text-start">Location</th>
                                                    <th className="text-start">Type</th>
                                                    <th className="text-start">Items</th>
                                                    <th className="text-start" style={{ width: "120px" }}>Factor</th>
                                                    <th className="text-start">UOM</th>
                                                    {/* <th className="text-start">Area</th> */}
                                                    <th className="text-start" style={{ width: "140px" }}>QTY Excl Wastage</th>
                                                    <th className="text-start" style={{ width: "120px" }}>Wastage</th>
                                                    <th className="text-start" style={{ width: "150px" }}>QTY incl Wastage</th>
                                                    <th className="text-start" style={{ width: "140px" }}>Rate</th>
                                                    <th className="text-start">Amount</th>
                                                    <th className="text-start" style={{ width: "150px" }}>Cost Per Unit</th>
                                                    <th className="text-start" style={{ width: "12px" }}>
                                                        Action
                                                    </th>
                                                </tr>
                                                <tr>
                                                    {/* <th className="text-start"></th> */}
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
                                                    <th className="text-start">
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Conditional rendering for categories under sub-project start */}

                                                {subProjectDetails && subProjectDetails.categories && subProjectDetails.categories.length > 0 ? (
                                                    subProjectDetails.categories.map((category, catIdx) => (
                                                        // {subProjectDetails &&
                                                        //     subProjectDetails.categories &&
                                                        //     subProjectDetails.categories.map((category, catIdx) => (
                                                        <React.Fragment key={category.id}>
                                                            <tr className="main-category">
                                                                {/* <td>
                                                                  

                                                                </td> */}
                                                                <td>{catIdx + 1}</td>
                                                                <td>

                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() => toggleCategory(category.id)}
                                                                        title={openCategoryId === category.id ? "Collapse" : "Expand"}
                                                                    >
                                                                        {openCategoryId === category.id ? (
                                                                            // Minus icon (collapse)
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        ) : (
                                                                            // Plus icon (expand)
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                    {/* Add Sub Category button, only when expanded */}
                                                                    {openCategoryId === category.id && (
                                                                        <button
                                                                            className="btn btn-link p-0 ms-2"
                                                                            onClick={() => handleAddSubCategory(catIdx)}
                                                                            title="Add Sub Category level 2"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        </button>
                                                                    )}




                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() => handleRemoveMainCategory(catIdx)}
                                                                        aria-label="Remove main category"
                                                                        title="Remove main category"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <line x1="5" y1="8" x2="11" y2="8" />
                                                                        </svg>
                                                                    </button>

                                                                    Main Category
                                                                </td>
                                                                <td>
                                                                    {/* {category.name} */}

                                                                    {/* <SingleSelector
                                                                    options={workCategories?.map((category) => ({
                                                                                            value: category.id,
                                                                                            label: category.name,
                                                                                            work_sub_categories: category.work_sub_categories, // Include subcategories in the category option
                                                                                          }))}
                                                                    // value={mainCategoryOptions.find(opt => opt.value === category.id)}
                                                                     value={selectedCategory}
                                                                    placeholder="Select Main Category"
                                                                    // onChange={selectedOption =>

                                                                    //     handleEditMainCategoryField2(catIdx, "id", selectedOption?.value || "")
                                                                    // }
                                                                     onChange={handleCategoryChange}
                                                                /> */}
                                                                    <SingleSelector
                                                                        options={workCategories.map(cat => ({
                                                                            value: cat.id,
                                                                            label: cat.name,
                                                                            sub_categories_2: cat.sub_categories_2
                                                                        }))}
                                                                        value={workCategories.find(opt => opt.id === category.id) ? { value: category.id, label: category.name } : null}
                                                                        onChange={selectedOption => handleMainCategorySelect(catIdx, selectedOption)}
                                                                        placeholder="Select Main Category"
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        value={category.location || ""}
                                                                        onChange={(e) =>
                                                                            handleEditMainCategoryField(catIdx, "location", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        value={category.items || ""}
                                                                        onChange={(e) =>
                                                                            handleEditMainCategoryField(catIdx, "items", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    <SingleSelector
                                                                        options={unitOfMeasures}
                                                                        value={
                                                                            unitOfMeasures.find(opt => opt.value === category.uom)
                                                                        }
                                                                        placeholder="Select UOM"
                                                                        onChange={selectedOption =>
                                                                            handleEditMainCategoryField(catIdx, "uom", selectedOption?.value || "")
                                                                        }
                                                                        isDisabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                {/* <td></td> */}
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        value={category.qty || ""}
                                                                        onChange={(e) =>
                                                                            handleEditMainCategoryField(catIdx, "qty", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td>
                                                                    {
                                                                        (
                                                                            // Sum direct material_type_details amounts for main category
                                                                            (category.material_type_details
                                                                                ? category.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                : 0
                                                                            )
                                                                            +
                                                                            // Sum all sub-category 2 material_type_details amounts for main category
                                                                            (category.sub_categories_2
                                                                                ? category.sub_categories_2.reduce(
                                                                                    (subSum2, subCat2) =>
                                                                                        subSum2 +
                                                                                        (
                                                                                            // Sum direct material_type_details for level 2
                                                                                            (subCat2.material_type_details
                                                                                                ? subCat2.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                : 0
                                                                                            )
                                                                                            +
                                                                                            // Sum all sub-category 3 material_type_details for level 2
                                                                                            (subCat2.sub_categories_3
                                                                                                ? subCat2.sub_categories_3.reduce(
                                                                                                    (subSum3, subCat3) =>
                                                                                                        subSum3 +
                                                                                                        (
                                                                                                            // Sum direct material_type_details for level 3
                                                                                                            (subCat3.material_type_details
                                                                                                                ? subCat3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                            (subCat4.material_type_details
                                                                                                                                ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                : 0
                                                                                                                            )
                                                                                                                            +
                                                                                                                            // Sum all sub-category 5 material_type_details for level 4
                                                                                                                            (subCat4.sub_categories_5
                                                                                                                                ? subCat4.sub_categories_5.reduce(
                                                                                                                                    (subSum5, subCat5) =>
                                                                                                                                        subSum5 +
                                                                                                                                        (subCat5.material_type_details
                                                                                                                                            ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                <td>
                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        // onClick={() => handleOpenAddModal(catIdx, 0)}
                                                                        // onClick={() => handleOpenAddModal(catIdx, null)}
                                                                        onClick={() => handleOpenAddModal(catIdx, null, category.id)}
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    >
                                                                        {/* {console.log("cat id:", catIdx, category.id)} */}
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

                                                                            {/* <!-- Minus Icon (Bottom) -->
                            <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                        </svg>



                                                                    </button>
                                                                </td>

                                                            </tr>


                                                            {openCategoryId === category.id &&
                                                                category.material_type_details &&
                                                                category.material_type_details.map((item, itemIdx) => (
                                                                    <tr key={item.id} className="labour">
                                                                        {/* <td></td> */}
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
                                                                            <input
                                                                                type="number"
                                                                                value={item.factor || ""}
                                                                                onChange={(e) =>
                                                                                    handleEditMaterial(catIdx, itemIdx, "factor", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <SingleSelector
                                                                                options={unitOfMeasures}
                                                                                value={
                                                                                    unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                }
                                                                                placeholder="Select UOM"
                                                                                onChange={selectedOption =>
                                                                                    handleEditMaterial(catIdx, itemIdx, "uom", selectedOption?.value || "")
                                                                                }
                                                                            />

                                                                            {/* <SingleSelector
                                                              options={unitOfMeasures} // Providing the options to the select component
                                                              onChange={handleUnitChange} // Setting the handler when an option is selected
                                                              value={selectedUnit} // Setting the selected value
                                                              placeholder={`Select UOM`} // Dynamic placeholder
                                                              
                                                            /> */}
                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        <td>


                                                                            <input
                                                                                type="number"
                                                                                value={item.qty || ""}
                                                                                readOnly
                                                                                disabled
                                                                                className="form-control"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.wastage || ""}
                                                                                onChange={(e) =>
                                                                                    handleEditMaterial(catIdx, itemIdx, "wastage", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.qtyInclWastage || ""}
                                                                                readOnly
                                                                                className="form-control"
                                                                                disabled
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                // value={item.rate || ""}
                                                                                value={item.rate === 0 ? 0 : item.rate || ""}
                                                                                onChange={(e) =>
                                                                                    handleEditMaterial(catIdx, itemIdx, "rate", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                                disabled={item.type === "material"} // ✅ Disable if Material
                                                                            />
                                                                        </td>
                                                                        {console.log("rate:", item.rate)}
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.amount || "0"}
                                                                                readOnly
                                                                                disabled
                                                                                className="form-control"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.costPerUnit || "0"}
                                                                                readOnly
                                                                                disabled
                                                                                className="form-control"
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-link p-0"
                                                                                onClick={() => handleRemoveMainCategoryRow(catIdx, itemIdx)}
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

                                                                                    {/* <!-- Minus Icon (Bottom) --> */}
                                                                                    <line x1="8" y1="34" x2="16" y2="34" />
                                                                                </svg>

                                                                            </button>
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
                                                                            {/* <td>
                                                                               
                                                                            </td> */}

                                                                            <td></td>
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => toggleSubCategory2(subCategory.id)}
                                                                                    title={openSubCategory2Id === subCategory.id ? "Collapse" : "Expand"}
                                                                                >
                                                                                    {openSubCategory2Id ===
                                                                                        subCategory.id ? (
                                                                                        // Minus icon (collapse)
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                        </svg>
                                                                                    ) : (
                                                                                        // Plus icon (expand)
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                        </svg>
                                                                                    )}
                                                                                </button>
                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                {openSubCategory2Id ===
                                                                                    subCategory.id && (
                                                                                        <button
                                                                                            className="btn btn-link p-0 ms-2"
                                                                                            onClick={() => handleAddSubCategory3(catIdx, subCatIdx)}
                                                                                            title="Add Sub Category level 3"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    )}




                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => handleRemoveSubCategory2(catIdx, subCatIdx)}
                                                                                    aria-label="Remove sub-category 2"
                                                                                    title="Remove Sub Category level 2"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                    </svg>
                                                                                </button>
                                                                                Sub-Category Level 2</td>
                                                                            <td>
                                                                                {/* <SingleSelector
                                                                                options={subCategoryOptions}
                                                                                value={subCategoryOptions.find(opt => opt.value === selectedSubCategory?.value)}
                                                                                placeholder="Select Sub Category"
                                                                                onChange={selectedOption => setSelectedSubCategory(selectedOption)}
                                                                            /> */}
                                                                                {/* <SingleSelector
                                                                                                      options={subCategoryOptions}
                                                                                                      onChange={handleSubCategoryChange}
                                                                                                      value={selectedSubCategory}
                                                                                                      placeholder={`Select Sub-category lvl 2`} // Dynamic placeholder
                                                                                                    /> */}


                                                                                {/* <SingleSelector
  options={category.subCategoryOptions || []}
  value={category.selectedSubCategory}
  onChange={selectedOption => handleSubCategorySelect(catIdx, selectedOption)}
  placeholder="Select Sub-category lvl 2"
/> */}

                                                                                {/* <SingleSelector
  options={category.subCategoryOptions || []}
  value={subCategory.selectedSubCategory}
  onChange={selectedOption => handleSubCategorySelect(catIdx, subCatIdx, selectedOption)}
  placeholder="Select Sub-category lvl 2"
/> */}

                                                                                <SingleSelector
                                                                                    options={
                                                                                        (category.subCategoryOptions || []).map(subCat => ({
                                                                                            value: subCat.value,
                                                                                            label: subCat.label,
                                                                                            sub_categories_3: subCat.sub_categories_3 // pass for next level
                                                                                        }))
                                                                                    }
                                                                                    value={
                                                                                        subCategory.id
                                                                                            ? { value: subCategory.id, label: subCategory.name }
                                                                                            : null
                                                                                    }
                                                                                    onChange={selectedOption => handleSubCategorySelect(catIdx, subCatIdx, selectedOption)}
                                                                                    placeholder="Select Sub-category lvl 2"
                                                                                />
                                                                                {/* {console.log("sub options:", category.subCategoryOptions)} */}

                                                                            </td>
                                                                            <td>

                                                                                <input
                                                                                    type="text"
                                                                                    value={subCategory.location || ""}
                                                                                    onChange={(e) => handleEditSubCategory2Field(catIdx, subCatIdx, "location", e.target.value)}
                                                                                    className="form-control"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />

                                                                            </td>

                                                                            <td>

                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    value={subCategory.items || ""}
                                                                                    onChange={(e) => handleEditSubCategory2Field(catIdx, subCatIdx, "items", e.target.value)}
                                                                                    className="form-control"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />
                                                                            </td>
                                                                            <td></td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={unitOfMeasures}
                                                                                    value={
                                                                                        unitOfMeasures.find(opt => opt.value === subCategory.uom)
                                                                                    }
                                                                                    placeholder="Select UOM"
                                                                                    onChange={selectedOption =>
                                                                                        handleEditSubCategory2Field(catIdx, subCatIdx, "uom", selectedOption?.value || "")
                                                                                    }
                                                                                    isDisabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="number"
                                                                                    value={subCategory.qty || ""}
                                                                                    onChange={(e) =>
                                                                                        handleEditSubCategory2Field(catIdx, subCatIdx, "qty", e.target.value)
                                                                                    }
                                                                                    className="form-control"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />
                                                                            </td>
                                                                            <td>

                                                                            </td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td>
                                                                                {
                                                                                    (
                                                                                        // Sum direct material_type_details amounts for level 2
                                                                                        (subCategory.material_type_details
                                                                                            ? subCategory.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                        (subCat3.material_type_details
                                                                                                            ? subCat3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.material_type_details
                                                                                                                            ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory.id)}
                                                                                    aria-label="Add row to sub-category 2"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                    </svg>
                                                                                </button>

                                                                            </td>

                                                                        </tr>

                                                                        {/* Render material_type_details rows for sub-category 2 */}
                                                                        {openSubCategory2Id === subCategory.id &&
                                                                            subCategory.material_type_details &&
                                                                            subCategory.material_type_details.map((item, itemIdx) => (
                                                                                <tr key={item.id} className="labour">
                                                                                    {/* <td></td> */}
                                                                                    <td>
                                                                                        {/* {catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1} */}
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>{item.type}</td>
                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                    {/* ...other cells... */}

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.factor || ""}
                                                                                            onChange={(e) =>
                                                                                                handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "factor", e.target.value)
                                                                                            }
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <SingleSelector
                                                                                            options={unitOfMeasures}
                                                                                            value={
                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                            }
                                                                                            placeholder="Select UOM"
                                                                                            onChange={selectedOption =>
                                                                                                handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "uom", selectedOption?.value || "")
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.qty || ""}
                                                                                            readOnly
                                                                                            disabled
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.wastage || ""}
                                                                                            onChange={(e) =>
                                                                                                handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "wastage", e.target.value)
                                                                                            }
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.qtyInclWastage || ""}
                                                                                            readOnly
                                                                                            className="form-control"
                                                                                            disabled
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.rate === 0 ? 0 : item.rate || ""}
                                                                                            // value={item.rate || 0}
                                                                                            onChange={(e) =>
                                                                                                handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "rate", e.target.value)
                                                                                            }
                                                                                            className="form-control"
                                                                                            disabled={item.type === "material"}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.amount || "0"}
                                                                                            readOnly
                                                                                            disabled
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.costPerUnit || "0"}
                                                                                            readOnly
                                                                                            disabled
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            className="btn btn-link p-0"
                                                                                            onClick={() => handleRemoveSubCategory2Row(catIdx, subCatIdx, itemIdx)}
                                                                                            aria-label="Remove row from sub-category 2"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                            </svg>
                                                                                        </button>
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
                                                                                            {/* <td>
                                                                                            </td> */}
                                                                                            <td></td>
                                                                                            <td>
                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => toggleSubCategory3(subCategory3.id)}
                                                                                                    title={openSubCategory3Id === subCategory3.id ? "Collapse" : "Expand"}
                                                                                                >
                                                                                                    {openSubCategory3Id ===
                                                                                                        subCategory3.id ? (
                                                                                                        // Minus icon (collapse)
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                        </svg>
                                                                                                    ) : (
                                                                                                        // Plus icon (expand)
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                        </svg>
                                                                                                    )}
                                                                                                </button>
                                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                                {openSubCategory3Id ===
                                                                                                    subCategory3.id && (
                                                                                                        <button
                                                                                                            className="btn btn-link p-0 ms-2"
                                                                                                            onClick={() => handleAddSubCategory4(catIdx, subCatIdx, subCategory3Idx)}
                                                                                                            title="Add Sub Category level 4"
                                                                                                        >
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    )}

                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => handleRemoveSubCategory3(catIdx, subCatIdx, subCategory3Idx)}
                                                                                                    aria-label="Remove sub-category 3"
                                                                                                    title=" Remove Sub Category level 3"
                                                                                                >
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                                Sub-Category Level 3</td>
                                                                                            <td>
                                                                                                {/* <SingleSelector
                                                                                                                      options={subCategoryLevel3Options}
                                                                                                                      onChange={handleLevel3Change}
                                                                                                                      value={selectedSubCategoryLevel3}
                                                                                                                      placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                                                                                                                    /> */}

                                                                                                <SingleSelector
                                                                                                    options={
                                                                                                        (subCategory.subCategoryLevel3Options || []).map(subCat3 => ({
                                                                                                            value: subCat3.value,
                                                                                                            label: subCat3.label,
                                                                                                            sub_categories_4: subCat3.sub_categories_4 // pass for next level
                                                                                                        }))
                                                                                                    }
                                                                                                    value={
                                                                                                        subCategory3.id
                                                                                                            ? { value: subCategory3.id, label: subCategory3.name }
                                                                                                            : null
                                                                                                    }
                                                                                                    onChange={selectedOption => handleLevel3Change(catIdx, subCatIdx, subCategory3Idx, selectedOption)}
                                                                                                    placeholder="Select Sub-category lvl 3"
                                                                                                />
                                                                                                {console.log("sub level 3 options:", subCategory.subCategoryLevel3Options)}
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={subCategory3.location || ""}
                                                                                                    onChange={(e) => handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "location", e.target.value)}
                                                                                                    className="form-control"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={subCategory3.items || ""}
                                                                                                    onChange={(e) => handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "items", e.target.value)}
                                                                                                    className="form-control"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>
                                                                                            <td>
                                                                                                <SingleSelector
                                                                                                    options={unitOfMeasures}
                                                                                                    value={
                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory3.uom)
                                                                                                    }
                                                                                                    placeholder="Select UOM"
                                                                                                    onChange={selectedOption =>
                                                                                                        handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "uom", selectedOption?.value || "")
                                                                                                    }
                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="number"
                                                                                                    value={subCategory3.qty || ""}
                                                                                                    onChange={(e) =>
                                                                                                        handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "qty", e.target.value)
                                                                                                    }
                                                                                                    className="form-control"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td></td>
                                                                                            <td>
                                                                                                {
                                                                                                    (
                                                                                                        // Sum direct material_type_details amounts for level 3
                                                                                                        (subCategory3.material_type_details
                                                                                                            ? subCategory3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.material_type_details
                                                                                                                            ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                            <td>


                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx)}
                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3, subCategory3.name, subCatIdx)}
                                                                                                    aria-label="Add row to sub-category 3"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                >
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                    </svg>
                                                                                                </button>

                                                                                            </td>


                                                                                        </tr>

                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                        {openSubCategory3Id === subCategory3.id &&
                                                                                            subCategory3.material_type_details &&
                                                                                            subCategory3.material_type_details.map((item, itemIdx) => (
                                                                                                <tr key={item.id} className="labour">
                                                                                                    {/* <td></td> */}
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td>{item.location}</td>
                                                                                                    <td>{item.type}</td>
                                                                                                    <td>
                                                                                                        {/* {item.specification} */}
                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}

                                                                                                    </td>
                                                                                                    {/* ...other cells... */}

                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.factor || ""}
                                                                                                            onChange={(e) =>
                                                                                                                handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "factor", e.target.value)
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>

                                                                                                        <SingleSelector
                                                                                                            options={unitOfMeasures}
                                                                                                            value={
                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                            }
                                                                                                            placeholder="Select UOM"
                                                                                                            onChange={selectedOption =>
                                                                                                                handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                            }
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.qty || ""}
                                                                                                            readOnly
                                                                                                            disabled
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.wastage || ""}
                                                                                                            onChange={(e) =>
                                                                                                                handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "wastage", e.target.value)
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.qtyInclWastage || ""}
                                                                                                            readOnly
                                                                                                            className="form-control"
                                                                                                            disabled
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.rate === 0 ? 0 : item.rate || ""}
                                                                                                            // value={item.rate || 0}
                                                                                                            onChange={(e) =>
                                                                                                                handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "rate", e.target.value)
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                            disabled={item.type === "material"}
                                                                                                        />
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.amount || "0"}
                                                                                                            readOnly
                                                                                                            disabled
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.costPerUnit || "0"}
                                                                                                            readOnly
                                                                                                            disabled
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-link p-0"
                                                                                                            onClick={() => handleRemoveSubCategory3Row(catIdx, subCatIdx, subCategory3Idx, itemIdx)}
                                                                                                            aria-label="Remove row from sub-category 3"
                                                                                                        >
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                            </svg>
                                                                                                        </button>
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

                                                                                                            {/* <td>
                                                                                                            </td> */}
                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => toggleSubCategory4(subCategory4.id)}
                                                                                                                    title={openSubCategory4Id === subCategory4.id ? "Collapse" : "Expand"}
                                                                                                                >
                                                                                                                    {openSubCategory4Id ===
                                                                                                                        subCategory4.id ? (
                                                                                                                        // Minus icon (collapse)
                                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                        </svg>
                                                                                                                    ) : (
                                                                                                                        // Plus icon (expand)
                                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                        </svg>
                                                                                                                    )}
                                                                                                                </button>
                                                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                                                {openSubCategory4Id ===
                                                                                                                    subCategory4.id && (
                                                                                                                        <button
                                                                                                                            className="btn btn-link p-0 ms-2"
                                                                                                                            onClick={() => handleAddSubCategory5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx)}
                                                                                                                            title="Add Sub Category level 5"
                                                                                                                        >
                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                            </svg>
                                                                                                                        </button>
                                                                                                                    )}

                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => handleRemoveSubCategory4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx)}
                                                                                                                    aria-label="Remove sub-category 4"
                                                                                                                    title="Remove Sub Category level 4"
                                                                                                                >
                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                    </svg>
                                                                                                                </button>
                                                                                                                Sub-Category Level 4
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {/* <SingleSelector
                                                                                                                                      options={subCategoryLevel4Options}
                                                                                                                                      onChange={handleLevel4Change}
                                                                                                                                      value={selectedSubCategoryLevel4}
                                                                                                                                      placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                                                                                                                                    /> */}

                                                                                                                <SingleSelector
                                                                                                                    options={
                                                                                                                        (subCategory3.subCategoryLevel4Options || []).map(subCat4 => ({
                                                                                                                            value: subCat4.value,
                                                                                                                            label: subCat4.label,
                                                                                                                            sub_categories_5: subCat4.sub_categories_5 // pass for next level
                                                                                                                        }))
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        subCategory4.id
                                                                                                                            ? { value: subCategory4.id, label: subCategory4.name }
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    onChange={selectedOption => handleLevel4Change(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, selectedOption)}
                                                                                                                    placeholder="Select Sub-category lvl 4"
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    value={subCategory4.location || ""}
                                                                                                                    onChange={(e) => handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "location", e.target.value)}
                                                                                                                    className="form-control"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    value={subCategory4.items || ""}
                                                                                                                    onChange={(e) => handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "items", e.target.value)}
                                                                                                                    className="form-control"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <SingleSelector
                                                                                                                    options={unitOfMeasures}
                                                                                                                    value={
                                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory4.uom)
                                                                                                                    }
                                                                                                                    placeholder="Select UOM"
                                                                                                                    onChange={selectedOption =>
                                                                                                                        handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "uom", selectedOption?.value || "")
                                                                                                                    }
                                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <input
                                                                                                                    type="number"
                                                                                                                    value={subCategory4.qty || ""}
                                                                                                                    onChange={(e) =>
                                                                                                                        handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "qty", e.target.value)
                                                                                                                    }
                                                                                                                    className="form-control"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    (
                                                                                                                        // Sum direct material_type_details amounts for level 4
                                                                                                                        (subCategory4.material_type_details
                                                                                                                            ? subCategory4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                        (subCategory4.sub_categories_5
                                                                                                                            ? subCategory4.sub_categories_5.reduce(
                                                                                                                                (subSum, subCat5) =>
                                                                                                                                    subSum +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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

                                                                                                            <td>
                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx)}
                                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx,subCategory3Idx, subCategory4Idx, subCategory4.id)}
                                                                                                                    aria-label="Add row to sub-category 2"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                >
                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                                    </svg>
                                                                                                                </button>
                                                                                                            </td>

                                                                                                        </tr>


                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                        {openSubCategory4Id === subCategory4.id &&
                                                                                                            subCategory4.material_type_details &&
                                                                                                            subCategory4.material_type_details.map((item, itemIdx) => (
                                                                                                                <tr key={item.id} className="labour">
                                                                                                                    {/* <td></td> */}
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item.location}</td>
                                                                                                                    <td>{item.type}</td>
                                                                                                                    <td>
                                                                                                                        {/* {item.specification} */}
                                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}
                                                                                                                    </td>
                                                                                                                    {/* ...other cells... */}
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.factor || ""}
                                                                                                                            onChange={(e) =>
                                                                                                                                handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "factor", e.target.value)
                                                                                                                            }
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <SingleSelector
                                                                                                                            options={unitOfMeasures}
                                                                                                                            value={
                                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                                            }
                                                                                                                            placeholder="Select UOM"
                                                                                                                            onChange={selectedOption =>
                                                                                                                                handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.qty || ""}
                                                                                                                            readOnly
                                                                                                                            disabled
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.wastage || ""}
                                                                                                                            onChange={(e) =>
                                                                                                                                handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "wastage", e.target.value)
                                                                                                                            }
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.qtyInclWastage || ""}
                                                                                                                            readOnly
                                                                                                                            className="form-control"
                                                                                                                            disabled
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.rate === 0 ? 0 : item.rate || "0"}
                                                                                                                            onChange={(e) =>
                                                                                                                                handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "rate", e.target.value)
                                                                                                                            }
                                                                                                                            className="form-control"
                                                                                                                            disabled={item.type === "material"}
                                                                                                                        />
                                                                                                                    </td>

                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.amount || "0"}
                                                                                                                            readOnly
                                                                                                                            disabled
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.costPerUnit || "0"}
                                                                                                                            readOnly
                                                                                                                            disabled
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>

                                                                                                                    <td>
                                                                                                                        <button
                                                                                                                            className="btn btn-link p-0"
                                                                                                                            onClick={() => handleRemoveSubCategory4Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx)}
                                                                                                                            aria-label="Remove row from sub-category 4"
                                                                                                                        >
                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                            </svg>
                                                                                                                        </button>
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

                                                                                                                            {/* <td>
                                                                                                                               
                                                                                                                            </td> */}
                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                <button
                                                                                                                                    className="btn btn-link p-0"
                                                                                                                                    onClick={() =>
                                                                                                                                        toggleSubCategory5(
                                                                                                                                            subCategory5.id
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    aria-label="Toggle sub-category 3 visibility"
                                                                                                                                    title={openSubCategory5Id === subCategory5.id ? "Collapse" : "Expand"}
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
                                                                                                                                <button
                                                                                                                                    className="btn btn-link p-0"
                                                                                                                                    onClick={() => handleRemoveSubCategory5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                                                                                    aria-label="Remove Sub Category level 5"
                                                                                                                                    title="Remove Sub Category level 5"
                                                                                                                                >
                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                                    </svg>
                                                                                                                                </button>
                                                                                                                                Sub-Category Level 5
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {/* <SingleSelector
                                                                                                                                                  options={subCategoryLevel5Options}
                                                                                                                                                  onChange={handleLevel5Change}
                                                                                                                                                  value={selectedSubCategoryLevel5}
                                                                                                                                                  placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                                                                                                                                                /> */}

                                                                                                                                <SingleSelector
                                                                                                                                    options={
                                                                                                                                        (subCategory4.subCategoryLevel5Options || []).map(subCat5 => ({
                                                                                                                                            value: subCat5.value,
                                                                                                                                            label: subCat5.label
                                                                                                                                        }))
                                                                                                                                    }
                                                                                                                                    value={
                                                                                                                                        subCategory5.id
                                                                                                                                            ? { value: subCategory5.id, label: subCategory5.name }
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    onChange={selectedOption =>
                                                                                                                                        handleLevel5Change(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, selectedOption)
                                                                                                                                    }
                                                                                                                                    placeholder="Select Sub-category lvl 5"
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <input
                                                                                                                                    type="text"
                                                                                                                                    value={subCategory5.location || ""}
                                                                                                                                    onChange={(e) => handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "location", e.target.value)}
                                                                                                                                    className="form-control"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <input
                                                                                                                                    type="text"
                                                                                                                                    value={subCategory5.items || ""}
                                                                                                                                    onChange={(e) => handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "items", e.target.value)}
                                                                                                                                    className="form-control"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <SingleSelector
                                                                                                                                    options={unitOfMeasures}
                                                                                                                                    value={
                                                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory5.uom)
                                                                                                                                    }
                                                                                                                                    placeholder="Select UOM"
                                                                                                                                    onChange={selectedOption =>
                                                                                                                                        handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "uom", selectedOption?.value || "")
                                                                                                                                    }
                                                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <input
                                                                                                                                    type="number"
                                                                                                                                    value={subCategory5.qty || ""}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "qty", e.target.value)
                                                                                                                                    }
                                                                                                                                    className="form-control"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td></td>
                                                                                                                            <td></td>
                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                {
                                                                                                                                    subCategory5.material_type_details
                                                                                                                                        ? subCategory5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                }
                                                                                                                            </td>
                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                <button
                                                                                                                                    className="btn btn-link p-0"
                                                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5.id,subCategory5Idx)}
                                                                                                                                    aria-label="Add row to sub-category 2"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                >
                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                                                    </svg>
                                                                                                                                </button>

                                                                                                                            </td>

                                                                                                                        </tr>


                                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                                        {openSubCategory5Id === subCategory5.id &&
                                                                                                                            subCategory5.material_type_details &&
                                                                                                                            subCategory5.material_type_details.map((item, itemIdx) => (
                                                                                                                                <tr key={item.id} className="labour">
                                                                                                                                    {/* <td></td> */}
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td>{item.location}</td>
                                                                                                                                    <td>{item.type}</td>
                                                                                                                                    <td>
                                                                                                                                        {/* {item.specification || item.labourActLabel} */}
                                                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}
                                                                                                                                    </td>
                                                                                                                                    {/* ...other cells... */}
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.factor || ""}
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx, "factor", e.target.value)
                                                                                                                                            }
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>

                                                                                                                                        <SingleSelector
                                                                                                                                            options={unitOfMeasures}
                                                                                                                                            value={
                                                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                                                            }
                                                                                                                                            placeholder="Select UOM"
                                                                                                                                            onChange={selectedOption =>
                                                                                                                                                handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory4Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.qty || ""}
                                                                                                                                            readOnly
                                                                                                                                            disabled
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.wastage || ""}
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx, "wastage", e.target.value)
                                                                                                                                            }
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.qtyInclWastage || ""}
                                                                                                                                            readOnly
                                                                                                                                            className="form-control"
                                                                                                                                            disabled
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            // value={item.rate || 0}
                                                                                                                                            value={item.rate === 0 ? 0 : item.rate || ""}
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx, "rate", e.target.value)
                                                                                                                                            }
                                                                                                                                            className="form-control"
                                                                                                                                            disabled={item.type === "material"}
                                                                                                                                        />
                                                                                                                                    </td>

                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.amount || "0"}
                                                                                                                                            readOnly
                                                                                                                                            disabled
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.costPerUnit || "0"}
                                                                                                                                            readOnly
                                                                                                                                            disabled
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <button
                                                                                                                                            className="btn btn-link p-0"
                                                                                                                                            onClick={() => handleRemoveSubCategory5Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx)}
                                                                                                                                            aria-label="Remove row from sub-category 5"
                                                                                                                                        >
                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                                            </svg>
                                                                                                                                        </button>
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
                                                        // ))}

                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={16} className="text-center ">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ************************************************************************************* */}

                        {budgetType === "non_wbs" && (
                            <div className="mx-3 mb-5 mt-3">
                                {/* <button
                                    className="btn btn-primary mb-2"
                                    onClick={handleAddMainCategory}
                                >
                                    + Add Main Category
                                </button> */}

                                <div className="d-flex justify-content-end">
                                    <button
                                        className="purple-btn2 me-3 mb-3"
                                        onClick={handleAddMainCategory}
                                    >
                                        + Add Main Category
                                    </button>
                                </div>

                                <div className="mx-3 ">
                                    <div className="tbl-container mt-1"
                                        style={{
                                            maxHeight: "400px",
                                        }}
                                    >
                                        <table
                                            // className="w-100"
                                            className={subProjectDetails && subProjectDetails.categories && subProjectDetails.categories.length > 0 ? "" : "w-100"}
                                        >
                                            <thead style={{ zIndex: "111 " }}>
                                                <tr>
                                                    {/* <th className="text-start">Expand</th> */}
                                                    <th className="text-start">Sr No.</th>
                                                    <th className="text-start">Level</th>
                                                    <th className="text-start">Category</th>
                                                    <th className="text-start">Location</th>
                                                    <th className="text-start">Type</th>
                                                    <th className="text-start">Items</th>
                                                    {/* <th className="text-start">Factor</th> */}
                                                    <th className="text-start">UOM</th>
                                                    {/* <th className="text-start">Area</th> */}
                                                    <th className="text-start" style={{ width: "120px" }}>QTY Excl Wastage</th>
                                                    {/* <th className="text-start">Wastage</th> */}
                                                    {/* <th className="text-start">QTY incl Waste</th> */}
                                                    <th className="text-start" style={{ width: "120px" }}>Rate</th>
                                                    <th className="text-start">Amount</th>
                                                    {/* <th className="text-start">Cost Per Unit</th> */}
                                                    <th className="text-start" style={{ width: "12px" }}>
                                                        Action
                                                    </th>
                                                </tr>
                                                <tr>
                                                    {/* <th className="text-start"></th> */}
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
                                                    <th className="text-start">
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Conditional rendering for categories under sub-project start */}
                                                {subProjectDetails && subProjectDetails.categories && subProjectDetails.categories.length > 0 ? (
                                                    subProjectDetails.categories.map((category, catIdx) => (
                                                        // {subProjectDetails &&
                                                        //     subProjectDetails.categories &&
                                                        // subProjectDetails.categories.map((category, catIdx) => (
                                                        <React.Fragment key={category.id}>
                                                            <tr className="main-category">
                                                                {/* <td>
                                                                
                                                                </td> */}
                                                                <td>{catIdx + 1}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() => toggleCategory(category.id)}
                                                                        title={openCategoryId === category.id ? "Collapse" : "Expand"}
                                                                    >
                                                                        {openCategoryId === category.id ? (
                                                                            // Minus icon (collapse)
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        ) : (
                                                                            // Plus icon (expand)
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                    {/* Add Sub Category button, only when expanded */}
                                                                    {openCategoryId === category.id && (
                                                                        <button
                                                                            className="btn btn-link p-0 ms-2"
                                                                            onClick={() => handleAddSubCategory(catIdx)}
                                                                            title="Add Sub Category Level 2"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                            </svg>
                                                                        </button>
                                                                    )}




                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() => handleRemoveMainCategory(catIdx)}
                                                                        aria-label="Remove main category"
                                                                        title="Remove main category"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <line x1="5" y1="8" x2="11" y2="8" />
                                                                        </svg>
                                                                    </button>
                                                                    Main Category</td>
                                                                <td>
                                                                    {/* {category.name} */}

                                                                    {/* <SingleSelector
                                                                    options={workCategories?.map((category) => ({
                                                                                            value: category.id,
                                                                                            label: category.name,
                                                                                            work_sub_categories: category.work_sub_categories, // Include subcategories in the category option
                                                                                          }))}
                                                                    // value={mainCategoryOptions.find(opt => opt.value === category.id)}
                                                                     value={selectedCategory}
                                                                    placeholder="Select Main Category"
                                                                    // onChange={selectedOption =>

                                                                    //     handleEditMainCategoryField2(catIdx, "id", selectedOption?.value || "")
                                                                    // }
                                                                     onChange={handleCategoryChange}
                                                                /> */}
                                                                    <SingleSelector
                                                                        options={workCategories.map(cat => ({
                                                                            value: cat.id,
                                                                            label: cat.name,
                                                                            sub_categories_2: cat.sub_categories_2
                                                                        }))}
                                                                        value={workCategories.find(opt => opt.id === category.id) ? { value: category.id, label: category.name } : null}
                                                                        onChange={selectedOption => handleMainCategorySelect(catIdx, selectedOption)}
                                                                        placeholder="Select Main Category"
                                                                    />

                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        value={category.location || ""}
                                                                        onChange={(e) =>
                                                                            handleEditMainCategoryField(catIdx, "location", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        value={category.items || ""}
                                                                        onChange={(e) =>
                                                                            handleEditMainCategoryField(catIdx, "items", e.target.value)
                                                                        }
                                                                        className="form-control"
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                {/* <td></td> */}
                                                                <td>
                                                                    <SingleSelector
                                                                        options={unitOfMeasures}
                                                                        value={
                                                                            unitOfMeasures.find(opt => opt.value === category.uom)
                                                                        }
                                                                        placeholder="Select UOM"
                                                                        onChange={selectedOption =>
                                                                            handleEditMainCategoryField(catIdx, "uom", selectedOption?.value || "")
                                                                        }
                                                                        isDisabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    />
                                                                </td>
                                                                {/* <td></td> */}
                                                                <td>
                                                                    {/* <input
                                                                    type="number"
                                                                    value={category.qty || ""}
                                                                    onChange={(e) =>
                                                                        handleEditMainCategoryField(catIdx, "qty", e.target.value)
                                                                    }
                                                                    className="form-control"
                                                                /> */}
                                                                </td>
                                                                <td></td>
                                                                {/* <td></td>
                                                            <td></td> */}
                                                                <td>
                                                                    {
                                                                        (
                                                                            // Sum direct material_type_details amounts for main category
                                                                            (category.material_type_details
                                                                                ? category.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                : 0
                                                                            )
                                                                            +
                                                                            // Sum all sub-category 2 material_type_details amounts for main category
                                                                            (category.sub_categories_2
                                                                                ? category.sub_categories_2.reduce(
                                                                                    (subSum2, subCat2) =>
                                                                                        subSum2 +
                                                                                        (
                                                                                            // Sum direct material_type_details for level 2
                                                                                            (subCat2.material_type_details
                                                                                                ? subCat2.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                : 0
                                                                                            )
                                                                                            +
                                                                                            // Sum all sub-category 3 material_type_details for level 2
                                                                                            (subCat2.sub_categories_3
                                                                                                ? subCat2.sub_categories_3.reduce(
                                                                                                    (subSum3, subCat3) =>
                                                                                                        subSum3 +
                                                                                                        (
                                                                                                            // Sum direct material_type_details for level 3
                                                                                                            (subCat3.material_type_details
                                                                                                                ? subCat3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                            (subCat4.material_type_details
                                                                                                                                ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                : 0
                                                                                                                            )
                                                                                                                            +
                                                                                                                            // Sum all sub-category 5 material_type_details for level 4
                                                                                                                            (subCat4.sub_categories_5
                                                                                                                                ? subCat4.sub_categories_5.reduce(
                                                                                                                                    (subSum5, subCat5) =>
                                                                                                                                        subSum5 +
                                                                                                                                        (subCat5.material_type_details
                                                                                                                                            ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                <td>
                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        // onClick={() => handleOpenAddModal(catIdx, 0)}
                                                                        // onClick={() => handleOpenAddModal(catIdx, null)}
                                                                        onClick={() => handleOpenAddModal(catIdx, null, category.id)}
                                                                        disabled={isOtherLevelFrozen(category, "main", { catIdx })}
                                                                    >
                                                                        {/* {console.log("cat id:", catIdx, category.id)} */}
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

                                                                            {/* <!-- Minus Icon (Bottom) -->
                            <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                        </svg>



                                                                    </button>
                                                                </td>

                                                            </tr>


                                                            {openCategoryId === category.id &&
                                                                category.material_type_details &&
                                                                category.material_type_details.map((item, itemIdx) => (
                                                                    <tr key={item.id} className="labour">
                                                                        {/* <td></td> */}
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
                                                                            <SingleSelector
                                                                                options={unitOfMeasures}
                                                                                value={
                                                                                    unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                }
                                                                                placeholder="Select UOM"
                                                                                onChange={selectedOption =>
                                                                                    handleEditMaterial2(catIdx, itemIdx, "uom", selectedOption?.value || "")
                                                                                }
                                                                            />

                                                                            {/* <SingleSelector
                                                              options={unitOfMeasures} // Providing the options to the select component
                                                              onChange={handleUnitChange} // Setting the handler when an option is selected
                                                              value={selectedUnit} // Setting the selected value
                                                              placeholder={`Select UOM`} // Dynamic placeholder
                                                              
                                                            /> */}
                                                                        </td>
                                                                        {/* <td></td> */}
                                                                        <td>



                                                                            <input
                                                                                type="number"
                                                                                value={item.qty || ""}
                                                                                onChange={e =>
                                                                                    handleEditMaterial2(catIdx, itemIdx, "qty", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            />
                                                                        </td>

                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.rate}
                                                                                onChange={(e) =>
                                                                                    handleEditMaterial2(catIdx, itemIdx, "rate", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            // disabled={item.type === "material"} // ✅ Disable if Material
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="number"
                                                                                value={item.amount || ""}
                                                                                readOnly
                                                                                disabled
                                                                                className="form-control"
                                                                            />
                                                                        </td>

                                                                        <td>
                                                                            <button
                                                                                className="btn btn-link p-0"
                                                                                onClick={() => handleRemoveMainCategoryRow(catIdx, itemIdx)}
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

                                                                                    {/* <!-- Minus Icon (Bottom) --> */}
                                                                                    <line x1="8" y1="34" x2="16" y2="34" />
                                                                                </svg>

                                                                            </button>
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
                                                                            {/* <td>
                                                                               
                                                                            </td> */}

                                                                            <td></td>
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => toggleSubCategory2(subCategory.id)}
                                                                                    title={openSubCategory2Id === subCategory.id ? "Collapse" : "Expand"}
                                                                                >
                                                                                    {openSubCategory2Id ===
                                                                                        subCategory.id ? (
                                                                                        // Minus icon (collapse)
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                        </svg>
                                                                                    ) : (
                                                                                        // Plus icon (expand)
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                        </svg>
                                                                                    )}
                                                                                </button>
                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                {openSubCategory2Id ===
                                                                                    subCategory.id && (
                                                                                        <button
                                                                                            className="btn btn-link p-0 ms-2"
                                                                                            onClick={() => handleAddSubCategory3(catIdx, subCatIdx)}
                                                                                            title="Add Sub Category level 3"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    )}




                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => handleRemoveSubCategory2(catIdx, subCatIdx)}
                                                                                    aria-label="Remove sub-category level 2"
                                                                                    title="Remove Sub Category level 2"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                    </svg>
                                                                                </button>
                                                                                Sub-Category Level 2</td>
                                                                            <td>
                                                                                {/* <SingleSelector
                                                                                options={subCategoryOptions}
                                                                                value={subCategoryOptions.find(opt => opt.value === selectedSubCategory?.value)}
                                                                                placeholder="Select Sub Category"
                                                                                onChange={selectedOption => setSelectedSubCategory(selectedOption)}
                                                                            /> */}
                                                                                {/* <SingleSelector
                                                                                                      options={subCategoryOptions}
                                                                                                      onChange={handleSubCategoryChange}
                                                                                                      value={selectedSubCategory}
                                                                                                      placeholder={`Select Sub-category lvl 2`} // Dynamic placeholder
                                                                                                    /> */}


                                                                                {/* <SingleSelector
  options={category.subCategoryOptions || []}
  value={category.selectedSubCategory}
  onChange={selectedOption => handleSubCategorySelect(catIdx, selectedOption)}
  placeholder="Select Sub-category lvl 2"
/> */}

                                                                                {/* <SingleSelector
  options={category.subCategoryOptions || []}
  value={subCategory.selectedSubCategory}
  onChange={selectedOption => handleSubCategorySelect(catIdx, subCatIdx, selectedOption)}
  placeholder="Select Sub-category lvl 2"
/> */}

                                                                                <SingleSelector
                                                                                    options={
                                                                                        (category.subCategoryOptions || []).map(subCat => ({
                                                                                            value: subCat.value,
                                                                                            label: subCat.label,
                                                                                            sub_categories_3: subCat.sub_categories_3 // pass for next level
                                                                                        }))
                                                                                    }
                                                                                    value={
                                                                                        subCategory.id
                                                                                            ? { value: subCategory.id, label: subCategory.name }
                                                                                            : null
                                                                                    }
                                                                                    onChange={selectedOption => handleSubCategorySelect(catIdx, subCatIdx, selectedOption)}
                                                                                    placeholder="Select Sub-category lvl 2"
                                                                                />
                                                                            </td>
                                                                            <td>

                                                                                <input
                                                                                    type="text"
                                                                                    value={subCategory.location || ""}
                                                                                    onChange={(e) => handleEditSubCategory2Field(catIdx, subCatIdx, "location", e.target.value)}
                                                                                    className="form-control"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />

                                                                            </td>

                                                                            <td>

                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    value={subCategory.items || ""}
                                                                                    onChange={(e) => handleEditSubCategory2Field(catIdx, subCatIdx, "items", e.target.value)}
                                                                                    className="form-control"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />
                                                                            </td>

                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={unitOfMeasures}
                                                                                    value={
                                                                                        unitOfMeasures.find(opt => opt.value === subCategory.uom)
                                                                                    }
                                                                                    placeholder="Select UOM"
                                                                                    onChange={selectedOption =>
                                                                                        handleEditSubCategory2Field(catIdx, subCatIdx, "uom", selectedOption?.value || "")
                                                                                    }
                                                                                    isDisabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                {/* <input
                                                                                type="number"
                                                                                value={subCategory.qty || ""}
                                                                                onChange={(e) =>
                                                                                    handleEditSubCategory2Field(catIdx, subCatIdx, "qty", e.target.value)
                                                                                }
                                                                                className="form-control"
                                                                            /> */}
                                                                            </td>
                                                                            <td>

                                                                            </td>

                                                                            <td>
                                                                                {
                                                                                    (
                                                                                        // Sum direct material_type_details amounts for level 2
                                                                                        (subCategory.material_type_details
                                                                                            ? subCategory.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                        (subCat3.material_type_details
                                                                                                            ? subCat3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.material_type_details
                                                                                                                            ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                <button
                                                                                    className="btn btn-link p-0"
                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory.id)}
                                                                                    aria-label="Add row to sub-category 2"
                                                                                    disabled={isOtherLevelFrozen(category, "sub2", { catIdx, subCatIdx })}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                    </svg>
                                                                                </button>

                                                                            </td>

                                                                        </tr>

                                                                        {/* Render material_type_details rows for sub-category 2 */}
                                                                        {openSubCategory2Id === subCategory.id &&
                                                                            subCategory.material_type_details &&
                                                                            subCategory.material_type_details.map((item, itemIdx) => (
                                                                                <tr key={item.id} className="labour">
                                                                                    {/* <td></td> */}
                                                                                    <td>
                                                                                        {/* {catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1} */}
                                                                                    </td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>{item.type}</td>
                                                                                    <td>{item.material_type} {item.generic_info || item.labour_activity || item.composite_name}</td>
                                                                                    {/* ...other cells... */}


                                                                                    <td>
                                                                                        <SingleSelector
                                                                                            options={unitOfMeasures}
                                                                                            value={
                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                            }
                                                                                            placeholder="Select UOM"
                                                                                            onChange={selectedOption =>
                                                                                                handleEditMaterial2SubCat2(catIdx, subCatIdx, itemIdx, "uom", selectedOption?.value || "")
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        {/* <input
                                                                                        type="number"
                                                                                        value={item.qty || ""}
                                                                                        readOnly
                                                                                        disabled
                                                                                        className="form-control"
                                                                                    /> */}
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.qty || ""}
                                                                                            onChange={e =>
                                                                                                handleEditMaterial2SubCat2(catIdx, subCatIdx, itemIdx, "qty", e.target.value)
                                                                                            }
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.rate}
                                                                                            onChange={(e) =>
                                                                                                handleEditMaterial2SubCat2(catIdx, subCatIdx, itemIdx, "rate", e.target.value)
                                                                                            }
                                                                                            className="form-control"
                                                                                        // disabled={item.type === "material"}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.amount || ""}
                                                                                            readOnly
                                                                                            disabled
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <button
                                                                                            className="btn btn-link p-0"
                                                                                            onClick={() => handleRemoveSubCategory2Row(catIdx, subCatIdx, itemIdx)}
                                                                                            aria-label="Remove row from sub-category 2"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                            </svg>
                                                                                        </button>
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
                                                                                            {/* <td>
                                                                                            </td> */}
                                                                                            <td></td>
                                                                                            <td>
                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => toggleSubCategory3(subCategory3.id)}
                                                                                                    title={openSubCategory3Id === subCategory3.id ? "Collapse" : "Expand"}
                                                                                                >
                                                                                                    {openSubCategory3Id ===
                                                                                                        subCategory3.id ? (
                                                                                                        // Minus icon (collapse)
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                        </svg>
                                                                                                    ) : (
                                                                                                        // Plus icon (expand)
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                        </svg>
                                                                                                    )}
                                                                                                </button>
                                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                                {openSubCategory3Id ===
                                                                                                    subCategory3.id && (
                                                                                                        <button
                                                                                                            className="btn btn-link p-0 ms-2"
                                                                                                            onClick={() => handleAddSubCategory4(catIdx, subCatIdx, subCategory3Idx)}
                                                                                                            title="Add Sub Category level 4"
                                                                                                        >
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    )}

                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => handleRemoveSubCategory3(catIdx, subCatIdx, subCategory3Idx)}
                                                                                                    aria-label="Remove sub-category 3"
                                                                                                    title="Remove Sub Category level 3"
                                                                                                >
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                                Sub-Category Level 3</td>
                                                                                            <td>
                                                                                                {/* <SingleSelector
                                                                                                                      options={subCategoryLevel3Options}
                                                                                                                      onChange={handleLevel3Change}
                                                                                                                      value={selectedSubCategoryLevel3}
                                                                                                                      placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                                                                                                                    /> */}

                                                                                                <SingleSelector
                                                                                                    options={
                                                                                                        (subCategory.subCategoryLevel3Options || []).map(subCat3 => ({
                                                                                                            value: subCat3.value,
                                                                                                            label: subCat3.label,
                                                                                                            sub_categories_4: subCat3.sub_categories_4 // pass for next level
                                                                                                        }))
                                                                                                    }
                                                                                                    value={
                                                                                                        subCategory3.id
                                                                                                            ? { value: subCategory3.id, label: subCategory3.name }
                                                                                                            : null
                                                                                                    }
                                                                                                    onChange={selectedOption => handleLevel3Change(catIdx, subCatIdx, subCategory3Idx, selectedOption)}
                                                                                                    placeholder="Select Sub-category lvl 3"
                                                                                                />
                                                                                                {console.log("sub level 3 options:", subCategory.subCategoryLevel3Options)}
                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={subCategory3.location || ""}
                                                                                                    onChange={(e) => handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "location", e.target.value)}
                                                                                                    className="form-control"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td>

                                                                                            </td>
                                                                                            <td>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={subCategory3.items || ""}
                                                                                                    onChange={(e) => handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "items", e.target.value)}
                                                                                                    className="form-control"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>

                                                                                            <td>
                                                                                                <SingleSelector
                                                                                                    options={unitOfMeasures}
                                                                                                    value={
                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory3.uom)
                                                                                                    }
                                                                                                    placeholder="Select UOM"
                                                                                                    onChange={selectedOption =>
                                                                                                        handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "uom", selectedOption?.value || "")
                                                                                                    }
                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                />
                                                                                            </td>
                                                                                            <td>
                                                                                                {/* <input
                                                                                                type="number"
                                                                                                value={subCategory3.qty || ""}
                                                                                                onChange={(e) =>
                                                                                                    handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "qty", e.target.value)
                                                                                                }
                                                                                                className="form-control"
                                                                                            /> */}
                                                                                            </td>
                                                                                            <td></td>

                                                                                            <td>
                                                                                                {
                                                                                                    (
                                                                                                        // Sum direct material_type_details amounts for level 3
                                                                                                        (subCategory3.material_type_details
                                                                                                            ? subCategory3.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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
                                                                                                                        (subCat4.material_type_details
                                                                                                                            ? subCat4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details for level 4
                                                                                                                        (subCat4.sub_categories_5
                                                                                                                            ? subCat4.sub_categories_5.reduce(
                                                                                                                                (subSum5, subCat5) =>
                                                                                                                                    subSum5 +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
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

                                                                                            <td>


                                                                                                <button
                                                                                                    className="btn btn-link p-0"
                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx)}
                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3, subCategory3.name, subCatIdx)}
                                                                                                    aria-label="Add row to sub-category 3"
                                                                                                    disabled={isOtherLevelFrozen(category, "sub3", { catIdx, subCatIdx, subCategory3Idx })}
                                                                                                >
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                    </svg>
                                                                                                </button>

                                                                                            </td>


                                                                                        </tr>

                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                        {openSubCategory3Id === subCategory3.id &&
                                                                                            subCategory3.material_type_details &&
                                                                                            subCategory3.material_type_details.map((item, itemIdx) => (
                                                                                                <tr key={item.id} className="labour">
                                                                                                    {/* <td></td> */}
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td>{item.location}</td>
                                                                                                    <td>{item.type}</td>
                                                                                                    <td>
                                                                                                        {/* {item.specification} */}
                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}
                                                                                                    </td>
                                                                                                    {/* ...other cells... */}


                                                                                                    <td>

                                                                                                        <SingleSelector
                                                                                                            options={unitOfMeasures}
                                                                                                            value={
                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                            }
                                                                                                            placeholder="Select UOM"
                                                                                                            onChange={selectedOption =>
                                                                                                                handleEditMaterial2SubCat3(catIdx, subCatIdx, subCategory3Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                            }
                                                                                                        />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {/* <input
                                                                                                        type="number"
                                                                                                        value={item.qty || ""}
                                                                                                        readOnly
                                                                                                        disabled
                                                                                                        className="form-control"
                                                                                                    /> */}
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.qty || ""}
                                                                                                            onChange={e =>
                                                                                                                handleEditMaterial2SubCat3(catIdx, subCatIdx, subCategory3Idx, itemIdx, "qty", e.target.value)
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.rate}
                                                                                                            onChange={(e) =>
                                                                                                                handleEditMaterial2SubCat3(catIdx, subCatIdx, subCategory3Idx, itemIdx, "rate", e.target.value)
                                                                                                            }
                                                                                                            className="form-control"
                                                                                                        // disabled={item.type === "material"}
                                                                                                        />
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            value={item.amount || ""}
                                                                                                            readOnly
                                                                                                            disabled
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-link p-0"
                                                                                                            onClick={() => handleRemoveSubCategory3Row(catIdx, subCatIdx, subCategory3Idx, itemIdx)}
                                                                                                            aria-label="Remove row from sub-category 3"
                                                                                                        >
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                            </svg>
                                                                                                        </button>
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

                                                                                                            {/* <td>
                                                       
                                                                                                            </td> */}
                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => toggleSubCategory4(subCategory4.id)}
                                                                                                                    title={openSubCategory4Id === subCategory4.id ? "Collapse" : "Expand"}
                                                                                                                >
                                                                                                                    {openSubCategory4Id ===
                                                                                                                        subCategory4.id ? (
                                                                                                                        // Minus icon (collapse)
                                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                        </svg>
                                                                                                                    ) : (
                                                                                                                        // Plus icon (expand)
                                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                            <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                        </svg>
                                                                                                                    )}
                                                                                                                </button>
                                                                                                                {/* Add Sub Category button, only when expanded */}
                                                                                                                {openSubCategory4Id ===
                                                                                                                    subCategory4.id && (
                                                                                                                        <button
                                                                                                                            className="btn btn-link p-0 ms-2"
                                                                                                                            onClick={() => handleAddSubCategory5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx)}
                                                                                                                            title="Add Sub Category level 5"
                                                                                                                        >
                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                                            </svg>
                                                                                                                        </button>
                                                                                                                    )}

                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => handleRemoveSubCategory4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx)}
                                                                                                                    aria-label="Remove sub-category 4"
                                                                                                                    title="Remove Sub Category level 4"
                                                                                                                >
                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                    </svg>
                                                                                                                </button>
                                                                                                                Sub-Category Level 4
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {/* <SingleSelector
                                                                                                                                      options={subCategoryLevel4Options}
                                                                                                                                      onChange={handleLevel4Change}
                                                                                                                                      value={selectedSubCategoryLevel4}
                                                                                                                                      placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                                                                                                                                    /> */}

                                                                                                                <SingleSelector
                                                                                                                    options={
                                                                                                                        (subCategory3.subCategoryLevel4Options || []).map(subCat4 => ({
                                                                                                                            value: subCat4.value,
                                                                                                                            label: subCat4.label,
                                                                                                                            sub_categories_5: subCat4.sub_categories_5 // pass for next level
                                                                                                                        }))
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        subCategory4.id
                                                                                                                            ? { value: subCategory4.id, label: subCategory4.name }
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    onChange={selectedOption => handleLevel4Change(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, selectedOption)}
                                                                                                                    placeholder="Select Sub-category lvl 4"
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    value={subCategory4.location || ""}
                                                                                                                    onChange={(e) => handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "location", e.target.value)}
                                                                                                                    className="form-control"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>

                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    value={subCategory4.items || ""}
                                                                                                                    onChange={(e) => handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "items", e.target.value)}
                                                                                                                    className="form-control"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>

                                                                                                            <td>
                                                                                                                <SingleSelector
                                                                                                                    options={unitOfMeasures}
                                                                                                                    value={
                                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory4.uom)
                                                                                                                    }
                                                                                                                    placeholder="Select UOM"
                                                                                                                    onChange={selectedOption =>
                                                                                                                        handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "uom", selectedOption?.value || "")
                                                                                                                    }
                                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {/* <input
                                                                                                                type="number"
                                                                                                                value={subCategory4.qty || ""}
                                                                                                                onChange={(e) =>
                                                                                                                    handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "qty", e.target.value)
                                                                                                                }
                                                                                                                className="form-control"
                                                                                                            /> */}
                                                                                                            </td>

                                                                                                            <td></td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    (
                                                                                                                        // Sum direct material_type_details amounts for level 4
                                                                                                                        (subCategory4.material_type_details
                                                                                                                            ? subCategory4.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                        +
                                                                                                                        // Sum all sub-category 5 material_type_details amounts for level 4
                                                                                                                        (subCategory4.sub_categories_5
                                                                                                                            ? subCategory4.sub_categories_5.reduce(
                                                                                                                                (subSum, subCat5) =>
                                                                                                                                    subSum +
                                                                                                                                    (subCat5.material_type_details
                                                                                                                                        ? subCat5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                    ),
                                                                                                                                0
                                                                                                                            )
                                                                                                                            : 0
                                                                                                                        )
                                                                                                                    )
                                                                                                                }
                                                                                                            </td>


                                                                                                            <td>
                                                                                                                <button
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx)}
                                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx,subCategory3Idx, subCategory4Idx, subCategory4.id)}
                                                                                                                    aria-label="Add row to sub-category 2"
                                                                                                                    disabled={isOtherLevelFrozen(category, "sub4", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx })}
                                                                                                                >
                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                                    </svg>
                                                                                                                </button>
                                                                                                            </td>

                                                                                                        </tr>


                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                        {openSubCategory4Id === subCategory4.id &&
                                                                                                            subCategory4.material_type_details &&
                                                                                                            subCategory4.material_type_details.map((item, itemIdx) => (
                                                                                                                <tr key={item.id} className="labour">
                                                                                                                    {/* <td></td> */}
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item.location}</td>
                                                                                                                    <td>{item.type}</td>
                                                                                                                    <td>
                                                                                                                        {/* {item.specification} */}
                                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}
                                                                                                                    </td>
                                                                                                                    {/* ...other cells... */}

                                                                                                                    <td>
                                                                                                                        <SingleSelector
                                                                                                                            options={unitOfMeasures}
                                                                                                                            value={
                                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                                            }
                                                                                                                            placeholder="Select UOM"
                                                                                                                            onChange={selectedOption =>
                                                                                                                                handleEditMaterial2SubCat4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </td>
                                                                                                                    <td>
                                                                                                                        {/* <input
                                                                                                                        type="number"
                                                                                                                        value={item.qty || ""}
                                                                                                                        readOnly
                                                                                                                        disabled
                                                                                                                        className="form-control"
                                                                                                                    /> */}
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.qty || ""}
                                                                                                                            onChange={e =>
                                                                                                                                handleEditMaterial2SubCat4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "qty", e.target.value)
                                                                                                                            }
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>

                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.rate}
                                                                                                                            onChange={(e) =>
                                                                                                                                handleEditMaterial2SubCat4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "rate", e.target.value)
                                                                                                                            }
                                                                                                                            className="form-control"
                                                                                                                        // disabled={item.type === "material"}
                                                                                                                        />
                                                                                                                    </td>

                                                                                                                    <td>
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            value={item.amount || ""}
                                                                                                                            readOnly
                                                                                                                            disabled
                                                                                                                            className="form-control"
                                                                                                                        />
                                                                                                                    </td>


                                                                                                                    <td>
                                                                                                                        <button
                                                                                                                            className="btn btn-link p-0"
                                                                                                                            onClick={() => handleRemoveSubCategory4Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx)}
                                                                                                                            aria-label="Remove row from sub-category 4"
                                                                                                                        >
                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                            </svg>
                                                                                                                        </button>
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
                                                                                                                            {/* <td>
                                                                                                                               
                                                                                                                            </td> */}
                                                                                                                            <td></td>
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
                                                                                                                                <button
                                                                                                                                    className="btn btn-link p-0"
                                                                                                                                    onClick={() => handleRemoveSubCategory5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                                                                                    aria-label="Remove sub-category 5"
                                                                                                                                    title="Remove Sub Category level 5"
                                                                                                                                >
                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                        <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                                    </svg>
                                                                                                                                </button>
                                                                                                                                Sub-Category Level 5
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {/* <SingleSelector
                                                                                                                                                  options={subCategoryLevel5Options}
                                                                                                                                                  onChange={handleLevel5Change}
                                                                                                                                                  value={selectedSubCategoryLevel5}
                                                                                                                                                  placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                                                                                                                                                /> */}

                                                                                                                                <SingleSelector
                                                                                                                                    options={
                                                                                                                                        (subCategory4.subCategoryLevel5Options || []).map(subCat5 => ({
                                                                                                                                            value: subCat5.value,
                                                                                                                                            label: subCat5.label
                                                                                                                                        }))
                                                                                                                                    }
                                                                                                                                    value={
                                                                                                                                        subCategory5.id
                                                                                                                                            ? { value: subCategory5.id, label: subCategory5.name }
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    onChange={selectedOption =>
                                                                                                                                        handleLevel5Change(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, selectedOption)
                                                                                                                                    }
                                                                                                                                    placeholder="Select Sub-category lvl 5"
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <input
                                                                                                                                    type="text"
                                                                                                                                    value={subCategory5.location || ""}
                                                                                                                                    onChange={(e) => handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "location", e.target.value)}
                                                                                                                                    className="form-control"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>

                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                <input
                                                                                                                                    type="text"
                                                                                                                                    value={subCategory5.items || ""}
                                                                                                                                    onChange={(e) => handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "items", e.target.value)}
                                                                                                                                    className="form-control"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>

                                                                                                                            <td>
                                                                                                                                <SingleSelector
                                                                                                                                    options={unitOfMeasures}
                                                                                                                                    value={
                                                                                                                                        unitOfMeasures.find(opt => opt.value === subCategory5.uom)
                                                                                                                                    }
                                                                                                                                    placeholder="Select UOM"
                                                                                                                                    onChange={selectedOption =>
                                                                                                                                        handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "uom", selectedOption?.value || "")
                                                                                                                                    }
                                                                                                                                    isDisabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td>
                                                                                                                                {/* <input
                                                                                                                                type="number"
                                                                                                                                value={subCategory5.qty || ""}
                                                                                                                                onChange={(e) =>
                                                                                                                                    handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "qty", e.target.value)
                                                                                                                                }
                                                                                                                                className="form-control"
                                                                                                                            /> */}
                                                                                                                            </td>

                                                                                                                            <td></td>
                                                                                                                            <td>
                                                                                                                                {
                                                                                                                                    subCategory5.material_type_details
                                                                                                                                        ? subCategory5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                                                                                        : 0
                                                                                                                                }
                                                                                                                            </td>

                                                                                                                            <td>
                                                                                                                                <button
                                                                                                                                    className="btn btn-link p-0"
                                                                                                                                    onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                                                                                    // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5.id,subCategory5Idx)}
                                                                                                                                    aria-label="Add row to sub-category 2"
                                                                                                                                    disabled={isOtherLevelFrozen(category, "sub5", { catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx })}
                                                                                                                                >
                                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                        <line x1="12" y1="10" x2="12" y2="18" />
                                                                                                                                        <line x1="8" y1="14" x2="16" y2="14" />
                                                                                                                                        {/* <line x1="8" y1="34" x2="16" y2="34" /> */}
                                                                                                                                    </svg>
                                                                                                                                </button>

                                                                                                                            </td>

                                                                                                                        </tr>


                                                                                                                        {/* Render material_type_details rows for sub-category 3 */}
                                                                                                                        {openSubCategory5Id === subCategory5.id &&
                                                                                                                            subCategory5.material_type_details &&
                                                                                                                            subCategory5.material_type_details.map((item, itemIdx) => (
                                                                                                                                <tr key={item.id} className="labour">
                                                                                                                                    {/* <td></td> */}
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td></td>
                                                                                                                                    <td>{item.location}</td>
                                                                                                                                    <td>{item.type}</td>
                                                                                                                                    <td>
                                                                                                                                        {/* {item.specification || item.labourActLabel} */}
                                                                                                                                        {item.material_type} {item.generic_info || item.labour_activity || item.composite_name}
                                                                                                                                    </td>
                                                                                                                                    {/* ...other cells... */}

                                                                                                                                    <td>

                                                                                                                                        <SingleSelector
                                                                                                                                            options={unitOfMeasures}
                                                                                                                                            value={
                                                                                                                                                unitOfMeasures.find(opt => opt.value === item.uom)
                                                                                                                                            }
                                                                                                                                            placeholder="Select UOM"
                                                                                                                                            onChange={selectedOption =>
                                                                                                                                                handleEditMaterial2SubCat5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory4Idx, itemIdx, "uom", selectedOption?.value || "")
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {/* <input
                                                                                                                                        type="number"
                                                                                                                                        value={item.qty || ""}
                                                                                                                                        readOnly
                                                                                                                                        disabled
                                                                                                                                        className="form-control"
                                                                                                                                    /> */}
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.qty || ""}
                                                                                                                                            onChange={e =>
                                                                                                                                                handleEditMaterial2SubCat5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory4Idx, itemIdx, "qty", e.target.value)
                                                                                                                                            }
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>

                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.rate}
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleEditMaterial2SubCat5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx, "rate", e.target.value)
                                                                                                                                            }
                                                                                                                                            className="form-control"
                                                                                                                                        // disabled={item.type === "material"}
                                                                                                                                        />
                                                                                                                                    </td>

                                                                                                                                    <td>
                                                                                                                                        <input
                                                                                                                                            type="number"
                                                                                                                                            value={item.amount || ""}
                                                                                                                                            readOnly
                                                                                                                                            disabled
                                                                                                                                            className="form-control"
                                                                                                                                        />
                                                                                                                                    </td>

                                                                                                                                    <td>
                                                                                                                                        <button
                                                                                                                                            className="btn btn-link p-0"
                                                                                                                                            onClick={() => handleRemoveSubCategory5Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx)}
                                                                                                                                            aria-label="Remove row from sub-category 5"
                                                                                                                                        >
                                                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                                {/* <rect x="3" y="3" width="10" height="10" rx="1" ry="1" /> */}
                                                                                                                                                <line x1="5" y1="8" x2="11" y2="8" />
                                                                                                                                            </svg>
                                                                                                                                        </button>
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
                                                        // ))}


                                                    ))


                                                ) : (
                                                    <tr>
                                                        <td colSpan={12} className="text-center">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                    <div className="row mt-5 mb-5 justify-content-center">
                        <div className="col-md-2">
                            <button className="purple-btn2 w-100 mt-2" onClick={handleSubmit}> Submit</button>
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















            <Modal show={showAddModal} size="xl" onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Material/Labour</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row p-3">
                        <div className="d-flex justify-content-end mb-3">
                            <button
                                className="purple-btn2"
                                onClick={handleAddModalRow}
                            >
                                + Add Row
                            </button>
                        </div>
                        {modalRows.map((row, idx) => (
                            <div key={idx} className="border rounded p-2 mb-2 position-relative">
                                {/* Remove Row Cross Icon in Square */}
                                {modalRows.length > 1 && (
                                    <button
                                        className="btn btn-link p-0 position-absolute"
                                        style={{
                                            top: 8,
                                            right: 8,
                                            zIndex: 2,
                                            width: 28,
                                            height: 28,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "transparent",
                                        }}
                                        onClick={() => handleRemoveModalRow(idx)}
                                        aria-label="Remove Row"
                                        title="Remove Row"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" stroke="#8b0203" strokeWidth="2" />
                                            <line x1="7" y1="7" x2="17" y2="17" stroke="#8b0203" strokeWidth="2" />
                                            <line x1="17" y1="7" x2="7" y2="17" stroke="#8b0203" strokeWidth="2" />
                                        </svg>
                                    </button>
                                )}
                                {/* Radio Buttons */}
                                <div className="d-flex align-items-center mb-2">
                                    <div className="form-check form-check-inline me-2 col-md-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`type-${idx}`}
                                            value="material"
                                            checked={row.type === "material"}
                                            onChange={() => handleModalRowChange(idx, "type", "material")}
                                        />
                                        <label className="form-check-label">Material</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2 col-md-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`type-${idx}`}
                                            value="labour"
                                            checked={row.type === "labour"}
                                            onChange={() => handleModalRowChange(idx, "type", "labour")}
                                        />
                                        <label className="form-check-label">Labour</label>
                                    </div>
                                    <div className="form-check form-check-inline me-2 col-md-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`type-${idx}`}
                                            value="composite"
                                            checked={row.type === "composite"}
                                            onChange={() => handleModalRowChange(idx, "type", "composite")}
                                        />
                                        <label className="form-check-label">Composite</label>
                                    </div>
                                </div>
                                {/* Material Type & Specification */}
                                {row.type === "material" && (
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="col-md-4 mt-3">
                                            <div className="form-group">
                                                <label>Material Type</label>
                                                <SingleSelector
                                                    options={inventoryTypes2}
                                                    value={inventoryTypes2.find(option => option.value === row.materialType)}
                                                    placeholder="Select Material Type"
                                                    onChange={selectedOption =>
                                                        handleModalRowChange(idx, "materialType", selectedOption || "")
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 mt-3 ms-3 ">
                                            <div className="form-group">
                                                <label>Generic Specification</label>
                                                <SingleSelector
                                                    options={Array.isArray(genericSpecificationsByRow[idx]) ? genericSpecificationsByRow[idx] : []}
                                                    value={genericSpecificationsByRow[idx]?.find(option => option.value === row.specification)}
                                                    placeholder="Select Specification"
                                                    onChange={selectedOption =>
                                                        handleModalRowChange(idx, "specification", selectedOption || "")
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Labour Activity */}
                                {row.type === "labour" && (
                                    <div className="col-md-4 mt-3">
                                        <div className="form-group">
                                            <label>Labour Activity</label>
                                            <SingleSelector
                                                options={labourActivities}
                                                value={labourActivities.find(option => option.value === row.labourType)}
                                                placeholder="Select Labour Activity"
                                                onChange={selectedOption =>
                                                    handleModalRowChange(idx, "labourType", selectedOption || "")
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Composite Value */}
                                {row.type === "composite" && (
                                    <div className="col-md-4 mt-3">
                                        <div className="form-group">
                                            <label>Composite Value</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter composite value"
                                                value={row.compositeValue || ""}
                                                onChange={e =>
                                                    handleModalRowChange(idx, "compositeValue", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <button
                        className="purple-btn2 me-4"
                        onClick={() => handleCreateRows()}
                    >
                        Create
                    </button>
                    <button className="purple-btn1" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default EstimationCreationEdit;
