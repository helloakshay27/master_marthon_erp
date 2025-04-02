import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleSelector from "../components/base/Select/SingleSelector";
import {
  LayoutModal,
  Table,
} from "../components"
import { baseURL } from "../confi/apiDomain";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BOQDetailsPageMaster = () => {
  const { id } = useParams()
  const navigate = useNavigate(); // Initialize the navigate function
  const [boqDetails, setBoqDetails] = useState(null);  // State to hold the fetched data
  const [boqDetailsSub, setBoqDetailsSub] = useState(true);
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for handling errors

  const [status, setStatus] = useState(boqDetails?.status); // Assuming boqDetails.status is initially available
  const [remark, setRemark] = useState('');
  const [initialStatus, setInitialStatus] = useState('');
  const [loading2, setLoading2] = useState(false);  // State for loading indicator
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



  console.log('id', id)
  // console.log(boqDetails.status," status....")
  // State to manage rows
  const [rows, setRows] = useState([]);
  // Function to add a new row
  const handleAddAttachment = () => {
    setRows([
      ...rows,
      {
        id: Date.now(), // Unique ID based on current time
        documentName: '',
        fileType: '',
        fileName: '',
        uploadedAt: '',
        document: null,
      },
    ]);
  }
  // Function to delete a row
  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showAssocoatedModal, setShowAssocoatedModal] = useState(false);



  //   modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openAssocoatedModal = () => setShowAssocoatedModal(true);
  const closeAssocoatedModal = () => setShowAssocoatedModal(false);


  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}boq_details/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`);

      // Assuming the API returns data based on the id (you may need to adjust based on your response)
      setBoqDetails(response.data);
      setStatus(response.data.status || '');
      setInitialStatus(response.data.status || '');
      setLoading(false);
      // setBoqDetailsSub(response.data.uom)
      if (response.data.boq_sub_items && response.data.boq_sub_items.length > 0) {
        setBoqDetailsSub(false); // Set to true if uom is not null
      } 
    
    } catch (error) {
      setError('An error occurred while fetching the data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the data when the component mounts or when 'id' changes


    fetchData();
  }, [id]);  // Dependency array ensures fetch is triggered when 'id' changes

  // Loading, error, and data display logic
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // return <div>{error}</div>;
    return <div>Something went wrong</div>;
  }

  console.log("boa sub",boqDetailsSub)
  console.log(boqDetails.materials); // Should contain an array of materials
console.log(boqDetails.assets);   // Should contain an array of assets

  // Group categories by level
  const groupedCategories = boqDetails?.categories?.reduce((acc, category) => {
    if (!acc[category.level]) {
      acc[category.level] = [];
    }
    acc[category.level].push(category);
    return acc;
  }, {});

  // status and remark

  // Step 1: Set up state for status and remarks


  // Step 2: Handle status change
  const handleStatusChange = (selectedOption) => {
    // setStatus(e.target.value);
    setStatus(selectedOption.value);
    handleStatusChange(selectedOption); // Handle status change
  };

  // Step 3: Handle remark change
  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };


  const handleSubmit = async () => {
    // Prepare the payload for the API
    const payload = {
      status_log: {
        status: status,
        remarks: remark
      }
    };

    console.log("detail status change", payload);
    setLoading2(true);

    try {
      const response = await axios.patch(
        `${baseURL}boq_details/${id}/update_status.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
        payload,  // The request body containing status and remarks
        {
          headers: {
            'Content-Type': 'application/json', // Set the content type header
          },
        }

      );
      await fetchData();


      if (response.status === 200) {
        console.log('Status updated successfully:', response.data);
        setRemark("")
        // alert('Status updated successfully');
        // Handle success (e.g., update the UI, reset fields, etc.)
        toast.success("Status updated successfully!");
      } else {
        console.log('Error updating status:', response.data);
        toast.error("Failed to update status.");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Request failed:', error);
      // Handle network or other errors (e.g., show an error message)
    } finally {
      setLoading2(false);
    }
  };


  const handleCancel = () => {
    // setStatus(initialStatus); // Reset status to the initial value
    // setRemark(''); // Optionally reset the remark as well
    navigate("/view-BOQ"); // 🔥 Redirect to the /view-BOQ page
  };

  //status 
  // const [status, setStatus] = useState(boqDetails.status);
  // Map options to an array of objects
  // const options = [
  //   {
  //     label: boqDetails.status,
  //     value: boqDetails.status,
  //     isDisabled: true,
  //   },
  //   {
  //     label: 'Select Status',
  //     value: '',
  //     isDisabled: false,
  //   },
  //   {
  //     label: 'Draft',
  //     value: 'draft',
  //     isDisabled: boqDetails.status === 'draft',
  //   },
  //   {
  //     label: 'Submitted',
  //     value: 'submitted',
  //     isDisabled: boqDetails.status === 'submitted',
  //   },
  //   {
  //     label: 'Approved',
  //     value: 'approved',
  //     isDisabled: boqDetails.status === 'approved',
  //   },
  // ];


  // Filter out the current selected value (boqDetails.status) from the options list
  const options = [
    {
      label: 'Select Status',
      value: '',
      isDisabled: false,
    },
    {
      label: 'Draft',
      value: 'draft',
      isDisabled: boqDetails.status === 'draft',
    },
    {
      label: 'Submitted',
      value: 'submitted',
      isDisabled: boqDetails.status === 'submitted',
    },
    {
      label: 'Approved',
      value: 'approved',
      isDisabled: boqDetails.status === 'approved',
    },
  ];
  // Filter out the current status from the options
  // const filteredOptions = options?.filter(option => option.value !== boqDetails.status);

  // const filteredOptions = boqDetails.status === 'approved' 
  // ? options.filter(option => option.value === 'approved') 
  // : options;

  const filteredOptions = boqDetails.status === 'draft'
  ? options // Show all options when in draft
  : boqDetails.status === 'submitted'
  ? options.filter(option => option.value !== 'draft') // Hide "Draft" after submission
  : options.filter(option => option.value === 'approved'); // Only show "Approved" if already approved




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

    // if (openBoqDetailId === id) {
    //   setOpenBoqDetailId(null);  // Close the category if it's already open
    // } else {
    //   setOpenBoqDetailId(id);  // Open the selected category
    // }

    setOpenBoqDetailId(prevId => prevId === id ? null : id);
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

  return (
    <>

      {/* <div className="website-content overflow-auto"> */}
      <div className="website-content">
        <div className="module-data-section p-2">
          <a href="" style={{ color: 'black' }}>
            Home &gt; Engineering  &gt; BOQ &gt; BOQ Details
          </a>
          {/* <div className="card mt-2 mb-5 p-4" id="total-content"> */}
          {/* Total Content Here  ..className="tab-content1 active" */}
          <div className="d-flex justify-content-end m-4">
          {boqDetails.status === "draft" && (
            <Link 
            to={`/boq-edit-new/${id}`} 
            className="d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
             
              <button class="purple-btn1" data-bs-toggle="modal" data-bs-target="#exampleModal">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b0203" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="#8b0203"/>
        <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#8b0203"/>
    </svg>
</button>
              
            </Link>
)}
          </div>
          <CollapsibleCard title="BOQ Details">

            <div className="row px-3 mt-2">
              <div className="col-md-12 mb-3 row">
                <div className="col-md-10">
                  <div className="d-flex justify-content-end m-2 mb-3">
                    {/* <button className="btn  d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#6c757d"
                            className="bi bi-pencil-square me-2"  // "me-2" adds margin to the right of the icon
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>

                        </button> */}

                    {/* <Link to="/boq-edit" className="btn d-flex align-items-center" style={{ borderColor: '#8b0203' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#6c757d"
                        className="bi bi-pencil-square me-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </Link> */}
                  </div>

                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-6">
                  <label>BOQ ID</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> {boqDetails.id}</span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-6">
                  <label>Sub-Level 5</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{groupedCategories[5] && groupedCategories[5].length > 0 ? groupedCategories[5][0].category_name : ''}
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Project</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{boqDetails.project}</span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>BOQ Item Name</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{boqDetails.item_name} </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Sub-Project</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{boqDetails.sub_project}</span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>BOQ Description</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> {boqDetails.description}</span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Wing</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> {boqDetails.wing}</span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>UOM</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">
                      {boqDetails.uom}
                      {/* {
                        boqDetails?.boq_sub_items?.map((boqSubItem, index) => (
                          <span key={index}>{boqSubItem.umo}</span> // Wrap each 'umo' value in a valid element
                        ))
                      } */}

                      {/* {boqDetails?.uom || boqDetails?.boq_sub_items?.map((boqSubItem, index) => (
                        <span key={index}>{boqSubItem.umo}</span>
                      ))} */}
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Main Category</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">  {groupedCategories[1] && groupedCategories[1].length > 0 ? groupedCategories[1][0].category_name : ''} </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label> BOQ Qty (Cost)</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">
                      {boqDetails.quantity}
                      {/* {boqDetails?.quantity || boqDetails?.boq_sub_items?.map((boqSubItem, index) => (
                        <span key={index}>{boqSubItem.cost_quantity}</span>
                      ))} */}
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Sub-Level 2</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> {groupedCategories[2] && groupedCategories[2].length > 0 ? groupedCategories[2][0].category_name : ''}</span>
                  </label>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Notes</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{boqDetails.note} </span>
                  </label>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Sub-Level 3</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> {groupedCategories[3] && groupedCategories[3].length > 0 ? groupedCategories[3][0].category_name : ''} </span>
                  </label>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label>Remark</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3"> </span>
                  </label>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 mt-1">
                <div className="col-6">
                  <label> Sub-Level 4</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3" style={{ color: "black" }}>:</span>
                    <span className="me-3">{groupedCategories[4] && groupedCategories[4].length > 0 ? groupedCategories[4][0].category_name : ''}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard title="BOQ Items">
            <div className="m-0 p-0">
              <div
                className="card-body mt-0 pt-0"
                style={{ display: "block" }}
              >
                {boqDetailsSub ?(
                <>
                     <CollapsibleCard title="Materials">

                     <div
                       className="card-body mt-0 pt-0"
                       style={{ display: "block" }}
                     >
                       <div className="tbl-container mx-3 mt-1" style={{ height: '200px' }}>
                         <table className="w-100">
                           <thead>
                             <tr>
                              <th  rowSpan={2}>Sr.No.</th>
                               <th rowSpan={2}>Material Type</th>
                               <th rowSpan={2}>Material</th>
                               <th rowSpan={2}>Material Sub-Type</th>
                               <th rowSpan={2}>Generic Specification</th>
                               <th rowSpan={2}>Colour </th>
                               <th rowSpan={2}>Brand </th>
                               <th rowSpan={2}>UOM</th>
                               {/* <th rowSpan={2}>Cost QTY</th> */}
                               <th colSpan={2}>Cost</th>
                               <th rowSpan={2}>Wastage%</th>
                               <th rowSpan={2}>
                                 Total Estimated Qty Wastage
                               </th>
                             </tr>
                             <tr>
                               <th>Co-Efficient Factor</th>
                               <th>Estimated Qty</th>
                             </tr>
                           </thead>
                           <tbody>
                             {boqDetails.materials.map((material, index) => (
                               <tr key={index}>
                                <td>{index+1}</td>
                                 <td>{material.material_type}</td>
                                 <td>{material.material_name}</td>
                                 <td>{material.material_sub_type}</td>
                                 <td>{material.generic_info}</td>
                                 <td>{material.color}</td>
                                 <td>{material.brand}</td>
                                 <td>{material.uom}</td>
                                 {/* <td></td> */}
                                 <td>{material.co_efficient_factor}</td>
                                 <td >{material.estimated_quantity}</td>
                                 <td>{material.wastage}</td>
                                 <td>{material.estimated_quantity_wastage}</td>
                               </tr>
                             ))}
                            
                           </tbody>
                         </table>
                       </div>
                     </div>
   
   
                   </CollapsibleCard>
                   <CollapsibleCard title="Assets">
   <div className="card-body mt-0 pt-0" style={{ display: "block" }}>
     <div className="tbl-container mx-3 mt-1" style={{ height: '200px' }}>
       <table className="w-100">
         <thead>
           <tr>
           <th  rowSpan={2}>Sr.No.</th>
             <th rowSpan={2}>Asset Type</th>
             <th rowSpan={2}>Asset</th>
             <th rowSpan={2}>Asset Sub-Type</th>
             <th rowSpan={2}>Generic Specification</th>
             <th rowSpan={2}>Colour</th>
             <th rowSpan={2}>Brand</th>
             <th rowSpan={2}>UOM</th>
             {/* <th rowSpan={2}>Cost QTY</th> */}
             <th colSpan={2}>Cost</th>
             <th rowSpan={2}>Wastage%</th>
             <th rowSpan={2}>Total Estimated Qty Wastage</th>
           </tr>
           <tr>
             <th>Co-Efficient Factor</th>
             <th>Estimated Qty</th>
           </tr>
         </thead>
         <tbody>
           {boqDetails.assets.map((asset, index) => (
             <tr key={index}>
              <td>{index+1}</td>
               <td>{asset.material_type}</td>
               <td>{asset.material_name}</td>
               <td>{asset.material_sub_type}</td>
               <td>{asset.asset_specification}</td>
               <td>{asset.color}</td>
               <td>{asset.brand}</td>
               <td>{asset.uom}</td>
               {/* <td></td> */}
               <td>{asset.co_efficient_factor}</td>
               <td>{asset.estimated_quantity}</td>
               <td>{asset.wastage}</td>
               <td>{asset.estimated_quantity_wastage}</td>
             </tr>
           ))}

         </tbody>
       </table>
     </div>
   </div>
 </CollapsibleCard>

                   </>
                ):(

                 
  <div className="tbl-container mt-1 mx-3">
    <table className="w-100">
      <thead>
        <tr>
          <th className="text-start">Sr.No.</th>
          {/* <th className="text-start"> <input className="ms-1 me-1 mb-1" type="checkbox" /></th> */}
          <th className="text-start">Expand</th>
          <th className="text-start">Sub Item Name</th>
          <th className="text-start">Description</th>
          <th className="text-start">Notes</th>
          <th className="text-start">Remarks</th>
          <th className="text-start">UOM</th>
          <th className="text-start">Quantity</th>
          {/* <th className="text-start">
              Document
          </th> */}
        </tr>
      </thead>
      <tbody>

        { boqDetails.boq_sub_items && (
          boqDetails.boq_sub_items.map((boqDetail2, index) => (
            <React.Fragment key={boqDetail2.id}>
              <tr>
                <td className="text-start">{index + 1}</td>


                <td  className="text-start">
                  <button
                    className="btn btn-link p-0"
                    onClick={() => toggleBoqDetail(boqDetail2.id)}
                    
                  >
                    {openBoqDetailId === boqDetail2.id ? (
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
                    )}
                  </button>
                  
                </td>

                <td className="text-start">

                {boqDetail2.name}
                </td>
                <td className="text-start">{boqDetail2.description}</td>
                <td className="text-start">{boqDetail2.notes}</td>
                <td className="text-start">{boqDetail2.remarks}</td>
                <td className="text-start">{boqDetail2.uom}</td>
                <td className="text-start">
                {boqDetail2.cost_quantity}
                </td>
                {/* <td></td> */}
                {/* <td></td> */}
              </tr>

              {/* Render Materials Table for BOQ Detail in Sub-Category  */}
              {openBoqDetailId === boqDetail2.id && (boqDetail2?.materials || boqDetail2?.boq_sub_items?.materials) && (
                <React.Fragment>
                  <tr>
                    <td colSpan={13}>
                      <div>
                        <CollapsibleCard title="Materials">
                          <div className="card-body mt-0 pt-0">
                            <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Sr.No</th>
                                    <th rowSpan={2}>Material Type</th>
                                    <th rowSpan={2}>Material</th>
                                    <th rowSpan={2}>Material Sub-Type</th>
                                    <th rowSpan={2}>Generic Specification</th>
                                    <th rowSpan={2}>Colour</th>
                                    <th rowSpan={2}>Brand</th>
                                    <th rowSpan={2}>UOM</th>
                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                    <th colSpan={3}>Cost</th>
                                    <th rowSpan={2}>Wastage%</th>
                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                  </tr>
                                  <tr>
                                    <th>Co-Efficient Factor</th>
                                    <th colSpan={2}>Estimated Qty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {boqDetail2?.materials?.map((material, index) => (

                                    <tr key={material.id}>
                                      <td>{index + 1}</td>
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
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CollapsibleCard>

                        <CollapsibleCard title="Assets">
                          <div className="card-body mt-0 pt-0">
                            <div className="tbl-container mx-3 mt-1" style={{ height: "200px" }}>
                              <table className="w-100">
                                <thead>
                                  <tr>
                                    <th rowSpan={2}>Sr.No.</th>
                                    <th rowSpan={2}>Asset Type</th>
                                    <th rowSpan={2}>Asset</th>
                                    <th rowSpan={2}>Asset Sub-Type</th>
                                    <th rowSpan={2}>Generic Specification</th>
                                    <th rowSpan={2}>Colour</th>
                                    <th rowSpan={2}>Brand</th>
                                    <th rowSpan={2}>UOM</th>
                                    {/* <th rowSpan={2}>Asset QTY</th> */}
                                    <th colSpan={3}>Cost</th>
                                    <th rowSpan={2}>Wastage%</th>
                                    <th rowSpan={2}>Total Estimated Qty Wastage</th>
                                  </tr>
                                  <tr>
                                    <th>Co-Efficient Factor</th>
                                    <th colSpan={2}>Estimated Qty</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {boqDetail2.assets.map((asset, index) => (
                                    <tr key={asset.id}>
                                      <td>{index + 1}</td>
                                      <td>{asset.material_type}</td>
                                      <td>{asset.material_name}</td>
                                      <td>{asset.material_sub_type}</td>
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


        {/* sub level 2 end*/}


        {/* Conditional rendering for categories under sub-project  end*/}

        {/* subProject end */}

      </tbody>
    </table>
  </div>
             )}

             

               
              </div>
              
              
             
            </div>
           


            {/* 
                <div className="row mt-3 px-2 mx-3 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="">Document Attachment</h5>
                    <button className="purple-btn1" onClick={handleAddAttachment} style={{ color: '#8b0203' }} >Add Attachments</button>
                  </div>

                  <div className="">
                    {/* <Table columns={auditLogColumns} data={auditLogData} /> */}


            {/* <div className="tbl-container  mt-1">
                      <table className="w-100">
                        <thead>
                          <tr>
                            <th rowSpan={2}>Document Name</th>
                            <th rowSpan={2}>File Type </th>
                            <th rowSpan={2}>File Name </th>
                            <th rowSpan={2}>Uploaded At</th>
                            <th rowSpan={2}>Upload File *</th>
                            <th rowSpan={2}>Action</th>
                          </tr>

                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.id}>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="documentName"
                                  value={row.documentName}
                                  onChange={(e) => handleInputChange(e, row.id)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="fileType"
                                  value={row.fileType}
                                  onChange={(e) => handleInputChange(e, row.id)}
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="fileName"
                                  value={row.fileName}
                                  onChange={(e) => handleInputChange(e, row.id)}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="uploadedAt"
                                  value={row.uploadedAt}
                                  onChange={(e) => handleInputChange(e, row.id)}
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  className="attachmod"
                                  required
                                  type="file"
                                  name="document"
                                  onChange={(e) => handleFileChange(e, row.id)}
                                />
                              </td>
                              <td>
                                <a
                                  className="text-danger cancel-icon remove_fields"
                                  href="#"
                                  onClick={() => handleDeleteRow(row.id)}
                                >
                                  <span
                                    className="material-symbols-outlined"
                                  // style={{ color: '#8b0203' }}
                                  >
                                    cancel
                                  </span>
                                </a>
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  </div>

                </div> */}

            <div className="row mt-4 px-2 mx-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Remark</label>
                  <textarea className="form-control" rows="3" placeholder=""
                    value={remark}
                    onChange={handleRemarkChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="row mt-4 justify-content-end align-items-center mx-2">
              <div className="col-md-3">
                <div className="form-group d-flex gap-3 align-items-center mx-3">
                  <label style={{ fontSize: '1.1rem', color: 'black' }}>Status</label>

                  {/* <select className="form-control form-select" style={{ width: '100%' }} value={status} onChange={handleStatusChange} >

                    <option disabled={boqDetails.status} selected >{boqDetails.status}</option>
                    <option value="" >Select Status</option>
                    <option value="draft" disabled={boqDetails.status === 'draft'} >Draft</option>
                    <option value="submitted" disabled={boqDetails.status === 'submitted'}>Submitted</option>
                    <option value="approved" disabled={boqDetails.status === 'approved'}>Approved</option>
                  </select> */}


                  <SingleSelector
                    // options={options}
                    options={filteredOptions}
                    onChange={handleStatusChange}
                    // options.find(option => option.value === status)
                    // value={filteredOptions.find(option => option.value === status)}
                    value={options.find(option => option.value === status)}
                    // value={selectedSite}
                    placeholder={`Select Status`} // Dynamic placeholder
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              {loading2 && (
                // <div className="loader-container">
                //   <div className="lds-ring">
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //     <div></div>
                //   </div>
                //   <p>Submitting Status...</p>
                // </div>

                <div id="full-screen-loader" className="full-screen-loader">
                <div className="loader-container">
                  <img
                    src="https://newerp.marathonrealty.com/assets/loader.gif"
                    alt="Loading..."
                    width={50}
                  />
                  <h5>Please wait</h5>
                </div>
              </div>

              )}
              {/* ✅ Toast Container */}
    <ToastContainer />
              <button className="purple-btn2" onClick={handleSubmit}>Submit</button>
              <button className="purple-btn1" onClick={handleCancel}>Close</button>
            </div>
          </CollapsibleCard>


          <div className="row mt-2 justify-content-center">
            {/* <div className="col-md-2">
                  <button
                    className="purple-btn2 w-100"
                    fdprocessedid="u33pye"
                  >
                    Amend
                  </button>
                </div> */}
            {/* <div className="col-md-2">
                  <button
                    className="purple-btn1 w-100"
                    fdprocessedid="u33pye"
                  >
                    Back
                  </button>
                </div> */}
          </div>

          <div className="row mx-2 mt-2 mb-5">
            <h5>Audit Log</h5>
            <div className="">
              {/* <Table columns={auditLogColumns} data={auditLogData} /> */}
              <div className="tbl-container  mt-1">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th >Sr.No.</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                    </tr>

                  </thead>
                  <tbody>
                    {boqDetails.audit_logs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">No Audit Logs Available</td>
                      </tr>
                    ) : (

                      boqDetails.audit_logs.map((log, index) => (
                        <tr key={log.id}>
                          <td>{index + 1}</td>
                          <td>{log.user}</td>
                          <td>{log.date}</td>
                          <td>{log.status}</td>
                          <td>{log.remarks}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>



            </div>
          </div>
          {/* </div> */}
          {/* </div> */}

        </div>
      </div>




      {/* Modal start */}
      <Modal size="lg" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <h5>BOQ Documents</h5>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Thumbnail Images */}
            <img src="#" className="img-thumbnail" alt="Document 1" />
            <img src="#" className="img-thumbnail" alt="Document 2" />
          </div>

          {/* Documents Table */}
          <div className="tbl-container mx-3 mt-1">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Documents</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src="#" className="img-fluid" alt="Document Preview" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="lg"
        show={showAssocoatedModal}
        onHide={closeAssocoatedModal}
        centered
      >
        <Modal.Header closeButton>
          <h5>BOQ Associated Work Orders</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="details_page">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Main Category</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>FLAT FINISHING
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Sub-Lvl 2</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Plastor -FF
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>Sub-Lvl 3</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Plastor -FF1
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>BOQ Name</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>Gypsum Work
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-5">
                  <label>BOQ ID</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">:-</span>167379
                  </label>
                </div>
              </div>
            </div>
            <div className="tbl-container mx-3 mt-1">
              <table className="w-100 table table-bordered">
                <thead>
                  <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                    <th>Column 4</th>
                    <th>Column 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                    <td>Data 3</td>
                    <td>Data 4</td>
                    <td>Data 5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BOQDetailsPageMaster;
