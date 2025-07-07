import React from "react";
import "../styles/mor.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import CollapsibleCard from "./base/Card/CollapsibleCards";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import MaterialModal from "../components/MaterialModal";
import AssetModal from "../components/AssestModal";
// import SingleSelector from "./base/Select/SingleSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import _ from "lodash"; // Install using `npm install lodash`


const EditBoqSub = ({
  boqDetails,
  setBoqSubItems,
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
  boqSubItemId,
  setMaterialErrors,
  setAssetsErrors,
  // boqCostQty
}) => {
  // console.log('assets for boq sub:', Assets)
  // // console.log(' costQuantity: ', boqCostQty)
  // console.log(' boq sub item  in sub table : ', boqSubItems)

  //Material modal and table data handle add or delete
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

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

  const [unitOfMeasures, setUnitOfMeasures] = useState([]);

  useEffect(() => {
    if (materials?.length > 0) {
      //   setMaterials(boqDetails.materials); // Store materials from boqDetails

      setSelectedSubTypes(materials.map(m => ({
        value: m.pms_inventory_sub_type_id,
        label: m.material_sub_type
      })));

      setSelectedGenericSpecifications(materials.map(m => ({
        value: m.pms_generic_info_id,
        label: m.generic_info
      })));

      setSelectedColors(materials.map(m => ({
        value: m.pms_colour_id,
        label: m.color
      })));

      setSelectedInventoryBrands(materials.map(m => ({
        value: m.pms_inventory_brand_id,
        label: m.brand
      })));

      setSelectedUnit2(materials.map(m => ({
        value: m.unit_of_measure_id,
        label: m.uom
      })));
      // ✅ Correct way to set coefficient factors
      setCoefficientFactors(materials.map(m => m.co_efficient_factor));
      setEstimatedQuantities(materials.map(m => m.estimated_quantity));
      setWastages(materials.map(m => m.wastage));
      setTotalEstimatedQtyWastages(materials.map(m => m.estimated_quantity_wastage));
    }

    //   if (boqDetails?.unit_of_measure_id && unitOfMeasures.length > 0) {
    //       const preselectedUnit = unitOfMeasures.find(
    //           (unit) => unit.value === boqDetails.unit_of_measure_id
    //       );
    //       setSelectedUnit(preselectedUnit || null);
    //   }
    //   setBoqQuantity(boqDetails?.quantity)

    // ✅ Handling assets in the same way
    //   if (boqDetails?.assets?.length > 0) {
    //       setAssets(boqDetails.assets); // Store assets from boqDetails

    //       setSelectedSubTypesAssets(boqDetails.assets.map(a => ({
    //           value: a.pms_inventory_sub_type_id,
    //           label: a.asset_sub_type
    //       })));

    //       setSelectedAssetGenericSpecifications(boqDetails.assets.map(a => ({
    //           value: a.pms_generic_info_id,
    //           label: a.generic_info
    //       })));

    //       setSelectedAssetColors(boqDetails.assets.map(a => ({
    //           value: a.pms_colour_id,
    //           label: a.color
    //       })));

    //       setSelectedAssetInventoryBrands(boqDetails.assets.map(a => ({
    //           value: a.pms_inventory_brand_id,
    //           label: a.brand
    //       })));

    //       setSelectedUnit3(boqDetails.assets.map(a => ({
    //           value: a.unit_of_measure_id,
    //           label: a.uom
    //       })));

    //       // ✅ Setting coefficient factors, estimated quantities, wastages, and total estimated qty for assets
    //       setAssetCoefficientFactors(boqDetails.assets.map(a => a.co_efficient_factor));
    //       setAssetEstimatedQuantities(boqDetails.assets.map(a => a.estimated_quantity));
    //       setAssetWastages(boqDetails.assets.map(a => a.wastage));
    //       setAssetTotalEstimatedQtyWastages(boqDetails.assets.map(a => a.estimated_quantity_wastage));
    //   }





  }, [boqDetails, materials, unitOfMeasures]); // Runs when boqDetails updates



  // const handleDeleteAllMaterial = () => {
  //   console.log("boqSubItemId", boqSubItemId);

  //   setMaterials((prev) => {
  //     console.log("prev", typeof prev, prev);

  //     const filteredMaterials = Object.keys(prev).reduce((acc, key) => {
  //       const materialsArray = prev[key] || [];
  //       acc[key] = materialsArray.filter(
  //         (material) => !selectedMaterials.includes(material.id)
  //       );
  //       return acc;
  //     }, {});

  //     console.log("filteredMaterials", filteredMaterials);

  //     return filteredMaterials;
  //   });
  //   setSelectedMaterials([]);
  // };
  const handleSelectRowMaterial = (materialId, rowIndex) => {
    setSelectedMaterials((prev) => {
      const isSelected = prev.some(
        (selected) =>
          selected.boqSubItemId === boqSubItemId &&
          selected.materialId === materialId &&
          selected.rowIndex === rowIndex
      );

      if (isSelected) {
        return prev.filter(
          (selected) =>
            !(
              selected.boqSubItemId === boqSubItemId &&
              selected.materialId === materialId &&
              selected.rowIndex === rowIndex

            )
        );
      } else {
        return [...prev, { boqSubItemId, materialId, rowIndex }];
      }
    });
  };


  // const handleDeleteAllMaterial = () => {
  //   setMaterials((prev) => {
  //     // Clone the previous state to avoid mutation
  //     const newMaterials = { ...prev };

  //     // Only process the current boqSubItemId
  //     if (newMaterials[boqSubItemId]) {
  //       newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) => 
  //         !selectedMaterials.some(
  //           selected => 
  //             selected.materialId === material.id &&
  //             selected.rowIndex === index &&
  //             selected.boqSubItemId === boqSubItemId
  //         )
  //       );
  //     }

  //     // console.log("Updated materials:", newMaterials);
  //     return newMaterials;
  //   });

  //   // Update dependent states with boqSubItemId-aware cleanup
  //   const updateSelection = (selectionArray = []) =>
  //     selectedMaterials
  //       .filter(selected => selected.boqSubItemId === boqSubItemId)
  //       .reduce((acc, selected) => {
  //         const indexToRemove = selected.rowIndex;
  //         if (indexToRemove >= 0 && indexToRemove < acc.length) {
  //           acc.splice(indexToRemove, 1);
  //         }
  //         return acc;
  //       }, [...selectionArray]);

  //   // Update all dependent states
  //   setSelectedSubTypes(prev => updateSelection(prev));
  //   setSelectedColors(prev => updateSelection(prev));
  //   setSelectedInventoryBrands(prev => updateSelection(prev));
  //   setSelectedUnit2(prev => updateSelection(prev));
  //   setCoefficientFactors(prev => updateSelection(prev));
  //   setEstimatedQuantities(prev => updateSelection(prev));
  //   setWastages(prev => updateSelection(prev));
  //   setTotalEstimatedQtyWastages(prev => updateSelection(prev));
  //   setSelectedGenericSpecifications(prev => updateSelection(prev));

  //   // Clean up selected materials for this boqSubItemId
  //   setSelectedMaterials(prev =>
  //     prev.filter(selected => 
  //       !prev.some(s => 
  //         s.boqSubItemId === boqSubItemId &&
  //         ![boqSubItemId]?.some(
  //           (material, index) => 
  //             material.id === s.materialId && 
  //             index === s.rowIndex
  //         )
  //       )
  //     )
  //   );
  // };




  // deleted materails store 
  const [deletedMaterialIds, setDeletedMaterialIds] = useState([]);

  // const handleDeleteAllMaterial = () => {
  //     // setMaterials((prev) => {
  //     //     // Clone the previous state to avoid mutation
  //     //     const newMaterials = { ...prev };
  //     //     let deletedIds = []; // Temporary array to store deleted IDs

  //     //     // Only process the current boqSubItemId
  //     //     if (newMaterials[boqSubItemId]) {
  //     //         deletedIds = newMaterials[boqSubItemId]
  //     //             .filter((material, index) => 
  //     //                 selectedMaterials.some(
  //     //                     selected => 
  //     //                         selected.materialId === material.id &&
  //     //                         selected.rowIndex === index &&
  //     //                         selected.boqSubItemId === boqSubItemId
  //     //                 )
  //     //             )
  //     //             .map(material => material.id); // Extract deleted material IDs

  //     //         // Remove selected materials
  //     //         newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) => 
  //     //             !selectedMaterials.some(
  //     //                 selected => 
  //     //                     selected.materialId === material.id &&
  //     //                     selected.rowIndex === index &&
  //     //                     selected.boqSubItemId === boqSubItemId
  //     //             )
  //     //         );
  //     //     }

  //     //     // Update deletedMaterialIds state
  //     //     setDeletedMaterialIds(prev => [...prev, ...deletedIds]);

  //     //     return newMaterials;
  //     // });

  //   //   setMaterials((prev) => {
  //   //     const newMaterials = { ...prev };
  //   //     let deletedIds = [];

  //   //     if (newMaterials[boqSubItemId]) {
  //   //         deletedIds = newMaterials[boqSubItemId]
  //   //             .filter((material, index) =>
  //   //                 selectedMaterials.some(
  //   //                     selected =>
  //   //                         selected.materialId === material.id &&
  //   //                         selected.rowIndex === index &&
  //   //                         selected.boqSubItemId === boqSubItemId
  //   //                 )
  //   //             )
  //   //             .map(material => material.id); // Extract only deleted material IDs

  //   //         // Remove selected materials
  //   //         newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) =>
  //   //             !selectedMaterials.some(
  //   //                 selected =>
  //   //                     selected.materialId === material.id &&
  //   //                     selected.rowIndex === index &&
  //   //                     selected.boqSubItemId === boqSubItemId
  //   //             )
  //   //         );
  //   //     }

  //   //     // ✅ Store deleted material IDs in an array
  //   //     setDeletedMaterialIds((prev) => [...prev, ...deletedIds]);

  //   //     return newMaterials;
  //   // });

  //   setMaterials((prev) => {
  //     const newMaterials = { ...prev };
  //     let deletedIds = [];

  //     if (newMaterials[boqSubItemId]) {
  //         deletedIds = newMaterials[boqSubItemId]
  //             .filter((material, index) =>
  //                 selectedMaterials.some(
  //                     selected =>
  //                         selected.materialId === material.id &&
  //                         selected.rowIndex === index &&
  //                         selected.boqSubItemId === boqSubItemId
  //                 )
  //             )
  //             .map(material => material.id);

  //         // Remove selected materials
  //         newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) =>
  //             !selectedMaterials.some(
  //                 selected =>
  //                     selected.materialId === material.id &&
  //                     selected.rowIndex === index &&
  //                     selected.boqSubItemId === boqSubItemId
  //             )
  //         );
  //     }

  //     // ✅ Prevent duplicate IDs by using a Set
  //     setDeletedMaterialIds((prev) => [...new Set([...prev, ...deletedIds])]);

  //     return newMaterials;
  // });

  //     // Function to update dependent states based on boqSubItemId
  //     const updateSelection = (selectionArray = []) =>
  //         selectedMaterials
  //             .filter(selected => selected.boqSubItemId === boqSubItemId)
  //             .reduce((acc, selected) => {
  //                 const indexToRemove = selected.rowIndex;
  //                 if (indexToRemove >= 0 && indexToRemove < acc.length) {
  //                     acc.splice(indexToRemove, 1);
  //                 }
  //                 return acc;
  //             }, [...selectionArray]);

  //     // Update all dependent states
  //     setSelectedSubTypes(prev => updateSelection(prev));
  //     setSelectedColors(prev => updateSelection(prev));
  //     setSelectedInventoryBrands(prev => updateSelection(prev));
  //     setSelectedUnit2(prev => updateSelection(prev));
  //     setCoefficientFactors(prev => updateSelection(prev));
  //     setEstimatedQuantities(prev => updateSelection(prev));
  //     setWastages(prev => updateSelection(prev));
  //     setTotalEstimatedQtyWastages(prev => updateSelection(prev));
  //     setSelectedGenericSpecifications(prev => updateSelection(prev));

  //     // Clean up selected materials for this boqSubItemId
  //     setSelectedMaterials(prev =>
  //         prev.filter(selected => 
  //             !prev.some(s => 
  //                 s.boqSubItemId === boqSubItemId &&
  //                 ![boqSubItemId]?.some(
  //                     (material, index) => 
  //                         material.id === s.materialId && 
  //                         index === s.rowIndex
  //                 )
  //             )
  //         )
  //     );
  // };



  const handleDeleteAllMaterial = () => {
    setMaterials((prev) => {
      const newMaterials = { ...prev };
      let deletedIds = [];

      if (newMaterials[boqSubItemId]) {
        deletedIds = newMaterials[boqSubItemId]
          .filter((material, index) =>
            selectedMaterials.some(
              (selected) =>
                selected.materialId === material.id &&
                selected.rowIndex === index &&
                selected.boqSubItemId === boqSubItemId
            )
          )
          .map((material) => material.id);

        // Remove selected materials
        newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((material, index) =>
          !selectedMaterials.some(
            (selected) =>
              selected.materialId === material.id &&
              selected.rowIndex === index &&
              selected.boqSubItemId === boqSubItemId
          )
        );
      }

      // ✅ Directly update boqSubItems with deleted IDs
      setBoqSubItems((prev) =>
        prev.map((item) =>
          item.id === boqSubItemId
            ? {
              ...item,
              materials: newMaterials[boqSubItemId] || [],
              material_deleted: [...new Set([...(item.deleted || []), ...deletedIds])],
            }
            : item
        )
      );

      return newMaterials;
    });

    // Clean up dependent states
    const updateSelection = (selectionArray = []) =>
      selectedMaterials
        .filter((selected) => selected.boqSubItemId === boqSubItemId)
        .reduce((acc, selected) => {
          const indexToRemove = selected.rowIndex;
          if (indexToRemove >= 0 && indexToRemove < acc.length) {
            acc.splice(indexToRemove, 1);
          }
          return acc;
        }, [...selectionArray]);

    setSelectedSubTypes((prev) => updateSelection(prev));
    setSelectedColors((prev) => updateSelection(prev));
    setSelectedInventoryBrands((prev) => updateSelection(prev));
    setSelectedUnit2((prev) => updateSelection(prev));
    setCoefficientFactors((prev) => updateSelection(prev));
    setEstimatedQuantities((prev) => updateSelection(prev));
    setWastages((prev) => updateSelection(prev));
    setTotalEstimatedQtyWastages((prev) => updateSelection(prev));
    setSelectedGenericSpecifications((prev) => updateSelection(prev));

    // Clean up selectedMaterials
    setSelectedMaterials((prev) =>
      prev.filter((selected) => selected.boqSubItemId !== boqSubItemId)
    );
  };

  console.log("Deleted Material IDs:", deletedMaterialIds);


  // Handle input change in specific row
  const handleInputChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = value;
    setMaterials(updatedMaterials);
    onMaterialsChange(updatedMaterials); // Pass updated data to parent component
  };

  // Handle adding new material to the table
  const handleAddMaterial = (newMaterial) => {
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    onMaterialsChange(updatedMaterials); // Pass updated data to parent component
  };

  // Handle material selection for checkbox
  // const handleSelectRowMaterial = (materialName) => {
  //   // const updatedMaterials = [...materials];
  //   // updatedMaterials[index].selected = !updatedMaterials[index].selected;
  //   // setMaterials(updatedMaterials);
  //   // onMaterialsChange(updatedMaterials);  // Pass updated data to parent component

  //   setSelectedMaterials(
  //     (prev) =>
  //       prev.includes(materialName)
  //         ? prev.filter((name) => name !== materialName) // Unselect the material
  //         : [...prev, materialName] // Select the material
  //   );
  // };



  //asset modal and table data handle add or delete
  const [showModalAsset, setShowModalAsset] = useState(false);
  // const [Assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
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

  // const handleDeleteAllAssets2 = () => {
  //   // setAssets((prev) =>
  //   //   prev.filter((asset) => !selectedAssets.includes(asset.id))
  //   // );
  //   // setSelectedAssets([]); // Reset selected materials

  //   setAssets((prev) => {
  //     if (!Array.isArray(prev)) {
  //       console.error("Expected 'prev' to be an array, but got:", prev);
  //       return []; // Fallback to an empty array if prev is not an array
  //     }
  //     return prev.filter((asset) => !selectedAssets.includes(asset.id));
  //   });
  //   setSelectedAssets([]); // Reset selected assets

  // };

  // const handleDeleteAllAssets2 = () => {
  //   setAssets((prev) => {
  //     if (!Array.isArray(prev)) {
  //       console.error("Expected 'prev' to be an array, but got:", prev);
  //       return []; // Fallback to an empty array if prev is not an array
  //     }

  //     return prev.filter((_, index) => !selectedAssets.includes(index)); // Filter using index
  //   });

  //   setSelectedAssets([]); // Reset selected assets
  // };

  // const handleDeleteAllAssets2 = () => {
  //   // console.log("boqSubItemId", boqSubItemId);

  //   setAssets((prev) => {
  //     console.log("prev", typeof prev, prev);

  //     const filteredAssets = Object.keys(prev).reduce((acc, key) => {
  //       const assetsArray = prev[key] || [];
  //       acc[key] = assetsArray.filter(
  //         (_, index) => !selectedAssets.includes(index)
  //       ); // Use index
  //       return acc;
  //     }, {});

  //     // console.log("filteredAssets", filteredAssets);

  //     return filteredAssets;
  //   });

  //   setSelectedAssets([]); // Reset selection
  // };

  // const handleSelectRowAssets2 = (index) => {
  //   const updatedAssets = [...Assets];
  //   updatedAssets[index].selected = !updatedAssets[index].selected;
  //   setMaterials(updatedAssets);
  //   onMaterialsChange(updatedAssets);
  // };
  // const handleSelectRowAssets2 = (assetType) => {
  //   setSelectedAssets(
  //     (prev) =>
  //       prev.includes(assetType)
  //         ? prev.filter((type) => type !== assetType) // Unselect the material
  //         : [...prev, assetType] // Select the material
  //   );
  // };

  // const handleSelectRowAssets2 = (assetIndex) => {
  //   setSelectedAssets(
  //     (prev) =>
  //       prev.includes(assetIndex)
  //         ? prev.filter((index) => index !== assetIndex) // Unselect asset
  //         : [...prev, assetIndex] // Select asset
  //   );
  // };

  // ,.............
  const handleSelectRowAssets2 = (assetId, rowIndex) => {
    setSelectedAssets((prev) => {
      const isSelected = prev.some(
        (selected) =>
          selected.boqSubItemId === boqSubItemId &&
          selected.assetId === assetId &&
          selected.rowIndex === rowIndex
      );

      if (isSelected) {
        return prev.filter(
          (selected) =>
            !(
              selected.boqSubItemId === boqSubItemId &&
              selected.assetId === assetId &&
              selected.rowIndex === rowIndex

            )
        );
      } else {
        return [...prev, { boqSubItemId, assetId, rowIndex }];
      }
    });
  };

  const handleDeleteAllAssets2 = () => {
    setAssets((prev) => {
      // Clone the previous state to avoid mutation
      const newMaterials = { ...prev };

      // Only process the current boqSubItemId
      if (newMaterials[boqSubItemId]) {
        newMaterials[boqSubItemId] = newMaterials[boqSubItemId].filter((asset, index) =>
          !selectedAssets.some(
            selected =>
              selected.assetId === asset.id &&
              selected.rowIndex === index &&
              selected.boqSubItemId === boqSubItemId
          )
        );
      }

      // console.log("Updated materials:", newMaterials);
      return newMaterials;
    });

    // Update dependent states with boqSubItemId-aware cleanup
    const updateSelectionAssets = (selectionArray = []) =>
      selectedAssets
        .filter(selected => selected.boqSubItemId === boqSubItemId)
        .reduce((acc, selected) => {
          const indexToRemove = selected.rowIndex;
          if (indexToRemove >= 0 && indexToRemove < acc.length) {
            acc.splice(indexToRemove, 1);
          }
          return acc;
        }, [...selectionArray]);

    // Update all dependent states
    setSelectedSubTypesAssets(prev => updateSelectionAssets(prev));
    setSelectedAssetColors(prev => updateSelectionAssets(prev));
    setSelectedAssetInventoryBrands(prev => updateSelectionAssets(prev));
    setSelectedUnit3(prev => updateSelectionAssets(prev));
    setAssetCoefficientFactors(prev => updateSelectionAssets(prev));
    setAssetEstimatedQuantities(prev => updateSelectionAssets(prev));
    setAssetWastages(prev => updateSelectionAssets(prev));
    setAssetTotalEstimatedQtyWastages(prev => updateSelectionAssets(prev));
    setSelectedAssetGenericSpecifications(prev => updateSelectionAssets(prev));

    // Clean up selected materials for this boqSubItemId
    setSelectedAssets(prev =>
      prev.filter(selected =>
        !prev.some(s =>
          s.boqSubItemId === boqSubItemId &&
          ![boqSubItemId]?.some(
            (asset, index) =>
              asset.id === s.assetId &&
              index === s.rowIndex
          )
        )
      )
    );
  };


  // .......

  // for subproject material table

  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubTypes, setSelectedSubTypes] = useState([]); // Holds the selected subtypes for each material
  const [assetSubTypes, setAssetSubTypes] = useState([]); // For assets
  const [selectedSubTypesAssets, setSelectedSubTypesAssets] = useState([]);

  // Fetch inventory sub-types when materials array changes or inventory type changes
  useEffect(() => {
    materials.forEach((material, index) => {
      if (material.inventory_type_id) {
        axios
          .get(
            `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${material.inventory_type_id}&token=${token}`
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
            `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${asset.inventory_type_id}&token=${token}`
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
  const [selectedGenericSpecifications, setSelectedGenericSpecifications] =
    useState([]); // Holds the selected generic specifications for each material
  const [assetGenericSpecifications, setAssetGenericSpecifications] = useState(
    []
  ); // State to hold the fetched generic specifications for assets
  const [
    selectedAssetGenericSpecifications,
    setSelectedAssetGenericSpecifications,
  ] = useState([]); // Holds the selected generic specifications for each asset

  useEffect(() => {
    materials.forEach((material, index) => {
      if (material.pms_inventory_id || material.id) {
        axios
          .get(
            `${baseURL}pms/generic_infos.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=${token}`
          )
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

            // setGenericSpecifications((prevSpecifications) => {
            //   // Avoid index-based issues. We want to push the new options.
            //   return [...prevSpecifications, options];
            // });

            setGenericSpecifications((prevSpecifications) => {
              // Avoid index-based issues. We want to push the new options.
              const newColors = [...prevSpecifications];
              newColors[index] = options; // Update colors for this specific material
              return newColors;
            });
          });
        // .catch(error => console.error('Error fetching generic specifications:', error));
      }
    });
  }, [materials, baseURL]); // Runs only when materials change

  // Fetch generic specifications for assets
  useEffect(() => {
    Assets.forEach((asset, index) => {
      if (asset.id) {
        axios
          .get(
            `${baseURL}pms/generic_infos.json?q[material_id_eq]=${asset.id}&token=${token}`
          )
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

            // setAssetGenericSpecifications((prevSpecifications) => {
            //   // Avoid index-based issues. We want to push the new options.
            //   return [...prevSpecifications, options];
            // });
            setAssetGenericSpecifications((prevSpecifications) => {
              // Avoid index-based issues. We want to push the new options.
              const newColors = [...prevSpecifications];
              newColors[index] = options; // Update colors for this specific material
              return newColors;
            });

          });
        // .catch(error => console.error('Error fetching generic specifications for asset:', error));
      }
    });
  }, [Assets, baseURL]); // Runs only when Assets change

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
            `${baseURL}pms/colours.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=${token}`
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
          .get(
            `${baseURL}pms/colours.json?q[material_id_eq]=${asset.id}&token=${token}`
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
            // console.error('Error fetching colors for asset:', error);
          });
      }
    });
  }, [Assets, baseURL]); // Runs when `Assets` or `baseURL` changes

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

  useEffect(() => {
    materials.forEach((material, index) => {
      if (material.pms_inventory_id || material.id) {
        axios
          .get(
            `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${material.pms_inventory_id || material.id}&token=${token}`
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
          .get(
            `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${asset.id}&token=${token}`
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
            // console.error('Error fetching inventory brands for asset:', error);
          });
      }
    });
  }, [Assets, baseURL]); // Runs when assets or baseURL change

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

  // umo api

  //   const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [selectedUnit2, setSelectedUnit2] = useState([]);
  const [selectedUnit3, setSelectedUnit3] = useState([]);

  // Fetching the unit of measures data on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}unit_of_measures.json?token=${token}`
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
        // console.error('Error fetching unit of measures:', error);
      });
  }, []);

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
  // // table data material

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
  const [CostQTY, setCostQTY] = useState(materials.map(() => ""));

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

  const [wastageErrors, setWastageErrors] = useState({});

  // const handleWastageChange = (index, value) => {
  //   const updatedWastages = [...wastages];
  //   updatedWastages[index] = value;
  //   setWastages(updatedWastages);
  // };

  const handleWastageChange = (index, value) => {
    if (value > 100) {
      setWastageErrors((prev) => ({ ...prev, [index]: "Wastage cannot exceed 100%" }));
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

  const handleCostQTY = (index, value) => {
    const updatedCostQTY = [...CostQTY];
    updatedCostQTY[index] = value;
    setCostQTY(updatedCostQTY);
  };

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










  // const validateDuplicates = useCallback(() => {
  //   const seenCombinations = new Map();
  //   const errors = {};

  //   predefinedMaterials.forEach((item, index) => {
  //     if (!item.generic_info_id || !item.colour_id || !item.brand_id) return;

  //     const key = `${item.material_id}-${item.generic_info_id}-${item.colour_id}-${item.brand_id}`;
  //     if (seenCombinations.has(key)) {
  //       errors[index] = {
  //         generic_info: "Duplicate Generic Info not allowed.",
  //         colour: "Duplicate Colour not allowed.",
  //         brand: "Duplicate Brand not allowed.",
  //       };
  //     } else {
  //       seenCombinations.set(key, true);
  //     }
  //   });

  //   return errors;
  // }, [predefinedMaterials]);

  // ✅ Memoizing predefinedAssets






  // ✅ Updating material errors and BoqSubItems (Fixed infinite loop)
  //  .................

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
        const coefficient = coefficientFactors[index] || 0; // Default to 1 if no coefficient is set
        return parseFloat(boqQuantity) * parseFloat(coefficient); // Estimate quantity = boqQuantity * coefficient
      });
      setEstimatedQuantities(newEstimatedQuantities); // Set the calculated estimated quantities
    }
  };

  // Function to calculate total estimated quantities with wastage
  const calculateTotalEstimatedQtyWastages = () => {
    if (boqQuantity && estimatedQuantities.length > 0) {
      const newTotalEstimatedQtyWastages = materials.map((material, index) => {
        const estimatedQty = parseFloat(estimatedQuantities[index]) || 0;
        const wastagePercentage = parseFloat(wastages[index]) || 0;
        const totalWithWastage = estimatedQty * (1 + wastagePercentage / 100);
        return parseFloat(totalWithWastage.toFixed(4)); // Adding wastage percentage
      });
      setTotalEstimatedQtyWastages(newTotalEstimatedQtyWastages); // Set the total quantities with wastage
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
  ]);

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



  // validation for duplicate 
  const [localMaterialErrors, setLocalMaterialErrors] = useState({});
  const [localAssetsErrors, setLocalAssetsErrors] = useState({});

  // ✅ Memoizing predefinedMaterials
  const predefinedMaterials = useMemo(() => {
    return materials.map((m, i) => ({
      id: m.pms_inventory_id ? m.id : null,
      material_id: m.pms_inventory_id || m.id,
      //   material_id: m.id,
      material_sub_type_id: selectedSubTypes[i]?.value || "",
      generic_info_id: selectedGenericSpecifications[i]?.value || "",
      colour_id: selectedColors[i]?.value || "",
      brand_id: selectedInventoryBrands[i]?.value || "",
      uom_id: selectedUnit2[i]?.value || "",
      co_efficient_factor: parseFloat(coefficientFactors[i]) || 0,
      estimated_quantity: parseFloat(estimatedQuantities[i]) || 0,
      wastage: parseFloat(wastages[i]) || 0,
      estimated_quantity_wastage: parseFloat(totalEstimatedQtyWastages[i]) || 0,
    }));
  }, [
    materials, selectedSubTypes, selectedGenericSpecifications, selectedColors,
    selectedInventoryBrands, selectedUnit2, coefficientFactors,
    estimatedQuantities, wastages, totalEstimatedQtyWastages
  ]);
  // console.log("predefimned Materials in sub:",predefinedMaterials)

  const predefinedAssets = useMemo(() => {
    return Assets.map((a, i) => ({
      material_id: a.id,
      material_sub_type_id: selectedSubTypesAssets[i]?.value || "",
      generic_info_id: selectedAssetGenericSpecifications[i]?.value || "",
      colour_id: selectedAssetColors[i]?.value || "",
      brand_id: selectedAssetInventoryBrands[i]?.value || "",
      uom_id: selectedUnit3[i]?.value || "",
      co_efficient_factor: parseFloat(assetCoefficientFactors[i]) || 0,
      estimated_quantity: parseFloat(assetEstimatedQuantities[i]) || 0,
      wastage: parseFloat(assetWastages[i]) || 0,
      estimated_quantity_wastage: parseFloat(assetTotalEstimatedQtyWastages[i]) || 0,
      cost_qty: parseFloat(assetCostQTY[i]) || 0,
    }));
  }, [
    Assets, selectedSubTypesAssets, selectedAssetGenericSpecifications, selectedAssetColors,
    selectedAssetInventoryBrands, selectedUnit3, assetCoefficientFactors,
    assetEstimatedQuantities, assetWastages, assetTotalEstimatedQtyWastages, assetCostQTY
  ]);

  const validateDuplicates = useCallback((items) => {
    const seenCombinations = new Map();
    const errors = {};

    items.forEach((item, index) => {
      if (!item.generic_info_id || !item.colour_id || !item.brand_id) return;

      const key = `${item.material_id}-${item.generic_info_id}-${item.colour_id}-${item.brand_id}`;
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

    return errors;
  }, []);

  // ✅ Memoized validation results (prevents infinite updates)
  const materialErrors = useMemo(() => validateDuplicates(predefinedMaterials), [predefinedMaterials, validateDuplicates]);
  const assetErrors = useMemo(() => validateDuplicates(predefinedAssets), [predefinedAssets, validateDuplicates]);

  useEffect(() => {
    if (!boqSubItemId) return;

    setBoqSubItems((prev) =>

      prev.map((item) => {
        // console.log("prev sub",item)
        if (item.id !== boqSubItemId) return item;

        const existingMaterials = item.materials || [];
        const newMaterials = predefinedMaterials || [];

        // Normalize material IDs
        const normalizedExistingMaterials = existingMaterials.map((m) => ({
          ...m,
          material_id: m.material_id || m.id,
        }));
        const normalizedNewMaterials = newMaterials.map((m) => ({
          ...m,
          material_id: m.material_id || m.id,
        }));

        // Use Set to remove duplicates
        const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
        const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

        // Merge materials correctly
        const mergedMaterials = [...normalizedExistingMaterials, ...filteredNewMaterials];

        return _.isEqual(item.materials, mergedMaterials)
          ? item
          : { ...item, materials: mergedMaterials };
      })
    );

    // ✅ Prevent unnecessary material error updates
    setLocalMaterialErrors((prev) =>
      _.isEqual(prev, materialErrors) ? prev : materialErrors
    );
  }, [boqSubItemId, predefinedMaterials, materialErrors]);



  //delete array
  //   useEffect(() => {
  //     if (!boqSubItemId) return;

  //     setBoqSubItems((prev) =>
  //         prev.map((item) => {
  //             if (item.id !== boqSubItemId) return item;

  //             const existingMaterials = item.materials || [];
  //             const newMaterials = predefinedMaterials || [];

  //             // Normalize material IDs
  //             const normalizedExistingMaterials = existingMaterials.map((m) => ({
  //                 ...m,
  //                 material_id: m.material_id || m.id,
  //             }));
  //             const normalizedNewMaterials = newMaterials.map((m) => ({
  //                 ...m,
  //                 material_id: m.material_id || m.id,
  //             }));

  //             // Use Set to remove duplicates
  //             const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
  //             const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

  //             // Merge materials correctly
  //             const mergedMaterials = [...normalizedExistingMaterials, ...filteredNewMaterials];

  //             return _.isEqual(item.materials, mergedMaterials)
  //                 ? item
  //                 : { 
  //                     ...item, 
  //                     materials: mergedMaterials, 
  //                     deleted: { deleted: deletedMaterialIds } // ✅ Pass deletedMaterialIds in sub-item
  //                 };
  //         })
  //     );

  //     // ✅ Prevent unnecessary material error updates
  //     setLocalMaterialErrors((prev) =>
  //         _.isEqual(prev, materialErrors) ? prev : materialErrors
  //     );

  // }, [boqSubItemId, predefinedMaterials, materialErrors, deletedMaterialIds]); 


  // ✅ Force replace only when `predefinedMaterials` changes drastically
  useEffect(() => {
    if (!boqSubItemId) return;

    setBoqSubItems((prev) =>
      prev.map((item) =>
        item.id === boqSubItemId && !_.isEqual(item.materials, predefinedMaterials)
          ? { ...item, materials: predefinedMaterials }
          : item
      )
    );

  }, [boqSubItemId, predefinedMaterials]);


  // State to store deleted material IDs
  // const [deletedMaterialIds, setDeletedMaterialIds] = useState([]);

  // useEffect(() => {
  //     if (!boqSubItemId) return;

  //     setBoqSubItems((prev) =>
  //         prev.map((item) => {
  //             if (item.id !== boqSubItemId) return item;

  //             const existingMaterials = item.materials || [];
  //             const newMaterials = predefinedMaterials || [];

  //             // Normalize material IDs
  //             const normalizedExistingMaterials = existingMaterials.map((m) => ({
  //                 ...m,
  //                 material_id: m.material_id || m.id,
  //             }));
  //             const normalizedNewMaterials = newMaterials.map((m) => ({
  //                 ...m,
  //                 material_id: m.material_id || m.id,
  //             }));

  //             // Use Set to remove duplicates
  //             const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
  //             const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

  //             // Merge materials correctly
  //             const mergedMaterials = [...normalizedExistingMaterials, ...filteredNewMaterials];

  //             // ✅ Compute deleted material IDs properly
  //             const deletedIds = normalizedExistingMaterials
  //                 .filter((m) => !mergedMaterials.some((newM) => newM.material_id === m.material_id))
  //                 .map((m) => m.material_id);

  //             // ✅ Update deletedMaterialIds state correctly
  //             if (deletedIds.length > 0) {
  //                 setDeletedMaterialIds((prev) => [...new Set([...prev, ...deletedIds])]);
  //             }

  //             console.log("deleted id in sub:",deletedMaterialIds)
  //             return _.isEqual(item.materials, mergedMaterials)
  //                 ? item
  //                 : { 
  //                     ...item, 
  //                     materials: mergedMaterials, 
  //                     deleted:  deletedMaterialIds  // ✅ Ensure deleted material IDs are stored
  //                 };
  //         })
  //     );

  //     // ✅ Prevent unnecessary material error updates
  //     setLocalMaterialErrors((prev) =>
  //         _.isEqual(prev, materialErrors) ? prev : materialErrors
  //     );

  // }, [boqSubItemId, predefinedMaterials, materialErrors,deletedMaterialIds]);

  // ✅ Sync deletedMaterialIds with the BoQ Sub Items when predefinedMaterials change
  // useEffect(() => {
  //     if (!boqSubItemId) return;

  //     setBoqSubItems((prev) =>
  //         prev.map((item) =>
  //             item.id === boqSubItemId && !_.isEqual(item.materials, predefinedMaterials)
  //                 ? { ...item, materials: predefinedMaterials, deleted:  deletedMaterialIds }
  //                 : item
  //         )
  //     );

  // }, [boqSubItemId, predefinedMaterials, deletedMaterialIds]);



  // new
  // useEffect(() => {
  //   if (!boqSubItemId) return;

  //   setBoqSubItems((prev) =>
  //       prev.map((item) => {
  //           if (item.id !== boqSubItemId) return item;

  //           const existingMaterials = item.materials || [];
  //           const newMaterials = predefinedMaterials || [];

  //           // Normalize material IDs
  //           const normalizedExistingMaterials = existingMaterials.map((m) => ({
  //               ...m,
  //               material_id: m.material_id || m.id,
  //           }));
  //           const normalizedNewMaterials = newMaterials.map((m) => ({
  //               ...m,
  //               material_id: m.material_id || m.id,
  //           }));

  //           // Use Set to remove duplicates
  //           const existingMaterialIds = new Set(normalizedExistingMaterials.map((m) => m.material_id));
  //           const filteredNewMaterials = normalizedNewMaterials.filter((m) => !existingMaterialIds.has(m.material_id));

  //           // Merge materials correctly
  //           const mergedMaterials = [...normalizedExistingMaterials, ...filteredNewMaterials];

  //           // ✅ Compute deleted material IDs properly
  //           const deletedIds = normalizedExistingMaterials
  //               .filter((m) => !mergedMaterials.some((newM) => newM.material_id === m.material_id))
  //               .map((m) => m.material_id);

  //           // ✅ Update deletedMaterialIds state correctly
  //           if (deletedIds.length > 0) {
  //               setDeletedMaterialIds((prev) => [...new Set([...prev, ...deletedIds])]);
  //           }

  //           return _.isEqual(item.materials, mergedMaterials)
  //               ? item
  //               : { 
  //                   ...item, 
  //                   materials: mergedMaterials 
  //               };
  //       })
  //   );

  //   // ✅ Prevent unnecessary material error updates
  //   setLocalMaterialErrors((prev) =>
  //       _.isEqual(prev, materialErrors) ? prev : materialErrors
  //   );

  // }, [boqSubItemId, predefinedMaterials, materialErrors]);

  // ✅ Sync deletedMaterialIds with the BoQ Sub Items when predefinedMaterials change
  // useEffect(() => {
  //   if (!boqSubItemId) return;

  //   setBoqSubItems((prev) =>
  //       prev.map((item) =>
  //           item.id === boqSubItemId && !_.isEqual(item.materials, predefinedMaterials)
  //               ? { ...item, materials: predefinedMaterials, 
  //                 deleted:  deletedMaterialIds
  //                }
  //               : item
  //       )
  //   );

  // }, [deletedMaterialIds,boqSubItemId, predefinedMaterials]);

  console.log("sub item in delete case:,", boqSubItems)

  // ✅ Updating asset errors and BoqSubItems (Fixed infinite loop)
  useEffect(() => {
    if (!boqSubItemId) return;

    // Only update state if there is a real change
    if (!_.isEqual(assetErrors, localAssetsErrors)) {
      setLocalAssetsErrors(assetErrors);
    }

    setBoqSubItems((prev) => {
      return prev.map((item) =>
        item.id === boqSubItemId && !_.isEqual(item.assets, predefinedAssets)
          ? { ...item, assets: predefinedAssets }
          : item
      );
    });
  }, [boqSubItemId, predefinedAssets, assetErrors]);







  return (
    <>
      <div className="collapse show">
        <div className="w-100">


          <div style={{ overflowX: "auto", maxWidth: "100%" }}>
            <CollapsibleCard title="Material">
              <div className="card   mx-3 mt-2">
                <div className="card-body mt-0 pt-0">
                  <div className=" my-4">
                    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                      <table
                        className="tbl-container"
                        style={{ borderCollapse: "collapse" }}
                      >
                        <thead style={{ zIndex: "0" }}>
                          <tr>
                            <th
                              rowSpan={2}
                              style={{ width: "100px", whiteSpace: "nowrap" }}
                            >
                              {/* <input
                                type="checkbox"
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
                                    setSelectedMaterials(
                                      materials.map((m) => m.id)
                                    ); // Select all
                                  } else {
                                    setSelectedMaterials([]); // Deselect all
                                  }
                                }}
                                checked={
                                  selectedMaterials.length === materials.length
                                }
                              /> */}

                              {/* <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedMaterials(
                                      materials.map((_, index) => index)
                                    ); // Select all using indexes
                                  } else {
                                    setSelectedMaterials([]); // Deselect all
                                  }
                                }}
                                checked={
                                  selectedMaterials.length ===
                                    materials.length && materials.length > 0
                                }
                              /> */}
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const allSelected = materials.flatMap(
                                      (m, index) => ({
                                        boqSubItemId: boqSubItemId,

                                        materialId: m.id,
                                        rowIndex: index,
                                      })
                                    );
                                    setSelectedMaterials(allSelected);
                                  } else {
                                    setSelectedMaterials([]);
                                  }
                                }}
                                checked={
                                  selectedMaterials.length ===
                                  materials.length && materials.length > 0
                                }
                              />
                            </th>

                            <th
                              rowSpan={2}
                              style={{ width: "300px", whiteSpace: "nowrap" }}
                            >
                              Material Type
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "300px", whiteSpace: "nowrap" }}
                            >
                              Material
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Material Sub-Type <span>*</span>
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Generic Specification
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Colour{" "}
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Brand{" "}
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              UOM <span>*</span>
                            </th>
                            {/* <th rowSpan={2}>Cost QTY</th> */}
                            <th className="text-center" colSpan={2}>
                              Cost
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Wastage%
                            </th>
                            <th
                              rowSpan={2}
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Total Estimated Qty Wastage
                            </th>
                          </tr>
                          <tr>
                            <th
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Co-Efficient Factor <span>*</span>
                            </th>
                            <th
                              style={{ width: "350px", whiteSpace: "nowrap" }}
                            >
                              Estimated Qty
                            </th>
                          </tr>
                        </thead>
                        <tbody>


                          {materials.length > 0 ? (
                            materials.map((material, index) => (
                              <tr>
                                <td>
                                  {/* <input
                                    className="ms-5"
                                    type="checkbox"
                                    checked={selectedMaterials.includes(
                                      material.id
                                    )} // Check if material is selected
                                    onChange={() =>
                                      handleSelectRowMaterial(material.id)
                                    } // Toggle selection
                                  /> */}

                                  {/* <input
                                    type="checkbox"
                                    checked={selectedMaterials.includes(index)} // Use index instead of material.id
                                    onChange={() => handleSelectRowMaterial(index)} // Pass index instead of material.id
                                    /> */}
                                  <input
                                    key={index}
                                    className="ms-5"
                                    type="checkbox"
                                    disabled={material.can_delete === false}
                                    checked={selectedMaterials.some(
                                      (selected) =>
                                        selected.boqSubItemId === boqSubItemId &&
                                        selected.materialId === material.id &&
                                        selected.rowIndex === index

                                    )}
                                    onChange={() =>
                                      handleSelectRowMaterial(
                                        material.id,
                                        index
                                      )
                                    }
                                  />
                                </td>
                                <td>{material.material_type || material.inventory_type_name}</td>
                                <td>{material.material_name || material.name}</td>
                                <td>
                                  <SingleSelector
                                    options={inventorySubTypes[index] || []} // Get the sub-types for the specific material
                                    onChange={(selectedOption) =>
                                      handleSubTypeChange(index, selectedOption)
                                    }
                                    value={selectedSubTypes[index]} // Display the selected sub-type for this material
                                    placeholder={`Select Sub-Type`} // Dynamic placeholder
                                  />
                                </td>
                                <td>
                                  <SingleSelector
                                    options={Array.isArray(genericSpecifications[index]) ? genericSpecifications[index] : []}
                                    onChange={(selectedOption) =>
                                      handleGenericSpecificationChange(
                                        index,
                                        selectedOption
                                      )
                                    }
                                    value={selectedGenericSpecifications[index]} // Display the selected generic specification for this material
                                    placeholder={`Select Specification`} // Dynamic placeholder
                                  />
                                  {localMaterialErrors[index]?.generic_info && (
                                    <p style={{ color: "red" }}>
                                      {localMaterialErrors[index].generic_info}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  <SingleSelector
                                    options={colors[index] || []} // Get the colors for the specific material
                                    onChange={(selectedOption) =>
                                      handleColorChange(index, selectedOption)
                                    }
                                    value={selectedColors[index]} // Display the selected color for this material
                                    placeholder={`Select Colour`} // Dynamic placeholder
                                  />
                                  {localMaterialErrors[index]?.colour && (
                                    <p style={{ color: "red" }}>
                                      {localMaterialErrors[index].colour}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  <SingleSelector
                                    options={inventoryBrands[index] || []} // Get the brands for the specific material
                                    onChange={(selectedOption) =>
                                      handleBrandChange(index, selectedOption)
                                    }
                                    value={selectedInventoryBrands[index]} // Display the selected brand for this material
                                    placeholder={`Select Brand`} // Dynamic placeholder
                                  />
                                  {localMaterialErrors[index]?.brand && (
                                    <p style={{ color: "red" }}>
                                      {localMaterialErrors[index].brand}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  <SingleSelector
                                    options={unitOfMeasures} // Providing the options to the select component
                                    onChange={(selectedOption) =>
                                      handleUnitChange2(index, selectedOption)
                                    } // Update UOM for the specific material
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
                                    placeholder="Please Enter Co-efficient Factor"
                                    value={coefficientFactors[index] || ""}
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
                                      handleCoefficientFactorChange(
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
                                    disabled
                                    placeholder="Estimated Qty"
                                    value={estimatedQuantities[index] || ""}
                                  // onChange={(e) => handleEstimatedQtyChange(index, e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Please Enter Wastage"
                                    value={wastages[index] || ""}
                                    onChange={(e) =>
                                      handleWastageChange(index, e.target.value)
                                    }
                                  />

                                  {wastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{wastageErrors[index]}</p>}
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    disabled
                                    placeholder="Total Estimated Qty"
                                    value={
                                      totalEstimatedQtyWastages[index] || ""
                                    }
                                  // onChange={(e) => handleTotalEstimatedQtyWastageChange(index, e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="12"
                                className="text-start"
                              // style={{ paddingLeft: "400px" }}
                              >
                                No materials added yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row mt-3 mx-3">
                    <p className="text-start">
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
                        onClick={handleDeleteAllMaterial}
                      >
                        Delete Material
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleCard>
          </div>
          <MaterialModal
            show={showModal}
            handleClose={handleCloseModal}
            handleAdd={handleAddMaterials}
          />

          <CollapsibleCard title="Assests">
            <div className="card  mx-3 mt-2">
              <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
                <div className=" my-4">
                  <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                    {/* <div className="tbl-container tbl-container-SpecificBOQ mx-3 mt-1"> */}
                    <table
                      //  className="mb-5"
                      className="tbl-container"
                      style={{
                        // minWidth: "1200px",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead style={{ zIndex: "0" }}>
                        <tr>
                          <th
                            rowSpan={2}
                            style={{ width: "100px", whiteSpace: "nowrap" }}
                          >
                            {/* <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAssets(Assets.map((a) => a.id)); // Select all
                                } else {
                                  setSelectedAssets([]); // Deselect all
                                }
                              }}
                              checked={selectedAssets.length === Assets.length}
                            /> */}

                            {/* <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAssets(
                                    Assets.map((_, index) => index)
                                  ); // Select all using indexes
                                } else {
                                  setSelectedAssets([]); // Deselect all
                                }
                              }}
                              checked={
                                selectedAssets.length === Assets.length &&
                                Assets.length > 0
                              }
                            /> */}

                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const allSelected = Assets.flatMap(
                                    (m, index) => ({
                                      boqSubItemId: boqSubItemId,

                                      assetId: m.id,
                                      rowIndex: index,
                                    })
                                  );
                                  setSelectedAssets(allSelected);
                                } else {
                                  setSelectedMaterials([]);
                                }
                              }}
                              checked={
                                selectedAssets.length ===
                                Assets.length && Assets.length > 0
                              }
                            />
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "300px", whiteSpace: "nowrap" }}
                          >
                            Assest Type
                          </th>

                          <th
                            rowSpan={2}
                            style={{ width: "300px", whiteSpace: "nowrap" }}
                          >
                            Assest
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Assest Sub-Type
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Generic Specification
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Colour{" "}
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Brand{" "}
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            UOM <span>*</span>
                          </th>
                          {/* <th rowSpan={2}>Cost QTY</th> */}
                          <th className="text-center" colSpan={2}>
                            Cost
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Wastage%
                          </th>
                          <th
                            rowSpan={2}
                            style={{ width: "350px", whiteSpace: "nowrap" }}
                          >
                            Total Estimated Qty Wastage
                          </th>
                        </tr>
                        <tr>
                          <th style={{ width: "350px", whiteSpace: "nowrap" }}>
                            Co-Efficient Factor <span>*</span>
                          </th>
                          <th style={{ width: "350px", whiteSpace: "nowrap" }}>
                            Estimated Qty
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Assets.length > 0 ? (
                          Assets.map((assets, index) => (
                            <tr key={index}>
                              <td>
                                {/* <input
                                  className="ms-5"
                                  type="checkbox"
                                  checked={selectedAssets.includes(assets.id)} // Check if material is selected
                                  onChange={() =>
                                    handleSelectRowAssets2(assets.id)
                                  } // Toggle selection */}
                                {/* /> */}

                                {/* <input
                                  className="ms-5"
                                  type="checkbox"
                                  checked={selectedAssets.includes(
                                    assets.id
                                  )} // Check if material is selected
                                  onChange={() =>
                                    handleSelectRowAssets2(assets.id)
                                  } // Toggle selection
                                /> */}

                                {/* <input
                                  key={index}
                                  className="ms-5"
                                  type="checkbox"
                                  checked={selectedAssets.includes(index)} // Use index instead of asset.id
                                  onChange={() => handleSelectRowAssets2(index)} // Pass index instead of asset.id
                                /> */}

                                <input
                                  key={index}
                                  className="ms-5"
                                  type="checkbox"
                                  checked={selectedAssets.some(
                                    (selected) =>
                                      selected.boqSubItemId === boqSubItemId &&
                                      selected.assetId === assets.id &&
                                      selected.rowIndex === index

                                  )}
                                  onChange={() =>
                                    handleSelectRowAssets2(
                                      assets.id,
                                      index
                                    )
                                  }
                                />
                              </td>

                              <td>{assets.inventory_type_name}</td>
                              <td>{assets.name}</td>
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
                                    assetGenericSpecifications[index] || []
                                  } // Get the generic specifications for the specific material
                                  onChange={(selectedOption) =>
                                    handleGenericSpecificationChangeForAsset(
                                      index,
                                      selectedOption
                                    )
                                  }
                                  value={
                                    selectedAssetGenericSpecifications[index]
                                  } // Display the selected generic specification for this material
                                  placeholder={`Select Specification`} // Dynamic placeholder
                                />
                                {localAssetsErrors[index]?.generic_info && (
                                  <p style={{ color: "red" }}>
                                    {localAssetsErrors[index].generic_info}
                                  </p>
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
                                {localAssetsErrors[index]?.colour && (
                                  <p style={{ color: "red" }}>
                                    {localAssetsErrors[index].colour}
                                  </p>
                                )}
                              </td>
                              <td>
                                <SingleSelector
                                  options={assetInventoryBrands[index] || []} // Get the brands for the specific material
                                  onChange={(selectedOption) =>
                                    handleAssetInventoryBrandChange(
                                      index,
                                      selectedOption
                                    )
                                  }
                                  value={selectedAssetInventoryBrands[index]} // Display the selected brand for this material
                                  placeholder={`Select Brand`} // Dynamic placeholder
                                />
                                {localAssetsErrors[index]?.brand && (
                                  <p style={{ color: "red" }}>
                                    {localAssetsErrors[index].brand}
                                  </p>
                                )}
                              </td>
                              <td>
                                <SingleSelector
                                  options={unitOfMeasures} // Providing the options to the select component
                                  onChange={(selectedOption) =>
                                    handleUnitChange3(index, selectedOption)
                                  } // Update UOM for the specific material
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
                                  placeholder="Please Enter Co-efficient Factor"
                                  value={assetCoefficientFactors[index] || ""}
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
                                  value={assetEstimatedQuantities[index] || ""}
                                  onChange={(e) =>
                                    handleAssetEstimatedQtyChange(
                                      index,
                                      e.target.value
                                    )
                                  }
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
                                    assetTotalEstimatedQtyWastages[index] || ""
                                  }
                                  onChange={(e) =>
                                    handleAssetTotalEstimatedQtyWastageChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="12"
                              className="text-start"
                            // style={{ paddingLeft: "400px" }}
                            >
                              No asset added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-3 mx-3">
                  <p className="text-start">
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
  );
};

export default EditBoqSub;
