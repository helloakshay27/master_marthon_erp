import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import { auditLogColumns, auditLogData } from "../constant/data";
import SingleSelector from "../components/base/Select/SingleSelector";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutModal,
    Table,
} from "../components"
import { baseURL } from "../confi/apiDomain";

const BOQEdit = () => {
    

    console.log("Component is rendering!");
    const { id } = useParams()

    console.log("Current ID:", typeof id);


    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`${baseURL}boq_details/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`);
    //         console.log("responce:", response.data)
    //         // Assuming the API returns data based on the id (you may need to adjust based on your response)
    //         setBoqDetails(response.data);
    //         //   setStatus(response.data.status || '');
    //         //   setInitialStatus(response.data.status || '');
    //         //   setLoading(false);
    //         // setBoqDetailsSub(response.data.uom)
    //         if (response.data.boq_sub_items && response.data.boq_sub_items.length > 0) {
    //             setBoqDetailsSub(false); // Set to true if uom is not null
    //         }

    //     } catch (error) {
    //         //   setError('An error occurred while fetching the data');
    //         console.log("error", error)
    //         //   setLoading(false);
    //     }
    // };

    // //   console.log("Component mounted");
    // console.log("id before Effect:", id)

    // useEffect(() => {
    //     console.log("id Effect:", id)
    //     console.log("Component mounted");
    //     // Fetch the data when the component mounts or when 'id' changes
    //     if (id) {
    //         console.log("id:", id)
    //         fetchData();
    //     }
    // }, [id]);  // Dependency array ensures fetch is triggered when 'id' changes

    // console.log("id after:", id)

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [showAssocoatedModal, setShowAssocoatedModal] = useState(false);



    //   modal
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const openAssocoatedModal = () => setShowAssocoatedModal(true);
    const closeAssocoatedModal = () => setShowAssocoatedModal(false);

    const options = [
        { value: "alabama", label: "Alabama" },
        { value: "alaska", label: "Alaska" },
        { value: "california", label: "California" },
        { value: "delaware", label: "Delaware" },
        { value: "tennessee", label: "Tennessee" },
        { value: "texas", label: "Texas" },
        { value: "washington", label: "Washington" },
    ];
    // edit code.......
    const [boqDetails, setBoqDetails] = useState(
        // {
        //     "id": 171,
        //     "item_name": "test1 boq",
        //     "description": "",
        //     "quantity": null,
        //     "note": "",
        //     "status": "approved",
        //     "project": "maxima",
        //     "sub_project": "maxima-sub01",
        //     "wing": null,
        //     "uom": null,
        //     "categories": [
        //       {
        //         "id": 290,
        //         "level": 1,
        //         "category_name": "FINISHING"
        //       },
        //       {
        //         "id": 291,
        //         "level": 2,
        //         "category_name": "Lift Lobby (1st to 22nd floor)"
        //       },
        //       {
        //         "id": 292,
        //         "level": 3,
        //         "category_name": "Painting"
        //       }
        //     ],
        //     "audit_logs": [
        //       {
        //         "id": 2479,
        //         "remarks": "Approved",
        //         "user": "Abhishek Sharma",
        //         "date": "19-03-2025,  3:35 PM",
        //         "status": "Approved"
        //       },
        //       {
        //         "id": 2478,
        //         "remarks": "Submitted",
        //         "user": "Abhishek Sharma",
        //         "date": "19-03-2025,  3:35 PM",
        //         "status": "Submitted"
        //       },
        //       {
        //         "id": 2195,
        //         "remarks": null,
        //         "user": "Abhishek Sharma",
        //         "date": "05-03-2025, 11:00 AM",
        //         "status": "Draft"
        //       }
        //     ],
        //     "materials": [
        //       {
        //         "id": 432,
        //         "estimated_quantity": 400,
        //         "co_efficient_factor": 0,
        //         "wastage": 0,
        //         "estimated_quantity_wastage": 400,
        //         "material_name": "ORRISSA PAN",
        //         "material_type": "SANITARYWARE",
        //         "material_sub_type": null,
        //         "uom": null,
        //         "generic_info": null,
        //         "color": null,
        //         "brand": null
        //       },
        //       {
        //         "id": 433,
        //         "estimated_quantity": 400,
        //         "co_efficient_factor": 0,
        //         "wastage": 0,
        //         "estimated_quantity_wastage": 400,
        //         "material_name": "PVC  WALL HUNG OPEN  FLUSH TANK",
        //         "material_type": "SANITARYWARE",
        //         "material_sub_type": null,
        //         "uom": null,
        //         "generic_info": null,
        //         "color": null,
        //         "brand": null
        //       },
        //       {
        //         "id": 434,
        //         "estimated_quantity": 400,
        //         "co_efficient_factor": 0,
        //         "wastage": 0,
        //         "estimated_quantity_wastage": 400,
        //         "material_name": "ORRISSA PAN",
        //         "material_type": "SANITARYWARE",
        //         "material_sub_type": null,
        //         "uom": null,
        //         "generic_info": null,
        //         "color": null,
        //         "brand": null
        //       },
        //       {
        //         "id": 435,
        //         "estimated_quantity": 400,
        //         "co_efficient_factor": 0,
        //         "wastage": 0,
        //         "estimated_quantity_wastage": 400,
        //         "material_name": "PVC  WALL HUNG OPEN  FLUSH TANK",
        //         "material_type": "SANITARYWARE",
        //         "material_sub_type": null,
        //         "uom": null,
        //         "generic_info": null,
        //         "color": null,
        //         "brand": null
        //       }
        //     ],
        //     "assets": [],
        //     "boq_sub_items": [
        //       {
        //         "id": 87,
        //         "name": "test1",
        //         "cost_quantity": 2000,
        //         "description": "",
        //         "remarks": "",
        //         "notes": "",
        //         "unit_of_measure_id": null,
        //         "uom": null,
        //         "materials": [
        //           {
        //             "id": 432,
        //             "estimated_quantity": 400,
        //             "co_efficient_factor": 0,
        //             "wastage": 0,
        //             "estimated_quantity_wastage": 400,
        //             "material_name": "ORRISSA PAN",
        //             "material_type": "SANITARYWARE",
        //             "material_sub_type": null,
        //             "uom": null,
        //             "generic_info": null,
        //             "color": null,
        //             "brand": null
        //           },
        //           {
        //             "id": 433,
        //             "estimated_quantity": 400,
        //             "co_efficient_factor": 0,
        //             "wastage": 0,
        //             "estimated_quantity_wastage": 400,
        //             "material_name": "PVC  WALL HUNG OPEN  FLUSH TANK",
        //             "material_type": "SANITARYWARE",
        //             "material_sub_type": null,
        //             "uom": null,
        //             "generic_info": null,
        //             "color": null,
        //             "brand": null
        //           }
        //         ],
        //         "assets": []
        //       },
        //       {
        //         "id": 88,
        //         "name": "test2",
        //         "cost_quantity": 400,
        //         "description": "",
        //         "remarks": "",
        //         "notes": "",
        //         "unit_of_measure_id": null,
        //         "uom": null,
        //         "materials": [
        //           {
        //             "id": 434,
        //             "estimated_quantity": 400,
        //             "co_efficient_factor": 0,
        //             "wastage": 0,
        //             "estimated_quantity_wastage": 400,
        //             "material_name": "ORRISSA PAN",
        //             "material_type": "SANITARYWARE",
        //             "material_sub_type": null,
        //             "uom": null,
        //             "generic_info": null,
        //             "color": null,
        //             "brand": null
        //           },
        //           {
        //             "id": 435,
        //             "estimated_quantity": 400,
        //             "co_efficient_factor": 0,
        //             "wastage": 0,
        //             "estimated_quantity_wastage": 400,
        //             "material_name": "PVC  WALL HUNG OPEN  FLUSH TANK",
        //             "material_type": "SANITARYWARE",
        //             "material_sub_type": null,
        //             "uom": null,
        //             "generic_info": null,
        //             "color": null,
        //             "brand": null
        //           }
        //         ],
        //         "assets": []
        //       }
        //     ]
        //   }

        null
    );  // State to hold the fetched data
    const [boqDetailsSub, setBoqDetailsSub] = useState(true);
    const [loading, setLoading] = useState(true);  // State for loading indicator
    const [error, setError] = useState(null);  // State for handling errors

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


    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}boq_details/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`);
            console.log("responce:", response.data)
            // Assuming the API returns data based on the id (you may need to adjust based on your response)
            setBoqDetails(response.data);
            //   setStatus(response.data.status || '');
            //   setInitialStatus(response.data.status || '');
            //   setLoading(false);
            // setBoqDetailsSub(response.data.uom)
            if (response.data.boq_sub_items && response.data.boq_sub_items.length > 0) {
                setBoqDetailsSub(false); // Set to true if uom is not null
            }

        } catch (error) {
            //   setError('An error occurred while fetching the data');
            console.log("error", error)
            //   setLoading(false);
        }
    };
    fetchData();
    //   console.log("Component mounted");
    console.log("id before Effect:", id)

    useEffect(() => {
        console.log("id Effect:", id)
        console.log("Component mounted use  effect calling");
        // Fetch the data when the component mounts or when 'id' changes
        if (id) {
            console.log("id:", id)
            fetchData();
        }
    }, [id]);  // Dependency array ensures fetch is triggered when 'id' changes

    console.log("id after:", id)
    // console.log("use effect calling");

    
    useEffect(() => {
        console.log("use effect calling");
    }, []);  // Dependency array ensures fetch is triggered when 'id' changes


    // Loading, error, and data display logic
    //   if (loading) {
    //     return <div>Loading...</div>;
    //   }

    //   if (error) {
    //     // return <div>{error}</div>;
    //     return <div>Something went wrong</div>;
    //   }

    console.log("boa sub", boqDetailsSub)
    console.log(boqDetails.materials); // Should contain an array of materials
    console.log(boqDetails.assets);   // Should contain an array of assets



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
            <div className="website-content ">
                <div className="module-data-section p-4">
                    <a href="">
                        Setup &gt; Engineering Setup &gt; BOQ &gt; BOQ Edit
                    </a>
                    <div className="card mt-3 mb-5">
                        {/* Total Content Here */}


                        <CollapsibleCard title="BOQ Edit">
                            <div
                                className="card-body mt-0 pt-0"
                                style={{ display: "block" }}
                            >
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>BOQ ID</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder='56914'
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Project</label>
                                            {/* <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Nexzone Phase II"
                                                /> */}
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Project`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Sub-Project</label>

                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Project`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Wing</label>
                                            {/* <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Wing A"
                                                /> */}
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Wing`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>Main Category</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Main Category`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Lvl 2</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Lvl 2`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Lvl 3</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Lvl 3`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Lvl 4</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Lvl 4`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Lvl 5</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Lvl 5`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>BOQ Item Name</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Tiling Acid Wash "
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>BOQ Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder="Supply Fabrication & Installation of MS "
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>UOM</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select UOM`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mt-2">
                                        <div className="form-group">
                                            <label>BOQ Qty (Cost)</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder={0.0}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-3 mt-2">
                      <div className="form-group">
                        <label>BOQ Rate (Cost)</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder={0.0}
                          fdprocessedid="qv9ju9"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-3 mt-2">
                      <div className="form-group">
                        <label>BOQ Amount (Cost)</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="INR 0.00"
                          fdprocessedid="qv9ju9"
                          disabled
                        />
                      </div>
                    </div> */}
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Notes</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <div className="form-group">
                                            <label>Remark</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                placeholder=""
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3 mt-4">
                                        {/* <div className="form-group">
                                                <label className="me-4">Is Active</label>
                                                <input
                                                    className=""
                                                    type="checkbox"
                                                    placeholder="Sumitted"
                                                    fdprocessedid="qv9ju9"
                                                />
                                            </div> */}
                                    </div>
                                    {/* <div className="col-md-3 mt-4">
                                            <div className="form-group">
                                                <label className="me-5">BOQ Amount (Cost)</label>
                                                <svg
                                                    onClick={openModal}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="currentColor"
                                                    className="bi bi-file-earmark-medical"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                                </svg>
                                            </div>
                                        </div> */}
                                    <div className="collapse" id="collapseExample">
                                        <div className="row">
                                            <div className="col-md-3 mt-5">
                                                <div className="form-group">
                                                    {/* <label></label> */}
                                                    <select
                                                        className="form-control form-select"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <option selected="selected">Select</option>
                                                        <option>Approved</option>
                                                        <option>Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mt-1">
                                                <div className="form-group">
                                                    <label>Remarks</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows={2}
                                                        placeholder=""
                                                        defaultValue={""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-2 justify-content-center">
                                            <div className="col-md-2">
                                                <button
                                                    className="purple-btn2 w-100"
                                                    fdprocessedid="u33pye"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                            <div className="col-md-2">
                                                <button
                                                    className="purple-btn1 w-100"
                                                    fdprocessedid="af5l5g"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>

                        <CollapsibleCard title="BOQ Items">
                            {/* <div className="card mx-3 mt-2"> */}


                            <div
                                className="card-body mt-0 pt-0"
                                style={{ display: "block" }}
                            >

                                <CollapsibleCard title="Materials">

                                    <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                    >
                                        <div className="tbl-container mx-3 mt-1">
                                            <table className="">
                                                <thead>
                                                    <tr>
                                                        <th rowSpan={2}>Material Type</th>
                                                        <th rowSpan={2}>Material</th>
                                                        <th rowSpan={2}>Material Sub-Type</th>
                                                        <th rowSpan={2}>Generic Specification</th>
                                                        <th rowSpan={2}>Colour </th>
                                                        <th rowSpan={2}>Brand </th>
                                                        <th rowSpan={2}>UOM</th>
                                                        <th rowSpan={2}>Cost QTY</th>
                                                        <th colSpan={3}>Cost</th>
                                                        <th rowSpan={2}>Wastage</th>
                                                        <th rowSpan={2}>
                                                            Total Estimated Qty Wastage
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th>Co-Efficient Factor</th>
                                                        <th colSpan={2}>Estimated Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>

                                                        <td>
                                                            {/* <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="SAND"
                                                                    disabled
                                                                /> */}
                                                        </td>
                                                        <td></td>
                                                        <td>
                                                            <SingleSelector
                                                                options={options}
                                                                // value={values[label]} // Pass current value
                                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                                placeholder={`Select Sub-Type`} // Dynamic placeholder
                                                            // onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <SingleSelector
                                                                options={options}
                                                                // value={values[label]} // Pass current value
                                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                                placeholder={`Select Specification`} // Dynamic placeholder
                                                            // onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <SingleSelector
                                                                options={options}
                                                                // value={values[label]} // Pass current value
                                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                                placeholder={`Select Colour`} // Dynamic placeholder
                                                            // onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <SingleSelector
                                                                options={options}
                                                                // value={values[label]} // Pass current value
                                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                                placeholder={`Select Brand`} // Dynamic placeholder
                                                            // onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <SingleSelector
                                                                options={options}
                                                                // value={values[label]} // Pass current value
                                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                                placeholder={`Select UOM`} // Dynamic placeholder
                                                            // onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Cost QTY"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="2"
                                                            />
                                                        </td>
                                                        <td colSpan={2}>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="2"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="4%"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="2.08"
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </CollapsibleCard>

                                <CollapsibleCard title="Assests">

                                    <div
                                        className="card-body mt-0 pt-0"
                                        style={{ display: "block" }}
                                    >
                                        <div className="tbl-container mx-3 mt-1">
                                            <table className="">
                                                <thead>
                                                    <tr>
                                                        <th rowSpan={2}>Assest Type</th>
                                                        <th rowSpan={2}>Assest Sub-Type</th>
                                                        <th rowSpan={2}>Assest</th>
                                                        <th rowSpan={2}>UOM</th>
                                                        <th colSpan={2}>Cost</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Co-Efficient Factor</th>
                                                        <th colSpan={2}>Estimated Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                            // placeholder="2.08"
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </CollapsibleCard>

                            </div>

                            {/* </div> */}
                        </CollapsibleCard>


                        <CollapsibleCard title="BOQ Items">
                            <div className="m-0 p-0">
                                <div
                                    className="card-body mt-0 pt-0"
                                    style={{ display: "block" }}
                                >
                                    {boqDetailsSub ? (
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
                                                                    <th rowSpan={2}>Sr.No.</th>
                                                                    <th rowSpan={2}>Material Type</th>
                                                                    <th rowSpan={2}>Material</th>
                                                                    <th rowSpan={2}>Material Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour </th>
                                                                    <th rowSpan={2}>Brand </th>
                                                                    <th rowSpan={2}>UOM</th>
                                                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                    <th colSpan={2}>Cost</th>
                                                                    <th rowSpan={2}>Wastage</th>
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
                                                                        <td>{index + 1}</td>
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
                                                                    <th rowSpan={2}>Sr.No.</th>
                                                                    <th rowSpan={2}>Asset Type</th>
                                                                    <th rowSpan={2}>Asset</th>
                                                                    <th rowSpan={2}>Asset Sub-Type</th>
                                                                    <th rowSpan={2}>Generic Specification</th>
                                                                    <th rowSpan={2}>Colour</th>
                                                                    <th rowSpan={2}>Brand</th>
                                                                    <th rowSpan={2}>UOM</th>
                                                                    {/* <th rowSpan={2}>Cost QTY</th> */}
                                                                    <th colSpan={2}>Cost</th>
                                                                    <th rowSpan={2}>Wastage</th>
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
                                                                        <td>{index + 1}</td>
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
                                    ) : (


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

                                                    {boqDetails.boq_sub_items && (
                                                        boqDetails.boq_sub_items.map((boqDetail2, index) => (
                                                            <React.Fragment key={boqDetail2.id}>
                                                                <tr>
                                                                    <td className="text-start">{index + 1}</td>


                                                                    <td className="text-start">
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
                                                                                                            <th rowSpan={2}>Wastage</th>
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
                                                                                                            <th rowSpan={2}>Wastage</th>
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



                        </CollapsibleCard>
                        <div className="row mt-2 justify-content-center">
                            <div className="col-md-2">
                                <button
                                    className="purple-btn2 w-100"
                                    fdprocessedid="u33pye"
                                >
                                    {/* Amend */}
                                    Update
                                </button>
                            </div>
                            <div className="col-md-2">
                                <button
                                    className="purple-btn1 w-100"
                                    fdprocessedid="u33pye"
                                >
                                    {/* Back */}
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {/* <div className="row mx-2">
                                <h5>Audit Log</h5>
                                <div className="">
                                    <Table columns={auditLogColumns} data={auditLogData} />
                                </div>
                            </div> */}
                    </div>
                </div>

            </div>
            {/* </div> */}


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

export default BOQEdit;
