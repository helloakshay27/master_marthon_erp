import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";

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

    return (
        <>


            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">
                    <a href="">
                        <a href="">Setup &gt; Engineering Setup &gt; Rate</a>
                    </a>
                    <h5 class="mt-4">Rate Card</h5>
                    <div className="card mt-3 pb-3">

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
                            <button className="purple-btn2" data-bs-toggle="modal" data-bs-target="#addnewModal">
                                Create
                            </button>
                        </div>


                        <div className="tbl-container mx-3 mt-1">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th className="text-start">Material</th>
                                        <th className="text-start">Material Sub-Type</th>
                                        <th className="text-start">Material</th>
                                        <th className="text-start">Effective Date</th>
                                        <th className="text-start">Rate (INR)</th>
                                        <th className="text-start">UOM</th>
                                        <th className="text-start">History</th>
                                        <th className="text-start">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-start">Aggregate</td>
                                        <td className="text-start">Metal 1</td>
                                        <td className="text-start"></td>
                                        <td className="text-start">June 11 2024</td>
                                        <td className="text-start">0.00</td>
                                        <td className="text-start"></td>
                                        <td className="text-start" data-bs-toggle="modal" data-bs-target="#avgpoModal">
                                            History
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <input className="pe-2" type="checkbox" />
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
                                                {/* dustbin add here */}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>

            {/* Add new modal */}
            <div className="modal fade" id="addnewModal" tabIndex="-1" aria-labelledby="addnewModalLabel" aria-hidden="true">
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
            </div>
        </>
    )
}

export default ViewRate;