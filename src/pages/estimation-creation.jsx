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

import {
  LayoutModal,
  FilterModal,
  BulkAction,
  DownloadIcon,
  FilterIcon,
  QuickFilter,
  SearchIcon,
  SettingIcon,
  StarIcon,
  Table,
} from "../components"
import { estimationListColumns, estimationListData } from "../constant/data";
import { auditLogColumns, auditLogData } from "../constant/data";




const EstimationCreation = () => {
  // States to store data
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
    axios.get('https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
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
    // 🔹 Fetch sub-project details when project or site changes
  useEffect(() => {
    if (!selectedProject && !selectedSite) return;

    const fetchDetails = async () => {
      try {
        const type = selectedSite ? "sub_project" : "project";
        const id = selectedSite ? selectedSite.value : selectedProject.value;

        const res = await axios.get(
          `https://marathon.lockated.com/estimation_details/${id}/budget_details.json?type=${type}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        setDetails(res.data);
      } catch (err) {
        console.error("Error fetching sub-project details", err);
      }
    };

    fetchDetails();
  }, [selectedProject, selectedSite]);

  console.log("details selected:",details)
  const [subProjectDetails, setSubProjectDetails] = useState(
   {}
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


  useEffect(() => {
    axios
      .get(
        "https://marathon.lockated.com/work_categories/work_sub_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        
      )
      .then((res) => {
        console.log("responce cat:",res.data)
        setSubProjectDetails(res.data); // store response
      })
      .catch((err) => {
        console.error("Error fetching sub project details:", err);
      });
  }, []); // runs once on mount


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
    { materialType: "", specification: "", type: "Material" }
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

  // Open modal for a specific category/sub-category
  // const handleOpenAddModal = (catIdx, subCatIdx) => {
  //   setModalCategoryIdx(catIdx);
  //   setModalSubCategoryIdx(subCatIdx);
  //   setModalRows([{ materialType: "", specification: "", type: "Material" }]);
  //   setShowAddModal(true);
  // };

  // Open modal for a specific category/sub-category
  // const handleOpenAddModal = (catIdx, subCatIdx, categoryId) => {
  //   setModalCategoryIdx(catIdx);
  //   setModalSubCategoryIdx(subCatIdx);
  //   setModalRows([{ materialType: "", specification: "", type: "Material" }]);
  //   setShowAddModal(true);
  //   setOpenCategoryId(categoryId); // <-- Expand category by default
  // };

  //   const handleOpenAddModal = (catIdx, subCatIdx, categoryOrSubCatId) => {
  //   setModalCategoryIdx(catIdx);
  //   setModalSubCategoryIdx(subCatIdx);
  //   setModalRows([{ materialType: "", specification: "", type: "Material" }]);
  //   setShowAddModal(true);
  //   setOpenCategoryId(subCatIdx === null ? categoryOrSubCatId : subProjectDetails.categories[catIdx].id); // Always expand main category
  //   if (subCatIdx !== null) {
  //     setOpenSubCategory2Id(categoryOrSubCatId); // Expand sub-category 2 automatically
  //   }
  // };

  // const handleOpenAddModal = (catIdx, subCatIdx, categoryOrSubCatId, subCategory3Id,subCategory4Id,
  // subCategory5Id) => {
  //   setModalCategoryIdx(catIdx);
  //   setModalSubCategoryIdx(subCatIdx);
  //   setModalRows([{ materialType: "", specification: "", type: "Material" }]);
  //   setShowAddModal(true);
  //   setOpenCategoryId(subCatIdx === null ? categoryOrSubCatId : subProjectDetails.categories[catIdx].id); // Always expand main category
  //   if (subCatIdx !== null) {
  //     setOpenSubCategory2Id(categoryOrSubCatId); // Expand sub-category 2 automatically
  //   }
  //   if (subCategory3Id) {
  //     setOpenSubCategory3Id(subCategory3Id); // Expand sub-category 3 automatically
  //   }

  //    if (subCategory4Id) {
  //   setOpenSubCategory4Id(subCategory4Id); // Expand sub-category 4 automatically
  // }
  // if (subCategory5Id) {
  //   setOpenSubCategory5Id(subCategory5Id); // Expand sub-category 5 automatically
  // }
  // };


  // Handle modal input change
  const handleModalRowChange = (idx, field, value) => {
    const updatedRows = modalRows.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    setModalRows(updatedRows);
  };


  // console.log("modalRows before create:", modalRows);

  // On modal create, add rows to the correct category/sub-category
  // const handleCreateRows = () => {
  //   setSubProjectDetails(prev => {
  //     const updated = { ...prev };
  //     // const targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].material_type_details;
  //     const targetArr = modalSubCategoryIdx === null
  //       ? updated.categories[modalCategoryIdx].material_type_details
  //       : updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].material_type_details;
  //     modalRows.forEach(row => {
  //       targetArr.push({
  //         id: Date.now() + Math.random(),
  //         name: row.materialType,
  //         specification: row.specification,
  //         type: row.type,
  //         location: "",
  //         qty: "",
  //         rate: "",
  //         wastage: "",
  //       });
  //     });
  //     return { ...updated };
  //   });
  //   setShowAddModal(false);
  // };
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

    // console.log("Params:", {
    //   catIdx,
    //   subCatIdx,
    //   categoryOrSubCatId,
    //   subCategory3Idx,
    //   subCategory4Idx,
    //   subCategory5Idx
    // });
    setModalCategoryIdx(catIdx);
    setModalSubCategoryIdx(subCatIdx);
    setModalSubCategory3Idx(subCategory3Idx);
    setModalSubCategory4Idx(subCategory4Idx);
    setModalSubCategory5Idx(subCategory5Idx);
    // setModalRows([{ materialType: "", specification: "", type: "Material" }]);
    setModalRows([{ materialType: "", specification: "", type: "Material" }]);
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

console.log("modal rows:",modalRows)


  // const handleOpenAddModal = (
  //   catIdx,
  //   subCatIdx,
  //   categoryOrSubCatId,
  //   subCategory3Idx = null,
  //   subCategory4Idx = null,
  //   subCategory5Idx = null
  // ) => {
  //   setModalCategoryIdx(catIdx);
  //   setModalSubCategoryIdx(subCatIdx);
  //   setModalSubCategory3Idx(subCategory3Idx);
  //   setModalSubCategory4Idx(subCategory4Idx);
  //   setModalSubCategory5Idx(subCategory5Idx);
  //   setModalRows([{ materialType: "", specification: "", type: "Material" }]);
  //   setShowAddModal(true);

  //   setOpenCategoryId(subCatIdx === null ? categoryOrSubCatId : subProjectDetails.categories[catIdx].id);
  //   if (subCatIdx !== null) setOpenSubCategory2Id(categoryOrSubCatId);

  //   if (subCategory3Idx !== null) {
  //     const subCat3 = subProjectDetails.categories[catIdx].sub_categories_2[subCatIdx].sub_categories_3[subCategory3Idx];
  //     if (subCat3) {
  //       setOpenSubCategory3Id(subCat3.id); // ensure it's set before modal
  //     }
  //   }

  //   if (subCategory4Idx !== null) {
  //     const subCat4 = subProjectDetails.categories[catIdx]
  //       .sub_categories_2[subCatIdx]
  //       .sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx];
  //     if (subCat4) setOpenSubCategory4Id(subCat4.id);
  //   }

  //   if (subCategory5Idx !== null) {
  //     const subCat5 = subProjectDetails.categories[catIdx]
  //       .sub_categories_2[subCatIdx]
  //       .sub_categories_3[subCategory3Idx]
  //       ?.sub_categories_4[subCategory4Idx]?.sub_categories_5[subCategory5Idx];
  //     if (subCat5) setOpenSubCategory5Id(subCat5.id);
  //   }
  // };




  // console.log("modal rows:",modalRows)

  //   const handleCreateRows = (
  //   subCategory3Idx = null,
  //   subCategory4Idx = null,
  //   subCategory5Idx = null
  // ) => {
  //   setSubProjectDetails(prev => {
  //     const updated = { ...prev };
  //     let targetArr;

  //     if (
  //       modalSubCategoryIdx === null &&
  //       subCategory3Idx === null &&
  //       subCategory4Idx === null &&
  //       subCategory5Idx === null
  //     ) {
  //       // Main category
  //       targetArr = updated.categories[modalCategoryIdx].material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx === null &&
  //       subCategory4Idx === null &&
  //       subCategory5Idx === null
  //     ) {
  //       // Sub-category 2
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx !== null &&
  //       subCategory4Idx === null &&
  //       subCategory5Idx === null
  //     ) {
  //       // Sub-category 3
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx !== null &&
  //       subCategory4Idx !== null &&
  //       subCategory5Idx === null
  //     ) {
  //       // Sub-category 4
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx !== null &&
  //       subCategory4Idx !== null &&
  //       subCategory5Idx !== null
  //     ) {
  //       // Sub-category 5
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx].sub_categories_4[subCategory4Idx].sub_categories_5[subCategory5Idx].material_type_details;
  //     }

  //     modalRows.forEach(row => {
  //       targetArr.push({
  //         id: Date.now() + Math.random(),
  //         name: row.materialType,
  //         specification: row.specification,
  //         type: row.type,
  //         location: "",
  //         qty: "",
  //         rate: "",
  //         wastage: "",
  //       });
  //     });
  //     return updated;
  //   });
  //   setShowAddModal(false);
  // };


  // const handleCreateRows = (
  //   subCategory3Idx = modalSubCategory3Idx,
  //   subCategory4Idx = modalSubCategory4Idx,
  //   subCategory5Idx = modalSubCategory5Idx
  // ) => {
  //   setSubProjectDetails(prev => {
  //     const updated = { ...prev };
  //     let targetArr;

  //     try {
  //       if (
  //         modalSubCategoryIdx === null &&
  //         subCategory3Idx === null &&
  //         subCategory4Idx === null &&
  //         subCategory5Idx === null
  //       ) {
  //         // Main category
  //         targetArr = updated.categories[modalCategoryIdx].material_type_details;
  //       } else if (
  //         modalSubCategoryIdx !== null &&
  //         subCategory3Idx === null &&
  //         subCategory4Idx === null &&
  //         subCategory5Idx === null
  //       ) {
  //         // Sub-category 2
  //         targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].material_type_details;
  //       } else if (
  //         modalSubCategoryIdx !== null &&
  //         subCategory3Idx !== null &&
  //         subCategory4Idx === null &&
  //         subCategory5Idx === null
  //       ) {
  //         // Sub-category 3
  //         targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.material_type_details;
  //       } else if (
  //         modalSubCategoryIdx !== null &&
  //         subCategory3Idx !== null &&
  //         subCategory4Idx !== null &&
  //         subCategory5Idx === null
  //       ) {
  //         // Sub-category 4
  //         targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.material_type_details;
  //       } else if (
  //         modalSubCategoryIdx !== null &&
  //         subCategory3Idx !== null &&
  //         subCategory4Idx !== null &&
  //         subCategory5Idx !== null
  //       ) {
  //         // Sub-category 5
  //         targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.sub_categories_5[subCategory5Idx]?.material_type_details;
  //       }
  //     } catch (e) {
  //       targetArr = undefined;
  //     }

  //     if (!targetArr) return prev; // Prevent error if path is invalid

  //     modalRows.forEach(row => {
  //       targetArr.push({
  //         id: Date.now() + Math.random(),
  //         name: row.materialType,
  //         specification: row.specification,
  //         type: row.type,
  //         location: "",
  //         qty: "",
  //         rate: "",
  //         wastage: "",
  //       });
  //     });
  //     return updated;
  //   });
  //   setShowAddModal(false);
  // };


  const handleCreateRows = (
    subCategory3Idx = modalSubCategory3Idx,
    subCategory4Idx = modalSubCategory4Idx,
    subCategory5Idx = modalSubCategory5Idx
  ) => {
    setSubProjectDetails(prev => {
      const updated = { ...prev };
      // const targetArr = getTargetArrayFromPath(updated, somePath); // however you fetch it
      let targetArr;

      if (
        modalSubCategoryIdx === null &&
        subCategory3Idx === null &&
        subCategory4Idx === null &&
        subCategory5Idx === null
      ) {
        // Main category
        targetArr = updated.categories[modalCategoryIdx].material_type_details;
      } else if (
        modalSubCategoryIdx !== null &&
        subCategory3Idx === null &&
        subCategory4Idx === null &&
        subCategory5Idx === null
      ) {
        // Sub-category 2
        targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].material_type_details;
      } else if (
        modalSubCategoryIdx !== null &&
        subCategory3Idx !== null &&
        subCategory4Idx === null &&
        subCategory5Idx === null
      ) {
        // Sub-category 3
        targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.material_type_details;
      } else if (
        modalSubCategoryIdx !== null &&
        subCategory3Idx !== null &&
        subCategory4Idx !== null &&
        subCategory5Idx === null
      ) {
        // Sub-category 4
        targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.material_type_details;
      } else if (
        modalSubCategoryIdx !== null &&
        subCategory3Idx !== null &&
        subCategory4Idx !== null &&
        subCategory5Idx !== null
      ) {
        // Sub-category 5
        targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.sub_categories_5[subCategory5Idx]?.material_type_details;
      }

      if (!targetArr) return prev; // Prevent error if path is invalid

      const row = modalRows[0];
      // // modalRows.forEach(row => {
      // targetArr.push({
      //   id: Date.now() + Math.random(),
      //   name: row.materialType,
      //   specification: row.specification,
      //   type: row.type,
      //   location: "",
      //   qty: "",
      //   rate: "",
      //   wastage: "",
      // });
      // });


      // Check if a row with same materialType, specification, and type exists
      const isDuplicate = targetArr.some(item =>
        item.name === row.materialType &&
        item.specification === row.specification &&
        item.type === row.type
      );

      if (!isDuplicate) {
        targetArr.push({
          id: Date.now() + Math.random(),
          name: row.materialType,
          specification: row.specification,
          type: row.type,
          location: "",
          qty: "",
          rate: "",
          wastage: "",
        });
      } else {
        // console.warn("Duplicate row skipped:", row);
      }

      // console.log("modal row:",targetArr)
      return updated;
    });
    setShowAddModal(false);
  };




  // const handleRemoveMainCategoryRow = (catIdx, itemIdx) => {
  //   setSubProjectDetails(prev => {
  //     const updated = { ...prev };
  //     updated.categories[catIdx].material_type_details.splice(itemIdx, 1);
  //     return { ...updated };
  //   });
  // };

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
          const amount = qtyInclWastage * rate;
          const costPerUnit = qty > 0 ? (amount / qty) : 0;
          return {
            ...item,
            qty,
            qtyInclWastage: qty + (qty * wastage / 100),
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
                  <div className="col-md-4">
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
                  <div className="col-md-4">
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
                  <div className="col-md-4">
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
                  {/* <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Wings</label>
                                            <SingleSelector
                                                options={wingsOptions}
                                                value={selectedWing}
                                                onChange={handleWingChange}
                                                placeholder={`Select Wing`} // Dynamic placeholder
                                            />
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>

            <CollapsibleCard title="Sub-Project Details">
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
                        value="150 Nos"
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
                        placeholder="Floors"
                        value={details?.data.budget_type || "-"}
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


            {/* <pre>{JSON.stringify(subProjectDetails, null, 2)}</pre> */}

            {/* ______________________________________________________________________________________________________ */}
            <div className="mx-3">


              <div className="mx-3">
                <div className="tbl-container mt-1" style={{
                  maxHeight: "750px",
                }}>
                  <table
                    className=""
                  >
                    <thead style={{ zIndex: "111 " }}>
                      <tr>
                        <th className="text-start">Expand</th>
                        <th className="text-start">Sr No.</th>
                        <th className="text-start">Level</th>
                        <th className="text-start">Category</th>
                        <th className="text-start">Location</th>
                        <th className="text-start">Type</th>
                        <th className="text-start">Items</th>
                        <th className="text-start">Factor</th>
                        <th className="text-start">UOM</th>
                        {/* <th className="text-start">Area</th> */}
                        <th className="text-start">QTY Excl Wastage</th>
                        <th className="text-start">Wastage</th>
                        <th className="text-start">QTY incl Waste</th>
                        <th className="text-start">Rate</th>
                        <th className="text-start">Amount</th>
                        <th className="text-start">Cost Per Unit</th>
                        <th className="text-start" style={{ width: "12px" }}>
                          Action
                        </th>
                      </tr>
                      <tr>
                        <th className="text-start"></th>
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
                      {subProjectDetails &&
                        subProjectDetails.categories &&
                        subProjectDetails.categories.map((category, catIdx) => (
                          <React.Fragment key={category.id}>
                            <tr className="main-category">
                              <td>
                                <button
                                  className="btn btn-link p-0"
                                  onClick={() => toggleCategory(category.id)}
                                  aria-label="Toggle category visibility"
                                >
                                  {openCategoryId === category.id ? (
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
                                      <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="20"
                                        rx="1"
                                        ry="1"
                                      />
                                      {/* Plus Icon */}
                                      <line x1="12" y1="8" x2="12" y2="16" />
                                      <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                  )}
                                </button>
                              </td>
                              <td>{catIdx + 1}</td>
                              <td> Main Category</td>
                              <td>{category.name}</td>
                              <td>
                                <input
                                  type="text"
                                  value={category.location || ""}
                                  onChange={(e) =>
                                    handleEditMainCategoryField(catIdx, "location", e.target.value)
                                  }
                                  className="form-control"
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
                                />
                              </td>
                              <td></td>
                              <td></td>
                              {/* <td></td> */}
                              <td>
                                <input
                                  type="number"
                                  value={category.qty || ""}
                                  onChange={(e) =>
                                    handleEditMainCategoryField(catIdx, "qty", e.target.value)
                                  }
                                  className="form-control"
                                />
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                <button
                                  className="btn btn-link p-0"
                                  // onClick={() => handleOpenAddModal(catIdx, 0)}
                                  // onClick={() => handleOpenAddModal(catIdx, null)}
                                  onClick={() => handleOpenAddModal(catIdx, null, category.id)}
                                >
                                  {console.log("cat id:", catIdx,category.id)}
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
                                  <td></td>
                                  <td>{catIdx + 1}.{itemIdx + 1}</td>
                                  <td></td>
                                  <td>{item.name}</td>
                                  <td></td>
                                  <td>{item.type}</td>
                                  <td>{item.specification}</td>
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
                                    <select
                                      value={item.uom || ""}
                                      onChange={(e) =>
                                        handleEditMaterial(catIdx, itemIdx, "uom", e.target.value)
                                      }
                                      className="form-control"
                                    >
                                      <option value="">Select</option>
                                      <option value="m">Meter</option>
                                      <option value="cm">Centimeter</option>
                                      <option value="mm">Millimeter</option>
                                      <option value="ft">Feet</option>
                                      <option value="in">Inch</option>
                                      <option value="kg">Kilogram</option>
                                      <option value="pcs">Pieces</option>
                                    </select>
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
                                      value={item.rate || ""}
                                      onChange={(e) =>
                                        handleEditMaterial(catIdx, itemIdx, "rate", e.target.value)
                                      }
                                      className="form-control"
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
                                    <input
                                      type="number"
                                      value={item.costPerUnit || ""}
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
                                    <td>
                                      <button
                                        className="btn btn-link p-0"
                                        onClick={() =>
                                          toggleSubCategory2(subCategory.id)
                                        }
                                        aria-label="Toggle sub-category 2 visibility"
                                      >
                                        {openSubCategory2Id ===
                                          subCategory.id ? (
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
                                    </td>

                                    <td></td>
                                    <td>Sub-Category Level 2</td>
                                    <td>{subCategory.name}</td>
                                    <td>

                                      <input
                                        type="text"
                                        value={subCategory.location || ""}
                                        onChange={(e) => handleEditSubCategory2Field(catIdx, subCatIdx, "location", e.target.value)}
                                        className="form-control"
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
                                      />
                                    </td>
                                    <td></td>
                                    <td>

                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        value={subCategory.qty || ""}
                                        onChange={(e) =>
                                          handleEditSubCategory2Field(catIdx, subCatIdx, "qty", e.target.value)
                                        }
                                        className="form-control"
                                      />
                                    </td>
                                    <td>

                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory.id)}
                                        aria-label="Add row to sub-category 2"
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
                                        <td></td>
                                        <td>{catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1}</td>
                                        <td></td>
                                        <td>{item.name}</td>
                                        <td>{item.location}</td>
                                        <td>{item.type}</td>
                                        <td>{item.specification}</td>
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
                                          <select
                                            value={item.uom || ""}
                                            onChange={(e) =>
                                              handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "uom", e.target.value)
                                            }
                                            className="form-control"
                                          >
                                            <option value="">Select</option>
                                            <option value="m">Meter</option>
                                            <option value="cm">Centimeter</option>
                                            <option value="mm">Millimeter</option>
                                            <option value="ft">Feet</option>
                                            <option value="in">Inch</option>
                                            <option value="kg">Kilogram</option>
                                            <option value="pcs">Pieces</option>
                                          </select>
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
                                            value={item.rate || ""}
                                            onChange={(e) =>
                                              handleEditSubCategory2Material(catIdx, subCatIdx, itemIdx, "rate", e.target.value)
                                            }
                                            className="form-control"
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
                                          <input
                                            type="number"
                                            value={item.costPerUnit || ""}
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
                                            {/* {console.log("sub3", subCategory3)}
                                            {console.log(
                                              "sub4",
                                              subCategory3.sub_categories_4
                                            )}
                                            {console.log(
                                              "sub3id:",
                                              openSubCategory3Id
                                            )} */}
                                            <td>
                                              <button
                                                className="btn btn-link p-0"
                                                onClick={() =>
                                                  toggleSubCategory3(
                                                    subCategory3.id
                                                  )
                                                }
                                                aria-label="Toggle sub-category 3 visibility"
                                              >
                                                {openSubCategory3Id ===
                                                  subCategory3.id ? (
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
                                            </td>
                                            <td></td>
                                            <td>Sub-Category Level 3</td>
                                            <td>{subCategory3.name}</td>
                                            <td>
                                              <input
                                                type="text"
                                                value={subCategory3.location || ""}
                                                onChange={(e) => handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "location", e.target.value)}
                                                className="form-control"
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
                                              />
                                            </td>
                                            <td>

                                            </td>
                                            <td>

                                            </td>
                                            <td>
                                              <input
                                                type="number"
                                                value={subCategory3.qty || ""}
                                                onChange={(e) =>
                                                  handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "qty", e.target.value)
                                                }
                                                className="form-control"
                                              />
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>


                                              <button
                                                className="btn btn-link p-0"
                                                onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx)}
                                                // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3, subCategory3.name, subCatIdx)}
                                                aria-label="Add row to sub-category 3"
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
                                                <td></td>
                                                <td>{catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1}</td>
                                                <td>Material/Labour</td>
                                                <td>{item.name}</td>
                                                <td>{item.location}</td>
                                                <td>{item.type}</td>
                                                <td>{item.specification}</td>
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
                                                  <select
                                                    value={item.uom || ""}
                                                    onChange={(e) =>
                                                      handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "uom", e.target.value)
                                                    }
                                                    className="form-control"
                                                  >
                                                    <option value="">Select</option>
                                                    <option value="m">Meter</option>
                                                    <option value="cm">Centimeter</option>
                                                    <option value="mm">Millimeter</option>
                                                    <option value="ft">Feet</option>
                                                    <option value="in">Inch</option>
                                                    <option value="kg">Kilogram</option>
                                                    <option value="pcs">Pieces</option>
                                                  </select>
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
                                                    value={item.rate || ""}
                                                    onChange={(e) =>
                                                      handleEditSubCategory3Material(catIdx, subCatIdx, subCategory3Idx, itemIdx, "rate", e.target.value)
                                                    }
                                                    className="form-control"
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
                                                  <input
                                                    type="number"
                                                    value={item.costPerUnit || ""}
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
                                                    {/* {console.log("sub3",subCategory3)}
                                                                            {console.log("sub4",subCategory3.sub_categories_4)}
                                                                            {console.log("sub3id:", openSubCategory3Id)} */}
                                                    <td>
                                                      <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                          toggleSubCategory4(
                                                            subCategory4.id
                                                          )
                                                        }
                                                        aria-label="Toggle sub-category 3 visibility"
                                                      >
                                                        {openSubCategory4Id ===
                                                          subCategory4.id ? (
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
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                      Sub-Category Level 4
                                                    </td>
                                                    <td>{subCategory4.name}</td>
                                                    <td>
                                                      <input
                                                        type="text"
                                                        value={subCategory4.location || ""}
                                                        onChange={(e) => handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "location", e.target.value)}
                                                        className="form-control"
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
                                                      />
                                                    </td>
                                                    <td>

                                                    </td>
                                                    <td>

                                                    </td>
                                                    <td>
                                                      <input
                                                        type="number"
                                                        value={subCategory4.qty || ""}
                                                        onChange={(e) =>
                                                          handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "qty", e.target.value)
                                                        }
                                                        className="form-control"
                                                      />
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                      <button
                                                        className="btn btn-link p-0"
                                                        onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx)}
                                                        // onClick={() => handleOpenAddModal(catIdx, subCatIdx,subCategory3Idx, subCategory4Idx, subCategory4.id)}
                                                        aria-label="Add row to sub-category 2"
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
                                                        <td></td>
                                                        <td>{catIdx + 1}.{subCatIdx + 1}.{subCategory3Idx + 1}.{itemIdx + 1}</td>
                                                        <td>Material/Labour</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.location}</td>
                                                        <td>{item.type}</td>
                                                        <td>{item.specification}</td>
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
                                                          <select
                                                            value={item.uom || ""}
                                                            onChange={(e) =>
                                                              handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "uom", e.target.value)
                                                            }
                                                            className="form-control"
                                                          >
                                                            <option value="">Select</option>
                                                            <option value="m">Meter</option>
                                                            <option value="cm">Centimeter</option>
                                                            <option value="mm">Millimeter</option>
                                                            <option value="ft">Feet</option>
                                                            <option value="in">Inch</option>
                                                            <option value="kg">Kilogram</option>
                                                            <option value="pcs">Pieces</option>
                                                          </select>
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
                                                            value={item.rate || ""}
                                                            onChange={(e) =>
                                                              handleEditSubCategory4Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "rate", e.target.value)
                                                            }
                                                            className="form-control"
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
                                                          <input
                                                            type="number"
                                                            value={item.costPerUnit || ""}
                                                            readOnly
                                                            disabled
                                                            className="form-control"
                                                          />
                                                        </td>

                                                        <td>
                                                          <button
                                                            className="btn btn-link p-0"
                                                            onClick={() => handleRemoveSubCategory3Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx)}
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
                                                            </td>
                                                            <td></td>
                                                            <td>
                                                              Sub-Category Level 5
                                                            </td>
                                                            <td>{
                                                              subCategory5.name
                                                            }</td>
                                                            <td>
                                                              <input
                                                                type="text"
                                                                value={subCategory5.location || ""}
                                                                onChange={(e) => handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "location", e.target.value)}
                                                                className="form-control"
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
                                                              />
                                                            </td>
                                                            <td>

                                                            </td>
                                                            <td>

                                                            </td>
                                                            <td>
                                                              <input
                                                                type="number"
                                                                value={subCategory5.qty || ""}
                                                                onChange={(e) =>
                                                                  handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "qty", e.target.value)
                                                                }
                                                                className="form-control"
                                                              />
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>
                                                              <button
                                                                className="btn btn-link p-0"
                                                                onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                // onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5.id,subCategory5Idx)}
                                                                aria-label="Add row to sub-category 2"
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
                                                                <td></td>
                                                                <td>{catIdx + 1}.{subCatIdx + 1}.{subCategory3Idx + 1}.{subCategory4Idx + 1}.{itemIdx + 1}</td>
                                                                <td></td>
                                                                <td>{item.name}</td>
                                                                <td>{item.location}</td>
                                                                <td>{item.type}</td>
                                                                <td>{item.specification}</td>
                                                                {/* ...other cells... */}
                                                                <td>
                                                                   <input
                                                            type="number"
                                                            value={item.factor || ""}
                                                            onChange={(e) =>
                                                              handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx,subCategory5Idx, itemIdx, "factor", e.target.value)
                                                            }
                                                            className="form-control"
                                                          />
                                                                </td>
                                                                <td>
                                                                  <select
                                                            value={item.uom || ""}
                                                            onChange={(e) =>
                                                              handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx,subCategory5Idx, itemIdx, "uom", e.target.value)
                                                            }
                                                            className="form-control"
                                                          >
                                                            <option value="">Select</option>
                                                            <option value="m">Meter</option>
                                                            <option value="cm">Centimeter</option>
                                                            <option value="mm">Millimeter</option>
                                                            <option value="ft">Feet</option>
                                                            <option value="in">Inch</option>
                                                            <option value="kg">Kilogram</option>
                                                            <option value="pcs">Pieces</option>
                                                          </select>
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
                                                              handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx,subCategory5Idx, itemIdx, "wastage", e.target.value)
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
                                                            value={item.rate || ""}
                                                            onChange={(e) =>
                                                              handleEditSubCategory5Material(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx,subCategory5Idx, itemIdx, "rate", e.target.value)
                                                            }
                                                            className="form-control"
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
                                                          <input
                                                            type="number"
                                                            value={item.costPerUnit || ""}
                                                            readOnly
                                                            disabled
                                                            className="form-control"
                                                          />
                                                        </td>
                                                                <td>
                                                                  <button
                                                                    className="btn btn-link p-0"
                                                                    onClick={() => handleRemoveSubCategory3Row(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx)}
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
                        ))}
                      {/* Conditional rendering for categories under sub-project  end*/}

                      {/* subProject end */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Save</button>
                            <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Export</button>
                        </div> */}

            <div className="row mt-5 mb-5 justify-content-center">
              <div className="col-md-2">
                <button className="purple-btn2 w-100">Create</button>
              </div>
            </div>

          </div>
        </div>
      </div>



      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Material/Labour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-2">
            <select
              className="form-select me-2"
              value={modalRows[0].materialType}
              onChange={e => handleModalRowChange(0, "materialType", e.target.value)}
            >
              <option value="">Select Material Type</option>
              {materialTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              className="form-select me-2"
              value={modalRows[0].specification}
              onChange={e => handleModalRowChange(0, "specification", e.target.value)}
            >
              <option value="">Select Specification</option>
              {specificationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="form-check form-check-inline me-2">
              <input
                className="form-check-input"
                type="radio"
                name="type-0"
                value="Material"
                checked={modalRows[0].type === "Material"}
                onChange={e => handleModalRowChange(0, "type", "Material")}
              />
              <label className="form-check-label">Material</label>
            </div>
            <div className="form-check form-check-inline me-2">
              <input
                className="form-check-input"
                type="radio"
                name="type-0"
                value="Labour"
                checked={modalRows[0].type === "Labour"}
                onChange={e => handleModalRowChange(0, "type", "Labour")}
              />
              <label className="form-check-label">Labour</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleCreateRows()}>
            Create
          </Button>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default EstimationCreation;
