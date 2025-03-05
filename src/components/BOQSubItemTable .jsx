import React from 'react'
import '../styles/mor.css'
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import CollapsibleCard from './base/Card/CollapsibleCards';
import MaterialModal from "../components/MaterialModal";
import LabourModal from "../components/LabourModal";
import AssetModal from "../components/AssestModal";
import SingleSelector from './base/Select/SingleSelector';
import axios from 'axios';
import { baseURL } from '../confi/apiDomain';


const BOQSubItemTable = ({
  materials,
  setMaterials,
  labours,
  Assets,
  setAssets,
  handleAddMaterials,
  handleDeleteAll,
  handleSelectRow,
  handleAddLabours,
  handleDeleteAllLabour,
  handleSelectRowLabour,
  handleAddAssets,
  handleDeleteAllAssets,
  handleSelectRowAssets,
  predefinedMaterialsData,
  predefinedAssetsData,
  boqSubItems,
  handleInputChange2,
  // boqCostQty
}) => {
  const [materialshowModal, setmaterialShowModal] = useState(false);
  const [assetShowModal, setAssetShowModal] = useState(false);
  const [labourShowModal, setLabourShowModal] = useState(false);

  const openModal = () => setmaterialShowModal(true);
  const closeModal = () => setmaterialShowModal(false);

  const openAssestModal = () => setAssetShowModal(true);
  const closeAssestModal = () => setAssetShowModal(false);

  const openLabourModal = () => setLabourShowModal(true);
  const closeLabourModal = () => setLabourShowModal(false);

  // console.log('assets for boq sub:', Assets)
  // // console.log(' costQuantity: ', boqCostQty)
  // console.log(' boq sub item  in sub table : ', boqSubItems)

  //Material modal and table data handle add or delete

  const [showModal, setShowModal] = useState(false);
  // const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]); // To track selected rows
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDeleteRow = (materialToDelete) => {
    setMaterials((prev) =>
      prev.filter((material) => material.name !== materialToDelete.name)
    );
  };

  // console.log("materials data for  delete in boq sub........:",materials)
  const handleDeleteAllMaterial = () => {
    // setMaterials((prev) =>
    //   prev.filter((material) => !selectedMaterials.includes(material.id))
    // );
    // setSelectedMaterials([]); // Reset selected materials


    // setMaterials((prev) =>
    //   prev.filter((material) => !selectedMaterials.includes(material.id))
    // );
    // setSelectedMaterials([]); // Reset selected materials


    setMaterials((prev) => {
      if (!Array.isArray(prev)) {
        // console.error("Expected 'prev' to be an array, but got:", prev);
        return []; // Fallback to empty array if prev is not an array
      }
      return prev.filter((material) => !selectedMaterials.includes(material.id));
    });
    setSelectedMaterials([]); // Reset selected materials
  

    
  };

  // Handle input change in specific row
  const handleInputChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
    onMaterialsChange(updatedMaterials);  // Pass updated data to parent component
  };

  // Handle adding new material to the table
  const handleAddMaterial = (newMaterial) => {
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    onMaterialsChange(updatedMaterials);  // Pass updated data to parent component
  };

  // Handle material selection for checkbox
  const handleSelectRowMaterial = (materialName) => {
    // const updatedMaterials = [...materials];
    // updatedMaterials[index].selected = !updatedMaterials[index].selected;
    // setMaterials(updatedMaterials);
    // onMaterialsChange(updatedMaterials);  // Pass updated data to parent component


    setSelectedMaterials((prev) =>
      prev.includes(materialName)
        ? prev.filter((name) => name !== materialName) // Unselect the material
        : [...prev, materialName] // Select the material
    );
  };


  //asset modal and table data handle add or delete
  const [showModalAsset, setShowModalAsset] = useState(false);
  // const [Assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([])
  const handleOpenModalAsset = () => setShowModalAsset(true);
  const handleCloseModalAsset = () => setShowModalAsset(false);


  // const handleAddAssets = (newAsset) => {
  //   setAssets((prev) => [
  //     ...prev,
  //     ...newAsset.filter(
  //       (asset) => !prev.some((a) => a.id === asset.id)
  //     ),
  //   ]);
  // };

  const handleDeleteAllAssets2 = () => {
    setAssets((prev) =>
      prev.filter((asset) => !selectedAssets.includes(asset.id))
    );
    setSelectedAssets([]); // Reset selected materials


  };

  const handleSelectRowAssets2 = (index) => {
    const updatedAssets = [...Assets];
    updatedAssets[index].selected = !updatedAssets[index].selected;
    setMaterials(updatedAssets);
    onMaterialsChange(updatedAssets);
  };


  // for subproject material table

  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);  // Holds the selected subtypes for each material
  const [assetSubTypes, setAssetSubTypes] = useState([]);  // For assets
  const [selectedSubTypesAssets, setSelectedSubTypesAssets] = useState([]);
  // Fetch inventory sub-types when materials array changes or inventory type changes
  // useEffect(() => {
  //   // Fetch sub-types only for materials that have an inventory type
  //   materials.forEach((material, index) => {
  //     if (material.inventory_type_id) {
  //       axios.get(`https://marathon.lockated.com/pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${material.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(subType => ({
  //             value: subType.id,
  //             label: subType.name
  //           }));
  //           setInventorySubTypes(prevSubTypes => {
  //             const newSubTypes = [...prevSubTypes];
  //             newSubTypes[index] = options;  // Update sub-types for this specific material
  //             return newSubTypes;
  //           });
  //         })
  //         .catch(error => {
  //           console.error('Error fetching inventory sub-types:', error);
  //         });
  //     }
  //   });
  // }, [materials]);  // Trigger this effect whenever the materials array changes


  // useEffect(() => {
  //   // Fetch sub-types for materials
  //   materials.forEach((material, index) => {
  //     if (material.inventory_type_id) {
  //       axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${material.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(subType => ({
  //             value: subType.id,
  //             label: subType.name
  //           }));
  //           setInventorySubTypes(prevSubTypes => {
  //             const newSubTypes = [...prevSubTypes];
  //             newSubTypes[index] = options;  // Update sub-types for this specific material
  //             return newSubTypes;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching inventory sub-types for material:', error);
  //         });
  //     }
  //   });

  //   // Fetch sub-types for assets
  //   Assets.forEach((asset, index) => {
  //     if (asset.inventory_type_id) {
  //       // console.log('aseets inventory id', asset.inventory_type_id)
  //       axios.get(`${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${asset.inventory_type_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(subType => ({
  //             value: subType.id,
  //             label: subType.name
  //           }));
  //           setAssetSubTypes(prevSubTypes => {
  //             const newSubTypes = [...prevSubTypes];
  //             newSubTypes[index] = options;  // Update sub-types for this specific asset
  //             return newSubTypes;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching inventory sub-types for asset:', error);
  //         });
  //     }
  //   });

  // }, []); // Trigger this effect whenever the materials or assets arrays change


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
            // console.error('Error fetching inventory sub-types for material:', error);
          });
      }
    });
  }, [materials, baseURL]); // Runs when materials change

 
   // Fetch sub-types for assets
   useEffect(() => {
    Assets.forEach((asset, index) => {
      if (asset.inventory_type_id) {
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
            // console.error('Error fetching inventory sub-types for asset:', error);
          });
      }
    });
  }, [Assets, baseURL]); // Runs when assets change


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

  // useEffect(() => {
  //   // Fetch generic specifications for materials
  //   materials.forEach((material) => {
  //     if (material.id) {
  //       axios
  //         .get(`${baseURL}pms/generic_infos.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(specification => ({
  //             value: specification.id,
  //             label: specification.generic_info
  //           }));
  
  //           setGenericSpecifications(prevSpecifications => {
  //             // ✅ Update only if the data has changed
  //             if (JSON.stringify(prevSpecifications[material.id]) !== JSON.stringify(options)) {
  //               return { ...prevSpecifications, [material.id]: options };
  //             }
  //             return prevSpecifications; // No update needed
  //           });
  //         })
  //         // .catch(error => console.error('Error fetching generic specifications:', error));
  //     }
  //   });
  
  //   // Fetch generic specifications for assets
  //   Assets.forEach((asset) => {
  //     if (asset.id) {
  //       axios
  //         .get(`${baseURL}pms/generic_infos.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(specification => ({
  //             value: specification.id,
  //             label: specification.generic_info
  //           }));
  
  //           setAssetGenericSpecifications(prevSpecifications => {
  //             // ✅ Update only if the data has changed
  //             if (JSON.stringify(prevSpecifications[asset.id]) !== JSON.stringify(options)) {
  //               return { ...prevSpecifications, [asset.id]: options };
  //             }
  //             return prevSpecifications; // No update needed
  //           });
  //         })
  //         // .catch(error => console.error('Error fetching generic specifications for asset:', error));
  //     }
  //   });
  // }, []); // Runs only when materials or Assets change
  
  
  useEffect(() => {
    materials.forEach((material) => {
      if (material.id) {
        axios
          .get(`${baseURL}pms/generic_infos.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then((response) => {
            const options = response.data.map((specification) => ({
              value: specification.id,
              label: specification.generic_info,
            }));

            // setGenericSpecifications((prevSpecifications) => {
            //   // Update only if the data has changed
            //   if (JSON.stringify(prevSpecifications[material.id]) !== JSON.stringify(options)) {
            //     return { ...prevSpecifications, [material.id]: options };
            //   }
            //   return prevSpecifications; // No update needed
            // });

            setGenericSpecifications((prevSpecifications) => {
              // Avoid index-based issues. We want to push the new options.
              return [...prevSpecifications, options];
            });
          })
          // .catch(error => console.error('Error fetching generic specifications:', error));
      }
    });
  }, [materials, baseURL]); // Runs only when materials change


   // Fetch generic specifications for assets
   useEffect(() => {
    Assets.forEach((asset) => {
      if (asset.id) {
        axios
          .get(`${baseURL}pms/generic_infos.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
          .then((response) => {
            const options = response.data.map((specification) => ({
              value: specification.id,
              label: specification.generic_info,
            }));

            // setAssetGenericSpecifications((prevSpecifications) => {
            //   // Update only if the data has changed
            //   if (JSON.stringify(prevSpecifications[asset.id]) !== JSON.stringify(options)) {
            //     return { ...prevSpecifications, [asset.id]: options };
            //   }
            //   return prevSpecifications; // No update needed
            // });

            setAssetGenericSpecifications((prevSpecifications) => {
              // Avoid index-based issues. We want to push the new options.
              return [...prevSpecifications, options];
            });
          })
          // .catch(error => console.error('Error fetching generic specifications for asset:', error));
      }
    });
  }, [Assets, baseURL]); // Runs only when Assets change


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
  // useEffect(() => {
  //   // Fetch colors only for materials that have a valid material_id
  //   materials.forEach((material, index) => {
  //     if (material.id) {
  //       axios.get(`${baseURL}pms/colours.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(color => ({
  //             value: color.id,
  //             label: color.colour
  //           }));
  //           setColors(prevColors => {
  //             const newColors = [...prevColors];
  //             newColors[index] = options;  // Update colors for this specific material
  //             return newColors;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching colors:', error);
  //         });
  //     }
  //   });

  //   // Fetch colors for assets
  //   Assets.forEach((asset, index) => {
  //     if (asset.id) {
  //       axios.get(`${baseURL}pms/colours.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(color => ({
  //             value: color.id,
  //             label: color.colour
  //           }));
  //           setAssetColors(prevColors => {
  //             const newColors = [...prevColors];
  //             newColors[index] = options;  // Update colors for this specific asset
  //             return newColors;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching colors for asset:', error);
  //         });
  //     }
  //   });
  // }, []);  // Trigger this effect whenever the materials array changes


  useEffect(() => {
    materials.forEach((material, index) => {
      if (material.id) {
        axios
          .get(`${baseURL}pms/colours.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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
            // console.error('Error fetching colors:', error);
          });
      }
    });
  }, [materials, baseURL]); // Runs when `materials` or `baseURL` changes

  // Fetch colors for assets
  useEffect(() => {
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios
          .get(`${baseURL}pms/colours.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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
            // console.error('Error fetching colors for asset:', error);
          });
      }
    });
  }, [Assets, baseURL]); // Runs when `Assets` or `baseURL` changes

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
  // useEffect(() => {
  //   // Fetch brands only for materials that have a valid material_id
  //   materials.forEach((material, index) => {
  //     if (material.id) {
  //       axios.get(`${baseURL}pms/inventory_brands.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(brand => ({
  //             value: brand.id,
  //             label: brand.brand_name
  //           }));
  //           setInventoryBrands(prevBrands => {
  //             const newBrands = [...prevBrands];
  //             newBrands[index] = options;  // Update brands for this specific material
  //             return newBrands;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching inventory brands:', error);
  //         });
  //     }
  //   });

  //   // Fetch inventory brands for assets
  //   Assets.forEach((asset, index) => {
  //     if (asset.id) {
  //       axios.get(`${baseURL}pms/inventory_brands.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
  //         .then(response => {
  //           const options = response.data.map(brand => ({
  //             value: brand.id,
  //             label: brand.brand_name
  //           }));
  //           setAssetInventoryBrands(prevBrands => {
  //             const newBrands = [...prevBrands];
  //             newBrands[index] = options;  // Update brands for this specific asset
  //             return newBrands;
  //           });
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching inventory brands for asset:', error);
  //         });
  //     }
  //   });
  // }, []);  // Trigger this effect whenever the materials array changes


  useEffect(() => {
    materials.forEach((material, index) => {
      if (material.id) {
        axios
          .get(`${baseURL}pms/inventory_brands.json?q[material_id_eq]=${material.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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
            // console.error('Error fetching inventory brands:', error);
          });
      }
    });
  }, [materials, baseURL]); // Runs when materials or baseURL change

  // Fetch inventory brands for assets
  useEffect(() => {
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios
          .get(`${baseURL}pms/inventory_brands.json?q[material_id_eq]=${asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
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
            // console.error('Error fetching inventory brands for asset:', error);
          });
      }
    });
  }, [Assets, baseURL]); // Runs when assets or baseURL change

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


  // umo api

  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit2, setSelectedUnit2] = useState([]);
  const [selectedUnit3, setSelectedUnit3] = useState([]);

  // Fetching the unit of measures data on component mount
  useEffect(() => {
    axios.get(`${baseURL}unit_of_measures.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then(response => {
        // Mapping the response to the format required by react-select
        const options = response.data.map(unit => ({
          value: unit.id,
          label: unit.name
        }));
        setUnitOfMeasures(options);  // Save the formatted options to state
      })
      .catch(error => {
        // console.error('Error fetching unit of measures:', error);
      });
  }, []);

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
  // // table data material 

  const [coefficientFactors, setCoefficientFactors] = useState(materials.map(() => ''));
  const [estimatedQuantities, setEstimatedQuantities] = useState(materials.map(() => ''));
  const [wastages, setWastages] = useState(materials.map(() => ''));
  const [totalEstimatedQtyWastages, setTotalEstimatedQtyWastages] = useState(materials.map(() => ''));
  const [CostQTY, setCostQTY] = useState(materials.map(() => ''));

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
  };

  const handleTotalEstimatedQtyWastageChange = (index, value) => {
    const updatedTotalEstimatedQtyWastages = [...totalEstimatedQtyWastages];
    updatedTotalEstimatedQtyWastages[index] = value;
    setTotalEstimatedQtyWastages(updatedTotalEstimatedQtyWastages);
  };

  const handleCostQTY = (index, value) => {
    const updatedCostQTY = [...CostQTY];
    updatedCostQTY[index] = value;
    setCostQTY(updatedCostQTY);
  };

  // assets 

  const [assetCoefficientFactors, setAssetCoefficientFactors] = useState(Assets.map(() => ''));
  const [assetEstimatedQuantities, setAssetEstimatedQuantities] = useState(Assets.map(() => ''));
  const [assetWastages, setAssetWastages] = useState(Assets.map(() => ''));
  const [assetTotalEstimatedQtyWastages, setAssetTotalEstimatedQtyWastages] = useState(Assets.map(() => ''));
  const [assetCostQTY, setAssetCostQTY] = useState(Assets.map(() => ''));

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



  useEffect(() => {
    // Assuming you have a function to fetch or get the data
    const predefinedMaterials2 = materials.map((material, index) => ({
      material_id: material.id,
      material_sub_type_id: selectedSubTypes[index] ? selectedSubTypes[index].value : '',
      generic_info_id: selectedGenericSpecifications[index] ? selectedGenericSpecifications[index].value : '',
      colour_id: selectedColors[index] ? selectedColors[index].value : '',
      brand_id: selectedInventoryBrands[index] ? selectedInventoryBrands[index].value : '',
      uom_id:  selectedUnit2[index]? selectedUnit2[index].value : '',
      co_efficient_factor: parseFloat(coefficientFactors[index]) || 0,
      estimated_quantity: parseFloat(estimatedQuantities[index]) || 0,
      wastage: parseFloat(wastages[index]) || 0,
      estimated_quantity_wastage: parseFloat(totalEstimatedQtyWastages[index]) || 0
    }));

    // Once the data is ready, send it to the parent component
    predefinedMaterialsData(predefinedMaterials2);

  }, [
    materials,
    selectedSubTypes,
    selectedGenericSpecifications,
    selectedColors,
    selectedInventoryBrands,
    selectedUnit2,
    coefficientFactors,
    estimatedQuantities,
    wastages,
    totalEstimatedQtyWastages,
    unitOfMeasures
  ]);


  //assets

  useEffect(() => {
    // Assuming you have a function to fetch or get the data
    const predefinedAssets2 = Assets.map((asset, index) => ({
      material_id: asset.id,
      material_sub_type_id: selectedSubTypesAssets[index] ? selectedSubTypesAssets[index].value : '',
      generic_info_id: selectedGenericSpecifications[index] ? selectedGenericSpecifications[index].value : '',
      colour_id: selectedColors[index] ? selectedColors[index].value : '',
      brand_id: selectedInventoryBrands[index] ? selectedInventoryBrands[index].value : '',
      uom_id: selectedUnit3[index]? selectedUnit3[index].value :'',
      co_efficient_factor: parseFloat(assetCoefficientFactors[index]) || 0,
      estimated_quantity: parseFloat(assetEstimatedQuantities[index]) || 0,
      wastage: parseFloat(assetWastages[index]) || 0,
      estimated_quantity_wastage: parseFloat(assetTotalEstimatedQtyWastages[index]) || 0,
      cost_qty: parseFloat(assetCostQTY[index]) || 0,
    }));
    // console.log("assets data :", predefinedAssets2)

    // Once the data is ready, send it to the parent component
    predefinedAssetsData(predefinedAssets2);
  }, [
    Assets,
    selectedSubTypesAssets,
    selectedGenericSpecifications,
    selectedColors,
    selectedInventoryBrands,
    selectedUnit3,
    assetCoefficientFactors,
    assetEstimatedQuantities,
    assetWastages,
    assetTotalEstimatedQtyWastages,
    assetCostQTY,
    unitOfMeasures,
  ]);


  // 

  const handleCostQtyChange = (id, value) => {
    // This will call the parent's handleInputChange2 method
    handleInputChange2(id, cost_quantity, value);
  };

  const [boqQuantity, setBoqQuantity] = useState("");

  // Use effect to sync the qty values with boqSubItems
  useEffect(() => {
    // Collect all qty values from boqSubItems
    const qtyArray = boqSubItems.map((item) => item.cost_quantity);
    setBoqQuantity(qtyArray); // Update the state with the qty values
  }, [boqSubItems]); // Re-run the effect when boqSubItems change

  // console.log("boq sub items......" ,boqSubItems)

  // console.log(" cost........qty", boqQuantity)

  

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

  useEffect(() => {
    calculateEstimatedQuantities();
    calculateTotalEstimatedQtyWastages();
    calculateAssetEstimatedQuantities();
    calculateAssetTotalEstimatedQtyWastages();
  }, [boqQuantity, coefficientFactors, wastages, assetCoefficientFactors, assetWastages]);


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
  // const calculateAssetTotalEstimatedQtyWastages = () => {
  //   if (boqQuantity && assetEstimatedQuantities.length > 0 ) {
  //     const newAssetTotalEstimatedQtyWastages = Assets.map((asset, index) => {
  //       const estimatedQty = parseFloat(assetEstimatedQuantities[index]) || 0;
  //       const wastagePercentage = parseFloat(assetWastages[index]) || 0;
  //       return estimatedQty * (1+wastagePercentage / 100); // Adding wastage percentage
  //     });
  //     setAssetTotalEstimatedQtyWastages(newAssetTotalEstimatedQtyWastages); // Set the total quantities with wastage
  //   }
  // };


  const calculateAssetTotalEstimatedQtyWastages = () => {
    if (boqQuantity && assetEstimatedQuantities.length > 0) {
      const newAssetTotalEstimatedQtyWastages = Assets.map((asset, index) => {
        const estimatedQty = parseFloat(assetEstimatedQuantities[index]) || 0;
        const wastagePercentage = parseFloat(assetWastages[index]) || 0;
        return Math.floor(estimatedQty * (1 + wastagePercentage / 100)); // Remove decimal places
      });
      setAssetTotalEstimatedQtyWastages(newAssetTotalEstimatedQtyWastages); // Set the total quantities with wastage
    }
  };
  
  
  // Effect to recalculate asset quantities when dependencies change
  // useEffect(() => {
  //   calculateAssetEstimatedQuantities();
  //   calculateAssetTotalEstimatedQtyWastages();
  // }, [boqQuantity, assetCoefficientFactors, assetWastages]);

  return (
    <>
      <div className="collapse show">
        <div className="w-100" >
          <CollapsibleCard title="Material">
            <div className="card   mx-3 mt-2">
              <div className="card-body mt-0 pt-0" >
                <div className="tbl-container tbl-container-SpecificBOQ mx-3 mt-1">
                  <table
                  //  className="mb-5" 
                   id="table1"
                  
                  className={`  ${
                    materials.length === 0 ? 'w-100' : 'w-100'
                  }`} 
                  >
                    <thead style={{ zIndex: "0" }}>
                      <tr >
                        <th rowSpan={2} style={{width:"10px"}}>
                          <input type="checkbox"
                            // onChange={(e) => {
                            //   if (e.target.checked) {
                            //     setSelectedMaterials(materials.map((m) => m.name)); // Select all
                            //   } else {
                            //     setSelectedMaterials([]); // Deselect all
                            //   }
                            // }}
                            // checked={selectedMaterials.length === materials.length}

                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMaterials(materials.map((m) => m.id)); // Select all
                              } else {
                                setSelectedMaterials([]); // Deselect all
                              }
                            }}
                            checked={selectedMaterials.length === materials.length}
                          />
                        </th>
                        <th rowSpan={2} style={{width:"10px"}}>Material Type</th>
                        <th rowSpan={2} style={{width:"10px"}}>Material</th>
                        <th rowSpan={2} style={{width:"210px"}}>Material Sub-Type</th>
                        <th rowSpan={2} style={{width:"180px"}}>Generic Specification</th>
                        <th rowSpan={2} style={{width:"170px"}}>Colour </th>
                        <th rowSpan={2} style={{width:"170px"}}>Brand </th>
                        <th rowSpan={2} style={{width:"170px"}}>UOM</th>
                        {/* <th rowSpan={2}>Cost QTY</th> */}
                        <th className="text-center" colSpan={2}>Cost</th>
                        <th rowSpan={2} style={{width:"170px"}}>Wastage%</th>
                        <th rowSpan={2} style={{width:"170px"}}>Total Estimated Qty Wastage</th>
                      </tr>
                      <tr>
                        <th style={{width:"170px"}}>Co-Efficient Factor <span>*</span></th>
                        <th rowSpan={2} style={{width:"170px"}}>Estimated Qty</th>
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
                                onChange={() => handleSelectRowMaterial(material.id)} // Toggle selection
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
                                placeholder={`Select Specification`} // Dynamic placeholder
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
                                // options={unitOfMeasures}  // Providing the options to the select component
                                // onChange={handleUnitChange2}  // Setting the handler when an option is selected
                                // value={unitOfMeasures.find(option => option.value === material.uom_id)||selectedUnit2}
                                // value={unitOfMeasures.find(option => option.value === material.uom_id) || selectedUnit2}
                                placeholder={`Select UOM`} // Dynamic placeholder

                              />
                            </td>
                            {/* <td>   */}
                            {/* <input
                              type="text"
                              className="form-control"

                              placeholder="Cost QTY"
                              value={CostQTY[index] || ''}
                              onChange={(e) => handleCostQTY(index, e.target.value)}
                            /> */}
                            {/* </td> */}
                            <td>
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
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                disabled
                                placeholder="Estimated Qty"

                                value={estimatedQuantities[index] || ''}
                              // onChange={(e) => handleEstimatedQtyChange(index, e.target.value)}

                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Wastage"
                                value={wastages[index] || ''}
                                onChange={(e) => handleWastageChange(index, e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                disabled
                                placeholder="Total Estimated Qty"
                                value={totalEstimatedQtyWastages[index] || ''}
                              // onChange={(e) => handleTotalEstimatedQtyWastageChange(index, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center" style={{ paddingLeft: "400px" }}>
                            No materials added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row mt-3 mx-3">
                  <p>
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myCreateFunction('table1')"
                      onClick={handleOpenModal}
                    >
                      Add Material
                    </button>{" "}
                    |
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      // onclick="myDeleteFunction('table1')"
                      onClick={handleDeleteAllMaterial}
                    >
                      Delete Material
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>
          <MaterialModal
            show={showModal}
            handleClose={handleCloseModal}
            handleAdd={handleAddMaterials}
          />

          <CollapsibleCard title="Assests">
            <div className="card  mx-3 mt-2">
              <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
                <div className="tbl-container tbl-container-SpecificBOQ mx-3 mt-1">
                  <table
                  //  className="mb-5"
                    id="table3"
                    className={`  ${
                      Assets.length === 0 ? 'w-100' : 'w-100'
                    }`} 
                    >
                    <thead style={{ zIndex: "0" }}>
                      <tr>
                        <th rowSpan={2} style={{width:"10px"}}>
                          <input type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAssets(Assets.map((a) => a.id)); // Select all
                              } else {
                                setSelectedAssets([]); // Deselect all
                              }
                            }}
                            checked={selectedAssets.length === Assets.length}
                          />
                        </th>
                        <th rowSpan={2} style={{width:"10px"}}>Assest Type</th>

                        <th rowSpan={2} style={{width:"10px"}}>Assest</th>
                        <th rowSpan={2} style={{width:"210px"}}>Assest Sub-Type</th>
                        <th rowSpan={2} style={{width:"180px"}}>Generic Specification</th>
                        <th rowSpan={2} style={{width:"170px"}}>Colour </th>
                        <th rowSpan={2} style={{width:"170px"}}>Brand </th>
                        <th rowSpan={2} style={{width:"170px"}}>UOM</th>
                        {/* <th rowSpan={2}>Cost QTY</th> */}
                        <th className="text-center" colSpan={2}>Cost</th>
                        <th rowSpan={2} style={{width:"170px"}}>Wastage%</th>
                        <th rowSpan={2} style={{width:"170px"}}>Total Estimated Qty Wastage</th>
                      </tr>
                      <tr>
                        <th style={{width:"170px"}}>Co-Efficient Factor <span>*</span></th>
                        <th rowSpan={2} style={{width:"170px"}}>Estimated Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Assets.length > 0 ? (
                        Assets.map((assets, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                className="ms-5"
                                type="checkbox"
                                checked={selectedAssets.includes(assets.id)} // Check if material is selected
                                onChange={() => handleSelectRowAssets2(assets.id)} // Toggle selection
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
                                placeholder={`Select Specification`} // Dynamic placeholder
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
                                onChange={(selectedOption) => handleUnitChange3(index, selectedOption)}  // Update UOM for the specific material
                                value={selectedUnit3[index]}
                                // options={unitOfMeasures}  // Providing the options to the select component
                                // onChange={handleUnitChange3}  // Setting the handler when an option is selected
                                // value={unitOfMeasures.find(option => option.value === assets.uom_id) || selectedUnit3}
                                // value={unitOfMeasures.find(option => option.value === material.uom_id) || selectedUnit2}
                                placeholder={`Select UOM`} // Dynamic placeholder

                              />
                            </td>
                            {/* <td> */}
                              {/* <input
                              type="text"
                              className="form-control"

                              placeholder="Cost QTY"
                              value={assetCostQTY[index] || ''}
                              onChange={(e) => handleAssetCostQTY(index, e.target.value)}
                            /> */}
                            {/* </td> */}
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
                                onChange={(e) => handleAssetEstimatedQtyChange(index, e.target.value)}

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
                                onChange={(e) => handleAssetTotalEstimatedQtyWastageChange(index, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="text-center" style={{ paddingLeft: "400px" }}>
                            No asset added yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="row mt-3 mx-3">
                  <p>
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      onClick={handleOpenModalAsset}
                    >
                      Add Assests
                    </button>{" "}
                    |
                    <button
                      style={{ color: "var(--red)" }}
                      className="fw-bold text-decoration-underline border-0 bg-white"
                      onclick="myDeleteFunction('table3')"
                      onClick={handleDeleteAllAssets2}
                    >
                      Delete Assests
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </div>
      <AssetModal
        showAssets={showModalAsset}
        handleCloseAssets={handleCloseModalAsset}
        handleAdd={handleAddAssets}
      />


    </>
  )
}

export default BOQSubItemTable 