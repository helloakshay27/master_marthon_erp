import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import Select from "../components/base/Select/Select";
import { useState, useEffect } from "react";
import { MultiSelector } from "../components";
import axios from "axios";

const InvoiceApproval = () => {
  const [filterOptions, setFilterOptions] = useState({
    companies: [],
    departments: [],
    sites: [],
    modules: [], // Add modules to the state
    material_types: [], // Add
    approval_types: [],
    users: [],
  });

  const [selectedCompany, setSelectedCompany] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState(null);

  // const [selectedTemplates, setSelectedTemplates] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null); // Track selected module
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);

  const modifiedFilterOptions = {
    companies: [
      { label: "Select Company", value: "" },
      ...filterOptions.companies, // Directly use the companies array from filterOptions
    ],
    // other fields
    sites: [{ label: "Select Site", value: "" }, ...filterOptions.sites],
    departments: [
      { label: "Select Department", value: "" },
      ...filterOptions.departments,
    ],
    // approval_types: [
    //   { label: "Select Module", value: "" },
    //   ...filterOptions.approval_types, // Map your modules here
    // ],
    modules: [{ label: "Select Module", value: "" }, ...filterOptions.modules],

    material_types: [
      { label: "Select Material Type", value: "" },
      ...filterOptions.material_types, // Map your material types here
    ],
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] },
  ]);

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: null,
    module_id: null, // Replace category_id with module_id
    material_type_id: null, // Repla
    // approval_type: "mor_approval", // example approval type

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
          companies: dropdownData.companies.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          sites: dropdownData.sites.map(([name, id, company_id]) => ({
            label: name,
            value: id,
            company_id,
          })),
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

  const handleCompanyChange = (selectedOption) => {
    console.log("Selected Option:", selectedOption); // Debugging

    // Extract company ID safely
    console.log("Selected Option:", selectedOption.target.value);

    const companyId = selectedOption.target.value; // Directly use companyId here

    if (!companyId) {
      console.warn("No valid company selected.");
      setSelectedCompany(null);
      setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
      return;
    }

    console.log("Selected Company ID:", companyId);

    // Update state
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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);

        if (!data || !Array.isArray(data.sites)) {
          console.error("Invalid or missing site data:", data);
          setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
          return;
        }

        // Map API response to match the select component's format
        const formattedSites = data.sites.map(([name, id]) => ({
          label: name,
          value: id,
        }));

        // Update filter options with the fetched sites
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

  // Filter sites dynamically when company_id changes

  // Handle site change

  const handleSiteChange = (selected) => {
    console.log("Selected Site ID:", selected.target.value); //
    const siteId = selected.target.value;

    console.log("site id", selected.target.value);
    // Logging the selected site value
    setFormData((prevState) => ({
      ...prevState,
      site_id: siteId, // Updating site_id in formData
    }));
  };
  // Handle category change

  const handleDepartmentChange = (selectedOption) => {
    console.log("Selected Department ID:", selectedOption.target.value);
    setFormData((prevState) => ({
      ...prevState,
      department_id: selectedOption.target.value,
    }));
  };

  const handleModuleChange = (selectedOption) => {
    console.log("Selected Module ID:", selectedOption.target.value);

    setFormData((prevState) => ({
      ...prevState,
      module_id: selectedOption.target.value, // Set module_id to selected module
    }));
  };

  const handleMaterialTypeChange = (selectedOption) => {
    console.log(
      "Selected Material Type (PMS Supplier ID):",
      selectedOption.target.value
    );

    setFormData((prevState) => ({
      ...prevState,
      pms_supplier_id: selectedOption.target.value, // Map material_id to pms_supplier_id
    }));
  };

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
    // Prepare the dynamic payload with data from formData and approvalLevels
    const payload = {
      // site_id: formData.site_id,
      approval_type: formData.module_id, // Use dynamic approval_type
      // Or set dynamically if needed
      company_id: formData.company_id, // Dynamic company_id from formData
      project_id: formData.site_id, // Static or dynamic if needed
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
        alert("Approval created successfully!");
        // Optionally reset form data here if needed
      })
      .catch((error) => {
        console.error("Error creating invoice approval:", error);
      });
  };

  const handleSaveAndCreate = () => {
    // Prepare payload and send POST request (as you already have in handleCreate)
    const payload = {
      approval_type: formData.module_id,
      company_id: formData.company_id,
      project_id: formData.site_id,
      department_id: formData.department_id,
      snag_checklist_id: formData.template_id,
      sub_category_id: formData.sub_category_id,
      category_id: formData.category_id,
      invoice_approval_levels_attributes: approvalLevels.map((level) => ({
        name: level.name,
        order: level.order,
        active: true,
        escalate_to_users: level.users.map((user) => user.value),
      })),
    };

    // Send API request
    axios
      .post(
        "https://marathon.lockated.com/pms/admin/invoice_approvals.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
        payload
      )
      .then((response) => {
        console.log("Approval Created:", response.data);
        alert("Approval created successfully!");

        // Reset all the form fields to their initial values
        setFormData(initialFormData); // Reset form data
        setSelectedCompany(null); // Reset selected company
        setSelectedCategory(null); // Reset selected category
        setSelectedTemplates(null); // Reset selected templates
        setFilterOptions((prevState) => ({
          ...prevState,
          sites: [],
          sub_categories: [],
          templates: [],
        })); // Optionally reset dynamic filter options

        // Optionally reset other states (approvalLevels, selectedUsers, etc.)
        setApprovalLevels([{ order: "", name: "", users: [] }]);
      })
      .catch((error) => {
        console.error("Error creating invoice approval:", error);
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
                                  Company
                                </label>
                                <Select
                                  id="company-select"
                                  options={modifiedFilterOptions.companies} // Ensure you're using the correct filter options
                                  onChange={(selectedOption) => {
                                    setTimeout(() => {
                                      handleCompanyChange(selectedOption); // Pass the selectedOption directly to the handler
                                    }, 500); // Delay of 500ms (adjust as needed)
                                  }}
                                  value={selectedCompany} // Bind the selected company state to the value prop
                                  placeholder="Select Company"
                                  isClearable // Allow clearing the selection
                                />
                              </div>

                              {/* Event Number */}
                              <div className="col-md-3">
                                <label htmlFor="event-no-select">Site</label>
                                <Select
                                  id="event-no-select"
                                  options={modifiedFilterOptions.sites}
                                  placeholder="Select Site"
                                  onChange={handleSiteChange}
                                  isClearable
                                />
                              </div>

                              {/* Status */}
                              <div className="col-md-3">
                                <label htmlFor="status-select">
                                  Department
                                </label>
                                <Select
                                  id="status-select"
                                  options={modifiedFilterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  placeholder="Select Department"
                                  isClearable
                                />
                              </div>

                              <div className="col-md-3 mt-4">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Module
                                </label>
                                <Select
                                  id="module-select"
                                  options={modifiedFilterOptions.modules} // Use modifiedFilterOptions.modules
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
                                {/* <Select
                                  id="created-by-select"
                                  options={modifiedFilterOptions.material_types}
                                  value={selectedMaterialType}
                                  isClearable

                                  // onChange={handleSubCategoryChange}
                                /> */}
                                <Select
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
