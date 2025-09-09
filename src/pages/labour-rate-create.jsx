import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateRateLabour = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [rate, setRate] = useState('');
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [isEditing, setIsEditing] = useState(false);  // State to manage edit mode
    const [validationMsg, setValidationMsg] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false); // Add loading state
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    // Handle rate input change
    const handleRateChange = (e, rowIndex) => {
        const value = e.target.value;
        setTableData((prevData) =>
            prevData.map((row, index) =>
                index === rowIndex ? { ...row, rate: value } : row
            )
        );

        // setRate(value);
        setCheckbox1(false);
        setCheckbox2(false);

    };


    // modal data dd to table 
    const [tableData, setTableData] = useState([]); // State for table rows
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

    // Handle input/select changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSelectorChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption?.value || "",
            [`${field}Label`]: selectedOption?.label || "",
        }));

        if (field === "materialType") {
            // Logic for materialType selection
            setSelectedInventory2(selectedOption); // Set the selected inventory type
            setSelectedSubType2(null); // Clear the selected sub-type when inventory type changes
            setInventorySubTypes2([]); // Reset the sub-types list
            setInventoryMaterialTypes2([]); // Reset the material types list
            setSelectedInventoryMaterialTypes2(null); // Clear selected material type
            setGenericSpecifications([])
            setSelectedGenericSpecifications(null)
            setColors([])
            setSelectedColors(null)
            setInventoryBrands([])
            setSelectedInventoryBrands(null)
            setUnitOfMeasures([])
            setSelectedUnit(null)
        }

        if (field === "materialSubType") {
            // Logic for materialSubType selection
            setSelectedSubType2(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "material") {
            // Logic for materialSubType selection
            setSelectedInventoryMaterialTypes2(selectedOption); // Set the selected inventory sub-type

        }
        if (field === "uom") {
            // Logic for materialSubType selection
            setSelectedUnit(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "genericSpecification") {
            // Logic for materialSubType selection
            setSelectedGenericSpecifications(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "colour") {
            // Logic for materialSubType selection
            setSelectedColors(selectedOption); // Set the selected inventory sub-type
        }
        if (field === "brand") {
            // Logic for materialSubType selection
            setSelectedInventoryBrands(selectedOption); // Set the selected inventory sub-type
        }
    };

    // console.log("form data:",formData)
    // Handle form submission

    const handleCreate = (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.materialType) errors.materialType = "Material Type is required.";
        if (!formData.material) errors.material = "Material is required.";
        if (!formData.materialSubType) errors.materialSubType = "Material Sub Type is required.";
        if (!formData.uom) errors.uom = "UOM is required.";
        if (!formData.effectiveDate) errors.effectiveDate = "Effective Date is required.";
        // if (!formData.rate) errors.rate = "Rate is required.";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        if (editRowIndex !== null) {
            // Edit mode: update the row
            const updatedTableData = tableData.map((row, idx) =>
                idx === editRowIndex
                    ? {
                        ...row,
                        ...formData,
                        materialTypeLabel: inventoryTypes2.find(opt => opt.value === formData.materialType)?.label || "",
                        materialSubTypeLabel: inventorySubTypes2.find(opt => opt.value === formData.materialSubType)?.label || "",
                        materialLabel: inventoryMaterialTypes2.find(opt => opt.value === formData.material)?.label || "",
                        genericSpecificationLabel: genericSpecifications.find(opt => opt.value === formData.genericSpecification)?.label || "",
                        colourLabel: colors.find(opt => opt.value === formData.colour)?.label || "",
                        brandLabel: inventoryBrands.find(opt => opt.value === formData.brand)?.label || "",
                        uomLabel: unitOfMeasures.find(opt => opt.value === formData.uom)?.label || "",
                    }
                    : row
            );
            setTableData(updatedTableData);
            setEditRowIndex(null);
        } else {
            // Add the new row with rateChecked and rateType if rate is present
            const newRow = {
                ...formData,
                rateChecked: !!formData.rate,
                rateType: formData.rate ? "manual" : "",
                avgRateChecked: false,
                poRateChecked: false,
                isDuplicate: false,
            };

            const newTableData = [...tableData, newRow];
            // Add the new row
            // const newTableData = [...tableData, formData];

            // Find if the new row is a duplicate of any previous row
            const isDuplicate = tableData.some(row =>
                row.materialSubType === formData.materialSubType &&
                row.material === formData.material &&
                row.genericSpecification === formData.genericSpecification &&
                row.colour === formData.colour &&
                row.brand === formData.brand
            );

            if (isDuplicate) {
                toast.error("This combination already exists.");
                return; // Don't add the duplicate entry
            }
            // Mark only the last (newly added) row as duplicate if needed
            const updatedTableData = newTableData.map((row, idx) => {
                // if (idx === newTableData.length - 1) {
                //     return { ...row, isDuplicate };
                // }
                // // Remove duplicate flag from previous rows
                // const { isDuplicate, ...rest } = row;
                // return rest;

                if (idx === newTableData.length - 1) {
                    return { ...row, isDuplicate };
                }
                return row;
            });


            // Mark duplicates in the table
            // const updatedTableData = newTableData.map((row, idx, arr) => {
            //     const isDuplicate = arr.some((otherRow, otherIdx) =>
            //         otherIdx !== idx &&
            //         row.materialSubType === otherRow.materialSubType &&
            //         row.material === otherRow.material &&
            //         row.genericSpecification === otherRow.genericSpecification &&
            //         row.colour === otherRow.colour &&
            //         row.brand === otherRow.brand
            //     );
            //     return { ...row, isDuplicate };
            // });

            setTableData(updatedTableData);
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
        }); // Reset form
        setShowModal(false); // Close modal
    };



    // --- Labour Activities Create Handler ---
    const handleCreateLabour = (e) => {
        e.preventDefault();
        const errors = {};

        // Validate category and effective date
        // if (!selectedCategory) errors.category = "Main Category is required.";
        // if (!selectedSubCategory) errors.subCategory = "Sub-category Level 2 is required.";
        // if (!selectedSubCategoryLevel3) errors.subCategory3 = "Sub-category Level 3 is required.";
        // if (!selectedSubCategoryLevel4) errors.subCategory4 = "Sub-category Level 4 is required.";
        // if (!formData.effectiveDate) errors.effectiveDate = "Effective Date is required.";
        // if (!formData.uom) errors.uom = "UOM is required.";

        // Validate each labour row
        // const rowErrors = labourRows.map(row => {
        //     const r = {};
        //     if (!row.activity) r.activity = "Labour Activity is required.";
        //     if (!row.rate || isNaN(parseFloat(row.rate))) r.rate = "Valid Rate is required.";
        //     return r;
        // });
        // // If any row has errors, show error and return
        // if (rowErrors.some(r => Object.keys(r).length > 0)) {
        //     toast.error("Please fill all Labour Activity and Rate fields correctly.");
        //     setFieldErrors(errors);
        //     return;
        // }
        // if (Object.keys(errors).length > 0) {
        //     setFieldErrors(errors);
        //     return;
        // }

        // Duplicate check: prevent same activity in the same category/row
        const seen = new Set();
        const hasDuplicate = labourRows.some(row => {
            const key = `${selectedCategory?.value}|${selectedSubCategory?.value}|${selectedSubCategoryLevel3?.value}|${selectedSubCategoryLevel4?.value}|${row.activity}`;
            if (seen.has(key)) return true;
            seen.add(key);
            return false;
        });
        if (hasDuplicate) {
            toast.error("Duplicate Labour Activity in the same category.");
            return;
        }


        // Prepare new rows for tableData, using per-row UOM and correct mapping, and include subActivities
        console.log("labour rowssss:", labourRows);
        const newRows = labourRows.map(row => ({
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
            subActivities: row.subActivities ? [...row.subActivities] : [],
        }));

        // Edit mode: update the row(s)
        if (editRowIndex !== null) {
            // Replace the row at editRowIndex with the first new row (or all newRows if you want to support multi-edit)
            const updatedTableData = tableData.map((row, idx) =>
                idx === editRowIndex ? newRows[0] : row
            );
            setTableData(updatedTableData);
            setEditRowIndex(null);
        } else {
            // Add all new rows
            setTableData([...tableData, ...newRows]);
        }

        // Reset form and modal
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
    };

    console.log("form data here after add********:", tableData);

    const handleCheckboxChange = (checkboxType, rowIndex) => {
        setTableData((prevData) =>
            prevData.map((row, index) => {
                if (index === rowIndex) {
                    const updatedRow = { ...row };

                    // Handle INR Rate checkbox
                    if (checkboxType === "rate") {
                        const newRateChecked = !row.rateChecked; // Calculate the new state
                        updatedRow.rateChecked = newRateChecked;
                        updatedRow.avgRateChecked = false;
                        updatedRow.poRateChecked = false;

                        // Add or clear the rate value based on the new state
                        // updatedRow.rate = newRateChecked ? row.rate : "";
                        // updatedRow.avgRate = ""; // Clear avgRate
                        // updatedRow.poRate = ""; // Clear poRate
                        updatedRow.rateType = newRateChecked ? "manual" : ""; // Set rateType
                        if (newRateChecked) {
                            updatedRow.rate = row.rate || "0";
                        } // Set rateType
                    }

                    // Handle AVG Rate checkbox
                    if (checkboxType === "avgRate") {
                        const newAvgRateChecked = !row.avgRateChecked; // Calculate the new state
                        updatedRow.avgRateChecked = newAvgRateChecked;
                        updatedRow.rateChecked = false;
                        updatedRow.poRateChecked = false;

                        // Add or clear the avgRate value based on the new state
                        updatedRow.rate = newAvgRateChecked ? "0" : ""; // Dummy value for avgRate
                        // updatedRow.avgRate= ""; // Clear rate
                        // updatedRow.poRate = ""; // Clear poRate
                        updatedRow.rateType = newAvgRateChecked ? "average" : ""; // Set rateType
                        if (newAvgRateChecked) {
                            updatedRow.rate = row.avgRate || "0";
                        } // Set rateType
                    }

                    // Handle PO Rate checkbox
                    if (checkboxType === "poRate") {
                        const newPoRateChecked = !row.poRateChecked; // Calculate the new state
                        updatedRow.poRateChecked = newPoRateChecked;
                        updatedRow.rateChecked = false;
                        updatedRow.avgRateChecked = false;

                        // Add or clear the poRate value based on the new state
                        updatedRow.rate = newPoRateChecked ? "0" : ""; // Dummy value for poRate
                        // updatedRow.poRate = ""; // Clear rate
                        // updatedRow.avgRate = ""; // Clear avgRate
                        updatedRow.rateType = newPoRateChecked ? "last" : ""; // Set rateType
                        updatedRow.rateType = newPoRateChecked ? "last" : ""; // Set rateType
                        if (newPoRateChecked) {
                            updatedRow.rate = row.poRate || "0";
                        }
                    }

                    return updatedRow;
                }
                return row;
            })
        );
    };
    // delete row 
    const handleDeleteRow = (rowIndex) => {
        setTableData((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };


    // States to store data company, project ,subproject ,wing
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    const [wingsOptions, setWingsOptions] = useState([]);

    // Fetch company data on component mount
    useEffect(() => {
        axios.get(`${baseURL}pms/company_setups.json?token=${token}`)
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



  


    // --- Labour Rate Payload Construction ---
    const labourRatePayload = {
        labour_rate_detail: {
            company_id: selectedCompany?.value || "",
            project_id: selectedProject?.value || "",
            pms_site_id: selectedSite?.value || "",
            pms_wing_id: selectedWing?.value || "",
            labour_rates: tableData.map(row => {
                // Find the last non-null category in the chain
                const resource_id = row.subCategory5 || row.subCategory4 || row.subCategory3 || row.subCategory || row.mainCategory;
                console.log("resource id:", resource_id);
                // If only mainCategory is present, resource_type is WorkCategory, else WorkSubCategory
                const isOnlyMain = !!row.mainCategory && !row.subCategory && !row.subCategory3 && !row.subCategory4 && !row.subCategory5;
                const resource_type = isOnlyMain ? "WorkCategory" : "WorkSubCategory";
                return {
                    labour_activity_id: row.activity,
                    resource_id,
                    resource_type,
                    unit_of_measure_id: row.uom,
                    effective_date: row.effectiveDate,
                    rate: row.rate
                };
            })
        }
    };

    console.log("labourRatePayload :", labourRatePayload);
    // console.log("payload :", payload)

    const handleSubmit = () => {
        if (!selectedCompany?.value) {
            toast.error("Please select a company before submitting.");
            return;
        }

        if (!selectedProject?.value) {
            toast.error("Please select a project before submitting.");
            return;
        }

        if (tableData.length === 0) {
            toast.error("Please add at least one material before submitting.");
            return;
        }
        // Validation: Ensure every row has a rateType
        const missingRateType = tableData.some(row => !row.rate);
        if (missingRateType) {
            toast.error("Please add  Rate for every labour activity.");
            return;
        }

        
        setLoading(true);

        const labourRatePayload = {
        labour_rate_detail: {
            company_id: selectedCompany?.value || "",
            project_id: selectedProject?.value || "",
            pms_site_id: selectedSite?.value || "",
            pms_wing_id: selectedWing?.value || "",
            labour_rates: tableData.map(row => {
                // Find the last non-null category in the chain
                const resource_id = row.subCategory5 || row.subCategory4 || row.subCategory3 || row.subCategory || row.mainCategory;
                console.log("resource id:", resource_id);
                // If only mainCategory is present, resource_type is WorkCategory, else WorkSubCategory
                const isOnlyMain = !!row.mainCategory && !row.subCategory && !row.subCategory3 && !row.subCategory4 && !row.subCategory5;
                const resource_type = isOnlyMain ? "WorkCategory" : "WorkSubCategory";
                return {
                    labour_activity_id: row.activity,
                    resource_id,
                    resource_type,
                    unit_of_measure_id: row.uom,
                    effective_date: row.effectiveDate,
                    rate: row.rate
                };
            })
        }
    };

        console.log("Submitting payload:", labourRatePayload);


        // Simulate API call or handle submission logic
        axios
            .post(`${baseURL}labour_rate_details.json?token=${token}`, labourRatePayload)
            .then((response) => {
                alert("Submission successful!");
                console.log("Submission successful:", response.data);
                setLoading(false);
                // Redirect to the list page
                // navigate("/list-page"); // Replace "/list-page" with your actual list page route
                navigate(`/labour-rate-list?token=${token}`);
            })
            .catch((error) => {
                // alert("Error submitting data!");
                console.error("Error submitting data:", error);
                if (error.response && error.response.status === 422) {
                    toast.error("Rates are already created for this.");
                } else {
                    toast.error("Error submitting data!");
                }
                setLoading(false);
            }).finally(() => {
                setLoading(false); // Always executed
            });
    };

    const [selectAllRate, setSelectAllRate] = useState(false);
    const [selectAllAvgRate, setSelectAllAvgRate] = useState(false);
    const [selectAllPoRate, setSelectAllPoRate] = useState(false);

    // Add this new function to handle select all functionality
    const handleSelectAllRates = (rateType) => {
        let updatedTableData = [...tableData];

        switch (rateType) {
            case 'rate':
                setSelectAllRate(!selectAllRate);
                updatedTableData = tableData.map(row => ({
                    ...row,
                    rateChecked: !selectAllRate,
                    avgRateChecked: false,
                    poRateChecked: false,
                    rateType: !selectAllRate ? 'manual' : '',
                }));
                break;

            case 'avgRate': setSelectAllAvgRate(!selectAllAvgRate);
                updatedTableData = tableData.map(row => ({
                    ...row,
                    avgRateChecked: !selectAllAvgRate,
                    rateChecked: false,
                    poRateChecked: false,
                    rateType: !selectAllAvgRate ? 'average' : '',
                    rate: row.avgRate || "0"

                }));
                break;

            case 'poRate':
                setSelectAllPoRate(!selectAllPoRate);
                updatedTableData = tableData.map(row => ({
                    ...row,
                    poRateChecked: !selectAllPoRate,
                    rateChecked: false,
                    avgRateChecked: false,
                    rateType: !selectAllPoRate ? 'last' : '',
                    rate: row.poRate || "0"
                }));
                break;
        }

        setTableData(updatedTableData);
    };
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editingMaterialId, setEditingMaterialId] = useState(null);
    const handleEditRow = (rowIndex, materialId) => {
        setEditRowIndex(rowIndex, materialId);
        setEditingMaterialId(materialId);
    };
    // Place this useEffect in your component:
    // useEffect(() => {
    //     if (editRowIndex !== null && tableData.length > 0) {
    //         // setLoading(true);
    //         const row = tableData[editRowIndex];
    //         setEditingRow(row);
    //         const selectedInventoryTypeOption = inventoryTypes2.find(opt => opt.label === row.materialTypeLabel) || null;
    //         const materialTypeId = selectedInventoryTypeOption ? selectedInventoryTypeOption.value : "";
    //         setFormData({
    //             materialType: materialTypeId || "",
    //             materialTypeLabel: row.materialTypeLabel || "",
    //             materialSubType: row.materialSubType || "",
    //             material: row.material || "",
    //             genericSpecification: row.genericSpecification || "",
    //             colour: row.colour || "",
    //             brand: row.brand || "",
    //             effectiveDate: row.effectiveDate || "",
    //             rate: row.rate || "",
    //             poRate: row.poRate || "",
    //             avgRate: row.avgRate || "",
    //             uom: row.uom || "",
    //         });
    //         setSelectedInventory2(selectedInventoryTypeOption);
    //         setSelectedSubType2(inventorySubTypes2.find(opt => opt.value === row.materialSubType) || null);
    //         setSelectedInventoryMaterialTypes2(inventoryMaterialTypes2.find(opt => opt.value === row.material) || editingMaterialId);
    //         setSelectedGenericSpecifications(genericSpecifications.find(opt => opt.value === row.genericSpecification) || null);
    //         setSelectedColors(colors.find(opt => opt.value === row.colour) || null);
    //         setSelectedInventoryBrands(inventoryBrands.find(opt => opt.value === row.brand) || null);
    //         setSelectedUnit(unitOfMeasures.find(opt => opt.value === row.uom) || null);
    //         setShowModal(true);
    //     }
    //     // Optionally, reset editRowIndex after modal opens if you want
    //     // return () => setEditRowIndex(null);
    // }, [editRowIndex, tableData, editingMaterialId]);


   





    // categories

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
    const [labourRows, setLabourRows] = useState([{ activity: null, rate: "",uom:"" }]);

    // Fetch Labour Activities when all required category levels are selected
    console.log("selected main category:", selectedCategory);
    useEffect(() => {
        const level1 = selectedCategory?.value || "";
        const level2 = selectedSubCategory?.value || "";
        const level3 = selectedSubCategoryLevel3?.value || "";
        const level4 = selectedSubCategoryLevel4?.value || "";
        console.log("Labour Activity Levels:", { level1, level2, level3, level4 });
        // Fetch if any category level is selected
        if (level1 || level2 || level3 || level4) {
            const url = `https://marathon.lockated.com/activity_category_mappings/category_wise_activities.json?token=${token}&q[level_one_id_eq]=${level1}&q[level_two_id_eq]=${level2}&q[level_three_id_eq]=${level3}&q[level_four_id_eq]=${level4}`;
            axios.get(url)
                .then(res => {
                    console.log("res for labour activity:", res.data.mappings)
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
    console.log("labour activity options***********:", labourActivities);

    // Handler for changing a labour activity or rate in a row
    const handleLabourRowChange = (idx, field, value) => {
        setLabourRows(rows => rows.map((row, i) =>
            i === idx ? { ...row, [field]: value } : row
        ));
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
            subActivities.push({ name: '', rate: '', uom: '' });
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


     useEffect(() => {
    if (editRowIndex !== null && tableData.length > 0) {
        const row = tableData[editRowIndex];
        setEditingRow(row);

        // Set material-related fields
        const selectedInventoryTypeOption = inventoryTypes2.find(opt => opt.label === row.materialTypeLabel) || null;
        const materialTypeId = selectedInventoryTypeOption ? selectedInventoryTypeOption.value : "";
        setFormData({
            materialType: materialTypeId || "",
            materialTypeLabel: row.materialTypeLabel || "",
            materialSubType: row.materialSubType || "",
            material: row.material || "",
            genericSpecification: row.genericSpecification || "",
            colour: row.colour || "",
            brand: row.brand || "",
            effectiveDate: row.effectiveDate || "",
            rate: row.rate || "",
            poRate: row.poRate || "",
            avgRate: row.avgRate || "",
            uom: row.uom || "",
        });
        setSelectedInventory2(selectedInventoryTypeOption);
        setSelectedSubType2(inventorySubTypes2.find(opt => opt.value === row.materialSubType) || null);
        setSelectedInventoryMaterialTypes2(inventoryMaterialTypes2.find(opt => opt.value === row.material) || editingMaterialId);
        setSelectedGenericSpecifications(genericSpecifications.find(opt => opt.value === row.genericSpecification) || null);
        setSelectedColors(colors.find(opt => opt.value === row.colour) || null);
        setSelectedInventoryBrands(inventoryBrands.find(opt => opt.value === row.brand) || null);
        setSelectedUnit(unitOfMeasures.find(opt => opt.value === row.uom) || null);

        // Set category/subcategory chain
        setSelectedCategory(
            workCategories.find(opt => opt.id === row.mainCategory) || null
        );
        setSelectedSubCategory(
            subCategoryOptions.find(opt => opt.value === row.subCategory) || null
        );
        setSelectedSubCategoryLevel3(
            subCategoryLevel3Options.find(opt => opt.value === row.subCategory3) || null
        );
        setSelectedSubCategoryLevel4(
            subCategoryLevel4Options.find(opt => opt.value === row.subCategory4) || null
        );
        setSelectedSubCategoryLevel5(
            subCategoryLevel5Options.find(opt => opt.value === row.subCategory5) || null
        );



         // Set main category
        const mainCat = workCategories.find(opt => opt.id === row.mainCategory) || null;
        setSelectedCategory(mainCat);

        if (mainCat && mainCat.work_sub_categories) {
            // Set subcategory options and selected subcategory
            const subOpt = mainCat.work_sub_categories.map(subCategory => ({
                value: subCategory.id,
                label: subCategory.name,
            }));
            setSubCategoryOptions(subOpt);
            const subCat = subOpt.find(opt => opt.value === row.subCategory) || null;
            setSelectedSubCategory(subCat);

            // Fetch and set subcategory level 3 options and value
            if (row.subCategory) {
                axios.get(`${baseURL}work_sub_categories/${row.subCategory}.json?token=${token}`)
                    .then(response => {
                        const sub3Opts = (response.data.work_sub_categories || []).map(subSubCategory => ({
                            value: subSubCategory.id,
                            label: subSubCategory.name,
                        }));
                        setSubCategoryLevel3Options(sub3Opts);
                        const subCat3 = sub3Opts.find(opt => opt.value === row.subCategory3) || null;
                        setSelectedSubCategoryLevel3(subCat3);

                        // Fetch and set subcategory level 4 options and value
                        if (row.subCategory3) {
                            axios.get(`${baseURL}work_sub_categories/${row.subCategory3}.json?token=${token}`)
                                .then(response => {
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
                                });
                        } else {
                            setSelectedSubCategoryLevel4(null);
                            setSelectedSubCategoryLevel5(null);
                        }
                    });
            } else {
                setSelectedSubCategoryLevel3(null);
                setSelectedSubCategoryLevel4(null);
                setSelectedSubCategoryLevel5(null);
            }
        } else {
            setSelectedSubCategory(null);
            setSelectedSubCategoryLevel3(null);
            setSelectedSubCategoryLevel4(null);
            setSelectedSubCategoryLevel5(null);
        }

        // ...set other fields as before...
       


        

        // Set labour activity rows (if you store them as an array)
        if (row.labourRows) {
            setLabourRows(row.labourRows);
        } else {
            // Fallback: set a single row if only one activity per row
            setLabourRows([{
                activity: row.activity || null,
                rate: row.rate || "",
                uom: row.uom || ""
            }]);
        }

        setShowModal(true);
    }
}, [editRowIndex, tableData, editingMaterialId, workCategories]);






    return (
        <>


            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Create Rate (Labour)</h5>
                    <div className="card mt-3 pb-3">

                        <CollapsibleCard title="Create Rate">
                            <div className="card-body mt-0 pt-0">
                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Company <span>*</span></label>
                                            <SingleSelector
                                                options={companyOptions}
                                                onChange={handleCompanyChange}
                                                value={selectedCompany}
                                                placeholder={`Select Project`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">

                                        <div className="form-group">
                                            <label>Project <span>*</span></label>
                                            <SingleSelector
                                                options={projects}
                                                onChange={handleProjectChange}
                                                value={selectedProject}
                                                placeholder={`Select Project`} // Dynamic placeholder

                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Project</label>
                                            <SingleSelector
                                                options={siteOptions}
                                                onChange={handleSiteChange}
                                                value={selectedSite}
                                                placeholder={`Select Sub-Project`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
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
                        </CollapsibleCard>

                        {/* {tableData.map((row, idx) => (
  <pre key={idx}>{JSON.stringify(row, null, 2)}</pre>
))} */}
                        <div className="d-flex justify-content-end mx-2 mt-4 mb-2">
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
                        <div className="mx-3">
                            <div className="tbl-container  mt-1" style={{ maxHeight: "600px" }}>
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Sr.No.</th>
                                            <th className="text-start">Category</th>
                                            <th className="text-start">Activity</th>
                                            
                                            <th className="text-start">UOM</th>

                                            <th className="text-start">Effective Date</th>
                                            <th className="text-start" style={{ width: "140px" }}>Rate (INR) <span>*</span>
                                              
                                            </th>
                                           
                                            {/* <th className="text-start">Edit</th> */}
                                            <th className="text-start">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <td className="text-start"> {index + 1}</td>
                                                        <td className="text-start">
                                                            {[row.mainCategoryLabel, row.subCategoryLabel, row.subCategory3Label, row.subCategory4Label, row.subCategory5Label]
                                                                .filter(Boolean)
                                                                .join(' - ')}
                                                        </td>
                                                        <td className="text-start">{row.activityLabel}</td>
                                                        <td className="text-start">{row.uomLabel}</td>
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
                                                    {/* Render sub-activities as indented rows */}
                                                    {row.subActivities && row.subActivities.length > 0 && row.subActivities.map((sub, subIdx) => (
                                                        <tr key={subIdx} style={{ background: '#f8f9fa' }}>
                                                            <td></td>
                                                            <td colSpan={1} style={{ fontStyle: 'italic', color: '#6c63ff' }}>Sub-Activity: {sub.name}</td>
                                                            <td className="text-start">{sub.rate}</td>
                                                            <td className="text-start">{unitOfMeasures.find(opt => opt.value === sub.uom)?.label || ''}</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))
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
                            <button className="purple-btn2 w-100" onClick={handleSubmit}>Create</button>
                        </div>
                        <div className="col-md-2">
                            <button className="purple-btn1 w-100" onClick={() => navigate(`/labour-rate-list?token=${token}`)}>Cancle</button>
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
                    <p>loading...</p>
                </div>
            )}
            {/* create modal  */}
            {/* <Modal centered size="lg" show={showModal} onHide={() => setShowModal(false)> */}
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
                                            work_sub_categories: category.work_sub_categories, // Include subcategories in the category option
                                        }))}
                                        onChange={handleCategoryChange}
                                        value={selectedCategory}
                                        placeholder={`Select Main category`}
                                    />
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
                                                <div className="row mb-2 align-items-center   mt-3" key={subIdx} 
                                                // style={{ background: '#f8f9fa', borderRadius: 4 }}
                                                >



                                                    <div className="col-md-3 mt-2 ms-1 ps-2 pe-2">
                                                        <div className="form-group">
                                                      <label>Name</label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Sub Activity Name"
                                                            value={sub.name}
                                                            onChange={e => handleSubActivityChange(idx, subIdx, 'name', e.target.value)}
                                                        />
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
                            {console.log("labour rowssss:", labourRows)}



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

export default CreateRateLabour;