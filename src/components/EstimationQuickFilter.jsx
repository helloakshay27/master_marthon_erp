import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed

const EstimationQuickFilter = () => {

    const options = [
        { value: "alabama", label: "Alabama" },
        { value: "alaska", label: "Alaska" },
        { value: "california", label: "California" },
        { value: "delaware", label: "Delaware" },
        { value: "tennessee", label: "Tennessee" },
        { value: "texas", label: "Texas" },
        { value: "washington", label: "Washington" },
    ];

    // State for each dropdown
    const [values, setValues] = useState({
        Company: null,
        Project: null,
        "Sub-Project": null,
        Wings: null,
    });

    // Handle change for each dropdown
    const handleChange = (label, selectedOption) => {
        setValues((prev) => ({
            ...prev,
            [label]: selectedOption,
        }));
    };




    return (
        <>
            <CollapsibleCard title="Quick Filter">
                {/* <div className="card-body pt-0 mt-0">
                <div className="row my-2 align-items-end">
                  {["Company", "Project", "Sub-Project", "Wings"].map((label, idx) => (
                    <div className="col-md-2" key={idx}>
                      <div className="form-group">
                        <label>{label}</label>
                        <select className="form-control form-select" style={{ width: "100%" }}>
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
                  ))}
                  <div className="col-md-2">
                    <button className="purple-btn2 m-0">Go</button>
                  </div>
                </div>
              </div> */}
                <div className="card-body pt-0 mt-0">
                    <div className="row my-2 align-items-end">
                        {["Company", "Project", "Sub-Project", "Wings"].map((label, idx) => (
                            <div className="col-md-2" key={idx}>
                                <div className="form-group">
                                    <label>{label}</label>
                                    <SingleSelector
                                        options={options}
                                        value={values[label]} // Pass current value
                                        onChange={(selectedOption) => handleChange(label, selectedOption)} // Update state on change
                                        placeholder={`Select ${label}`} // Dynamic placeholder
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="col-md-2">
                            <button
                                className="purple-btn2 m-0"
                                onClick={() => console.log("Selected Values:", values)} // Log selected values on button click
                            >
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </CollapsibleCard>

        </>
    );
}

export default EstimationQuickFilter;