import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal, Button, Form } from 'react-bootstrap';
import { Link,useNavigate } from "react-router-dom";

const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
];

const ViewRate = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
      // Optionally, show the modal here if needed before navigating
      // setShowModal(true);
      navigate('/create-rate'); // This will navigate to /create-rate
    };


    return (
        <>


            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Rate Card</h5>
                    <div className="card mt-3 pb-">

                        {/* <CollapsibleCard title="Rate Card">
                            <div className="card-body mt-0 pt-0">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>State</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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

                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Project</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Sub-Project</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Wing</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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

                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
                                                <option selected="selected">Select</option>
                                                <option>Lobour</option>
                                                <option>Material</option>
                                                <option>Assest</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Type</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Sub-Type</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material</label>
                                            <select className="form-control form-select" style={{ width: '100%' }}>
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
                                    <div className="col-md-2 mt-2 pt-3">
                                        <button className="purple-btn2">Go</button>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard> */}

                        <CollapsibleCard title="Rate Card">
                            <div className="card-body mt-0 pt-0">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Country`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>State</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select State`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Project</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Project`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
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
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Wing</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Wing`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Category`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Type</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material Type`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material Sub-Type</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material Sub-Type`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mt-2">
                                        <div className="form-group">
                                            <label>Material</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Material`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2 mt-2 pt-3">
                                        <button className="purple-btn2">Go</button>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleCard>


                        <div className="d-flex justify-content-end me-2">
                            {/* Search Form */}
                            <form
                                action="/pms/departments"
                                acceptCharset="UTF-8"
                                method="get"
                                className="pt-2 pe-3"
                            >
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="s[name_cont]"
                                        id="s_name_cont"
                                        className="form-control tbl-search table_search"
                                        placeholder="Type your keywords here"
                                    />
                                    <div className="input-group-append">
                                        <button type="submit" className="btn btn-md btn-default"
                                            style={{
                                                borderTopRightRadius: '5px', // Top-right corner
                                                borderBottomRightRadius: '5px', // Bottom-right corner
                                                borderTopLeftRadius: '0px', // Top-left corner
                                                borderBottomLeftRadius: '0px', // Bottom-left corner
                                            }}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z"
                                                    fill="#8B0203"
                                                ></path>
                                                <path
                                                    d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z"
                                                    fill="#8B0203"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Create Button */}
                            <button className="purple-btn2" data-bs-toggle="modal" data-bs-target="#addnewModal" 
                            // onClick={() => setShowModal(true)}
                            onClick={handleClick}
                            >
                                Create
                            </button>
                        </div>

<div className="mx-3">
                        <div className="tbl-container mt-1">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                    <th className="text-start">Material Type</th>
                                        <th className="text-start">Material</th>
                                        <th className="text-start">Material Sub-Type</th>
                                        <th className="text-start">Generic Specification</th>
                                        <th className="text-start">Colour</th>
                                        <th className="text-start">Brand</th>

                                        <th className="text-start">Effective Date</th>
                                        <th className="text-start">Rate (INR)</th>
                                        <th className="text-start">AVG Rate
                                            {/* <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span> */}
                                        </th>
                                        <th className="text-start">PO Rate
                                            {/* <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span> */}
                                        </th>
                                        <th className="text-start">UOM</th>
                                        <th className="text-start">History</th>
                                        <th className="text-start">Action</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-start"></td>
                                        <td className="text-start">Aggregate</td>
                                        <td className="text-start">Metal 1</td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>

                                        <td className="text-start">June 11 2024</td>
                                        <td className="text-start">0.00</td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start"></td>
                                        <td className="text-start" style={{ color: "#8b0203" }}
                                        // onClick={() => setShowHistoryModal(true)}
                                        >
                                            {/* History */}
                                        </td>
                                        <td className="text-start">
                                            <div className="d-flex justify-content-center">
                                                <span className="mt-2 pt-1"><input type="checkbox" /></span>
                                                <button className="btn  mt-0" onClick={() => setShowEditModal(true)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pencil-square"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                        />
                                                    </svg>
                                                </button>
                                                {/* dustbin add here */}
                                                <button className="btn  mt-0 ps-0">
                                                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                            fill="#B25657"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add new modal */}
            {/* <div className="modal fade" id="addnewModal" tabIndex="-1" aria-labelledby="addnewModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-5" id="exampleModalLabel">Add New</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material Type</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
                                            <option selected="selected">Alabama</option>
                                            <option>Alaska</option>
                                            <option>California</option>
                                            <option>Delaware</option>
                                            <option>Tennessee</option>
                                            <option>Texas</option>
                                            <option>Washington</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material Type</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
                                            <option selected="selected">Alabama</option>
                                            <option>Alaska</option>
                                            <option>California</option>
                                            <option>Delaware</option>
                                            <option>Tennessee</option>
                                            <option>Texas</option>
                                            <option>Washington</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material Sub-Type</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
                                            <option selected="selected">Alabama</option>
                                            <option>Alaska</option>
                                            <option>California</option>
                                            <option>Delaware</option>
                                            <option>Tennessee</option>
                                            <option>Texas</option>
                                            <option>Washington</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
                                            <option selected="selected">Alabama</option>
                                            <option>Alaska</option>
                                            <option>California</option>
                                            <option>Delaware</option>
                                            <option>Tennessee</option>
                                            <option>Texas</option>
                                            <option>Washington</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3 mt-2">
                                    <div className="form-group">
                                        <label>Effective Date</label>
                                        <input className="form-control" type="date" />
                                    </div>
                                </div>
                                <div className="col-md-3 mt-2">
                                    <div className="form-group">
                                        <label>Rate</label>
                                        <input className="form-control" type="number" />
                                    </div>
                                </div>
                                <div className="col-md-3 mt-2">
                                    <div className="form-group">
                                        <label>UOM</label>
                                        <select className="form-control form-select" style={{ width: '100%' }}>
                                            <option selected="selected">Alabama</option>
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
                                <div className="col-md-3">
                                    <button className="purple-btn2 w-100">Create</button>
                                </div>
                                <div className="col-md-3">
                                    <button className="purple-btn1 w-100" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* <Modal centered size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <h5>Add Material</h5>
                </Modal.Header>
                <Modal.Body>

                    <form acceptCharset="UTF-8">
                        <div className="row">


                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material Type</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Material Type`} // Dynamic placeholder
                                        onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material Sub Type</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Material Sub Type`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Material</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Material`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Generic Specification</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Specification`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Colour</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Colour`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">Brand</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select Brand`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label>Effective Date</label>
                                    <input className="form-control" type="date" />
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">

                                    <label>Rate</label>
                                    <input className="form-control" type="number" />

                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <div className="form-group">
                                    <label className="po-fontBold">UOM</label>
                                    <SingleSelector
                                        options={options}
                                        // value={values[label]} // Pass current value
                                        placeholder={`Select UOM`} // Dynamic placeholder
                                    // onChange={(selectedOption) => handleSelectorChange('wing', selectedOption)}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2 justify-content-center mt-5">
                                <div className="col-md-3">
                                    <button className="purple-btn2 w-100">Create</button>
                                </div>
                                <div className="col-md-3">
                                    <button className="purple-btn1 w-100" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>


                </Modal.Body>
            </Modal> */}


            {/* edit modal  */}
            <Modal centered size="lg" show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <h5>Edit Material</h5>
                </Modal.Header>
                <Modal.Body>

                    <div className="tbl-container mx-3 mt-1">
                        <table className="">
                            <thead>
                                <tr>
                                    <th className="text-start">Material Type</th>
                                    <th className="text-start">Material Sub-Type</th>
                                    <th className="text-start">Material</th>
                                   

                                    <th className="text-start">Effective Date</th>
                                    <th className="text-start">Rate (INR)</th>
                                    <th className="text-start">AVG Rate
                                        {/* <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span> */}
                                    </th>
                                    <th className="text-start">PO Rate
                                        {/* <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span> */}
                                    </th>
                                    <th className="text-start">UOM</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-start">Aggregate</td>
                                    <td className="text-start">Aggregate</td>
                                    <td className="text-start">
                                        {/* <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={`Select Sub-Type`} // Dynamic placeholder
                                        // onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}

                                        /> */}
                                    </td>

                                    <td className="text-start">
                                        <input className="form-control" type="date" />
                                    </td>
                                    <td className="text-start">
                                        <input className="form-control" type="number" />
                                    </td>


                                    <td className="text-start">
                                        5
                                        
                                    </td>
                                    <td className="text-start">
                                       10
                                    </td>
                                    <td className="text-start">
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={`Select Sub-Type`} // Dynamic placeholder
                                        // onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}

                                        />
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row mt-2 justify-content-center mt-5">
                        <div className="col-md-3">
                            <button className="purple-btn2 w-100">Update</button>
                        </div>

                    </div>

                </Modal.Body>
            </Modal>


            {/* history modal  */}
            <Modal centered size="lg" show={showHistoryModal} onHide={() => setShowHistoryModal(false)}>
                <Modal.Header closeButton>
                    <h5>History</h5>
                </Modal.Header>
                <Modal.Body>

                    <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                            <thead>
                                <tr>
                                    <th className="text-start">Sr.No.</th>
                                    <th className="text-start">User Name</th>
                                    <th className="text-start">Modified Date</th>


                                    <th className="text-start">Rate (INR)</th>
                                    <th className="text-start">Unit</th>
                                    <th className="text-start">Effective Date</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-start">1</td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>

                                    <td className="text-start"></td>
                                    <td className="text-start"></td>

                                </tr>
                            </tbody>
                        </table>
                    </div>


                </Modal.Body>
            </Modal>
        </>
    )
}

export default ViewRate;