import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";

const options = [
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "california", label: "California" },
    { value: "delaware", label: "Delaware" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
];


const CreateRate = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [rate, setRate] = useState('');
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [isEditing, setIsEditing] = useState(false);  // State to manage edit mode
    // // Handle edit button click
    // const handleEditClick = () => {
    //     setIsEditing(!isEditing);  // Toggle edit mode
    // };

    // Handle rate input change
    const handleRateChange = (e) => {
        const value = e.target.value;
        setRate(value);
        setCheckbox1(false);
        setCheckbox2(false);

    };

    // Handle checkbox change
    const handleCheckboxChange = (checkboxNum) => {
        if (checkboxNum === 1) {
            setCheckbox1(!checkbox1);
            // Disable the rate input and checkbox 2 when checkbox 1 is selected
            if (!checkbox1) {
                setCheckbox2(false);  // Deselect checkbox 2
                setRate('');           // Clear rate input
            }
        } else if (checkboxNum === 2) {
            setCheckbox2(!checkbox2);
            // Disable the rate input and checkbox 1 when checkbox 2 is selected
            if (!checkbox2) {
                setCheckbox1(false);  // Deselect checkbox 1
                setRate('');           // Clear rate input
            }
        }
    };

    const [formData, setFormData] = useState({
        materialType: '',
        materialSubType: '',
        material: '',
        effectiveDate: '',
        rate: '',
        uom: '',
    });

    const handleSelectorChange = (field, selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: selectedOption,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreate = () => {
        console.log(formData);
        // Handle form submission logic (e.g., API call)
        setShowModal(false);  // Close modal after submit
    };


    return (
        <>


            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Create Rate</h5>
                    <div className="card mt-3 pb-3">

                        <CollapsibleCard title="Create Rate">
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
                                            <label>Item Type</label>
                                            <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Item Type`} // Dynamic placeholder
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
                        <div className="d-flex justify-content-end mx-2">
                            <button className="purple-btn2">Bulk Upload</button>
                            <button
                                className="purple-btn2"
                                data-bs-toggle="modal"
                                data-bs-target="#addnewModal"
                                onClick={() => setShowModal(true)}
                            >
                                Add New
                            </button>
                        </div>

                        {/* <div className="mx-3"> */}
                        <div className="tbl-container mx-3 mt-1">
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
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span>
                                        </th>
                                        <th className="text-start">PO Rate
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span>
                                        </th>
                                        <th className="text-start">UOM</th>
                                        <th className="text-start">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-start">
                                            {/* <input
                                                className="form-control"
                                                type="text"
                                                placeholder="SAND"
                                                disabled
                                            /> */}
                                        </td>
                                        <td className="text-start"></td>
                                        <td className="text-start">
                                            {/* <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Sub-Type`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                                                isDisabled={!isEditing}
                                            /> */}
                                        </td>

                                        <td className="text-start">

                                            {/* <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Specification`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                                                isDisabled={!isEditing}
                                            /> */}
                                        </td>
                                        <td className="text-start">
                                            {/* <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Colour`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                                                isDisabled={!isEditing}
                                            /> */}
                                        </td>
                                        <td className="text-start">
                                            {/* <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select Brand`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                                                isDisabled={!isEditing}
                                            /> */}
                                        </td>

                                        <td className="text-start"> </td>
                                        <td><input className="form-control" type="number"
                                            value={rate}
                                            onChange={handleRateChange}
                                            disabled={checkbox1 || checkbox2}
                                            placeholder="Add Rate (INR)"
                                        /></td>
                                        <td className="text-start">
                                            <span data-bs-toggle="modal" data-bs-target="#avgpoModal">5</span>
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox"
                                                    checked={checkbox1}
                                                    onChange={() => handleCheckboxChange(1)}
                                                    disabled={rate || checkbox2}
                                                />
                                            </span>
                                        </td>
                                        <td className="text-start">
                                            <span data-bs-toggle="modal" data-bs-target="#avgpoModal">10</span>
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox"
                                                    checked={checkbox2}
                                                    onChange={() => handleCheckboxChange(2)}
                                                    disabled={rate || checkbox1}
                                                />
                                            </span>
                                        </td>
                                        <td className="text-start">
                                            {/* <SingleSelector
                                                options={options}
                                                // value={values[label]} // Pass current value
                                                // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                                placeholder={`Select UOM`} // Dynamic placeholder
                                                onChange={(selectedOption) => handleSelectorChange('subCategoryLvl4', selectedOption)}
                                                isDisabled={!isEditing}
                                            /> */}
                                        </td>
                                        <td className="text-start">

                                            {/* <button
                                                className="btn mt-0 pt-0 ">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="#8b0203"
                                                    class="bi bi-eye"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                                </svg>{" "}

                                            </button> */}

                                            <Link to="/view-rate" className="btn mt-0 pt-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#8b0203"
      className="bi bi-eye"
      viewBox="0 0 16 16"
    >
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
    </svg>
  </Link>
                                            <span> <input type="checkbox" /></span>
                                            <button className="btn mt-0 pt-0 " onClick={() => setShowEditModal(true)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-pencil-square"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                    ></path>
                                                </svg>

                                            </button>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* </div> */}

                    </div>
                    <div className="row mt-2 justify-content-center">
                        <div className="col-md-2">
                            <button className="purple-btn2 w-100">Create</button>
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
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={`select Material Type`} // Dynamic placeholder
                                            onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material Sub-Type</label>
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={``} // Dynamic placeholder
                                            onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material</label>
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={``} // Dynamic placeholder
                                            onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Material</label>
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={``} // Dynamic placeholder
                                            onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                        />
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
                                        <SingleSelector
                                            options={options}
                                            // value={values[label]} // Pass current value
                                            // onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                            placeholder={``} // Dynamic placeholder
                                            onChange={(selectedOption) => handleSelectorChange('project', selectedOption)}
                                        />
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

{/* create modal  */}
            <Modal centered size="lg" show={showModal} onHide={() => setShowModal(false)}>
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
            </Modal>

            {/* edit modal  */}
            <Modal centered size="lg" show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <h5>Edit Material</h5>
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
            </Modal>
            {/* Modal */}


        </>
    )
}

export default CreateRate;