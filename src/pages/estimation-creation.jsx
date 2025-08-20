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
import { baseURL } from "../confi/apiDomain";




const EstimationCreation = () => {
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

  // 🔹 Fetch sub-project details when project or site changes
  // useEffect(() => {
  //   if (!selectedProject && !selectedSite) return;

  //   const fetchDetails = async () => {
  //     try {
  //       const newType = selectedSite ? "sub_project" : "project";
  //       setType(newType);
  //       const type = selectedSite ? "sub_project" : "project";
  //       const id = selectedSite ? selectedSite.value : selectedProject.value;

  //       const res = await axios.get(
  //         `${baseURL}estimation_details/${id}/budget_details.json?type=${type}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //       );

  //       setDetails(res.data);
  //       setBudgetType(res.data?.data?.budget_type || ""); // ✅ save budget_type
  //     } catch (err) {
  //       console.error("Error fetching sub-project details", err);
  //     }
  //   };

  //   fetchDetails();
  // }, [selectedProject, selectedSite]);


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

  console.log("budget type:", budgetType)
  // 🔹 Dynamic title
  // const cardTitle = type === "sub_project" ? "Sub-Project Details" : "Project Details";
  const cardTitle =
    type === "wing"
      ? "Wing Details"
      : type === "sub_project"
        ? "Sub-Project Details"
        : "Project Details";
  // console.log("details selected:", details)
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
        `${baseURL}work_categories/work_sub_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,

      )
      .then((res) => {
        console.log("responce cat:", res.data)
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
  // const handleModalRowChange = (idx, field, value) => {
  //   const updatedRows = modalRows.map((row, i) =>
  //     i === idx ? { ...row, [field]: value } : row
  //   );
  //   setModalRows(updatedRows);
  // };


  // const handleModalRowChange = (idx, field, newValue) => {
  //   const updatedRows = modalRows.map((row, i) => {
  //     if (i === idx) {
  //       // If object {value, label}, store value separately and label separately
  //       if (newValue && typeof newValue === "object" && "value" in newValue) {
  //         return {
  //           ...row,
  //           [field]: newValue.value,
  //           [`${field}Label`]: newValue.label
  //         };
  //       }
  //       return { ...row, [field]: newValue };
  //     }
  //     return row;
  //   });
  //   setModalRows(updatedRows);
  // };





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
              generic_info: row.specificationLabel || null, // assuming label contains "GRADE" etc.
              project_id: selectedProject?.value || null,
              pms_site_id: selectedSite?.value || null,
              pms_wing_id: selectedWing?.value || null,
              token: "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
            }
          }
        );

        updatedRows[idx].rate = res.data?.rate || 0;
      } catch (err) {
        console.error("Error fetching material rate", err);
        updatedRows[idx].rate = 0;
      }
    }

    setModalRows(updatedRows);
  };





  console.log("modalRows before create:", modalRows);

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



  const [lastCreatedLevelIds, setLastCreatedLevelIds] = useState({
    level_one_id: null,
    level_two_id: null,
    level_three_id: null,
    level_four_id: null,
    level_five_id: null,
  });

  const [lastMaterialDetails, setLastMaterialDetails] = useState([]);
  // const handleCreateRows = (
  //   subCategory3Idx = modalSubCategory3Idx,
  //   subCategory4Idx = modalSubCategory4Idx,
  //   subCategory5Idx = modalSubCategory5Idx
  // ) => {
  //   setSubProjectDetails(prev => {
  //     const updated = { ...prev };
  //     // const targetArr = getTargetArrayFromPath(updated, somePath); // however you fetch it
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
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx !== null &&
  //       subCategory4Idx !== null &&
  //       subCategory5Idx === null
  //     ) {
  //       // Sub-category 4
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.material_type_details;
  //     } else if (
  //       modalSubCategoryIdx !== null &&
  //       subCategory3Idx !== null &&
  //       subCategory4Idx !== null &&
  //       subCategory5Idx !== null
  //     ) {
  //       // Sub-category 5
  //       targetArr = updated.categories[modalCategoryIdx].sub_categories_2[modalSubCategoryIdx].sub_categories_3[subCategory3Idx]?.sub_categories_4[subCategory4Idx]?.sub_categories_5[subCategory5Idx]?.material_type_details;
  //     }

  //     if (!targetArr) return prev; // Prevent error if path is invalid

  //     const row = modalRows[0];
  //     // // modalRows.forEach(row => {
  //     // targetArr.push({
  //     //   id: Date.now() + Math.random(),
  //     //   name: row.materialType,
  //     //   specification: row.specification,
  //     //   type: row.type,
  //     //   location: "",
  //     //   qty: "",
  //     //   rate: "",
  //     //   wastage: "",
  //     // });
  //     // });


  //     // Check if a row with same materialType, specification, and type exists
  //     // const isDuplicate = targetArr.some(item =>
  //     //   item.name === row.materialTypeLabel &&
  //     //   item.specification === row.specificationLabel &&
  //     //   item.type === row.type
  //     // );

  //     // if (!isDuplicate) {
  //     //   targetArr.push({
  //     //     id: Date.now() + Math.random(),
  //     //     materilTypeId: row.materialType,
  //     //     name: row.materialTypeLabel,
  //     //     specificationId: row.specification,
  //     //     specification: row.specificationLabel,
  //     //     labourAct: row.labourAct,
  //     //     labourActLabel:row.labourActLabel,
  //     //     type: row.type,
  //     //     location: "",
  //     //     qty: "",
  //     //     rate: "",
  //     //     wastage: "",
  //     //   });
  //     // } else {
  //     //   // console.warn("Duplicate row skipped:", row);
  //     // }


  //     let isDuplicate = false;

  //     if (row.type === "Material") {
  //       // Duplicate check for Material rows
  //       isDuplicate = targetArr.some(item =>
  //         item.type === "Material" &&
  //         item.name === row.materialTypeLabel &&
  //         item.specification === row.specificationLabel
  //       );
  //     } else if (row.type === "Labour") {
  //       // Duplicate check for Labour rows
  //       isDuplicate = targetArr.some(item =>
  //         item.type === "Labour" &&
  //         item.labourActLabel === row.labourTypeLabel
  //       );
  //     } else if (row.type === "Composite") {
  //       // Duplicate check for Labour rows
  //       isDuplicate = targetArr.some(item =>
  //         item.type === "Composite" &&
  //         item.compositeValue === row.compositeValue
  //       );
  //     }

  //     if (!isDuplicate) {
  //       targetArr.push({
  //         id: Date.now() + Math.random(),
  //         materilTypeId: row.materialType,
  //         name: row.materialTypeLabel,
  //         specificationId: row.specification,
  //         specification: row.specificationLabel,
  //         labourAct: row.labourType,
  //         labourActLabel: row.labourTypeLabel,
  //         compositeValue: row.compositeValue,
  //         type: row.type,
  //         location: "",
  //         qty: "",
  //         rate: "",
  //         wastage: "",
  //       });
  //     } else {
  //       console.warn("Duplicate row skipped:", row);
  //     }

  //     // console.log("modal row:",targetArr)
  //     return updated;
  //   });
  //   setShowAddModal(false);
  // };

  // const [activeAddLevel, setActiveAddLevel] = useState({
  //   level: null, // "main", "sub2", "sub3", "sub4", "sub5"
  //   indices: {}  // {catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx}
  // });

  const [activeAddLevel, setActiveAddLevel] = useState({});

  function getCurrentLevel({
    modalCategoryIdx,
    modalSubCategoryIdx,
    modalSubCategory3Idx,
    modalSubCategory4Idx,
    modalSubCategory5Idx
  }) {
    if (
      modalCategoryIdx !== null &&
      modalSubCategoryIdx === null &&
      modalSubCategory3Idx === null &&
      modalSubCategory4Idx === null &&
      modalSubCategory5Idx === null
    ) return "main";
    if (
      modalCategoryIdx !== null &&
      modalSubCategoryIdx !== null &&
      modalSubCategory3Idx === null &&
      modalSubCategory4Idx === null &&
      modalSubCategory5Idx === null
    ) return "sub2";
    if (
      modalCategoryIdx !== null &&
      modalSubCategoryIdx !== null &&
      modalSubCategory3Idx !== null &&
      modalSubCategory4Idx === null &&
      modalSubCategory5Idx === null
    ) return "sub3";
    if (
      modalCategoryIdx !== null &&
      modalSubCategoryIdx !== null &&
      modalSubCategory3Idx !== null &&
      modalSubCategory4Idx !== null &&
      modalSubCategory5Idx === null
    ) return "sub4";
    if (
      modalCategoryIdx !== null &&
      modalSubCategoryIdx !== null &&
      modalSubCategory3Idx !== null &&
      modalSubCategory4Idx !== null &&
      modalSubCategory5Idx !== null
    ) return "sub5";
    return null;
  }

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

      if (targetArr.length === 0) {
        setActiveAddLevel(prev => {
          const updated = { ...prev };
          delete updated[modalCategoryIdx];
          return updated;
        });
      }



      const row = modalRows[0];

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

      // ✅ Store both level IDs and targetArr in state
      setLastCreatedLevelIds(levelIds);
      setLastMaterialDetails([...targetArr]);

      return updated;
    });


    // ...inside handleCreateRows, after adding a row...
    const currentLevel = getCurrentLevel({
      modalCategoryIdx,
      modalSubCategoryIdx,
      modalSubCategory3Idx,
      modalSubCategory4Idx,
      modalSubCategory5Idx
    });


    setActiveAddLevel(prev => ({
      ...prev,
      [modalCategoryIdx]: {
        level: currentLevel,
        indices: {
          catIdx: modalCategoryIdx,
          subCatIdx: modalSubCategoryIdx,
          subCategory3Idx: modalSubCategory3Idx,
          subCategory4Idx: modalSubCategory4Idx,
          subCategory5Idx: modalSubCategory5Idx
        }
      }
    }));




    setShowAddModal(false);
  };



  console.log("last ids:", lastCreatedLevelIds)
  console.log("last material details:", lastMaterialDetails)



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

  // Fetch generic specifications for materials
  console.log("inventory type 2:", selectedInventory2)
  useEffect(() => {

    if (selectedInventory2 || modalRows[0].materialType) {
      axios
        .get(
          `${baseURL}pms/generic_infos.json?q[inventory_type_id_eq]=${modalRows[0].materialType}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

  }, [selectedInventory2, baseURL, modalRows]); // Runs when materials or baseURL changes
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
        console.log("options cat:***********************", options)
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



  console.log("data paylod on**********************", mappedData);



  const payload = {
    company_id: selectedCompany?.value,
    project_id: selectedProject?.value,
    pms_site_id: selectedSite?.value,
    // pms_wing_id: wingId,
    estimation_items: mappedData
  };
  console.log("payload create budget****:", payload)


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
                      {/* <input
                        disabled
                        className="form-control"
                        type="text"
                        placeholder="Floors"
                        value={details?.data.budget_type || "-"}
                      /> */}
                      <input
                        disabled
                        className="form-control"
                        type="text"
                        placeholder=""
                        value={
                          details?.data.budget_type === "non_wbs"
                            ? "non wbs"
                            : details?.data.budget_type || ""
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


            {/* <pre>{JSON.stringify(subProjectDetails, null, 2)}</pre> */}

            {/* ______________________________________________________________________________________________________ */}
            {budgetType === "wbs" && (
              <div className="mx-3 mb-5 mt-3">


                <div className="mx-3 ">
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
                          <th className="text-start">Items <span>*</span></th>
                          <th className="text-start">Factor <span>*</span></th>
                          <th className="text-start" style={{ width: "200px" }}>UOM <span>*</span></th>
                          {/* <th className="text-start">Area</th> */}
                          <th className="text-start">QTY Excl Wastage <span>*</span></th>
                          <th className="text-start">Wastage</th>
                          <th className="text-start">QTY incl Waste</th>
                          <th className="text-start">Rate <span>*</span></th>
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
                                    disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "main"}
                                  // disabled={activeAddLevel.level && activeAddLevel.level !== "main"}
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
                                    <td></td>
                                    <td>
                                      {/* {catIdx + 1}.{itemIdx + 1} */}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item.type}</td>
                                    <td>{item.name} {item.specification || item.labourActLabel || item.compositeValue}</td>
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
                                        value={item.rate || ""}
                                        onChange={(e) =>
                                          handleEditMaterial(catIdx, itemIdx, "rate", e.target.value)
                                        }
                                        className="form-control"
                                        disabled={item.type === "material"} // ✅ Disable if Material
                                      />
                                      {console.log("item type***********:", item.type)}
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
                                        <SingleSelector
                                          options={unitOfMeasures}
                                          value={
                                            unitOfMeasures.find(opt => opt.value === subCategory.uom)
                                          }
                                          placeholder="Select UOM"
                                          onChange={selectedOption =>
                                            handleEditSubCategory2Field(catIdx, subCatIdx, "uom", selectedOption?.value || "")
                                          }
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
                                          disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub2"}
                                          // disabled={activeAddLevel.level && activeAddLevel.level !== "sub2"}
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
                                          <td>
                                            {/* {catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1} */}
                                          </td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>{item.type}</td>
                                          <td>{item.name} {item.specification || item.labourActLabel || item.compositeValue}</td>
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
                                              value={item.rate || ""}
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
                                                <SingleSelector
                                                  options={unitOfMeasures}
                                                  value={
                                                    unitOfMeasures.find(opt => opt.value === subCategory3.uom)
                                                  }
                                                  placeholder="Select UOM"
                                                  onChange={selectedOption =>
                                                    handleEditSubCategory3Field(catIdx, subCatIdx, subCategory3Idx, "uom", selectedOption?.value || "")
                                                  }
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
                                                  disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub3"}
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
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td>{item.location}</td>
                                                  <td>{item.type}</td>
                                                  <td>
                                                    {/* {item.specification} */}
                                                    {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                      value={item.rate || ""}
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
                                                        <SingleSelector
                                                          options={unitOfMeasures}
                                                          value={
                                                            unitOfMeasures.find(opt => opt.value === subCategory4.uom)
                                                          }
                                                          placeholder="Select UOM"
                                                          onChange={selectedOption =>
                                                            handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "uom", selectedOption?.value || "")
                                                          }
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
                                                          disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub4"}
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
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td>{item.location}</td>
                                                          <td>{item.type}</td>
                                                          <td>
                                                            {/* {item.specification} */}
                                                            {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                              value={item.rate || ""}
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
                                                                <SingleSelector
                                                                  options={unitOfMeasures}
                                                                  value={
                                                                    unitOfMeasures.find(opt => opt.value === subCategory5.uom)
                                                                  }
                                                                  placeholder="Select UOM"
                                                                  onChange={selectedOption =>
                                                                    handleEditSubCategory5Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, "uom", selectedOption?.value || "")
                                                                  }
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
                                                                  disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub5"}
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
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td>{item.location}</td>
                                                                  <td>{item.type}</td>
                                                                  <td>
                                                                    {/* {item.specification || item.labourActLabel} */}
                                                                    {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                                      value={item.rate || ""}
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
            )}


            {/* ********************************************************************************************* */}

            {budgetType === "non_wbs" && (

              <div className="mx-3 mb-5 mt-3">


                <div className="mx-3 ">
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
                          <th className="text-start">Items <span>*</span></th>
                          {/* <th className="text-start">Factor</th> */}
                          <th className="text-start" style={{ width: "200px" }}>UOM <span>*</span></th>
                          {/* <th className="text-start">Area</th> */}
                          <th className="text-start">QTY Excl Wastage <span>*</span></th>
                          {/* <th className="text-start">Wastage</th> */}
                          {/* <th className="text-start">QTY incl Waste</th> */}
                          <th className="text-start">Rate <span>*</span></th>
                          <th className="text-start">Amount</th>
                          {/* <th className="text-start">Cost Per Unit</th> */}
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
                          {/* <th className="text-start"></th> */}
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
                                {/* <td></td>
                              <td></td> */}
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
                                {/* <td></td> */}
                                <td>
                                  <button
                                    className="btn btn-link p-0"
                                    // onClick={() => handleOpenAddModal(catIdx, 0)}
                                    // onClick={() => handleOpenAddModal(catIdx, null)}
                                    onClick={() => handleOpenAddModal(catIdx, null, category.id)}
                                    disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "main"}
                                  // disabled={activeAddLevel.level && activeAddLevel.level !== "main"}
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
                                    <td></td>
                                    <td>
                                      {/* {catIdx + 1}.{itemIdx + 1} */}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{item.type}</td>
                                    <td>{item.name} {item.specification || item.labourActLabel || item.compositeValue}</td>
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


                                    </td>
                                    {/* <td></td> */}
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
                                          handleEditMaterial2(catIdx, itemIdx, "qty", e.target.value)
                                        }
                                        className="form-control"
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        value={item.rate || ""}
                                        onChange={(e) =>
                                          handleEditMaterial2(catIdx, itemIdx, "rate", e.target.value)
                                        }
                                        className="form-control"
                                        disabled={item.type === "material"} // ✅ Disable if Material
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
                                      {/* <td></td> */}
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
                                      {/* <td>

                                    </td>
                                    <td></td> */}
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
                                      {/* <td></td> */}
                                      <td>
                                        <button
                                          className="btn btn-link p-0"
                                          onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory.id)}
                                          disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub2"}
                                          // disabled={activeAddLevel.level && activeAddLevel.level !== "sub2"}
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
                                          <td>
                                            {/* {catIdx + 1}.{subCatIdx + 1}.{itemIdx + 1} */}
                                          </td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>{item.type}</td>
                                          <td>{item.name} {item.specification || item.labourActLabel || item.compositeValue}</td>
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
                                              value={item.rate || ""}
                                              onChange={(e) =>
                                                handleEditMaterial2SubCat2(catIdx, subCatIdx, itemIdx, "rate", e.target.value)
                                              }
                                              className="form-control"
                                            disabled={item.type === "material"}
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
                                              {/* <td>

                                            </td> */}
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
                                              {/* <td></td>
                                            <td></td> */}
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
                                              {/* <td></td> */}
                                              <td>


                                                <button
                                                  className="btn btn-link p-0"
                                                  onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx)}
                                                  disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub3"}
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
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td>{item.location}</td>
                                                  <td>{item.type}</td>
                                                  <td>
                                                    {/* {item.specification} */}
                                                    {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                      value={item.rate || ""}
                                                      onChange={(e) =>
                                                        handleEditMaterial2SubCat3(catIdx, subCatIdx, subCategory3Idx, itemIdx, "rate", e.target.value)
                                                      }
                                                      className="form-control"
                                                      disabled={item.type === "material"}
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
                                                        <SingleSelector
                                                          options={unitOfMeasures}
                                                          value={
                                                            unitOfMeasures.find(opt => opt.value === subCategory4.uom)
                                                          }
                                                          placeholder="Select UOM"
                                                          onChange={selectedOption =>
                                                            handleEditSubCategory4Field(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, "uom", selectedOption?.value || "")
                                                          }
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
                                                      {/* <td></td> */}

                                                      <td>
                                                        <button
                                                          className="btn btn-link p-0"
                                                          onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx)}
                                                          disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub4"}
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
                                                          <td></td>
                                                          <td></td>
                                                          <td></td>
                                                          <td>{item.location}</td>
                                                          <td>{item.type}</td>
                                                          <td>
                                                            {/* {item.specification} */}
                                                            {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                              value={item.rate || ""}
                                                              onChange={(e) =>
                                                                handleEditMaterial2SubCat4(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, itemIdx, "rate", e.target.value)
                                                              }
                                                              className="form-control"
                                                              disabled={item.type === "material"}
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
                                                              {/* <td>

                                                            </td> */}
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
                                                              {/* <td></td>
                                                            <td></td> */}
                                                              <td></td>
                                                              <td>
                                                                {
                                                                  subCategory5.material_type_details
                                                                    ? subCategory5.material_type_details.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
                                                                    : 0
                                                                }
                                                              </td>
                                                              {/* <td></td> */}
                                                              <td>
                                                                <button
                                                                  className="btn btn-link p-0"
                                                                  onClick={() => handleOpenAddModal(catIdx, subCatIdx, subCategory3.id, subCategory3Idx, subCategory4Idx, subCategory5Idx)}
                                                                  disabled={activeAddLevel[catIdx]?.level && activeAddLevel[catIdx]?.level !== "sub5"}
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
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td></td>
                                                                  <td>{item.location}</td>
                                                                  <td>{item.type}</td>
                                                                  <td>
                                                                    {/* {item.specification || item.labourActLabel} */}
                                                                    {item.name} {item.specification || item.labourActLabel || item.compositeValue}
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
                                                                      value={item.rate || ""}
                                                                      onChange={(e) =>
                                                                        handleEditMaterial2SubCat5(catIdx, subCatIdx, subCategory3Idx, subCategory4Idx, subCategory5Idx, itemIdx, "rate", e.target.value)
                                                                      }
                                                                      className="form-control"
                                                                      disabled={item.type === "material"}
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
            )}

            {console.log("budget type:", typeof budgetType, budgetType)}
            {/* <div className="d-flex justify-content-end mx-3">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button className="purple-btn2">Download Template</button>
                            <button className="purple-btn2">Save</button>
                            <button className="purple-btn2">Import</button>
                            <button className="purple-btn2">Export</button>
                        </div> */}




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

          {/* Row 1: Radio Buttons */}
          <div className="row p-3">
            <div className="d-flex align-items-center mb-2">
              <div className="form-check form-check-inline me-2 col-md-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type-0"
                  value="material"
                  checked={modalRows[0].type === "material"}
                  onChange={() => handleModalRowChange(0, "type", "material")}
                />
                <label className="form-check-label">Material</label>
              </div>

              <div className="form-check form-check-inline me-2 col-md-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type-0"
                  value="labour"
                  checked={modalRows[0].type === "labour"}
                  onChange={() => handleModalRowChange(0, "type", "labour")}
                />
                <label className="form-check-label">Labour</label>
              </div>

              <div className="form-check form-check-inline me-2 col-md-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="type-0"
                  value="composite"
                  checked={modalRows[0].type === "composite"}
                  onChange={() => handleModalRowChange(0, "type", "composite")}
                />
                <label className="form-check-label">Composite</label>
              </div>
            </div>

            {/* Row 2: Material Type & Specification (only for Material) */}

            {modalRows[0].type === "material" && (
              <div className="d-flex align-items-center mb-2">
                <div className="col-md-6 mt-3">
                  <div className="form-group">
                    <label>Material Type</label>


                    <SingleSelector
                      options={inventoryTypes2} // same data you had in select
                      value={inventoryTypes2.find(
                        option => option.value === modalRows[0].materialType
                      )}
                      placeholder="Select Material Type"
                      onChange={selectedOption =>
                        handleModalRowChange(0, "materialType", selectedOption || "")
                      }
                    />

                  </div>
                </div>
                <div className="col-md-6 mt-3 ms-3 ">
                  <div className="form-group">
                    <label>Generic Specification</label>
                    <SingleSelector
                      options={Array.isArray(genericSpecifications) ? genericSpecifications : []}
                      value={genericSpecifications.find((option) => option.value === modalRows[0].specification)} // Bind value to state
                      placeholder={`Select Specification`} // Dynamic placeholder
                      // onChange={(selectedOption) => handleSelectorChange("genericSpecification", selectedOption)}
                      onChange={selectedOption => handleModalRowChange(0, "specification", selectedOption || "")}
                    />
                  </div>

                </div>
              </div>

            )}



            {/* Conditional Labour Type Select */}
            {modalRows[0].type === "labour" && (

              <div className="col-md-6 mt-3">
                <div className="form-group">
                  <label>Labour Activity</label>
                  <SingleSelector
                    options={labourActivities}
                    value={labourActivities.find(
                      option => option.value === modalRows[0].labourType
                    )}
                    placeholder="Select Labour Activity"
                    onChange={selectedOption =>
                      handleModalRowChange(0, "labourType", selectedOption || "")
                    }
                  />
                  {console.log("cat:", labourActivities)}
                </div>
              </div>

            )}

            {/* Conditional Composite Input */}
            {modalRows[0].type === "composite" && (
              <div className="col-md-6 mt-3">
                <div className="form-group">
                  <label>Composite Value</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter composite value"
                    value={modalRows[0].compositeValue || ""}
                    onChange={e =>
                      handleModalRowChange(0, "compositeValue", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button
            className="purple-btn2 me-4"
            // onClick={() => {
            //     console.log("Selected Date Range:", dateRange);
            //     setShowDateModal(false); // Close modal
            // }}
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

export default EstimationCreation;
