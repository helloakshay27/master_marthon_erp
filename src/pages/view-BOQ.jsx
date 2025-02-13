import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import CopyBudgetModal from "../components/common/Modal/CopyBudgetModal";
import BOQListTable from "../components/BOQListTabe";
// import { Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { BulkAction } from "../components";
import axios from "axios";
import { Link } from 'react-router-dom'



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
    axios
      .get(`https://marathon.lockated.com/boq_details.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
      .then((response) => {
        setBoqList(response.data); // Set the data in state

      })
      .catch((error) => {
        console.log('error', error)

      });

  }, []); // Empty dependency array ensures it runs only once when the component mounts

  console.log('boq list', boqList)


  // Handle Go button click
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const handleGoClick = () => {
    // if (!selectedProject || !selectedSite || !selectedWing) {
    //   alert("Please select Project, Site, and Wing");
    //   return;
    // }
    let validationErrors = {};
    // Validate required fields
    if (!selectedProject) validationErrors.project = 'Project is required.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // setLoading(true);

      const projectId = selectedProject ? selectedProject.value : "";
      const siteId = selectedSite ? selectedSite.value : "";
      const wingId = selectedWing ? selectedWing.value : "";

      setLoading(true); // Set loading to true before making the request

      axios
        .get(
          `https://marathon.lockated.com/boq_details.json?project_id=${projectId}&site_id=${siteId}&wing_id=${wingId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          setBoqList(response.data); // Set the fetched data to state
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when request completes
        });

    }
  };

  // boq list table 
  const [openProjectId, setOpenProjectId] = useState(null);
  const [openSubProjectId, setOpenSubProjectId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null); // Track which category is open
  const [openSubCategory2Id, setOpenSubCategory2Id] = useState(null); // Track sub-category 2 visibility
  const [openSubCategory3Id, setOpenSubCategory3Id] = useState(null); // Track sub-category 3 visibility
  const [openSubCategory4Id, setOpenSubCategory4Id] = useState(null); // Track sub-category 3 visibility
  const [openSubCategory5Id, setOpenSubCategory5Id] = useState(null); // Track sub-category 3 visibility

  const [openBoqDetailId, setOpenBoqDetailId] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId1, setOpenBoqDetailId1] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId2, setOpenBoqDetailId2] = useState(null); // Track BOQ details visibility
  const [openBoqDetailId3, setOpenBoqDetailId3] = useState(null); // Track BOQ details visibility


  // Toggle project visibility
  const toggleProject = (id) => {
    if (openProjectId === id) {
      setOpenProjectId(null);  // Close the project if it's already open
    } else {
      setOpenProjectId(id);  // Open the selected project
    }
  };

  // Toggle sub-project visibility
  const toggleSubProject = (id) => {
    if (openSubProjectId === id) {
      setOpenSubProjectId(null);  // Close the sub-project if it's already open
    } else {
      setOpenSubProjectId(id);  // Open the selected sub-project
    }
  };

  // Toggle category visibility
  const toggleCategory = (id) => {
    if (openCategoryId === id) {
      setOpenCategoryId(null);  // Close the category if it's already open
    } else {
      setOpenCategoryId(id);  // Open the selected category
    }
  };

  // Toggle sub-category 2 visibility
  const toggleSubCategory2 = (id) => {


    if (openSubCategory2Id === id) {
      setOpenSubCategory2Id(null);  // Close the category if it's already open
    } else {
      setOpenSubCategory2Id(id);  // Open the selected category
    }
  };


  // Toggle BOQ details visibility
  const toggleBoqDetail = (id) => {

    if (openBoqDetailId === id) {
      setOpenBoqDetailId(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 1 visibility
  const toggleBoqDetail1 = (id) => {

    if (openBoqDetailId1 === id) {
      setOpenBoqDetailId1(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId1(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 2 visibility
  const toggleBoqDetail2 = (id) => {

    if (openBoqDetailId2 === id) {
      setOpenBoqDetailId2(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId2(id);  // Open the selected category
    }
  };

  // Toggle BOQ details 3 visibility
  const toggleBoqDetail3 = (id) => {

    if (openBoqDetailId3 === id) {
      setOpenBoqDetailId3(null);  // Close the category if it's already open
    } else {
      setOpenBoqDetailId3(id);  // Open the selected category
    }
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory3 = (id) => {
    setOpenSubCategory3Id(openSubCategory3Id === id ? null : id);
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory4 = (id) => {
    setOpenSubCategory4Id(openSubCategory4Id === id ? null : id);
  };

  // Toggle sub-category 3 visibility
  const toggleSubCategory5 = (id) => {
    setOpenSubCategory5Id(openSubCategory5Id === id ? null : id);
  };
  const handleClickCollapse = () => {
    setOpenProjectId(null);
    setOpenSubProjectId(null);
    setOpenCategoryId(null);
    setOpenSubCategory2Id(null);
    openSubCategory3Id(null); // Track sub-category 3 visibility
    openSubCategory4Id(null); // Track sub-category 3 visibility
    openSubCategory5Id(null)
    openBoqDetailId(null); // Track BOQ details visibility
    openBoqDetailId1(null); // Track BOQ details visibility
    openBoqDetailId2(null); // Track BOQ details visibility
    openBoqDetailId3(null)

  }

  //bulk action 
  const [fromStatus, setFromStatus] = useState("");
  const [toStatus, setToStatus] = useState("");
  const [remark, setRemark] = useState("");
  // const [boqList, setBoqList] = useState([]);
  // const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleStatusChange = (selectedOption) => {
    // const { name, value } = e.target;
    // if (name === "fromStatus") {
    //   setFromStatus(selectedOption.value);
    // } else if (name === "toStatus") {
    //   setToStatus(selectedOption.value);
    // }

    setFromStatus(selectedOption.value);
  };

  // Handle status change for 'To Status'
  const handleToStatusChange = (selectedOption) => {
    setToStatus(selectedOption.value);
  };


  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };


  // Handle form submission
  const handleSubmit = () => {
    // e.preventDefault();

    if (!fromStatus || !toStatus) {
      alert("Please select both 'From Status' and 'To Status'.");
      return;
    }

    // Prepare data to send
    const data = {
      boq_detail_ids: selectedBoqDetails,
      from_status: fromStatus,
      to_status: toStatus,
      comments: remark,
    };
    console.log("data for bulk action", data)

    // Send data to API using axios
    axios
      .patch(
        `https://marathon.lockated.com/boq_details/update_bulk_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        data
      )
      .then((response) => {
        console.log('Success:', response.data);
        alert('Status updated successfully ....')
        // Handle success (e.g., show a success message, update UI, etc.)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show an error message)
      });
  };



  // Fetch the data when 'fromStatus' changes
  useEffect(() => {
    if (fromStatus) { // Only fetch data if a status is selected
      setLoading(true); // Show loading state while fetching
      axios
        .get(
          `https://marathon.lockated.com/boq_details.json?q[status_eq]=${fromStatus}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          setBoqList(response.data); // Set the fetched data to state
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when request is complete
        });
    }
  }, [fromStatus]);  // This will run every time 'fromStatus' changes




  const [selectedBoqDetails, setSelectedBoqDetails] = useState([]); // State to track selected boq detail IDs

  // Function to toggle the checkbox selection
  const handleCheckboxChange = (boqDetailId) => {
    setSelectedBoqDetails((prevSelected) => {
      if (prevSelected.includes(boqDetailId)) {
        // If already selected, remove it from the array
        return prevSelected.filter((id) => id !== boqDetailId);
      } else {
        // If not selected, add it to the array
        return [...prevSelected, boqDetailId];
      }
    });
  };

  console.log("selected boq id array :", selectedBoqDetails)


  //bulkaction options 
  const options = [
    {
      label: 'Select Status',
      value: '',
    },
    {
      label: 'Draft',
      value: 'draft',
    },
    {
      label: 'Submitted',
      value: 'submitted',
    },
    {
      label: 'Approved',
      value: 'approved',
    },
  ];



  return (
    <>
      <div className="website-content">
        <div className="module-data-section p-4">
          <a href="" style={{ color: 'black' }}>Home &gt; Engineering  &gt; BOQ List</a>
          {/* <h5 className="mt-4">BOQ</h5> */}
          <div className="d-flex justify-content-end mt-4">
            {/* <button className="purple-btn2" onClick={handleClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="white"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span> Create BOQ</span>
            </button> */}
            {/* <button className="purple-btn2">Import</button>
            <button className="purple-btn2">Export</button>
            <button className="purple-btn2">Delete</button> */}
            {/* <button
              className="purple-btn2"
              // data-bs-toggle="modal"
              // data-bs-target="#copyModal"
              // onClick={openCopyModal}
              onClick={handleShow}
            >
              Copy
            </button> */}
          </div>
          {/* <div className="tab-content1 active" id="total-content"> */}
          {/* Total Content Here */}


          <div className="card mt-2 There is no selected portion. The entire code file is provided. If you could specify the portion of the code you would like me to improve, I can help you with that.mb-5 ">
            <CollapsibleCard title="Quick Filter" isInitiallyCollapsed={true}>
              <div className="card-body mt-0 pt-0">
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Project <span>*</span></label>
                      <SingleSelector
                        options={projectOptions}
                        onChange={handleProjectChange}
                        value={selectedProject}
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                      {errors.project && (
                        <div className="error-message">{errors.project}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
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
                  <div className="col-md-3">
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
                  <div className="col-md-3">
                    <button type="" className="purple-btn2 mt-4" onClick={handleGoClick}>
                      Go
                    </button>
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

            <CollapsibleCard title="Bulk Action" isInitiallyCollapsed={true}>
              <form
                onSubmit={handleSubmit}
              >
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>From Status</label>
                      {/* <select
                        name="fromStatus"
                        className="form-control form-select"
                         classNamePrefix="react-select"
                        value={fromStatus}
                        onChange={handleStatusChange}
                      // value={formValues.fromStatus}
                      // onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select> */}
                      {/* {errors.fromStatus && <div className="text-danger mt-2">{errors.fromStatus}</div>} */}

                      <SingleSelector
                        options={options}
                        value={options.value}
                        onChange={handleStatusChange}
                        // onChange={handleStatusChange}
                        // options.find(option => option.value === status)
                        // value={filteredOptions.find(option => option.value === status)}
                        // value={options.find(option => option.value === status)}
                        // value={selectedSite}
                        placeholder={`Select Status`} // Dynamic placeholder
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>To Status</label>
                      {/* <select
                        name="toStatus"
                        className="form-control form-select"
                        value={toStatus}
                        onChange={handleToStatusChange}
                      >
                        <option value="">Select Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select> */}

                      <SingleSelector
                        options={options}
                        value={options.value}
                        onChange={handleToStatusChange}
                        // onChange={handleStatusChange}
                        // options.find(option => option.value === status)
                        // value={filteredOptions.find(option => option.value === status)}
                        // value={options.find(option => option.value === status)}
                        // value={selectedSite}
                        placeholder={`Select Status`} // Dynamic placeholder
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        name="remark"
                        className="form-control"
                        rows={4}
                        placeholder="Enter ..."
                        value={remark}
                        onChange={handleRemarkChange}
                      />
                    </div>
                  </div>
                  <div className="offset-md-1 col-md-2">
                    <button type="submit" className="purple-btn2 m-0">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </CollapsibleCard>

            {/* <BOQListTable boqList={boqList} setBoqList={setBoqList} /> */}

            {/* boq list table is here  start */}
            <div className="d-flex justify-content-end me-2">
              <button className="purple-btn2" onClick={handleClickCollapse}>Reset</button>
              <a herf="/create-BOQ">
              <button className="purple-btn2" >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="white"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span> Create BOQ</span>
            </button>
            </a>
              <button className="purple-btn2" onClick={handleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
                <span> Create BOQ</span>
              </button>
            </div>
            <div className="mx-3">
              <div className="tbl-container mt-1">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th className="text-start"> <input className="ms-1 me-1 mb-1" type="checkbox" /></th>
                      <th className="text-start">Expand</th>
                      <th className="text-start">Project/Sub-Project</th>
                      <th className="text-start">BOQ ID</th>
                      <th className="text-start">Unit</th>
                      <th className="text-start">Cost Qty</th>
                      <th className="text-start">Cost Rate</th>
                      <th className="text-start">Cost Value</th>
                      <th>
                        <div className="d-flex justify-content-center">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={14}
                            height={14}
                            fill="currentColor"
                            style={{ marginTop: 3 }}
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg> */}
                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                          <p>Status</p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {boqList && boqList.projects && boqList.projects.map((project, index) => (
                      <React.Fragment key={project.id}>

                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                          </td>
                          <td>
                            <button
                              className="btn btn-link p-0"
                              // onClick={handleSubProject}
                              onClick={() => toggleProject(project.id)}
                              aria-label="Toggle row visibility"
                            >
                              {openProjectId === project.id ?
                                (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill=" #e0e0e0"
                                    stroke="black"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    {/* Square */}
                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                    {/* Minus Icon */}
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill=" #e0e0e0"
                                    stroke="black"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    {/* Square */}
                                    <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                    {/* Plus Icon */}
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                  </svg>
                                )
                              }
                            </button>
                          </td>
                          <td className="text-start">{project.name}</td>
                          <td className="text-start"></td>
                          <td className="text-start"></td>
                          <td className="text-start"></td>
                          <td className="text-start"></td>
                          <td className="text-start"></td>
                          <td className="text-start">
                            <div className="d-flex justify-content-center">
                              {/* <input className="pe-2" type="checkbox" /> */}
                              <img
                                data-bs-toggle="modal"
                                data-bs-target="#addnewModal"
                                className="pe-1"
                                src="../Data_Mapping/img/Edit.svg"
                                alt=""
                              />
                              <img
                                className="pe-1"
                                src="../Data_Mapping/img/Delete_red.svg"
                                alt=""
                              />

                            </div>
                          </td>
                        </tr>
                        {/* subProject  start */}

                        {openProjectId === project.id && project.sub_projects && project.sub_projects.map((subProject) => (
                          <React.Fragment key={subProject.id}>
                            <tr>
                              <td></td>
                              <td>
                                {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                              </td>

                              <td>
                                <button
                                  className="btn btn-link p-0"

                                  onClick={() => toggleSubProject(subProject.id)}
                                  aria-label="Toggle row visibility"
                                >
                                  {openSubProjectId === subProject.id ?
                                    (

                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill=" #e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Circle */}
                                        {/* <circle cx="12" cy="12" r="9" /> */}
                                        {/* Minus Icon (for when toggled) */}
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                      </svg>
                                      //   <svg
                                      //   xmlns="http://www.w3.org/2000/svg"
                                      //   width="16"
                                      //   height="16"
                                      //   fill="black"
                                      //   className="bi bi-caret-up"
                                      //   viewBox="0 0 16 16"
                                      // >
                                      //   <path d="M3.204 9h9.592L8 4.48 3.204 9z" />

                                      // </svg>
                                    ) : (

                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill=" #e0e0e0" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        {/* Square */}
                                        <rect x="3" y="3" width="18" height="20" rx="1" ry="1" />
                                        {/* Circle */}
                                        {/* <circle cx="12" cy="12" r="9" /> */}
                                        {/* Plus Icon */}
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                      </svg>

                                      //   <svg
                                      //   xmlns="http://www.w3.org/2000/svg"
                                      //   width="16"
                                      //   height="16"
                                      //   fill="black"
                                      //   className="bi bi-caret-up"
                                      //   viewBox="0 0 16 16"
                                      // >
                                      //   <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                      // </svg>
                                    )
                                  }
                                </button>
                              </td>
                              <td className="text-start">{subProject.name}</td>
                              <td className="text-start"></td>
                              <td className="text-start"></td>
                              <td className="text-start"></td>
                              <td className="text-start"></td>
                              <td className="text-start"></td>
                              <td className="text-start">
                                <div className="d-flex justify-content-center">
                                  {/* <input className="pe-2" type="checkbox" /> */}
                                  <img
                                    data-bs-toggle="modal"
                                    data-bs-target="#addnewModal"
                                    className="pe-1"
                                    src="../Data_Mapping/img/Edit.svg"
                                    alt=""
                                  />
                                  <img
                                    className="pe-1"
                                    src="../Data_Mapping/img/Delete_red.svg"
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td></td>

                            </tr>

                            {/* Conditional rendering for categories under sub-project start */}
                            {openSubProjectId === subProject.id && subProject.categories && subProject.categories.length > 0 && (
                              subProject.categories.map((category) => (
                                <React.Fragment key={category.id}>
                                  <tr>
                                    <td></td>
                                    <td>
                                      {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                    </td>
                                    <td></td>

                                    <td>
                                      <button
                                        className="btn btn-link p-0"
                                        onClick={() => toggleCategory(category.id)}
                                        aria-label="Toggle category visibility"
                                      >
                                        {openCategoryId === category.id ? (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="black"
                                            className="bi bi-caret-up"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M3.204 9h9.592L8 4.48 3.204 9z" />

                                          </svg>
                                        ) : (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="black"
                                            className="bi bi-caret-up"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                          </svg>
                                        )}
                                      </button>
                                      {category.name}
                                    </td>

                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start">
                                      <div className="d-flex justify-content-center">
                                        {/* <input className="pe-2" type="checkbox" /> */}
                                        <img
                                          data-bs-toggle="modal"
                                          data-bs-target="#addnewModal"
                                          className="pe-1"
                                          src="../Data_Mapping/img/Edit.svg"
                                          alt=""
                                        />
                                        <img
                                          className="pe-1"
                                          src="../Data_Mapping/img/Delete_red.svg"
                                          alt=""
                                        />
                                      </div>
                                    </td>
                                  </tr>

                                  {/* sub level 2 start */}
                                  {openCategoryId === category.id && category.sub_categories_2 && category.sub_categories_2.length > 0 && (
                                    category.sub_categories_2.map((subCategory) => (
                                      <React.Fragment key={subCategory.id}>
                                        <tr>
                                          <td></td>
                                          <td>
                                            {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                          </td>
                                          <td></td>

                                          <td style={{ paddingLeft: '40px' }}>
                                            <button
                                              className="btn btn-link p-0"
                                              onClick={() => toggleSubCategory2(subCategory.id)}
                                              aria-label="Toggle sub-category 2 visibility"
                                            >
                                              {openSubCategory2Id === subCategory.id ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                  <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                </svg>
                                              ) : (
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="black"
                                                  className="bi bi-caret-up"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                </svg>
                                              )}
                                            </button>
                                            {subCategory.name}
                                          </td>

                                          <td className="text-start"></td>
                                          <td className="text-start"></td>
                                          <td className="text-start"></td>
                                          <td className="text-start"></td>
                                          <td className="text-start"></td>
                                          <td className="text-start">
                                            <div className="d-flex justify-content-center">
                                              {/* <input className="pe-2" type="checkbox" /> */}
                                              <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                              <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                            </div>
                                          </td>
                                        </tr>


                                        {openSubCategory2Id === subCategory.id && subCategory.boq_details && subCategory.boq_details.length > 0 && (
                                          subCategory.boq_details.map((boqDetail2) => (
                                            <React.Fragment key={boqDetail2.id}>
                                              <tr>
                                                <td></td>
                                                <td>
                                                  {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                  <input
                                                    className="ms-1 me-1 mb-1"
                                                    type="checkbox"
                                                    checked={selectedBoqDetails.includes(boqDetail2.id)} // Check if this ID is selected
                                                    onChange={() => handleCheckboxChange(boqDetail2.id)} // Handle checkbox change
                                                  />
                                                </td>
                                                <td></td>

                                                <td style={{ paddingLeft: '80px' }}>
                                                  <button
                                                    className="btn btn-link p-0"
                                                    onClick={() => toggleBoqDetail(boqDetail2.id)}
                                                    aria-label="Toggle BOQ detail visibility"
                                                  >
                                                    {openBoqDetailId === boqDetail2.id ? (
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                        <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                      </svg>
                                                    ) : (
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="black"
                                                        className="bi bi-caret-up"
                                                        viewBox="0 0 16 16"
                                                      >
                                                        <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                      </svg>
                                                    )}
                                                  </button>
                                                  {boqDetail2.item_name}
                                                </td>

                                                <td className="text-start">

                                                  <Link to={`/boq-details-page-master/${boqDetail2.id}`}>
                                                    <span style={{ color: ' #8b0203', textDecoration: 'underline' }}> {boqDetail2.id}</span>
                                                  </Link>
                                                </td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start">
                                                  <div className="d-flex justify-content-center">
                                                    {/* <input className="pe-2" type="checkbox" /> */}
                                                    <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                    <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                    {boqDetail2.status}
                                                  </div>
                                                </td>
                                              </tr>

                                              {/* Render Materials Table for BOQ Detail in Sub-Category  */}
                                              {openBoqDetailId === boqDetail2.id && (boqDetail2?.materials || boqDetail2?.boq_sub_items?.materials) && (
                                                <React.Fragment>
                                                  <tr>
                                                    <td colSpan={13}>
                                                      <div>
                                                        <CollapsibleCard title="Material Type">
                                                          <div className="card-body mt-0 pt-0">
                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                              <table className="w-100">
                                                                <thead>
                                                                  <tr>
                                                                    <th rowSpan={2}>Material Type</th>
                                                                    <th rowSpan={2}>Material</th>
                                                                    <th rowSpan={2}>Material Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour</th>
                                                                    <th rowSpan={2}>Brand</th>
                                                                    <th rowSpan={2}>UOM</th>
                                                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                    <th colSpan={3}>Cost</th>
                                                                    <th rowSpan={2}>Wastage</th>
                                                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                  </tr>
                                                                  <tr>
                                                                    <th>Co-Efficient Factor</th>
                                                                    <th colSpan={2}>Estimated Qty</th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {boqDetail2?.materials?.map((material) => (

                                                                    <tr key={material.id}>
                                                                      <td>{material.material_type}</td>
                                                                      <td>{material.material_name}</td>
                                                                      <td>{material.material_sub_type}</td>
                                                                      <td>{material.generic_info}</td>
                                                                      <td>{material.color}</td>
                                                                      <td>{material.brand}</td>
                                                                      <td>{material.uom}</td>
                                                                      {/* <td>{material.generic_info}</td> */}
                                                                      <td>{material.co_efficient_factor}</td>
                                                                      <td colSpan={2}>{material.estimated_quantity}</td>
                                                                      <td>{material.wastage}</td>
                                                                      <td>{material.estimated_quantity_wastage}</td>
                                                                    </tr>
                                                                  ))}


                                                                  {
                                                                    boqDetail2?.boq_sub_items?.map((boqSubItem) => (
                                                                      boqSubItem?.materials?.map((material) => (
                                                                        <tr key={material.id}>
                                                                          <td>{material.material_type}</td>
                                                                          <td>{material.material_name}</td>
                                                                          <td>{material.material_sub_type}</td>
                                                                          <td>{material.generic_info}</td>
                                                                          <td>{material.color}</td>
                                                                          <td>{material.brand}</td>
                                                                          <td>{material.uom}</td>
                                                                          <td>{material.co_efficient_factor}</td>
                                                                          <td colSpan={2}>{material.estimated_quantity}</td>
                                                                          <td>{material.wastage}</td>
                                                                          <td>{material.estimated_quantity_wastage}</td>
                                                                        </tr>
                                                                      ))
                                                                    ))
                                                                  }
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </CollapsibleCard>


                                                        <CollapsibleCard title="Asset Type">
                                                          <div className="card-body mt-0 pt-0">
                                                            <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                              <table className="w-100">
                                                                <thead>
                                                                  <tr>
                                                                    <th rowSpan={2}>Asset Type</th>
                                                                    <th rowSpan={2}>Asset</th>
                                                                    <th rowSpan={2}>Asset Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour</th>
                                                                    <th rowSpan={2}>Brand</th>
                                                                    <th rowSpan={2}>UOM</th>
                                                                    {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                    <th colSpan={3}>Cost</th>
                                                                    <th rowSpan={2}>Wastage</th>
                                                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                  </tr>
                                                                  <tr>
                                                                    <th>Co-Efficient Factor</th>
                                                                    <th colSpan={2}>Estimated Qty</th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {boqDetail2.assets.map((asset) => (
                                                                    <tr key={asset.id}>
                                                                      <td>{asset.asset_type}</td>
                                                                      <td>{asset.asset_name}</td>
                                                                      <td>{asset.asset_sub_type}</td>
                                                                      <td>{asset.generic_info}</td>
                                                                      <td>{asset.color}</td>
                                                                      <td>{asset.brand}</td>
                                                                      <td>{asset.uom}</td>
                                                                      {/* <td>{asset.asset_quantity}</td> */}
                                                                      <td>{asset.co_efficient_factor}</td>
                                                                      <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                      <td>{asset.wastage}</td>
                                                                      <td>{asset.estimated_quantity_wastage}</td>
                                                                    </tr>
                                                                  ))}

                                                                  {
                                                                    boqDetail2?.boq_sub_items?.map((boqSubItem) => (
                                                                      boqSubItem?.assets?.map((asset) => (


                                                                        <tr key={asset.id}>
                                                                          <td>{asset.asset_type}</td>
                                                                          <td>{asset.asset_name}</td>
                                                                          <td>{asset.asset_sub_type}</td>
                                                                          <td>{asset.generic_info}</td>
                                                                          <td>{asset.color}</td>
                                                                          <td>{asset.brand}</td>
                                                                          <td>{asset.uom}</td>
                                                                          {/* <td>{asset.asset_quantity}</td> */}
                                                                          <td>{asset.co_efficient_factor}</td>
                                                                          <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                          <td>{asset.wastage}</td>
                                                                          <td>{asset.estimated_quantity_wastage}</td>
                                                                        </tr>
                                                                      ))
                                                                    ))
                                                                  }
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </CollapsibleCard>

                                                      </div>
                                                    </td>
                                                  </tr>
                                                </React.Fragment>
                                              )}

                                            </React.Fragment>
                                          ))
                                        )}


                                        {/* ................. */}


                                        {/* Render Sub-Category 3 for each Sub-Category 2 */}
                                        {openSubCategory2Id === subCategory.id && subCategory.sub_categories_3 && subCategory.sub_categories_3.length > 0 && (
                                          subCategory.sub_categories_3.map((subCategory3) => (
                                            <React.Fragment key={subCategory3.id}>
                                              <tr>
                                                <td></td>
                                                <td>
                                                  {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                </td>
                                                <td></td>
                                                <td style={{ paddingLeft: '60px' }}>
                                                  <button
                                                    className="btn btn-link p-0"
                                                    onClick={() => toggleSubCategory3(subCategory3.id)}
                                                    aria-label="Toggle sub-category 3 visibility"
                                                  >
                                                    {openSubCategory3Id === subCategory3.id ? (
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                        <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                      </svg>
                                                    ) : (
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                        <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                      </svg>
                                                    )}
                                                  </button>
                                                  {subCategory3.name}
                                                </td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start"></td>
                                                <td className="text-start">
                                                  <div className="d-flex justify-content-center">
                                                    {/* <input className="pe-2" type="checkbox" /> */}
                                                    <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                    <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                  </div>
                                                </td>
                                              </tr>

                                              {/* Render BOQ Details for Sub-Category 3 */}
                                              {openSubCategory3Id === subCategory3.id && subCategory3.boq_details && subCategory3.boq_details.length > 0 && (
                                                subCategory3.boq_details.map((boqDetail3) => (
                                                  <React.Fragment key={boqDetail3.id}>
                                                    <tr>
                                                      <td></td>
                                                      <td>
                                                        {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                        <input
                                                          className="ms-1 me-1 mb-1"
                                                          type="checkbox"
                                                          checked={selectedBoqDetails.includes(boqDetail3.id)} // Check if this ID is selected
                                                          onChange={() => handleCheckboxChange(boqDetail3.id)} // Handle checkbox change
                                                        />
                                                      </td>
                                                      <td></td>
                                                      <td style={{ paddingLeft: '80px' }}>
                                                        <button
                                                          className="btn btn-link p-0"
                                                          onClick={() => toggleBoqDetail1(boqDetail3.id)}
                                                          aria-label="Toggle BOQ detail visibility"
                                                        >
                                                          {openBoqDetailId1 === boqDetail3.id ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                              <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                            </svg>
                                                          ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                              <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                            </svg>
                                                          )}
                                                        </button>
                                                        {boqDetail3.item_name}
                                                      </td>
                                                      <td className="text-start" >
                                                        <Link to={`/boq-details-page-master/${boqDetail3.id}`}>
                                                          <span style={{ color: ' #8b0203', textDecoration: 'underline' }}>{boqDetail3.id}</span>
                                                        </Link>
                                                      </td>
                                                      <td className="text-start"></td>
                                                      <td className="text-start"></td>
                                                      <td className="text-start"></td>
                                                      <td className="text-start"></td>
                                                      <td className="text-start">
                                                        <div className="d-flex justify-content-center">
                                                          {/* <input className="pe-2" type="checkbox" /> */}
                                                          <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                          <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                          {boqDetail3.status}
                                                        </div>
                                                      </td>
                                                    </tr>

                                                    {/* Render Materials Table for BOQ Detail in Sub-Category 3 */}
                                                    {openBoqDetailId1 === boqDetail3.id && (boqDetail3.materials || boqDetail3?.boq_sub_items?.materials) && (
                                                      <React.Fragment>
                                                        <tr>
                                                          <td colSpan={13}>
                                                            <div>
                                                              <CollapsibleCard title="Material Type">
                                                                <div className="card-body mt-0 pt-0">
                                                                  <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                    <table className="w-100">
                                                                      <thead>
                                                                        <tr>
                                                                          <th rowSpan={2}>Material Type</th>
                                                                          <th rowSpan={2}>Material</th>
                                                                          <th rowSpan={2}>Material Sub-Type</th>
                                                                          <th rowSpan={2}>Generic Specification</th>
                                                                          <th rowSpan={2}>Colour</th>
                                                                          <th rowSpan={2}>Brand</th>
                                                                          <th rowSpan={2}>UOM</th>
                                                                          {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                          <th colSpan={3}>Cost</th>
                                                                          <th rowSpan={2}>Wastage</th>
                                                                          <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                        </tr>
                                                                        <tr>
                                                                          <th>Co-Efficient Factor</th>
                                                                          <th colSpan={2}>Estimated Qty</th>
                                                                        </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                        {boqDetail3.materials.map((material) => (
                                                                          <tr key={material.id}>
                                                                            <td>{material.material_type}</td>
                                                                            <td>{material.material_name}</td>
                                                                            <td>{material.material_sub_type}</td>
                                                                            <td>{material.generic_info}</td>
                                                                            <td>{material.color}</td>
                                                                            <td>{material.brand}</td>
                                                                            <td>{material.uom}</td>
                                                                            {/* <td>{material.generic_info}</td> */}
                                                                            <td>{material.co_efficient_factor}</td>
                                                                            <td colSpan={2}>{material.estimated_quantity}</td>
                                                                            <td>{material.wastage}</td>
                                                                            <td>{material.estimated_quantity_wastage}</td>
                                                                          </tr>
                                                                        ))}
                                                                        {
                                                                          boqDetail3?.boq_sub_items?.map((boqSubItem) => (
                                                                            boqSubItem?.materials?.map((material) => (
                                                                              <tr key={material.id}>
                                                                                <td>{material.material_type}</td>
                                                                                <td>{material.material_name}</td>
                                                                                <td>{material.material_sub_type}</td>
                                                                                <td>{material.generic_info}</td>
                                                                                <td>{material.color}</td>
                                                                                <td>{material.brand}</td>
                                                                                <td>{material.uom}</td>
                                                                                <td>{material.co_efficient_factor}</td>
                                                                                <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                <td>{material.wastage}</td>
                                                                                <td>{material.estimated_quantity_wastage}</td>
                                                                              </tr>
                                                                            ))
                                                                          ))
                                                                        }
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                                                </div>
                                                              </CollapsibleCard>

                                                              <CollapsibleCard title="Asset Type">
                                                                <div className="card-body mt-0 pt-0">
                                                                  <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                    <table className="w-100">
                                                                      <thead>
                                                                        <tr>
                                                                          <th rowSpan={2}>Asset Type</th>
                                                                          <th rowSpan={2}>Asset</th>
                                                                          <th rowSpan={2}>Asset Sub-Type</th>

                                                                          <th rowSpan={2}>Generic Specification</th>
                                                                          <th rowSpan={2}>Colour</th>
                                                                          <th rowSpan={2}>Brand</th>
                                                                          <th rowSpan={2}>UOM</th>
                                                                          {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                          <th colSpan={3}>Cost</th>
                                                                          <th rowSpan={2}>Wastage</th>
                                                                          <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                        </tr>
                                                                        <tr>
                                                                          <th>Co-Efficient Factor</th>
                                                                          <th colSpan={2}>Estimated Qty</th>
                                                                        </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                        {boqDetail3.assets.map((asset) => (
                                                                          <tr key={asset.id}>
                                                                            <td>{asset.asset_type}</td>
                                                                            <td>{asset.asset_name}</td>
                                                                            <td>{asset.asset_sub_type}</td>
                                                                            <td>{asset.asset_specification}</td>
                                                                            <td>{asset.color}</td>
                                                                            <td>{asset.brand}</td>
                                                                            <td>{asset.uom}</td>
                                                                            {/* <td>{asset.asset_quantity}</td> */}
                                                                            <td>{asset.co_efficient_factor}</td>
                                                                            <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                            <td>{asset.wastage}</td>
                                                                            <td>{asset.estimated_quantity_wastage}</td>
                                                                          </tr>
                                                                        ))}

                                                                        {
                                                                          boqDetail3?.boq_sub_items?.map((boqSubItem) => (
                                                                            boqSubItem?.assets?.map((asset) => (


                                                                              <tr key={asset.id}>
                                                                                <td>{asset.asset_type}</td>
                                                                                <td>{asset.asset_name}</td>
                                                                                <td>{asset.asset_sub_type}</td>
                                                                                <td>{asset.generic_info}</td>
                                                                                <td>{asset.color}</td>
                                                                                <td>{asset.brand}</td>
                                                                                <td>{asset.uom}</td>
                                                                                {/* <td>{asset.asset_quantity}</td> */}
                                                                                <td>{asset.co_efficient_factor}</td>
                                                                                <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                <td>{asset.wastage}</td>
                                                                                <td>{asset.estimated_quantity_wastage}</td>
                                                                              </tr>
                                                                            ))
                                                                          ))
                                                                        }
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                                                </div>
                                                              </CollapsibleCard>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </React.Fragment>
                                                    )}




                                                    {/* Render Level 4 for each BOQ level 3 */}
                                                    {openSubCategory3Id === subCategory3.id && subCategory3.sub_categories_4 && subCategory3.sub_categories_4.length > 0 && (
                                                      subCategory3.sub_categories_4.map((subCategory4) => (
                                                        <React.Fragment key={subCategory4.id}>
                                                          <tr>
                                                            <td></td>
                                                            <td>
                                                              {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                            </td>
                                                            <td></td>
                                                            <td style={{ paddingLeft: '100px' }}>
                                                              <button
                                                                className="btn btn-link p-0"
                                                                onClick={() => toggleSubCategory4(subCategory4.id)}
                                                                aria-label="Toggle sub-category 4 visibility"
                                                              >
                                                                {openSubCategory4Id === subCategory4.id ? (
                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                    <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                  </svg>
                                                                ) : (
                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                    <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                  </svg>
                                                                )}
                                                              </button>
                                                              {subCategory4.name}
                                                            </td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start">
                                                              <div className="d-flex justify-content-center">
                                                                {/* <input className="pe-2" type="checkbox" /> */}
                                                                <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                              </div>
                                                            </td>
                                                          </tr>

                                                          {/* Render BOQ Details for Sub-Category 4 */}
                                                          {openSubCategory4Id === subCategory4.id && subCategory4.boq_details && subCategory4.boq_details.length > 0 && (
                                                            subCategory4.boq_details.map((boqDetail4) => (
                                                              <React.Fragment key={boqDetail4.id}>
                                                                <tr>
                                                                  <td></td>
                                                                  <td>
                                                                    {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                    <input
                                                                      className="ms-1 me-1 mb-1"
                                                                      type="checkbox"
                                                                      checked={selectedBoqDetails.includes(boqDetail4.id)} // Check if this ID is selected
                                                                      onChange={() => handleCheckboxChange(boqDetail4.id)} // Handle checkbox change
                                                                    />
                                                                  </td>
                                                                  <td></td>
                                                                  <td style={{ paddingLeft: '120px' }}>
                                                                    <button
                                                                      className="btn btn-link p-0"
                                                                      onClick={() => toggleBoqDetail2(boqDetail4.id)}
                                                                      aria-label="Toggle BOQ detail visibility"
                                                                    >
                                                                      {openBoqDetailId2 === boqDetail4.id ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                          <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                        </svg>
                                                                      ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                          <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                        </svg>
                                                                      )}
                                                                    </button>
                                                                    {boqDetail4.item_name}
                                                                  </td>
                                                                  <td className="text-start">
                                                                    <Link to={`/boq-details-page-master/${boqDetail4.id}`}>
                                                                      <span style={{ color: ' #8b0203', textDecoration: 'underline' }}> {boqDetail4.id} </span>
                                                                    </Link>
                                                                  </td>
                                                                  <td className="text-start"></td>
                                                                  <td className="text-start"></td>
                                                                  <td className="text-start"></td>
                                                                  <td className="text-start"></td>
                                                                  <td className="text-start">
                                                                    <div className="d-flex justify-content-center">
                                                                      {/* <input className="pe-2" type="checkbox" /> */}
                                                                      <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                      <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                      {boqDetail4.status}
                                                                    </div>
                                                                  </td>
                                                                </tr>

                                                                {/* Render Materials Table for BOQ Detail in Sub-Category 4 */}
                                                                {openBoqDetailId2 === boqDetail4.id && (boqDetail4.materials || boqDetail4?.boq_sub_items?.materials) && (
                                                                  <React.Fragment>
                                                                    <tr>
                                                                      <td colSpan={12}>
                                                                        <div>
                                                                          <CollapsibleCard title="Material Type">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Material Type</th>
                                                                                      <th rowSpan={2}>Material</th>
                                                                                      <th rowSpan={2}>Material Sub-Type</th>
                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
                                                                                      {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                                      <th colSpan={3}>Cost</th>
                                                                                      <th rowSpan={2}>Wastage</th>
                                                                                      <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                    </tr>
                                                                                    <tr>
                                                                                      <th>Co-Efficient Factor</th>
                                                                                      <th colSpan={2}>Estimated Qty</th>
                                                                                    </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                    {boqDetail4.materials.map((material) => (
                                                                                      <tr key={material.id}>
                                                                                        <td>{material.material_type}</td>
                                                                                        <td>{material.material_name}</td>
                                                                                        <td>{material.material_sub_type}</td>
                                                                                        <td>{material.generic_info}</td>
                                                                                        <td>{material.color}</td>
                                                                                        <td>{material.brand}</td>
                                                                                        <td>{material.uom}</td>
                                                                                        {/* <td>{material.generic_info}</td> */}
                                                                                        <td>{material.co_efficient_factor}</td>
                                                                                        <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                        <td>{material.wastage}</td>
                                                                                        <td>{material.estimated_quantity_wastage}</td>
                                                                                      </tr>
                                                                                    ))}

                                                                                    {
                                                                                      boqDetail4?.boq_sub_items?.map((boqSubItem) => (
                                                                                        boqSubItem?.materials?.map((material) => (
                                                                                          <tr key={material.id}>
                                                                                            <td>{material.material_type}</td>
                                                                                            <td>{material.material_name}</td>
                                                                                            <td>{material.material_sub_type}</td>
                                                                                            <td>{material.generic_info}</td>
                                                                                            <td>{material.color}</td>
                                                                                            <td>{material.brand}</td>
                                                                                            <td>{material.uom}</td>
                                                                                            <td>{material.co_efficient_factor}</td>
                                                                                            <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                            <td>{material.wastage}</td>
                                                                                            <td>{material.estimated_quantity_wastage}</td>
                                                                                          </tr>
                                                                                        ))
                                                                                      ))
                                                                                    }
                                                                                  </tbody>
                                                                                </table>
                                                                              </div>
                                                                            </div>
                                                                          </CollapsibleCard>

                                                                          <CollapsibleCard title="Asset Type">
                                                                            <div className="card-body mt-0 pt-0">
                                                                              <div className="tbl-container mx-3 mt-1" style={{ height: "300px" }}>
                                                                                <table className="w-100">
                                                                                  <thead>
                                                                                    <tr>
                                                                                      <th rowSpan={2}>Asset Type</th>
                                                                                      <th rowSpan={2}>Asset</th>
                                                                                      <th rowSpan={2}>Asset Sub-Type</th>

                                                                                      <th rowSpan={2}>Generic Specification</th>
                                                                                      <th rowSpan={2}>Colour</th>
                                                                                      <th rowSpan={2}>Brand</th>
                                                                                      <th rowSpan={2}>UOM</th>
                                                                                      {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                                      <th colSpan={3}>Cost</th>
                                                                                      <th rowSpan={2}>Wastage</th>
                                                                                      <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                    </tr>
                                                                                    <tr>
                                                                                      <th>Co-Efficient Factor</th>
                                                                                      <th colSpan={2}>Estimated Qty</th>
                                                                                    </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                    {boqDetail4.assets.map((asset) => (
                                                                                      <tr key={asset.id}>
                                                                                        <td>{asset.asset_type}</td>
                                                                                        <td>{asset.asset_name}</td>
                                                                                        <td>{asset.asset_sub_type}</td>
                                                                                        <td>{asset.asset_specification}</td>
                                                                                        <td>{asset.color}</td>
                                                                                        <td>{asset.brand}</td>
                                                                                        <td>{asset.uom}</td>
                                                                                        {/* <td>{asset.asset_quantity}</td> */}
                                                                                        <td>{asset.co_efficient_factor}</td>
                                                                                        <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                        <td>{asset.wastage}</td>
                                                                                        <td>{asset.estimated_quantity_wastage}</td>
                                                                                      </tr>
                                                                                    ))}

                                                                                    {
                                                                                      boqDetail4?.boq_sub_items?.map((boqSubItem) => (
                                                                                        boqSubItem?.assets?.map((asset) => (


                                                                                          <tr key={asset.id}>
                                                                                            <td>{asset.asset_type}</td>
                                                                                            <td>{asset.asset_name}</td>
                                                                                            <td>{asset.asset_sub_type}</td>
                                                                                            <td>{asset.generic_info}</td>
                                                                                            <td>{asset.color}</td>
                                                                                            <td>{asset.brand}</td>
                                                                                            <td>{asset.uom}</td>
                                                                                            {/* <td>{asset.asset_quantity}</td> */}
                                                                                            <td>{asset.co_efficient_factor}</td>
                                                                                            <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                            <td>{asset.wastage}</td>
                                                                                            <td>{asset.estimated_quantity_wastage}</td>
                                                                                          </tr>
                                                                                        ))
                                                                                      ))
                                                                                    }
                                                                                  </tbody>
                                                                                </table>
                                                                              </div>
                                                                            </div>
                                                                          </CollapsibleCard>
                                                                        </div>
                                                                      </td>
                                                                    </tr>
                                                                  </React.Fragment>
                                                                )}

                                                                {/* Render Level 5 for each BOQ level 4 */}

                                                                {openSubCategory4Id === subCategory4.id && subCategory4.sub_categories_5 && subCategory4.sub_categories_5.length > 0 && (
                                                                  subCategory4.sub_categories_5.map((subCategory5) => (
                                                                    <React.Fragment key={subCategory5.id}>
                                                                      <tr>
                                                                        <td></td>
                                                                        <td>
                                                                          {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                        </td>
                                                                        <td></td>
                                                                        <td style={{ paddingLeft: '140px' }}>
                                                                          <button
                                                                            className="btn btn-link p-0"
                                                                            onClick={() => toggleSubCategory5(subCategory5.id)}
                                                                            aria-label="Toggle sub-category 5 visibility"
                                                                          >
                                                                            {openSubCategory5Id === subCategory5.id ? (
                                                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                              </svg>
                                                                            ) : (
                                                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                              </svg>
                                                                            )}
                                                                          </button>
                                                                          {subCategory5.name}
                                                                        </td>
                                                                        <td className="text-start"></td>
                                                                        <td className="text-start"></td>
                                                                        <td className="text-start"></td>
                                                                        <td className="text-start"></td>
                                                                        <td className="text-start"></td>
                                                                        <td className="text-start">
                                                                          <div className="d-flex justify-content-center">
                                                                            {/* <input className="pe-2" type="checkbox" /> */}
                                                                            <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                            <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                          </div>
                                                                        </td>
                                                                      </tr>

                                                                      {/* Render BOQ Details for Sub-Category 5 */}

                                                                      {openSubCategory5Id === subCategory5.id && subCategory5.boq_details && subCategory5.boq_details.length > 0 && (
                                                                        subCategory5.boq_details.map((boqDetail5) => (
                                                                          <React.Fragment key={boqDetail5.id}>
                                                                            <tr>
                                                                              <td></td>
                                                                              <td>
                                                                                {/* <input className="ms-1 me-1 mb-1" type="checkbox" /> */}
                                                                                <input
                                                                                  className="ms-1 me-1 mb-1"
                                                                                  type="checkbox"
                                                                                  checked={selectedBoqDetails.includes(boqDetail5.id)} // Check if this ID is selected
                                                                                  onChange={() => handleCheckboxChange(boqDetail5.id)} // Handle checkbox change
                                                                                />
                                                                              </td>
                                                                              <td></td>
                                                                              <td style={{ paddingLeft: '160px' }}>
                                                                                <button
                                                                                  className="btn btn-link p-0"
                                                                                  onClick={() => toggleBoqDetail3(boqDetail5.id)}
                                                                                  aria-label="Toggle BOQ detail visibility"
                                                                                >
                                                                                  {openBoqDetailId3 === boqDetail5.id ? (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                      <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                                    </svg>
                                                                                  ) : (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-caret-up" viewBox="0 0 16 16">
                                                                                      <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                                    </svg>
                                                                                  )}
                                                                                </button>
                                                                                {boqDetail5.item_name}
                                                                              </td>
                                                                              <td className="text-start">
                                                                                <Link to={`/boq-details-page-master/${boqDetail5.id}`}>
                                                                                  <span style={{ color: ' #8b0203', textDecoration: 'underline' }}> {boqDetail5.id}</span>
                                                                                </Link>
                                                                              </td>
                                                                              <td className="text-start"></td>
                                                                              <td className="text-start"></td>
                                                                              <td className="text-start"></td>
                                                                              <td className="text-start"></td>
                                                                              <td className="text-start">
                                                                                <div className="d-flex justify-content-center">
                                                                                  {/* <input className="pe-2" type="checkbox" /> */}
                                                                                  <img data-bs-toggle="modal" data-bs-target="#addnewModal" className="pe-1" src="../Data_Mapping/img/Edit.svg" alt="" />
                                                                                  <img className="pe-1" src="../Data_Mapping/img/Delete_red.svg" alt="" />
                                                                                  {boqDetail5.status}
                                                                                </div>
                                                                              </td>
                                                                            </tr>

                                                                            {/* Render Materials Table for BOQ Detail in Sub-Category 5 */}
                                                                            {openBoqDetailId3 === boqDetail5.id && (boqDetail5.materials || boqDetail5?.boq_sub_items?.materials) && (
                                                                              <React.Fragment>
                                                                                <tr>
                                                                                  <td colSpan={13}>
                                                                                    <div>
                                                                                      <CollapsibleCard title="Material Type">
                                                                                        <div className="card-body mt-0 pt-0">
                                                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                            <table className="w-100">
                                                                                              <thead>
                                                                                                <tr>
                                                                                                  <th rowSpan={2}>Material Type</th>
                                                                                                  <th rowSpan={2}>Material</th>
                                                                                                  <th rowSpan={2}>Material Sub-Type</th>
                                                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                                                  <th rowSpan={2}>Colour</th>
                                                                                                  <th rowSpan={2}>Brand</th>
                                                                                                  <th rowSpan={2}>UOM</th>
                                                                                                  {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                                                  <th colSpan={3}>Cost</th>
                                                                                                  <th rowSpan={2}>Wastage</th>
                                                                                                  <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                  <th>Co-Efficient Factor</th>
                                                                                                  <th colSpan={2}>Estimated Qty</th>
                                                                                                </tr>
                                                                                              </thead>
                                                                                              <tbody>
                                                                                                {boqDetail5.materials.map((material) => (
                                                                                                  <tr key={material.id}>
                                                                                                    <td>{material.material_type}</td>
                                                                                                    <td>{material.material_name}</td>
                                                                                                    <td>{material.material_sub_type}</td>
                                                                                                    <td>{material.generic_info}</td>
                                                                                                    <td>{material.color}</td>
                                                                                                    <td>{material.brand}</td>
                                                                                                    <td>{material.uom}</td>
                                                                                                    {/* <td>{material.generic_info}</td> */}
                                                                                                    <td>{material.co_efficient_factor}</td>
                                                                                                    <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                                    <td>{material.wastage}</td>
                                                                                                    <td>{material.estimated_quantity_wastage}</td>
                                                                                                  </tr>
                                                                                                ))}

                                                                                                {
                                                                                                  boqDetail5?.boq_sub_items?.map((boqSubItem) => (
                                                                                                    boqSubItem?.materials?.map((material) => (
                                                                                                      <tr key={material.id}>
                                                                                                        <td>{material.material_type}</td>
                                                                                                        <td>{material.material_name}</td>
                                                                                                        <td>{material.material_sub_type}</td>
                                                                                                        <td>{material.generic_info}</td>
                                                                                                        <td>{material.color}</td>
                                                                                                        <td>{material.brand}</td>
                                                                                                        <td>{material.uom}</td>
                                                                                                        <td>{material.co_efficient_factor}</td>
                                                                                                        <td colSpan={2}>{material.estimated_quantity}</td>
                                                                                                        <td>{material.wastage}</td>
                                                                                                        <td>{material.estimated_quantity_wastage}</td>
                                                                                                      </tr>
                                                                                                    ))
                                                                                                  ))
                                                                                                }
                                                                                              </tbody>
                                                                                            </table>
                                                                                          </div>
                                                                                        </div>
                                                                                      </CollapsibleCard>

                                                                                      <CollapsibleCard title="Asset Type">
                                                                                        <div className="card-body mt-0 pt-0">
                                                                                          <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                                                                                            <table className="w-100">
                                                                                              <thead>
                                                                                                <tr>
                                                                                                  <th rowSpan={2}>Asset Type</th>
                                                                                                  <th rowSpan={2}>Asset</th>
                                                                                                  <th rowSpan={2}>Asset Sub-Type</th>

                                                                                                  <th rowSpan={2}>Generic Specification</th>
                                                                                                  <th rowSpan={2}>Colour</th>
                                                                                                  <th rowSpan={2}>Brand</th>
                                                                                                  <th rowSpan={2}>UOM</th>
                                                                                                  {/* <th rowSpan={2}>Asset QTY</th> */}
                                                                                                  <th colSpan={3}>Cost</th>
                                                                                                  <th rowSpan={2}>Wastage</th>
                                                                                                  <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                  <th>Co-Efficient Factor</th>
                                                                                                  <th colSpan={2}>Estimated Qty</th>
                                                                                                </tr>
                                                                                              </thead>
                                                                                              <tbody>
                                                                                                {boqDetail5.assets.map((asset) => (
                                                                                                  <tr key={asset.id}>
                                                                                                    <td>{asset.asset_type}</td>
                                                                                                    <td>{asset.asset_name}</td>
                                                                                                    <td>{asset.asset_sub_type}</td>
                                                                                                    <td>{asset.asset_specification}</td>
                                                                                                    <td>{asset.color}</td>
                                                                                                    <td>{asset.brand}</td>
                                                                                                    <td>{asset.uom}</td>
                                                                                                    {/* <td>{asset.asset_quantity}</td> */}
                                                                                                    <td>{asset.co_efficient_factor}</td>
                                                                                                    <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                                    <td>{asset.wastage}</td>
                                                                                                    <td>{asset.estimated_quantity_wastage}</td>
                                                                                                  </tr>
                                                                                                ))}

                                                                                                {
                                                                                                  boqDetail5?.boq_sub_items?.map((boqSubItem) => (
                                                                                                    boqSubItem?.assets?.map((asset) => (


                                                                                                      <tr key={asset.id}>
                                                                                                        <td>{asset.asset_type}</td>
                                                                                                        <td>{asset.asset_name}</td>
                                                                                                        <td>{asset.asset_sub_type}</td>
                                                                                                        <td>{asset.generic_info}</td>
                                                                                                        <td>{asset.color}</td>
                                                                                                        <td>{asset.brand}</td>
                                                                                                        <td>{asset.uom}</td>
                                                                                                        {/* <td>{asset.asset_quantity}</td> */}
                                                                                                        <td>{asset.co_efficient_factor}</td>
                                                                                                        <td colSpan={2}>{asset.estimated_quantity}</td>
                                                                                                        <td>{asset.wastage}</td>
                                                                                                        <td>{asset.estimated_quantity_wastage}</td>
                                                                                                      </tr>
                                                                                                    ))
                                                                                                  ))
                                                                                                }
                                                                                              </tbody>
                                                                                            </table>
                                                                                          </div>
                                                                                        </div>
                                                                                      </CollapsibleCard>
                                                                                    </div>
                                                                                  </td>
                                                                                </tr>
                                                                              </React.Fragment>
                                                                            )}
                                                                          </React.Fragment>
                                                                        ))
                                                                      )}
                                                                    </React.Fragment>
                                                                  ))
                                                                )}
                                                              </React.Fragment>
                                                            ))
                                                          )}

                                                        </React.Fragment>
                                                      ))
                                                    )}
                                                  </React.Fragment>
                                                ))
                                              )}
                                            </React.Fragment>
                                          ))
                                        )}

                                        {/* .. */}

                                      </React.Fragment>
                                    ))
                                  )}
                                  {/* sub level 2 end*/}

                                </React.Fragment>
                              ))
                            )}
                            {/* Conditional rendering for categories under sub-project  end*/}
                          </React.Fragment>
                        ))}

                      </React.Fragment>


                    ))}
                    {/* subProject end */}

                  </tbody>
                </table>
              </div>
            </div>

            {/* boq list table is here  end*/}

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
