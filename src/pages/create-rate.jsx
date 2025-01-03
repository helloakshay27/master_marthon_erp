import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed

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
                                data-bs-target="#addnewModal">
                                Add New
                            </button>
                        </div>

                        {/* <div className="mx-3"> */}
                        <div className="tbl-container mx-3 mt-1">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th className="text-start">Material</th>
                                        <th className="text-start">Material Sub-Type</th>
                                        
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-start">Aggregate</td>
                                        <td className="text-start">Metal 1</td>
                                      
                                        <td><input type="date" /></td>
                                        <td><input type="number" /></td>
                                        <td className="text-start">
                                            <span data-bs-toggle="modal" data-bs-target="#avgpoModal">5</span>
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span>
                                        </td>
                                        <td className="text-start">
                                            <span data-bs-toggle="modal" data-bs-target="#avgpoModal">10</span>
                                            <span className="ms-2 pt-2">
                                                <input type="checkbox" />
                                            </span>
                                        </td>
                                        <td className="text-start">MT</td>
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

export default CreateRate;