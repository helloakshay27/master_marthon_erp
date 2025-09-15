import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditRateLabour = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [rateDetails, setRateDetails] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [modalOptionsLoading, setModalOptionsLoading] = useState(false);
    const [deletedIds, setDeletedIds] = useState([]);

    // State for table rows
    const [formData, setFormData] = useState({
        materialType: "",
        materialSubType: "",
        material: "",
        genericSpecification: "",
        colour: "",
        brand: "",
        effectiveDate: "",
        rate: "",
        rateType: "",
        poRate: "",
        avgRate: "",
        uom: "",
    });


    const fetchRateDetails = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}labour_rate_details/${id}.json?token=${token}`
            );
            setRateDetails(response.data);
            // setStatus(response.data.selected_status || "");
            // Map API materials to your table row structure
            if (response.data.labour_rates) {
                setLoading(false);
                setTableData(
                    response.data?.labour_rates.map((mat) => {
                        return {
                            id: mat.id,
                            // For table display and edit
                            resource_id:mat.resource_id,
                            activity: mat.labour_activity_id || "",
                            activityLabel: mat.labour_activity || "",
                            subActivity: mat.labour_sub_activity_id || "",
                            subActivityLabel: mat.labour_sub_activity || "",
                            mainCategoryLabel: mat.category || "",
                            uom: mat.unit_of_measure_id || "",
                            uomLabel: mat.uom || "",
                            effectiveDate: mat.effective_date || "",
                            rate: mat.rate,
                            rateType: mat.rate_type,
                            // Keep other fields for compatibility if needed
                            // ...existing code for material fields if you want to keep them
                        };
                    })
                );

            }
        } catch (error) {
            console.error("Error fetching rate details:", error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRateDetails(id);
    }, [id]);


    // console.log("table data", tableData)

    // Handle rate input change
    const handleRateChange = (e, rowIndex) => {
        const value = e.target.value;
        setTableData((prevData) =>
            prevData.map((row, index) =>
                index === rowIndex ? { ...row, rate: value, originalManualRate: value } : row
            )
        );

        // setRate(value);
        setCheckbox1(false);
        setCheckbox2(false);

    };

    // Handle input/select changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // delete row 
    const handleDeleteRow = (rowIndex) => {
        // setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
        setTableData((prevData) => {
            const row = prevData[rowIndex];
            if (row.id) {
                // setDeletedIds((prev) => [...prev, row.id]);
                setDeletedIds((prev) => prev.includes(row.id) ? prev : [...prev, row.id]);
            }
            return prevData.filter((_, index) => index !== rowIndex);
        });
    };

    // umo api

    const [unitOfMeasures, setUnitOfMeasures] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    // Fetching the unit of measures data on component mount

     useEffect(() => {
            // if (selectedInventoryMaterialTypes2) {
                axios
                    .get(
                        `${baseURL}unit_of_measures.json?token=${token}`
                    )
                    .then((response) => {
                        // Mapping the response to the format required by react-select
                        const options = response?.data.map((unit) => ({
                            value: unit.id,
                            label: unit.uom_short_name,
                        }));
                        setUnitOfMeasures(options); // Save the formatted options to state
                    })
                    .catch((error) => {
                        console.error("Error fetching unit of measures:", error);
                    });
    
            // }
        }, []);

    const handleEffectiveDateChange = (id, value) => {
        setTableData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, effectiveDate: value } : row
            )
        );
    };




    // ----------
    // --- Labour Activities Create Handler ---
        // const handleCreateLabour = (e) => {
        //     e.preventDefault();
        //     const errors = {};
        //     // Duplicate check: prevent same activity in the same category/row
        //     const seen = new Set();
        //     const hasDuplicate = labourRows.some(row => {
        //         const key = `${selectedCategory?.value}|${selectedSubCategory?.value}|${selectedSubCategoryLevel3?.value}|${selectedSubCategoryLevel4?.value}|${row.activity}`;
        //         if (seen.has(key)) return true;
        //         seen.add(key);
        //         return false;
        //     });
        //     if (hasDuplicate) {
        //         toast.error("Duplicate Labour Activity in the same category.");
        //         return;
        //     }
    
    
        //     // Prepare new rows for tableData, using per-row UOM and correct mapping, and include subActivities
        //     console.log("labour rowssss:", labourRows);
        //     let newRows = [];
        //     labourRows.forEach((row, rowIndex) => {
        //         if (row.subActivities && row.subActivities.length > 0) {
        //             row.subActivities.forEach(sub => {
        //                 newRows.push({
        //                     mainCategory: selectedCategory?.value,
        //                     mainCategoryLabel: selectedCategory?.label,
        //                     subCategory: selectedSubCategory?.value,
        //                     subCategoryLabel: selectedSubCategory?.label,
        //                     subCategory3: selectedSubCategoryLevel3?.value,
        //                     subCategory3Label: selectedSubCategoryLevel3?.label,
        //                     subCategory4: selectedSubCategoryLevel4?.value,
        //                     subCategory4Label: selectedSubCategoryLevel4?.label,
        //                     subCategory5: selectedSubCategoryLevel5?.value,
        //                     subCategory5Label: selectedSubCategoryLevel5?.label,
        //                     effectiveDate: formData.effectiveDate,
        //                     uom: sub.uom || row.uom,
        //                     uomLabel: unitOfMeasures.find(opt => opt.value === (sub.uom || row.uom))?.label || "",
        //                     activity: row.activity,
        //                     activityLabel: labourActivities.find(opt => opt.value === row.activity)?.label || "",
        //                     rate: sub.rate || row.rate,
        //                     subActivity: sub.subActivity,
        //                     subActivityLabel: (subActivityOptions[rowIndex]?.find(opt => opt.value === sub.subActivity)?.label) || "",
        //                     subActivities: [], // This row represents a single sub-activity
        //                 });
        //             });
        //         } else {
        //             newRows.push({
        //                 mainCategory: selectedCategory?.value,
        //                 mainCategoryLabel: selectedCategory?.label,
        //                 subCategory: selectedSubCategory?.value,
        //                 subCategoryLabel: selectedSubCategory?.label,
        //                 subCategory3: selectedSubCategoryLevel3?.value,
        //                 subCategory3Label: selectedSubCategoryLevel3?.label,
        //                 subCategory4: selectedSubCategoryLevel4?.value,
        //                 subCategory4Label: selectedSubCategoryLevel4?.label,
        //                 subCategory5: selectedSubCategoryLevel5?.value,
        //                 subCategory5Label: selectedSubCategoryLevel5?.label,
        //                 effectiveDate: formData.effectiveDate,
        //                 uom: row.uom,
        //                 uomLabel: unitOfMeasures.find(opt => opt.value === row.uom)?.label || "",
        //                 activity: row.activity,
        //                 activityLabel: labourActivities.find(opt => opt.value === row.activity)?.label || "",
        //                 rate: row.rate,
        //                 subActivity: null,
        //                 subActivityLabel: "",
        //                 subActivities: [],
        //             });
        //         }
        //     });
    
        //     // Edit mode: update the row(s)
        //     if (editRowIndex !== null) {
        //         // Replace the row at editRowIndex with the first new row (or all newRows if you want to support multi-edit)
        //         const updatedTableData = tableData.map((row, idx) =>
        //             idx === editRowIndex ? newRows[0] : row
        //         );
        //         setTableData(updatedTableData);
        //         setEditRowIndex(null);
        //     } else {
        //         // Add all new rows
        //         setTableData([...tableData, ...newRows]);
        //     }
    
        //     // Reset form and modal
        //     setFormData({
        //         materialType: "",
        //         materialSubType: "",
        //         material: "",
        //         genericSpecification: "",
        //         colour: "",
        //         brand: "",
        //         effectiveDate: "",
        //         rate: "",
        //         poRate: "",
        //         avgRate: "",
        //         uom: "",
        //     });
        //     setLabourRows([{ activity: null, rate: "" }]);
        //     setShowModal(false);
        // };




         const handleCreateLabour = (e) => {
                e.preventDefault();
                const errors = {};
        
                // Validate main category
                if (!selectedCategory) errors.category = "Main Category is required.";
                // Validate effective date
                if (!formData.effectiveDate) errors.effectiveDate = "Effective Date is required.";
        
                // Validate each labour row for activity, rate, and uom
                const rowErrors = labourRows.map((row, idx) => {
                    const r = {};
                    if (!row.activity) r.activity = "Activity is required.";
                    // If no sub-activities, require rate and uom for main activity
                    if (!row.subActivities || row.subActivities.length === 0) {
                        if (!row.rate || isNaN(parseFloat(row.rate))) r.rate = "Rate is required.";
                        if (!row.uom) r.uom = "UOM is required.";
                    } else {
                        // If sub-activities exist, require rate and uom for each sub-activity
                        r.subActivities = row.subActivities.map((sub, subIdx) => {
                            const subErr = {};
                            if (!sub.subActivity) subErr.subActivity = "Sub-activity is required.";
                            if (!sub.rate || isNaN(parseFloat(sub.rate))) subErr.rate = "rate is required.";
                            if (!sub.uom) subErr.uom = "UOM is required.";
                            return subErr;
                        });
                    }
                    return r;
                });
                // If any row or sub-activity has errors, show error and return
                const hasRowError = Object.keys(errors).length > 0 || rowErrors.some(r => {
                    if (Object.keys(r).length > 0 && (Object.keys(r).length > 1 || !('subActivities' in r))) return true;
                    if (r.subActivities && r.subActivities.some(subErr => Object.keys(subErr).length > 0)) return true;
                    return false;
                });
                if (hasRowError) {
                    setFieldErrors(errors);
                    setRowFieldErrors(rowErrors);
                    // toast.error("Please fill all required fields.");
                    return;
                }
        
                // Duplicate check: prevent same activity in the same category/row (within modal rows)
                const seen = new Set();
                let hasDuplicate = false;
                let duplicateRowIndex = null;
                let duplicateSubActivity = false;
                let duplicateSubRowIndex = null;
                let duplicateSubIdx = null;
                labourRows.forEach((row, idx) => {
                    const key = `${selectedCategory?.value}|${selectedSubCategory?.value}|${selectedSubCategoryLevel3?.value}|${selectedSubCategoryLevel4?.value}|${row.activity}`;
                    if (seen.has(key)) {
                        hasDuplicate = true;
                        duplicateRowIndex = idx;
                    }
                    seen.add(key);
                    // Check for duplicate sub-activities within this row
                    if (row.subActivities && row.subActivities.length > 0) {
                        const subSeen = new Set();
                        row.subActivities.forEach((sub, subIdx) => {
                            if (!sub.subActivity) return;
                            const subKey = `${row.activity}|${sub.subActivity}`;
                            if (subSeen.has(subKey)) {
                                duplicateSubActivity = true;
                                duplicateSubRowIndex = idx;
                                duplicateSubIdx = subIdx;
                            }
                            subSeen.add(subKey);
                        });
                    }
                });
                if (hasDuplicate) {
                    toast.error("Duplicate Labour Activity in the same category.");
                    // Optionally, highlight the duplicate row
                    const newRowFieldErrors = rowFieldErrors.slice();
                    if (duplicateRowIndex !== null) {
                        newRowFieldErrors[duplicateRowIndex] = {
                            ...newRowFieldErrors[duplicateRowIndex],
                            activity: "Duplicate activity in this category."
                        };
                        setRowFieldErrors(newRowFieldErrors);
                    }
                    return;
                }
                if (duplicateSubActivity) {
                    toast.error("Duplicate Sub-Activity for the same Activity.");
                    // Optionally, highlight the duplicate sub-activity
                    const newRowFieldErrors = rowFieldErrors.slice();
                    if (duplicateSubRowIndex !== null && duplicateSubIdx !== null) {
                        if (!newRowFieldErrors[duplicateSubRowIndex]) newRowFieldErrors[duplicateSubRowIndex] = {};
                        if (!newRowFieldErrors[duplicateSubRowIndex].subActivities) newRowFieldErrors[duplicateSubRowIndex].subActivities = [];
                        newRowFieldErrors[duplicateSubRowIndex].subActivities[duplicateSubIdx] = {
                            ...newRowFieldErrors[duplicateSubRowIndex].subActivities[duplicateSubIdx],
                            subActivity: "Duplicate sub-activity for this activity."
                        };
                        setRowFieldErrors(newRowFieldErrors);
                    }
                    return;
                }
        
                // Duplicate check: prevent same activity or sub-activity in tableData (already added rows)
                let duplicateInTable = false;
                let duplicateSubInTable = false;
                // Prepare new rows for tableData, using per-row UOM and correct mapping, and include subActivities
                let newRows = [];
                labourRows.forEach((row, rowIndex) => {
                    if (row.subActivities && row.subActivities.length > 0) {
                        row.subActivities.forEach(sub => {
                            // Check for duplicate activity+subActivity in tableData
                            const exists = tableData.some(td =>
                                td.activity === row.activity &&
                                td.subActivity === sub.subActivity &&
                                td.mainCategory === selectedCategory?.value &&
                                td.subCategory === selectedSubCategory?.value &&
                                td.subCategory3 === selectedSubCategoryLevel3?.value &&
                                td.subCategory4 === selectedSubCategoryLevel4?.value &&
                                td.subCategory5 === selectedSubCategoryLevel5?.value
                            );
                            if (exists) duplicateSubInTable = true;
                            newRows.push({
                                mainCategory: selectedCategory?.value,
                                mainCategoryLabel: selectedCategory?.label,
                                subCategory: selectedSubCategory?.value,
                                subCategoryLabel: selectedSubCategory?.label,
                                subCategory3: selectedSubCategoryLevel3?.value,
                                subCategory3Label: selectedSubCategoryLevel3?.label,
                                subCategory4: selectedSubCategoryLevel4?.value,
                                subCategory4Label: selectedSubCategoryLevel4?.label,
                                subCategory5: selectedSubCategoryLevel5?.value,
                                subCategory5Label: selectedSubCategoryLevel5?.label,
                                effectiveDate: formData.effectiveDate,
                                uom: sub.uom || row.uom,
                                uomLabel: unitOfMeasures.find(opt => opt.value === (sub.uom || row.uom))?.label || "",
                                activity: row.activity,
                                activityLabel: labourActivities.find(opt => opt.value === row.activity)?.label || "",
                                rate: sub.rate || row.rate,
                                subActivity: sub.subActivity,
                                subActivityLabel: (subActivityOptions[rowIndex]?.find(opt => opt.value === sub.subActivity)?.label) || "",
                                subActivities: [], // This row represents a single sub-activity
                            });
                        });
                    } else {
                        // Check for duplicate activity (no sub-activity) in tableData
                        const exists = tableData.some(td =>
                            td.activity === row.activity &&
                            !td.subActivity &&
                            td.mainCategory === selectedCategory?.value &&
                            td.subCategory === selectedSubCategory?.value &&
                            td.subCategory3 === selectedSubCategoryLevel3?.value &&
                            td.subCategory4 === selectedSubCategoryLevel4?.value &&
                            td.subCategory5 === selectedSubCategoryLevel5?.value
                        );
                        if (exists) duplicateInTable = true;
                        newRows.push({
                            mainCategory: selectedCategory?.value,
                            mainCategoryLabel: selectedCategory?.label,
                            subCategory: selectedSubCategory?.value,
                            subCategoryLabel: selectedSubCategory?.label,
                            subCategory3: selectedSubCategoryLevel3?.value,
                            subCategory3Label: selectedSubCategoryLevel3?.label,
                            subCategory4: selectedSubCategoryLevel4?.value,
                            subCategory4Label: selectedSubCategoryLevel4?.label,
                            subCategory5: selectedSubCategoryLevel5?.value,
                            subCategory5Label: selectedSubCategoryLevel5?.label,
                            effectiveDate: formData.effectiveDate,
                            uom: row.uom,
                            uomLabel: unitOfMeasures.find(opt => opt.value === row.uom)?.label || "",
                            activity: row.activity,
                            activityLabel: labourActivities.find(opt => opt.value === row.activity)?.label || "",
                            rate: row.rate,
                            subActivity: null,
                            subActivityLabel: "",
                            subActivities: [],
                        });
                    }
                });
        
                if (duplicateInTable) {
                    toast.error("This Labour Activity already exists in the table.");
                    return;
                }
                if (duplicateSubInTable) {
                    toast.error("This Sub-Activity for the selected Activity already exists in the table.");
                    return;
                }
        
        
                // Edit mode: update the row(s)
                if (editRowIndex !== null) {
                    const updatedTableData = tableData.map((row, idx) =>
                        idx === editRowIndex ? newRows[0] : row
                    );
                    setTableData(updatedTableData);
                    setEditRowIndex(null);
                } else {
                    setTableData([...tableData, ...newRows]);
                }
        
                setFormData({
                    materialType: "",
                    materialSubType: "",
                    material: "",
                    genericSpecification: "",
                    colour: "",
                    brand: "",
                    effectiveDate: "",
                    rate: "",
                    poRate: "",
                    avgRate: "",
                    uom: "",
                });
                setLabourRows([{ activity: null, rate: "" }]);
                setShowModal(false);
                setFieldErrors({});
                setRowFieldErrors([]);
            };




        // categories
        
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
                        `${baseURL}work_categories/work_categories_and_subcategories.json?token=${token}`
                    ) // Replace with your API endpoint
                    .then((response) => {
                        setWorkCategories(response.data.work_categories); // Save the categories to state
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
                        `${baseURL}work_sub_categories/${selectedOption.value}.json?token=${token}`
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
                            `${baseURL}work_sub_categories/${selectedOption.value}.json?token=${token}`
                        )
                        .then((response) => {
                            const sub4Opts = (response.data.work_sub_categories || []).map(item => ({
                                value: item.id,
                                label: item.name,
                            }));
                            setSubCategoryLevel4Options(sub4Opts);
                            const subCat4 = sub4Opts.find(opt => opt.value === row.subCategory4) || null;
                            setSelectedSubCategoryLevel4(subCat4);
        
                            // Fetch and set subcategory level 5 options and value
                            if (row.subCategory4) {
                                axios.get(`${baseURL}work_sub_categories/${row.subCategory4}.json?token=${token}`)
                                    .then(response => {
                                        const sub5Opts = (response.data.work_sub_categories || []).map(item => ({
                                            value: item.id,
                                            label: item.name,
                                        }));
                                        setSubCategoryLevel5Options(sub5Opts);
                                        const subCat5 = sub5Opts.find(opt => opt.value === row.subCategory5) || null;
                                        setSelectedSubCategoryLevel5(subCat5);
                                    });
                            } else {
                                setSelectedSubCategoryLevel5(null);
                            }
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
                            `${baseURL}work_sub_categories/${selectedOption.value}.json?token=${token}`
                        )
                        .then((response) => {
                            const sub5Opts = (response.data.work_sub_categories || []).map(item => ({
                                value: item.id,
                                label: item.name,
                            }));
                            setSubCategoryLevel5Options(sub5Opts);
                            const subCat5 = sub5Opts.find(opt => opt.value === row.subCategory5) || null;
                            setSelectedSubCategoryLevel5(subCat5);
                        })
                        .catch((error) => {
                            console.error("Error fetching level 5 subcategories:", error);
                        });
                }
            };
        
            const handleLevel5Change = (selectedOption) =>
                setSelectedSubCategoryLevel5(selectedOption);
        
        
            // --- Labour Activity State and Fetch Logic ---
            const [labourActivities, setLabourActivities] = useState([]); // Options for selector
            const [labourRows, setLabourRows] = useState([{ activity: null, rate: "", uom: "", subActivities: [] }]);
            // Store sub-activity options for each main activity row
            const [subActivityOptions, setSubActivityOptions] = useState({});
        
            // Fetch Labour Activities when all required category levels are selected
            // console.log("selected main category:", selectedCategory);
            useEffect(() => {
                const level1 = selectedCategory?.value || "";
                const level2 = selectedSubCategory?.value || "";
                const level3 = selectedSubCategoryLevel3?.value || "";
                const level4 = selectedSubCategoryLevel4?.value || "";
                // console.log("Labour Activity Levels:", { level1, level2, level3, level4 });
                // Fetch if any category level is selected
                if (level1 || level2 || level3 || level4) {
                    const url = `https://marathon.lockated.com/activity_category_mappings/category_wise_activities.json?token=${token}&q[level_one_id_eq]=${level1}&q[level_two_id_eq]=${level2}&q[level_three_id_eq]=${level3}&q[level_four_id_eq]=${level4}`;
                    axios.get(url)
                        .then(res => {
                            // console.log("res for labour activity:", res.data.mappings)
                            // setLabourActivities(res.data.mappings || []);
                            const options = res.data.mappings.map(inventory => ({
                                value: inventory.value,
                                label: inventory.name
                            }));
        
                            setLabourActivities(options)
                        })
                        .catch((error) => {
                            console.error("Error fetching level 5 subcategories:", error);
                        });
                } else {
                    // setLabourActivities([]);
                }
            }, [selectedCategory, selectedSubCategory, selectedSubCategoryLevel3, selectedSubCategoryLevel4]);
            // console.log("labour activity options***********:", labourActivities);
        
            // Handler for changing a labour activity or rate in a row
            const handleLabourRowChange = async (idx, field, value) => {
                setLabourRows(rows => rows.map((row, i) =>
                    i === idx ? { ...row, [field]: value } : row
                ));
                // If changing the activity, fetch sub-activities for that activity
                if (field === "activity" && value) {
                    console.log("activity valueL",value)
                    try {
                        // const token = window.token || (typeof token !== 'undefined' ? token : '');
                          console.log("before axios");
                        const res = await axios.get(`https://marathon.lockated.com/labour_activities/${value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`);
                        console.log("sub act responce:",res.data)
                        const subActs = res.data.labour_sub_activities || [];
                        console.log("sub act responce sub act :",subActs)
                        const options = subActs.map(sub => ({ value: sub.id, label: sub.name }));
                        setSubActivityOptions(prev => ({ ...prev, [idx]: options }));
                        // Reset subActivities for this row
                        setLabourRows(rows => rows.map((row, i) =>
                            i === idx ? { ...row, subActivities: [] } : row
                        ));
                    } catch (err) {
                        setSubActivityOptions(prev => ({ ...prev, [idx]: [] }));
                    }
                }
            };
            // Add new row
            const handleAddLabourRow = () => setLabourRows(rows => ([
                ...rows,
                { activity: null, rate: "", uom: "" }
            ]));
            // Remove row
            const handleRemoveLabourRow = idx => setLabourRows(rows => rows.filter((_, i) => i !== idx));
        
            // Handler to add a new sub-activity to a main activity row
            const handleAddSubActivity = (mainIdx) => {
                setLabourRows(prevRows => prevRows.map((row, idx) => {
                    if (idx !== mainIdx) return row;
                    const subActivities = row.subActivities ? [...row.subActivities] : [];
                    subActivities.push({ subActivity: null, rate: '', uom: '' });
                    return {
                        ...row,
                        subActivities
                    };
                }));
            };
        
            // Handler to remove a sub-activity from a main activity row
            const handleRemoveSubActivity = (mainIdx, subIdx) => {
                setLabourRows(prevRows => prevRows.map((row, idx) => {
                    if (idx !== mainIdx) return row;
                    const subActivities = row.subActivities ? [...row.subActivities] : [];
                    subActivities.splice(subIdx, 1);
                    return {
                        ...row,
                        subActivities
                    };
                }));
        
        
            };
        
            // Handler to update a sub-activity field for a main activity row
            const handleSubActivityChange = (mainIdx, subIdx, field, value) => {
                setLabourRows(prevRows =>
                    prevRows.map((row, idx) => {
                        if (idx !== mainIdx) return row;
                        const subActivities = row.subActivities ? [...row.subActivities] : [];
                        subActivities[subIdx] = { ...subActivities[subIdx], [field]: value };
                        return { ...row, subActivities };
                    })
                );
            };
        
        
        
        
    // ------------



    // --- Labour Rate Payload Construction ---
    const labourRatePayload = {
        labour_rate_detail: {
            id: rateDetails?.id || "", // include the main id for edit
            labour_rates: tableData.map(row => {
                // Find the last non-null category in the chain
                const resource_id = row.subCategory5 || row.subCategory4 || row.subCategory3 || row.subCategory || row.mainCategory ||row.resource_id||  null;
                const isOnlyMain = !!row.mainCategory && !row.subCategory && !row.subCategory3 && !row.subCategory4 && !row.subCategory5;
                const resource_type = isOnlyMain ? "WorkCategory" : "WorkSubCategory";
                return {
                    id: row.id || null, // include id if present for edit
                    labour_activity_id: row.activity,
                    labour_sub_activity_id: row.subActivity || null,
                    resource_id,
                    resource_type,
                    unit_of_measure_id: row.uom,
                    effective_date: row.effectiveDate,
                    rate: row.rate
                };
            }),
            deleted: deletedIds || []
        }
    };

    console.log("labourRatePayload :", labourRatePayload);
    // console.log("table data:", tableData)

    const handleSubmit = () => {

          const labourRatePayload = {
        labour_rate_detail: {
            id: rateDetails?.id || "", // include the main id for edit
            labour_rates: tableData.map(row => {
                // Find the last non-null category in the chain
                const resource_id = row.subCategory5 || row.subCategory4 || row.subCategory3 || row.subCategory || row.mainCategory ||row.resource_id||  null;
                const isOnlyMain = !!row.mainCategory && !row.subCategory && !row.subCategory3 && !row.subCategory4 && !row.subCategory5;
                const resource_type = isOnlyMain ? "WorkCategory" : "WorkSubCategory";
                return {
                    id: row.id || null, // include id if present for edit
                    labour_activity_id: row.activity,
                    labour_sub_activity_id: row.subActivity || null,
                    resource_id,
                    resource_type,
                    unit_of_measure_id: row.uom,
                    effective_date: row.effectiveDate,
                    rate: row.rate
                };
            }),
            deleted: deletedIds || []
        }
    };

        console.log("Submitting payload update:",labourRatePayload);


        // Simulate API call or handle submission logic
        axios
            .patch(`${baseURL}labour_rate_details/${id}.json?token=${token}`, labourRatePayload)
            .then((response) => {
                alert("Submission successful!");
                console.log("Update successful:", response.data);
                // Redirect to the list page
                // navigate("/list-page"); // Replace "/list-page" with your actual list page route
                navigate(`/labour-rate-details/${response.data.id}?token=${token}`);
            })
            .catch((error) => {
                alert("Error submitting data!");
                console.error("Error submitting data:", error);
            });
    };





    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Edit Rate</h5>
                    <div className="card mt-3 pb-3">
                        <div className="card-body">
                            <div className="details_page">
                                <div className="row px-3">
                                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                        <div className="col-6">
                                            <label>Company</label>
                                        </div>
                                        <div className="col-6">
                                            <label className="text">
                                                <span className="me-3">
                                                    <span className="text-dark">:</span>
                                                </span>
                                                {rateDetails?.company_name || "-"}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                        <div className="col-6">
                                            <label>Project</label>
                                        </div>
                                        <div className="col-6">
                                            <label className="text">
                                                <span className="me-3">
                                                    <span className="text-dark">:</span>
                                                </span>
                                                {rateDetails?.project_name || "-"}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                        <div className="col-6">
                                            <label>Sub-Project</label>
                                        </div>
                                        <div className="col-6">
                                            <label className="text">
                                                <span className="me-3">
                                                    <span className="text-dark">:</span>
                                                </span>
                                                {rateDetails?.site_name || "-"}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                        <div className="col-6">
                                            <label>Wing</label>
                                        </div>
                                        <div className="col-6">
                                            <label className="text">
                                                <span className="me-3">
                                                    <span className="text-dark">:</span>
                                                </span>
                                                {rateDetails?.wing_name || "-"}
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                        {/* {tableData.map((row, idx) => (
                            <pre key={idx}>{JSON.stringify(row, null, 2)}</pre>
                        ))} */}
                        <div className="d-flex justify-content-end mx-2">
                            {/* <button className="purple-btn2">Bulk Upload</button> */}
                            <button
                                className="purple-btn2 me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#addnewModal"
                                // onClick={() => setShowModal(true)}
                                onClick={() => {
                                    setFieldErrors({});
                                    setShowModal(true);
                                }}
                            >
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
                                <span>Add</span>
                            </button>
                        </div>
                        {/* {(JSON.stringify(tableData, null, 2))} */}

                        <div className="mx-3 mt-3 mb-3">
                            <div className="tbl-container  mt-1" style={{ maxHeight: "600px" }}>
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Sr.No.</th>

                                             <th className="text-start">Category</th>
                                                                    <th className="text-start">Activity</th>
                                                                     <th className="text-start">Sub-Activity</th>
                                                                    <th className="text-start">UOM</th>
                                                                    <th className="text-start">Effective Date</th>
                                            
                                            
                                            <th className="text-start">Rate (INR) <span>*</span>
                                               
                                            </th>
                                           
                                            {/* <th className="text-start">Edit</th> */}
                                            <th className="text-start">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                           {tableData.length > 0 ? (
                                            tableData.map((row, index) => {
                                                // Prefer subActivityLabel if present (for new rows), else fallback to old logic for legacy rows
                                                let subActivityNames = '';
                                                if (row.subActivityLabel && row.subActivityLabel !== '') {
                                                    subActivityNames = row.subActivityLabel;
                                                } else if (row.subActivities && row.subActivities.length > 0) {
                                                    subActivityNames = row.subActivities
                                                        .map(sub => (subActivityOptions[index]?.find(opt => opt.value === sub.subActivity)?.label || ''))
                                                        .filter(Boolean)
                                                        .join(', ');
                                                }
                                                const subRates = (row.subActivities && row.subActivities.length > 0)
                                                    ? row.subActivities.map(sub => sub.rate).filter(Boolean).join(', ')
                                                    : '';
                                                const subUoms = (row.subActivities && row.subActivities.length > 0)
                                                    ? row.subActivities.map(sub => unitOfMeasures.find(opt => opt.value === sub.uom)?.label || '').filter(Boolean).join(', ')
                                                    : '';
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-start">{index + 1}</td>
                                                        <td className="text-start">{[row.mainCategoryLabel, row.subCategoryLabel, row.subCategory3Label, row.subCategory4Label, row.subCategory5Label].filter(Boolean).join(' - ')}</td>
                                                        <td className="text-start">{row.activityLabel}</td>
                                                        <td className="text-start">{subActivityNames}</td>
                                                        <td className="text-start">{row.uomLabel}{subUoms ? (row.uomLabel ? ', ' : '') + subUoms : ''}</td>
                                                        <td className="text-start" style={{ width: "140px" }}>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={row.effectiveDate || ""}
                                                                onChange={e => handleEffectiveDateChange(row.id, e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="text-start">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    className="form-control"
                                                                    type="number"
                                                                    value={row.rate}
                                                                    onChange={(e) => handleRateChange(e, index)}
                                                                    disabled={row.avgRateChecked || row.poRateChecked}
                                                                    placeholder="Enter Rate"
                                                                    style={{ maxWidth: "120px" }}
                                                                />
                                                                {subRates && <span style={{ marginLeft: 8, color: '#6c63ff', fontStyle: 'italic' }}>{subRates}</span>}
                                                            </div>
                                                        </td>
                                                        <td className="text-start">
                                                            <button
                                                                className="btn mt-0 pt-0"
                                                                onClick={() => handleDeleteRow(index)}
                                                            >
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
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="13" className="text-center">
                                                    No data added yet.
                                                </td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    <div className="row mt-2 justify-content-center mb-5 pb-5">
                        <div className="col-md-2 mt-2">
                            <button className="purple-btn2 w-100" onClick={handleSubmit}>Update</button>
                        </div>
                        <div className="col-md-2">
                            <button className="purple-btn1 w-100" onClick={() => navigate(`/view-rate?token=${token}`)}> Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loader-container">
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p>Loading...</p>
                </div>
            )}
            {/* create modal  */}
            {/* <Modal centered size="lg" show={showModal} onHide={() => setShowModal(false)}> */}
           
                        <Modal centered size="xl" show={showModal} onHide={() => {
                                        setShowModal(false);
                                        setEditRowIndex(null); // <-- Reset editRowIndex on modal close
                                    }}>
                                        <Modal.Header closeButton>
                                            {/* <h5>Add Material</h5> */}
                                            <h5>{editRowIndex !== null ? "Edit Labour Activities" : "Add Labour Activities"}</h5>
                                        </Modal.Header>
                                        <Modal.Body>
                        
                                            <form acceptCharset="UTF-8">
                                                <div className="row">
                        
                                                     <div className="col-md-4 mt-3">
                                                         <div className="form-group">
                                                             <label>Main Category <span>*</span></label>
                                                             <SingleSelector
                                                                 options={workCategories?.map((category) => ({
                                                                     value: category.id,
                                                                     label: category.name,
                                                                     work_sub_categories: category.work_sub_categories,
                                                                 }))}
                                                                 onChange={handleCategoryChange}
                                                                 value={selectedCategory}
                                                                 placeholder={`Select Main category`}
                                                             />
                                                             {fieldErrors.category && (
                                                                 <span className="text-danger">{fieldErrors.category}</span>
                                                             )}
                                                         </div>
                                                     </div>
                                                    <div className="col-md-4 mt-3">
                                                        <div className="form-group">
                                                            <label> Sub-category Level 2</label>
                                                            <SingleSelector
                                                                options={subCategoryOptions}
                                                                onChange={handleSubCategoryChange}
                                                                value={selectedSubCategory}
                                                                placeholder={`Select Sub-category lvl 2`} // Dynamic placeholder
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 mt-3">
                                                        <div className="form-group">
                                                            <label>Sub-category Level 3</label>
                                                            <SingleSelector
                                                                options={subCategoryLevel3Options}
                                                                onChange={handleLevel3Change}
                                                                value={selectedSubCategoryLevel3}
                                                                placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 mt-3">
                                                        <div className="form-group">
                                                            <label> Sub-category Level 4</label>
                                                            <SingleSelector
                                                                options={subCategoryLevel4Options}
                                                                onChange={handleLevel4Change}
                                                                value={selectedSubCategoryLevel4}
                                                                placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 mt-3">
                                                        <div className="form-group">
                                                            <label> Sub-category Level 5</label>
                                                            <SingleSelector
                                                                options={subCategoryLevel5Options}
                                                                onChange={handleLevel5Change}
                                                                value={selectedSubCategoryLevel5}
                                                                placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                                                            />
                                                        </div>
                                                    </div>
                                                     <div className="col-md-4 mt-3">
                                                         <div className="form-group">
                                                             <label>Effective Date <span>*</span></label>
                                                             <input className="form-control" type="date" name="effectiveDate"
                                                                 value={formData.effectiveDate}
                                                                 onChange={handleInputChange}
                                                             />
                                                             {fieldErrors.effectiveDate && (
                                                                 <span className="text-danger">{fieldErrors.effectiveDate}</span>
                                                             )}
                                                         </div>
                                                     </div>
                        
                                                    {/* .................................... */}
                        
                        
                                                    <div className="col-12 mt-5">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            {/* <label className="po-fontBold">Labour Activities & Rates</label> */}
                                                            <span className="po-fontBold">Activities </span>
                                                            <button
                                                                type="button"
                                                                className="purple-btn2"
                                                                style={{ minWidth: 0, padding: '4px 12px' }}
                                                                onClick={handleAddLabourRow}
                                                            >
                                                                 + Add  Activity
                                                            </button>
                                                        </div>
                                                        <div 
                                                        // style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', background: '#fff' }}
                                                        className=" p-3 mb-2"
                                                        >
                                                             {labourRows.map((row, idx) => (
                                                                 <div className="row mb-2 align-items-center border rounded p-2  mb-4 position-relative" key={idx}>
                                                                     <div className="col-md-3 mt-3">
                                                                         <div className="form-group">
                                                                             <label>Activity</label>
                                                                             <SingleSelector
                                                                                 options={labourActivities}
                                                                                 value={labourActivities.find((option) => option.value === row.activity)}
                                                                                 placeholder={`Select Activity`}
                                                                                 onChange={(selectedOption) => handleLabourRowChange(idx, "activity", selectedOption?.value)}
                                                                             />
                                                                             {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].activity && (
                                                                                 <span className="text-danger">{rowFieldErrors[idx].activity}</span>
                                                                             )}
                                                                         </div>
                                                                     </div>
                                                                    <div className="col-md-3 mt-3">
                                                                        <div className="form-group">
                                                                            <label>Rate </label>
                                                                            <input className="form-control" type="number" name="rate"
                                                                                value={row.rate}
                                                                                onChange={e => handleLabourRowChange(idx, "rate", e.target.value)}
                                                                                disabled={row.subActivities && row.subActivities.length > 0}
                                                                            />
                                                                            {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].rate && (
                                                                                <span className="text-danger">{rowFieldErrors[idx].rate}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 mt-3">
                                                                        <div className="form-group">
                                                                            <label className="po-fontBold">UOM <span>*</span></label>
                                                                            <SingleSelector
                                                                                options={unitOfMeasures}
                                                                                value={unitOfMeasures.find((option) => option.value === row.uom)}
                                                                                placeholder={`Select UOM`}
                                                                                onChange={(selectedOption) => handleLabourRowChange(idx, "uom", selectedOption?.value)}
                                                                                isDisabled={row.subActivities && row.subActivities.length > 0}
                                                                            />
                                                                            {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].uom && (
                                                                                <span className="text-danger">{rowFieldErrors[idx].uom}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-1 d-flex align-items-center justify-content-center mt-4">
                                                                        {labourRows.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                className="text-danger"
                                                                                style={{
                                                                                    fontSize: '1.5rem',
                                                                                    lineHeight: 1,
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: 0,
                                                                                    cursor: 'pointer',
                                                                                    outline: 'none',
                                                                                }}
                                                                                onClick={() => handleRemoveLabourRow(idx)}
                                                                                title="Remove"
                                                                            >
                                                                                &times;
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-md-2 mt-3">
                                                                        <button
                                                                            type="button"
                                                                            className="btn purple-btn2 btn-sm"
                                                                            onClick={() => handleAddSubActivity(idx)}
                                                                        >
                                                                            + Add Sub Activity
                                                                        </button>
                                                                    </div>
                                                                    {/* Render sub-activities for this main activity */}
                                                                    {row.subActivities && row.subActivities.map((sub, subIdx) => (
                                                                        <div className="row mb-2 align-items-center mt-3" key={subIdx}>
                                                                            <div className="col-md-3 mt-2 ms-1 ps-2 pe-2">
                                                                                <div className="form-group">
                                                                                    <label>Sub Activity <span>*</span></label>
                                                                                    <SingleSelector
                                                                                        options={subActivityOptions[idx] || []}
                                                                                        value={(subActivityOptions[idx] || []).find(opt => opt.value === sub.subActivity) || null}
                                                                                        placeholder="Select Sub Activity"
                                                                                        onChange={selectedOption => handleSubActivityChange(idx, subIdx, 'subActivity', selectedOption?.value)}
                                                                                    />
                                                                                    {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].subActivities && rowFieldErrors[idx].subActivities[subIdx] && rowFieldErrors[idx].subActivities[subIdx].subActivity && (
                                                                                        <span className="text-danger">{rowFieldErrors[idx].subActivities[subIdx].subActivity}</span>
                                                                                    )}
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3 mt-2 ms-1 ps-2 pe-2">
                                                                                <div className="form-group">
                                                                                    <label>Rate </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        type="number"
                                                                                        placeholder="Rate"
                                                                                        value={sub.rate}
                                                                                        onChange={e => handleSubActivityChange(idx, subIdx, 'rate', e.target.value)}
                                                                                    />
                                                                                    {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].subActivities && rowFieldErrors[idx].subActivities[subIdx] && rowFieldErrors[idx].subActivities[subIdx].rate && (
                                                                                        <span className="text-danger">{rowFieldErrors[idx].subActivities[subIdx].rate}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3 mt-2 ms-2 ps-2 pe-2">
                                                                                <div className="form-group">
                                                                                    <label>UOM</label>
                                                                                    <SingleSelector
                                                                                        options={unitOfMeasures}
                                                                                        value={unitOfMeasures.find((option) => option.value === sub.uom)}
                                                                                        placeholder={`Select UOM`}
                                                                                        onChange={selectedOption => handleSubActivityChange(idx, subIdx, 'uom', selectedOption?.value)}
                                                                                    />
                                                                                    {rowFieldErrors && rowFieldErrors[idx] && rowFieldErrors[idx].subActivities && rowFieldErrors[idx].subActivities[subIdx] && rowFieldErrors[idx].subActivities[subIdx].uom && (
                                                                                        <span className="text-danger">{rowFieldErrors[idx].subActivities[subIdx].uom}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-1 d-flex align-items-center justify-content-center mt-2 ms-2">
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-danger"
                                                                                    style={{ fontSize: '1.2rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
                                                                                    onClick={() => handleRemoveSubActivity(idx, subIdx)}
                                                                                    title="Remove Sub Activity"
                                                                                >
                                                                                    &times;
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* {console.log("labour rowssss:", labourRows)} */}
                        
                        
                        
                                                    <div className="row mt-2 justify-content-center mt-5">
                                                        <div className="col-md-3 mt-2">
                                                            <button className="purple-btn2 w-100" onClick={handleCreateLabour}>Add</button>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <button type="button" className="purple-btn1 w-100" data-bs-dismiss="modal" aria-label="Close"
                                                                onClick={() => {
                                                                    setShowModal(false);
                                                                    setEditRowIndex(null); // <-- Reset here too
                                                                }}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                        
                        
                                        </Modal.Body>
                                    </Modal>

            


            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default EditRateLabour;