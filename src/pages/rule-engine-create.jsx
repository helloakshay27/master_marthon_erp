import React, { useEffect, useState } from "react";
// import SubHeader from "../components/SubHeader";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import "../styles/mor.css";


const RuleEngineCreate = () => {
    const options = [
        { value: "alabama", label: "Alabama" },
        { value: "alaska", label: "Alaska" },
        { value: "california", label: "California" },
        { value: "delaware", label: "Delaware" },
        { value: "tennessee", label: "Tennessee" },
        { value: "texas", label: "Texas" },
        { value: "washington", label: "Washington" },
    ];
    const initialCondition = {
        masterAttribute: "",
        subAttribute: "",
        masterOperator: "",
        subOperator: "",
        value: "",
        conditionType: "",
    };

    const [conditions, setConditions] = useState([{ ...initialCondition }]);
    const [ruleName, setRuleName] = useState("");
    // THEN section state
    const [masterRewardOutcome, setMasterRewardOutcome] = useState("");
    const [subRewardOutcome, setSubRewardOutcome] = useState("");
    const [parameter, setParameter] = useState("");


    const addCondition = () => {
        setConditions([...conditions, { ...initialCondition }]);
    };

    // Handle field changes for each condition
    const handleConditionChange = (idx, field, value) => {
        setConditions(prev =>
            prev.map((cond, i) =>
                i === idx ? { ...cond, [field]: value } : cond
            )
        );
    };
    // Remove condition
    const removeCondition = idx => {
        setConditions(conditions.filter((_, i) => i !== idx));
    };


    const payload = {
        ruleName,
        conditions,
        then: {
            masterRewardOutcome,
            subRewardOutcome,
            parameter,
        },
    };
    console.log("Payload:", payload);

    // Handle submit
    const handleSubmit = e => {
        e.preventDefault();
        // Build payload
        const payload = {
            ruleName,
            conditions,
        };
        console.log("Payload:", payload);
        // Send payload to API here
    };

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="">Rule Engine &gt; Create Rule</a>
                    </a>
                    <h5 class="mt-4">Create Rule</h5>
                    <div className="card mt-3 pb-">

                        <div className="card m-3">
                            <div className="card-body">
                                <div className="col-md-6 ">
                                    <div className="form-group">
                                        <label>New Rule <span>*</span></label>
                                        <input
                                            //   disabled
                                            value={ruleName}
                                            onChange={e => setRuleName(e.target.value)}
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Rule Name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
                            <div className="mx-3">
                                <h5 className="title mt-3">Set Rule Conditions</h5>
                                {conditions.map((condition, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h6 className="mt-3">
                                            <span>
                                                Condition {idx + 1}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-pencil-square mb-1 ms-3 text-body-secondary"
                                                    viewBox="0 0 16 16"
                                                ></svg>
                                            </span>
                                            {idx > 0 && (
                                                <button
                                                    className="purple-btn2"
                                                    // style={{ color: "#8b0203", fontSize: "20px", lineHeight: "1" }}
                                                    // onClick={() => {
                                                    //     setConditions(conditions.filter((_, i) => i !== idx));
                                                    // }}
                                                    onClick={() => removeCondition(idx)}
                                                    title="Remove Condition"
                                                >
                                                    {/* <span>Remove Condition</span> */}

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </h6>
                                        {idx > 0 && (

                                            // <ul className="nav nav-tabs border-0 mt-3">
                                            //     <div className="d-flex gap-3 And-btn rounded">
                                            //         <li className="nav-item d-flex p-2 gap-2" role="presentation">
                                            //             <input
                                            //                 type="radio"
                                            //                 className="nav-link"
                                            //                 id={`and-tab-${idx}`}
                                            //                 name={`condition-type-${idx}`}
                                            //                 value="AND"
                                            //                 checked={condition.conditionType === "AND"}
                                            //                 onChange={() => handleConditionChange(idx, "conditionType", "AND")}

                                            //             />
                                            //             <label htmlFor={`and-tab-${idx}`} className="and-or-btn">
                                            //                 AND
                                            //             </label>
                                            //         </li>
                                            //         <li className="nav-item d-flex p-2 gap-2" role="presentation">
                                            //             <input
                                            //                 type="radio"
                                            //                 className="nav-link"
                                            //                 id={`or-tab-${idx}`}
                                            //                 name={`condition-type-${idx}`}
                                            //                 value="OR"
                                            //                 checked={condition.conditionType === "OR"}
                                            //                 onChange={() => handleConditionChange(idx, "conditionType", "OR")}
                                            //             />
                                            //             <label htmlFor={`or-tab-${idx}`} className="and-or-btn">
                                            //                 OR
                                            //             </label>
                                            //         </li>
                                            //     </div>
                                            // </ul>
                                            <ul className="nav nav-tabs border-0 mt-3">
                                                <div className="d-flex gap-3 And-btn rounded custom-radio-lg">
                                                    <li className="nav-item d-flex p-2 gap-2" role="presentation">
                                                        <input
                                                            type="radio"
                                                            className="nav-link"
                                                            id={`and-tab-${idx}`}
                                                            name={`condition-type-${idx}`}
                                                            value="AND"
                                                            checked={condition.conditionType === "AND"}
                                                            onChange={() => handleConditionChange(idx, "conditionType", "AND")}
                                                        />
                                                        <label htmlFor={`and-tab-${idx}`} className="and-or-btn">
                                                            AND
                                                        </label>
                                                    </li>
                                                    <li className="nav-item d-flex p-2 gap-2" role="presentation">
                                                        <input
                                                            type="radio"
                                                            className="nav-link"
                                                            id={`or-tab-${idx}`}
                                                            name={`condition-type-${idx}`}
                                                            value="OR"
                                                            checked={condition.conditionType === "OR"}
                                                            onChange={() => handleConditionChange(idx, "conditionType", "OR")}
                                                        />
                                                        <label htmlFor={`or-tab-${idx}`} className="and-or-btn">
                                                            OR
                                                        </label>
                                                    </li>
                                                </div>
                                            </ul>
                                        )}
                                        <div className="border-btm pb-2 mt-2">
                                            {/* IF Section */}
                                            <div>
                                                <h4>
                                                    <span
                                                        className="badge setRuleCard"
                                                        style={{
                                                            color: "#8b0203",
                                                            backgroundColor: "#E954202E",
                                                        }}
                                                    >
                                                        IF
                                                    </span>
                                                </h4>
                                                <div className="row mt-2">
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label>
                                                                Master Attribute <span>*</span>
                                                            </label>
                                                            <SingleSelector
                                                                options={options}
                                                                value={options.find(opt => opt.value === condition.masterAttribute)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "masterAttribute", selected ? selected.value : "")
                                                                }
                                                                placeholder="Select Master Attribute"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-1 d-flex justify-content-center align-items-center">
                                                        <h4>&</h4>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label>
                                                                Sub Attribute <span>*</span>
                                                            </label>
                                                            <SingleSelector
                                                                options={options}
                                                                value={options.find(opt => opt.value === condition.subAttribute)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "subAttribute", selected ? selected.value : "")
                                                                }
                                                                placeholder="Select Sub Attribute"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Operator Section */}
                                            <div className="mt-3">
                                                <h4>
                                                    <span
                                                        className="badge setRuleCard"
                                                        style={{
                                                            color: "#8b0203",
                                                            backgroundColor: "#E954202E",
                                                        }}
                                                    >
                                                        Operator
                                                    </span>
                                                </h4>
                                                <div className="row mt-2">
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label>
                                                                Master Operator <span>*</span>
                                                            </label>
                                                            <SingleSelector
                                                                options={options}
                                                                placeholder="Select Master Operator"
                                                                value={options.find(opt => opt.value === condition.masterOperator)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "masterOperator", selected ? selected.value : "")
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-1 d-flex justify-content-center align-items-center">
                                                        <h4>&</h4>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label>
                                                                Sub Operator <span>*</span>
                                                            </label>
                                                            <SingleSelector
                                                                options={options}
                                                                placeholder="Select Sub Operator"
                                                                value={options.find(opt => opt.value === condition.subOperator)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "subOperator", selected ? selected.value : "")
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Value Section */}
                                            <div className="mt-3">
                                                <h4>
                                                    <span
                                                        className="badge setRuleCard"
                                                        style={{
                                                            color: "#8b0203",
                                                            backgroundColor: "#E954202E",
                                                        }}
                                                    >
                                                        Value
                                                    </span>
                                                </h4>
                                                <div className="row mt-2">
                                                    <div className="col-md-4 mt-2">
                                                        <div className="form-group">
                                                            <label>
                                                                Value<span>*</span>
                                                            </label>
                                                            <div
                                                                id="datepicker"
                                                                className="input-group date"
                                                                data-date-format="mm-dd-yyyy"
                                                            >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="creditNoteDate"
                                                                    value={condition.value}
                                                                    onChange={e =>
                                                                        handleConditionChange(idx, "value", e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="purple-btn2" onClick={addCondition}>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            fill="currentColor"
                                            className="bi bi-plus"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                        </svg>
                                    </span>
                                    Add Additional Condition
                                </button>
                            </div>

                            {/* THEN section */}

                            <div className="mt-3 p-3 mb-5">
                                <h4>
                                    <span
                                        className="badge setRuleCard"
                                        style={{
                                            color: "#8b0203",
                                            backgroundColor: "#E954202E",
                                        }}
                                    >
                                        THEN
                                    </span>
                                </h4>
                                <div className="row  mt-2">
                                    <div className="col-md-4 ">
                                        <div className="form-group">
                                            <label>
                                                Master Reward Outcome <span>*</span>
                                            </label>
                                            <SingleSelector
                                                options={options}
                                                value={options.find(opt => opt.value === masterRewardOutcome)}
                                                onChange={selected =>
                                                    setMasterRewardOutcome(selected ? selected.value : "")
                                                }
                                                placeholder={`Select  Master Reward Outcome`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-1 d-flex justify-content-center align-items-center">
                                        <h4>&</h4>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="form-group">
                                            <label>
                                                Sub Reward Outcome <span>*</span>
                                            </label>
                                            <SingleSelector
                                                options={options}
                                                value={options.find(opt => opt.value === subRewardOutcome)}
                                                onChange={selected =>
                                                    setSubRewardOutcome(selected ? selected.value : "")
                                                }
                                                placeholder={`Select Sub Reward Outcome`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Parameter <span>*</span></label>
                                            <div
                                                id="datepicker"
                                                className="input-group date"
                                                data-date-format="mm-dd-yyyy"
                                            >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="creditNoteDate"
                                                    value={parameter}
                                                    onChange={e => setParameter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4 mb-5 justify-content-center w-100">
                            {/* <div className="col-md-2">
                    <button className="purple-btn2 w-100">Print</button>
                  </div> */}
                            <div className="col-md-2">
                                <button className="purple-btn2 w-100" >Submit</button>
                            </div>
                            <div className="col-md-2">
                                <button className="purple-btn1 w-100">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RuleEngineCreate;
