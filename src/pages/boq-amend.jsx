import React from "react";
import BOQSubItemTable from "../components/BOQSubItemTable ";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import MaterialModal from "../components/MaterialModal";
import LabourModal from "../components/LabourModal";
import AssetModal from "../components/AssestModal";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import axios from "axios";
import { prepareDataForValidation } from "formik";
import { useNavigate, Link } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../confi/apiDomain";
import Select from "react-select";
// import EditBoqSub from "./EditBoqSub";
import EditBoqSub from "./EditBoqSub";
import { useParams } from 'react-router-dom';
// import BOQAmendSub from "./Boq-amend-sub";
import BoqAmendSub from "./Boq-amend-sub";
// import { ToastContainer, toast } from "react-toastify";


const BoqAmend = () => {
    const { id } = useParams()
    const [showMaterialLabour, setShowMaterialLabour] = useState(null);
    const [showBOQSubItem, setShowBOQSubItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [materialErrors, setMaterialErrors] = useState({});
    const [assetsErrors, setAssetsErrors] = useState({});

    // boq edit start ......
    const [boqDetails, setBoqDetails] = useState(null);  // State to hold the fetched data
    const [boqDetailsSub, setBoqDetailsSub] = useState(true);
    const [remark, setRemark] = useState("");
    const [deletedMaterialIds, setDeletedMaterialIds] = useState([]);

    const fetchData = async () => {

        try {
            const response = await axios.get(`${baseURL}boq_details/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`);
            console.log("responce:", response.data)
            // Assuming the API returns data based on the id (you may need to adjust based on your response)
            setBoqDetails(response.data);
            //   setStatus(response.data.status || '');
            //   setInitialStatus(response.data.status || '');
            setLoading(false);
            // setBoqDetailsSub(response.data.uom)
            if (response.data.boq_sub_items && response.data.boq_sub_items.length > 0) {
                setBoqDetailsSub(false); // Set to true if uom is not null
                setShowBOQSubItem(true)
                setShowMaterialLabour(false)
            } else {
                setShowBOQSubItem(false)
                setShowMaterialLabour(true)
            }

        } catch (error) {
            setError('An error occurred while fetching the data');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch the data when the component mounts or when 'id' changes

        // console.log("id in useeffect:", id)
        fetchData();
    }, [id]);  // Dependency array ensures fetch is triggered when 'id' changes


    // Group categories by level
    const groupedCategories = boqDetails?.categories?.reduce((acc, category) => {
        if (!acc[category.level]) {
            acc[category.level] = [];
        }
        acc[category.level].push(category);
        return acc;
    }, {});

    const categories = boqDetails?.categories || [];

    const lastCategory = categories.length > 0 ? categories[categories.length - 1].category_id : null;

    // console.log(lastCategory);


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

        // if (openBoqDetailId === id) {
        //   setOpenBoqDetailId(null);  // Close the category if it's already open
        // } else {
        //   setOpenBoqDetailId(id);  // Open the selected category
        // }

        setOpenBoqDetailId(prevId => prevId === id ? null : id);
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


    const [errors, setErrors] = useState({});

    // bootstrap collaps
    const [expandedRows, setExpandedRows] = useState([]);
    const [table1Rows, setTable1Rows] = useState([{ id: 1, value: "" }]);
    const [table2Rows, setTable2Rows] = useState([{ id: 1, value: "" }]);
    const [count, setcount] = useState([]);
    const [counter, setCounter] = useState(0);


    useEffect(() => {
        if (!boqDetails?.boq_sub_items) return;

        setCounter(boqDetails.boq_sub_items.length);

        const existingBoqItems = boqDetails.boq_sub_items.map((item) => ({
            id: item.id || crypto.randomUUID(),
            name: item.name || "",
            description: item.description || "",
            notes: item.notes || "",
            remarks: item.remarks || "",
            cost_quantity: item.cost_quantity || 0,
            uom_id: item.unit_of_measure_id || null,
            materials: item.materials || [], // Fetch materials from API
            assets: item.assets || [],
        }));

        setBoqSubItems(existingBoqItems);

        // ✅ Merge API materials with existing ones in `materials2`
        setMaterials2((prev) => {
            const updatedMaterials = { ...prev };

            existingBoqItems.forEach((item) => {
                const existingMaterials = updatedMaterials[item.id] || [];
                const newMaterials = item.materials || [];

                // Ensure all materials use `material_id`
                const normalizedExistingMaterials = existingMaterials.map((m) => ({
                    ...m,
                    material_id: m.material_id || m.id, // Normalize material_id
                }));
                const normalizedNewMaterials = newMaterials.map((m) => ({
                    ...m,
                    material_id: m.material_id || m.id, // Normalize material_id
                }));

                // Avoid duplicates using `Set`
                const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
                const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

                updatedMaterials[item.id] = [...normalizedExistingMaterials, ...filteredNewMaterials];
            });

            return updatedMaterials;
        });

    }, [boqDetails]); // Runs when API data updates

    // ✅ Function to add new materials dynamically
    const handleAddMaterials2 = (id, newMaterials) => {
        setMaterials2((prev) => {
            const updatedMaterials = { ...prev };

            if (!updatedMaterials[id]) {
                updatedMaterials[id] = [];
            }

            // Normalize `material_id`
            const normalizedExistingMaterials = updatedMaterials[id].map((m) => ({
                ...m,
                material_id: m.material_id || m.id,
            }));
            const normalizedNewMaterials = newMaterials.map((m) => ({
                ...m,
                material_id: m.material_id || m.id,
            }));

            // Avoid duplicates using `Set`
            const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
            const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

            updatedMaterials[id] = [...normalizedExistingMaterials, ...filteredNewMaterials];

            return updatedMaterials;
        });

        // ✅ Sync with `boqSubItems`
        setBoqSubItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        materials: [
                            ...item.materials,
                            ...newMaterials.filter(
                                (m) => !item.materials.some((em) => em.material_id === (m.material_id || m.id))
                            ),
                        ],
                    }
                    : item
            )
        );
    };




    // bootstrap modal
    const toggleRow = (rowIndex) => {
        setExpandedRows((prev) =>
            prev.includes(rowIndex)
                ? prev.filter((index) => index !== rowIndex)
                : [...prev, rowIndex]
        );
    };
    //
    // Function to add a new row to Table 1

    // Function to add a new row to Table 2
    const addRowToTable2 = () => {
        const newRow = { id: table2Rows.length + 1, value: "" };
        setTable2Rows([...table2Rows, newRow]);
    };

    // Function to handle row value change for Table 1
    const handleChangeTable1 = (id, newValue) => {
        const updatedRows = table1Rows.map((row) =>
            row.id === id ? { ...row, value: newValue } : row
        );
        setTable1Rows(updatedRows);
    };

    // Function to handle row value change for Table 2
    const handleChangeTable2 = (id, newValue) => {
        const updatedRows = table2Rows.map((row) =>
            row.id === id ? { ...row, value: newValue } : row
        );
        setTable2Rows(updatedRows);
    };


    // Function to delete a row from Table 2
    const deleteRowFromTable2 = (id) => {
        setTable2Rows(table2Rows.filter((row) => row.id !== id));
    };

    //Material modal and table data handle add or delete

    const [showModal, setShowModal] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]); // To track selected rows
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddMaterials = (newMaterials) => {
        setMaterials((prev) => [
            ...prev,
            ...newMaterials.filter(
                (material) => prev.filter((m) => m.id === material.id) // Allow max 2 copies
            ),
        ]);
    };


    // console.log("materials", materials)

    const handleDeleteRow = (materialToDelete) => {
        setMaterials((prev) =>
            prev.filter((material) => material.id !== materialToDelete.id)
        );
    };


    const handleDeleteAll = () => {
        setMaterials((prev) => {
            // Get IDs of materials being deleted
            const deletedIds = prev
                .filter((_, index) => selectedMaterials.includes(index))
                .map((material) => material.id)
                .filter((id) => id !== undefined); // Ensure only valid IDs are stored

            // Store deleted material IDs
            setDeletedMaterialIds((prevDeletedIds) => [...prevDeletedIds, ...deletedIds]);

            // Get the new materials after deletion
            const newMaterials = prev.filter((_, index) => !selectedMaterials.includes(index));

            // Function to update selections after deletion
            const updateSelection = (selectionArray = []) =>
                selectedMaterials.reduce((acc, index) => {
                    acc.splice(index, 1); // Remove the selected index
                    return acc;
                }, [...selectionArray]);

            // Update all related state variables
            setSelectedSubTypes(updateSelection(selectedSubTypes));
            setGenericSpecifications(updateSelection(genericSpecifications));
            setSelectedGenericSpecifications(updateSelection(selectedGenericSpecifications));
            setSelectedColors(updateSelection(selectedColors));
            setSelectedInventoryBrands(updateSelection(selectedInventoryBrands));
            setSelectedUnit2(updateSelection(selectedUnit2));
            setCoefficientFactors(updateSelection(coefficientFactors));
            setEstimatedQuantities(updateSelection(estimatedQuantities));
            setWastages(updateSelection(wastages));
            setTotalEstimatedQtyWastages(updateSelection(totalEstimatedQtyWastages));

            return newMaterials;
        });

        setSelectedMaterials([]); // Clear selected materials
    };
    // console.log("deleted materil ids", deletedMaterialIds)

    const handleSelectRow = (materialIndex) => {
        setSelectedMaterials((prev) =>
            prev.includes(materialIndex)
                ? prev.filter((index) => index !== materialIndex) // Unselect
                : [...prev, materialIndex] // Select
        );
    };


    //Material modal and table data handle add or delete

    const [showModal2, setShowModal2] = useState(false);
    const [materials2, setMaterials2] = useState([]);
    const [selectedMaterials2, setSelectedMaterials2] = useState([]); // To track selected rows
    const handleOpenModal2 = () => setShowModal2(true);
    const handleCloseModal2 = () => setShowModal2(false);


    // const handleAddMaterials2 = (newMaterials) => {
    //   setMaterials2((prev) => [
    //     ...prev,
    //     ...newMaterials.filter(
    //       (material) => !prev.some((m) => m.id === material.id)
    //     ),
    //   ]);
    // };

    // console.log("materials sub ", materials2)

    const handleDeleteRow2 = (materialToDelete) => {
        setMaterials2((prev) =>
            prev.filter((material) => material.id !== materialToDelete.id)
        );
    };

    const handleDeleteAll2 = () => {
        setMaterials((prev) =>
            prev.filter((material) => !selectedMaterials.includes(material.id))
        );
        setSelectedMaterials2([]); // Reset selected materials
    };

    const handleSelectRow2 = (materialName) => {
        setSelectedMaterials(
            (prev) =>
                prev.includes(materialName)
                    ? prev.filter((name) => name !== materialName) // Unselect the material
                    : [...prev, materialName] // Select the material
        );
    };

    //asset modal and table data handle add or delete
    const [showModalAsset, setShowModalAsset] = useState(false);
    const [Assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const handleOpenModalAsset = () => setShowModalAsset(true);
    const handleCloseModalAsset = () => setShowModalAsset(false);

    const handleAddAssets = (newAsset) => {
        setAssets((prev) => [...prev, ...newAsset]); // No duplicate check, always adds new assets
    };


    const handleDeleteAllAssets = () => {
        // setAssets((prev) => prev.filter((_, index) => !selectedAssets.includes(index))); // Filter using index

        setAssets((prev) => {
            // Get the new materials after deletion
            const newMaterials = prev.filter((_, index) => !selectedAssets.includes(index));

            // Function to update selections after deletion
            const updateSelection = (selectionArray = []) =>
                selectedAssets.reduce((acc, index) => {
                    acc.splice(index, 1); // Remove the selected index
                    return acc;
                }, [...selectionArray]);

            // Update all related state variables
            setSelectedSubTypesAssets(updateSelection(selectedSubTypesAssets));
            setAssetGenericSpecifications(updateSelection(assetGenericSpecifications));
            setSelectedAssetGenericSpecifications(updateSelection(selectedAssetGenericSpecifications));
            setSelectedAssetColors(updateSelection(selectedAssetColors));
            setSelectedAssetInventoryBrands(updateSelection(selectedAssetInventoryBrands));
            setSelectedUnit3(updateSelection(selectedUnit3));
            setAssetCoefficientFactors(updateSelection(assetCoefficientFactors));
            setAssetEstimatedQuantities(updateSelection(assetEstimatedQuantities));
            setAssetWastages(updateSelection(assetWastages));
            setAssetTotalEstimatedQtyWastages(updateSelection(assetTotalEstimatedQtyWastages));

            // console.log("After deletion - New Materials:", JSON.stringify(newMaterials));
            // console.log("After deletion - Updated Generic Specifications:", JSON.stringify(genericSpecifications));

            return newMaterials;
        });
        setSelectedAssets([]); // Reset selection
    };

    const handleSelectRowAssets = (assetIndex) => {
        setSelectedAssets((prev) =>
            prev.includes(assetIndex)
                ? prev.filter((index) => index !== assetIndex) // Unselect asset
                : [...prev, assetIndex] // Select asset
        );
    };


    //asset 2 modal and table data handle add or delete
    const [showModalAsset2, setShowModalAsset2] = useState(false);
    const [Assets2, setAssets2] = useState([]);
    const [selectedAssets2, setSelectedAssets2] = useState([]);
    const handleOpenModalAsset2 = () => setShowModalAsset2(true);
    const handleCloseModalAsset2 = () => setShowModalAsset2(false);

    const handleAddAssets2 = (id, newAssets) => {
        setAssets2((prev) => {
            const updatedAssets = { ...prev };

            if (!updatedAssets[id]) {
                updatedAssets[id] = [];
            }

            // Allow duplicates but prevent exact same object references
            updatedAssets[id] = [...updatedAssets[id], ...newAssets];

            return updatedAssets;
        });
    };


    const handleDeleteAllAssets2 = () => {
        setAssets2((prev) =>
            prev.filter((asset) => !selectedAssets.includes(asset.id))
        );
        setSelectedAssets2([]); // Reset selected materials
    };

    const handleSelectRowAssets2 = (assetType) => {
        setSelectedAssets2(
            (prev) =>
                prev.includes(assetType)
                    ? prev.filter((type) => type !== assetType) // Unselect the material
                    : [...prev, assetType] // Select the material
        );
    };

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
        axios
            .get(
                `${baseURL}pms/projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((response) => {
                setProjects(response.data.projects);
            })
            .catch((error) => {
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
            const selectedProjectData = projects.find(
                (project) => project.id === selectedOption.value
            );
            setSiteOptions(
                selectedProjectData.pms_sites.map((site) => ({
                    value: site.id, // Use id as value for the site
                    label: site.name, // Display the site name
                }))
            );
        }
    };

    // Handle site selection change
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
        setSelectedWing(null); // Reset selected wing
        setWingsOptions([]); // Clear wings options

        // Fetch wings for the selected site
        if (selectedOption) {
            const selectedProjectData = projects.find(
                (project) => project.id === selectedProject.value
            );
            const selectedSiteData = selectedProjectData.pms_sites.find(
                (site) => site.id === selectedOption.value
            );
            setWingsOptions(
                selectedSiteData.pms_wings.map((wing) => ({
                    value: wing.id, // Use id as value for the wing
                    label: wing.name, // Display the wing name
                }))
            );
        }
    };

    // Handle wing selection change
    const handleWingChange = (selectedOption) => {
        setSelectedWing(selectedOption);
        // You can perform further actions with the selected wing value if necessary
    };

    // Mapping projects for the dropdown
    const projectOptions = projects.map((project) => ({
        value: project.id, // Use id as value for the project
        label: project.formatted_name,
    }));

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
                `${baseURL}work_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

    // Handler for selecting a level 3 subcategory
    const handleLevel3Change = (selectedOption) => {
        setSelectedSubCategoryLevel3(selectedOption);
        setSubCategoryLevel4Options([]); // Clear subcategory level 4 options
        setSubCategoryLevel5Options([]); // Clear subcategory level 5 options

        // Fetch level 4 subcategories using the selected level 3 subcategory ID
        if (selectedOption && selectedOption.value) {
            axios
                .get(
                    `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                )
                .then((response) => {
                    const subSubCategories = response.data.work_sub_categories || [];
                    setSubCategoryLevel4Options(
                        subSubCategories.map((subSubCategory) => ({
                            value: subSubCategory.id,
                            label: subSubCategory.name,
                        }))
                    );
                })
                .catch((error) => {
                    console.error("Error fetching level 4 subcategories:", error);
                });
        }
    };

    // Handler for selecting a level 4 subcategory
    const handleLevel4Change = (selectedOption) => {
        setSelectedSubCategoryLevel4(selectedOption);
        setSubCategoryLevel5Options([]); // Clear level 5 options

        // Fetch level 5 subcategories using the selected level 4 subcategory ID
        if (selectedOption && selectedOption.value) {
            axios
                .get(
                    `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                )
                .then((response) => {
                    const subSubCategories = response.data.work_sub_categories || [];
                    setSubCategoryLevel5Options(
                        subSubCategories.map((subSubCategory) => ({
                            value: subSubCategory.id,
                            label: subSubCategory.name,
                        }))
                    );
                })
                .catch((error) => {
                    console.error("Error fetching level 5 subcategories:", error);
                });
        }
    };

    // umo api

    const [unitOfMeasures, setUnitOfMeasures] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedUnitSubRow, setSelectedUnitSubRow] = useState([]);
    const [selectedUnit2, setSelectedUnit2] = useState([]);
    const [selectedUnit3, setSelectedUnit3] = useState([]);

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
        // Ensure boqDetails is updated with the selected unit
        setBoqDetails((prev) => ({
            ...prev,
            unit_of_measure_id: selectedOption?.value || null,
        }));
    };

    // const handleUnitChange2 = (selectedOption) => {
    //   setSelectedUnit2(selectedOption);  // Update selected unit state
    // };

    const handleUnitChange2 = (index, selectedOption) => {
        setSelectedUnit2((prevSelectedUnits) => {
            const newSelectedUnits = [...prevSelectedUnits];
            newSelectedUnits[index] = selectedOption; // Update UOM for the specific material
            return newSelectedUnits;
        });
    };

    const handleUnitChange3 = (index, selectedOption) => {
        setSelectedUnit3((prevSelectedUnits) => {
            const newSelectedUnits = [...prevSelectedUnits];
            newSelectedUnits[index] = selectedOption; // Update UOM for the specific material
            return newSelectedUnits;
        });
    };

    // const handleUnitChange3 = (selectedOption) => {
    //   setSelectedUnit3(selectedOption);  // Update selected unit state
    // };

    // for subproject material table

    const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtype
    const [selectedSubTypes, setSelectedSubTypes] = useState([]); // Holds the selected subtypes for each material
    const [assetSubTypes, setAssetSubTypes] = useState([]); // For assets
    const [selectedSubTypesAssets, setSelectedSubTypesAssets] = useState([]);
    // Fetch inventory sub-types when materials array changes or inventory type changes


    // Fetch sub-types for materials
    useEffect(() => {
        materials.forEach((material, index) => {
            if (material.inventory_type_id) {
                axios
                    .get(
                        `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${material.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((subType) => ({
                            value: subType.id,
                            label: subType.name,
                        }));
                        setInventorySubTypes((prevSubTypes) => {
                            const newSubTypes = [...prevSubTypes];
                            newSubTypes[index] = options; // Update sub-types for this specific material
                            return newSubTypes;
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching inventory sub-types:", error);
                    });
            }
        });
    }, [materials, baseURL]); // Trigger effect when materials or baseURL change

    // Fetch sub-types for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.inventory_type_id) {
                // console.log("Assets inventory id:", asset.inventory_type_id);
                axios
                    .get(
                        `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${asset.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((subType) => ({
                            value: subType.id,
                            label: subType.name,
                        }));
                        setAssetSubTypes((prevSubTypes) => {
                            const newSubTypes = [...prevSubTypes];
                            newSubTypes[index] = options; // Update sub-types for this specific asset
                            return newSubTypes;
                        });
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching inventory sub-types for asset:",
                            error
                        );
                    });
            }
        });
    }, [Assets, baseURL]); // Trigger effect when assets or baseURL change

    // Handler for inventory sub-type selection change
    const handleSubTypeChange = (index, selectedOption) => {
        setSelectedSubTypes((prevSelectedSubTypes) => {
            const newSelectedSubTypes = [...prevSelectedSubTypes];
            newSelectedSubTypes[index] = selectedOption; // Update sub-type for the specific material
            return newSelectedSubTypes;
        });
    };
    const handleSubTypeChangeAssets = (index, selectedOption) => {
        setSelectedSubTypesAssets((prevSelectedSubTypes) => {
            const newSelectedSubTypes = [...prevSelectedSubTypes];
            newSelectedSubTypes[index] = selectedOption; // Update sub-type for the specific material
            return newSelectedSubTypes;
        });
    };

    // for generic specification
    const [genericSpecifications, setGenericSpecifications] = useState([]); // State to hold the fetched generic specifications
    const [selectedGenericSpecifications, setSelectedGenericSpecifications] = useState([]); // Holds the selected generic specifications for each material
    const [assetGenericSpecifications, setAssetGenericSpecifications] = useState([]); // State to hold the fetched generic specifications for assets
    const [selectedAssetGenericSpecifications, setSelectedAssetGenericSpecifications] = useState([]); // Holds the selected generic specifications for each asset

    // Fetch generic specifications when materials array changes or material_id changes

    // Fetch generic specifications for materials
    useEffect(() => {
        materials.forEach((material, index) => {
            if (material.pms_inventory_id || material.id) {
                axios
                    .get(
                        `${baseURL}pms/generic_infos.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((specification) => ({
                            value: specification.id,
                            label: specification.generic_info,
                        }));
                        setGenericSpecifications((prevSpecifications) => {
                            // Avoid index-based issues. We want to push the new options.
                            const newColors = [...prevSpecifications];
                            newColors[index] = options; // Update colors for this specific material
                            return newColors;
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching generic specifications:", error);
                    });
            }
        });
    }, [materials, baseURL]); // Runs when materials or baseURL changes

    // Fetch generic specifications for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.id) {
                axios
                    .get(
                        `${baseURL}pms/generic_infos.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((specification) => ({
                            value: specification.id,
                            label: specification.generic_info,
                        }));
                        setAssetGenericSpecifications((prevSpecifications) => {
                            // Avoid index-based issues. We want to push the new options.
                            const newColors = [...prevSpecifications];
                            newColors[index] = options; // Update colors for this specific material
                            return newColors;
                        });
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching generic specifications for asset:",
                            error
                        );
                    });
            }
        });
    }, [Assets, baseURL]); // Runs when assets or baseURL changes


    // Handler for generic specification selection change
    const handleGenericSpecificationChange = (index, selectedOption) => {
        setSelectedGenericSpecifications((prevSelectedSpecifications) => {
            const newSelectedSpecifications = [...prevSelectedSpecifications];
            newSelectedSpecifications[index] = selectedOption; // Update generic specification for the specific material
            return newSelectedSpecifications;
        });
    };

    const handleGenericSpecificationChangeForAsset = (index, selectedOption) => {
        setSelectedAssetGenericSpecifications((prevSelectedSpecifications) => {
            const newSelectedSpecifications = [...prevSelectedSpecifications];
            newSelectedSpecifications[index] = selectedOption; // Update generic specification for the specific asset
            return newSelectedSpecifications;
        });
    };

    //for color in material table
    const [colors, setColors] = useState([]); // State to hold the fetched colors
    const [selectedColors, setSelectedColors] = useState([]); // Holds the selected colors for each material
    const [assetColors, setAssetColors] = useState([]); // State to hold the fetched colors for assets
    const [selectedAssetColors, setSelectedAssetColors] = useState([]); // Holds the selected color for each asset
    // Fetch colors when materials array changes or material_id changes

    useEffect(() => {
        materials.forEach((material, index) => {
            if (material.pms_inventory_id || material.id) {
                axios
                    .get(
                        `${baseURL}pms/colours.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((color) => ({
                            value: color.id,
                            label: color.colour,
                        }));
                        setColors((prevColors) => {
                            const newColors = [...prevColors];
                            newColors[index] = options; // Update colors for this specific material
                            return newColors;
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching colors:", error);
                    });
            }
        });
    }, [materials, baseURL]); // Runs when materials or baseURL changes

    // Fetch colors for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.id) {
                axios
                    .get(
                        `${baseURL}pms/colours.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((color) => ({
                            value: color.id,
                            label: color.colour,
                        }));
                        setAssetColors((prevColors) => {
                            const newColors = [...prevColors];
                            newColors[index] = options; // Update colors for this specific asset
                            return newColors;
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching colors for asset:", error);
                    });
            }
        });
    }, [Assets, baseURL]); // Runs when assets or baseURL changes

    // Handler for color selection change
    const handleColorChange = (index, selectedOption) => {
        setSelectedColors((prevSelectedColors) => {
            const newSelectedColors = [...prevSelectedColors];
            newSelectedColors[index] = selectedOption; // Update color for the specific material
            return newSelectedColors;
        });
    };
    const handleAssetColorChange = (index, selectedOption) => {
        setSelectedAssetColors((prevSelectedColors) => {
            const newSelectedColors = [...prevSelectedColors];
            newSelectedColors[index] = selectedOption; // Update color for the specific asset
            return newSelectedColors;
        });
    };

    //for brand in material table
    const [inventoryBrands, setInventoryBrands] = useState([]); // State to hold the fetched inventory brands
    const [selectedInventoryBrands, setSelectedInventoryBrands] = useState([]); // Holds the selected brands for each material
    const [assetInventoryBrands, setAssetInventoryBrands] = useState([]); // State to hold the fetched inventory brands for assets
    const [selectedAssetInventoryBrands, setSelectedAssetInventoryBrands] =
        useState([]); // Holds the selected brands for each asset
    // Fetch inventory brands when materials array changes or material_id changes

    // Fetch inventory brands for materials
    useEffect(() => {
        materials.forEach((material, index) => {
            if (material.pms_inventory_id || material.id) {
                axios
                    .get(
                        `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((brand) => ({
                            value: brand.id,
                            label: brand.brand_name,
                        }));
                        setInventoryBrands((prevBrands) => {
                            const newBrands = [...prevBrands];
                            newBrands[index] = options; // Update brands for this specific material
                            return newBrands;
                        });
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching inventory brands for material:",
                            error
                        );
                    });
            }
        });
    }, [materials, baseURL]); // Runs when materials or baseURL changes

    // Fetch inventory brands for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.id) {
                axios
                    .get(
                        `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                    )
                    .then((response) => {
                        const options = response.data.map((brand) => ({
                            value: brand.id,
                            label: brand.brand_name,
                        }));
                        setAssetInventoryBrands((prevBrands) => {
                            const newBrands = [...prevBrands];
                            newBrands[index] = options; // Update brands for this specific asset
                            return newBrands;
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching inventory brands for asset:", error);
                    });
            }
        });
    }, [Assets, baseURL]); // Runs when assets or baseURL changes

    // Handler for brand selection change
    const handleBrandChange = (index, selectedOption) => {
        setSelectedInventoryBrands((prevSelectedBrands) => {
            const newSelectedBrands = [...prevSelectedBrands];
            newSelectedBrands[index] = selectedOption; // Update brand for the specific material
            return newSelectedBrands;
        });
    };

    const handleAssetInventoryBrandChange = (index, selectedOption) => {
        setSelectedAssetInventoryBrands((prevSelectedBrands) => {
            const newSelectedBrands = [...prevSelectedBrands];
            newSelectedBrands[index] = selectedOption; // Update brand for the specific asset
            return newSelectedBrands;
        });
    };

    // //payoad creation here

    // Initialize state for the inputs
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [boqQuantity, setBoqQuantity] = useState("");
    const [note, setNote] = useState("");

    const [coefficientFactors, setCoefficientFactors] = useState(
        materials.map(() => "")
    );
    const [estimatedQuantities, setEstimatedQuantities] = useState(
        materials.map(() => "")
    );
    const [wastages, setWastages] = useState(materials.map(() => ""));
    const [totalEstimatedQtyWastages, setTotalEstimatedQtyWastages] = useState(
        materials.map(() => "")
    );
    const [predefinedMaterialsData, setPredefinedMaterialsData] = useState([]);
    const [predefinedAssetsData, setPredefinedAssetsData] = useState([]);

    // console.log("parent comp predef2", predefinedMaterialsData)
    const updatePredefinedMaterialsData = (boqSubItemId, data) => {
        setBoqSubItems((prevItems) =>
            prevItems.map((item) =>
                item.id === boqSubItemId ? { ...item, materials: data } : item
            )
        );


    };

    // Function to update predefined assets for a specific BOQ row


    const updatePredefinedAssetsData = (boqSubItemId, data) => {
        setBoqSubItems((prevItems) =>
            prevItems.map((item) =>
                item.id === boqSubItemId ? { ...item, assets: data } : item
            )
        );
    };

    useEffect(() => {
        setBoqSubItems((prevItems) =>
            prevItems.map((item) => ({
                ...item,
                materials: Array.isArray(item.materials) ? item.materials : [], // Ensure materials is an array
                assets: Array.isArray(item.assets) ? item.assets : [], // Ensure assets is an array
            }))
        );
    }, []);



    const [materialsInputes, setMaterialsInputes] = useState([
        {
            coefficientFactor: "",
            estimatedQty: "",
            wastage: "",
            totalEstimatedQtyWastage: "",
        },
    ]);

    // console.log("material Input:", materialsInputes)

    // assets

    const [assetCoefficientFactors, setAssetCoefficientFactors] = useState(
        Assets.map(() => "")
    );
    const [assetEstimatedQuantities, setAssetEstimatedQuantities] = useState(
        Assets.map(() => "")
    );
    const [assetWastages, setAssetWastages] = useState(Assets.map(() => ""));
    const [assetTotalEstimatedQtyWastages, setAssetTotalEstimatedQtyWastages] =
        useState(Assets.map(() => ""));
    const [assetCostQTY, setAssetCostQTY] = useState(Assets.map(() => ""));

    // Calculate Asset Estimated Quantities
    const calculateAssetEstimatedQuantities = () => {
        if (boqQuantity && assetCoefficientFactors.length > 0) {
            const newAssetEstimatedQuantities = Assets.map((asset, index) => {
                const coefficient = parseFloat(assetCoefficientFactors[index]) || 0; // default to 1 if no coefficient is set
                return parseFloat(boqQuantity) * coefficient; // simple calculation for estimated quantities
            });
            setAssetEstimatedQuantities(newAssetEstimatedQuantities); // Update the asset estimated quantities
        }
    };

    // Calculate Asset Total Estimated Quantity with Wastages
    const calculateAssetTotalEstimatedQtyWastages = () => {
        if (boqQuantity && assetEstimatedQuantities.length > 0) {
            const newAssetTotalEstimatedQtyWastages = Assets.map((asset, index) => {
                const estimatedQty = parseFloat(assetEstimatedQuantities[index]) || 0;
                const wastagePercentage = parseFloat(assetWastages[index]) || 0;
                return estimatedQty * (1 + wastagePercentage / 100); // Adding wastage percentage
            });
            setAssetTotalEstimatedQtyWastages(newAssetTotalEstimatedQtyWastages); // Set the total quantities with wastage
        }
    };

    // Effect to recalculate asset quantities when dependencies change
    // useEffect(() => {
    //   calculateAssetEstimatedQuantities();
    //   calculateAssetTotalEstimatedQtyWastages();
    // }, [boqQuantity, assetCoefficientFactors, assetWastages]);

    const handleAssetCoefficientFactorChange = (index, value) => {
        const updatedAssetCoefficientFactors = [...assetCoefficientFactors];
        updatedAssetCoefficientFactors[index] = value;
        setAssetCoefficientFactors(updatedAssetCoefficientFactors);
    };

    const handleAssetEstimatedQtyChange = (index, value) => {
        const updatedAssetEstimatedQuantities = [...assetEstimatedQuantities];
        updatedAssetEstimatedQuantities[index] = value;
        setAssetEstimatedQuantities(updatedAssetEstimatedQuantities);
    };

    const [AssetwastageErrors, setAssetWastageErrors] = useState({});
    // const handleAssetWastageChange = (index, value) => {
    //   const updatedAssetWastages = [...assetWastages];
    //   updatedAssetWastages[index] = value;
    //   setAssetWastages(updatedAssetWastages);
    // };

    const handleAssetWastageChange = (index, value) => {
        if (value > 100) {
            setAssetWastageErrors((prev) => ({ ...prev, [index]: "Wastage cannot exceed 100%" }));
        } else {
            setAssetWastageErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[index]; // Remove error if valid
                return newErrors;
            });
        }

        const updatedAssetWastages = [...assetWastages];
        updatedAssetWastages[index] = value;
        setAssetWastages(updatedAssetWastages);
    };

    const handleAssetTotalEstimatedQtyWastageChange = (index, value) => {
        const updatedAssetTotalEstimatedQtyWastages = [
            ...assetTotalEstimatedQtyWastages,
        ];
        updatedAssetTotalEstimatedQtyWastages[index] = value;
        setAssetTotalEstimatedQtyWastages(updatedAssetTotalEstimatedQtyWastages);
    };

    const handleAssetCostQTY = (index, value) => {
        const updatedAssetCostQTY = [...assetCostQTY];
        updatedAssetCostQTY[index] = value;
        setAssetCostQTY(updatedAssetCostQTY);
    };
    const [localMaterialErrors, setLocalMaterialErrors] = useState({});
    const [localAssetErrors, setLocalAssetErrors] = useState({});

    // Example predefined materials data (replace with actual data from your source)
    const predefinedMaterials = [
        ...materials.map((material, index) => ({
            id: null,
            material_id: material.pms_inventory_id || material.id,
            material_sub_type_id: selectedSubTypes[index]
                ? selectedSubTypes[index].value
                : "",
            generic_info_id: selectedGenericSpecifications[index]
                ? selectedGenericSpecifications[index].value
                : "", // Safe access with fallback
            colour_id: selectedColors[index] ? selectedColors[index].value : "", // Safe access with fallback
            brand_id: selectedInventoryBrands[index]
                ? selectedInventoryBrands[index].value
                : "", // Safe access with fallback
            uom_id: selectedUnit2[index] ? selectedUnit2[index].value : "", // Safe access with optional chaining
            co_efficient_factor: parseFloat(coefficientFactors[index]) || 0,
            estimated_quantity: parseFloat(estimatedQuantities[index]) || 0,
            wastage: parseFloat(wastages[index]) || 0,
            estimated_quantity_wastage:
                parseFloat(totalEstimatedQtyWastages[index]) || 0,
        })),
        // {
        //     deleted: deletedMaterialIds, // Store deleted material IDs in a separate object
        // },
    ];



    // console.log("pre mtL...", predefinedMaterials)

    const predefinedAssets = Assets.map((asset, index) => ({
        material_id: asset.id,
        material_sub_type_id: selectedSubTypesAssets[index]
            ? selectedSubTypesAssets[index].value
            : "",
        generic_info_id: selectedAssetGenericSpecifications[index]
            ? selectedAssetGenericSpecifications[index].value
            : "",
        colour_id: selectedAssetColors[index] ? selectedAssetColors[index].value : "",
        brand_id: selectedAssetInventoryBrands[index]
            ? selectedAssetInventoryBrands[index].value
            : "",
        uom_id: selectedUnit3[index] ? selectedUnit3[index].value : "",
        co_efficient_factor: parseFloat(assetCoefficientFactors[index]) || 0,
        estimated_quantity: parseFloat(assetEstimatedQuantities[index]) || 0,
        wastage: parseFloat(assetWastages[index]) || 0,
        estimated_quantity_wastage:
            parseFloat(assetTotalEstimatedQtyWastages[index]) || 0,
        cost_qty: parseFloat(assetCostQTY[index]) || 0,
    }));



    const validateDuplicateAssets = useCallback(() => {
        const seenCombinations = new Map();
        let errors = {};

        predefinedAssets.forEach((asset, index) => {
            if (!asset.generic_info_id || !asset.colour_id || !asset.brand_id) {
                return;
            }

            const key = `${asset.material_id}-${asset.generic_info_id}-${asset.colour_id}-${asset.brand_id}`;

            if (seenCombinations.has(key)) {
                errors[index] = {
                    generic_info: "This combination already exists.",
                    colour: "This combination already exists.",
                    brand: "This combination already exists.",
                };
            } else {
                seenCombinations.set(key, true);
            }
        });

        // Only update state if errors have changed to prevent infinite re-renders
        setLocalAssetErrors((prevErrors) => {
            const hasChanged = JSON.stringify(prevErrors) !== JSON.stringify(errors);
            return hasChanged ? errors : prevErrors;
        });

        return Object.keys(errors).length === 0;
    }, [predefinedAssets]);

    // const validateDuplicateMaterials = useCallback(() => {
    //   const seenCombinations = new Map();
    //   let errors = {};

    //   predefinedMaterials.forEach((material, index) => {
    //     if (!material.generic_info_id || !material.colour_id || !material.brand_id) {
    //       return;
    //     }

    //     const key = `${material.material_id}-${material.generic_info_id}-${material.colour_id}-${material.brand_id}`;

    //     if (seenCombinations.has(key)) {
    //       errors[index] = {
    //         generic_info: "Duplicate Generic Info is not allowed.",
    //         colour: "Duplicate Colour is not allowed.",
    //         brand: "Duplicate Brand is not allowed.",
    //       };
    //     } else {
    //       seenCombinations.set(key, true);
    //     }
    //   });

    //   // Only update state if errors have changed
    //   setLocalMaterialErrors((prevErrors) => {
    //     const hasChanged = JSON.stringify(prevErrors) !== JSON.stringify(errors);
    //     return hasChanged ? errors : prevErrors;
    //   });

    //   return Object.keys(errors).length === 0;
    // }, [predefinedMaterials]);

    useEffect(() => {
        const validateDuplicateMaterials = () => {
            const seenCombinations = new Map();
            let errors = {};

            predefinedMaterials.forEach((material, index) => {
                if (!material.generic_info_id || !material.colour_id || !material.brand_id) {
                    return;
                }

                const key = `${material.material_id}-${material.generic_info_id}-${material.colour_id}-${material.brand_id}`;

                if (seenCombinations.has(key)) {
                    errors[index] = {
                        generic_info: "This combination already exists.",
                        colour: "This combination already exists.",
                        brand: "This combination already exists.",
                    };
                } else {
                    seenCombinations.set(key, true);
                }
            });

            // Only update state if errors have changed
            setLocalMaterialErrors((prevErrors) => {
                const hasChanged = JSON.stringify(prevErrors) !== JSON.stringify(errors);
                return hasChanged ? errors : prevErrors;
            });

            return Object.keys(errors).length === 0;
        };

        validateDuplicateMaterials();
    }, [predefinedMaterials]); // Runs whenever predefinedMaterials changes


    // useEffect(() => {
    //   validateDuplicateMaterials();
    // }, [validateDuplicateMaterials]);

    useEffect(() => {
        validateDuplicateAssets();
    }, [validateDuplicateAssets]);


    // console.log("asset data table", predefinedAssets);

    //boq sub item t data
    const [boqSubItems, setBoqSubItems] = useState([]);

    const handleInputChange2 = (index, field, value) => {
        const updatedBoq = [...boqSubItems];
        updatedBoq[index][field] = value;
        setBoqSubItems(updatedBoq);
    };

    // const handleInputChange2 = (index, field, value) => {
    //     setBoqSubItems((prevBoqSubItems) => {
    //         // Create a new array (immutability)
    //         const updatedBoq = [...prevBoqSubItems];

    //         // Create a new object for the specific subItem
    //         updatedBoq[index] = { ...updatedBoq[index], [field]: value };

    //         return updatedBoq;
    //     });
    // };
    // console.log("sub item name here :",boqSubItems)

    const handleUnitChangeForRow = (index, selectedOption, prevSelectedUnits) => {
        // Ensure to update the correct row's uom_id
        const updatedBoq = [...boqSubItems];
        updatedBoq[index].uom_id = selectedOption ? selectedOption.value : null; // If no selection, set to null
        setBoqSubItems(updatedBoq);
        // setSelectedUnit(selectedOption)
        setSelectedUnitSubRow((prevSelectedUnits) => {
            const newSelectedUnits = [...prevSelectedUnits];
            newSelectedUnits[index] = selectedOption; // Update UOM for the specific material
            return newSelectedUnits;
        });

        // Ensure to update the correct row's uom_id in boqSubItems
        //  const updatedBoq = [...boqSubItems];
        //  updatedBoq[index].uom_id = selectedOption ? selectedOption.value : null;  // If no selection, set to null
        //  setBoqSubItems(updatedBoq);

        // Update the selectedUnit array for the specific index
        //  const updatedSelectedUnit = [...selectedUnit];
        //  updatedSelectedUnit[index] = selectedOption ? selectedOption.value : null;
        //  setSelectedUnit(updatedSelectedUnit);
    };



    //   const addRowToTable1 = () => {
    //     setCounter((prevCounter) => {
    //       const newId = prevCounter + 1; // Ensures unique IDs
    //       console.log("New ID:", newId);

    //       // Update count state separately
    //       setcount((prevCount) => [...prevCount, { id: newId, value: "" }]);

    //       // Create a new BOQ sub-item row
    //       const newBoqSubItem = {
    //         id: newId,
    //         name: "",
    //         description: "",
    //         notes: "",
    //         remarks: "",
    //         cost_quantity: 0,
    //         uom_id: null,
    //         materials: [], // Fresh copy
    //         assets: [] // Fresh copy
    //       };

    //       // Merge existing items and new item
    //       setBoqSubItems((prevItems) => [...prevItems, newBoqSubItem]);

    //       return newId; // Ensures correct counter update
    //     });
    //   };



    // Modified addRowToTable1 function
    //   const addRowToTable1 = () => {
    //     setCounter((prevCounter) => {
    //       const newId = prevCounter + 1;

    //       // Create a new BOQ sub-item row with proper structure
    //       const newBoqSubItem = {
    //         id: newId,
    //         name: "",
    //         description: "",
    //         notes: "",
    //         remarks: "",
    //         cost_quantity: 0,
    //         uom_id: null,
    //         materials: [], // Initialize empty materials array
    //         assets: []    // Initialize empty assets array
    //       };

    //       // Update count state
    //       setcount((prevCount) => [...prevCount, { id: newId, value: "" }]);

    //       // Update boqSubItems state
    //       setBoqSubItems((prevItems) => [...prevItems, newBoqSubItem]);

    //       return newId;
    //     });
    //   };


    const addRowToTable1 = () => {
        // Generate a unique ID (using timestamp for better uniqueness)
        const newId = Date.now();

        // Create a new BOQ sub-item with proper structure
        const newBoqSubItem = {
            id: newId,
            name: "",
            description: "",
            notes: "",
            remarks: "",
            cost_quantity: 0,
            unit_of_measure_id: null,  // Changed from uom_id to match your API structure
            materials: [],
            assets: [],
            isNew: true  // Flag to identify newly added rows
        };

        // Update the boqSubItems state (single source of truth)
        setBoqSubItems(prevItems => [...prevItems, newBoqSubItem]);

        // If you still need counter for other purposes
        setcounter(prev => prev + 1);
    };



    const [selectedRows, setSelectedRows] = useState([]);

    // Modified deleteRowFromTable1 function
    //   const deleteRowFromTable1 = (id) => {
    //     // Remove from count state
    //     setcount((prevCount) => prevCount.filter((row) => row.id !== id));

    //     // Remove from boqSubItems state
    //     setBoqSubItems((prevItems) => prevItems.filter((item) => item.id !== id));

    //     // Decrement counter
    //     setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    //   };

    const deleteRowFromTable1 = () => {
        if (selectedRows.length === 0) {
            alert("Please select at least one row to delete");
            return;
        }

        // Remove from count state
        setcount(prevCount => prevCount.filter(row => !selectedRows.includes(row.id)));

        // Remove from boqSubItems state
        setBoqSubItems(prevItems => prevItems.filter(item => !selectedRows.includes(item.id)));

        // Clear selection
        setSelectedRows([]);

        // Update counter if needed
        setCounter(prev => Math.max(0, prev - selectedRows.length));
    };

    const payload = {
        boq_detail: {
            id: boqDetails?.id,
            item_name: boqDetails?.item_name,
            description: boqDetails?.description,
            quantity: boqDetails?.quantity,
            note: boqDetails?.note,
            unit_of_measure_id: selectedUnit ? selectedUnit.value : null,
            sub_categories: [
                {
                    id: lastCategory,
                    materials: predefinedMaterials
                }
            ]
        }
    }


    // console.log("boq data payload 1  edit:", payload)



    const payload2 = {
        boq_detail: {
            id: boqDetails?.id,
            item_name: boqDetails?.item_name,
            description: boqDetails?.description,
            quantity: boqDetails?.quantity,
            note: boqDetails?.note,
            unit_of_measure_id: selectedUnit ? selectedUnit.value : null,
            sub_categories: [
                {
                    id: lastCategory,
                    boq_sub_items: boqSubItems || []

                }
            ]
        }
    }


    // console.log("boq data payload 2 edit sub: ", payload2)
    // console.log("sub item boq needed:", boqSubItems)

    // console.log("predefine data 2", predefinedMaterialsData)
    // console.log("boq sub payload", payloadData2);

    // Handle input changes
    const handleInputChange = (field, value) => {
        if (field === "itemName") {
            setBoqDetails(prev => ({
                ...prev,
                item_name: value ? value : ""  // Ensure it's a number or empty string
            }));
            setItemName(value);
        } else if (field === "description") {
            setDescription(value);
            setBoqDetails(prev => ({
                ...prev,
                description: value ? value : ""  // Ensure it's a number or empty string
            }));
        } else if (field === "remark") {
            setRemark(value);
        }
        else if (field === "boqQuantity") {
            // Only allow non-negative values, including decimals (e.g., "0", "10", "10.5")
            if (value === "" || /^[+]?\d*\.?\d*$/.test(value)) {

                if (value === "" || /^[+]?\d*\.?\d*$/.test(value)) {
                    setBoqDetails(prev => ({
                        ...prev,
                        quantity: value ? parseFloat(value) : ""  // Ensure it's a number or empty string
                    }));
                    setBoqQuantity(value ? Number(value) : "");
                    calculateEstimatedQuantities(); // Recalculate estimated quantities on boqQuantity change
                    calculateTotalEstimatedQtyWastages();
                    calculateAssetEstimatedQuantities();
                    calculateAssetTotalEstimatedQtyWastages();
                }

                else {
                    setBoqQuantity(""); // Clear the value if it is negative
                }
            }

        } else if (field === "note") {
            setNote(value);
            setBoqDetails(prev => ({
                ...prev,
                note: value ? value : ""  // Ensure it's a number or empty string
            }));
        }
    };




    useEffect(() => {
        calculateEstimatedQuantities();
        calculateTotalEstimatedQtyWastages();
        calculateAssetEstimatedQuantities();
        calculateAssetTotalEstimatedQtyWastages();

    }, [
        boqQuantity,
        coefficientFactors,
        wastages,
        assetCoefficientFactors,
        assetWastages,
        estimatedQuantities
    ]); // Recalculate when boqQuantity or coefficientFactors change

    // useEffect(() => {

    // }, [boqQuantity, assetCoefficientFactors, assetWastages]);

    const handleCoefficientFactorChange = (index, value) => {
        const updatedCoefficientFactors = [...coefficientFactors];
        updatedCoefficientFactors[index] = value;
        setCoefficientFactors(updatedCoefficientFactors);
    };

    const handleEstimatedQtyChange = (index, value) => {
        const updatedEstimatedQuantities = [...estimatedQuantities];
        updatedEstimatedQuantities[index] = value;
        setEstimatedQuantities(updatedEstimatedQuantities);
    };

    //wastage

    const [wastageErrors, setWastageErrors] = useState({});

    // const handleWastageChange = (index, value) => {
    //   const updatedWastages = [...wastages];
    //   updatedWastages[index] = value;
    //   setWastages(updatedWastages);
    //   // calculateEstimatedQuantities(); // Recalculate estimated quantities when coefficient factor changes
    //   // calculateTotalEstimatedQtyWastages()
    // };


    const handleWastageChange = (index, value) => {
        if (value > 100) {
            setWastageErrors((prev) => ({ ...prev, [index]: "Wastage cannot exceed 100%." }));
        } else {
            setWastageErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[index]; // Remove error if valid
                return newErrors;
            });
        }

        const updatedWastages = [...wastages];
        updatedWastages[index] = value;
        setWastages(updatedWastages);
    };

    const handleTotalEstimatedQtyWastageChange = (index, value) => {
        const updatedTotalEstimatedQtyWastages = [...totalEstimatedQtyWastages];
        updatedTotalEstimatedQtyWastages[index] = value;
        setTotalEstimatedQtyWastages(updatedTotalEstimatedQtyWastages);
    };

    // Function to calculate estimated quantities based on boqQuantity and coefficientFactors
    const calculateEstimatedQuantities = () => {
        if (boqQuantity) {
            const newEstimatedQuantities = materials.map((material, index) => {
                const coefficient = coefficientFactors[index] || 0; // Default to 1 if no coefficient is set
                return parseFloat(boqQuantity) * parseFloat(coefficient); // Estimate quantity = boqQuantity * coefficient
            });
            setEstimatedQuantities(newEstimatedQuantities); // Set the calculated estimated quantities
        }
    };

    // Function to calculate total estimated quantities with wastage
    const [totalEstimatedvalidationErrors, setTotalEstimatedValidationErrors] = useState([]);
    const calculateTotalEstimatedQtyWastages = () => {
        if (boqQuantity && estimatedQuantities.length > 0 && wastages.length > 0) {
            const newTotalEstimatedQtyWastages = materials.map((material, index) => {
                const estimatedQty = parseFloat(estimatedQuantities[index]) || 0;
                const wastagePercentage = parseFloat(wastages[index]) || 0;
                // console.log("wastage", wastagePercentage)
                const totalWithWastage = estimatedQty * (1 + wastagePercentage / 100);

                const indentedQty = parseFloat(material.indented_qty) || 0;
                // console.log("indented qty",indentedQty)
                if (totalWithWastage < indentedQty) {
                    errors[index] = `Must be greater than or equal to ${indentedQty}.`;
                } else {
                    errors[index] = null;
                }
                return parseFloat(totalWithWastage.toFixed(4)); // Adding wastage percentage
            });
            setTotalEstimatedValidationErrors(errors);
            setTotalEstimatedQtyWastages(newTotalEstimatedQtyWastages); // Set the total quantities with wastage
        }
    };

    // console.log("errors valid estimate total", totalEstimatedvalidationErrors)

    const handleLevel5Change = (selectedOption) =>
        setSelectedSubCategoryLevel5(selectedOption);

    const subCategoriesMaterial = categories.map(cat => ({
        category_id: cat.category_id,
        level:cat.level,
        materials: cat.category_id === lastCategory ? (predefinedMaterials || []) : []
    }));

    const payloadData1 = {
        boq_detail: {
            project_id: boqDetails?.project_id,
            pms_site_id: boqDetails?.pms_site_id,
            pms_wing_id: boqDetails?.pms_wing_id,
            parent_id: boqDetails?.id,
            item_name: boqDetails?.item_name,
            description: boqDetails?.description,
            quantity: boqDetails?.quantity,
            note: boqDetails?.note,
            unit_of_measure_id: selectedUnit ? selectedUnit.value : boqDetails?.unit_of_measure_id,
            sub_categories: subCategoriesMaterial
        },
    };
    // console.log("Material payload creation:", payloadData1)

    const handleSubmitMaterialLabour = async () => {
        let validationErrors = {};

        // setErrors(newErrors);
        // if (!itemName) validationErrors.itemName = "Item Name is required.";
        if (!boqDetails?.item_name) validationErrors.itemName = "Item Name is required.";
        if (!boqDetails?.unit_of_measure_id) {
            if (!selectedUnit) validationErrors.unit = "UOM is required.";
        }

        if (!boqQuantity)
            validationErrors.boqQuantity = "BOQ Quantity is required.";

        // If predefinedMaterials is empty, show a toast error
        console.log(predefinedMaterials.length)
        if (predefinedMaterials.length === 1 && predefinedAssets.length === 0) {
            toast.error("Select at least one material or asset.");
            return; // Exit function if validation fails
        }

        const invalidCoefficient = materials.some((material, index) => {
            // Get the coefficient factor for this material
            const coefficientFactor = coefficientFactors[index];

            // Check if the coefficient factor is invalid (NaN or empty)
            return isNaN(parseFloat(coefficientFactor)) || coefficientFactor === "" || parseFloat(coefficientFactor) === 0;
        });

        // Validate coefficient factors for assets
        const invalidAssetCoefficient = Assets.some((asset, index) => {
            const coefficientFactor = assetCoefficientFactors[index]; // Assuming a similar array for assets
            return isNaN(parseFloat(coefficientFactor)) || coefficientFactor === "" || parseFloat(coefficientFactor) === 0;
        });

        // If any coefficient factor is invalid, show a toast and stop
        if (invalidCoefficient || invalidAssetCoefficient) {
            toast.error(
                "Co-efficient factor cannot be empty,zero or invalid for any material or asset."
            );
            return; // Exit function if validation fails
        }

        const invalidGenericSpecification = materials.some((material, index) => {
            // Get the selected generic specification for this material
            const genericSpecification = selectedGenericSpecifications[index];

            // Check if the generic specification is invalid (empty or undefined)
            return !genericSpecification || genericSpecification === "";
        });

        const invalidAssetGenericSpecification = Assets.some((asset, index) => {
            const genericSpecification = selectedGenericSpecifications[index]; // Assuming an array for assets' generic specifications
            return !genericSpecification || genericSpecification === "";
        });

        if (invalidGenericSpecification || invalidAssetGenericSpecification) {
            toast.error(
                "Generic Specification is required for all materials and assets."
            );
            return; // Exit function if validation fails
        }


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setLoading(true);
            try {
                // Prepare the payload data
                // setLoading(false);

                const payload = {
                    boq_detail: {
                        project_id: boqDetails?.project_id,
                        pms_site_id: boqDetails?.pms_site_id,
                        pms_wing_id: boqDetails?.pms_wing_id,
                        parent_id: boqDetails?.id,
                        item_name: boqDetails?.item_name,
                        description: boqDetails?.description,
                        quantity: boqDetails?.quantity,
                        note: boqDetails?.note,
                        unit_of_measure_id: selectedUnit ? selectedUnit.value : boqDetails?.unit_of_measure_id,
                        sub_categories: subCategoriesMaterial
                    },
                }
                // console.log("payload submission:", payload)
                // console.log("boq data payload 1 ", payloadData)

                const response = await axios.post(
                    // `${baseURL}boq_details/${boqDetails?.id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                    `${baseURL}boq_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                    payload
                );

                if (response.status === 200) {
                    alert("BOQ Amendment done successfully!");
                    // navigate(`/boq-details-page-master/${response.data.id}`); // Redirect to details page
                }

            } catch (error) {
                // Handle error if the request fails
                console.error("Error posting data:", error);
                toast.error("Something went wrong.", { position: "top-right" });
                // Optionally display an error message to the user
            } finally {
                setLoading(false);
            }
        }
    };


    // console.log("boq sub item submit>>>")
    // console.log("sub item: show", showBOQSubItem)

    // sub data 2
    const processedSubItems = boqSubItems.map(item => ({
        ...item,
        id: item.isNew ? null : item.id // Set ID to null for new items
    }));
    const subCategories = categories.map(cat => ({
        id: cat.id,
        boq_sub_items: cat.id === lastCategory ? (processedSubItems || []) : []
    }));

    const payloadData2 = {
        boq_detail: {
            project_id: boqDetails?.project_id,
            pms_site_id: boqDetails?.pms_site_id,
            pms_wing_id: boqDetails?.pms_wing_id,
            parent_id: boqDetails?.id,
            item_name: boqDetails?.item_name,
            description: boqDetails?.description,
            quantity: boqDetails?.quantity,
            note: boqDetails?.note,
            unit_of_measure_id: selectedUnit ? selectedUnit.value : boqDetails?.unit_of_measure_id,
            sub_categories: subCategories
        },
    };
    // console.log("sub payload creation:", payloadData2)

    // Handle submit for BOQ SubItem
    const handleSubmitBOQSubItem = async () => {
        // console.log("boq sub item>>>", boqSubItems)
        let validationErrors = {};

        if (!boqDetails?.item_name) validationErrors.itemName = "Item Name is required.";

        if (boqSubItems.length === 0) {
            toast.error("BoQ Sub Items cannot be empty. Please add at least one sub item.");
            return;
        }

        // // Check for validation errors in materials and assets
        // if (Object.keys(materialErrors).length > 0 || Object.keys(assetsErrors).length > 0) {
        //   toast.error("Please resolve duplicate materials or assets before submitting.");
        //   return;
        // }

        console.log("validation sub item:", boqSubItems)
        // Iterate over each boqSubItem to validate
        for (let i = 0; i < boqSubItems.length; i++) {
            const boqSubItem = boqSubItems[i];
            console.log("validation sub item:", boqSubItem)


            if (!boqSubItem.name || boqSubItem.name.trim() === "") {
                toast.error(`Name is required for BoQ Sub Item ${i + 1}.`);
                return;
            }

            if (boqSubItem.cost_quantity <= 0) {
                toast.error(`Cost quantity is required for BoQ Sub Item ${i + 1}.`);
                return;
            }

            if (boqSubItem.materials.length === 0 && boqSubItem.assets.length === 0) {
                toast.error(`At least one material or asset must be selected for BoQ Sub Item ${i + 1}.`);
                return;
            }


            let hasErrors = false; // Track global errors

            boqSubItems.forEach((boqSubItem, i) => {
                console.log("boq sub mt:", boqSubItem.materials);

                let subItemHasErrors = false; // Track errors for the current BoQ Sub Item

                boqSubItem.materials.forEach((material) => {
                    const coefficientFactor = material.co_efficient_factor ?? ""; // Ensure it's never undefined

                    if (isNaN(parseFloat(coefficientFactor)) || coefficientFactor === "" || parseFloat(coefficientFactor) === 0) {
                        subItemHasErrors = true; // Mark that there's an error for this sub-item
                    }
                });

                if (subItemHasErrors) {
                    hasErrors = true; // Mark that there are global errors
                    toast.error(`
      Co-efficient factor cannot be empty,zero or invalid for any materials in BoQ Sub Item ${i + 1}.`);
                }
            });

            // **Prevent form submission if any sub-item has errors**
            if (hasErrors) return;



            let hasErrors2 = false; // Track global errors

            boqSubItems.forEach((boqSubItem, i) => {
                console.log("boq sub mt:", boqSubItem.materials);

                let subItemHasErrors = false; // Track errors for the current BoQ Sub Item

                boqSubItem.materials.forEach((material) => {
                    const genericInfoId = material.generic_info_id ?? ""; // Ensure it's never undefined

                    if (!genericInfoId) {
                        subItemHasErrors = true; // Mark that there's an error for this sub-item
                    }
                });

                if (subItemHasErrors) {
                    hasErrors2 = true; // Mark that there are global errors
                    toast.error(`Generic Specification is required for all materials in BoQ Sub Item ${i + 1}.`);
                }
            });

            // **Prevent form submission if any sub-item has errors**
            if (hasErrors2) return;



        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setLoading(true);

            try {

                const payload2 = {
                    boq_detail: {
                        project_id: boqDetails?.project_id,
                        pms_site_id: boqDetails?.pms_site_id,
                        pms_wing_id: boqDetails?.pms_wing_id,
                        parent_id: boqDetails?.id,
                        item_name: boqDetails?.item_name,
                        description: boqDetails?.description,
                        quantity: boqDetails?.quantity,
                        note: boqDetails?.note,
                        unit_of_measure_id: selectedUnit ? selectedUnit.value : boqDetails?.unit_of_measure_id,
                        sub_categories: subCategories
                    },
                }

                console.log("payload submission edit sub item:", payload2)
                // console.log("boq data payload 1 ", payloadData)

                const response = await axios.patch(
                    `${baseURL}boq_details/${boqDetails?.id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                    payload2,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    alert("BOQ Sub Item Amendment done successfully!");
                    navigate(`/boq-details-page-master/${boqDetails?.id}`); // Redirect to details page
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error posting data:", error);
                // toast.error("Something went wrong.", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        }
    };


    // Handle general submit
    const handleSubmit = () => {
        console.log("sunbmit:")
        if (showMaterialLabour) {
            handleSubmitMaterialLabour();
        } else if (showBOQSubItem) {
            console.log("handle submit:", showBOQSubItem)
            handleSubmitBOQSubItem();
        } else {
            // console.log('No option selected');
            toast.error("Please select Material/Asset or BOQ Sub-Item.", {
                position: "top-right",
            });
        }
    };

    const [file, setFile] = useState(null);
    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // You can further process the file, e.g., upload it to a server
            console.log("Selected file:", selectedFile);
        }
    };

    // Trigger the file input click event when the SVG icon is clicked
    const handleIconClick = () => {
        document.getElementById("file-input").click();
    };


    useEffect(() => {
        if (boqDetails?.materials?.length > 0) {
            setMaterials(boqDetails.materials); // Store materials from boqDetails

            setSelectedSubTypes(boqDetails.materials.map(m => ({
                value: m.pms_inventory_sub_type_id,
                label: m.material_sub_type
            })));

            setSelectedGenericSpecifications(boqDetails.materials.map(m => ({
                value: m.pms_generic_info_id,
                label: m.generic_info
            })));

            setSelectedColors(boqDetails.materials.map(m => ({
                value: m.pms_colour_id,
                label: m.color
            })));

            setSelectedInventoryBrands(boqDetails.materials.map(m => ({
                value: m.pms_inventory_brand_id,
                label: m.brand
            })));

            setSelectedUnit2(boqDetails.materials.map(m => ({
                value: m.unit_of_measure_id,
                label: m.uom
            })));
            // ✅ Correct way to set coefficient factors
            setCoefficientFactors(boqDetails.materials.map(m => m.co_efficient_factor));
            setEstimatedQuantities(boqDetails.materials.map(m => m.estimated_quantity));
            setWastages(boqDetails.materials.map(m => m.wastage));
            setTotalEstimatedQtyWastages(boqDetails.materials.map(m => m.estimated_quantity_wastage));
        }

        // if (boqDetails?.unit_of_measure_id && unitOfMeasures.length > 0) {
        //     const preselectedUnit = unitOfMeasures.find(
        //         (unit) => unit.value === boqDetails.unit_of_measure_id
        //     );
        //     setSelectedUnit(preselectedUnit || null);
        // }
        setBoqQuantity(boqDetails?.quantity)

        // ✅ Handling assets in the same way
        if (boqDetails?.assets?.length > 0) {
            setAssets(boqDetails.assets); // Store assets from boqDetails

            setSelectedSubTypesAssets(boqDetails.assets.map(a => ({
                value: a.pms_inventory_sub_type_id,
                label: a.asset_sub_type
            })));

            setSelectedAssetGenericSpecifications(boqDetails.assets.map(a => ({
                value: a.pms_generic_info_id,
                label: a.generic_info
            })));

            setSelectedAssetColors(boqDetails.assets.map(a => ({
                value: a.pms_colour_id,
                label: a.color
            })));

            setSelectedAssetInventoryBrands(boqDetails.assets.map(a => ({
                value: a.pms_inventory_brand_id,
                label: a.brand
            })));

            setSelectedUnit3(boqDetails.assets.map(a => ({
                value: a.unit_of_measure_id,
                label: a.uom
            })));

            // ✅ Setting coefficient factors, estimated quantities, wastages, and total estimated qty for assets
            setAssetCoefficientFactors(boqDetails.assets.map(a => a.co_efficient_factor));
            setAssetEstimatedQuantities(boqDetails.assets.map(a => a.estimated_quantity));
            setAssetWastages(boqDetails.assets.map(a => a.wastage));
            setAssetTotalEstimatedQtyWastages(boqDetails.assets.map(a => a.estimated_quantity_wastage));
        }


        // sub item

        // if (boqDetails?.boq_sub_items?.length > 0) {
        //     const subItemMaterials = boqDetails.boq_sub_items.flatMap(subItem => subItem.materials || []);

        //     if (subItemMaterials.length > 0) {
        //         setMaterials2(subItemMaterials);

        //         setSelectedSubTypes(subItemMaterials.map(m => ({
        //             value: m.pms_inventory_sub_type_id,
        //             label: m.material_sub_type
        //         })));

        //         setSelectedGenericSpecifications(subItemMaterials.map(m => ({
        //             value: m.pms_generic_info_id,
        //             label: m.generic_info
        //         })));

        //         setSelectedColors(subItemMaterials.map(m => ({
        //             value: m.pms_colour_id,
        //             label: m.color
        //         })));

        //         setSelectedInventoryBrands(subItemMaterials.map(m => ({
        //             value: m.pms_inventory_brand_id,
        //             label: m.brand
        //         })));

        //         setSelectedUnit2(subItemMaterials.map(m => ({
        //             value: m.unit_of_measure_id,
        //             label: m.uom
        //         })));

        //         setCoefficientFactors(subItemMaterials.map(m => m.co_efficient_factor));
        //         setEstimatedQuantities(subItemMaterials.map(m => m.estimated_quantity));
        //         setWastages(subItemMaterials.map(m => m.wastage));
        //         setTotalEstimatedQtyWastages(subItemMaterials.map(m => m.estimated_quantity_wastage));
        //     }
        // }



        // if (boqDetails?.boq_sub_items?.length > 0) {
        //     const subItemMaterials = boqDetails.boq_sub_items.flatMap(subItem =>
        //         (subItem.materials || []).map(material => ({
        //             ...material,
        //             boqSubItemId: subItem.id // Attach subItem.id to each material
        //         }))
        //     );

        //     if (subItemMaterials.length > 0) {
        //         setMaterials(subItemMaterials);

        //         setSelectedSubTypes(subItemMaterials.map(m => ({
        //             value: m.pms_inventory_sub_type_id,
        //             label: m.material_sub_type
        //         })));

        //         setSelectedGenericSpecifications(subItemMaterials.map(m => ({
        //             value: m.pms_generic_info_id,
        //             label: m.generic_info
        //         })));

        //         setSelectedColors(subItemMaterials.map(m => ({
        //             value: m.pms_colour_id,
        //             label: m.color
        //         })));

        //         setSelectedInventoryBrands(subItemMaterials.map(m => ({
        //             value: m.pms_inventory_brand_id,
        //             label: m.brand
        //         })));

        //         setSelectedUnit2(subItemMaterials.map(m => ({
        //             value: m.unit_of_measure_id,
        //             label: m.uom
        //         })));

        //         setCoefficientFactors(subItemMaterials.map(m => m.co_efficient_factor));
        //         setEstimatedQuantities(subItemMaterials.map(m => m.estimated_quantity));
        //         setWastages(subItemMaterials.map(m => m.wastage));
        //         setTotalEstimatedQtyWastages(subItemMaterials.map(m => m.estimated_quantity_wastage));
        //     }
        // }


    }, [boqDetails, unitOfMeasures]); // Runs when boqDetails updates

    const handleDeleteAllMaterial = () => {
        setMaterials((prev) => {
            // Clone the previous state to avoid mutation
            const newMaterials = { ...prev };

            // Only process the current boqSubItemId
            if (newMaterials[boqSubItemId]) {
                newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) =>
                    !selectedMaterials.some(
                        selected =>
                            selected.materialId === material.id &&
                            selected.rowIndex === index &&
                            selected.boqSubItemId === boqSubItemId
                    )
                );
            }

            // console.log("Updated materials:", newMaterials);
            return newMaterials;
        });

        // Update dependent states with boqSubItemId-aware cleanup
        const updateSelection = (selectionArray = []) =>
            selectedMaterials
                .filter(selected => selected.boqSubItemId === boqSubItemId)
                .reduce((acc, selected) => {
                    const indexToRemove = selected.rowIndex;
                    if (indexToRemove >= 0 && indexToRemove < acc.length) {
                        acc.splice(indexToRemove, 1);
                    }
                    return acc;
                }, [...selectionArray]);

        // Update all dependent states
        setSelectedSubTypes(prev => updateSelection(prev));
        setSelectedColors(prev => updateSelection(prev));
        setSelectedInventoryBrands(prev => updateSelection(prev));
        setSelectedUnit2(prev => updateSelection(prev));
        setCoefficientFactors(prev => updateSelection(prev));
        setEstimatedQuantities(prev => updateSelection(prev));
        setWastages(prev => updateSelection(prev));
        setTotalEstimatedQtyWastages(prev => updateSelection(prev));
        setSelectedGenericSpecifications(prev => updateSelection(prev));

        // Clean up selected materials for this boqSubItemId
        setSelectedMaterials(prev =>
            prev.filter(selected =>
                !prev.some(s =>
                    s.boqSubItemId === boqSubItemId &&
                    ![boqSubItemId]?.some(
                        (material, index) =>
                            material.id === s.materialId &&
                            index === s.rowIndex
                    )
                )
            )
        );
    };

    return (
        <>
            <div className="website-content">
                <div className="module-data-section p-4">
                    <a href="" style={{ color: "black" }}>
                        Home &gt; Engineering &gt; Create BOQ
                    </a>
                    {/* <h5 className="mt-4">Create BOQ</h5> */}
                    <div className="tab-content1 active" id="total-content">
                        <ToastContainer />
                        {/* Total Content Here */}

                        <div className="card mt-5 pb-4">

                            <CollapsibleCard title="BOQ Edit">
                                <div
                                    className="card-body mt-0 pt-0"
                                    style={{ display: "block" }}
                                >
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>BOQ ID</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    disabled
                                                    value={boqDetails?.id}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Project <span>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={boqDetails?.project}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Sub-Project</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    value={boqDetails?.sub_project}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Wing</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    value={boqDetails?.wing}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>Main Category <span>*</span></label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    value={groupedCategories?.[1]?.[0]?.category_name || ''} // Safe access
                                                    //   value={groupedCategories[1] && groupedCategories[1]?.length > 0 ? groupedCategories[1][0]?.category_name : ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Lvl 2</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    value={groupedCategories?.[2]?.[0]?.category_name || ''} // Safe access
                                                    //   value={groupedCategories[2] && groupedCategories[2].length > 0 ? groupedCategories[2][0].category_name : ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Lvl 3</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    // placeholder='56914'
                                                    value={groupedCategories?.[3]?.[0]?.category_name || ''} // Safe access
                                                    //   value={groupedCategories[3] && groupedCategories[3].length > 0 ? groupedCategories[3][0].category_name : ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Lvl 4</label>


                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={groupedCategories?.[4]?.[0]?.category_name || ''} // Safe access
                                                    //   value={groupedCategories[4] && groupedCategories[4].length > 0 ? groupedCategories[4][0].category_name : ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>Sub-Lvl 5</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={groupedCategories?.[5]?.[0]?.category_name || ''} // Safe access
                                                    //   value={groupedCategories[5] && groupedCategories[5].length > 0 ? groupedCategories[5][0].category_name : ''}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>BOQ Item Name <span>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder=""
                                                    fdprocessedid="qv9ju9"
                                                    value={boqDetails?.item_name}
                                                    onChange={(e) =>
                                                        handleInputChange("itemName", e.target.value)
                                                    }
                                                    disabled
                                                />
                                                {errors.itemName && (
                                                    <div className="error-message">{errors.itemName}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>BOQ Description</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    placeholder="Enter ..."
                                                    defaultValue={""}
                                                    value={boqDetails?.description || ""}

                                                    onChange={(e) =>
                                                        handleInputChange("description", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>UOM <span>*</span></label>
                                                <SingleSelector
                                                    options={unitOfMeasures} // Providing the options to the select component
                                                    onChange={handleUnitChange} // Setting the handler when an option is selected
                                                    // value={selectedUnit} // Setting the selected value
                                                    value={(boqDetails?.
                                                        unit_of_measure_id
                                                        ?
                                                        unitOfMeasures.find(uom => uom.value === boqDetails?.
                                                            unit_of_measure_id
                                                        ) :
                                                        null) || selectedUnit
                                                    }
                                                    placeholder={`Select UOM`} // Dynamic placeholder
                                                    isDisabled={showBOQSubItem}
                                                />
                                                {errors.unit && (
                                                    <div className="error-message">{errors.unit}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-3 mt-2">
                                            <div className="form-group">
                                                <label>BOQ Qty (Cost) <span>*</span></label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder=""
                                                    fdprocessedid="qv9ju9"
                                                    value={boqDetails?.quantity}
                                                    onChange={(e) =>
                                                        handleInputChange("boqQuantity", e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "-" ||
                                                            e.key === "e" ||
                                                            e.key === "E"
                                                        ) {
                                                            e.preventDefault(); // Prevent entering "-" or "e" or "E"
                                                        }
                                                    }}
                                                    disabled
                                                    min="0"
                                                />
                                                {errors.boqQuantity && (
                                                    <div className="error-message">
                                                        {errors.boqQuantity}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-6 mt-2">
                                            <div className="form-group">
                                                <label>Notes</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    placeholder="Enter ..."
                                                    defaultValue={""}
                                                    value={boqDetails?.note}
                                                    onChange={(e) =>
                                                        handleInputChange("note", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {/* <div className="col-md-6 mt-2">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          // placeholder="Enter remark..."
                          value={remark} // Controlled input
                          onChange={(e) => handleInputChange("remark", e.target.value)}
                        />
                      </div>
                    </div> */}

                                        <div className="row mt-2">
                                            {/* Checkboxes */}
                                            {/* <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check me-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox1"
                            onChange={handleCheckboxChange}
                            checked={showMaterialLabour}
                          />
                          <label
                          // className="form-check-label" htmlFor="checkbox1"
                          >
                            Add Material/Assests
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox2"
                            onChange={handleCheckboxChange}
                            checked={showBOQSubItem}
                          />
                          <label
                          // className="form-check-label" htmlFor="checkbox2"
                          >
                            Add BOQ Sub-Item
                          </label>
                        </div>
                      </div> */}
                                        </div>

                                    </div>


                                </div>

                            </CollapsibleCard>


                            {showMaterialLabour && (
                                <>
                                    <CollapsibleCard title="Material">
                                        <div className="card mx-3 mt-2">
                                            <div className="card-body mt-0 pt-0">
                                                <div className=" my-4">
                                                    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                                                        {/* predefinedMaterials

                          <h1>predefinedMaterialsData</h1>*/}


                                                        {/* <pre>{JSON.stringify(localMaterialErrors, null, 2)}</pre> */}


                                                        <table
                                                            className="tbl-container"
                                                            style={{ borderCollapse: "collapse" }}
                                                        >
                                                            {/* <thead>
                                <tr>
                                  <th style={{ width: "300px" }} rowSpan={2}>
                                    <div className="d-flex justify-content-center">
                                      <input
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedMaterials(materials.map((m) => m.id)); // Select all
                                          } else {
                                            setSelectedMaterials([]); // Deselect all
                                          }
                                        }}
                                        checked={selectedMaterials.length === materials.length}
                                      />
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={14}
                                        height={14}
                                        fill="currentColor"
                                        className="bi bi-trash3-fill ms-2"
                                        viewBox="0 0 16 16"
                                        onClick={handleDeleteAll} // Delete selected rows on click
                                      >
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                      </svg>
                                    </div>
                                  </th>
                                  {[
                                    "Material Type",
                                    "Material",
                                    "Material Sub-Type",
                                    "Generic Specification",
                                    "Colour",
                                    "Brand",
                                    "UOM",
                                    "Cost",
                                    "Wastage%",
                                    "Total Estimated Quantity Wastage",
                                  ].map((heading, index) => (
                                    <th key={index} style={{ width: "300px", whiteSpace: "nowrap" }}>
                                      {heading}
                                    </th>
                                  ))}
                                </tr>
                              </thead> */}

                                                            <thead>
                                                                <tr >
                                                                    <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>
                                                                        <div className="d-flex justify-content-start">
                                                                            {/* <input
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedMaterials(materials.map((m) => m.id)); // Select all
                                          } else {
                                            setSelectedMaterials([]); // Deselect all
                                          }
                                        }}
                                        checked={selectedMaterials.length === materials.length}
                                      /> */}

                                                                            <input
                                                                                type="checkbox"
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setSelectedMaterials(materials.map((_, index) => index)); // Select all using indexes
                                                                                    } else {
                                                                                        setSelectedMaterials([]); // Deselect all
                                                                                    }
                                                                                }}
                                                                                checked={selectedMaterials.length === materials.length && materials.length > 0}
                                                                            />
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width={14}
                                                                                height={14}
                                                                                fill="currentColor"
                                                                                className="bi bi-trash3-fill ms-2"
                                                                                viewBox="0 0 16 16"
                                                                                onClick={handleDeleteAll} // Delete selected rows on click
                                                                            >
                                                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                                            </svg>
                                                                        </div>
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material Type</th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material</th>
                                                                    <th rowSpan={2} style={{ width: "300px", whiteSpace: "nowrap" }}>Material Sub-Type</th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Generic Specification <span>*</span></th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Colour </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Brand </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>UOM</th>
                                                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                    <th className="text-center" colSpan={2}>Cost</th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Wastage%</th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Total Estimated Qty Wastage</th>
                                                                </tr>
                                                                <tr>
                                                                    <th style={{ width: "200px", whiteSpace: "nowrap" }}>Co-Efficient Factor <span>*</span></th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Estimated Qty</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {materials.length > 0 ? (
                                                                    materials.map((material, index) => (
                                                                        <tr key={`${material.id}-${index}`}>
                                                                            <td style={{ width: "100px" }}>
                                                                                {/* <input
                                          className="ms-5"
                                          type="checkbox"
                                          checked={selectedMaterials.includes(material.id)}
                                          onChange={() => handleSelectRow(material.id)}
                                        /> */}

                                                                                <input
                                                                                    className="ms-5"
                                                                                    type="checkbox"
                                                                                    checked={selectedMaterials.includes(index)} // Use index instead of material.id
                                                                                    onChange={() => handleSelectRow(index)} // Pass index to function
                                                                                    disabled={material.can_delete === false}
                                                                                />
                                                                                {/* {console.log("delete possible or not:",material.can_delete)} */}
                                                                            </td>

                                                                            <td style={{ width: "200px" }}>{material.material_type || material.inventory_type_name}</td>
                                                                            <td style={{ width: "200px" }}>{material.material_name || material.name}</td>
                                                                            <td style={{ width: "300px" }}>
                                                                                <SingleSelector
                                                                                    options={inventorySubTypes[index] || []}
                                                                                    onChange={(selectedOption) =>
                                                                                        handleSubTypeChange(index, selectedOption)
                                                                                    }
                                                                                    value={selectedSubTypes[index]}
                                                                                    placeholder={`Select Sub-Type`}
                                                                                    isDisabled={material?.hasOwnProperty('can_delete')}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "300px" }}>
                                                                                <SingleSelector
                                                                                    options={Array.isArray(genericSpecifications[index]) ? genericSpecifications[index] : []}
                                                                                    onChange={(selectedOption) =>
                                                                                        handleGenericSpecificationChange(index, selectedOption)
                                                                                    }
                                                                                    value={selectedGenericSpecifications[index]}
                                                                                    placeholder={`Select Specification`}
                                                                                    isDisabled={material?.hasOwnProperty('can_delete')}
                                                                                />
                                                                                {localMaterialErrors[index]?.generic_info && (
                                                                                    <p style={{ color: "red" }}>{localMaterialErrors[index].generic_info}</p>
                                                                                )}
                                                                            </td>

                                                                            <td style={{ width: "300px" }}>
                                                                                <SingleSelector
                                                                                    options={colors[index] || []}
                                                                                    onChange={(selectedOption) =>
                                                                                        handleColorChange(index, selectedOption)
                                                                                    }
                                                                                    value={selectedColors[index]}
                                                                                    placeholder={`Select Colour`}
                                                                                    isDisabled={material?.hasOwnProperty('can_delete')}
                                                                                />
                                                                                {localMaterialErrors[index]?.colour && (
                                                                                    <p style={{ color: "red" }}>{localMaterialErrors[index].colour}</p>
                                                                                )}
                                                                            </td>

                                                                            <td style={{ width: "300px" }}>
                                                                                <SingleSelector
                                                                                    options={inventoryBrands[index] || []}
                                                                                    onChange={(selectedOption) =>
                                                                                        handleBrandChange(index, selectedOption)
                                                                                    }
                                                                                    value={selectedInventoryBrands[index]}
                                                                                    placeholder={`Select Brand`}
                                                                                    isDisabled={material?.hasOwnProperty('can_delete')}
                                                                                />
                                                                                {localMaterialErrors[index]?.brand && (
                                                                                    <p style={{ color: "red" }}>{localMaterialErrors[index].brand}</p>
                                                                                )}
                                                                            </td>

                                                                            <td style={{ width: "200px" }}>
                                                                                <SingleSelector
                                                                                    options={unitOfMeasures}
                                                                                    onChange={(selectedOption) =>
                                                                                        handleUnitChange2(index, selectedOption)
                                                                                    }
                                                                                    value={selectedUnit2[index]}
                                                                                    placeholder={`Select UOM`}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "200px" }}>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Please Enter co-efficient Factor"
                                                                                    value={coefficientFactors[index] || ""}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }}
                                                                                    min="0"
                                                                                    onChange={(e) =>
                                                                                        handleCoefficientFactorChange(index, e.target.value)
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "200px" }}>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Estimated Quantity"
                                                                                    disabled
                                                                                    value={estimatedQuantities[index] || ""}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: "200px" }}>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Please Enter wastage"
                                                                                    value={wastages[index] || ""}
                                                                                    onChange={(e) => handleWastageChange(index, e.target.value)}
                                                                                />

                                                                                {wastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{wastageErrors[index]}</p>}
                                                                            </td>
                                                                            <td style={{ width: "250px" }}>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Total Estimated Qty Wastage"
                                                                                    disabled
                                                                                    value={totalEstimatedQtyWastages[index] || ""}
                                                                                />
                                                                                {totalEstimatedvalidationErrors[index] && (
                                                                                    <span style={{ color: "red", fontSize: "12px" }}>{totalEstimatedvalidationErrors[index]}</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="12" className="text-center">
                                                                            No materials added yet.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>

                                                <div>
                                                    <button
                                                        style={{ color: "var(--red)" }}
                                                        className="fw-bold text-decoration-underline border-0 bg-white ms-3"
                                                        // onclick="myCreateFunction('table1')"
                                                        onClick={handleOpenModal}
                                                    >
                                                        Add Material
                                                    </button>{" "}
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleCard>
                                    <MaterialModal
                                        show={showModal}
                                        handleClose={handleCloseModal}
                                        handleAdd={handleAddMaterials}
                                    />

                                    {/* //assets */}
                                    <CollapsibleCard title="Assests">
                                        <div className="card mx-3 mt-2">
                                            <div className="card-body mt-0 pt-0">
                                                <div className=" my-4">
                                                    <div style={{ overflowX: "auto", maxWidth: "100%" }}>

                                                        <table
                                                            className="tbl-container"
                                                            style={{ borderCollapse: "collapse" }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>
                                                                        <div className="d-flex justify-content-start">
                                                                            {/* <input
                                        className=""
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedAssets(
                                              Assets.map((a) => a.id)
                                            ); // Select all
                                          } else {
                                            setSelectedAssets([]); // Deselect all
                                          }
                                        }}
                                        checked={
                                          selectedAssets.length === Assets.length
                                        }
                                      /> */}

                                                                            <input
                                                                                className=""
                                                                                type="checkbox"
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setSelectedAssets(Assets.map((_, index) => index)); // Select all using indexes
                                                                                    } else {
                                                                                        setSelectedAssets([]); // Deselect all
                                                                                    }
                                                                                }}
                                                                                checked={selectedAssets.length === Assets.length && Assets.length > 0}
                                                                            />

                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width={14}
                                                                                height={14}
                                                                                fill="currentColor"
                                                                                className="bi bi-trash3-fill ms-2"
                                                                                viewBox="0 0 16 16"
                                                                                onClick={handleDeleteAllAssets}
                                                                            >
                                                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                                            </svg>
                                                                        </div>
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Assest Type
                                                                    </th>

                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Assest
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "300px", whiteSpace: "nowrap" }}>
                                                                        Assest Sub-Type
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "300px", whiteSpace: "nowrap" }}>
                                                                        Generic Specification <span>*</span>
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "300px", whiteSpace: "nowrap" }}>
                                                                        Colour
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "300px", whiteSpace: "nowrap" }}>
                                                                        Brand
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        UOM
                                                                    </th>
                                                                    <th className="text-center" colSpan={2}>
                                                                        Cost
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Wastage%
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Total Estimated Quantity Wastage
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Co-efficient Factor <span>*</span>
                                                                    </th>
                                                                    <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                        Estimated Qty
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Assets.length > 0 ? (
                                                                    Assets.map((assets, index) => (
                                                                        <tr>
                                                                            <td>
                                                                                {/* <input
                                          className="ms-5"
                                          type="checkbox"
                                          checked={selectedAssets.includes(
                                            assets.id
                                          )} // Check if material is selected
                                          onChange={() =>
                                            handleSelectRowAssets(assets.id)
                                          } // Toggle selection
                                        /> */}

                                                                                <input
                                                                                    key={index}
                                                                                    className="ms-5"
                                                                                    type="checkbox"
                                                                                    checked={selectedAssets.includes(index)} // Use index instead of asset.id
                                                                                    onChange={() => handleSelectRowAssets(index)} // Pass index instead of asset.id
                                                                                    disabled={assets.can_delete === false}
                                                                                />
                                                                            </td>

                                                                            <td>{assets.material_type || assets.inventory_type_name}</td>
                                                                            <td>{assets.material_name || assets.name}</td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={assetSubTypes[index] || []} // Get the sub-types for the specific material
                                                                                    onChange={(selectedOption) =>
                                                                                        handleSubTypeChangeAssets(
                                                                                            index,
                                                                                            selectedOption
                                                                                        )
                                                                                    }
                                                                                    value={selectedSubTypesAssets[index]} // Display the selected sub-type for this material
                                                                                    placeholder={`Select Sub-Type`} // Dynamic placeholder
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={
                                                                                        assetGenericSpecifications[index] ||
                                                                                        []
                                                                                    } // Get the generic specifications for the specific material
                                                                                    onChange={(selectedOption) =>
                                                                                        handleGenericSpecificationChangeForAsset(
                                                                                            index,
                                                                                            selectedOption
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        selectedAssetGenericSpecifications[
                                                                                        index
                                                                                        ]
                                                                                    } // Display the selected generic specification for this material
                                                                                    placeholder={`Select  Specification`} // Dynamic placeholder
                                                                                />
                                                                                {localAssetErrors[index]?.generic_info && (
                                                                                    <p style={{ color: "red" }}>{localAssetErrors[index].generic_info}</p>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={assetColors[index] || []} // Get the colors for the specific material
                                                                                    onChange={(selectedOption) =>
                                                                                        handleAssetColorChange(
                                                                                            index,
                                                                                            selectedOption
                                                                                        )
                                                                                    }
                                                                                    value={selectedAssetColors[index]} // Display the selected color for this material
                                                                                    placeholder={`Select Colour`} // Dynamic placeholder
                                                                                />
                                                                                {localAssetErrors[index]?.color && (
                                                                                    <p style={{ color: "red" }}>{localAssetErrors[index].color}</p>
                                                                                )}

                                                                            </td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={
                                                                                        assetInventoryBrands[index] || []
                                                                                    } // Get the brands for the specific material
                                                                                    onChange={(selectedOption) =>
                                                                                        handleAssetInventoryBrandChange(
                                                                                            index,
                                                                                            selectedOption
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        selectedAssetInventoryBrands[index]
                                                                                    } // Display the selected brand for this material
                                                                                    placeholder={`Select Brand`} // Dynamic placeholder
                                                                                />
                                                                                {localAssetErrors[index]?.brand && (
                                                                                    <p style={{ color: "red" }}>{localAssetErrors[index].brand}</p>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <SingleSelector
                                                                                    options={unitOfMeasures} // Providing the options to the select component
                                                                                    onChange={(selectedOption) =>
                                                                                        handleUnitChange3(
                                                                                            index,
                                                                                            selectedOption
                                                                                        )
                                                                                    } // Setting the handler when an option is selected
                                                                                    value={selectedUnit3[index]}
                                                                                    placeholder={`Select UOM`} // Dynamic placeholder
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Please Enter Co-efficient Factor"
                                                                                    value={
                                                                                        assetCoefficientFactors[index] || ""
                                                                                    }
                                                                                    onKeyDown={(e) => {
                                                                                        if (
                                                                                            e.key === "-" ||
                                                                                            e.key === "e" ||
                                                                                            e.key === "E"
                                                                                        ) {
                                                                                            e.preventDefault(); // Prevent entering "-" or "e" or "E"
                                                                                        }
                                                                                    }}
                                                                                    min="0"
                                                                                    onChange={(e) =>
                                                                                        handleAssetCoefficientFactorChange(
                                                                                            index,
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="number"
                                                                                    placeholder="Estimated Qty"
                                                                                    disabled
                                                                                    value={
                                                                                        assetEstimatedQuantities[index] || ""
                                                                                    }
                                                                                // onChange={(e) => handleAssetEstimatedQtyChange(index, e.target.value)}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    placeholder="Please Enter Wastage"
                                                                                    value={assetWastages[index] || ""}
                                                                                    onChange={(e) =>
                                                                                        handleAssetWastageChange(
                                                                                            index,
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                                {AssetwastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{AssetwastageErrors[index]}</p>}
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    placeholder="Total Estimated Qty"
                                                                                    disabled
                                                                                    value={
                                                                                        assetTotalEstimatedQtyWastages[
                                                                                        index
                                                                                        ] || ""
                                                                                    }
                                                                                // onChange={(e) => handleAssetTotalEstimatedQtyWastageChange(index, e.target.value)}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td
                                                                            colSpan="12"
                                                                            className="text-center"
                                                                        // style={{ paddingLeft: "500px" }}
                                                                        >
                                                                            No asset added yet.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        style={{ color: "var(--red)" }}
                                                        className="fw-bold text-decoration-underline border-0 bg-white ms-3"
                                                        onClick={handleOpenModalAsset}
                                                    >
                                                        Add Asset
                                                    </button>{" "}
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleCard>

                                    <AssetModal
                                        showAssets={showModalAsset}
                                        handleCloseAssets={handleCloseModalAsset}
                                        handleAdd={handleAddAssets}
                                    />
                                </>
                            )}

                            {showBOQSubItem && (
                                <>

                                    {/* <pre>{JSON.stringify(boqSubItems, null, 2)}</pre> */}

                                    {/* <pre>{JSON.stringify(materials2, null, 2)}</pre> */}

                                    <CollapsibleCard title="BOQ Sub-Item">
                                        <div className="card mx-3 mt-2">
                                            <div className="card-body mt-0 pt-0">
                                                <div className="mt-3">
                                                    <div className="my-4">
                                                        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                                                            <table className="tbl-container" style={{ borderCollapse: "collapse" }}>
                                                                <thead style={{ zIndex: "1" }}>
                                                                    <tr>
                                                                        <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>
                                                                            {/* <input type="checkbox" /> */}
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedRows.length === boqSubItems.length + count.length}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        // Select all rows (both existing and new)
                                                                                        const allRowIds = [
                                                                                            ...boqSubItems.map(item => item.id),
                                                                                            ...count.map(item => item.id)
                                                                                        ];
                                                                                        setSelectedRows(allRowIds);
                                                                                    } else {
                                                                                        setSelectedRows([]);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </th>
                                                                        <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>Expand</th>
                                                                        <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>
                                                                            Sub Item Name <span>*</span>
                                                                        </th>
                                                                        <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>Description</th>
                                                                        <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>Notes</th>
                                                                        <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>Remarks</th>
                                                                        <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>UOM</th>
                                                                        <th colSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>Cost Quantity <span>*</span></th>
                                                                        {/* <th rowSpan={2} style={{ width: "500px", whiteSpace: "nowrap" }}>Document</th> */}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* Render existing BOQ sub-items from API */}
                                                                    {boqSubItems.map((subItem, index) => (
                                                                        <React.Fragment key={subItem.id}>
                                                                            <tr>
                                                                                <td>
                                                                                    {/* <input type="checkbox" /> */}
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={selectedRows.includes(subItem.id)}
                                                                                        onChange={(e) => {
                                                                                            if (e.target.checked) {
                                                                                                setSelectedRows(prev => [...prev, subItem.id]);
                                                                                            } else {
                                                                                                setSelectedRows(prev => prev.filter(id => id !== subItem.id));
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td className="text-center">
                                                                                    <button
                                                                                        className="btn btn-link p-0"
                                                                                        onClick={() => toggleRow(subItem.id)}
                                                                                        aria-label="Toggle row visibility"
                                                                                    >
                                                                                        {expandedRows.includes(subItem.id) ? (
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="24"
                                                                                                height="24"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="black"
                                                                                                strokeWidth="1"
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                fill=" #e0e0e0"
                                                                                            >
                                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                            </svg>
                                                                                        ) : (
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="24"
                                                                                                height="24"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="black"
                                                                                                strokeWidth="1"
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                fill=" #e0e0e0"
                                                                                            >
                                                                                                <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                                                            </svg>
                                                                                        )}
                                                                                    </button>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Enter Sub Item Name"
                                                                                        value={subItem.name || ''}
                                                                                        onChange={(e) =>
                                                                                            handleInputChange2(
                                                                                                index,
                                                                                                "name",
                                                                                                e.target.value
                                                                                            )
                                                                                        }

                                                                                        disabled={!subItem.hasOwnProperty('isNew')}
                                                                                    // disabled={subItem.cost_quantity}
                                                                                    />

                                                                                </td>
                                                                                {console.log("subitem", subItem)}
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Enter Description"
                                                                                        className="form-control"
                                                                                        value={subItem.description || ''}
                                                                                        onChange={(e) =>
                                                                                            handleInputChange2(
                                                                                                index,
                                                                                                "description",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Enter Notes"
                                                                                        className="form-control"
                                                                                        value={subItem.notes || ''}
                                                                                        onChange={(e) =>
                                                                                            handleInputChange2(
                                                                                                index,
                                                                                                "notes",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Enter Remark"
                                                                                        value={subItem.remarks || ''}
                                                                                        className="form-control"
                                                                                        onChange={(e) =>
                                                                                            handleInputChange2(
                                                                                                index,
                                                                                                "remarks",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <SingleSelector
                                                                                        onChange={(selectedOption) =>
                                                                                            handleUnitChangeForRow(
                                                                                                index,
                                                                                                selectedOption
                                                                                            )
                                                                                        }
                                                                                        value={(subItem.
                                                                                            uom_id
                                                                                            ?
                                                                                            unitOfMeasures.find(uom => uom.value === subItem.
                                                                                                uom_id
                                                                                            ) :
                                                                                            null) || selectedUnitSubRow[index]
                                                                                        }
                                                                                        options={unitOfMeasures}
                                                                                        placeholder={`Select UOM`}
                                                                                    />

                                                                                    {/* {console.log('Current subItem:', subItem)}  */}

                                                                                </td>
                                                                                <td colSpan={2}>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={subItem.cost_quantity || ''}
                                                                                        onKeyDown={(e) => {
                                                                                            if (
                                                                                                e.key === "-" ||
                                                                                                e.key === "e" ||
                                                                                                e.key === "E"
                                                                                            ) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        }}
                                                                                        min="0"
                                                                                        placeholder="Enter Quantity"
                                                                                        className="form-control"
                                                                                        onChange={(e) =>
                                                                                            handleInputChange2(
                                                                                                index,
                                                                                                "cost_quantity",
                                                                                                parseFloat(e.target.value)
                                                                                            )
                                                                                        }
                                                                                        disabled={!subItem.hasOwnProperty('isNew')}
                                                                                    />
                                                                                </td>
                                                                                {/* <td>
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width={16}
                                                                                        height={16}
                                                                                        fill="currentColor"
                                                                                        className="bi bi-file-earmark-text"
                                                                                        viewBox="0 0 16 16"
                                                                                        onClick={handleIconClick}
                                                                                    >
                                                                                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                                                                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                                                                    </svg>
                                                                                    <input
                                                                                        id="file-input"
                                                                                        type="file"
                                                                                        style={{ display: "none" }}
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                    {file && (
                                                                                        <div>Selected File: {file.name}</div>
                                                                                    )}
                                                                                </td> */}
                                                                            </tr>
                                                                            {/* {!expandedRows.includes(subItem.id) && ( */}
                                                                            <tr style={{ display: expandedRows.includes(subItem.id) ? "table-row" : "none" }}>
                                                                                <td colSpan={11}>
                                                                                    <BoqAmendSub
                                                                                        materials={materials2[subItem.id] || subItem.materials || []}
                                                                                        handleAddMaterials={(newMaterials) =>
                                                                                            handleAddMaterials2(
                                                                                                subItem.id,
                                                                                                newMaterials
                                                                                            )
                                                                                        }
                                                                                        setMaterials={setMaterials2}
                                                                                        Assets={Assets2[subItem.id] || subItem.assets || []}
                                                                                        setAssets={setAssets2}
                                                                                        handleDeleteAll={handleDeleteAll2}
                                                                                        handleSelectRow={handleSelectRow2}
                                                                                        handleAddAssets={(newMaterials) =>
                                                                                            handleAddAssets2(
                                                                                                subItem.id,
                                                                                                newMaterials
                                                                                            )
                                                                                        }
                                                                                        handleDeleteAllAssets={handleDeleteAllAssets2}
                                                                                        handleSelectRowAsset={handleSelectRowAssets2}
                                                                                        predefinedMaterialsData={(data) => updatePredefinedMaterialsData(subItem.id, data)}
                                                                                        predefinedAssetsData={(data) => updatePredefinedAssetsData(subItem.id, data)}
                                                                                        boqSubItemId={subItem.id}
                                                                                        boqSubItems={boqSubItems.filter((item) => item.id === subItem.id)}
                                                                                        setBoqSubItems={setBoqSubItems}
                                                                                        setMaterialErrors={setMaterialErrors}
                                                                                        setAssetsErrors={setAssetsErrors}
                                                                                        boqDetails={boqDetails}
                                                                                        setCounter={setCounter}

                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                            {/* )} */}
                                                                        </React.Fragment>
                                                                    ))}

                                                                    {/* Render new rows being added */}
                                                                    {count.map((el, index) => {
                                                                        // Skip if this is an existing item
                                                                        if (boqSubItems.some(item => item.id === el.id)) {
                                                                            return null;
                                                                        }
                                                                        return (
                                                                            <React.Fragment key={index}>
                                                                                <tr>
                                                                                    <td>
                                                                                        {/* <input type="checkbox" /> */}
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={selectedRows.includes(el.id)}
                                                                                            onChange={(e) => {
                                                                                                if (e.target.checked) {
                                                                                                    setSelectedRows(prev => [...prev, el.id]);
                                                                                                } else {
                                                                                                    setSelectedRows(prev => prev.filter(id => id !== el.id));
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <button
                                                                                            className="btn btn-link p-0"
                                                                                            onClick={() => toggleRow(el.id)}
                                                                                            aria-label="Toggle row visibility"
                                                                                        >
                                                                                            {expandedRows.includes(el.id) ? (
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="24"
                                                                                                    height="24"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    stroke="black"
                                                                                                    strokeWidth="1"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    fill=" #e0e0e0"
                                                                                                >
                                                                                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                </svg>
                                                                                            ) : (
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="24"
                                                                                                    height="24"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    stroke="black"
                                                                                                    strokeWidth="1"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    fill=" #e0e0e0"
                                                                                                >
                                                                                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                                                                                    <line x1="12" y1="8" x2="12" y2="16" />
                                                                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                                                                </svg>
                                                                                            )}
                                                                                        </button>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Enter Sub Item Name"
                                                                                            value={expandedRows.name}
                                                                                            onChange={(e) =>
                                                                                                handleInputChange2(
                                                                                                    index,
                                                                                                    "name",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    {/* {console.log("subitem for new", boqSubItems)} */}
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Enter Description"
                                                                                            className="form-control"
                                                                                            value={expandedRows.description}
                                                                                            onChange={(e) =>
                                                                                                handleInputChange2(
                                                                                                    index,
                                                                                                    "description",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Enter Notes"
                                                                                            className="form-control"
                                                                                            value={expandedRows.notes}
                                                                                            onChange={(e) =>
                                                                                                handleInputChange2(
                                                                                                    index,
                                                                                                    "notes",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Enter Remark"
                                                                                            value={expandedRows.remarks}
                                                                                            className="form-control"
                                                                                            onChange={(e) =>
                                                                                                handleInputChange2(
                                                                                                    index,
                                                                                                    "remarks",
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <SingleSelector
                                                                                            onChange={(selectedOption) =>
                                                                                                handleUnitChangeForRow(
                                                                                                    index,
                                                                                                    selectedOption
                                                                                                )
                                                                                            }
                                                                                            value={selectedUnitSubRow[index]}
                                                                                            options={unitOfMeasures}
                                                                                            placeholder={`Select UOM`}
                                                                                        />
                                                                                    </td>
                                                                                    <td colSpan={2}>
                                                                                        <input
                                                                                            type="number"
                                                                                            value={expandedRows.qty}
                                                                                            onKeyDown={(e) => {
                                                                                                if (
                                                                                                    e.key === "-" ||
                                                                                                    e.key === "e" ||
                                                                                                    e.key === "E"
                                                                                                ) {
                                                                                                    e.preventDefault();
                                                                                                }
                                                                                            }}
                                                                                            min="0"
                                                                                            placeholder="Enter Quantity"
                                                                                            className="form-control"
                                                                                            onChange={(e) =>
                                                                                                handleInputChange2(
                                                                                                    index,
                                                                                                    "cost_quantity",
                                                                                                    parseFloat(e.target.value)
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    {/* <td>
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width={16}
                                                                                            height={16}
                                                                                            fill="currentColor"
                                                                                            className="bi bi-file-earmark-text"
                                                                                            viewBox="0 0 16 16"
                                                                                            onClick={handleIconClick}
                                                                                        >
                                                                                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                                                                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                                                                        </svg>
                                                                                        <input
                                                                                            id="file-input"
                                                                                            type="file"
                                                                                            style={{ display: "none" }}
                                                                                            onChange={handleFileChange}
                                                                                        />
                                                                                        {file && (
                                                                                            <div>Selected File: {file.name}</div>
                                                                                        )}
                                                                                    </td> */}
                                                                                </tr>
                                                                                {expandedRows.includes(el.id) && (
                                                                                    <tr>
                                                                                        <td colSpan={11}>
                                                                                            <BoqAmendSub
                                                                                                materials={materials2[el.id] || []}
                                                                                                handleAddMaterials={(newMaterials) =>
                                                                                                    handleAddMaterials2(
                                                                                                        el.id,
                                                                                                        newMaterials
                                                                                                    )
                                                                                                }
                                                                                                setMaterials={setMaterials2}
                                                                                                Assets={Assets2[el.id] || []}
                                                                                                setAssets={setAssets2}
                                                                                                handleDeleteAll={handleDeleteAll2}
                                                                                                handleSelectRow={handleSelectRow2}
                                                                                                handleAddAssets={(newMaterials) =>
                                                                                                    handleAddAssets2(
                                                                                                        el.id,
                                                                                                        newMaterials
                                                                                                    )
                                                                                                }
                                                                                                handleDeleteAllAssets={handleDeleteAllAssets2}
                                                                                                handleSelectRowAsset={handleSelectRowAssets2}
                                                                                                predefinedMaterialsData={(data) => updatePredefinedMaterialsData(el.id, data)}
                                                                                                predefinedAssetsData={(data) => updatePredefinedAssetsData(el.id, data)}
                                                                                                boqSubItemId={el.id}
                                                                                                boqSubItems={boqSubItems.filter((item) => item.id === el.id)}
                                                                                                setBoqSubItems={setBoqSubItems}
                                                                                                setMaterialErrors={setMaterialErrors}
                                                                                                setAssetsErrors={setAssetsErrors}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3 mx-3">
                                                        <p>
                                                            <button
                                                                style={{ color: "var(--red)" }}
                                                                className="fw-bold text-decoration-underline border-0 bg-white"
                                                                onClick={addRowToTable1}
                                                            >
                                                                Add Row
                                                            </button>{" "}
                                                            |
                                                            <button
                                                                style={{ color: "var(--red)" }}
                                                                className="fw-bold text-decoration-underline border-0 bg-white"
                                                                onClick={() => deleteRowFromTable1(counter)}
                                                            >
                                                                Delete Row
                                                            </button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleCard>
                                </>
                            )}





                        </div>
                        <div className="row mt-2 justify-content-center mb-5">
                            <div className="col-md-2">
                                {loading && (
                                    // <div className="loader-container">
                                    //   <div className="lds-ring">
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //   </div>
                                    //   <p>Submitting your BOQ...</p>
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

                                )}
                                <button
                                    className="purple-btn2 w-100"
                                    fdprocessedid="u33pye"
                                    onClick={handleSubmit}
                                >
                                    Amend
                                </button>
                            </div>
                            <div className="col-md-2">
                                {/* <button className="purple-btn1 w-100" fdprocessedid="u33pye">
                  Cancel
                </button> */}

                                <Link to={`/boq-details-page-master/${boqDetails?.id}`}>
                                    <button
                                        className="purple-btn1 w-100"
                                        fdprocessedid="u33pye"
                                    >

                                        Cancel

                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal start */}

            {/* Modal end */}
        </>
    );
};

export default BoqAmend;
