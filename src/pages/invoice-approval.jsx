import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";

const InvoiceApproval = () => {
  const [filterOptions, setFilterOptions] = useState({
    // companies: [],
    departments: [],
    // sites: [],
    // subprojects: [], //
    modules: [], // Add modules to the state
    material_types: [], // Add
    approval_types: [],
    users: [],
  });
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [wingsOptions, setWingsOptions] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  // const [selectedTemplates, setSelectedTemplates] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // Track selected module
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // const modifiedFilterOptions = {
  //   departments: [
  //     { label: "Select Department", value: "" },
  //     ...(filterOptions.departments || []), // Safeguard against undefined or null departments
  //   ],
  //   subprojects: [
  //     { label: "Select Subproject", value: "" },
  //     ...(filterOptions.subprojects || []), // Safeguard against undefined or null subprojects
  //   ],
  //   modules: [
  //     { label: "Select Module", value: "" },
  //     ...(filterOptions.modules || []), // Safeguard against undefined or null modules
  //   ],
  //   material_types: [
  //     { label: "Select Material Type", value: "" },
  //     ...(filterOptions.material_types || []), // Safeguard against undefined or null material_types
  //   ],
  // };

  const modifiedFilterOptions = {
    departments: (filterOptions.departments || []).map((dept) => ({
      label: dept.label,
      value: dept.value,
    })), // Ensuring "Select Department" is not part of options
    subprojects: (filterOptions.subprojects || []).map((sp) => ({
      label: sp.label,
      value: sp.value,
    })),
    modules: (filterOptions.modules || []).map((mod) => ({
      label: mod.label,
      value: mod.value,
    })),
    material_types: (filterOptions.material_types || []).map((mat) => ({
      label: mat.label,
      value: mat.value,
    })),
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "1", name: "", users: [], type: "users" },
  ]);

  const [selectedType, setSelectedType] = useState("users");

  const [userGroups, setUserGroups] = useState([]);
  // User groups list

  const handleSelectionTypeChange = (index, type) => {
    const updatedLevels = approvalLevels.map(
      (level, i) => (i === index ? { ...level, type, users: [] } : level) // Reset users when type changes
    );
    setApprovalLevels(updatedLevels);
  };

  const fetchUserGroups = async (companyId) => {
    if (!companyId) {
      setUserGroups([]); // Clear if no company is selected
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/user_groups.json?q[company_id_eq]=${companyId}&token=${token}`
      );

      // Extract and format user groups
      setUserGroups(
        response.data.user_groups.map((group) => ({
          label: group.name, // Display group name in dropdown
          value: group.id, // Store group ID as value
        }))
      );
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  // Track selected type (Users or User Groups)
  const [formData, setFormData] = useState({
    company_id: null,
    project_id: null,
    site_id: null,
    department_id: null,
    module_id: null, // Replace category_id with module_id
    material_type_id: null, // Repla
    // approval_type: "mor_approval", // example approval type

    invoice_approval_levels: [],
  });

  // const handleAddLevel = () => {
  //   setApprovalLevels([
  //     ...approvalLevels,
  //     { order: "", name: "", users: [], type: "users" }, // Add a new empty level,
  //   ]);
  // };

  const handleAddLevel = () => {
    setApprovalLevels((prevLevels) => {
      // Get active (non-destroyed) levels
      const activeLevels = prevLevels.filter((level) => !level._destroy);
      // Next order is simply the length + 1
      const nextOrder = (activeLevels.length + 1).toString();

      return [
        ...prevLevels,
        {
          order: nextOrder,
          name: "",
          users: [],
          type: "users",
        },
      ];
    });
  };

  // const handleRemoveLevel = (index) => {
  //   const updatedLevels = approvalLevels.filter((_, i) => i !== index);
  //   setApprovalLevels(updatedLevels);
  // };
  const handleRemoveLevel = (index) => {
    setApprovalLevels((prevLevels) => {
      // First, filter out the removed level
      const updatedLevels = prevLevels.filter((_, i) => i !== index);

      // Then reorder the remaining levels
      return updatedLevels.map((level, idx) => ({
        ...level,
        order: (idx + 1).toString(), // Reassign orders starting from 1
      }));
    });
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

  /// Empty dependency array to run only once on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // const response = await fetch(
        //   "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=${token}"
        // );
        const [dropdownResponse, materialTypeResponse] = await Promise.all([
          fetch(
            `${baseURL}/pms/admin/invoice_approvals/dropdown_list.json?token=${token}`
          ),
          fetch(
            `${baseURL}/pms/inventory_types.json?token=${token}`
          ),
        ]);
        // if (!response.ok) throw new Error("Failed to fetch dropdown data");

        // const data = await response.json();
        if (!dropdownResponse.ok || !materialTypeResponse.ok) {
          throw new Error("Failed to fetch dropdown data or material types");
        }

        const dropdownData = await dropdownResponse.json();

        const materialTypesData = await materialTypeResponse.json();

        console.log("materialsss", materialTypesData);

        // Safeguard to check if material_types exists
        const materialTypes = materialTypesData.material_types || [];
        console.log("modifuiees", modifiedFilterOptions); // Check if material_types is correctly set
        setFilterOptions({
          departments: dropdownData.departments.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          modules: dropdownData.approval_types
            ? Object.entries(dropdownData.approval_types).map(
                ([key, value]) => ({
                  label: key.replace(/_/g, " "), // Format the label (e.g., "material_order_request" → "Material Order Request")
                  value: value, // Assign the corresponding value
                })
              )
            : [],

          material_types: [
            { label: "Select Material Type", value: "" },
            ...materialTypesData.map((material) => ({
              label: material.name,
              value: material.id,
            })),
          ],
          users: dropdownData.users.map(([name, id]) => ({
            label: name,
            value: id,
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/company_setups.json?token=${token}`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  const [departmentUsers, setDepartmentUsers] = useState([]);

  // const fetchUsers = async (companyId, projectId, siteId, departmentIds) => {
  //   if (!companyId || !departmentIds || departmentIds.length === 0) {
  //     setDepartmentUsers([]); // Reset users if no company or departments are selected
  //     return;
  //   }

  //   try {
  //     const departmentQuery = departmentIds.join(","); // Convert array of department IDs to a comma-separated string

  //     // Fetch users based on company and selected departments
  //     const response = await axios.get(
  //       `${baseURL}/users.json?q[department_id_in]=${departmentQuery}&q[user_sites_pms_site_project_company_id_eq]=${companyId}&q[user_sites_pms_site_project_id_eq]=${
  //         projectId || ""
  //       }&&token=${token}`
  //     );

  //     if (response.data && Array.isArray(response.data)) {
  //       const newUsers = response.data.map((user) => ({
  //         value: user.id,
  //         label: user.full_name,
  //       }));

  //       // Set the department users (this will be used in the dropdown)
  //       setDepartmentUsers(newUsers);
  //     } else {
  //       setDepartmentUsers([]); // Reset users if no valid data is received
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     setDepartmentUsers([]); // Reset users on error
  //   }
  // };

  // const fetchUsers = async (
  //   companyId,
  //   projectId,
  //   siteId,
  //   departmentIds = []
  // ) => {
  //   if (!companyId) {
  //     setDepartmentUsers([]);
  //     return;
  //   }

  //   try {
  //     // If departmentIds is empty, remove the filter from API call
  //     const departmentQuery =
  //       departmentIds.length > 0
  //         ? `q[department_id_in]=${departmentIds.join(",")}&`
  //         : "";

  //     const response = await axios.get(
  //       `${baseURL}/users.json?${departmentQuery}q[user_sites_pms_site_project_company_id_eq]=${companyId}&q[user_sites_pms_site_project_id_eq]=${
  //         projectId || ""
  //       }&q[user_sites_pms_site_id_eq]=${siteId}&token=${token}`
  //     );

  //     if (response.data && Array.isArray(response.data)) {
  //       const newUsers = response.data.map((user) => ({
  //         value: user.id,
  //         label: user.full_name,
  //       }));

  //       setDepartmentUsers(newUsers); // Set users dropdown
  //     } else {
  //       setDepartmentUsers([]); // Reset users if no valid data
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     setDepartmentUsers([]); // Reset on error
  //   }
  // };

  const fetchUsers = async (
    companyId,
    projectId = null,
    siteId = null,
    departmentIds = []
  ) => {
    if (!companyId) {
      setDepartmentUsers([]);
      return;
    }

    try {
      // Construct query parameters dynamically
      let queryParams = new URLSearchParams();

      queryParams.append(
        "q[user_sites_pms_site_project_company_id_eq]",
        companyId
      );

      if (projectId)
        queryParams.append("q[user_sites_pms_site_project_id_eq]", projectId);
      if (siteId) queryParams.append("q[user_sites_pms_site_id_eq]", siteId);
      if (departmentIds.length > 0)
        queryParams.append("q[department_id_in]", departmentIds.join(","));

      const response = await axios.get(
        `${baseURL}/users.json?${queryParams.toString()}&token=${token}`
      );

      if (response.data && Array.isArray(response.data)) {
        const newUsers = response.data.map((user) => ({
          value: user.id,
          label: user.full_name,
        }));

        setDepartmentUsers(newUsers); // Set users dropdown
      } else {
        setDepartmentUsers([]); // Reset users if no valid data
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setDepartmentUsers([]); // Reset on error
    }
  };

  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSelectedWing(null);
  //   setProjects([]);
  //   setSiteOptions([]);

  //   if (selectedOption) {
  //     const selectedCompanyData = companies.find(
  //       (company) => company.id === selectedOption.value
  //     );
  //     setProjects(
  //       selectedCompanyData?.projects.map((prj) => ({
  //         value: prj.id,
  //         label: prj.name,
  //       }))
  //     );

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       company_id: selectedOption.value,
  //       project_id: null,
  //       site_id: null,
  //     }));

  //     // Clear selected users but fetch new users even if no department is selected
  //     setSelectedUsers([]);

  //     // Fetch users based on the selected company
  //     fetchUsers(
  //       selectedOption.value,
  //       null,
  //       null,
  //       selectedDepartment?.map((dept) => dept.value) || []
  //     );
  //   }
  // };

  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSelectedWing(null);
  //   setProjects([]);
  //   setSiteOptions([]);

  //   if (selectedOption) {
  //     const selectedCompanyData = companies.find(
  //       (company) => company.id === selectedOption.value
  //     );
  //     setProjects(
  //       selectedCompanyData?.projects.map((prj) => ({
  //         value: prj.id,
  //         label: prj.name,
  //       }))
  //     );

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       company_id: selectedOption.value,
  //       project_id: null,
  //       site_id: null,
  //     }));

  //     // Clear selected users and user groups
  //     setSelectedUsers([]);
  //     setDepartmentUsers([]); // Reset users list
  //     setUserGroups([]); // Reset user groups list

  //     // Clear users inside approval levels
  //     setApprovalLevels((prevLevels) =>
  //       prevLevels.map((level) => ({
  //         ...level,
  //         users: [],
  //       }))
  //     );

  //     // Fetch new users and user groups based on selected company
  //     fetchUsers(
  //       selectedOption.value,
  //       null,
  //       null,
  //       selectedDepartment?.map((dept) => dept.value) || []
  //     );

  //     fetchUserGroups(selectedOption.value); // Ensure user groups are refreshed
  //   }
  // };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedWing(null);
    setProjects([]);
    setSiteOptions([]);

    if (selectedOption) {
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
        company_id: selectedOption.value,
        project_id: null,
        site_id: null,
      }));

      // Clear selected users and user groups
      setSelectedUsers([]);
      setDepartmentUsers([]);
      setUserGroups([]);

      // Clear users inside approval levels
      setApprovalLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          users: [],
        }))
      );

      // Fetch new users only based on company ID
      fetchUsers(selectedOption.value);

      fetchUserGroups(selectedOption.value); // Ensure user groups are refreshed
    }
  };

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);
    setSelectedWing(null);
    setSiteOptions([]);
    setWingsOptions([]);

    // Clear previously fetched users and reset selected users when the project changes
    setSelectedUsers([]);
    setDepartmentUsers([]);

    const selectedCompanyData = companies.find(
      (company) => company.id === selectedCompany?.value
    );
    const selectedProjectData = selectedCompanyData?.projects.find(
      (project) => project.id === selectedOption?.value
    );

    // Update site options based on the new project
    setSiteOptions(
      selectedProjectData?.pms_sites.map((site) => ({
        value: site.id,
        label: site.name,
      })) || []
    );

    // Update form data for the new project
    setFormData((prevState) => ({
      ...prevState,
      project_id: selectedOption ? selectedOption.value : null,
      site_id: null,
      users: [], // Reset users in form data to be populated with new project and department data
    }));

    // Fetch users based on the selected departments, even after project change
    fetchUsers(
      selectedCompany?.value,
      selectedOption ? selectedOption.value : null, // Pass the new project ID
      null, // We are not filtering by site at this stage
      selectedDepartment?.map((dept) => dept.value) // Pass the selected departments to fetch users
    );
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null);

    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        site_id: selectedOption.value,
      }));

      fetchUsers(
        selectedCompany?.value,
        selectedProject?.value,
        selectedOption.value,
        selectedDepartment?.value
      ); // Fetch users based on site
    }
  };

  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSelectedWing(null);
  //   setProjects([]);
  //   setSiteOptions([]);

  //   if (selectedOption) {
  //     const selectedCompanyData = companies.find(
  //       (company) => company.id === selectedOption.value
  //     );
  //     setProjects(
  //       selectedCompanyData?.projects.map((prj) => ({
  //         value: prj.id,
  //         label: prj.name,
  //       }))
  //     );

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       company_id: selectedOption.value,
  //       project_id: null,
  //       site_id: null,
  //     }));

  //     // Clear selected users but keep selected departments
  //     setSelectedUsers([]); // Reset selected users
  //     fetchUsers(
  //       selectedOption.value,
  //       null,
  //       null,
  //       selectedDepartment.map((dept) => dept.value)
  //     ); // Fetch new users based on selected departments
  //   }
  // };

  const handleDepartmentChange = async (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setFormData((prevState) => ({
        ...prevState,
        department_id: [],
        users: [],
      }));
      setSelectedDepartment([]);
      setDepartmentUsers([]);
      setSelectedUsers([]);
      return;
    }

    const departmentIds = selectedOptions.map((option) => option.value);
    setFormData((prevState) => ({
      ...prevState,
      department_id: departmentIds,
    }));
    setSelectedDepartment(selectedOptions);

    // Ensure we are passing companyId if it exists
    const companyId = selectedCompany?.value || null;

    fetchUsers(
      companyId,
      selectedProject?.value || null,
      selectedSite?.value || null,
      departmentIds
    );
  };

  useEffect(() => {
    if (formData.department_id && modifiedFilterOptions.departments?.length) {
      const selected = modifiedFilterOptions.departments.filter((option) =>
        formData.department_id.includes(option.value)
      );

      // Only update state if the selection has changed
      if (JSON.stringify(selected) !== JSON.stringify(selectedDepartment)) {
        setSelectedDepartment(selected);
      }
    }
  }, [formData.department_id, modifiedFilterOptions.departments]);

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const [showMaterialType, setShowMaterialType] = useState(false);

  const handleModuleChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedModule(null);
      setShowMaterialType(false); // Hide material type dropdown if module is cleared
      setFormData((prevState) => ({ ...prevState, module_id: null }));
      return;
    }

    console.log("Selected Module ID:", selectedOption.value);

    setSelectedModule(selectedOption);

    // Check if the selected module is "Material Order Request" (case-insensitive)
    const isMaterialOrderRequest =
      selectedOption.label.toLowerCase() === "material order request";

    setShowMaterialType(isMaterialOrderRequest); // Show/hide material type dropdown

    setFormData((prevState) => ({
      ...prevState,
      module_id: selectedOption.value,
    }));
  };

  const handleMaterialTypeChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedMaterialType(null);
      setFormData((prevState) => ({ ...prevState, pms_supplier_id: null }));
      return;
    }

    console.log(
      "Selected Material Type (PMS Supplier ID):",
      selectedOption.value
    );

    setSelectedMaterialType(selectedOption); // Store the full selected option
    setFormData((prevState) => ({
      ...prevState,
      pms_supplier_id: selectedOption.value, // Set pms_supplier_id from selected value
    }));
  };

  const navigate = useNavigate();

  const initialFormData = {
    company_id: null, // Initial value is null, meaning no company selected
    department_id: null, // No department selected
    category_id: null, // No category selected
    sub_category_id: null, // No sub-category selected
    approval_type: "mor_approval", // Default approval type (can be changed based on your use case)
    template_id: null, // No template selected
    invoice_approval_levels: [], // An empty array, assuming no levels are set initially
  };
  const handleCreate = () => {
    setLoading(true);
    // Prepare the dynamic payload with data from formData and approvalLevels

    // const errors = [];

    // if (!formData.company_id) errors.push("Company is required.");
    // // if (!formData.department_id) errors.push("Department is required.");
    // if (!formData.module_id) errors.push("Module is required.");
    // if (approvalLevels.length === 0)
    //   errors.push("At least one Approval Level is required.");

    // if (errors.length > 0) {
    //   setLoading(false);
    //   alert("plz fill all required fields"); // Show all errors in an alert
    //   return; // Stop function execution
    // }

    const errors = [];

    // Validate company
    if (!formData.company_id) {
      errors.push("Company is required");
    }

    // Validate module
    if (!formData.module_id) {
      errors.push("Module is required");
    }

    // Validate approval levels
    if (approvalLevels.length === 0) {
      errors.push("At least one Approval Level is required");
    } else {
      // Check each approval level for required fields
      approvalLevels.forEach((level, index) => {
        if (!level.name || level.name.trim() === "") {
          errors.push(`Name of Level is required for Level ${index + 1}`);
        }

        // Validate users/groups selection
        if (level.type === "users") {
          if (!level.users || level.users.length === 0) {
            errors.push(`Users selection is required for Level ${index + 1}`);
          }
        } else if (level.type === "groups") {
          if (!level.users || !level.users.value) {
            errors.push(
              `User Group selection is required for Level ${index + 1}`
            );
          }
        }
      });
    }

    if (errors.length > 0) {
      setLoading(false);
      alert(errors.join("\n")); // Show all errors in an alert, one per line
      return;
    }

    const payload = {
      // site_id: formData.site_id,
      approval_type: formData.module_id, // Use dynamic approval_type
      // Or set dynamically if needed
      company_id: formData.company_id, // Dynamic company_id from formData
      project_id: formData.project_id,
      site_id: formData.site_id, // Static or dynamic if needed
      // department_id: null, // Dynamic department_id from formData
      pms_inventory_type_id: formData.pms_supplier_id,
      // invoice_approval_levels_attributes: approvalLevels.map((level) => ({
      //   name: level.name,
      //   order: level.order,
      //   active: true, // Assuming that all levels
      //   escalate_to_users:
      //     level.type === "users" ? level.users.map((user) => user.value) : [],
      //   user_group_id:
      //     level.type === "groups"
      //       ? level.users.map((group) => group.value)[0]
      //       : null,
      // })),

      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        name: level.name,
        order: level.order,
        active: true, // Assuming all levels are active by default
        escalate_to_users:
          level.type === "users" && Array.isArray(level.users)
            ? level.users.map((user) => user.value)
            : [], // Ensure it's an array or empty
        user_group_id:
          level.type === "groups" && level.users
            ? level.users.value || null
            : null, // Handle single value case
      })),
    };

    // Log payload to verify its content
    console.log("Payload for Create Request:", payload);

    // API call to create the invoice approval
    axios
      .post(
        `${baseURL}/pms/admin/invoice_approvals.json?token=${token}`,
        payload
      )
      .then((response) => {
        console.log("Approval Created:", response.data);
        // alert("Approval created successfully!");

        setTimeout(() => {
          navigate("/approval-materics"); // Change route as per your app
        }, 500);
        setTimeout(() => {
          alert("Approval created successfully!");
          // You can't close the native alert, but you could use a custom modal here
          // Delay for toast visibility
          console.log(
            "Alert closed (This is a simulation, as the native alert can't be dismissed)."
          );
        }, 1000);

        // Optionally reset form data here if needed
      })
      .catch((error) => {
        console.error("Error creating invoice approval:", error);
      })
      .finally(() => {
        // Set loading to false when the request finishes (success or failure)
        setLoading(false);
      });
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
            {/* <p>Setup &gt; Invoice Approvals</p>
            <h5 className="mt-2">INVOICE APPROVAL</h5> */}
            <a href="#">Setup &gt; Admin &gt; Configurations Setup </a>
            <h5 className="mt-2">APPROVAL MATRIX</h5>
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
                                  Company{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <SingleSelector
                                  options={companyOptions}
                                  onChange={handleCompanyChange}
                                  value={selectedCompany}
                                  placeholder={`Select Company`} // Dynamic placeholder
                                />
                              </div>

                              {/* Event Number */}
                              <div className="col-md-3">
                                <label htmlFor="event-no-select">Project</label>
                                <SingleSelector
                                  options={projects}
                                  onChange={handleProjectChange}
                                  value={selectedProject}
                                  placeholder={`Select Project`} // Dynamic placeholder
                                />
                              </div>

                              <div className="col-md-3">
                                <label htmlFor="event-no-select">
                                  {" "}
                                  SubProject
                                </label>
                                <SingleSelector
                                  options={siteOptions}
                                  onChange={handleSiteChange}
                                  value={selectedSite}
                                  placeholder={`Select Sub-project`} // Dynamic placeholder
                                />
                              </div>

                              {/* Status */}
                              <div className="col-md-3">
                                <label htmlFor="status-select">
                                  Department{" "}
                                  {/* <span style={{ color: "red" }}>*</span> */}
                                </label>
                                {/* <SingleSelector
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDeparment}
                                  placeholder="Select Department"
                                  isClearable
                                /> */}

                                {/* <SingleSelector
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment} //
                                  placeholder="Select Department"
                                  isClearable
                                /> */}

                                <MultiSelector
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment}
                                  placeholder="Select Departments"
                                  isMulti // Enable multi-selection
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  Module <span style={{ color: "red" }}>*</span>
                                </label>
                                <SingleSelector
                                  id="module-select"
                                  options={modifiedFilterOptions.modules} // Use modifiedFilterOptions.modules
                                  value={selectedModule}
                                  onChange={handleModuleChange}
                                  placeholder="Select Module"
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
                            </div>
                          </div>
                        </CollapsibleCard>
                        <div className="card mt-3 pb-4 ms-3 ">
                          <div className="card-header mb-3 ">
                            <h3 className="card-title">Approval Levels</h3>
                          </div>

                          {/* {approvalLevels.map((level, index) => (
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
                                  Order <span style={{ color: "red" }}>*</span>
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
                                  <span style={{ color: "red" }}>*</span>
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
                                  Users <span style={{ color: "red" }}>*</span>
                                </legend>
                             

                                <MultiSelector
                                  options={departmentUsers} 
                                  value={selectedUsers} // 
                                  onChange={(selected) => {
                                    setSelectedUsers(selected); // Update state when users are selected
                                    handleInputChange(index, "users", selected);
                                  }}
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
                          ))} */}

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
                                  Order
                                  {/* <span style={{ color: "red" }}>*</span> */}
                                </legend>
                                <input
                                  className="form-group order"
                                  placeholder="Enter Order"
                                  value={level.order}
                                  // onChange={(e) =>
                                  //   handleInputChange(
                                  //     index,
                                  //     "order",
                                  //     e.target.value
                                  //   )
                                  // }
                                  readOnly
                                  // required
                                />
                              </fieldset>

                              <fieldset className="border ms-4">
                                <legend className="float-none">
                                  Name of Level{" "}
                                  <span style={{ color: "red" }}>*</span>
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

                              {/* Radio Buttons for Selection */}
                              <div className="ms-3">
                                <label>
                                  <input
                                    type="radio"
                                    name={`selectionType-${index}`}
                                    value="users"
                                    checked={level.type === "users"}
                                    onChange={() =>
                                      handleSelectionTypeChange(index, "users")
                                    }
                                  />{" "}
                                  Users
                                </label>
                                <label className="ms-3">
                                  <input
                                    type="radio"
                                    name={`selectionType-${index}`}
                                    value="groups"
                                    checked={level.type === "groups"}
                                    onChange={() =>
                                      handleSelectionTypeChange(index, "groups")
                                    }
                                  />{" "}
                                  User Groups
                                </label>
                              </div>

                              {/* MultiSelector based on selection */}
                              {/* <fieldset
                                className="user-list ms-3 mb-3"
                                style={{ width: "15%" }}
                              >
                                <legend className="float-none mb-2">
                                  {level.type === "users"
                                    ? "Users"
                                    : "User Groups"}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </legend>

                                <MultiSelector
                                  options={
                                    level.type === "users"
                                      ? departmentUsers
                                      : userGroups
                                  }
                                  value={level.users} // Now stores users per level
                                  onChange={(selected) =>
                                    handleInputChange(index, "users", selected)
                                  }
                                  placeholder={
                                    level.type === "users"
                                      ? "Select Users"
                                      : "Select User Groups"
                                  }
                                />
                              </fieldset> */}

                              <fieldset
                                className="user-list ms-3 mb-3"
                                style={{ width: "15%" }}
                              >
                                <legend className="float-none mb-2">
                                  {level.type === "users"
                                    ? "Users"
                                    : "User Groups"}{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </legend>

                                {level.type === "users" ? (
                                  // MultiSelector for Users
                                  <MultiSelector
                                    options={departmentUsers}
                                    value={level.users} // Array for multiple users
                                    onChange={(selected) =>
                                      handleInputChange(
                                        index,
                                        "users",
                                        selected
                                      )
                                    }
                                    placeholder="Select Users"
                                  />
                                ) : (
                                  // SingleSelector for User Groups
                                  <SingleSelector
                                    options={userGroups}
                                    value={level.users} // Single value for user groups
                                    onChange={(selected) =>
                                      handleInputChange(
                                        index,
                                        "users",
                                        selected
                                      )
                                    }
                                    placeholder="Select User Group"
                                  />
                                )}
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
                              className="purple-btn1 submit-btn"
                              onClick={handleAddLevel}
                            >
                              +
                            </button>
                          </div>
                        </div>
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
                          // name="subaction"
                          // type="submit"
                          className=" purple-btn2 submit-btn"
                          // value="save"
                          // fdprocessedid="4ksxs"
                          onClick={() => handleCreate()}
                        >
                          Create
                        </button>
                        {/* <button
                          name="subaction"
                          type="submit"
                          className=" purple-btn2 submit-btn"
                          onClick={handleSaveAndCreate}
                        >
                          Save And Create New{" "}
                        </button> */}
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

export default InvoiceApproval;
