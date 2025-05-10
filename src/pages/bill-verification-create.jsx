import React from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import SingleSelector from "../components/base/Select/SingleSelector";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import {
  Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
const BillVerificationCreate = () => {
  const [remarkModal, setremarkModal] = useState(false);
  const [attachModal, setattachModal] = useState(false);

  const openremarkModal = () => setremarkModal(true);
  const closeremarkModal = () => setremarkModal(false);

  const openattachModal = () => setattachModal(true);
  const closeattachModal = () => setattachModal(false);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedSite(null);
    setSites(
      value?.sites?.map((site) => ({
        value: site.id,
        label: site.name,
      })) || []
    );
  };

  const handleSiteChange = (value) => {
    setSelectedSite(value);
  };

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setSelectedProject(null);
    setSelectedSite(null);
    setProjects(
      selectedOption?.projects?.map((project) => ({
        value: project.id,
        label: project.name,
        sites: project.pms_sites,
      })) || []
    );
    setSites([]);
  };

  const fetchProjects = async (companyId) => {
    try {
      const response = await axios.get(
        `${baseURL}projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[company_id_eq]=${companyId}`
      );
      setProjects(
        response.data.projects.map((project) => ({
          value: project.id,
          label: project.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSites = async (projectId) => {
    try {
      const response = await axios.get(
        `${baseURL}sites.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&q[project_id_eq]=${projectId}`
      );
      setSites(
        response.data.sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  useEffect(() => {
    if (selectedProject?.value) {
      fetchSites(selectedProject.value);
    }
  }, [selectedProject]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${baseURL}pms/company_setups.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      );
      const formattedCompanies = response.data.companies.map((company) => ({
        value: company.id,
        label: company.company_name,
        projects: company.projects,
      }));
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const statusOptions = [
    {
      label: "Select Status",
      value: "",
    },
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Verified",
      value: "verified",
    },
    {
      label: "Submited",
      value: "submited",
    },
    {
      label: "Proceed",
      value: "proceed",
    },
    {
      label: "Approved",
      value: "approved",
    },
  ];
  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section mx-2">
          <a href="">
            Home &gt; Billing &gt; Bill Verification List &gt; Update Bill
            Information
          </a>
          <h5 className="mt-3">Update Bill Information</h5>
          <div className="mor-tabs mt-4">
            <ul
              className="nav nav-pills mb-3 justify-content-center"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#create-mor"
                  type="button"
                  role="tab"
                  aria-controls="create-mor"
                  aria-selected="false"
                  fdprocessedid="7mdk1cl"
                >
                  Material
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="pill"
                  data-bs-target="#mor-approval-create"
                  type="button"
                  role="tab"
                  aria-controls="mor-approval-create"
                  aria-selected="true"
                  fdprocessedid="05u9l8"
                >
                  Service
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  fdprocessedid="zf7dlh"
                >
                  Misc.
                </button>
              </li>
              <li className="nav-item" role="presentation" />
            </ul>
          </div>
          <div className="row align-items-center container-fluid mb-5 mt-5 ">
            <div className="col-md-12 ">
              <div className="card p-3 mx-2">
                <div className="row">
                  
                  <div className="col-md-4 ">
                    <div className="form-group">
                      <label>
                        Company <span>*</span>
                      </label>
                      <SingleSelector
                        options={companies}
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        placeholder="Select Company"
                      />
                    </div>
                  </div>
                  <div className="col-md-4  ">
                    <div className="form-group">
                      <label>
                        Project <span>*</span>
                      </label>
                      <SingleSelector
                        options={projects}
                        value={selectedProject}
                        onChange={handleProjectChange}
                        placeholder="Select Project"
                        isDisabled={!selectedCompany}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 ">
                    <div className="form-group">
                      <label>
                        Sub-Project <span>*</span>
                      </label>

                      <SingleSelector
                        options={sites}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-Project`} // Dynamic placeholder
                        isDisabled={!selectedCompany}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-2">
                    <div className="form-group">
                      <label>Vendor Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-1 mt-2">
                    <p className="mt-2 text-decoration-underline">
                      View Details
                    </p>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>PO Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Number</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Acceptance Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Created On</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Mode of Submission</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Bill Due date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="form-group">
                      <label>Vendor Remark</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-5 ">
                  <h5 className=" ">Supporting Documents</h5>
                  <div className="card-tools d-flex">
                    <button
                      className="purple-btn2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#AttachModal"
                      onClick={openremarkModal}
                    >
                      Revision Req.
                    </button>
                    <div>
                      <button
                        className="purple-btn2 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#RevisionModal"
                        onClick={openattachModal}
                      >
                        Attach Other
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tbl-container  mt-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th className="text-start">Sr. No.</th>
                        <th className="text-start">Document Name</th>
                        <th className="text-start">No. of Documents</th>
                        <th className="text-start">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">1</td>
                        <td className="text-start">Tax Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">2</td>
                        <td className="text-start">
                          Site acknowledged challan / Challan cum Invoice
                        </td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">3</td>
                        <td className="text-start">Weighment slips</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">4</td>
                        <td className="text-start"> Lorry receipt</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="text-start">5</td>
                        <td className="text-start">E Way bill</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">6</td>
                        <td className="text-start">E Invoice</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td> </td>
                        <td className="text-start">7</td>
                        <td className="text-start">Warranty</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                      <tr>
                        <td />
                        <td className="text-start">8</td>
                        <td className="text-start">MTC</td>
                        <td
                          className="text-start"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          3
                        </td>
                        <td
                          className="text-start text-decoration-underline"
                          data-bs-toggle="modal"
                          data-bs-target="#RevisionModal"
                          onClick={openattachModal}
                        >
                          Attach
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mx-1">
                <div className="row ">
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
                <div className="row mt-2">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="d-flex justify-content-end align-items-center gap-3">
                <p className="">Assigned To User</p>
                <div className="dropdown">
                  <button
                    className="btn purple-btn2 btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    fdprocessedid="d2d1ue"
                  >
                    Shamshik
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
              </div> */}
              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label
                      style={{ fontSize: "0.95rem", color: "black", whiteSpace: "nowrap", }}
                    >
                      Assigned To User
                    </label>
                    <SingleSelector
                      options={statusOptions}
                      // onChange={handleStatusChange}
                      // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                      placeholder="Select User"
                      // isClearable={false}
                      // isDisabled={true} // Disable the selector
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4 justify-content-end align-items-center mx-2">
                <div className="col-md-3">
                  <div className="form-group d-flex gap-3 align-items-center mx-3">
                    <label style={{ fontSize: "0.95rem", color: "black" }}>
                      Status
                    </label>
                    <SingleSelector
                      options={statusOptions}
                      // onChange={handleStatusChange}
                      // value={statusOptions.find((option) => option.value === "draft")} // Set "Draft" as the selected status
                      placeholder="Select Status"
                      // isClearable={false}
                      // isDisabled={true} // Disable the selector
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-end">
                <div className="col-md-2">
                  <button className="purple-btn2 w-100">Submit</button>
                </div>
                <div className="col-md-2">
                  <button className="purple-btn1 w-100">Cancel</button>
                </div>
              </div>
              <div className="mb-5">
                <h5 className=" mt-3">Audit Log</h5>
                <div className="">
                  <div className="mx-0">
                    <Table columns={auditLogColumns} data={auditLogData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* attach modal */}
      <Modal
        centered
        size="l"
        show={attachModal}
        onHide={closeattachModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Attach Other Document</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name of the Document</label>
                <input
                  className="form-control"
                  type=""
                  placeholder=""
                  fdprocessedid="qv9ju9"
                />
              </div>
            </div>
            <div className="col-md-12 mt-2">
              <div className="form-group">
                <form action="/upload" method="post" encType="multipart/form-data">
                  {/* <label for="fileInput">Choose File:</label> */}
                  <input type="file" id="fileInput" name="attachment" />
                </form>
              </div>
            </div>
          </div>
          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn2 w-100" fdprocessedid="u33pye">
                Attach
              </button>
            </div>
            <div className="col-md-4">
              <button className="purple-btn1 w-100" fdprocessedid="af5l5g">
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* attach modal */}

      {/* remark modal */}
      <Modal
        centered
        size="l"
        show={remarkModal}
        onHide={closeremarkModal}
        backdrop="true"
        keyboard={true}
        className="modal-centered-custom"
      >
        <Modal.Header closeButton>
          <h5>Remark</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <div className="form-group">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter ..."
                defaultValue={""}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* remark modal */}
    </>
  );
};

export default BillVerificationCreate;
