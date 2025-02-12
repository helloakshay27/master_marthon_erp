import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";

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

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  // const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [wingsOptions, setWingsOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  // const [selectedTemplates, setSelectedTemplates] = useState(null);

  const [selectedSubProject, setSelectedSubProject] = useState(null);

  const [selectedDeparment, setSelectedDeparment] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState([]);

  const [showMaterialType, setShowMaterialType] = useState(false);

  const [selectedSite, setSelectedSite] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]); // For selected module
  const [selectedMaterialType, setSelectedMaterialType] = useState(null); // For selected material type

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState([]);

  // const [department, selectedDeparment] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { id: "", order: "", name: "", users: [] },
  ]);

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: null,
    site_id: null,
    // category_id: null,
    // sub_category_id: null,
    module_id: null,
    material_id: null,

    // example approval type
    invoice_approval_levels: [],
  });

  console.log("Selected Company ID:", formData.company_id);
  console.log("selected site:", formData.project_id);
  console.log("selected deparment:", formData.department_id);
  console.log("selected module:", formData.module_id);
  console.log("selected materila", formData.material_id);

  const handleAddLevel = () => {
    setApprovalLevels([
      ...approvalLevels,
      { id: "", order: "", name: "", users: [] }, // Add a new empty level
    ]);
  };

  const handleRemoveLevel = (index) => {
    const updatedLevels = approvalLevels.filter((_, i) => i !== index);
    setApprovalLevels(updatedLevels);
  };

  const handleInputChange = (index, field, value) => {
    console.log(`Updating ${field} at index ${index}:`, value);
    const updatedLevels = approvalLevels.map((level, i) =>
      i === index ? { ...level, [field]: value } : level
    );
    setApprovalLevels(updatedLevels);
  };

  // console.log("Selected Users:", level.users);

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

  // useEffect(() => {
  //   if (selectedCompany && selectedCompany.value) {
  //     const fetchSites = async (companyId) => {
  //       try {
  //         const response = await fetch(
  //           `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?company_id=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //         );
  //         if (!response.ok) throw new Error("Failed to fetch sites");

  //         const data = await response.json();
  //         const formattedSites = data.sites.map(([name, id]) => ({
  //           label: name,
  //           value: id,
  //         }));

  //         setFilterOptions((prevState) => ({
  //           ...prevState,
  //           sites: formattedSites, // Update sites in filterOptions
  //         }));
  //       } catch (error) {
  //         console.error("Error fetching sites:", error);
  //         setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
  //       }
  //     };

  //     fetchSites(selectedCompany.value);
  //   }
  // }, [selectedCompany]); //

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedDepartment?.value) return; // Ensure department is selected

      try {
        const response = await axios.get(
          `https://marathon.lockated.com/users.json?q[department_id_eq]=${selectedDepartment.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data && Array.isArray(response.data)) {
          const userOptions = response.data.map((user) => ({
            value: user.id,
            label: user.full_name, // Ensure full_name is mapped correctly
          }));

          console.log("Fetched Users:", userOptions);
          setDepartmentUsers(userOptions);
        }
      } catch (error) {
        console.error("Error fetching users for department:", error);
        setDepartmentUsers([]); // Reset users on error
      }
    };

    fetchUsers(); // Fetch users on mount & when department changes
  }, [selectedDepartment]);

  // useEffect(() => {
  //   const fetchApprovalData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://marathon.lockated.com/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch approval data");

  //       const data = await response.json();
  //       console.log("Fetched Approval Data:", data);

  //       // Set form data from API response
  //       setFormData({
  //         company_id: data.company_id || null,
  //         site_id: data.site_id || null,
  //         project_id: data.project_id || null,
  //         department_id: data.department_id || null,
  //         module_id: data.approval_type || null,
  //         material_id: data.pms_inventory_type_id || null,
  //         invoice_approval_levels: data.invoice_approval_levels || [],
  //       });

  //       // Ensure `companies` list is loaded before setting values
  //       if (!companies.length) return;

  //       const companyOption = companies.find((c) => c.id === data.company_id);
  //       if (companyOption) {
  //         setSelectedCompany({
  //           value: companyOption.id,
  //           label: companyOption.name,
  //         });

  //         // Fetch projects based on preselected company
  //         setProjects(
  //           companyOption.projects.map((prj) => ({
  //             value: prj.id,
  //             label: prj.name,
  //           }))
  //         );

  //         // Find and set selected project
  //         const projectOption = companyOption.projects.find(
  //           (p) => p.id === data.project_id
  //         );
  //         setSelectedProject(
  //           projectOption
  //             ? { value: projectOption.id, label: projectOption.name }
  //             : null
  //         );
  //         console.log;

  //         if (projectOption) {
  //           // Fetch sites (sub-projects) based on preselected project
  //           setSiteOptions(
  //             projectOption.pms_sites.map((site) => ({
  //               value: site.id,
  //               label: site.name,
  //             }))
  //           );

  //           // Find and set selected sub-project (site)
  //           const siteOption = projectOption.pms_sites.find(
  //             (s) => s.id === data.site_id
  //           );
  //           setSelectedSite(
  //             siteOption
  //               ? { value: siteOption.id, label: siteOption.name }
  //               : null
  //           );
  //         }
  //       }

  //       const departmentOption = filterOptions.departments.find(
  //         (department) => department.value === data.department_id
  //       );
  //       setSelectedDepartment(departmentOption || null);

  //       // Find the preselected module option
  //       const moduleOption = filterOptions.modules.find(
  //         (mod) => mod.value === data.approval_type
  //       );

  //       // Determine if Material Type dropdown should be shown
  //       const isMaterialOrderRequest =
  //         moduleOption?.label?.toLowerCase() === "material order request";

  //       setShowMaterialType(isMaterialOrderRequest); // Update visibility state

  //       setSelectedModule(moduleOption || null);

  //       // Find and set preselected material type
  //       const materialTypeOption = filterOptions.material_types.find(
  //         (mat) => mat.value === data.pms_inventory_type_id
  //       );
  //       setSelectedMaterialType(materialTypeOption || null);

  //       const userMap = new Map(
  //         departmentUsers?.length
  //           ? departmentUsers.map((user) => [
  //               user.value,
  //               user.label || "Unknown User",
  //             ])
  //           : []
  //       );

  //       console.log("User Map:", userMap);

  //       const approvalLevelsWithUserNames = Array.isArray(
  //         data.invoice_approval_levels
  //       )
  //         ? data.invoice_approval_levels.map((level) => ({
  //             id: level.id,
  //             order: level.order || "",
  //             name: level.name || "",
  //             users: Array.isArray(level.escalate_to_users)
  //               ? level.escalate_to_users.map((userId) => {
  //                   const userName = userMap.get(userId) || "Unknown"; // Fetch full_name
  //                   return { label: userName, value: userId };
  //                 })
  //               : [],
  //           }))
  //         : [];

  //       setApprovalLevels(approvalLevelsWithUserNames);
  //     } catch (error) {
  //       console.error("Error fetching approval data:", error);
  //     }
  //   };

  //   if (companies.length > 0) {
  //     fetchApprovalData();
  //   }
  // }, [companies, id]);

  const [approvalLevelsRaw, setApprovalLevelsRaw] = useState([]);
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
          site_id: data.site_id || null,
          project_id: data.project_id || null,
          department_id: data.department_id || null,
          module_id: data.approval_type || null,
          material_id: data.pms_inventory_type_id || null,
          invoice_approval_levels: data.invoice_approval_levels || [],
        });

        // Ensure `companies` list is loaded before setting values
        if (!companies.length) return;

        const companyOption = companies.find((c) => c.id === data.company_id);
        if (companyOption) {
          setSelectedCompany({
            value: companyOption.id,
            label: companyOption.name,
          });

          // Fetch projects based on preselected company
          setProjects(
            companyOption.projects.map((prj) => ({
              value: prj.id,
              label: prj.name,
            }))
          );

          // Find and set selected project
          const projectOption = companyOption.projects.find(
            (p) => p.id === data.project_id
          );
          setSelectedProject(
            projectOption
              ? { value: projectOption.id, label: projectOption.name }
              : null
          );

          if (projectOption) {
            // Fetch sites (sub-projects) based on preselected project
            setSiteOptions(
              projectOption.pms_sites.map((site) => ({
                value: site.id,
                label: site.name,
              }))
            );

            // Find and set selected sub-project (site)
            const siteOption = projectOption.pms_sites.find(
              (s) => s.id === data.site_id
            );
            setSelectedSite(
              siteOption
                ? { value: siteOption.id, label: siteOption.name }
                : null
            );
          }
        }

        const departmentOption = filterOptions.departments.find(
          (department) => department.value === data.department_id
        );
        setSelectedDepartment(departmentOption || null);

        // Find the preselected module option
        const moduleOption = filterOptions.modules.find(
          (mod) => mod.value === data.approval_type
        );

        // Determine if Material Type dropdown should be shown
        const isMaterialOrderRequest =
          moduleOption?.label?.toLowerCase() === "material order request";

        setShowMaterialType(isMaterialOrderRequest); // Update visibility state

        setSelectedModule(moduleOption || null);

        // Find and set preselected material type
        const materialTypeOption = filterOptions.material_types.find(
          (mat) => mat.value === data.pms_inventory_type_id
        );
        setSelectedMaterialType(materialTypeOption || null);

        // Store raw approval levels for later processing when users are available
        setApprovalLevelsRaw(data.invoice_approval_levels || []);
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    if (companies.length > 0) {
      fetchApprovalData();
    }
  }, [companies, id]);

  // Process approval levels when departmentUsers are available
  useEffect(() => {
    if (!departmentUsers.length || !approvalLevelsRaw.length) return;

    const userMap = new Map(
      departmentUsers.map((user) => [user.value, user.label || "Unknown User"])
    );

    console.log("User Map:", userMap);

    const approvalLevelsWithUserNames = approvalLevelsRaw.map((level) => ({
      id: level.id,
      order: level.order || "",
      name: level.name || "",
      users: Array.isArray(level.escalate_to_users)
        ? level.escalate_to_users.map((userId) => {
            const userName = userMap.get(userId) || "Unknown";
            return { label: userName, value: userId };
          })
        : [],
    }));

    setApprovalLevels(approvalLevelsWithUserNames);
  }, [departmentUsers, approvalLevelsRaw]);

  useEffect(() => {
    if (departmentUsers.length > 0 && formData.invoice_approval_levels) {
      // Map stored user IDs to departmentUsers list
      const updatedApprovalLevels = formData.invoice_approval_levels.map(
        (level) => ({
          ...level,
          users: level.escalate_to_users
            ?.map((userId) => {
              const userOption = departmentUsers.find(
                (user) => user.value === userId
              );
              return userOption
                ? { value: userOption.value, label: userOption.label }
                : null;
            })
            .filter(Boolean), // Remove any null values
        })
      );

      setApprovalLevels(updatedApprovalLevels);
    }
  }, [departmentUsers, formData.invoice_approval_levels]); // Run when users or approval levels update

  useEffect(() => {
    axios
      .get(
        "https://marathon.lockated.com/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection
    setSelectedWing(null); // Reset wing selection
    setProjects([]); // Reset projects
    setSiteOptions([]); // Reset site options
    setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      // Find the selected company from the list
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedOption.value
      );
      setProjects(
        selectedCompanyData?.projects.map((prj) => ({
          value: prj.id,
          label: prj.name,
        }))
      );

      setFormData((prevState) => ({
        ...prevState,
        company_id: selectedOption.value, // Update formData with company_id
        project_id: null, // Reset project_id when company changes
        site_id: null, // Reset site_id when company changes
      }));
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
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany.value
      );
      const selectedProjectData = selectedCompanyData?.projects.find(
        (project) => project.id === selectedOption.value
      );

      // Set site options based on selected project
      setSiteOptions(
        selectedProjectData?.pms_sites.map((site) => ({
          value: site.id,
          label: site.name,
        })) || []
      );
      setFormData((prevState) => ({
        ...prevState,
        project_id: selectedOption.value, // Update formData with project_id
        site_id: null, // Reset site_id when project changes
      }));
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null); // Reset wing selection
    // setWingsOptions([]); // Reset wings options

    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        site_id: selectedOption.value, // Update formData with site_id
      }));
    }
  };

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const handleDepartmentChange = async (selectedOption) => {
    console.log("Selected Department:", selectedOption);

    setSelectedDepartment(selectedOption);
    setFormData((prevState) => ({
      ...prevState,
      department_id: selectedOption ? selectedOption.value : null,
    }));

    if (selectedOption) {
      try {
        const response = await axios.get(
          `https://marathon.lockated.com/users.json?q[department_id_eq]=${selectedOption.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data && Array.isArray(response.data)) {
          const userOptions = response.data.map((user) => ({
            value: user.id,
            label: user.full_name, // Ensure full_name is mapped correctly
          }));

          console.log("Fetched Users:", userOptions);
          setDepartmentUsers(userOptions);
        }
      } catch (error) {
        console.error("Error fetching users for department:", error);
        setDepartmentUsers([]); // Reset users on error
      }
    } else {
      setDepartmentUsers([]); // Reset users if no department selected
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      handleDepartmentChange(selectedDepartment);
    }
  }, [selectedDepartment]);

  const handleModuleChange = (selectedOption) => {
    console.log("Selected Module ID:", selectedOption.value);
    setSelectedModule(selectedOption);

    // Check if selected module is "Material Order Request"
    const isMaterialOrderRequest =
      selectedOption.label.toLowerCase() === "material order request";

    setShowMaterialType(isMaterialOrderRequest); // Update visibility

    setFormData((prevData) => ({
      ...prevData,
      module_id: selectedOption.value,
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
    setLoading(true);

    const orderCounts = {}; // Store orders as keys
    let hasDuplicateOrder = false;

    const errors = [];

    if (!formData.company_id) errors.push("Company is required.");
    if (!formData.department_id) errors.push("Department is required.");
    if (!formData.module_id) errors.push("Module is required.");
    if (approvalLevels.length === 0)
      errors.push("At least one Approval Level is required.");

    if (errors.length > 0) {
      setLoading(false);
      alert("plz fill all required fields"); // Show all errors in an alert
      return; // Stop function execution
    }

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
      setLoading(false);
      return; // Stop function execution
    }

    // If no duplicate, prepare and send the payload (rest of the logic follows)

    const payload = {
      approval_type: formData.module_id,
      company_id: formData.company_id,
      project_id: formData.project_id,
      site_id: formData.site_id,
      department_id: formData.department_id,
      snag_checklist_id: formData.template_id,
      sub_category_id: formData.sub_category_id,
      category_order: 1,
      category_id: formData.category_id,
      pms_inventory_type_id: formData.pms_supplier_id,
      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        id: level.id,
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
        console.log("Approval  updated Created:", response.data);
        alert("Approval update successfully!");
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
      })
      .finally(() => {
        // Set loading to false when the request finishes (success or failure)
        setLoading(false);
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
                            <div className="row my-2 align-items-end ">
                              {/* Event Title */}
                              <div className="col-md-3 mb-2">
                                <label htmlFor="event-title-select">
                                  Comapny {""}
                                  <span style={{ color: "red" }}>*</span>
                                </label>

                                {/* <select
                                  id="company-select"
                                  className="form-control"
                                  value={
                                    selectedCompany ? selectedCompany.value : ""
                                  }
                                  onChange={(e) =>
                                    handleCompanyChange({
                                      value: e.target.value,
                                      label:
                                        e.target.options[e.target.selectedIndex]
                                          .text,
                                    })
                                  }
                                >
                                  {filterOptions.companies.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select> */}
                                <SingleSelector
                                  options={companyOptions}
                                  onChange={handleCompanyChange}
                                  value={
                                    companyOptions.find(
                                      (opt) =>
                                        opt.value === selectedCompany?.value
                                    ) || null
                                  }
                                  placeholder="Select Company"
                                />

                                {/* <select
                                  value={selectedCompany?.value || ""}
                                  onChange={(e) => {
                                    const selectedOption = companyOptions.find(
                                      (option) =>
                                        option.value === e.target.value
                                    );
                                    handleCompanyChange(selectedOption);
                                  }}
                                >
                                  <option value="">Select Company</option>
                                  {companyOptions.map((company) => (
                                    <option
                                      key={company.value}
                                      value={company.value}
                                    >
                                      {company.label}
                                    </option>
                                  ))}
                                </select> */}
                              </div>

                              {/* Event Number */}
                              <div className="col-md-3 mb-2">
                                <label htmlFor="site-select">Site</label>
                                {/* <select
                                  id="site-select"
                                  className="form-control"
                                  value={selectedSite ? selectedSite.value : ""}
                                  onChange={(e) =>
                                    handleSiteChange({
                                      value: e.target.value,
                                      label:
                                        e.target.options[e.target.selectedIndex]
                                          .text,
                                    })
                                  }
                                >
                                  <option value="">Select Site</option>
                                  {filterOptions.sites.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select> */}
                                <SingleSelector
                                  options={projects}
                                  onChange={handleProjectChange}
                                  value={selectedProject}
                                  placeholder={`Select Project`} // Dynamic placeholder
                                />
                              </div>

                              <div className="col-md-3 mb-2">
                                <label htmlFor="event-no-select">
                                  {" "}
                                  SubProject
                                </label>
                                <SingleSelector
                                  elector
                                  options={siteOptions}
                                  onChange={handleSiteChange}
                                  value={selectedSite}
                                  placeholder={`Select Sub-project`} // Dynamic placeholder
                                />
                              </div>

                              <div className="col-md-3 mb-2">
                                <label htmlFor="department-select">
                                  Department{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                {/* <select
                                  id="department-select"
                                  className="form-control"
                                  value={
                                    selectedDepartment
                                      ? selectedDepartment.value
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleDepartmentChange({
                                      value: e.target.value,
                                      label:
                                        e.target.options[e.target.selectedIndex]
                                          .text,
                                    })
                                  }
                                >
                                  {filterOptions.departments.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select> */}
                                <SingleSelector
                                  id="status-select"
                                  options={filterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment} // ✅ Use selectedDepartment directly
                                  placeholder="Select Department"
                                  isClearable
                                  isDisabled //
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="module-select">
                                  Module <span style={{ color: "red" }}>*</span>
                                </label>
                                {/* <select
                                  id="module-select"
                                  className="form-control"
                                  value={
                                    selectedModule ? selectedModule.value : ""
                                  }
                                  onChange={(e) =>
                                    handleModuleChange({
                                      value: e.target.value,
                                      label:
                                        e.target.options[e.target.selectedIndex]
                                          .text,
                                    })
                                  }
                                >
                                  
                                  {filterOptions.modules.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select> */}
                                <SingleSelector
                                  id="module-select"
                                  options={filterOptions.modules} // Use modifiedFilterOptions.modules
                                  value={selectedModule}
                                  onChange={handleModuleChange}
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                {showMaterialType && (
                                  <>
                                    <label htmlFor="material-type-select">
                                      Material Type
                                    </label>
                                    <SingleSelector
                                      id="material-type-select"
                                      options={filterOptions.material_types}
                                      value={selectedMaterialType}
                                      onChange={handleMaterialTypeChange}
                                      placeholder="Select Material Type"
                                      isClearable
                                    />
                                  </>
                                )}
                              </div>

                              {/* Status */}
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
                                style={{ width: "30%" }} //
                              >
                                <legend className="float-none mb-2">
                                  Users{" "}
                                  <span style={{ color: "#f69380" }}>*</span>
                                </legend>
                                {/* <MultiSelector
                                  options={departmentUsers}
                                  value={level.users}
                                  onChange={(selected) =>
                                    handleInputChange(index, "users", selected)
                                  }
                                  placeholder="Select Users"
                                /> */}

                                <MultiSelector
                                  options={departmentUsers} // Available options
                                  value={level.users} // Preselected users
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
                            <p>Submitting ...</p>
                          </div>
                        )}
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
