import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import BOQListTable from "../components/BOQListTabe";
import { Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { BulkAction } from "../components";
import axios from "axios";



const BOQList = () => {
  const [show, setShow] = useState(false); // State to manage modal visibility for copy budget
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [boqList, setBoqList] = useState(null); // State to store the fetched data



  const navigate = useNavigate(); // hook to get navigate function

  const handleClick = () => {
    // Navigate to '/about' when the button is clicked
    navigate('/create-BOQ');
  };


  const [copyModal, setcopyModal] = useState(false);

  const openCopyModal = () => setcopyModal(true);
  const closeCopyModal = () => setcopyModal(false);



  const [expandedRows, setExpandedRows] = useState([]);


  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const [openSubProject2, setOpenSubProject2] = useState(false)
  const handleSubProject2 = () => {
    setOpenSubProject2(!openSubProject2)
  }
  const [openSubProject2_1, setOpenSubProject2_1] = useState(false)
  const handleSubProject2_1 = () => {
    setOpenSubProject2_1(!openSubProject2_1)
  }

  const [openSubProject2_11, setOpenSubProject2_11] = useState(false)
  const handleSubProject2_11 = () => {
    setOpenSubProject2_11(!openSubProject2_11)
  }

  const [openSubProject2_12, setOpenSubProject2_12] = useState(false)
  const handleSubProject2_12 = () => {
    setOpenSubProject2_12(!openSubProject2_12)
  }

  const [openSubProject2_13, setOpenSubProject2_13] = useState(false)
  const handleSubProject2_13 = () => {
    setOpenSubProject2_13(!openSubProject2_13)
  }

  const [openSubProjectDetails, setOpenSubProjectDetails] = useState(false)
  const handleSubProjectDetails = () => {
    setOpenSubProjectDetails(!openSubProjectDetails)
  }


  const [openSubProject3, setOpenSubProject3] = useState(false)
  const handleSubProject3 = () => {
    setOpenSubProject3(!openSubProject3)
  }

  const [openSubProject, setOpenSubProject] = useState(false)
  const handleSubProject = () => {
    setOpenSubProject(!openSubProject)
  }



  //  project ,sub project wing api 
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingsOptions, setWingsOptions] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);

  // Fetch projects on mount
  useEffect(() => {
    // Replace this with your actual API URL
    axios.get('https://marathon.lockated.com/pms/projects.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
      .then(response => {
        setProjects(response.data.projects);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  // Handle project selection change
  const handleProjectChange = (selectedOption) => {
    // Reset selected site and wing when a new project is selected
    setSelectedProject(selectedOption);
    setSelectedSite(null); // Reset selected site
    setSelectedWing(null); // Reset selected wing
    setWingsOptions([]); // Clear wings options
    setSiteOptions([]);

    // Fetch sites based on the selected project
    if (selectedOption) {
      const selectedProjectData = projects.find(project => project.id === selectedOption.value);
      setSiteOptions(selectedProjectData.pms_sites.map(site => ({
        value: site.id,   // Use id as value for the site
        label: site.name  // Display the site name
      })));
    }
  };

  // Handle site selection change
  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSelectedWing(null); // Reset selected wing
    setWingsOptions([]); // Clear wings options

    // Fetch wings for the selected site
    if (selectedOption) {
      const selectedProjectData = projects.find(project => project.id === selectedProject.value);
      const selectedSiteData = selectedProjectData.pms_sites.find(site => site.id === selectedOption.value);
      setWingsOptions(selectedSiteData.pms_wings.map(wing => ({
        value: wing.id,    // Use id as value for the wing
        label: wing.name   // Display the wing name
      })));
    }
  };

  // Handle wing selection change
  const handleWingChange = (selectedOption) => {
    setSelectedWing(selectedOption);
    // You can perform further actions with the selected wing value if necessary
  };

  // Mapping projects for the dropdown
  const projectOptions = projects.map(project => ({
    value: project.id,         // Use id as value for the project
    label: project.formatted_name
  }));


  // Fetch data from the API when the component mounts
  useEffect(() => {
    // axios
    //   .get(`https://marathon.lockated.com/boq_details.json?project_id=31&site_id=35&wing_id=&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
    //   .then((response) => {
    //     setBoqList(response.data); // Set the data in state

    //   })
    //   .catch((error) => {
    //     console.loh('error',error)

    //   });


    if (selectedProject || selectedSite || selectedWing) {
      const projectId = selectedProject ? selectedProject.value : "";
      const siteId = selectedSite ? selectedSite.value : "";
      const wingId = selectedWing ? selectedWing.value : "";

      // Show alert with the values
    // alert(` Select Project , Sub Project and Wing `);

      axios
        .get(`https://marathon.lockated.com/boq_details.json?project_id=${projectId}&site_id=${siteId}&wing_id=${wingId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then((response) => {
          setBoqList(response.data); // Set the fetched data in state
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [selectedProject, selectedSite, selectedWing]); // Empty dependency array ensures it runs only once when the component mounts

  console.log('boq list', boqList)


  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">Setup &gt; Engineering Setup &gt; BOQ</a>
          <h5 className="mt-4">View BOQ</h5>
          <div className="d-flex justify-content-end">
            <button className="purple-btn2" onClick={handleClick}>Create</button>
            <button className="purple-btn2">Import</button>
            <button className="purple-btn2">Export</button>
            <button className="purple-btn2">Delete</button>
            <button
              className="purple-btn2"
              // data-bs-toggle="modal"
              // data-bs-target="#copyModal"
              // onClick={openCopyModal}
              onClick={handleShow}
            >
              Copy
            </button>
          </div>
          {/* <div className="tab-content1 active" id="total-content"> */}
          {/* Total Content Here */}


          <div className="card mt-2 pb-4">
            <CollapsibleCard title="View BOQ">


              <div className="card-body mt-0 pt-0">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project</label>
                      <SingleSelector
                        options={projectOptions}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Sub-project</label>
                      <SingleSelector
                        options={siteOptions}
                        onChange={handleSiteChange}
                        value={selectedSite}
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
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
                {/* <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Main Category</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Main Category`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 2</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 2`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 3</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 3`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 4</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 4`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>Sub-Category lvl 5</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Sub-Category lvl 5`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                </div> */}
                {/* <div className="row">
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ Name</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select BOQ Name`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>BOQ ID</label>
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
                      <label>BOQ Description</label>
                      <textarea
                        className="form-control"
                        rows={1}
                        placeholder="Enter ..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <SingleSelector
                        options={options}
                        // value={values[label]} // Pass current value
                        // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                        placeholder={`Select Status`} // Dynamic placeholder
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <div className="form-group">
                      <label>From Date</label>
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
                      <label>To Date</label>
                      <input
                        className="form-control"
                        type="date"
                        placeholder=""
                        fdprocessedid="qv9ju9"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2">
                    <div className="d-flex">
                      <div className="form-group d-flex mt-1">
                        <label className="form-check-label me-3">
                          View BOQ Version List
                        </label>
                        <div className="form-check pe-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <SingleSelector
                          options={options}
                          // value={values[label]} // Pass current value
                          // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                          placeholder={`Select BOQ Version`} // Dynamic placeholder
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* <BulkAction /> */}

            </CollapsibleCard>
            <BOQListTable boqList={boqList} />
          </div>

          <CopyBudgetModal show={show} handleClose={handleClose} />
        </div>
      </div>

      {/* copy modal */}
      {/* <Modal
        size="m"
        show={copyModal}
        onHide={closeCopyModal}
        centered
        className="modal fade"
      >
        <Modal.Header closeButton>
          <h5>Copy</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>From</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                >
                  <option selected="selected">Select</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>To</label>
                <select
                  className="form-control form-select"
                  style={{ width: "100%" }}
                >
                  <option selected="selected">Select</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button
                className="purple-btn2 w-100"
                onClick={closeCopyModal}
                fdprocessedid="u33pye"
              >
                Copy
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* copy modal end */}
    </>
  );
};

export default BOQList;
