import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";

const ApprovalEdit = () => {
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    departments: [],
    sites: [],
    modules: [], // For Modules
    material_types: [],

    users: [],
  });

  const { id } = useParams(); // Ge
  const [loading, setLoading] = useState(true); // New loading state

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // For selected module
  const [selectedMaterialType, setSelectedMaterialType] = useState(null); // For selected material type

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // const [department, selectedDeparment] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] },
  ]);

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: null,
    // category_id: null,
    // sub_category_id: null,
    module_id: null,
    material_id: null,

    // example approval type
    invoice_approval_levels: [],
  });

  console.log("Selected Company ID:", formData.company_id);
  console.log("All Sites Data:", filterOptions.sites);

  const handleAddLevel = () => {
    setApprovalLevels([
      ...approvalLevels,
      { order: "", name: "", users: [] }, // Add a new empty level
    ]);
  };

  const handleRemoveLevel = (index) => {
    const updatedLevels = approvalLevels.filter((_, i) => i !== index);
    setApprovalLevels(updatedLevels);
  };

  const handleInputChange = (index, field, value) => {
    const updatedLevels = approvalLevels.map((level, i) =>
      i === index ? { ...level, [field]: value } : level
    );
    setApprovalLevels(updatedLevels);
  };

  const userOptions =
    filterOptions.users && filterOptions.users.length > 0
      ? filterOptions.users.map((user) => ({
          value: user.value, // Assuming user.value contains the ID
          label: user.label, // Assuming user.label contains the name
        }))
      : [];

  const [selectedValues, setSelectedValues] = useState({
    company_id: null,
    site_id: null,
    department_id: null,
    category_id: null,
    sub_category_id: null,
    approval_type: "",
  });

  // useEffect(() => {
  //   const fetchDropdownData = async () => {
  //     try {
  //       // const response = await fetch(
  //       //   "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
  //       // );
  //       const [dropdownResponse, materialTypeResponse] = await Promise.all([
  //         fetch(
  //           "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
  //         ),
  //         fetch(
  //           "https://marathon.lockated.com/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
  //         ),
  //       ]);
  //       // if (!response.ok) throw new Error("Failed to fetch dropdown data");

  //       // const data = await response.json();
  //       if (!dropdownResponse.ok || !materialTypeResponse.ok) {
  //         throw new Error("Failed to fetch dropdown data or material types");
  //       }

  //       const dropdownData = await dropdownResponse.json();

  //       const materialTypesData = await materialTypeResponse.json();

  //       console.log("materialsss", materialTypesData);

  //       // Safeguard to check if material_types exists
  //       const materialTypes = materialTypesData.material_types || [];
  //       // Check if material_types is correctly set

  //       setFilterOptions({
  //         companies: [
  //           { label: "Select Company", value: "" },
  //           ...dropdownData.companies.map(([name, id]) => ({
  //             label: name,
  //             value: id,
  //           })),
  //         ],
  //         sites: [
  //           { label: "Select Site", value: "" },
  //           ...dropdownData.sites.map(([name, id, company_id]) => ({
  //             label: name,
  //             value: id,
  //             company_id,
  //           })),
  //         ],
  //         departments: [
  //           { label: "Select Department", value: "" },
  //           ...dropdownData.departments.map(([name, id]) => ({
  //             label: name,
  //             value: id,
  //           })),
  //         ],
  //         modules: [
  //           { label: "Select Module", value: "" },
  //           ...(dropdownData.approval_types
  //             ? Object.entries(dropdownData.approval_types).map(
  //                 ([key, value]) => ({
  //                   label: key.replace(/_/g, " "), // Format label (e.g., "material_order_request" → "Material Order Request")
  //                   value: value,
  //                 })
  //               )
  //             : []),
  //         ],
  //         material_types: [
  //           { label: "Select Material Type", value: "" },
  //           ...materialTypesData.map((material) => ({
  //             label: material.name,
  //             value: material.id,
  //           })),
  //         ],
  //         users: [
  //           { label: "Select User", value: "" },
  //           ...dropdownData.users.map(([name, id]) => ({
  //             label: name,
  //             value: id,
  //           })),
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching dropdown data:", error);
  //     }
  //   };

  //   const fetchApprovalData = async () => {
  //     try {
  //       // Fetch approval data from the invoice_approvals API
  //       const response = await fetch(
  //         `https://marathon.lockated.com/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch approval data");

  //       const data = await response.json();
  //       console.log("Fetched Approval Data:", data);

  //       // Fetch users data from the dropdown_list API
  //       const usersResponse = await fetch(
  //         `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //       );
  //       if (!usersResponse.ok) throw new Error("Failed to fetch users data");

  //       const usersData = await usersResponse.json();
  //       console.log("Fetched Users Data:", usersData);

  //       // Convert the users array into a Map for easier lookup
  //       const userMap = new Map(
  //         usersData.users.map((user) => [user[1], user[0]])
  //       ); // Map user ID to user name

  //       // Log the userMap to ensure it's correct
  //       console.log("User Map:", userMap);

  //       // const companyOptions =

  //       // Set form data from API response
  //       setFormData({
  //         company_id: data.company_id || null,
  //         site_id: data.project_id || null,
  //         // Set site_id from project_id
  //         department_id: data.department_id || null,
  //         module_id: data.approval_type || null,
  //         material_id: data.pms_inventory_type_id || null,

  //         invoice_approval_levels: data.invoice_approval_levels || [],
  //       });

  //       console.log("Data Company ID:", data.company_id);
  //       console.log("Companies List:", filterOptions.companies);

  //       // setSelectedCompany(
  //       //   filterOptions.companies.find(
  //       //     (company) => company.value === data.company_id
  //       //   ) || null
  //       // );

  //       const siteOption = filterOptions.sites.find(
  //         (site) => site.value === data.project_id
  //       );
  //       setSelectedSite(siteOption || null);

  //       const departmentOption = filterOptions.departments.find(
  //         (department) => department.value === data.department_id
  //       );
  //       setSelectedDepartment(departmentOption || null); // Declare

  //       const moduleOption = filterOptions.modules.find(
  //         (mod) => mod.value === data.approval_type
  //       );
  //       setSelectedModule(moduleOption || null);

  //       // Find and set selected material type
  //       const materialTypeOption = filterOptions.material_types.find(
  //         (mat) => mat.value === data.pms_inventory_type_id
  //       );
  //       setSelectedMaterialType(materialTypeOption || null);

  //       // Map user IDs to user names in invoice_approval_levels
  //       const approvalLevelsWithUserNames = data.invoice_approval_levels.map(
  //         (level) => ({
  //           order: level.order || "",
  //           name: level.name || "",
  //           users:
  //             level.escalate_to_users?.map((userId) => {
  //               // Log userId to check if it's correct
  //               console.log("User ID:", userId);

  //               const userName = userMap.get(userId) || "Unknown"; // Get the user name by ID from userMap
  //               console.log("Mapped User Name:", userName); // Log the result to see if mapping works

  //               return { label: userName, value: userId }; // Map the user ID to the name
  //             }) || [],
  //         })
  //       );

  //       // Log the final approval levels to inspect the data
  //       console.log(
  //         "Approval Levels with User Names:",
  //         approvalLevelsWithUserNames
  //       );

  //       // Set approval levels with mapped user names
  //       setApprovalLevels(approvalLevelsWithUserNames);

  //       // Fetch other data as needed (e.g., sites, templates)
  //       if (data.company_id) {
  //         await fetchSites(data.company_id);
  //       }

  //       if (data.category_id) {
  //         await fetchTemplates(data.category_id);
  //       }

  //       if (data.snag_checklist_id) {
  //         await fetchSubCategories(data.snag_checklist_id);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching approval data:", error);
  //     }
  //   };

  //   fetchDropdownData();
  //   fetchApprovalData();
  // }, [id]);

  // useEffect(() => {
  //   if (filterOptions.companies.length > 0) {
  //     setSelectedCompany(
  //       filterOptions.companies.find(
  //         (company) => company.value === data.company_id
  //       ) || null
  //     );
  //   }
  // }, [filterOptions, data.company_id]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [dropdownResponse, materialTypeResponse] = await Promise.all([
          fetch(
            "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ),
          fetch(
            "https://marathon.lockated.com/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ),
        ]);

        if (!dropdownResponse.ok || !materialTypeResponse.ok) {
          throw new Error("Failed to fetch dropdown data or material types");
        }

        const dropdownData = await dropdownResponse.json();

        const materialTypesData = await materialTypeResponse.json();

        console.log("materialsss", materialTypesData);

        // Safeguard to check if material_types exists
        const materialTypes = materialTypesData.material_types || [];
        // Check if material_types is correctly set

        // const materialTypesData = await materialTypeResponse.json();

        // // Safeguard to check if material_types exists
        // const materialTypes = materialTypesData.material_types || [];

        // Set filterOptions state
        setFilterOptions({
          companies: [
            { label: "Select Company", value: "" },
            ...dropdownData.companies.map(([name, id]) => ({
              label: name,
              value: id,
            })),
          ],
          sites: [
            { label: "Select Site", value: "" },
            ...dropdownData.sites.map(([name, id, company_id]) => ({
              label: name,
              value: id,
              company_id,
            })),
          ],
          departments: [
            { label: "Select Department", value: "" },
            ...dropdownData.departments.map(([name, id]) => ({
              label: name,
              value: id,
            })),
          ],
          modules: [
            { label: "Select Module", value: "" },
            ...(dropdownData.approval_types
              ? Object.entries(dropdownData.approval_types).map(
                  ([key, value]) => ({
                    label: key.replace(/_/g, " "), // Format label
                    value: value,
                  })
                )
              : []),
          ],
          material_types: [
            { label: "Select Material Type", value: "" },
            ...materialTypesData.map((material) => ({
              label: material.name,
              value: material.id,
            })),
          ],
          users: [
            { label: "Select User", value: "" },
            ...dropdownData.users.map(([name, id]) => ({
              label: name,
              value: id,
            })),
          ],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (selectedCompany && selectedCompany.value) {
      const fetchSites = async (companyId) => {
        try {
          const response = await fetch(
            `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?company_id=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          );
          if (!response.ok) throw new Error("Failed to fetch sites");

          const data = await response.json();
          const formattedSites = data.sites.map(([name, id]) => ({
            label: name,
            value: id,
          }));

          setFilterOptions((prevState) => ({
            ...prevState,
            sites: formattedSites, // Update sites in filterOptions
          }));
        } catch (error) {
          console.error("Error fetching sites:", error);
          setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
        }
      };

      fetchSites(selectedCompany.value);
    }
  }, [selectedCompany]); //
  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const response = await fetch(
          `https://marathon.lockated.com/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        if (!response.ok) throw new Error("Failed to fetch approval data");

        const data = await response.json();
        console.log("Fetched Approval Data:", data);

        // Set form data from API response
        setFormData({
          company_id: data.company_id || null,
          site_id: data.project_id || null,
          department_id: data.department_id || null,
          module_id: data.approval_type || null,
          material_id: data.pms_inventory_type_id || null,
          invoice_approval_levels: data.invoice_approval_levels || [],
        });

        const companyOption = filterOptions.companies.find(
          (company) => company.value === data.company_id
        );
        setSelectedCompany(companyOption || null); // Set selected company

        const siteOption = filterOptions.sites.find(
          (site) => site.value === data.project_id
        );
        setSelectedSite(siteOption || null); // Set selected site

        const departmentOption = filterOptions.departments.find(
          (department) => department.value === data.department_id
        );
        setSelectedDepartment(departmentOption || null); // Set selected department

        const moduleOption = filterOptions.modules.find(
          (mod) => mod.value === data.approval_type
        );
        setSelectedModule(moduleOption || null); // Set selected module

        const materialTypeOption = filterOptions.material_types.find(
          (mat) => mat.value === data.pms_inventory_type_id
        );
        setSelectedMaterialType(materialTypeOption || null); // Set selected material type

        // Map approval levels to user names
        const userMap = new Map(
          filterOptions.users.map((user) => [user.value, user.label])
        );

        const approvalLevelsWithUserNames = data.invoice_approval_levels.map(
          (level) => ({
            order: level.order || "",
            name: level.name || "",
            users:
              level.escalate_to_users?.map((userId) => {
                const userName = userMap.get(userId) || "Unknown";
                return { label: userName, value: userId };
              }) || [],
          })
        );

        setApprovalLevels(approvalLevelsWithUserNames);
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    if (filterOptions.companies.length > 0) {
      fetchApprovalData();
    }
  }, [filterOptions, id]); // Trigger fetchApprovalData when filterOptions or id change

  // Run this effect when filterOptions change

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption.value; // Use the value directly

    setSelectedCompany(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      company_id: companyId,
      site_id: null, // Reset site selection
    }));

    // Fetch sites based on selected company
    fetch(
      `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?company_id=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const formattedSites = data.sites.map(([name, id]) => ({
          label: name,
          value: id,
        }));
        setFilterOptions((prevState) => ({
          ...prevState,
          sites: formattedSites,
        }));
      })
      .catch((error) => {
        console.error("Error fetching sites:", error);
        setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
      });
  };

  // const handleSiteChange = (selected) => {
  //   console.log("Selected Site ID:", selected?.value); //

  //   console.log("site id", selected.value);
  //   // Logging the selected site value
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     site_id: selected.target.value, // Updating site_id in formData
  //   }));
  // };

  const handleSiteChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      site_id: selectedOption.value, // Update site_id with the selected site's value
    }));
  };

  // Handle category change

  const handleDepartmentChange = (selectedOption) => {
    console.log("Selected Department ID:", selectedOption.target.value);
    setFormData((prevState) => ({
      ...prevState,
      department_id: selectedOption.value,
    }));
  };

  const handleModuleChange = (selectedOption) => {
    console.log("Selected Module ID:", selectedOption.value);
    setSelectedModule(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      module_id: selectedOption.value, // Set module_id to selected module
    }));
  };

  const handleMaterialTypeChange = (selectedOption) => {
    console.log(
      "Selected Material Type (PMS Supplier ID):",
      selectedOption.value
    );
    setSelectedMaterialType(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      pms_supplier_id: selectedOption.value, // Map material_id to pms_supplier_id
    }));
  };

  const handleCreate = () => {
    const orderCounts = {}; // Store orders as keys
    let hasDuplicateOrder = false;

    // Iterate over the approvalLevels array
    approvalLevels.forEach((level, index) => {
      console.log(`Checking Level ${index + 1}:`, level.order);

      // Skip levels with invalid orders
      if (level.order === undefined || level.order === null) {
        console.log(
          `Skipping Level ${index + 1} as order is invalid:`,
          level.order
        );
        return;
      }

      const orderKey = String(level.order); // Normalize the order to a string
      console.log(`Normalized orderKey for Level ${index + 1}:`, orderKey);

      // Check if the order already exists in orderCounts
      if (orderCounts.hasOwnProperty(orderKey)) {
        console.log(`Duplicate Found for Level ${index + 1}:`, orderKey);
        hasDuplicateOrder = true;
      } else {
        console.log(
          `No duplicate found for Level ${index + 1}. Adding orderKey:`,
          orderKey
        );
      }

      // Mark this orderKey as processed
      orderCounts[orderKey] = true;
    });

    // If duplicate order found, show alert and stop further execution
    if (hasDuplicateOrder) {
      alert("Each approval level must have a unique order.");
      return; // Stop function execution
    }

    // If no duplicate, prepare and send the payload (rest of the logic follows)
    const payload = {
      approval_type: formData.module_id,
      company_id: formData.company_id,
      project_id: formData.site_id,
      department_id: formData.department_id,
      snag_checklist_id: formData.template_id,
      sub_category_id: formData.sub_category_id,
      category_order: 1,
      category_id: formData.category_id,
      pms_inventory_type_id: formData.pms_supplier_id,
      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        name: level.name,
        order: level.order,
        active: true,
        escalate_to_users: level.users?.map((user) => user.value) || [],
      })),
    };

    console.log("Final Payload:", payload);

    // Send API request if no duplicates found
    axios
      .patch(
        `https://marathon.lockated.com/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      )
      .then((response) => {
        console.log("Approval Created:", response.data);
        alert("Approval created successfully!");
      })
      // .catch((error, response) => {
      //   console.error("Error creating invoice approval:", response);
      //   alert("Each approval level must have a unique order");
      // });
      .catch((error) => {
        // Check if error.response exists (server responded with an error)
        if (error.response) {
          // Check if the response contains the specific error message
          const errorMessage = error.response.data.errors;

          // Check if the specific error about duplicate orders is in the error messages
          if (
            errorMessage &&
            errorMessage.includes(
              "Invoice approval levels order has already been taken"
            )
          ) {
            alert("Each approval level must have a unique order");
          } else {
            // Handle any other errors that are returned
            console.error("Error Response:", error.response);
            alert("An error occurred while creating the approval.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error Request:", error.request);
          alert("No response received from the server.");
        } else {
          // Something happened while setting up the request
          console.error("Error Message:", error.message);
          alert(`Error: ${error.message}`);
        }
      }); //
  };

  return (
    <div>
      <div
        className="website-content"
        data-select2-id="select2-data-192-0lua"
        style={{ overflowY: "auto" }}
      >
        <footer className="footer"></footer>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {/* Dynamic tabs will be inserted here */}
        </ul>
        <div
          className="tab-content"
          id="myTabContent"
          data-select2-id="select2-data-myTabContent"
        >
          <link
            rel="stylesheet"
            href="/assets/mail_room.debug-e60240217d99fc10e84cb08195762eaefdebfa65453cfc4907927bd997f6f9e5.css"
          />
          <div className="ms-3 mt-3" data-select2-id="select2-data-191-fles">
            <p>Setup &gt; Invoice Approvals</p>
            <h5 className="mt-2">INVOICE APPROVAL</h5>
            <div
              className="container-fluid p-3"
              data-select2-id="select2-data-190-iiua"
            >
              <div className="row">
                <div>
                  <input
                    type="hidden"
                    name="authenticity_token"
                    defaultValue="M7lSHxX9HuyNx5l_jkvdgnhAmhQ7gh3Vnv_wr6fKS30l24vqwHbNTnaUsp_NJu9LeGEhKm1hyNeP7XjH6dt6pA"
                    autoComplete="off"
                  />
                  <input
                    type="hidden"
                    name="subaction"
                    id="subaction"
                    autoComplete="off"
                  />
                  <div
                    className="row my-4 align-items-center"
                    data-select2-id="select2-data-188-ekbm"
                  >
                    <div
                      className="col-md-12 "
                      data-select2-id="select2-data-187-y2ya"
                    >
                      <div className="card mt-3 pb-4">
                        <CollapsibleCard title="Configure Details">
                          <div>
                            <div className="row my-2 align-items-end">
                              {/* Event Title */}
                              <div className="col-md-3">
                                <label htmlFor="event-title-select">
                                  Select Comapny
                                </label>

                                <MultiSelector
                                  options={filterOptions.companies}
                                  value={selectedCompany}
                                  onChange={handleCompanyChange}
                                  placeholder="select comapny"
                                />
                              </div>

                              {/* Event Number */}
                              <div className="col-md-3">
                                <label htmlFor="event-no-select">Site</label>
                                <MultiSelector
                                  id="event-no-select"
                                  options={filterOptions.sites}
                                  placeholder="Select Site"
                                  onChange={handleSiteChange}
                                  value={selectedSite}
                                  isClearable
                                />
                              </div>

                              {/* Status */}
                              <div className="col-md-3">
                                <label htmlFor="status-select">
                                  Department
                                </label>
                                <MultiSelector
                                  id="status-select"
                                  options={filterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment}
                                  placeholder="Select Department"
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Module
                                </label>
                                <MultiSelector
                                  id="module-select"
                                  options={filterOptions.modules} // Use modifiedFilterOptions.modules
                                  value={selectedModule}
                                  onChange={handleModuleChange}
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Material type
                                </label>

                                <MultiSelector
                                  id="material-type-select"
                                  options={filterOptions.material_types} // Use filterOptions directly
                                  value={selectedMaterialType}
                                  // onChange={(option) =>
                                  //   setSelectedMaterialType(option)
                                  // } // Ha
                                  //
                                  // ndle selection

                                  onChange={handleMaterialTypeChange}
                                  isClearable
                                />
                              </div>
                              {/* Created By */}
                              {/* <div className="col-md-3">
                                <label htmlFor="created-by-select">
                                  Module
                                </label>
                                <Select
                                  id="created-by-select"
                                  
                                  value={selectedModule}
                                  onChange={handleModuleChange}
                                />
                              </div> */}
                              {/* <div className="col-md-3 mt-3">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Material type
                                </label>
                                <Select
                                  id="created-by-select"
                                  options={filterOptions.material_types}
                                  isClearable
                                  value={selectedMaterialType}
                                  onChange={handleMaterialTypeChange}
                                />
                              </div> */}

                              {/* <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Sub Category
                                </label>
                                <Select
                                  id="created-by-select"
                                  options={filterOptions.sub_categories}
                                  isClearable
                                  onChange={handleSubCategoryChange}
                                />
                              </div> */}
                            </div>
                          </div>
                        </CollapsibleCard>
                        <div className="card mt-3 pb-4 ms-3 ">
                          <div className="card-header mb-3 ">
                            <h3 className="card-title">Approval Levels</h3>
                          </div>

                          {approvalLevels.map((level, index) => (
                            <div
                              key={index}
                              className="px-4"
                              style={{
                                display: "flex",
                                columnGap: 20,
                                alignItems: "center",
                              }}
                            >
                              <fieldset className="border">
                                <legend className="float-none">
                                  Order{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group order"
                                  placeholder="Enter Order"
                                  value={level.order}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "order",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </fieldset>
                              <fieldset className="border ms-4">
                                <legend className="float-none">
                                  Name of Level{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <input
                                  className="form-group name"
                                  placeholder="Enter Name of Level"
                                  value={level.name}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  required
                                  type="text"
                                />
                              </fieldset>
                              <fieldset
                                className="user-list ms-3 mb-3"
                                style={{ width: "15%" }} //
                              >
                                <legend className="float-none mb-2">
                                  Users{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                <MultiSelector
                                  options={userOptions}
                                  value={level.users}
                                  onChange={(selected) =>
                                    handleInputChange(index, "users", selected)
                                  }
                                  placeholder="Select Users"
                                />
                              </fieldset>
                              <button
                                className="remove-item ms-4 mb-3 px-2 rounded purple-btn1"
                                style={{ padding: "1px 3px" }}
                                onClick={() => handleRemoveLevel(index)}
                              >
                                x
                              </button>
                            </div>
                          ))}
                          <div className="ms-3 mt-2">
                            <button
                              className=" purple-btn1 submit-btn"
                              onClick={handleAddLevel}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div></div>
                      </div>

                      {/* </div> */}
                      <div style={{ textAlign: "center" }}>
                        <button
                          className="purple-btn1 submit-btn"
                          onClick={handleCreate}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dynamic tab content will be inserted here */}
        </div>
      </div>
    </div>
  );
};

export default ApprovalEdit;
