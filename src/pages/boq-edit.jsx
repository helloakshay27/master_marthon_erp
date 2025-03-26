import React from "react";
import { useState, useEffect,useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MaterialModal from "../components/MaterialModal";
import AssetModal from "../components/AssestModal";

import {
    LayoutModal,
    Table,
} from "../components"
import { baseURL } from "../confi/apiDomain";

const BOQEdit = () => {
    const { id } = useParams(); // Get the id
    console.log("id in edit", id)

    const [boqDetails, setBoqDetails] = useState(null);  // State to hold the fetched data
    const [boqDetailsSub, setBoqDetailsSub] = useState(true);
    const [loading, setLoading] = useState(true);  // State for loading indicator
    const [error, setError] = useState(null);  // State for handling errors
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

    // const [materialsBySubItem, setMaterialsBySubItem] = useState({});
    // edit 
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
            }

        } catch (error) {
            setError('An error occurred while fetching the data');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch the data when the component mounts or when 'id' changes

        console.log("id in useeffect:", id)
        fetchData();
    }, [id]);  // Dependency array ensures fetch is triggered when 'id' changes


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

    const handleDeleteAll = () => {
        setMaterials((prev) => {
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

            // console.log("After deletion - New Materials:", JSON.stringify(newMaterials));
            // console.log("After deletion - Updated Generic Specifications:", JSON.stringify(genericSpecifications));

            return newMaterials;
        });

        setSelectedMaterials([]); // Clear selected materials
    };

    const handleSelectRow = (materialIndex) => {
        setSelectedMaterials((prev) =>
            prev.includes(materialIndex)
                ? prev.filter((index) => index !== materialIndex) // Unselect
                : [...prev, materialIndex] // Select
        );
    };


    console.log("material:", materials)
    const [unitOfMeasures, setUnitOfMeasures] = useState([]);

    //preselected Material data
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

        if (boqDetails?.unit_of_measure_id && unitOfMeasures.length > 0) {
            const preselectedUnit = unitOfMeasures.find(
                (unit) => unit.value === boqDetails.unit_of_measure_id
            );
            setSelectedUnit(preselectedUnit || null);
        }
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

        if (boqDetails?.boq_sub_items?.length > 0) {
            const subItemMaterials = boqDetails.boq_sub_items.flatMap(subItem => subItem.materials || []);

            if (subItemMaterials.length > 0) {
                setMaterials(subItemMaterials);

                setSelectedSubTypes(subItemMaterials.map(m => ({
                    value: m.pms_inventory_sub_type_id,
                    label: m.material_sub_type
                })));

                setSelectedGenericSpecifications(subItemMaterials.map(m => ({
                    value: m.pms_generic_info_id,
                    label: m.generic_info
                })));

                setSelectedColors(subItemMaterials.map(m => ({
                    value: m.pms_colour_id,
                    label: m.color
                })));

                setSelectedInventoryBrands(subItemMaterials.map(m => ({
                    value: m.pms_inventory_brand_id,
                    label: m.brand
                })));

                setSelectedUnit2(subItemMaterials.map(m => ({
                    value: m.unit_of_measure_id,
                    label: m.uom
                })));

                setCoefficientFactors(subItemMaterials.map(m => m.co_efficient_factor));
                setEstimatedQuantities(subItemMaterials.map(m => m.estimated_quantity));
                setWastages(subItemMaterials.map(m => m.wastage));
                setTotalEstimatedQtyWastages(subItemMaterials.map(m => m.estimated_quantity_wastage));
            }
        }

    }, [boqDetails, unitOfMeasures]); // Runs when boqDetails updates

    // unit

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
    };

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




    // Modal


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
                console.log("material inventory type id:", material.inventory_type_id)
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
    }, [materials, baseURL, boqDetails]); // Trigger effect when materials or baseURL change


    // Fetch sub-types for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.inventory_type_id) {
                console.log("Assets inventory id:", asset.inventory_type_id);
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
        console.log("materials in specification:", materials)
        materials.forEach((material, index) => {
            if (material.pms_inventory_id || material.id) {
                console.log("material id edit:", material.id, material.pms_inventory_id)
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
    }, [materials, baseURL, boqDetails]); // Runs when materials or baseURL changes



    // Fetch generic specifications for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.pms_inventory_id || asset.id) {
                axios
                    .get(
                        `${baseURL}pms/generic_infos.json?q[material_id_eq]=${asset.pms_inventory_id || asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
    }, [materials, baseURL, boqDetails]); // Runs when materials or baseURL changes

    // Fetch colors for assets
    useEffect(() => {
        Assets.forEach((asset, index) => {
            if (asset.pms_inventory_id || asset.id) {
                axios
                    .get(
                        `${baseURL}pms/colours.json?q[material_id_eq]=${asset.pms_inventory_id || asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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
            if (asset.pms_inventory_id || asset.id) {
                axios
                    .get(
                        `${baseURL}pms/inventory_brands.json?q[material_id_eq]=${asset.pms_inventory_id || asset.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [boqQuantity, setBoqQuantity] = useState();
    const [note, setNote] = useState("");
    const [remark, setRemark] = useState("");


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
    const [wastageErrors, setWastageErrors] = useState({});


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
    ]); // Recalculate when boqQuantity or coefficientFactors change

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
                console.log("wastage", wastagePercentage)
                const totalWithWastage = estimatedQty * (1 + wastagePercentage / 100);
                return parseFloat(totalWithWastage.toFixed(4)); // Adding wastage percentage
            });
            setTotalEstimatedQtyWastages(newTotalEstimatedQtyWastages); // Set the total quantities with wastage
        }
    };



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


    // edit code.......

    // Group categories by level
    const groupedCategories = boqDetails?.categories?.reduce((acc, category) => {
        if (!acc[category.level]) {
            acc[category.level] = [];
        }
        acc[category.level].push(category);
        return acc;
    }, {});



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


    console.log("boqDetailsSub", boqDetailsSub)
    //   console.log("boq edit detail:", boqDetails.boq_sub_items.materials)


    const [localMaterialErrors, setLocalMaterialErrors] = useState({});
    const [localAssetErrors, setLocalAssetErrors] = useState({});
    // Example predefined materials data (replace with actual data from your source)
    const predefinedMaterials = materials.map((material, index) => ({
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
    }));


    console.log("pre mtL...", predefinedMaterials)

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


    useEffect(() => {
        const validateDuplicateMaterials = () => {
            const seenCombinations = new Map();
            let errors = {};

            predefinedMaterials.forEach((material, index) => {
                if (!material.generic_info_id || !material.colour_id || !material.brand_id) {
                    return;
                }

                const key = `${material.pms_inventory_id || material.material_id}-${material.generic_info_id}-${material.colour_id}-${material.brand_id}`;

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

    useEffect(() => {
        validateDuplicateAssets();
    }, [validateDuplicateAssets]);


    // Loading, error, and data display logic
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        // return <div>{error}</div>;
        return <div>Something went wrong</div>;
    }



    return (
        <>

            {/* <div className="website-content overflow-auto"> */}
            <div className="website-content ">
                <div className="module-data-section p-4">
                    <a href="">
                        Setup &gt; Engineering Setup &gt; BOQ &gt; BOQ Edit
                    </a>
                    <div className="card mt-3 mb-5">
                        {/* Total Content Here */}


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
                                            <label>Project</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder='56914'
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
                                                placeholder='56914'
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
                                            <label>Main Category</label>

                                            <input
                                                className="form-control"
                                                type="text"
                                                // placeholder='56914'
                                                value={groupedCategories[1] && groupedCategories[1].length > 0 ? groupedCategories[1][0].category_name : ''}
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
                                                value={groupedCategories[2] && groupedCategories[2].length > 0 ? groupedCategories[2][0].category_name : ''}
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
                                                value={groupedCategories[3] && groupedCategories[3].length > 0 ? groupedCategories[3][0].category_name : ''}
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
                                                value={groupedCategories[4] && groupedCategories[4].length > 0 ? groupedCategories[4][0].category_name : ''}
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
                                                value={groupedCategories[5] && groupedCategories[5].length > 0 ? groupedCategories[5][0].category_name : ''}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>BOQ Item Name</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder=""
                                                fdprocessedid="qv9ju9"
                                                value={boqDetails.item_name}
                                                onChange={(e) =>
                                                    handleInputChange("itemName", e.target.value)
                                                }
                                            />
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
                                                value={boqDetails.description || ""}

                                                onChange={(e) =>
                                                    handleInputChange("description", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>UOM</label>
                                            <SingleSelector
                                                options={unitOfMeasures} // Providing the options to the select component
                                                onChange={handleUnitChange} // Setting the handler when an option is selected
                                                value={selectedUnit} // Setting the selected value
                                                placeholder={`Select UOM`} // Dynamic placeholder
                                            //   isDisabled={showBOQSubItem}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>BOQ Qty (Cost)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder=""
                                                fdprocessedid="qv9ju9"
                                                value={boqDetails.quantity}
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
                                                //   disabled={showBOQSubItem}
                                                min="0"
                                            />
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
                                                value={boqDetails.note}
                                                onChange={(e) =>
                                                    handleInputChange("note", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
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
                                    </div>

                                </div>


                            </div>

                        </CollapsibleCard>

                        <CollapsibleCard title="BOQ Items">
                            {/* <div className="card mx-3 mt-2"> */}





                            <div
                                className="card-body mt-0 pt-0"
                                style={{ display: "block" }}
                            >
                                {boqDetailsSub ? (
                                    <>
                                        <CollapsibleCard title="Materials">

                                            <div
                                                className="card-body mt-0 pt-0"
                                            // style={{ display: "block" }}
                                            // style={{ overflowX: "auto", maxWidth: "100%" }}
                                            >
                                                <div
                                                    className="tbl-container mx-3 mt-1"
                                                // style={{ height: '200px' }}
                                                >
                                                    {/* <h1>predefinedMaterialsData</h1> */}

                                                    {/* <pre>{JSON.stringify(predefinedMaterials, null, 2)}</pre> */}

                                                    {/* <pre>{JSON.stringify(localMaterialErrors, null, 2)}</pre> */}


                                                    <table
                                                    // className="w-100"
                                                    //  className="tbl-container"
                                                    //  style={{ borderCollapse: "collapse" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>
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
                                                                </th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material Type</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material Sub-Type</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Generic Specification</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Colour </th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Brand </th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>UOM</th>
                                                                {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                <th colSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Cost</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Wastage</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>
                                                                    Total Estimated Qty Wastage
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                <th>Co-Efficient Factor</th>
                                                                <th>Estimated Qty</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {materials.length > 0 ? (
                                                                materials.map((material, index) => (
                                                                    <tr key={`${material.id}-${index}`}>
                                                                        <td style={{ width: "100px" }}>
                                                                            <input
                                                                                className="ms-5"
                                                                                type="checkbox"
                                                                                checked={selectedMaterials.includes(index)} // Use index instead of material.id
                                                                                onChange={() => handleSelectRow(index)} // Pass index to function
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>{material.material_type || material.inventory_type_name}</td>
                                                                        <td style={{ width: "300px" }}>{material.material_name || material.name}</td>
                                                                        <td style={{ width: "300px" }}>
                                                                            <SingleSelector
                                                                                options={inventorySubTypes[index] || []}
                                                                                onChange={(selectedOption) =>
                                                                                    handleSubTypeChange(index, selectedOption)
                                                                                }
                                                                                value={selectedSubTypes[index]}
                                                                                placeholder={`Select Sub-Type`}
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
                                                                            />
                                                                            {localMaterialErrors[index]?.brand && (
                                                                                <p style={{ color: "red" }}>{localMaterialErrors[index].brand}</p>
                                                                            )}
                                                                        </td>

                                                                        <td style={{ width: "300px" }}>
                                                                            <SingleSelector
                                                                                options={unitOfMeasures}
                                                                                onChange={(selectedOption) =>
                                                                                    handleUnitChange2(index, selectedOption)
                                                                                }
                                                                                value={selectedUnit2[index]}
                                                                                placeholder={`Select UOM`}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
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
                                                                        <td style={{ width: "300px" }}>
                                                                            <input
                                                                                className="form-control"
                                                                                type="number"
                                                                                placeholder="Estimated Quantity"
                                                                                disabled
                                                                                value={estimatedQuantities[index] || ""}
                                                                            />
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
                                                                            <input
                                                                                className="form-control"
                                                                                type="number"
                                                                                placeholder="Please Enter wastage"
                                                                                value={wastages[index] || ""}
                                                                                onChange={(e) => handleWastageChange(index, e.target.value)}
                                                                            />

                                                                            {wastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{wastageErrors[index]}</p>}
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
                                                                            <input
                                                                                className="form-control"
                                                                                type="number"
                                                                                placeholder="Total Estimated Qty Wastage"
                                                                                disabled
                                                                                value={totalEstimatedQtyWastages[index] || ""}
                                                                            />
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


                                        </CollapsibleCard>

                                        <MaterialModal
                                            show={showModal}
                                            handleClose={handleCloseModal}
                                            handleAdd={handleAddMaterials}
                                        />

                                        <CollapsibleCard title="Assets">
                                            <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
                                                <div className="tbl-container mx-3 mt-1"
                                                // style={{ height: '200px' }}
                                                >
                                                    <table
                                                    // className="w-100"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}>
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
                                                                </th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Asset Type</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Asset</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Asset Sub-Type</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Generic Specification</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Colour</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Brand</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>UOM</th>
                                                                {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                <th colSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Cost</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Wastage</th>
                                                                <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Total Estimated Qty Wastage</th>
                                                            </tr>
                                                            <tr>
                                                                <th>Co-Efficient Factor</th>
                                                                <th>Estimated Qty</th>
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
                                                                            />
                                                                        </td>

                                                                        <td style={{ width: "300px" }}>{assets.material_type || assets.inventory_type_name}</td>
                                                                        <td style={{ width: "300px" }}>{assets.material_name || assets.name}</td>
                                                                        <td style={{ width: "300px" }}>
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
                                                                        <td style={{ width: "300px" }}>
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
                                                                            {/* {localAssetErrors[index]?.generic_info && (
                                                                                                                          <p style={{ color: "red" }}>{localAssetErrors[index].generic_info}</p>
                                                                                                                        )} */}
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
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
                                                                            {/* {localAssetErrors[index]?.color && (
                                                                                                                          <p style={{ color: "red" }}>{localAssetErrors[index].color}</p>
                                                                                                                        )} */}

                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
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
                                                                            {/* {localAssetErrors[index]?.brand && (
                                                                                                                          <p style={{ color: "red" }}>{localAssetErrors[index].brand}</p>
                                                                                                                        )} */}
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
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
                                                                        <td style={{ width: "300px" }}>
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
                                                                        <td style={{ width: "300px" }}>
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
                                                                        <td style={{ width: "300px" }}>
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
                                                                            {/* {AssetwastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{AssetwastageErrors[index]}</p>} */}
                                                                        </td>
                                                                        <td style={{ width: "300px" }}>
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
                                        </CollapsibleCard>

                                        <AssetModal
                                            showAssets={showModalAsset}
                                            handleCloseAssets={handleCloseModalAsset}
                                            handleAdd={handleAddAssets}
                                        />

                                    </>
                                ) : (


                                    <div className="tbl-container mt-1 mx-3">
                                        <table className="w-100">
                                            <thead>
                                                <tr>
                                                    <th className="text-start">Sr.No.</th>
                                                    {/* <th className="text-start"> <input className="ms-1 me-1 mb-1" type="checkbox" /></th> */}
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

                                                {boqDetails.boq_sub_items && (
                                                    boqDetails.boq_sub_items.map((boqDetail2, index) => (
                                                        <React.Fragment key={boqDetail2.id}>
                                                            <tr>
                                                                <td className="text-start">{index + 1}</td>


                                                                <td className="text-start">
                                                                    <button
                                                                        className="btn btn-link p-0"
                                                                        onClick={() => toggleBoqDetail(boqDetail2.id)}

                                                                    >
                                                                        {openBoqDetailId === boqDetail2.id ? (
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
                                                                        )}
                                                                    </button>

                                                                </td>

                                                                <td className="text-start">

                                                                    {boqDetail2.name}
                                                                </td>
                                                                <td className="text-start">{boqDetail2.description}</td>
                                                                <td className="text-start">{boqDetail2.notes}</td>
                                                                <td className="text-start">{boqDetail2.remarks}</td>
                                                                <td className="text-start">{boqDetail2.uom}</td>
                                                                <td className="text-start">
                                                                    {boqDetail2.cost_quantity}
                                                                </td>
                                                                {/* <td></td> */}
                                                                {/* <td></td> */}
                                                            </tr>

                                                            {/* Render Materials Table for BOQ Detail in Sub-Category  */}
                                                            {openBoqDetailId === boqDetail2.id && (boqDetail2?.materials || boqDetail2?.boq_sub_items?.materials) && (
                                                                <React.Fragment>
                                                                    <tr>
                                                                        <td colSpan={13}>
                                                                            <div>
                                                                                <CollapsibleCard title="Materials">
                                                                                    <div className="card-body mt-0 pt-0">
                                                                                        <div className="tbl-container mx-3 mt-1" >
                                                                                            <table>
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th rowSpan={2} style={{ width: "100px", whiteSpace: "nowrap" }}></th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material Type</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Material Sub-Type</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Generic Specification</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Colour</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Brand</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>UOM</th>
                                                                                                        {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                                                        <th colSpan={3} style={{ width: "200px", whiteSpace: "nowrap" }}>Cost</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Wastage</th>
                                                                                                        <th rowSpan={2} style={{ width: "200px", whiteSpace: "nowrap" }}>Total Estimated Qty Wastage</th>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <th>Co-Efficient Factor</th>
                                                                                                        <th colSpan={2}>Estimated Qty</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>



                                                                                                    {materials.length > 0 ? (
                                                                                                        materials.map((material, index) => (
                                                                                                            <tr key={`${material.id}-${index}`}>
                                                                                                                <td style={{ width: "100px" }}>
                                                                                                                    <input
                                                                                                                        className="ms-5"
                                                                                                                        type="checkbox"
                                                                                                                        checked={selectedMaterials.includes(index)} // Use index instead of material.id
                                                                                                                        onChange={() => handleSelectRow(index)} // Pass index to function
                                                                                                                    />
                                                                                                                </td>
                                                                                                                <td style={{ width: "300px" }}>{material.material_type || material.inventory_type_name}</td>
                                                                                                                <td style={{ width: "300px" }}>{material.material_name || material.name}</td>
                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <SingleSelector
                                                                                                                        options={inventorySubTypes[index] || []}
                                                                                                                        onChange={(selectedOption) =>
                                                                                                                            handleSubTypeChange(index, selectedOption)
                                                                                                                        }
                                                                                                                        value={selectedSubTypes[index]}
                                                                                                                        placeholder={`Select Sub-Type`}
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
                                                                                                                    />
                                                                                                                    {/* {localMaterialErrors[index]?.generic_info && (
                                                                                                                      <p style={{ color: "red" }}>{localMaterialErrors[index].generic_info}</p>
                                                                                                                    )} */}
                                                                                                                </td>

                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <SingleSelector
                                                                                                                        options={colors[index] || []}
                                                                                                                        onChange={(selectedOption) =>
                                                                                                                            handleColorChange(index, selectedOption)
                                                                                                                        }
                                                                                                                        value={selectedColors[index]}
                                                                                                                        placeholder={`Select Colour`}
                                                                                                                    />
                                                                                                                    {/* {localMaterialErrors[index]?.colour && (
                                                                                                                      <p style={{ color: "red" }}>{localMaterialErrors[index].colour}</p>
                                                                                                                    )} */}
                                                                                                                </td>

                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <SingleSelector
                                                                                                                        options={inventoryBrands[index] || []}
                                                                                                                        onChange={(selectedOption) =>
                                                                                                                            handleBrandChange(index, selectedOption)
                                                                                                                        }
                                                                                                                        value={selectedInventoryBrands[index]}
                                                                                                                        placeholder={`Select Brand`}
                                                                                                                    />
                                                                                                                    {/* {localMaterialErrors[index]?.brand && (
                                                                                                                      <p style={{ color: "red" }}>{localMaterialErrors[index].brand}</p>
                                                                                                                    )} */}
                                                                                                                </td>

                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <SingleSelector
                                                                                                                        options={unitOfMeasures}
                                                                                                                        onChange={(selectedOption) =>
                                                                                                                            handleUnitChange2(index, selectedOption)
                                                                                                                        }
                                                                                                                        value={selectedUnit2[index]}
                                                                                                                        placeholder={`Select UOM`}
                                                                                                                    />
                                                                                                                </td>
                                                                                                                <td style={{ width: "300px" }}>
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
                                                                                                                <td style={{ width: "300px" }} colSpan={2}>
                                                                                                                    <input
                                                                                                                        className="form-control"
                                                                                                                        type="number"
                                                                                                                        placeholder="Estimated Quantity"
                                                                                                                        disabled
                                                                                                                        value={estimatedQuantities[index] || ""}
                                                                                                                    />
                                                                                                                </td>
                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <input
                                                                                                                        className="form-control"
                                                                                                                        type="number"
                                                                                                                        placeholder="Please Enter wastage"
                                                                                                                        value={wastages[index] || ""}
                                                                                                                        onChange={(e) => handleWastageChange(index, e.target.value)}
                                                                                                                    />

                                                                                                                    {/* {wastageErrors[index] && <p style={{ color: "red", fontSize: "12px" }}>{wastageErrors[index]}</p>} */}
                                                                                                                </td>
                                                                                                                <td style={{ width: "300px" }}>
                                                                                                                    <input
                                                                                                                        className="form-control"
                                                                                                                        type="number"
                                                                                                                        placeholder="Total Estimated Qty Wastage"
                                                                                                                        disabled
                                                                                                                        value={totalEstimatedQtyWastages[index] || ""}
                                                                                                                    />
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
                                                                                </CollapsibleCard>

                                                                                <MaterialModal
                                                                                    show={showModal}
                                                                                    handleClose={handleCloseModal}
                                                                                    handleAdd={handleAddMaterials}
                                                                                />

                                                                                <CollapsibleCard title="Assets">
                                                                                    <div className="card-body mt-0 pt-0">
                                                                                        <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                            <table className="w-100">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th rowSpan={2}></th>
                                                                                                        <th rowSpan={2}>Asset Type</th>
                                                                                                        <th rowSpan={2}>Asset</th>
                                                                                                        <th rowSpan={2}>Asset Sub-Type</th>
                                                                                                        <th rowSpan={2}>Generic Specification</th>
                                                                                                        <th rowSpan={2}>Colour</th>
                                                                                                        <th rowSpan={2}>Brand</th>
                                                                                                        <th rowSpan={2}>UOM</th>
                                                                                                        {/* <th rowSpan={2}>Asset QTY</th> */}
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
                                                                                                    {boqDetail2.assets.map((asset, index) => (
                                                                                                        <tr key={asset.id}>
                                                                                                            <td>{index + 1}</td>
                                                                                                            <td>{asset.material_type}</td>
                                                                                                            <td>{asset.material_name}</td>
                                                                                                            <td>{asset.material_sub_type}</td>
                                                                                                            <td>{asset.generic_info}</td>
                                                                                                            <td>{asset.color}</td>
                                                                                                            <td>{asset.brand}</td>
                                                                                                            <td>{asset.uom}</td>
                                                                                                            {/* <td>{asset.asset_quantity}</td> */}
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
                                                    ))
                                                )}
                                                {/* ................. */}


                                                {/* sub level 2 end*/}


                                                {/* Conditional rendering for categories under sub-project  end*/}

                                                {/* subProject end */}

                                            </tbody>
                                        </table>
                                    </div>
                                )}




                            </div>


                            {/* </div> */}
                        </CollapsibleCard>

                        <div className="row mt-2 justify-content-center">
                            <div className="col-md-2">
                                <button
                                    className="purple-btn2 w-100"
                                    fdprocessedid="u33pye"
                                >
                                    {/* Amend */}
                                    Update
                                </button>
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="purple-btn1 w-100"
                                    fdprocessedid="u33pye"
                                >
                                    {/* Back */}
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {/* <div className="row mx-2">
                                <h5>Audit Log</h5>
                                <div className="">
                                    <Table columns={auditLogColumns} data={auditLogData} />
                                </div>
                            </div> */}
                    </div>
                </div >

            </div >
            {/* </div> */}




        </>
    );
};

export default BOQEdit;
