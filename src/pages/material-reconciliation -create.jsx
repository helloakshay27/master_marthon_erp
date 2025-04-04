import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import MultiSelector from "../components/base/Select/MultiSelector";
import SingleSelector from "../components/base/Select/SingleSelector";
import { baseURL } from "../confi/apiDomain";

const MaterialReconciliationCreate = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  // const [selectedWing, setSelectedWing] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  // const [wingsOptions, setWingsOptions] = useState([]);

  // Fetch company data on component mount
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

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption); // Set selected company
    setSelectedProject(null); // Reset project selection
    setSelectedSite(null); // Reset site selection

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
    }
  };

  //   console.log("selected company:",selectedCompany)
  //   console.log("selected  prj...",projects)

  // Handle project selection
  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset site selection

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
    }
  };

  //   console.log("selected prj:",selectedProject)
  //   console.log("selected sub prj...",siteOptions)

  // Handle site selection
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  // Map companies to options for the dropdown
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));
  // Handle wing selection

  // material type options
  const [inventoryTypes, setInventoryTypes] = useState([]); // State to hold the fetched data
  const [selectedInventory, setSelectedInventory] = useState(null); // State to hold selected inventory type
  const [inventorySubTypes, setInventorySubTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedSubType, setSelectedSubType] = useState(null); // State to hold selected sub-type
  const [inventoryMaterialTypes, setInventoryMaterialTypes] = useState([]); // State to hold the fetched inventory subtypes
  const [selectedInventoryMaterialTypes, setSelectedInventoryMaterialTypes] =
    useState(null); // State to hold selected sub-type

  // Fetching inventory types data from API on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}pms/inventory_types.json?q[category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        // Map the fetched data to the format required by react-select
        const options = response.data.map((inventory) => ({
          value: inventory.id,
          label: inventory.name,
        }));
        setInventoryTypes(options); // Set the inventory types to state
      })
      .catch((error) => {
        console.error("Error fetching inventory types:", error);
      });
  }, []); // Empty dependency array to run only once on mount

  // Fetch inventory sub-types when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(","); // Get the selected inventory type IDs as a comma-separated list

      axios
        .get(
          `${baseURL}pms/inventory_sub_types.json?q[pms_inventory_type_id_in]=${inventoryTypeIds}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventorySubTypes(options); // Set the fetched sub-types to state
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
        });
    }
  }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes

  // Handler for inventory type selection change
  const handleInventoryChange = (selectedOption) => {
    setSelectedInventory(selectedOption); // Set the selected inventory type
    setSelectedSubType(null); // Clear the selected sub-type when inventory type changes
    setInventorySubTypes([]); // Reset the sub-types list
    setInventoryMaterialTypes([]);
    setSelectedInventoryMaterialTypes(null);
  };

  // Handler for inventory sub-type selection change
  const handleSubTypeChange = (selectedOption) => {
    setSelectedSubType(selectedOption); // Set the selected inventory sub-type
  };

  // Fetch inventory Material when an inventory type is selected
  useEffect(() => {
    if (selectedInventory) {
      const inventoryTypeIds = selectedInventory
        .map((item) => item.value)
        .join(","); // Get the selected inventory type IDs as a comma-separated list

      axios
        .get(
          `${baseURL}pms/inventories.json?q[inventory_type_id_in]=${inventoryTypeIds}&q[material_category_eq]=material&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          // Map the sub-types to options for the select dropdown
          const options = response.data.map((subType) => ({
            value: subType.id,
            label: subType.name,
          }));
          setInventoryMaterialTypes(options); // Set the fetched sub-types to state
        })
        .catch((error) => {
          console.error("Error fetching inventory sub-types:", error);
        });
    }
  }, [selectedInventory]); // Run this effect whenever the selectedInventory state changes

  // Handler for inventory Material selection change
  const handleInventoryMaterialTypeChange = (selectedOption) => {
    setSelectedInventoryMaterialTypes(selectedOption); // Set the selected inventory sub-type
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Store &gt; Store Operations &gt; Material Reconciliation
          </a>
          <div className="card card-default mt-5 p-2b-4" id="mor-material-slip">
            {/* <div className="card-body "> */}
            <div class="card-header3">
              <h3 class="card-title">Material Reconciliation</h3>
            </div>
            <div className="card-body ">
              {/* <h5 className="mt-4">Material Reconciliation</h5> */}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Company </label>
                    <SingleSelector
                      options={companyOptions}
                      onChange={handleCompanyChange}
                      value={selectedCompany}
                      placeholder={`Select Company`} // Dynamic placeholder
                    />
                  </div>
                  {/* /.form-group */}
                  {/* /.form-group */}
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Project </label>
                    <SingleSelector
                      options={projects}
                      onChange={handleProjectChange}
                      value={selectedProject}
                      placeholder={`Select Project`} // Dynamic placeholder
                    />
                  </div>
                  {/* /.form-group */}
                  {/* /.form-group */}
                </div>
                {/* /.col */}
                <div className="col-md-3">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Sub-Project </label>
                    <SingleSelector
                      options={siteOptions}
                      onChange={handleSiteChange}
                      value={selectedSite}
                      placeholder={`Select Sub-project`} // Dynamic placeholder
                    />
                  </div>
                  {/* /.form-group */}
                </div>
                <div className="col-md-3">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Store</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
                <div className="col-md-3 mt-2">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Material Reco. No.</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
                <div className="col-md-3 mt-2">
                  {/* /.form-group */}
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Default input"
                    />
                  </div>
                  {/* /.form-group */}
                </div>
              </div>
              <div className=" d-flex justify-content-between align-items-end px-2">
                <h5 className=" mt-3">Material</h5>
                <button
                  className="purple-btn2 "
                  data-bs-toggle="modal"
                  data-bs-target="#add-Material"
                >
                  <span className="material-symbols-outlined align-text-top">
                    add{" "}
                  </span>
                  <span className="">Add </span>
                </button>
              </div>
              <div className="tbl-container mx-2 mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>Material</th>
                      <th>Description</th>
                      <th>Specification</th>
                      <th>UOM</th>
                      <th>
                        Stock As on <dd-mm-yy></dd-mm-yy>
                      </th>
                      <th>Rate (Weighted Average)(INR)</th>
                      <th>Deadstock Qty</th>
                      <th>Theft / Missing Qty</th>
                      <th>Adjustment Quantity</th>
                      <th>Adjustment Rate(INR)</th>
                      <th>Adjustment Value(INR)</th>
                      <th>Net Quantity</th>
                      <th>Remarks</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        ROPO546
                      </td>
                      <td>Neo Valley</td>
                      <td>09-03-2024</td>
                      <td>Draft</td>
                      <td>Neo Valley</td>
                      <td>09-03-2024</td>
                      <td>Draft</td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </td>
                      <td>Neo Valley</td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Default input"
                        />
                      </td>
                      <td>
                        <div className="form-group">
                          <select
                            className="form-control form-select"
                            style={{ width: "100%" }}
                          >
                            <option selected="selected">Nos</option>
                            <option>Alaska</option>
                            <option>California</option>
                            <option>Delaware</option>
                            <option>Tennessee</option>
                            <option>Texas</option>
                            <option>Washington</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <button className="btn">
                          <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.76 6L6 11.76M6 6L11.76 11.76"
                              stroke="#8B0203"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                              stroke="#8B0203"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>{" "}
          </div>

          <div className="row mx-1 mt-3">
            <div className="col-md-12">
              <div className="form-group">
                <label>Remark</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter ..."
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
            <p className="">Status</p>
            <div className="dropdown">
              <button
                className="btn purple-btn2 btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                PO Draft
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row mt-2 justify-content-end">
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Print</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn2 w-100">Submit</button>
            </div>
            <div className="col-md-2">
              <button className="purple-btn1 w-100">Cancel</button>
            </div>
          </div>
          <div className=" ">
            <h5 className=" ">Audit Log</h5>
          </div>
          <div className="tbl-container px-0">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Pratham Shastri</td>
                  <td>15-02-2024</td>
                  <td>Verified</td>
                  <td>
                    <i
                      className="fa-regular fa-eye"
                      data-bs-toggle="modal"
                      data-bs-target="#remark-modal"
                      style={{ fontSize: 18 }}
                    />
                  </td>
                  <td>
                    <i
                      className="fa-regular fa-eye"
                      data-bs-toggle="modal"
                      data-bs-target="#comments-modal"
                      style={{ fontSize: 18 }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="add-Material"
        tabIndex={-1}
        aria-labelledby="exampleModal2Label"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header modal-header-k">
              <h4
                className="modal-title text-center w-100"
                id="exampleModalLabel"
                style={{ fontWeight: 500 }}
              >
                Add Material Reconciliation
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Type</label>
                    <MultiSelector
                      options={inventoryTypes} // Provide the fetched options to the select component
                      onChange={handleInventoryChange} // Update the selected inventory type
                      value={selectedInventory} // Set the selected inventory type
                      placeholder={`Select Material Type`} // Dynamic placeholder
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Sub-Type</label>
                    <MultiSelector
                      options={inventorySubTypes}
                      onChange={handleSubTypeChange}
                      value={selectedSubType}
                      placeholder={`Select Material Sub Type`} // Dynamic placeholder
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material</label>
                    <MultiSelector
                      options={inventoryMaterialTypes}
                      onChange={handleInventoryMaterialTypeChange}
                      value={selectedInventoryMaterialTypes}
                      placeholder={`Select Material`} // Dynamic placeholder
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Material Code</label>
                    <select name="" id="" className="form-control form-select">
                      <option value=""></option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3 mt-2">
                  <div className="form-group">
                    <label>Search by Material Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Default input"
                    />
                  </div>
                </div>
                <div className="col-md-2 mt-3">
                  <button className="purple-btn2 m-0">Go</button>
                </div>
              </div>
              {/* <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <p>Displaying page 1 of 9</p>
                </div>
                <div className="d-flex align-items-end gap-3">
                  <div className="form-group">
                    <label className="po-fontBold">Display</label>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                      fdprocessedid="z2s78m"
                    >
                      <option selected="selected">Default(5)</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                  <p> Items Per Page</p>
                </div>
              </div> */}
              <div className="card mt-2">
                <div className="card-body  mt-2">
                  {/* <nav
                    aria-label="Page navigation example"
                    style={{ height: 50 }}
                  >
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Previous">
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">»</span>
                        </a>
                      </li>
                    </ul>
                  </nav> */}
                  <div className="tbl-container me-2 mt-2">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th>Material Type</th>
                          <th>Material Sub-Type</th>
                          <th>Material</th>
                          <th>Qty</th>
                          <th>Stock As on [dd/mm/yy]</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td />
                          <td>PO/CDoM/MB001/3203</td>
                          <td>Feb 08, 2021</td>
                          <td>AMBUJA CEMENTS LIMITED</td>
                          <td>AMBUJA CEMENTS LIMITED</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialReconciliationCreate;
