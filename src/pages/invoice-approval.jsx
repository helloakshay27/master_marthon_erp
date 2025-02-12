import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const modifiedFilterOptions = {
    departments: [
      { label: "Select Department", value: "" },
      ...(filterOptions.departments || []), // Safeguard against undefined or null departments
    ],
    subprojects: [
      { label: "Select Subproject", value: "" },
      ...(filterOptions.subprojects || []), // Safeguard against undefined or null subprojects
    ],
    modules: [
      { label: "Select Module", value: "" },
      ...(filterOptions.modules || []), // Safeguard against undefined or null modules
    ],
    material_types: [
      { label: "Select Material Type", value: "" },
      ...(filterOptions.material_types || []), // Safeguard against undefined or null material_types
    ],
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] },
  ]);

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

  /// Empty dependency array to run only once on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // const response = await fetch(
        //   "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        // );
        const [dropdownResponse, materialTypeResponse] = await Promise.all([
          fetch(
            "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
          ),
          fetch(
            "https://marathon.lockated.com/pms/inventory_types.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
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

  const [departmentUsers, setDepartmentUsers] = useState([]);

  const handleDepartmentChange = async (selectedOption) => {
    if (!selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        department_id: null, // Reset if no department selected
      }));
      setSelectedDepartment(null); //  dropdown value
      setDepartmentUsers([]);
      return;
    }

    const departmentId = selectedOption.value; //  Get selected department ID
    console.log("Selected Department ID:", departmentId);

    setFormData((prevState) => ({
      ...prevState,
      department_id: departmentId,
    }));

    setSelectedDepartment(selectedOption); // Ensure dropdown selection updates

    try {
      // Fetch users based on department ID
      const response = await axios.get(
        `https://marathon.lockated.com/users.json?q[department_id_eq]=${departmentId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );

      if (response.data && Array.isArray(response.data)) {
        const userOptions = response.data.map((user) => ({
          value: user.id,
          label: user.full_name,
        }));
        setDepartmentUsers(userOptions);
      }
    } catch (error) {
      console.error("Error fetching users for department:", error);
      setDepartmentUsers([]);
    }
  };

  // Ensure selectedDepartment is set from formData when component renders
  useEffect(() => {
    if (formData.department_id) {
      const selected = modifiedFilterOptions.departments.find(
        (option) => option.value === formData.department_id
      );
      setSelectedDepartment(selected || null);
    }
  }, [formData.department_id, modifiedFilterOptions.departments]);

  // const handleModuleChange = (selectedOption) => {
  //   if (!selectedOption) {
  //     setSelectedModule(null);
  //     setFormData((prevState) => ({ ...prevState, module_id: null }));
  //     return;
  //   }

  //   console.log("Selected Module ID:", selectedOption.value);

  //   setSelectedModule(selectedOption); // Store the full selected option
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     module_id: selectedOption.value, // Set module_id from selected value
  //   }));
  // };

  // const [selectedModule, setSelectedModule] = useState(null);
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
    const payload = {
      // site_id: formData.site_id,
      approval_type: formData.module_id, // Use dynamic approval_type
      // Or set dynamically if needed
      company_id: formData.company_id, // Dynamic company_id from formData
      project_id: formData.project_id,
      site_id: formData.site_id, // Static or dynamic if needed
      department_id: formData.department_id, // Dynamic department_id from formData
      pms_inventory_type_id: formData.pms_supplier_id,
      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        name: level.name,
        order: level.order,
        active: true, // Assuming that all levels are active; adjust as necessary
        escalate_to_users: level.users.map((user) => user.value), // Mapping user IDs to escalate_to_users
      })),
    };

    // Log payload to verify its content
    console.log("Payload for Create Request:", payload);

    // API call to create the invoice approval
    axios
      .post(
        "https://marathon.lockated.com/pms/admin/invoice_approvals.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
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

  const handleSaveAndCreate = () => {
    setLoading(true);
    const errors = [];

    if (!formData.company_id) errors.push("Company is required.");
    if (!formData.department_id) errors.push("Department is required.");
    if (!formData.module_id) errors.push("Module is required.");

    // 🔹 Validate Approval Levels
    if (approvalLevels.length === 0) {
      errors.push("At least one Approval Level is required.");
    } else {
      approvalLevels.forEach((level, index) => {
        if (!level.name)
          errors.push(`Approval Level ${index + 1}: Name is required.`);
        if (!level.order)
          errors.push(`Approval Level ${index + 1}: Order is required.`);
        if (!level.users || level.users.length === 0)
          errors.push(
            `Approval Level ${index + 1}: At least one user is required.`
          );
      });
    }

    // 🔹 Show validation errors
    if (errors.length > 0) {
      setLoading(false);
      alert("plz fill required fields"); // Display all errors in an alert
      return; // Stop function execution
    }

    // 🔹 Construct Payload
    const payload = {
      approval_type: formData.module_id,
      company_id: formData.company_id,
      project_id: formData.project_id,
      department_id: formData.department_id,
      site_id: formData.site_id,
      snag_checklist_id: formData.template_id,
      pms_inventory_type_id: formData.pms_supplier_id,
      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        name: level.name,
        order: level.order,
        active: true,
        escalate_to_users: level.users.map((user) => user.value),
      })),
    };

    // 🔹 API Call
    axios
      .post(
        "https://marathon.lockated.com/pms/admin/invoice_approvals.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        payload
      )
      .then((response) => {
        console.log("Approval Created:", response.data);
        alert("Approval created successfully!");

        // Reset form selections
        setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedSite(null);
        setSelectedDepartment(null);
        setSelectedModule(null);
        setSelectedMaterialType(null);

        // Reset form data
        setFormData((prevState) => ({
          ...prevState,
          department_id: null,
          module_id: null,
          pms_supplier_id: null,
        }));

        // Reset dropdowns
        setFilterOptions((prevOptions) => ({
          ...prevOptions,
          departments: prevOptions.departments.map((dept) => ({
            ...dept,
            selected: false,
          })),
          modules: prevOptions.modules.map((mod) => ({
            ...mod,
            selected: false,
          })),
          material_types: prevOptions.material_types.map((mat) => ({
            ...mat,
            selected: false,
          })),
        }));

        setApprovalLevels([{ order: "", name: "", users: [] }]);

        // Fetch updated dropdown data
        fetchDropdownData();
      })
      .catch((error) => {
        console.error("Error creating invoice approval:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

      console.log("Material Types:", materialTypesData);

      // Ensure material_types is populated
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
          { label: "Select Material Type", value: "" }, // Ensure reset state first
          ...materialTypes.map((material) => ({
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
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                {/* <SingleSelector
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDeparment}
                                  placeholder="Select Department"
                                  isClearable
                                /> */}

                                <SingleSelector
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  value={selectedDepartment} //
                                  placeholder="Select Department"
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
                                  options={departmentUsers} // Use dynamically fetched users
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
                          className=" purple-btn1 submit-btn"
                          // value="save"
                          // fdprocessedid="4ksxs"
                          onClick={() => handleCreate()}
                        >
                          Create
                        </button>
                        <button
                          name="subaction"
                          type="submit"
                          className=" purple-btn2 submit-btn"
                          onClick={handleSaveAndCreate}
                        >
                          Save And Create New{" "}
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

export default InvoiceApproval;
