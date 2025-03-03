import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import axios from "axios";
import { useParams } from "react-router-dom";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";

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

  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [departmentIds, setDepartmentIds] = useState([]);

  useEffect(() => {
    fetchUsers(companyId, projectId, siteId, departmentIds);

  }, [companyId, projectId, siteId, departmentIds]); // ✅ Re-fetch data when any state changes

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: [],
    site_id: null,
    // category_id: null,
    // sub_category_id: null,
    module_id: null,
    material_id: null,

    // example approval type
    invoice_approval_levels: [],
  });

  const handleAddLevel = () => {
    setApprovalLevels([
      ...approvalLevels,
      { id: "", order: "", name: "", users: [], type: "users" }, // Default new level to "users"
    ]);
  };

  const [userGroups, setUserGroups] = useState([]);

  const handleSelectionTypeChange = (index, type) => {
    setApprovalLevels((prevLevels) =>
      prevLevels.map((level, i) =>
        i === index
          ? {
              ...level,
              type,
              users: type === "users" ? [] : null, // Reset users if switching to group
              group: type === "groups" ? { label: "", value: "" } : null, // Ensure a proper object for group selection
            }
          : level
      )
    );
  };

  const fetchUserGroups = async (companyId) => {
    if (!companyId) {
      setUserGroups([]); // Clear if no company is selected
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/user_groups.json?q[company_id_eq]=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );

      // Extract and format user groups
      const groups = response.data.user_groups.map((group) => ({
        label: group.name, // Display group name in dropdown
        value: group.id, // Store group ID as value
      }));

      setUserGroups(groups);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  // useEffect(() => {
  //   if (!formData.company_id) {
  //     setApprovalLevels((prevLevels) =>
  //       prevLevels.map((level) => ({
  //         ...level,
  //         group: null, // ✅ Ensure reset when no company is selected
  //       }))
  //     );
  //   }
  // }, [formData.company_id]);

  useEffect(() => {
    if (!formData.company_id) {
      setUserGroups([]); // ✅ Reset user groups
      setApprovalLevels((prevLevels) =>
        prevLevels.map((level) => ({
          ...level,
          group: null, // ✅ Reset selected user group
          users: [], // ✅ Reset users list
          type: "users", // ✅ Default to users
        }))
      );
      return;
    }

    fetchUserGroups(formData.company_id); // Fetch user groups for the new company
  }, [formData.company_id]);

  const handleRemoveLevel = (index) => {
    setApprovalLevels((prevLevels) =>
      prevLevels.map((level, i) =>
        i === index ? { ...level, _destroy: true } : level
      )
    );
  };

  const handleInputChange = (index, field, value) => {
    setApprovalLevels((prevLevels) =>
      prevLevels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      )
    );
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

  const fetchUsers = async (companyId, projectId, siteId, departmentIds) => {
    setDepartmentUsers([]); // ✅ Reset users before fetching

    if (!companyId) {
      return; // ✅ Prevent unnecessary API calls
    }

    try {
      let url = `${baseURL}/users.json?q[user_sites_pms_site_project_company_id_eq]=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;

      if (projectId) {
        url += `&q[user_sites_pms_site_project_id_eq]=${projectId}`;
      }

      if (siteId) {
        url += `&q[user_sites_pms_site_id_eq]=${siteId}`;
      }

      if (departmentIds && departmentIds.length > 0) {
        url += `&q[department_id_eq]=${departmentIds.join(",")}`; // Fetch only for selected departments
      }

      const response = await axios.get(url);

      const allUsers = response.data.map((user) => ({
        value: user.id,
        label: user.full_name,
      }));

      setDepartmentUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setDepartmentUsers([]);
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [dropdownResponse, materialTypeResponse] = await Promise.all([
          fetch(
            `${baseURL}/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
          fetch(
            `${baseURL}/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
          ),
        ]);

        if (!dropdownResponse.ok || !materialTypeResponse.ok) {
          throw new Error("Failed to fetch dropdown data or material types");
        }

        const dropdownData = await dropdownResponse.json();

        const materialTypesData = await materialTypeResponse.json();

        // console.log("materialsss", materialTypesData);

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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedDepartment?.value) return; // Ensure department is selected

      try {
        const response = await axios.get(
          `${baseURL}/users.json?q[department_id_eq]=${selectedDepartment.value}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (response.data && Array.isArray(response.data)) {
          const userOptions = response.data.map((user) => ({
            value: user.id,
            label: user.full_name, // Ensure full_name is mapped correctly
          }));

          // console.log("Fetched Users:", userOptions);
          setDepartmentUsers(userOptions);
        }
      } catch (error) {
        console.error("Error fetching users for department:", error);
        setDepartmentUsers([]); // Reset users on error
      }
    };

    fetchUsers(); // Fetch users on mount & when department changes
  }, [selectedDepartment]);

  const [approvalLevelsRaw, setApprovalLevelsRaw] = useState([]);

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const response = await fetch(
          `${baseURL}/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        if (!response.ok) throw new Error("Failed to fetch approval data");

        const data = await response.json();
        console.log("Fetched Approval Data:", data);

        // Ensure department_id is always an array
        const fetchedDepartmentIds = Array.isArray(data.department_id)
          ? data.department_id
          : data.department_id
          ? [data.department_id]
          : [];

        setDepartmentIds(fetchedDepartmentIds);

        setFormData({
          company_id: data.company_id || null,
          site_id: data.site_id || null,
          project_id: data.project_id || null,
          department_id: fetchedDepartmentIds,
          module_id: data.approval_type || null,
          material_id: data.pms_inventory_type_id || null,
          invoice_approval_levels: data.invoice_approval_levels || [],
        });

        if (!companies.length) return;

        const companyOption = companies.find((c) => c.id === data.company_id);
        if (companyOption) {
          setSelectedCompany({
            value: companyOption.id,
            label: companyOption.name,
          });

          setProjects(
            companyOption.projects.map((prj) => ({
              value: prj.id,
              label: prj.name,
            }))
          );

          const projectOption = companyOption.projects.find(
            (p) => p.id === data.project_id
          );
          setSelectedProject(
            projectOption
              ? { value: projectOption.id, label: projectOption.name }
              : null
          );

          if (projectOption) {
            setSiteOptions(
              projectOption.pms_sites.map((site) => ({
                value: site.id,
                label: site.name,
              }))
            );

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

        const selectedDepartments = filterOptions.departments.filter((dept) =>
          fetchedDepartmentIds.includes(dept.value)
        );
        setSelectedDepartment(selectedDepartments);

        // Fetch users for selected departments
        fetchUsers(
          data.company_id,
          data.project_id,
          data.site_id,
          departmentIds
        );

        const moduleOption = filterOptions.modules.find(
          (mod) => mod.value === data.approval_type
        );
        const isMaterialOrderRequest =
          moduleOption?.label?.toLowerCase() === "material order request";
        setShowMaterialType(isMaterialOrderRequest);
        setSelectedModule(moduleOption || null);

        const materialTypeOption = filterOptions.material_types.find(
          (mat) => mat.value === data.pms_inventory_type_id
        );
        setSelectedMaterialType(materialTypeOption || null);

        // **Handle Preselected User Groups & Users**
        const updatedApprovalLevels = (data.invoice_approval_levels || []).map(
          (level) => {
            if (level.group_id) {
              // If group_id exists, preselect "groups"
              return {
                ...level,
                type: "groups",
                users: null, // Reset users
                group: {
                  value: level.group_id,
                  label: level.group_name,
                },
              };
            } else if (level.users && level.users.length > 0) {
              // If users exist, preselect "users"
              return {
                ...level,
                type: "users",
                users: level.users.map((user) => ({
                  value: user.id,
                  label: user.name,
                })),
                group: null, // Reset group
              };
            }
            return level;
          }
        );

        setApprovalLevelsRaw(updatedApprovalLevels);
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    if (companies.length > 0) {
      fetchApprovalData();
    }
  }, [companies, id]);

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
      type: level.group_id ? "groups" : "users", // Check if group exists
      users:
        level.escalate_to_users?.map((userId) => {
          const userName = userMap.get(userId) || "Unknown";
          return { label: userName, value: userId };
        }) || [],
      user_group: level.group_id
        ? { value: level.group_id, label: level.group_name }
        : null,
    }));

    setApprovalLevels(approvalLevelsWithUserNames);
  }, [departmentUsers, approvalLevelsRaw]);

  useEffect(() => {
    if (formData.invoice_approval_levels.length > 0) {
      const updatedApprovalLevels = formData.invoice_approval_levels.map(
        (level) => ({
          id: level.id,
          order: level.order || "",
          name: level.name || "",
          type: level.group_id ? "groups" : "users",

          users: level.escalate_to_users
            ?.map((userId) => {
              const userOption = departmentUsers.find(
                (user) => user.value === userId
              );
              return userOption
                ? { value: userOption.value, label: userOption.label }
                : null;
            })
            .filter(Boolean),

          // ✅ Correctly preselect the group using group_id & group_name
          group: level.group_id
            ? userGroups.find((group) => group.value === level.group_id) || {
                value: level.group_id,
                label: level.group_name || "Unknown Group",
              }
            : null,
        })
      );

      console.log("Updated Approval Levels:", updatedApprovalLevels);
      setApprovalLevels(updatedApprovalLevels);
    }
  }, [departmentUsers, userGroups, formData.invoice_approval_levels]);

  // Run when users or approval levels update

  useEffect(() => {
    axios
      .get(
        `${baseURL}/pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        setCompanies(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, []);

  useEffect(() => {
    setUserGroups([]); // Reset user groups immediately when the company changes

    if (selectedCompany) {
      fetchUserGroups(selectedCompany.value);
    }
  }, [selectedCompany]);

  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSelectedWing(null);
  //   setProjects([]);
  //   setSiteOptions([]);
  //   setWingsOptions([]);
  //   setDepartmentUsers([]); // Reset users if company or department is not selected
  //   setUserGroups([]);

  //   setApprovalLevels((prevLevels) =>
  //     prevLevels.map((level) => ({ ...level, group: null }))
  //   );

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

  //     fetchUsers(selectedOption.value, null, null, selectedDepartment?.value);

  //     fetchUserGroups(selectedOption.value); //
  //   }
  // };

  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption);
  //   setSelectedProject(null);
  //   setSelectedSite(null);
  //   setSelectedWing(null);
  //   setProjects([]);
  //   setSiteOptions([]);
  //   setWingsOptions([]);
  //   setDepartmentUsers([]);
  //   setUserGroups([]); // ✅ Reset user groups before fetching new ones

  //   // ✅ Clear selected user group in approval levels
  //   setApprovalLevels((prevLevels) =>
  //     prevLevels.map((level) => ({ ...level, group: null }))
  //   );

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

  //     fetchUsers(selectedOption.value, null, null, selectedDepartment?.value);

  //     // ✅ Delay fetching user groups slightly to ensure reset takes effect
  //     setTimeout(() => {
  //       fetchUserGroups(selectedOption.value);
  //     }, 0);
  //   }
  // };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setSelectedWing(null);
    setProjects([]);
    setSiteOptions([]);
    setWingsOptions([]);
    setDepartmentUsers([]); // ✅ Reset users completely
    setUserGroups([]); // ✅ Reset user groups before fetching new ones

    // ✅ Reset selected users and groups in approval levels
    setApprovalLevels((prevLevels) =>
      prevLevels.map((level) => ({
        ...level,
        users: [], // Clear selected users
        group: null, // Clear selected user groups
      }))
    );

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

      // ✅ Ensure users are fetched only from the newly selected company
      fetchUsers(selectedOption.value, null, null, []);

      // ✅ Fetch user groups after resetting
      setTimeout(() => {
        fetchUserGroups(selectedOption.value);
      }, 0);
    }
  };

  const handleDepartmentChange = async (selectedOptions) => {
    // console.log("Selected Departments:", selectedOptions);

    setSelectedDepartment(selectedOptions);

    const selectedDepartmentIds = selectedOptions
      ? selectedOptions.map((dept) => dept.value)
      : [];

    setFormData((prevState) => ({
      ...prevState,
      department_id: selectedDepartmentIds,
    }));

    fetchUsers(
      selectedCompany?.value,
      selectedProject?.value,
      selectedSite?.value,
      selectedDepartmentIds
    );
  };

  useEffect(() => {
    if (filterOptions.departments.length > 0) {
      const selectedDepartments = filterOptions.departments.filter((dept) =>
        departmentIds.includes(dept.value)
      );
      setSelectedDepartment(selectedDepartments);
    }
  }, [filterOptions.departments, departmentIds]);

  // useEffect(() => {
  //   setDepartmentUsers([]); // Always reset before fetching
  //   fetchUsers(
  //     selectedCompany?.value,
  //     selectedProject?.value,
  //     selectedSite?.value,
  //     selectedDepartment?.value
  //   );
  // }, [selectedCompany, selectedProject, selectedSite, selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment) {
      handleDepartmentChange(selectedDepartment);
    }
  }, [selectedDepartment]);

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null);
    setSelectedWing(null);
    setSiteOptions([]);
    setWingsOptions([]);
    setDepartmentUsers([]);

    const selectedCompanyData = companies.find(
      (company) => company.id === selectedCompany?.value
    );
    const selectedProjectData = selectedCompanyData?.projects.find(
      (project) => project.id === selectedOption?.value
    );

    setSiteOptions(
      selectedProjectData?.pms_sites.map((site) => ({
        value: site.id,
        label: site.name,
      })) || []
    );

    setFormData((prevState) => ({
      ...prevState,
      project_id: selectedOption ? selectedOption.value : null, // Ensure null when removed
      site_id: null,
    }));

    fetchUsers(
      selectedCompany?.value,
      selectedOption ? selectedOption.value : null, // Ensure null when removed
      null,
      selectedDepartment?.value
    );
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);

    setFormData((prevState) => ({
      ...prevState,
      site_id: selectedOption ? selectedOption.value : null, // Ensure null when removed
    }));

    fetchUsers(
      selectedCompany?.value,
      selectedProject?.value,
      selectedOption ? selectedOption.value : null,
      selectedDepartment?.value
    );
  };

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

  const handleModuleChange = (selectedOption) => {
    // console.log("Selected Module:", selectedOption);

    // Set selected module (or null if cleared)
    setSelectedModule(selectedOption);

    // Check if selected module is "Material Order Request"
    const isMaterialOrderRequest =
      selectedOption?.label?.toLowerCase() === "material order request";

    setShowMaterialType(isMaterialOrderRequest); // Show Material Type only when needed

    setFormData((prevData) => ({
      ...prevData,
      module_id: selectedOption ? selectedOption.value : null, // Set to null if cleared
    }));

    if (!isMaterialOrderRequest) {
      setSelectedMaterialType(null); // Reset Material Type if Module is cleared
    }
  };

  const handleMaterialTypeChange = (selectedOption) => {
    // console.log("Selected Material Type:", selectedOption);

    // Set selected material type (or null if cleared)
    setSelectedMaterialType(selectedOption);

    setFormData((prevData) => ({
      ...prevData,
      pms_supplier_id: selectedOption ? selectedOption.value : null, // Set to null if cleared
    }));
  };

  const navigate = useNavigate();

  const handleCreate = () => {
    setLoading(true);

    const orderCounts = {}; // Store orders as keys
    let hasDuplicateOrder = false;

    const errors = [];

    if (!formData.company_id) errors.push("Company is required.");
    // if (!formData.department_id) errors.push("Department is required.");
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
      // console.log(`Checking Level ${index + 1}:`, level.order);

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
      project_id: formData.project_id || null,
      site_id: formData.site_id || null,
      // department_id: formData.department_id,
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
        _destroy: level._destroy || false, // Only send delete key for approval levels
        escalate_to_users:
          level.type === "users"
            ? level.users?.map((user) => user.value) || []
            : [],
        user_group_id: level.type === "groups" ? level.group?.value : null,
      })),
    };

    console.log("Final Payload:", payload);

    // Send API request if no duplicates found
    axios
      .patch(
        `${baseURL}/pms/admin/invoice_approvals/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload
      )
      .then((response) => {
        console.log("Approval  updated Created:", response.data);
        alert("Approval update successfully!");

        setTimeout(() => {
          navigate("/approval-materics"); // Change route as per your app
        }, 500); // Redirect to Approval Metrics page
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
                                <label htmlFor="site-select">Project</label>
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
                                <MultiSelector
                                  id="status-select"
                                  options={filterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment} //  Use selectedDepartment directly
                                  placeholder="Select Department"
                                  isClearable
                                  // isDisabled //
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

                          {/* {approvalLevels
                            .filter((level) => !level._destroy)
                            .map((level, index) => (
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

                                  <MultiSelector
                                    options={departmentUsers} // Available options
                                    value={level.users} // Preselected users
                                    onChange={(selected) =>
                                      handleInputChange(
                                        index,
                                        "users",
                                        selected
                                      )
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
                        </div> */}

                          {approvalLevels
                            .filter((level) => !level._destroy)
                            .map((level, index) => (
                              <div
                                key={index}
                                className="px-4"
                                style={{
                                  display: "flex",
                                  columnGap: 20,
                                  alignItems: "center",
                                }}
                              >
                                {/* Order Input */}
                                <fieldset className="border">
                                  <legend className="float-none">
                                    Order{" "}
                                    <span style={{ color: "red" }}>*</span>
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

                                {/* Name Input */}
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
                                        handleSelectionTypeChange(
                                          index,
                                          "users"
                                        )
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
                                        handleSelectionTypeChange(
                                          index,
                                          "groups"
                                        )
                                      }
                                    />{" "}
                                    User Groups
                                  </label>
                                </div>

                                {/* Selector for Users or User Groups */}
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
                                      value={level.users || []} // Ensure users are always an array
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
                                    // <SingleSelector
                                    //   options={userGroups}
                                    //   value={level.group || null} // Ensure the group is an object
                                    //   onChange={(selected) =>
                                    //     handleInputChange(
                                    //       index,
                                    //       "group",
                                    //       selected
                                    //     )
                                    //   }
                                    //   placeholder="Select User Group"
                                    // />
                                    <SingleSelector
                                      key={formData.company_id} // ✅ Forces re-render when company changes
                                      options={userGroups}
                                      value={
                                        userGroups.find(
                                          (group) =>
                                            group.value === level.group?.value
                                        ) || null
                                      } // ✅ Ensure valid value
                                      onChange={(selected) =>
                                        handleInputChange(
                                          index,
                                          "group",
                                          selected
                                        )
                                      }
                                      placeholder="Select User Group"
                                    />
                                  )}
                                </fieldset>

                                {/* Remove Button */}
                                <button
                                  className="remove-item ms-4 mb-3 px-2 rounded purple-btn1"
                                  style={{ padding: "1px 3px" }}
                                  onClick={() => handleRemoveLevel(index)}
                                >
                                  x
                                </button>
                              </div>
                            ))}

                          {/* Add New Level Button */}
                          <div className="ms-3 mt-2">
                            <button
                              className="purple-btn1 submit-btn"
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
