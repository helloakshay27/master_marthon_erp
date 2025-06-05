import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { DownloadIcon } from "../components";
import {
    Table
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleSelector from '../components/base/Select/SingleSelector';
import { baseURL } from '../confi/apiDomain';
const RuleEngineDetails = () => {
    // const [showRows, setShowRows] = useState(false);
    const { id } = useParams();
    const [ruleData, setRuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchRuleData = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}rule_engine/rules/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                );
                setRuleData(response.data);
                setLoading(false);
            } catch (err) {
                // setRuleData(null);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRuleData();
    }, [id]);

    function toTitleCaseFromSnake(str) {
        if (!str) return "";
        return str
            .replace(/_/g, " ")
            .replace(/\s+/g, " ")
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    // Add these states at the top of your component
    const [masterRewardOptions, setMasterRewardOptions] = useState({});
    const [subRewardMapping, setSubRewardMapping] = useState({});

    // Add this useEffect to fetch and store the mappings
    useEffect(() => {
        // Fetch master reward options
        axios
            .get(
                `${baseURL}rule_engine/available_functions.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((response) => {
                // Create mapping of id to display_name
                const mapping = {};
                response.data.forEach((item) => {
                    mapping[item.id] = {
                        name: item.display_name,
                        subOptions: {},
                    };
                    // Fetch sub-options for each master option
                    axios
                        .get(
                            `${baseURL}rule_engine/available_functions.json?q[available_model_id]=${item.id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
                        )
                        .then((subResponse) => {
                            const subMapping = {};
                            subResponse.data.forEach((subItem) => {
                                subMapping[subItem.id] = subItem.display_name;
                            });
                            setSubRewardMapping((prev) => ({
                                ...prev,
                                [item.id]: subMapping,
                            }));
                        });
                });
                setMasterRewardOptions(mapping);
            })
            .catch((error) => {
                console.error("Error fetching reward mappings:", error);
            });
    }, []);

    const masterOperators = [
        {
            id: "0",
            name: "Common Operatives",
            subOptions: [
                { id: "1", name: "Greater than", value: "greater_than" },
                { id: "2", name: "Less than (<)", value: "less_than" },
                { id: "3", name: "Equals (=)", value: "equals" },
                { id: "4", name: "Not equals (!=)", value: "not_equals" },
                { id: "5", name: "Contains", value: "contains" },
                { id: "6", name: "Does not contain", value: "does_not_contain" },
            ],
        },
        {
            id: "1",
            name: "Logical Operatives",
            subOptions: [
                { id: "1", name: "AND", value: "and" },
                { id: "2", name: "OR", value: "or" },
                { id: "3", name: "NOT", value: "not" },
            ],
        },
        {
            id: "2",
            name: "Date/Time Operatives",
            subOptions: [
                { id: "1", name: "Before", value: "before" },
                { id: "2", name: "After", value: "after" },
                { id: "3", name: "Between", value: "between" },
                { id: "4", name: "Within", value: "within" },
            ],
        },
        //   {
        //     id: "3",
        //     name: "Tier Operatives",
        //     subOptions: [
        //       { id: "1", name: "Is in tier", value: "is_in_tier" },
        //       { id: "2", name: "Upgrade", value: "upgrade" },
        //       { id: "3", name: "Downgrade", value: "downgrade" },
        //     ],
        //   },
    ];

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section ms-2 ">
                    <a href="">Rule Engine  &gt; Rule Details </a>
                    <h5 className="mt-3">Rule Details </h5>
                    <div className="row container-fluid my-4 align-items-center">
                        <div className="col-md-12 px-2">
                            <div className="tab-content mor-content active" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <section className="mor p-2 pt-2">
                                        <div className="card card-default" id="mor-material-details">
                                            <div className="card-body">
                                                <div className="details_page">
                                                    <div className="row px-3">
                                                        <div className="col-lg-4 col-md-6 col-sm-12 row px-3 ">
                                                            <div className="col-6 ">
                                                                <label>Rule Name</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="text">
                                                                    <span className="me-3"><span className="text-dark">:</span></span>
                                                                    {ruleData?.name}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* All Conditions in one card */}
                                        <div className="card card-default my-3">
                                            <div className="card-body">
                                                <div className="details_page">
                                                    {/* <h5 className="mb-3">Conditions</h5> */}
                                                    {ruleData?.conditions.map((condition, idx) => (
                                                        <div className="row px-3 mb-2" key={condition.id}>
                                                            <div className="col-12 mb-1">
                                                                <strong>Condition {idx + 1}</strong>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Master Attribute</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{condition.model_name || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Attribute</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.condition_attribute) || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Master Operator</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>
                                                                    {/* {toTitleCaseFromSnake(condition.master_operator) || "-"} */}
                                                                    {
                                                                        masterOperators.find(op => op.id === String(condition.master_operator))?.name || "-"
                                                                    }
                                                                </label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Operator</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.operator) || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Value</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{condition.compare_value || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Condition Type</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{condition.condition_type || "-"}</label></div>
                                                            </div>
                                                            <hr className="my-2" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* All Actions in one card */}
                                        <div className="card card-default my-3">
                                            <div className="card-body">
                                                <div className="details_page">
                                                    {/* <h5 className="mb-3">Actions</h5> */}
                                                    {ruleData?.actions.length > 0 && (
                                                        <div className="row px-3 mb-2" key={ruleData.actions[0].id}>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Master Reward Outcome </label></div>
                                                                <div className="col-6">
                                                                    <label className="text">
                                                                        <span className="me-3"><span className="text-dark">:</span></span>
                                                                        {toTitleCaseFromSnake(ruleData.actions[0].action_method) || "-"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Reward Outcome</label></div>
                                                                <div className="col-6">
                                                                    <label className="text">
                                                                        <span className="me-3"><span className="text-dark">:</span></span>

                                                                        {(ruleData.actions[0].action_selected_model &&
                                                                            subRewardMapping[
                                                                            ruleData.actions[0].rule_engine_available_function_id
                                                                            ]?.[ruleData.actions[0].action_selected_model]) ||
                                                                            ruleData.actions[0].action_selected_model}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Parameter</label></div>
                                                                <div className="col-6">
                                                                    <label className="text">
                                                                        <span className="me-3"><span className="text-dark">:</span></span>
                                                                        {ruleData.actions[0].parameters || "-"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="loader-container">
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p>Loading...</p>
                </div>
            )}
        </>
    )
}

export default RuleEngineDetails;