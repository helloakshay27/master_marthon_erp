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
    categories: [],
    sub_categories: [],
    approval_types: [],
    users: [],
    templates: [],
  });

  const { id } = useParams(); // Ge
  const [loading, setLoading] = useState(true); // New loading state

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedTemplates, setSelectedTemplates] = useState(null);

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
    categories: [
      { label: "Select Category", value: "" },
      ...filterOptions.categories,
    ],
    sub_categories: [
      { label: "Select Sub Category", value: "" },
      ...filterOptions.sub_categories,
    ],
    templates: [
      { label: "Select templates", value: "" },
      ...filterOptions.templates,
    ],
  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [approvalLevels, setApprovalLevels] = useState([
    { order: "", name: "", users: [] },
  ]);

  const [formData, setFormData] = useState({
    company_id: null,
    department_id: null,
    category_id: null,
    sub_category_id: null,
    approval_type: "mor_approval", // example approval type
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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(
          "https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );
        if (!response.ok) throw new Error("Failed to fetch dropdown data");

        const data = await response.json();

        setFilterOptions({
          companies: data.companies.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          sites: data.sites.map(([name, id, company_id]) => ({
            label: name,
            value: id,
            company_id,
          })),
          departments: data.departments.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          categories: data.categories.map(([name, id, company_id]) => ({
            label: name,
            value: id,
            company_id,
          })),
          sub_categories: data.sub_categories.map(([name, id]) => ({
            label: name,
            value: id,
          })),
          templates: data.templates.map(([name, id, category_id]) => ({
            label: name,
            value: id,
            category_id,
          })),
          users: data.users.map(([name, id]) => ({
            label: name,
            value: id,
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

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
          department_id: data.department_id || null,
          category_id: data.category_id || null,
          sub_category_id: data.sub_category_id || null,
          approval_type: data.approval_type || "mor_approval",
          invoice_approval_levels: data.invoice_approval_levels || [],
        });

        setSelectedCompany(
          data.company_id
            ? { label: data.company_name, value: data.company_id }
            : null
        );
        setSelectedCategory(
          data.category_id
            ? { label: data.category_name, value: data.category_id }
            : null
        );
        setSelectedTemplates(
          data.template_id
            ? { label: data.template_name, value: data.template_id }
            : null
        );

        setApprovalLevels(
          data.invoice_approval_levels.map((level) => ({
            order: level.order || "",
            name: level.name || "",
            users: level.users.map((user) => ({
              label: user.name,
              value: user.id,
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }
    };

    fetchDropdownData();
    fetchApprovalData();
  }, [id]);

  // const handleCompanyChange = (selectedOption) => {
  //   console.log("Selected Option:", selectedOption); // Debugging

  //   // Extract company ID safely
  //   console.log("Selected Option:", selectedOption.target.value);

  //   const companyId = selectedOption.value; // Directly use companyId here

  //   if (!companyId) {
  //     console.warn("No valid company selected.");
  //     setSelectedCompany(null);
  //     setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
  //     return;
  //   }

  //   console.log("Selected Company ID:", companyId);

  //   // Update state
  //   setSelectedCompany(selectedOption);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     company_id: companyId,
  //     site_id: null, // Reset site selection
  //   }));

  //   // Fetch sites based on selected company
  //   fetch(
  //     `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?company_id=${companyId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("API Response Data:", data);

  //       if (!data || !Array.isArray(data.sites)) {
  //         console.error("Invalid or missing site data:", data);
  //         setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
  //         return;
  //       }

  //       // Map API response to match the select component's format
  //       const formattedSites = data.sites.map(([name, id]) => ({
  //         label: name,
  //         value: id,
  //       }));

  //       // Update filter options with the fetched sites
  //       setFilterOptions((prevState) => ({
  //         ...prevState,
  //         sites: formattedSites,
  //       }));
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching sites:", error);
  //       setFilterOptions((prevState) => ({ ...prevState, sites: [] }));
  //     });
  // };

  // Filter sites dynamically when company_id changes

  // Handle site change

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption.target.value; // Use the value directly

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

  const handleSiteChange = (selected) => {
    console.log("Selected Site ID:", selected?.value); //

    console.log("site id", selected.target.value);
    // Logging the selected site value
    setFormData((prevState) => ({
      ...prevState,
      site_id: selected.target.value, // Updating site_id in formData
    }));
  };
  // Handle category change

  const handleCategoryChange = (selectedOption) => {
    console.log("Selected Category:", selectedOption);

    const categoryId = selectedOption.target.value;

    if (!categoryId) {
      console.warn("No valid category selected.");
      setFormData((prevData) => ({
        ...prevData,
        category_id: null,
        template_id: null, // Reset the template selection
        sub_category_id: null, // Reset sub category selection
      }));
      setFilterOptions((prevState) => ({ ...prevState, templates: [] }));
      return;
    }

    console.log("Selected Category ID:", categoryId);

    // Update formData with selected category
    setSelectedCategory(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      category_id: categoryId,
      template_id: null, // Reset template selection
      sub_category_id: null, // Reset sub-category selection
    }));

    // Fetch templates based on selected category
    fetch(
      `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?category_id=${categoryId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response Data for Templates:", data);

        if (!data || !Array.isArray(data.templates)) {
          console.error("Invalid or missing template data:", data);
          setFilterOptions((prevState) => ({ ...prevState, templates: [] }));
          return;
        }

        // Format the templates for select component
        const formattedTemplates = data.templates.map(
          ([name, id, category_id]) => ({
            label: name,
            value: id,
            category_id,
          })
        );

        setFilterOptions((prevState) => ({
          ...prevState,
          templates: formattedTemplates,
        }));
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
        setFilterOptions((prevState) => ({ ...prevState, templates: [] }));
      });
  };

  // Filter templates dynamically when category_id changes
  const filteredTemplates = filterOptions.templates.filter(
    (template) => template.category_id === formData.category_id
  );

  // Handle template change
  const handleTemplateChange = (selectedOption) => {
    console.log("Selected Template:", selectedOption);

    const templateId = selectedOption.target.value;

    if (!templateId) {
      console.warn("No valid template selected.");
      setSelectedTemplates(selectedOption);
      setFormData((prevData) => ({
        ...prevData,
        template_id: null,
        sub_category_id: null, // Reset sub-category selection
      }));
      setFilterOptions((prevState) => ({ ...prevState, sub_categories: [] }));
      return;
    }

    console.log("Selected Template ID:", templateId);

    // Update formData with selected template
    setFormData((prevData) => ({
      ...prevData,
      template_id: templateId,
      sub_category_id: null, // Reset sub-category selection
    }));

    // Fetch sub-categories based on selected template
    fetch(
      `https://marathon.lockated.com/pms/admin/invoice_approvals/dropdown_list.json?template_id=${templateId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response Data for Sub-Categories:", data);

        if (!data || !Array.isArray(data.sub_categories)) {
          console.error("Invalid or missing sub-category data:", data);
          setFilterOptions((prevState) => ({
            ...prevState,
            sub_categories: [],
          }));
          return;
        }

        // Format the sub-categories for select component
        const formattedSubCategories = data.sub_categories.map(
          ([name, id]) => ({
            label: name,
            value: id,
          })
        );

        setFilterOptions((prevState) => ({
          ...prevState,
          sub_categories: formattedSubCategories,
        }));
      })
      .catch((error) => {
        console.error("Error fetching sub-categories:", error);
        setFilterOptions((prevState) => ({ ...prevState, sub_categories: [] }));
      });
  };

  // Filter sub-categories dynamically when template_id changes
  const handleSubCategoryChange = (selectedOption) => {
    console.log("Selected Sub-Category:", selectedOption);

    const subCategoryId = selectedOption.target.value;

    if (!subCategoryId) {
      console.warn("No valid sub-category selected.");
      setFormData((prevData) => ({
        ...prevData,
        sub_category_id: null,
      }));
      return;
    }

    console.log("Selected Sub-Category ID:", subCategoryId);

    // Update formData with selected sub-category
    setFormData((prevData) => ({
      ...prevData,
      sub_category_id: subCategoryId,
    }));
  };

  const handleDepartmentChange = (selectedOption) => {
    console.log("Selected Department ID:", selectedOption.target.value);
    setFormData((prevState) => ({
      ...prevState,
      department_id: selectedOption.target.value,
    }));
  };

  const handleCreate = () => {
    // Prepare the dynamic payload with data from formData and approvalLevels
    const payload = {
      site_id: formData.site_id,
      approval_type: formData.approval_type, // Use dynamic approval_type
      organization_id: 2, // Or set dynamically if needed
      company_id: formData.company_id, // Dynamic company_id from formData
      project_id: 30, // Static or dynamic if needed
      department_id: formData.department_id, // Dynamic department_id from formData
      snag_checklist_id: 1, // Static or dynamic if needed
      sub_category_id: formData.sub_category_id, // Dynamic sub_category_id from formData
      category_order: 1, // Static or dynamic if needed
      category_id: formData.category_id, // Dynamic category_id from formData
      invoice_approval_levels: approvalLevels.map((level) => ({
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
        `https://marathon.lockated.com/pms/admin/invoice_approvals.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
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
                                  options={filterOptions.companies} // Ensure you're using the correct filter options
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
                                  options={filterOptions.sites}
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
                                  options={filterOptions.departments}
                                  onChange={handleDepartmentChange}
                                  placeholder="Select Department"
                                  isClearable
                                />
                              </div>

                              {/* Created By */}
                              <div className="col-md-3">
                                <label htmlFor="created-by-select">
                                  Category
                                </label>
                                <Select
                                  id="created-by-select"
                                  options={filterOptions.categories}
                                  onChange={handleCategoryChange}
                                  value={selectedCategory}
                                />
                              </div>
                              <div className="col-md-3 mt-3">
                                <label htmlFor="created-by-select">
                                  {" "}
                                  Templates
                                </label>
                                <Select
                                  id="created-by-select"
                                  options={filterOptions.templates}
                                  isClearable
                                  onChange={handleTemplateChange}
                                  value={selectedTemplates}
                                />
                              </div>

                              <div className="col-md-3 mt-4">
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
                          update
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
