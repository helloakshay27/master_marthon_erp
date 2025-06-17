import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
// import Modal from "react-bootstrap/Modal";

const CreateRate = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [rate, setRate] = useState('');
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [isEditing, setIsEditing] = useState(false);  // State to manage edit mode
    const [validationMsg, setValidationMsg] = useState("");
    // // Handle edit button click
    // const handleEditClick = () => {
    //     setIsEditing(!isEditing);  // Toggle edit mode
    // };

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

    // Handle checkbox change
    // const handleCheckboxChange = (checkboxNum) => {
    //     if (checkboxNum === 1) {
    //         setCheckbox1(!checkbox1);
    //         // Disable the rate input and checkbox 2 when checkbox 1 is selected
    //         if (!checkbox1) {
    //             setCheckbox2(false);  // Deselect checkbox 2
    //             // setRate('');           // Clear rate input
    //         }
    //     } else if (checkboxNum === 2) {
    //         setCheckbox2(!checkbox2);
    //         // Disable the rate input and checkbox 1 when checkbox 2 is selected
    //         if (!checkbox2) {
    //             setCheckbox1(false);  // Deselect checkbox 1
    //             // setRate('');           // Clear rate input
    //         }
    //     }
    // };

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
    // const handleCreate = (e) => {
    //     e.preventDefault();
    //     // Check for duplicate combination
    // const isDuplicate = tableData.some(row =>
    //     row.materialSubType === formData.materialSubType &&
    //     row.material === formData.material &&
    //     row.genericSpecification === formData.genericSpecification &&
    //     row.colour === formData.colour &&
    //     row.brand === formData.brand
    // );

    // if (isDuplicate) {
    //     setValidationMsg("This combination is already exists.");
    //     return;
    // } else {
    //     setValidationMsg(""); // Clear message if not duplicate
    // }

    //     setTableData((prevData) => [...prevData, formData]); // Add form data to table
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
    //     }); // Reset form
    //     setShowModal(false); // Close modal
    // };


    const handleCreate = (e) => {
    e.preventDefault();

    // Add the new row
    const newTableData = [...tableData, formData];

    // Find if the new row is a duplicate of any previous row
   const isDuplicate = tableData.some(row =>
        row.materialSubType === formData.materialSubType &&
        row.material === formData.material &&
        row.genericSpecification === formData.genericSpecification &&
        row.colour === formData.colour &&
        row.brand === formData.brand
    );
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


    // const handleCheckboxChange = (checkboxNum) => {
    //     if (checkboxNum === 1) {
    //         setCheckbox1(!checkbox1);
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             avgRate: !checkbox1 ? prevData.rate : "", // Set avgRate if selected, clear if deselected
    //         }));
    //         if (!checkbox1) {
    //             setCheckbox2(false); // Deselect checkbox 2
    //         }
    //     } else if (checkboxNum === 2) {
    //         setCheckbox2(!checkbox2);
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             poRate: !checkbox2 ? prevData.rate : "", // Set poRate if selected, clear if deselected
    //         }));
    //         if (!checkbox2) {
    //             setCheckbox1(false); // Deselect checkbox 1
    //         }
    //     }
    // };

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
                        updatedRow.rate = newRateChecked ? row.rate : "";
                        // updatedRow.avgRate = ""; // Clear avgRate
                        // updatedRow.poRate = ""; // Clear poRate
                        updatedRow.rateType = newRateChecked ? "manual" : ""; // Set rateType
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



    // material type options 

    const [inventoryTypes2, setInventoryTypes2] = useState([]);  // State to hold the fetched data
    const [selectedInventory2, setSelectedInventory2] = useState(null);  // State to hold selected inventory type
    const [inventorySubTypes2, setInventorySubTypes2] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedSubType2, setSelectedSubType2] = useState(null); // State to hold selected sub-type
    const [inventoryMaterialTypes2, setInventoryMaterialTypes2] = useState([]); // State to hold the fetched inventory subtypes
    const [selectedInventoryMaterialTypes2, setSelectedInventoryMaterialTypes2] = useState(null); // State to hold selected sub-type
    // Fetching inventory types data from API on component mount
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


    // Fetch inventory sub-types when an inventory type is selected
    useEffect(() => {
        if (selectedInventory2) {
            //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

            axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${selectedInventory2?.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                .then(response => {
                    // Map the sub-types to options for the select dropdown
                    const options = response.data.map(subType => ({
                        value: subType.id,
                        label: subType.name
                    }));

                    setInventorySubTypes2(options)
                })
                .catch(error => {
                    console.error('Error fetching inventory sub-types:', error);
                });
        }
    }, [selectedInventory2]); // Run this effect whenever the selectedInventory state changes

    // Fetch inventory Material when an inventory type is selected
    useEffect(() => {
        if (selectedInventory2) {
            //   const inventoryTypeIds = selectedInventory.map(item => item.value).join(','); // Get the selected inventory type IDs as a comma-separated list

            axios.get(`${baseURL}pms/inventories.json?q[inventory_type_id_in]=${selectedInventory2?.value}&q[material_category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                .then(response => {
                    // Map the sub-types to options for the select dropdown
                    const options = response.data.map(subType => ({
                        value: subType.id,
                        label: subType.name
                    }));

                    setInventoryMaterialTypes2(options)
                })
                .catch(error => {
                    console.error('Error fetching inventory sub-types:', error);
                });
        }
    }, [selectedInventory2]); // Run this effect whenever the selectedInventory state changes

    // umo api

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


    // for generic specification
    const [genericSpecifications, setGenericSpecifications] = useState([]); // State to hold the fetched generic specifications
    const [selectedGenericSpecifications, setSelectedGenericSpecifications] = useState(null); // Holds the selected generic specifications for each material

    // Fetch generic specifications for materials
    useEffect(() => {

        if (selectedInventoryMaterialTypes2) {
            axios
                .get(
                    `${baseURL}pms/generic_infos.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                )
                .then((response) => {
                    const options = response.data.map((specification) => ({
                        value: specification.id,
                        label: specification.generic_info,
                    }));

                    setGenericSpecifications(options);
                })
                .catch((error) => {
                    console.error("Error fetching generic specifications:", error);
                });
        }

    }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes

    // color
    const [colors, setColors] = useState([]); // State to hold the fetched colors
    const [selectedColors, setSelectedColors] = useState(null); // Holds the selected colors for each material
    useEffect(() => {
        if (selectedInventoryMaterialTypes2) {
            axios
                .get(
                    `${baseURL}pms/colours.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                )
                .then((response) => {
                    const options = response.data.map((color) => ({
                        value: color.id,
                        label: color.colour,
                    }));
                    setColors(options);
                })
                .catch((error) => {
                    console.error("Error fetching colors:", error);
                });
        }
    }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes

    //for brand in material table
    const [inventoryBrands, setInventoryBrands] = useState([]); // State to hold the fetched inventory brands
    const [selectedInventoryBrands, setSelectedInventoryBrands] = useState(null); // Holds the selected brands for each material
    useEffect(() => {
        if (selectedInventoryMaterialTypes2) {
            axios
                .get(
                    `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${selectedInventoryMaterialTypes2.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                )
                .then((response) => {
                    const options = response.data.map((brand) => ({
                        value: brand.id,
                        label: brand.brand_name,
                    }));
                    setInventoryBrands(options);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching inventory brands for material:",
                        error
                    );
                });
        }
    }, [selectedInventoryMaterialTypes2, baseURL]); // Runs when materials or baseURL changes


    const handleEffectiveDateChange = (id, value) => {
        setTableData(prev =>
            prev.map(row =>
                row.id === id ? { ...row, effectiveDate: value } : row
            )
        );
    };

    // Add this function to check for duplicate combinations in your table data
const isDuplicateCombination = (newRow) => {
  return tableData.some(row =>
    row.materialSubType === newRow.materialSubType &&
    row.material === newRow.material &&
    row.genericSpecification === newRow.genericSpecification &&
    row.colour === newRow.colour &&
    row.brand === newRow.brand
  );
};

    //date  modal
    const [showDateModal, setShowDateModal] = useState(false);
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [dateRange, setDateRange] = useState({
        from: formatDate(new Date(new Date().setMonth(new Date().getMonth() - 6))), // 6 months ago
        to: formatDate(new Date()), // Today's date
    });

    // console.log("date ranhe:", dateRange)

    // Add this function in your component for po avg rate
const handleApplyDateRange = async () => {
  try {
    // Prepare the payload
    const payload = {
      rate_detail: {
        company_id:  selectedCompany?.value || "", // Replace with your actual company id state/variable
        from: dateRange.from,
        to: dateRange.to,
        materials: tableData.map(row => ({
          material_id: row.material,
          material_sub_type_id: row.materialSubType,
          generic_info_id: row.genericSpecification || "",
          colour_id: row.colour || "",
          brand_id: row.brand || "",
          uom_id: row.uom || ""
        }))
      }
    };
    console.log("payload detail porate:",payload)

    // Call the API
    const response = await axios.post(
      "https://marathon.lockated.com/rate_details/get_avg_po_rate.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );


    console.log("responce:",response.data)
    // Update tableData with avg_rate and last_rate from response
    const updatedTableData = tableData.map(row => {
      const found = response.data.data.find(
        item =>
          item.material_id === row.material &&
          item.material_sub_type_id === row.materialSubType
      );
      return found
        ? { ...row, avgRate: found.avg_rate, poRate: found.last_rate }
        : row;
    });
console.log("updated table data:",updatedTableData)
    setTableData(updatedTableData);
    setShowDateModal(false); // Close modal
  } catch (error) {
    console.error("Error fetching avg/po rates:", error);
    setShowDateModal(false);
  }
};


// const handleApplyDateRange = async () => {
//   try {
//     // Prepare the payload object
//     const rateDetail = {
//       company_id: selectedCompany.value, // Replace with your actual company id
//       from: dateRange.from,
//       to: dateRange.to,
//       materials: tableData.map(row => ({
//         material_id: row.material,
//         material_sub_type_id: row.materialSubType,
//         generic_info_id: row.genericSpecification || "",
//         colour_id: row.colour || "",
//         brand_id: row.brand || "",
//         uom_id: row.uom || ""
//       }))
//     };
//     console.log("rate details:",rateDetail)

//     // Pass as a JSON string in the query parameter
//     const params = {
//       token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
//       rate_detail: JSON.stringify(rateDetail)
//     };

//     const response = await axios.get(
//       "https://marathon.lockated.com/rate_details/get_avg_po_rate.json",
//       { params }
//     );


//     console.log("responce:",response.data)
//     // Update tableData with avg_rate and last_rate from response
//     const updatedTableData = tableData.map(row => {
//       const found = response.data.data.find(
//         item =>
//           item.material_id === row.material_id &&
//           item.material_sub_type_id === row.material_sub_type_id
//       );
//       return found
//         ? { ...row, avgRate: found.avg_rate, poRate: found.last_rate }
//         : row;
//     });

//     setTableData(updatedTableData);
//     setShowDateModal(false); // Close modal
//   } catch (error) {
//     console.error("Error fetching avg/po rates:", error);
//     setShowDateModal(false);
//   }
// };
    // const payload = {
    //     rate_detail:{
    //     company: selectedCompany?.value || "",
    //     project: selectedProject?.value || "",
    //     subProject: selectedSite?.value || "",
    //     wing: selectedWing?.value || "",
    //     materials: tableData.map(row => ({
    //         material_id: row.material,
    //         material_sub_type_id: row.materialSubType,
    //         generic_info_id: row.genericSpecification || null,
    //         colour_id: row.colour || null,
    //         brand_id: row.brand || null,
    //         uom_id: row.uom || null,
    //         effective_date: row.effectiveDate, // should be in "DD/MM/YYYY" format
    //         rate: row.rate,
    //         rate_type: row.rateType || null
    //     }))
    // }
    //     // material: tableData.map(({ rateChecked, avgRateChecked, poRateChecked, ...rest }) => rest) || []
    // }

    const payload = {
  rate_detail: {
    company: selectedCompany?.value || "",
    project: selectedProject?.value || "",
    subProject: selectedSite?.value || "",
    wing: selectedWing?.value || "",
    materials: tableData.map(row => {
      const material = {
        material_id: row.material,
        material_sub_type_id: row.materialSubType,
        generic_info_id: row.genericSpecification || null,
        colour_id: row.colour || null,
        brand_id: row.brand || null,
        uom_id: row.uom || null,
        effective_date: row.effectiveDate, // should be in "DD/MM/YYYY" format
        rate: row.rate,
        rate_type: row.rateType || null
      };
      if (row.rateType === "average") {
        material.avg_rate_from = dateRange.from||""; // or your dynamic value
        material.avg_rate_to = dateRange.to||"";   // or your dynamic value
      }
    //   console.log("material add:",material)
      return material;
    })
  }
};

console.log("payload :", payload);
    // console.log("payload :", payload)

    const handleSubmit = () => {
        const payload = {rate_detail:{
            company_id: selectedCompany?.value || "",
            project_id: selectedProject?.value || "",
            pms_site_id: selectedSite?.value || "",
            wing_id: selectedWing?.value || "",
            materials: tableData.map(row => ({
            material_id: row.material,
            material_sub_type_id: row.materialSubType,
            generic_info_id: row.genericSpecification || null,
            colour_id: row.colour || null,
            brand_id: row.brand || null,
            uom_id: row.uom || null,
            effective_date: row.effectiveDate, // should be in "DD/MM/YYYY" format
            rate: row.rate,
            rate_type: row.rateType || null
        }))
    }
           
        };

        console.log("Submitting payload:", payload);


        // Simulate API call or handle submission logic
        axios
            .post(`${baseURL}rate_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`, payload)
            .then((response) => {
                 alert("Submission successful!");
                console.log("Submission successful:", response.data);
                // Redirect to the list page
                // navigate("/list-page"); // Replace "/list-page" with your actual list page route
                navigate("/view-rate");
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
                    <h5 class="mt-4">Create Rate</h5>
                    <div className="card mt-3 pb-3">

                        <CollapsibleCard title="Create Rate">
                            <div className="card-body mt-0 pt-0">
                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Company</label>
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
                                            <label>Project</label>
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
                        <div className="d-flex justify-content-end mx-2">
                            {/* <button className="purple-btn2">Bulk Upload</button> */}
                            <button
                                className="purple-btn2"
                                data-bs-toggle="modal"
                                data-bs-target="#addnewModal"
                                onClick={() => setShowModal(true)}
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
                            <div className="tbl-container  mt-1">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Sr.No.</th>
                                            <th className="text-start">Material Type</th>
                                            <th className="text-start">Material</th>
                                            <th className="text-start">Material Sub-Type</th>
                                            <th className="text-start">Generic Specification</th>
                                            <th className="text-start">Colour</th>
                                            <th className="text-start">Brand</th>

                                            <th className="text-start">Effective Date</th>
                                            <th className="text-start">Rate (INR)
                                                <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span>
                                            </th>
                                            <th className="text-start">AVG Rate
                                                <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span>
                                                <span className="ms-2 pt-2" onClick={() => setShowDateModal(true)} style={{ cursor: "pointer" }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-calendar"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm2-3v1h8V1H3z" />
                                                    </svg>
                                                </span>
                                            </th>
                                            <th className="text-start">PO Rate
                                                <span className="ms-2 pt-2">
                                                    <input type="checkbox" />
                                                </span>
                                            </th>
                                            <th className="text-start">UOM</th>
                                            <th className="text-start">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {tableData.length > 0 ? (
                                            tableData.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="text-start"> {index + 1}</td>
                                                    {/* {console.log("materail type:", row.materialType)} */}
                                                    <td className="text-start">{row.materialTypeLabel}</td>
                                                    <td className="text-start">{row.materialLabel}
                                                       {row.isDuplicate && (
        <div className="text-danger" style={{ fontSize: "0.9rem" }}>
          This combination already exists.
        </div>
      )}
                                                    </td>
                                                    <td className="text-start">{row.materialSubTypeLabel}
                                                        {row.isDuplicate && (
        <div className="text-danger" style={{ fontSize: "0.9rem" }}>
          This combination already exists.
        </div>
      )}
                                                    </td>
                                                    <td className="text-start">{row.genericSpecificationLabel}
                                                        {row.isDuplicate && (
        <div className="text-danger" style={{ fontSize: "0.9rem" }}>
          This combination already exists.
        </div>
      )}
                                                    </td>
                                                    <td className="text-start">{row.colourLabel}
                                                        {row.isDuplicate && (
        <div className="text-danger" style={{ fontSize: "0.9rem" }}>
          This combination already exists.
        </div>
      )}
                                                    </td>
                                                    <td className="text-start">{row.brandLabel}
                                                     {row.isDuplicate && (
        <div className="text-danger" style={{ fontSize: "0.9rem" }}>
          This combination already exists.
        </div>
      )}  
                                                    </td>
                                                    <td className="text-start">
                                                        {/* {row.effectiveDate} */}
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={row.effectiveDate || ""}
                                                            onChange={e => handleEffectiveDateChange(row.id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="text-start">

                                                        <div className="d-flex align-items-center gap-2">
                                                            {/* <input
                                                                className="form-control"
                                                                type="number"
                                                                value={row.rate}
                                                                onChange={(e) => handleRateChange(e, index)}
                                                                disabled={checkbox1 || checkbox2}
                                                                placeholder="Enter Rate"
                                                                style={{ maxWidth: "120px" }} // Optional: constrain width
                                                            />
                                                            <input type="checkbox" /> */}

                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={row.rate}
                                                                onChange={(e) => handleRateChange(e, index)}
                                                                disabled={row.avgRateChecked || row.poRateChecked}
                                                                placeholder="Enter Rate"
                                                                style={{ maxWidth: "120px" }}
                                                            />
                                                            <input
                                                                type="checkbox"
                                                                checked={row.rateChecked || false}
                                                                disabled={row.avgRateChecked || row.poRateChecked}
                                                                onChange={() => handleCheckboxChange("rate", index)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="text-start">
                                                        {/* <span data-bs-toggle="modal" data-bs-target="#avgpoModal">5</span>
                                                        <span className="ms-2 pt-2">
                                                            <input type="checkbox"
                                                                checked={checkbox1}
                                                                onChange={() => handleCheckboxChange(1, index)}
                                                                disabled={row.rate !== "" || checkbox2}
                                                            />
                                                        </span> */}
                                                        <span>{row.avgRate }</span>
                                                        {console.log("avg rate:",row.avgRate)}
                                                        <span className="ms-2 pt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={row.avgRateChecked || false}
                                                                onChange={() => handleCheckboxChange("avgRate", index)}
                                                                disabled={row.rateChecked || row.poRateChecked}
                                                            />
                                                        </span>
                                                    </td>
                                                    <td className="text-start">
                                                        {/* <span data-bs-toggle="modal" data-bs-target="#avgpoModal">10</span>
                                                        <span className="ms-2 pt-2">
                                                            <input type="checkbox"
                                                                checked={checkbox2}
                                                                onChange={() => handleCheckboxChange(2, index)}
                                                                disabled={row.rate !== "" || checkbox1}
                                                            />
                                                        </span> */}
                                                        <span>{row.poRate  }</span>
                                                        <span className="ms-2 pt-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={row.poRateChecked || false}
                                                                onChange={() => handleCheckboxChange("poRate", index)}
                                                                disabled={row.rateChecked || row.avgRateChecked}
                                                            />
                                                        </span>
                                                    </td>
                                                    <td className="text-start">{row.uomLabel}</td>
                                                    <td className="text-start">
                                                        {/* <Link to="/view-rate" className="btn mt-0 pt-0">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="#8b0203"
                                                                className="bi bi-eye"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                                            </svg>
                                                        </Link> */}
                                                        {/* <span> <input type="checkbox" /></span> */}
                                                        {/* <button className="btn mt-0 pt-0 " onClick={() => setShowEditModal(true)}>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                className="bi bi-pencil-square"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                                ></path>
                                                            </svg>

                                                        </button> */}
                                                        <button
                                                            className="btn mt-0 pt-0"
                                                            onClick={() => handleDeleteRow(index)} // Use onClick instead of onChange
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
                            <button className="purple-btn1 w-100" onClick={() => navigate("/view-rate")}>Cancle</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* create modal  */}
            <Modal centered size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <h5>Add Material</h5>
                </Modal.Header>
                <Modal.Body>

                    <form acceptCharset="UTF-8">
                        <div className="row">


                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material Type</label>
                                    <SingleSelector
                                        options={inventoryTypes2}  // Provide the fetched options to the select component
                                        value={inventoryTypes2.find((option) => option.value === formData.materialType)} // Bind value to state
                                        placeholder={`Select Material Type`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("materialType", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material Sub Type</label>
                                    <SingleSelector
                                        options={inventorySubTypes2}
                                        value={inventorySubTypes2.find((option) => option.value === formData.materialSubType)} // Bind value to state
                                        placeholder={`Select Material Sub Type`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("materialSubType", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material</label>
                                    <SingleSelector
                                        options={inventoryMaterialTypes2}
                                        value={inventoryMaterialTypes2.find((option) => option.value === formData.material)} // Bind value to state
                                        placeholder={`Select Material`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("material", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Generic Specification</label>
                                    <SingleSelector
                                        options={Array.isArray(genericSpecifications) ? genericSpecifications : []}
                                        value={genericSpecifications.find((option) => option.value === formData.genericSpecification)} // Bind value to state
                                        placeholder={`Select Specification`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("genericSpecification", selectedOption)}
                                    />
                                    {/* {console.log("gen:",genericSpecifications)} */}
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Colour</label>
                                    <SingleSelector
                                        options={colors || []}
                                        value={colors.find((option) => option.value === formData.colour)} // Bind value to stat
                                        placeholder={`Select Colour`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("colour", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Brand</label>
                                    <SingleSelector
                                        options={inventoryBrands || []}
                                        value={inventoryBrands.find((option) => option.value === formData.brand)} // Bind value to state
                                        placeholder={`Select Brand`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("brand", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label>Effective Date</label>
                                    <input className="form-control" type="date" name="effectiveDate"
                                        value={formData.effectiveDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">

                                    <label>Rate</label>
                                    <input className="form-control" type="number" name="rate"
                                        value={formData.rate}
                                        onChange={handleInputChange}
                                    />

                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">UOM</label>
                                    <SingleSelector
                                        options={unitOfMeasures}
                                        value={unitOfMeasures.find((option) => option.value === formData.uom)} // Bind value to state
                                        placeholder={`Select UOM`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange("uom", selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2 justify-content-center mt-5">
                                <div className="col-md-3 mt-2">
                                    <button className="purple-btn2 w-100" onClick={handleCreate}>Add</button>
                                </div>
                                <div className="col-md-3">
                                    <button className="purple-btn1 w-100" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>


                </Modal.Body>
            </Modal>

            {/* date modal */}
            <Modal centered size="md" show={showDateModal} onHide={() => setShowDateModal(false)}>
                <Modal.Header closeButton>
                    <h5>Select Date Range</h5>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>From</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        // value={dateRange.from}
                                        value={dateRange.from.split("/").reverse().join("-")} // Convert DD/MM/YYYY to YYYY-MM-DD
                                        onChange={(e) =>
                                            setDateRange((prev) => ({ ...prev, from: formatDate(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>To</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        // value={dateRange.to}
                                        value={dateRange.to.split("/").reverse().join("-")} // Convert DD/MM/YYYY to YYYY-MM-DD
                                        onChange={(e) =>
                                            setDateRange((prev) => ({ ...prev, to: formatDate(e.target.value) }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="purple-btn2"
                        // onClick={() => {
                        //     console.log("Selected Date Range:", dateRange);
                        //     setShowDateModal(false); // Close modal
                        // }}
                        onClick={handleApplyDateRange}
                    >
                        Apply
                    </button>
                    <button className="purple-btn1" onClick={() => setShowDateModal(false)}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CreateRate;