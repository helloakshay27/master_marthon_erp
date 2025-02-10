import React from "react";
import BOQSubItemTable from "../components/BOQSubItemTable ";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import MaterialModal from "../components/MaterialModal";
import LabourModal from "../components/LabourModal";
import AssetModal from "../components/AssestModal";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import axios from "axios"
import { prepareDataForValidation } from "formik";
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBOQ = () => {
  const [showMaterialLabour, setShowMaterialLabour] = useState(false);
  const [showBOQSubItem, setShowBOQSubItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [errors, setErrors] = useState({
  //   project: false,
  //   itemName: false,
  //   boqQuantity: false,
  //   unit: false,
  // });

  const [errors, setErrors] = useState({});



  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    if (id === "checkbox1") {
      setShowMaterialLabour(checked);
      setShowBOQSubItem(false)
      // Uncheck the other checkbox (checkbox2)
      document.getElementById("checkbox2").checked = false;
    } else if (id === "checkbox2") {
      setShowBOQSubItem(checked);
      setShowMaterialLabour(false)
      // Uncheck the other checkbox (checkbox1)
      document.getElementById("checkbox1").checked = false;
    }
  };
  // bootstrap collaps
  const [expandedRows, setExpandedRows] = useState([]);
  const [table1Rows, setTable1Rows] = useState([{ id: 1, value: '' }]);
  const [table2Rows, setTable2Rows] = useState([{ id: 1, value: '' }]);
  const [count, setcount] = useState([]);
  const [counter, setcounter] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count])

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
    const newRow = { id: table2Rows.length + 1, value: '' };
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

  // Function to delete a row from Table 1
  const deleteRowFromTable1 = (id) => {
    // const newValue = count.pop()
    // console.log("aa", newValue)
    // setcount(newValue)
    // setTable1Rows(table1Rows.filter((row) => row.id !== id));
    setcount(count.filter((row) => row.id !== id))
    setcounter(counter - 1);
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
        (material) => !prev.some((m) => m.id === material.id)
      ),
    ]);
  };

  console.log("materials", materials)

  const handleDeleteRow = (materialToDelete) => {
    setMaterials((prev) =>
      prev.filter((material) => material.id !== materialToDelete.id)
    );
  };

  const handleDeleteAll = () => {
    setMaterials((prev) =>
      prev.filter((material) => !selectedMaterials.includes(material.id))
    );
    setSelectedMaterials([]); // Reset selected materials
  };

  const handleSelectRow = (materialName) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialName)
        ? prev.filter((name) => name !== materialName) // Unselect the material
        : [...prev, materialName] // Select the material
    );
  };



  //Material modal and table data handle add or delete

  const [showModal2, setShowModal2] = useState(false);
  const [materials2, setMaterials2] = useState([]);
  const [selectedMaterials2, setSelectedMaterials2] = useState([]); // To track selected rows
  const handleOpenModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);


  const handleAddMaterials2 = (id, newMaterials) => {
    setMaterials2((prev) => {
      const updatedMaterials = { ...prev };

      if (!updatedMaterials[id]) {
        updatedMaterials[id] = [];
      }

      updatedMaterials[id] = [
        ...updatedMaterials[id],
        ...newMaterials.filter(
          (material) => !updatedMaterials[id].some((m) => m.id === material.id)
        ),
      ];

      return updatedMaterials;
    });
  };

  // const handleAddMaterials2 = (newMaterials) => {
  //   setMaterials2((prev) => [
  //     ...prev,
  //     ...newMaterials.filter(
  //       (material) => !prev.some((m) => m.id === material.id)
  //     ),
  //   ]);
  // };

  console.log("materials", materials2)

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
    setSelectedMaterials((prev) =>
      prev.includes(materialName)
        ? prev.filter((name) => name !== materialName) // Unselect the material
        : [...prev, materialName] // Select the material
    );
  };



  //asset modal and table data handle add or delete
  const [showModalAsset, setShowModalAsset] = useState(false);
  const [Assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([])
  const handleOpenModalAsset = () => setShowModalAsset(true);
  const handleCloseModalAsset = () => setShowModalAsset(false);


  const handleAddAssets = (newAsset) => {
    setAssets((prev) => [
      ...prev,
      ...newAsset.filter(
        (asset) => !prev.some((a) => a.id === asset.id)
      ),
    ]);
  };

  const handleDeleteAllAssets = () => {
    setAssets((prev) =>
      prev.filter((asset) => !selectedAssets.includes(asset.id))
    );
    setSelectedAssets([]); // Reset selected materials
  };

  const handleSelectRowAssets = (assetType) => {
    setSelectedAssets((prev) =>
      prev.includes(assetType)
        ? prev.filter((type) => type !== assetType) // Unselect the material
        : [...prev, assetType] // Select the material
    );
  };


  //asset 2 modal and table data handle add or delete
  const [showModalAsset2, setShowModalAsset2] = useState(false);
  const [Assets2, setAssets2] = useState([]);
  const [selectedAssets2, setSelectedAssets2] = useState([])
  const handleOpenModalAsset2 = () => setShowModalAsset2(true);
  const handleCloseModalAsset2 = () => setShowModalAsset2(false);


  // const handleAddAssets2 = (newAsset) => {
  //   setAssets2((prev) => [
  //     ...prev,
  //     ...newAsset.filter(
  //       (asset) => !prev.some((a) => a.id === asset.id)
  //     ),
  //   ]);
  // };

  const handleAddAssets2 = (id, newAssets) => {
    setAssets2((prev) => {
      const updatedAssets = { ...prev };

      if (!updatedAssets[id]) {
        updatedAssets[id] = [];
      }

      updatedAssets[id] = [
        ...updatedAssets[id],
        ...newAssets.filter(
          (asset) => !updatedAssets[id].some((a) => a.id === asset.id)
        ),
      ];

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
    setSelectedAssets2((prev) =>
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
    axios.get('https://marathon.lockated.com/pms/projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
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


  // main category and sub level2

  const [workCategories, setWorkCategories] = useState([]);  // To store work categories fetched from the API
  const [selectedCategory, setSelectedCategory] = useState(null);  // To store the selected work category
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);  // To store the selected work subcategory
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);  // To store subcategories for the selected category
  const [subCategoryLevel3Options, setSubCategoryLevel3Options] = useState([]);
  const [subCategoryLevel4Options, setSubCategoryLevel4Options] = useState([]);  // Sub-category level 4 options
  const [subCategoryLevel5Options, setSubCategoryLevel5Options] = useState([]);  // Sub-category level 5 options
  const [selectedSubCategoryLevel3, setSelectedSubCategoryLevel3] = useState(null);  // State for selected subcategory level 3
  const [selectedSubCategoryLevel4, setSelectedSubCategoryLevel4] = useState(null);  // State for selected subcategory level 4
  const [selectedSubCategoryLevel5, setSelectedSubCategoryLevel5] = useState(null);  // State for selected subcategory level 5

  // Fetching work categories on component mount
  useEffect(() => {
    axios.get('https://marathon.lockated.com/work_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')  // Replace with your API endpoint
      .then(response => {
        setWorkCategories(response.data.work_categories);  // Save the categories to state
      })
      .catch(error => {
        console.error('Error fetching work categories:', error);
      });
  }, []);

  // Handler for selecting a work category
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setSelectedSubCategory(null);  // Clear subcategory selection when the category changes
    setSubCategoryOptions([]);  // Reset subcategories list
    setSubCategoryLevel3Options([]);  // Clear sub-subcategory options
    setSubCategoryLevel4Options([]);  // Clear level 4 options
    setSubCategoryLevel5Options([]);  // Clear level 5 options
    setSelectedSubCategoryLevel3(null)
    setSelectedSubCategoryLevel4(null)
    setSelectedSubCategoryLevel5(null)

    // If there are subcategories for this category, update the subcategory options
    if (selectedOption && selectedOption.work_sub_categories.length > 0) {
      setSubCategoryOptions(
        selectedOption.work_sub_categories.map(subCategory => ({
          value: subCategory.id,
          label: subCategory.name
        }))
      );
    }
  };

  // Handler for selecting a work subcategory
  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);
    setSubCategoryLevel3Options([]);  // Clear sub-subcategory options on subcategory change
    setSubCategoryLevel4Options([]);  // Clear subcategory level 4 options
    setSubCategoryLevel5Options([]);  // Clear subcategory level 5 options
    setSelectedSubCategoryLevel3(null)
    setSelectedSubCategoryLevel4(null)
    setSelectedSubCategoryLevel5(null)

    // Fetch sub-subcategories using the selected subcategory ID-- level3
    axios.get(` https://newerp.marathonrealty.com/work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then(response => {
        const subSubCategories = response.data.work_sub_categories || [];
        setSubCategoryLevel3Options(
          subSubCategories.map(subSubCategory => ({
            value: subSubCategory.id,
            label: subSubCategory.name
          }))
        );
      })
      .catch(error => {
        console.error('Error fetching sub-subcategories:', error);
      });

  };

  // Handler for selecting a level 3 subcategory
  const handleLevel3Change = (selectedOption) => {
    setSelectedSubCategoryLevel3(selectedOption);
    setSubCategoryLevel4Options([]);  // Clear subcategory level 4 options
    setSubCategoryLevel5Options([]);  // Clear subcategory level 5 options

    // Fetch level 4 subcategories using the selected level 3 subcategory ID
    if (selectedOption && selectedOption.value) {
      axios.get(`https://newerp.marathonrealty.com/work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then(response => {
          const subSubCategories = response.data.work_sub_categories || [];
          setSubCategoryLevel4Options(
            subSubCategories.map(subSubCategory => ({
              value: subSubCategory.id,
              label: subSubCategory.name
            }))
          );
        })
        .catch(error => {
          console.error('Error fetching level 4 subcategories:', error);
        });
    }
  };

  // Handler for selecting a level 4 subcategory
  const handleLevel4Change = (selectedOption) => {
    setSelectedSubCategoryLevel4(selectedOption);
    setSubCategoryLevel5Options([]);  // Clear level 5 options

    // Fetch level 5 subcategories using the selected level 4 subcategory ID
    if (selectedOption && selectedOption.value) {
      axios.get(`https://newerp.marathonrealty.com/work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then(response => {
          const subSubCategories = response.data.work_sub_categories || [];
          setSubCategoryLevel5Options(
            subSubCategories.map(subSubCategory => ({
              value: subSubCategory.id,
              label: subSubCategory.name
            }))
          );
        })
        .catch(error => {
          console.error('Error fetching level 5 subcategories:', error);
        });
    }
  };

  // umo api

  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnit2, setSelectedUnit2] = useState([]);
  const [selectedUnit3, setSelectedUnit3] = useState([]);


  // Fetching the unit of measures data on component mount
  useEffect(() => {
    axios.get('https://marathon.lockated.com/unit_of_measures.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
      .then(response => {
        // Mapping the response to the format required by react-select
        const options = response.data.map(unit => ({
          value: unit.id,
          label: unit.name
        }));
        setUnitOfMeasures(options);  // Save the formatted options to state
      })
      .catch(error => {
        console.error('Error fetching unit of measures:', error);
      });
  }, []);

  // Handler for unit of measure selection
  const handleUnitChange = (selectedOption) => {
    setSelectedUnit(selectedOption);  // Update selected unit state
  };

  // const handleUnitChange2 = (selectedOption) => {
  //   setSelectedUnit2(selectedOption);  // Update selected unit state
  // };

  const handleUnitChange2 = (index, selectedOption) => {
    setSelectedUnit2((prevSelectedUnits) => {
      const newSelectedUnits = [...prevSelectedUnits];
      newSelectedUnits[index] = selectedOption;  // Update UOM for the specific material
      return newSelectedUnits;
    });
  };

  const handleUnitChange3 = (index, selectedOption) => {
    setSelectedUnit3((prevSelectedUnits) => {
      const newSelectedUnits = [...prevSelectedUnits];
      newSelectedUnits[index] = selectedOption;  // Update UOM for the specific material
      return newSelectedUnits;
    });
  };

  // const handleUnitChange3 = (selectedOption) => {
  //   setSelectedUnit3(selectedOption);  // Update selected unit state
  // };



  // for subproject material table

  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtype
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);  // Holds the selected subtypes for each material
  const [assetSubTypes, setAssetSubTypes] = useState([]);  // For assets
  const [selectedSubTypesAssets, setSelectedSubTypesAssets] = useState([]);
  // Fetch inventory sub-types when materials array changes or inventory type changes
  useEffect(() => {
    // Fetch sub-types only for materials that have an inventory type
    materials.forEach((material, index) => {
      if (material.inventory_type_id) {
        axios.get(`https://marathon.lockated.com/pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${material.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(subType => ({
              value: subType.id,
              label: subType.name
            }));
            setInventorySubTypes(prevSubTypes => {
              const newSubTypes = [...prevSubTypes];
              newSubTypes[index] = options;  // Update sub-types for this specific material
              return newSubTypes;
            });
          })
          .catch(error => {
            console.error('Error fetching inventory sub-types:', error);
          });
      }
    });

    // Fetch sub-types for assets
    Assets.forEach((asset, index) => {
      if (asset.inventory_type_id) {
        console.log('aseets inventory id', asset.inventory_type_id)
        axios.get(`https://marathon.lockated.com/pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${asset.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(subType => ({
              value: subType.id,
              label: subType.name
            }));
            setAssetSubTypes(prevSubTypes => {
              const newSubTypes = [...prevSubTypes];
              newSubTypes[index] = options;  // Update sub-types for this specific asset
              return newSubTypes;
            });
          })
          .catch(error => {
            console.error('Error fetching inventory sub-types for asset:', error);
          });
      }
    });
  }, [materials, Assets]);  // Trigger this effect whenever the materials array changes

  // Handler for inventory sub-type selection change
  const handleSubTypeChange = (index, selectedOption) => {
    setSelectedSubTypes(prevSelectedSubTypes => {
      const newSelectedSubTypes = [...prevSelectedSubTypes];
      newSelectedSubTypes[index] = selectedOption;  // Update sub-type for the specific material
      return newSelectedSubTypes;
    });
  };
  const handleSubTypeChangeAssets = (index, selectedOption) => {
    setSelectedSubTypesAssets(prevSelectedSubTypes => {
      const newSelectedSubTypes = [...prevSelectedSubTypes];
      newSelectedSubTypes[index] = selectedOption;  // Update sub-type for the specific material
      return newSelectedSubTypes;
    });
  };


  // for generic specification 
  const [genericSpecifications, setGenericSpecifications] = useState([]);  // State to hold the fetched generic specifications
  const [selectedGenericSpecifications, setSelectedGenericSpecifications] = useState([]);  // Holds the selected generic specifications for each material
  const [assetGenericSpecifications, setAssetGenericSpecifications] = useState([]);  // State to hold the fetched generic specifications for assets
  const [selectedAssetGenericSpecifications, setSelectedAssetGenericSpecifications] = useState([]);  // Holds the selected generic specifications for each asset


  // Fetch generic specifications when materials array changes or material_id changes
  useEffect(() => {
    // Fetch generic specifications only for materials that have a valid material_id
    materials.forEach((material, index) => {
      if (material.id) {
        axios.get(`https://marathon.lockated.com/pms/generic_infos.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(specification => ({
              value: specification.id,
              label: specification.generic_info
            }));
            setGenericSpecifications(prevSpecifications => {
              const newSpecifications = [...prevSpecifications];
              newSpecifications[index] = options;  // Update generic specifications for this specific material
              return newSpecifications;
            });
          })
          .catch(error => {
            console.error('Error fetching generic specifications:', error);
          });
      }
    });
    // Fetch generic specifications for assets
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios.get(`https://marathon.lockated.com/pms/generic_infos.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(specification => ({
              value: specification.id,
              label: specification.generic_info
            }));
            setAssetGenericSpecifications(prevSpecifications => {
              const newSpecifications = [...prevSpecifications];
              newSpecifications[index] = options;  // Update generic specifications for this specific asset
              return newSpecifications;
            });
          })
          .catch(error => {
            console.error('Error fetching generic specifications for asset:', error);
          });
      }
    });
  }, [materials, Assets]);  // Trigger this effect whenever the materials array changes

  // Handler for generic specification selection change
  const handleGenericSpecificationChange = (index, selectedOption) => {
    setSelectedGenericSpecifications(prevSelectedSpecifications => {
      const newSelectedSpecifications = [...prevSelectedSpecifications];
      newSelectedSpecifications[index] = selectedOption;  // Update generic specification for the specific material
      return newSelectedSpecifications;
    });
  };

  const handleGenericSpecificationChangeForAsset = (index, selectedOption) => {
    setSelectedAssetGenericSpecifications(prevSelectedSpecifications => {
      const newSelectedSpecifications = [...prevSelectedSpecifications];
      newSelectedSpecifications[index] = selectedOption;  // Update generic specification for the specific asset
      return newSelectedSpecifications;
    });
  };


  //for color in material table
  const [colors, setColors] = useState([]);  // State to hold the fetched colors
  const [selectedColors, setSelectedColors] = useState([]);  // Holds the selected colors for each material
  const [assetColors, setAssetColors] = useState([]);  // State to hold the fetched colors for assets
  const [selectedAssetColors, setSelectedAssetColors] = useState([]);  // Holds the selected color for each asset
  // Fetch colors when materials array changes or material_id changes
  useEffect(() => {
    // Fetch colors only for materials that have a valid material_id
    materials.forEach((material, index) => {
      if (material.id) {
        axios.get(`https://marathon.lockated.com/pms/colours.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(color => ({
              value: color.id,
              label: color.colour
            }));
            setColors(prevColors => {
              const newColors = [...prevColors];
              newColors[index] = options;  // Update colors for this specific material
              return newColors;
            });
          })
          .catch(error => {
            console.error('Error fetching colors:', error);
          });
      }
    });

    // Fetch colors for assets
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios.get(`https://marathon.lockated.com/pms/colours.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(color => ({
              value: color.id,
              label: color.colour
            }));
            setAssetColors(prevColors => {
              const newColors = [...prevColors];
              newColors[index] = options;  // Update colors for this specific asset
              return newColors;
            });
          })
          .catch(error => {
            console.error('Error fetching colors for asset:', error);
          });
      }
    });
  }, [materials, Assets]);  // Trigger this effect whenever the materials array changes

  // Handler for color selection change
  const handleColorChange = (index, selectedOption) => {
    setSelectedColors(prevSelectedColors => {
      const newSelectedColors = [...prevSelectedColors];
      newSelectedColors[index] = selectedOption;  // Update color for the specific material
      return newSelectedColors;
    });
  };
  const handleAssetColorChange = (index, selectedOption) => {
    setSelectedAssetColors(prevSelectedColors => {
      const newSelectedColors = [...prevSelectedColors];
      newSelectedColors[index] = selectedOption;  // Update color for the specific asset
      return newSelectedColors;
    });
  };


  //for brand in material table
  const [inventoryBrands, setInventoryBrands] = useState([]);  // State to hold the fetched inventory brands
  const [selectedInventoryBrands, setSelectedInventoryBrands] = useState([]);  // Holds the selected brands for each material
  const [assetInventoryBrands, setAssetInventoryBrands] = useState([]);  // State to hold the fetched inventory brands for assets
  const [selectedAssetInventoryBrands, setSelectedAssetInventoryBrands] = useState([]);  // Holds the selected brands for each asset
  // Fetch inventory brands when materials array changes or material_id changes
  useEffect(() => {
    // Fetch brands only for materials that have a valid material_id
    materials.forEach((material, index) => {
      if (material.id) {
        axios.get(`https://marathon.lockated.com/pms/inventory_brands.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(brand => ({
              value: brand.id,
              label: brand.brand_name
            }));
            setInventoryBrands(prevBrands => {
              const newBrands = [...prevBrands];
              newBrands[index] = options;  // Update brands for this specific material
              return newBrands;
            });
          })
          .catch(error => {
            console.error('Error fetching inventory brands:', error);
          });
      }
    });

    // Fetch inventory brands for assets
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios.get(`https://marathon.lockated.com/pms/inventory_brands.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then(response => {
            const options = response.data.map(brand => ({
              value: brand.id,
              label: brand.brand_name
            }));
            setAssetInventoryBrands(prevBrands => {
              const newBrands = [...prevBrands];
              newBrands[index] = options;  // Update brands for this specific asset
              return newBrands;
            });
          })
          .catch(error => {
            console.error('Error fetching inventory brands for asset:', error);
          });
      }
    });
  }, [materials, Assets]);  // Trigger this effect whenever the materials array changes

  // Handler for brand selection change
  const handleBrandChange = (index, selectedOption) => {
    setSelectedInventoryBrands(prevSelectedBrands => {
      const newSelectedBrands = [...prevSelectedBrands];
      newSelectedBrands[index] = selectedOption;  // Update brand for the specific material
      return newSelectedBrands;
    });
  };

  const handleAssetInventoryBrandChange = (index, selectedOption) => {
    setSelectedAssetInventoryBrands(prevSelectedBrands => {
      const newSelectedBrands = [...prevSelectedBrands];
      newSelectedBrands[index] = selectedOption;  // Update brand for the specific asset
      return newSelectedBrands;
    });
  };


  // //payoad creation here 

  // Initialize state for the inputs
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [boqQuantity, setBoqQuantity] = useState('');
  const [note, setNote] = useState('');

  const [coefficientFactors, setCoefficientFactors] = useState(materials.map(() => ''));
  const [estimatedQuantities, setEstimatedQuantities] = useState(materials.map(() => ''));
  const [wastages, setWastages] = useState(materials.map(() => ''));
  const [totalEstimatedQtyWastages, setTotalEstimatedQtyWastages] = useState(materials.map(() => ''));
  const [predefinedMaterialsData, setPredefinedMaterialsData] = useState([])
  const [predefinedAssetsData, setPredefinedAssetsData] = useState([]);

  console.log("parent comp predef2", predefinedMaterialsData)
  const updatePredefinedMaterialsData = (data) => {
    console.log('Received Data in Parent:', data);
    setPredefinedMaterialsData(data); // Update the state with the received data

  };
  const updatePredefinedAssetsData = (data) => {
    console.log('Received Data in Parent (Assets):', data);
    setPredefinedAssetsData(data); // Update the state with the received data
  };

  console.log('assets data from sub', predefinedAssetsData)


  useEffect(() => {
    if (predefinedMaterialsData.length || predefinedAssetsData.length > 0) {
      // Update each boqSubItem with the materials from predefinedMaterialsData
      setBoqSubItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          materials: predefinedMaterialsData, // Update materials for each row
          asset: predefinedAssetsData  // Update assets for each row
        }))
      );
    }
  }, [predefinedMaterialsData, predefinedAssetsData]);

  const [materialsInputes, setMaterialsInputes] = useState([

    {
      coefficientFactor: '',
      estimatedQty: '',
      wastage: '',
      totalEstimatedQtyWastage: ''
    }
  ]);

  console.log("material Input:", materialsInputes)




  // assets 

  const [assetCoefficientFactors, setAssetCoefficientFactors] = useState(Assets.map(() => ''));
  const [assetEstimatedQuantities, setAssetEstimatedQuantities] = useState(Assets.map(() => ''));
  const [assetWastages, setAssetWastages] = useState(Assets.map(() => ''));
  const [assetTotalEstimatedQtyWastages, setAssetTotalEstimatedQtyWastages] = useState(Assets.map(() => ''));
  const [assetCostQTY, setAssetCostQTY] = useState(Assets.map(() => ''));


  // Calculate Asset Estimated Quantities
  const calculateAssetEstimatedQuantities = () => {
    if (boqQuantity && assetCoefficientFactors.length > 0) {
      const newAssetEstimatedQuantities = Assets.map((asset, index) => {
        const coefficient = parseFloat(assetCoefficientFactors[index]) || 1; // default to 1 if no coefficient is set
        return parseFloat(boqQuantity) * coefficient; // simple calculation for estimated quantities
      });
      setAssetEstimatedQuantities(newAssetEstimatedQuantities); // Update the asset estimated quantities
    }
  };

  // Calculate Asset Total Estimated Quantity with Wastages
  const calculateAssetTotalEstimatedQtyWastages = () => {
    if (boqQuantity && assetEstimatedQuantities.length > 0 ) {
      const newAssetTotalEstimatedQtyWastages = Assets.map((asset, index) => {
        const estimatedQty = parseFloat(assetEstimatedQuantities[index]) || 0;
        const wastagePercentage = parseFloat(assetWastages[index]) || 0;
        return estimatedQty * (wastagePercentage / 100); // Adding wastage percentage
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

  const handleAssetWastageChange = (index, value) => {
    const updatedAssetWastages = [...assetWastages];
    updatedAssetWastages[index] = value;
    setAssetWastages(updatedAssetWastages);
  };

  const handleAssetTotalEstimatedQtyWastageChange = (index, value) => {
    const updatedAssetTotalEstimatedQtyWastages = [...assetTotalEstimatedQtyWastages];
    updatedAssetTotalEstimatedQtyWastages[index] = value;
    setAssetTotalEstimatedQtyWastages(updatedAssetTotalEstimatedQtyWastages);
  };

  const handleAssetCostQTY = (index, value) => {
    const updatedAssetCostQTY = [...assetCostQTY];
    updatedAssetCostQTY[index] = value;
    setAssetCostQTY(updatedAssetCostQTY);
  };


  // Example predefined materials data (replace with actual data from your source)
  const predefinedMaterials =
    materials.map((material, index) => ({
      material_id: material.id,
      material_sub_type_id: selectedSubTypes[index] ? selectedSubTypes[index].value : '',
      generic_info_id: selectedGenericSpecifications[index] ? selectedGenericSpecifications[index].value : '', // Safe access with fallback
      colour_id: selectedColors[index] ? selectedColors[index].value : '', // Safe access with fallback
      brand_id: selectedInventoryBrands[index] ? selectedInventoryBrands[index].value : '', // Safe access with fallback
      uom: selectedUnit2[index] ? selectedUnit2[index].value : "", // Safe access with optional chaining
      co_efficient_factor: parseFloat(coefficientFactors[index]) || 0,
      estimated_quantity: parseFloat(estimatedQuantities[index]) || 0,
      wastage: parseFloat(wastages[index]) || 0,
      estimated_quantity_wastage: parseFloat(totalEstimatedQtyWastages[index]) || 0
    }))


  console.log("material data table 1", predefinedMaterials)

  const predefinedAssets = Assets.map((asset, index) => ({
    asset_id: asset.id,
    asset_sub_type_id: selectedSubTypesAssets[index] ? selectedSubTypesAssets[index].value : '',
    generic_info_id: selectedGenericSpecifications[index] ? selectedGenericSpecifications[index].value : '',
    colour_id: selectedColors[index] ? selectedColors[index].value : '',
    brand_id: selectedInventoryBrands[index] ? selectedInventoryBrands[index].value : '',
    uom: selectedUnit3[index] ? selectedUnit3[index].value : '',
    co_efficient_factor: parseFloat(assetCoefficientFactors[index]) || 0,
    estimated_quantity: parseFloat(assetEstimatedQuantities[index]) || 0,
    wastage: parseFloat(assetWastages[index]) || 0,
    estimated_quantity_wastage: parseFloat(assetTotalEstimatedQtyWastages[index]) || 0,
    cost_qty: parseFloat(assetCostQTY[index]) || 0,
  }));



  console.log("asset data table", predefinedAssets);


  //boq sub item t data
  const [boqSubItems, setBoqSubItems] = useState([]);


  const handleInputChange2 = (index, field, value) => {
    const updatedBoq = [...boqSubItems];
    updatedBoq[index][field] = value;
    setBoqSubItems(updatedBoq);
  };

  const handleUnitChangeForRow = (index, selectedOption) => {
    // Ensure to update the correct row's uom_id
    const updatedBoq = [...boqSubItems];
    updatedBoq[index].uom_id = selectedOption ? selectedOption.value : null;  // If no selection, set to null
    setBoqSubItems(updatedBoq);
  };



  console.log("sub item boq row :", boqSubItems)


  const addRowToTable1 = () => {
    // console.log("pre data boq sub add :",predefinedMaterialsData)
    // const newRow = { id: count.length + 1, value: '' };
    // setcount([...count, newRow]);
    // setcounter(counter + 1)
    //sub item
    // Generate a unique ID for the new row
    const newId = count.length + 1; // or use a more sophisticated method like UUID if necessary

    // Update the count (for row management in the table)
    const newCountRow = { id: newId, value: '' };
    setcount((prevCount) => [...prevCount, newCountRow]);

    // Create the new row for boqSubItems
    const newBoqSubItem = {
      id: newId, // Ensure the new sub-item has the same ID as the row in `count`
      name: "",
      description: "",
      notes: "",
      remarks: "",
      cost_quantity: 0,
      uom_id: null,
      materials: [], // Assuming predefinedMaterialsData is available in scope
    };

    // Update boqSubItems with the new sub-item row
    setBoqSubItems((prevItems) => [...prevItems, newBoqSubItem]);

    // Update the counter if necessary (assuming this controls some UI element)
    setcounter(counter + 1);
  };


  const payloadData2 = {
    boq_detail: {
      project_id: selectedProject ? selectedProject.value : null,
      pms_site_id: selectedSite ? selectedSite.value : null,
      pms_wing_id: selectedWing ? selectedWing.value : null,
      item_name: itemName,
      description: description,
      note: note,

      sub_categories: [
        // Always include main category (level 1)
        {
          category_id: selectedCategory?.value,
          level: 1,
        },
        // Only include materials for level 2 if it is selected, and exclude if level 3 is selected
        ...(selectedSubCategory ? [{
          category_id: selectedSubCategory?.value,
          level: 2,
          boq_sub_items: !selectedSubCategoryLevel3 ? boqSubItems : [] // Filter for level 2
        }] : []),

        // Only include materials for level 3 if it is selected, and exclude if level 4 is selected
        ...(selectedSubCategoryLevel3 ? [{
          category_id: selectedSubCategoryLevel3?.value,
          level: 3,
          boq_sub_items: !selectedSubCategoryLevel4 ? boqSubItems : [] // Filter for level 3
        }] : []),

        // Only include materials for level 4 if it is selected
        ...(selectedSubCategoryLevel4 ? [{
          category_id: selectedSubCategoryLevel4?.value,
          level: 4,
          boq_sub_items: !selectedSubCategoryLevel5 ? boqSubItems : [] // Filter for level 4
        }] : []),

        // Only include materials for level 5 if it is selected
        ...(selectedSubCategoryLevel5 ? [{
          category_id: selectedSubCategoryLevel5?.value,
          level: 5,
          boq_sub_items: boqSubItems || [] // Filter for level 5
        }] : []),


      ]

    }
  }
    ;

  console.log("predefine data 2", predefinedMaterialsData)
  console.log('boq sub payload', payloadData2)


  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === 'itemName') {
      setItemName(value);
    } else if (field === 'description') {
      setDescription(value);
    } else if (field === 'boqQuantity') {

      // Only allow non-negative values, including decimals (e.g., "0", "10", "10.5")
      if (value === '' || /^[+]?\d*\.?\d*$/.test(value)) {
        if (parseFloat(value) >= 0) {
          // setBoqQuantity(value); // Update state if value is valid
          setBoqQuantity(value ? Number(value) : '')
          calculateEstimatedQuantities(); // Recalculate estimated quantities on boqQuantity change
          calculateTotalEstimatedQtyWastages();
          calculateAssetEstimatedQuantities();
          calculateAssetTotalEstimatedQtyWastages();
          
        } else {
          setBoqQuantity(''); // Clear the value if it is negative
        }
      }

      // // Ensure the value is a positive number or an empty string
      // const validValue = value === '' || /^\d+(\.\d+)?$/.test(value); // Allow numbers only, including decimals
      // if ( value >= 0) {
      //   setBoqQuantity(value); // Set the value to state if it's valid
      // } else {
      //   setBoqQuantity(''); // Otherwise, reset it or set it to empty
      // }

      // setBoqQuantity(value);
      //   setBoqQuantity(value ? Number(value) : '')
      // calculateEstimatedQuantities(); // Recalculate estimated quantities on boqQuantity change
      // calculateTotalEstimatedQtyWastages();
    } else if (field === 'note') {
      setNote(value);
    }
  };

  // const handleInputChangeBOQQty = (field, value) => {
  //   if (field === 'boqQuantity') {
  //     // Only allow non-negative values, including decimals (e.g., "0", "10", "10.5")
  //     if (value === '' || /^[+]?\d*\.?\d*$/.test(value)) {
  //       if (parseFloat(value) >= 0) {
  //         setBoqQuantity(value); // Update state if value is valid
  //       } else {
  //         setBoqQuantity(''); // Clear the value if it is negative
  //       }
  //     }
  //   }
  // };


  useEffect(() => {
    calculateEstimatedQuantities();
    calculateTotalEstimatedQtyWastages();
    calculateAssetEstimatedQuantities();
    calculateAssetTotalEstimatedQtyWastages();
  }, [boqQuantity, coefficientFactors, wastages,assetCoefficientFactors, assetWastages]); // Recalculate when boqQuantity or coefficientFactors change

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

  const handleWastageChange = (index, value) => {
    const updatedWastages = [...wastages];
    updatedWastages[index] = value;
    setWastages(updatedWastages);
    // calculateEstimatedQuantities(); // Recalculate estimated quantities when coefficient factor changes
    // calculateTotalEstimatedQtyWastages()
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
        const coefficient = coefficientFactors[index] || 1; // Default to 1 if no coefficient is set
        return parseFloat(boqQuantity) * parseFloat(coefficient); // Estimate quantity = boqQuantity * coefficient
      });
      setEstimatedQuantities(newEstimatedQuantities); // Set the calculated estimated quantities
    }
  };

  // Function to calculate total estimated quantities with wastage
  const calculateTotalEstimatedQtyWastages = () => {
    if (boqQuantity && estimatedQuantities.length > 0 ) {
      const newTotalEstimatedQtyWastages = materials.map((material, index) => {
        const estimatedQty = parseFloat(estimatedQuantities[index]) || 0;
        const wastagePercentage = parseFloat(wastages[index]) || 0;
        const totalWithWastage = estimatedQty * (1 + wastagePercentage / 100);
        return parseFloat(totalWithWastage.toFixed(4));; // Adding wastage percentage
      });
      setTotalEstimatedQtyWastages(newTotalEstimatedQtyWastages); // Set the total quantities with wastage
    }
  };



  const handleLevel5Change = (selectedOption) => setSelectedSubCategoryLevel5(selectedOption);

  const handleSubmitMaterialLabour = async () => {

    // Validate mandatory fields
    // Track validation errors
    // const newErrors = {
    //   project: !selectedProject,
    //   itemName: !itemName,
    //   boqQuantity: !boqQuantity,
    //   unit: !selectedUnit,
    // };

    // setErrors(newErrors);
    let validationErrors = {};
    // Validate required fields
    if (!selectedProject) validationErrors.project = 'Project is required.';
    if (!itemName) validationErrors.itemName = 'Item Name is required.';
    if (!selectedUnit) validationErrors.unit = 'UOM is required.';
    if (!boqQuantity) validationErrors.boqQuantity = 'BOQ Quantity is required.';


    // Show toast messages for each missing field
    //  if (!selectedProject) toast.error("Project is required.");
    //  if (!itemName) toast.error("Item Name is required.");
    //  if (!boqQuantity) toast.error("BOQ Quantity is required.");
    //  if (!selectedUnit) toast.error("UOM is required.");

    // if (!newErrors.project && !newErrors.itemName && !newErrors.boqQuantity && !newErrors.unit) {
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      try {
        // Prepare the payload data
        // setLoading(false);

        const payloadData = {
          boq_detail: {
            project_id: selectedProject ? selectedProject.value : null,
            pms_site_id: selectedSite ? selectedSite.value : null,
            pms_wing_id: selectedWing ? selectedWing.value : null,
            item_name: itemName,
            description: description,
            unit_of_measure_id: selectedUnit ? selectedUnit.value : null,
            quantity: boqQuantity,
            note: note,

            sub_categories: [
              // Always include main category (level 1)
              {
                category_id: selectedCategory?.value,
                level: 1,
              },

              // Only include materials for level 2 if it is selected, and exclude if level 3 is selected
              ...(selectedSubCategory ? [{
                category_id: selectedSubCategory?.value,
                level: 2,
                materials: !selectedSubCategoryLevel3 ? predefinedMaterials : [],// Filter for level 2
                assets: !selectedSubCategoryLevel3 ? predefinedAssets : []
              }] : []),

              // Only include materials for level 3 if it is selected, and exclude if level 4 is selected
              ...(selectedSubCategoryLevel3 ? [{
                category_id: selectedSubCategoryLevel3?.value,
                level: 3,
                materials: !selectedSubCategoryLevel4 ? predefinedMaterials : [], // Filter for level 3
                assets: !selectedSubCategoryLevel4 ? predefinedAssets : []
              }] : []),

              // Only include materials for level 4 if it is selected
              ...(selectedSubCategoryLevel4 ? [{
                category_id: selectedSubCategoryLevel4?.value,
                level: 4,
                materials: !selectedSubCategoryLevel5 ? predefinedMaterials : [], // Filter for level 4
                assets: !selectedSubCategoryLevel5 ? predefinedAssets : []
              }] : []),

              // Only include materials for level 5 if it is selected
              ...(selectedSubCategoryLevel5 ? [{
                category_id: selectedSubCategoryLevel5?.value,
                level: 5,
                materials: predefinedMaterials,// Filter for level 5
                assets: predefinedAssets || []
              }] : []),
            ]
          }
        };

        console.log("boq data payload 1 ", payloadData)


        // Axios POST request
        const response = await axios.post(
          'https://marathon.lockated.com/boq_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414',
          payloadData
        );

        // Handle successful response
        if (response.data) {
          navigate('/view-BOQ'); // Navigate to BOQ list on success
        } else {
          toast.error('Failed to create BOQ.', { position: "top-right" });
        }
        // alert("BOQ created successfully")
        // navigate('/view-BOQ');
        console.log('Data posted successfully:', response.data);
        // You can also display a success message or perform other actions after a successful request
        // setLoading(false);
      } catch (error) {
        // Handle error if the request fails
        console.error('Error posting data:', error);
        toast.error('Something went wrong.', { position: "top-right" });
        // Optionally display an error message to the user
      } finally {
        setLoading(false);
      }
    }


  };

  // Handle submit for BOQ SubItem
  const handleSubmitBOQSubItem = async () => {
    // Logic for handling submission when BOQ SubItem is selected
    console.log('BOQ SubItem submitted');

    let validationErrors = {};
    // Validate required fields
    if (!selectedProject) validationErrors.project = 'Project is required.';
    if (!itemName) validationErrors.itemName = 'Item Name is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);


      try {
        // Prepare the payload data

        const payloadData2 = {
          boq_detail: {
            project_id: selectedProject ? selectedProject.value : null,
            pms_site_id: selectedSite ? selectedSite.value : null,
            pms_wing_id: selectedWing ? selectedWing.value : null,
            item_name: itemName,
            description: description,
            note: note,

            sub_categories: [
              // Always include main category (level 1)
              {
                category_id: selectedCategory?.value,
                level: 1,
              },
              // Only include materials for level 2 if it is selected, and exclude if level 3 is selected
              ...(selectedSubCategory ? [{
                category_id: selectedSubCategory?.value,
                level: 2,
                boq_sub_items: !selectedSubCategoryLevel3 ? boqSubItems : [] // Filter for level 2
              }] : []),

              // Only include materials for level 3 if it is selected, and exclude if level 4 is selected
              ...(selectedSubCategoryLevel3 ? [{
                category_id: selectedSubCategoryLevel3?.value,
                level: 3,
                boq_sub_items: !selectedSubCategoryLevel4 ? boqSubItems : [] // Filter for level 3
              }] : []),

              // Only include materials for level 4 if it is selected
              ...(selectedSubCategoryLevel4 ? [{
                category_id: selectedSubCategoryLevel4?.value,
                level: 4,
                boq_sub_items: !selectedSubCategoryLevel5 ? boqSubItems : [] // Filter for level 4
              }] : []),

              // Only include materials for level 5 if it is selected
              ...(selectedSubCategoryLevel5 ? [{
                category_id: selectedSubCategoryLevel5?.value,
                level: 5,
                boq_sub_items: boqSubItems || [] // Filter for level 5
              }] : []),


            ]

          }

        }

        console.log("boq data payload 2 for sub item:", payloadData2)


        // Axios POST request
        const response = await axios.post(
          'https://marathon.lockated.com/boq_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414',
          payloadData2
        );

        // Handle successful response
        if (response.data) {
          navigate('/view-BOQ'); // Navigate to BOQ list on success
        } else {
          toast.error('Failed to create BOQ Sub Item.', { position: "top-right" });
        }
        // alert("BOQ Sub Items created successfully")
        // navigate('/view-BOQ');
        console.log('Data posted successfully:', response.data);
        // You can also display a success message or perform other actions after a successful request

      } catch (error) {
        // Handle error if the request fails
        console.error('Error posting data:', error);
        toast.error('Something went wrong.', { position: "top-right" });
        // Optionally display an error message to the user
      } finally {
        setLoading(false);
      }

    }
  };

  // Handle general submit
  const handleSubmit = () => {
    if (showMaterialLabour) {
      handleSubmitMaterialLabour();
    } else if (showBOQSubItem) {
      handleSubmitBOQSubItem();
    } else {
      console.log('No option selected');
      toast.error('Please select Material/Asset or BOQ Sub-Item.', { position: "top-right" });
    }
  };

  const [file, setFile] = useState(null);
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // You can further process the file, e.g., upload it to a server
      console.log('Selected file:', selectedFile);
    }
  };

  // Trigger the file input click event when the SVG icon is clicked
  const handleIconClick = () => {
    document.getElementById('file-input').click();
  };
  return (
    <>

      <div className="website-content">
        <div className="module-data-section p-4">
          <a href="">Home &gt; Engineering &gt; Create BOQ</a>
          {/* <h5 className="mt-4">Create BOQ</h5> */}
          <div className="tab-content1 active" id="total-content">
            <ToastContainer />
            {/* Total Content Here */}
            <div className="card mt-5 pb-4">
              <CollapsibleCard title="Create Boq">
                <div className="card-body mt-0 pt-0">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Project <span>*</span></label>
                        <SingleSelector
                          options={projectOptions}
                          onChange={handleProjectChange}
                          value={selectedProject}
                          placeholder="Select Project"
                          classNamePrefix="react-select"

                        />
                        {errors.project && (
                          <div className="error-message">{errors.project}</div>
                        )}

                        {/* {errors.project && <span className="text-danger">Project is required.</span>} */}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Sub-project</label>
                        <SingleSelector
                          options={siteOptions}
                          onChange={handleSiteChange}
                          value={selectedSite}
                          placeholder={`Select Sub-project`} // Dynamic placeholder
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Wing</label>
                        <SingleSelector
                          options={wingsOptions}
                          value={selectedWing}
                          placeholder={`Select Wing`} // Dynamic placeholder
                          onChange={handleWingChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Main Category</label>
                        <SingleSelector
                          options={workCategories.map(category => ({
                            value: category.id,
                            label: category.name,
                            work_sub_categories: category.work_sub_categories  // Include subcategories in the category option
                          }))}
                          onChange={handleCategoryChange}
                          value={selectedCategory}
                          placeholder={`Select Main category`}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
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
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Sub-category  Level 3</label>
                        <SingleSelector
                          options={subCategoryLevel3Options}
                          onChange={handleLevel3Change}
                          value={selectedSubCategoryLevel3}
                          placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label> Sub-category  Level 4</label>
                        <SingleSelector
                          options={subCategoryLevel4Options}
                          onChange={handleLevel4Change}
                          value={selectedSubCategoryLevel4}
                          placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label> Sub-category  Level 5</label>
                        <SingleSelector
                          options={subCategoryLevel5Options}
                          onChange={handleLevel5Change}
                          value={selectedSubCategoryLevel5}
                          placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Item Name <span>*</span></label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('itemName', e.target.value)}
                        />
                        {errors.itemName && (
                          <div className="error-message">
                            {errors.itemName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Enter ..."
                          defaultValue={""}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>UOM <span>*</span></label>
                        <SingleSelector
                          options={unitOfMeasures}  // Providing the options to the select component
                          onChange={handleUnitChange}  // Setting the handler when an option is selected
                          value={selectedUnit}  // Setting the selected value
                          placeholder={`Select UOM`} // Dynamic placeholder
                          isDisabled={showBOQSubItem}
                        />
                        {errors.unit && (
                          <div className="error-message">{errors.unit}</div>
                        )}

                      </div>
                    </div>
                    <div className="col-md-4 mt-2">
                      <div className="form-group">
                        <label>BOQ Quantity <span>*</span></label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          fdprocessedid="qv9ju9"
                          onChange={(e) => handleInputChange('boqQuantity', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault(); // Prevent entering "-" or "e" or "E"
                            }
                          }}
                          disabled={showBOQSubItem}
                          min="0"
                        />
                        {errors.boqQuantity && (
                          <div className="error-message">{errors.boqQuantity}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="form-group">
                        <label>Note</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Enter ..."
                          defaultValue={""}
                          onChange={(e) => handleInputChange('note', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row mt-2">

                      {/* Checkboxes */}
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check me-3">
                          <input type="checkbox" className="form-check-input" id="checkbox1" onChange={handleCheckboxChange} />
                          <label
                          // className="form-check-label" htmlFor="checkbox1"
                          >
                            Add Material/Assests
                          </label>
                        </div>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox2" onChange={handleCheckboxChange} />
                          <label
                          // className="form-check-label" htmlFor="checkbox2"
                          >
                            Add BOQ Sub-Item
                          </label>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </CollapsibleCard>

              {showMaterialLabour && (
                <>
                  <CollapsibleCard title="Material">
                    <div className="card mx-3 mt-2">
                      <div className="card-body mt-0 pt-0">
                        <div className="tbl-container mx-3 mt-1">
                          <table className="mb-5">
                            <thead>
                              <tr>
                                <th rowSpan={2}>
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
                                <th rowSpan={2}>Material Type</th>
                                <th rowSpan={2}>Material </th>
                                <th rowSpan={2}>Material Sub-Type</th>
                                <th rowSpan={2}>Generic Specification</th>
                                <th rowSpan={2}>Colour</th>
                                <th rowSpan={2}>Brand</th>
                                <th rowSpan={2}>UOM</th>
                                <th className="text-center" colSpan={2}>Cost</th>
                                <th rowSpan={2}>Wastage%</th>
                                <th rowSpan={2}>
                                  Total Estimated Quantity Wastage
                                </th>


                              </tr>

                              <tr>
                                <th rowSpan={1}>Co-efficient Factor</th>
                                <th rowSpan={1}>Estimated Qty</th>
                              </tr>

                              <tr>
                                <th />
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>E</th>
                                <th>F</th>
                                <th>G</th>
                                <th>H</th>
                                <th>I</th>
                                <th>J</th>
                                <th>K</th>
                              </tr>
                            </thead>
                            <tbody>
                              {materials.length > 0 ? (
                                materials.map((material, index) => (
                                  <tr>
                                    <td>
                                      <input
                                        className="ms-5"
                                        type="checkbox"
                                        checked={selectedMaterials.includes(material.id)} // Check if material is selected
                                        onChange={() => handleSelectRow(material.id)} // Toggle selection
                                      />
                                    </td>
                                    <td>
                                      {material.inventory_type_name}
                                    </td>
                                    <td>
                                      {material.name}
                                    </td>
                                    <td>

                                      <SingleSelector
                                        options={inventorySubTypes[index] || []}  // Get the sub-types for the specific material
                                        onChange={(selectedOption) => handleSubTypeChange(index, selectedOption)}
                                        value={selectedSubTypes[index]}  // Display the selected sub-type for this material
                                        placeholder={`Select Sub-Type`} // Dynamic placeholder
                                      />
                                    </td>

                                    <td>
                                      <SingleSelector
                                        options={genericSpecifications[index] || []}  // Get the generic specifications for the specific material
                                        onChange={(selectedOption) => handleGenericSpecificationChange(index, selectedOption)}
                                        value={selectedGenericSpecifications[index]}  // Display the selected generic specification for this material
                                        placeholder={`Select  Specification`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={colors[index] || []}  // Get the colors for the specific material
                                        onChange={(selectedOption) => handleColorChange(index, selectedOption)}
                                        value={selectedColors[index]}  // Display the selected color for this material
                                        placeholder={`Select Colour`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={inventoryBrands[index] || []}  // Get the brands for the specific material
                                        onChange={(selectedOption) => handleBrandChange(index, selectedOption)}
                                        value={selectedInventoryBrands[index]}  // Display the selected brand for this material
                                        placeholder={`Select Brand`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={unitOfMeasures}  // Providing the options to the select component
                                        onChange={(selectedOption) => handleUnitChange2(index, selectedOption)}  // Update UOM for the specific material
                                        value={selectedUnit2[index]}
                                        placeholder={`Select UOM`} // Dynamic placeholder
                                      />

                                    </td>
                                    <td style={{ width: '200px' }}>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Co-efficient Factor"
                                        value={coefficientFactors[index] || ''}
                                        onKeyDown={(e) => {
                                          if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault(); // Prevent entering "-" or "e" or "E"
                                          }
                                        }}
                                        min="0"
                                        onChange={(e) => handleCoefficientFactorChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td style={{ width: '200px' }}>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Estimated Qty"
                                        disabled
                                        value={estimatedQuantities[index] || ''}
                                      // value={calculateEstimatedQuantities()}

                                      // onChange={(e) => handleEstimatedQtyChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Wastage"
                                        value={wastages[index] || ''}
                                        onChange={(e) => handleWastageChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Total Estimated Quantity Wastage"
                                        disabled
                                        value={totalEstimatedQtyWastages[index] || ''}
                                      // onChange={(e) => handleTotalEstimatedQtyWastageChange(index, e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="12" className="text-center" style={{ paddingLeft: "500px" }}>
                                    No materials added yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
                        <div className="tbl-container mx-3 mt-1">
                          <table className="mb-5">
                            <thead >
                              <tr>
                                <th rowSpan={2}>
                                  <div className="d-flex justify-content-center">
                                    <input className="" type="checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedAssets(Assets.map((a) => a.id)); // Select all
                                        } else {
                                          setSelectedAssets([]); // Deselect all
                                        }
                                      }}
                                      checked={selectedAssets.length === Assets.length}
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
                                <th rowSpan={2}>Assest Type</th>

                                <th rowSpan={2}>Assest</th>
                                <th rowSpan={2}>Assest Sub-Type</th>
                                <th rowSpan={2}>Generic Specification</th>
                                <th rowSpan={2}>Colour</th>
                                <th rowSpan={2}>Brand</th>
                                <th rowSpan={2}>UOM</th>
                                <th className="text-center" colSpan={2}>Cost</th>
                                <th rowSpan={2}>Wastage%</th>
                                <th rowSpan={2}>
                                  Total Estimated Quantity Wastage
                                </th>

                              </tr>
                              <tr>
                                <th>Co-efficient Factor</th>
                                <th rowSpan={2}>Estimated Qty</th>
                              </tr>
                            </thead>
                            <tbody>


                              {Assets.length > 0 ? (
                                Assets.map((assets, index) => (
                                  <tr>
                                    <td>
                                      <input
                                        className="ms-5"
                                        type="checkbox"
                                        checked={selectedAssets.includes(assets.id)} // Check if material is selected
                                        onChange={() => handleSelectRowAssets(assets.id)} // Toggle selection
                                      />
                                    </td>

                                    <td>
                                      {assets.inventory_type_name}
                                    </td>
                                    <td>
                                      {assets.name}
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={assetSubTypes[index] || []}  // Get the sub-types for the specific material
                                        onChange={(selectedOption) => handleSubTypeChangeAssets(index, selectedOption)}
                                        value={selectedSubTypesAssets[index]}  // Display the selected sub-type for this material
                                        placeholder={`Select Sub-Type`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={assetGenericSpecifications[index] || []}  // Get the generic specifications for the specific material
                                        onChange={(selectedOption) => handleGenericSpecificationChangeForAsset(index, selectedOption)}
                                        value={selectedAssetGenericSpecifications[index]}  // Display the selected generic specification for this material
                                        placeholder={`Select  Specification`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={assetColors[index] || []}  // Get the colors for the specific material
                                        onChange={(selectedOption) => handleAssetColorChange(index, selectedOption)}
                                        value={selectedAssetColors[index]}  // Display the selected color for this material
                                        placeholder={`Select Colour`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={assetInventoryBrands[index] || []}  // Get the brands for the specific material
                                        onChange={(selectedOption) => handleAssetInventoryBrandChange(index, selectedOption)}
                                        value={selectedAssetInventoryBrands[index]}  // Display the selected brand for this material
                                        placeholder={`Select Brand`} // Dynamic placeholder
                                      />
                                    </td>
                                    <td>
                                      <SingleSelector
                                        options={unitOfMeasures}  // Providing the options to the select component
                                        onChange={(selectedOption) => handleUnitChange3(index, selectedOption)}  // Setting the handler when an option is selected
                                        value={selectedUnit3[index]}
                                        placeholder={`Select UOM`} // Dynamic placeholder
                                      />

                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Co-efficient Factor"
                                        value={assetCoefficientFactors[index] || ''}
                                        onKeyDown={(e) => {
                                          if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault(); // Prevent entering "-" or "e" or "E"
                                          }
                                        }}
                                        min="0"
                                        onChange={(e) => handleAssetCoefficientFactorChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Estimated Qty"
                                        disabled
                                        value={assetEstimatedQuantities[index] || ''}
                                      // onChange={(e) => handleAssetEstimatedQtyChange(index, e.target.value)}

                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Wastage"
                                        value={assetWastages[index] || ''}
                                        onChange={(e) => handleAssetWastageChange(index, e.target.value)}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Total Estimated Qty"
                                        disabled
                                        value={assetTotalEstimatedQtyWastages[index] || ''}
                                      // onChange={(e) => handleAssetTotalEstimatedQtyWastageChange(index, e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="12" className="text-center"
                                    style={{ paddingLeft: "500px" }}
                                  >
                                    No asset added yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
                  <CollapsibleCard title="BOQ Sub-Item">
                    <div className="card mx-3 mt-2">


                      <div className="card-body mt-0 pt-0">
                        <div className="mt-3">
                          <div className="tbl-container mx-3 mt-1">
                            <table className="table table-bordered">
                              <thead style={{ zIndex: "1" }}>
                                <tr>
                                  <th rowSpan={2}>
                                    <input type="checkbox" />
                                  </th>
                                  <th rowSpan={2}>Expand</th>
                                  <th rowSpan={2}>Sub Item Name</th>
                                  <th rowSpan={2}>Description</th>
                                  <th rowSpan={2}>Notes</th>
                                  <th rowSpan={2}>Remarks</th>
                                  <th rowSpan={2}>UOM</th>
                                  <th colSpan={3}>Cost</th>
                                  <th rowSpan={2}>Document</th>
                                </tr>
                                <tr>
                                  <th colSpan={3}>Quantity</th>

                                </tr>
                              </thead>
                              <tbody>
                                {count.map((el, index) =>
                                (
                                  <>
                                    <tr>
                                      <td>
                                        <input type="checkbox" />
                                      </td>

                                      <td className="text-center">
                                        <button
                                          className="btn btn-link p-0"
                                          onClick={() => toggleRow(el.id)}
                                          aria-label="Toggle row visibility"
                                        >
                                          {expandedRows.includes(el.id) ?

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

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          // defaultValue="MS Fabrication"
                                          placeholder="Enter Sub Item Name"
                                          value={expandedRows.name}
                                          onChange={(e) => handleInputChange2(index, "name", e.target.value)}

                                        />

                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          // defaultValue="MS Fabrication_20010"
                                          placeholder="Enter Description"
                                          className="form-control"
                                          value={expandedRows.description}
                                          onChange={(e) => handleInputChange2(index, "description", e.target.value)}

                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          // defaultValue="MS Fabrication_20010"
                                          placeholder="Enter Notes"
                                          className="form-control"
                                          value={expandedRows.notes}
                                          onChange={(e) => handleInputChange2(index, "notes", e.target.value)}
                                        />
                                      </td>
                                      <td>
                                        <input type="text" defaultValue=""
                                          placeholder="Enter Remark"
                                          value={expandedRows.remarks}
                                          className="form-control"
                                          onChange={(e) => handleInputChange2(index, "remarks", e.target.value)}
                                        />
                                      </td>
                                      <td style={{ width: '200px' }}>
                                        <SingleSelector
                                          onChange={(selectedOption) => handleUnitChangeForRow(index, selectedOption)}  // Update the row's UOM
                                          value={unitOfMeasures.find(option => option.value === unitOfMeasures.uom_id)}
                                          options={unitOfMeasures}  // Providing the options to the select component
                                          placeholder={`Select UOM`} // Dynamic placeholder
                                        />
                                      </td>
                                      <td colSpan={3}>
                                        <input type="number"
                                          value={expandedRows.qty}
                                          onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                              e.preventDefault(); // Prevent entering "-" or "e" or "E"
                                            }
                                          }}
                                          min="0"
                                          placeholder="Enter Quantity"
                                          className="form-control"
                                          onChange={(e) => handleInputChange2(index, "qty", parseFloat(e.target.value))}
                                        />
                                      </td>

                                      <td>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={16}
                                          height={16}
                                          fill="currentColor"
                                          className="bi bi-file-earmark-text"
                                          viewBox="0 0 16 16"
                                          onClick={handleIconClick} // Trigger file input on click
                                        >
                                          <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                          <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                        </svg>
                                        {/* Hidden file input */}
                                        <input
                                          id="file-input"
                                          type="file"
                                          style={{ display: 'none' }} // Hide the file input
                                          onChange={handleFileChange} // Handle file change
                                        />
                                        {/* Display the selected file name */}
                                        {file && <div>Selected File: {file.name}</div>}

                                      </td>
                                    </tr>
                                    {expandedRows.includes(el.id) && (
                                      <tr>
                                        <td colSpan={11}>
                                          {/* <BOQSubItemTable /> */}
                                          <BOQSubItemTable
                                            // materials={materials2}
                                            materials={materials2[el.id] || []}
                                            handleAddMaterials={(newMaterials) => handleAddMaterials2(el.id, newMaterials)}


                                            setMaterials={setMaterials2}

                                            Assets={Assets2[el.id] || []}
                                            setAssets={setAssets2}
                                            // handleAddMaterials={handleAddMaterials2}
                                            handleDeleteAll={handleDeleteAll2}
                                            handleSelectRow={handleSelectRow2}

                                            handleAddAssets={(newMaterials) => handleAddAssets2(el.id, newMaterials)}
                                            handleDeleteAllAssets={handleDeleteAllAssets2}
                                            handleSelectRowAsset={handleSelectRowAssets2}
                                            predefinedMaterialsData={updatePredefinedMaterialsData}
                                            predefinedAssetsData={updatePredefinedAssetsData}
                                            boqSubItems={boqSubItems}
                                          />

                                          {/* <MaterialModal
                                            show={showModal2}
                                            handleClose={handleCloseModal2}
                                            handleAdd={handleAddMaterials2}
                                          /> */}

                                          {/* <AssetModal
                                            showAssets={showModalAsset}
                                            handleCloseAssets={handleCloseModalAsset}
                                            handleAdd={handleAddAssets}
                                          /> */}
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                )
                                )}

                              </tbody>
                            </table>
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
                    <p>Submitting your BOQ...</p>
                  </div>
                )}
                <button className="purple-btn2 w-100" fdprocessedid="u33pye" onClick={handleSubmit}>
                  Create
                </button>
              </div>
              <div className="col-md-2">
                <button className="purple-btn1 w-100" fdprocessedid="u33pye">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Modal start */}
      {/* material modal */}
      {/* <Modal
        centered
        size="lg"
        show={materialshowModal}
        onHide={closeModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Material</h5>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div className="">
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  fdprocessedid="cda5b"
                >
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div>
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead >
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Material Type</th>
                  <th>Material Sub-Type</th>
                  <th>Material</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>ADMIXTURE</td>
                  <td>KGS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>AGGREGATE</td>
                  <td>KAPCHI</td>
                  <td>KAPCHI</td>
                  <td>cft</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>

      </Modal> */}
      {/* material modal */}

      {/* Assest modal */}
      {/* <Modal
        centered
        size="lg"
        show={assetShowModal}
        onHide={closeAssestModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Asset</h5>
        </Modal.Header>
        <Modal.Body> */}
      {/* Pagination and Display options */}
      {/* <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div> */}

      {/* Table for Assets */}
      {/* <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Asset Type</th>
                  <th>Asset Sub-Type</th>
                  <th>Asset</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>Aluminium Ladder</td>
                  <td>NOS</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>21'' IMAC Desktop 4K</td>
                  <td>21'' IMAC Desktop 4K Retina Display</td>
                  <td>21" IMAC Desktop 4K Retina Display</td>
                  <td>NOS</td>
                </tr>
              </tbody>
            </table>
          </div> */}

      {/* Add Button */}
      {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeAssestModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
      {/* Assest modal */}

      {/* Labour modal */}
      {/* <Modal
        centered
        size="lg"
        show={labourShowModal}
        onHide={closeLabourModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Add Labour</h5>
        </Modal.Header>
        <Modal.Body>
          {/* Pagination and Display options */}
      {/* <div className="d-flex justify-content-between px-4 pt-2">
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="d-flex">
              <p className="fw-bold me-2 mt-1">Display</p>
              <div>
                <select className="form-control" style={{ width: "100%" }}>
                  <option selected="selected">10</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
              <p className="fw-bold ms-2 mt-1">Items per Page</p>
            </div>
          </div> */}

      {/* Table for Labour */}
      {/* <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Labour Category</th>
                  <th>Material Sub-Category</th>
                  <th>Labour Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>Departmental Work</td>
                  <td>RCC</td>
                  <td>Carpenter</td>
                </tr>
              </tbody>
            </table>
          </div> */}

      {/* Add Button */}
      {/* <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                onClick={closeLabourModal}
                className="purple-btn2 w-100"
                fdprocessedid="u33pye"
              >
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
      {/* Labour modal */}

      {/* Modal end */}
    </>
  );
};

export default CreateBOQ;
