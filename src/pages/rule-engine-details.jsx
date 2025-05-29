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
                    `https://marathon.lockated.com/rule_engine/rules/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
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

    const staticRuleData = {
        id: 8,
        name: "rule test",
        active: true,
        created_at: "2025-05-28T16:46:14.752+05:30",
        conditions: [
            {
                id: 10,
                condition_attribute: "refferal_code",
                operator: "greater_than",
                compare_value: "100",
                action_type: "created",
                condition_selected_model: null,
                condition_type: "",
                master_operator: "Common Operator1",
                model_name: "No applicable model"
            },
            {
                id: 11,
                condition_attribute: "user_type",
                operator: "greater_than",
                compare_value: "200",
                action_type: "created",
                condition_selected_model: null,
                condition_type: "AND",
                master_operator: "Common Operator1",
                model_name: "No applicable model"
            },
            {
                id: 12,
                condition_attribute: "refferal_code",
                operator: "greater_than",
                compare_value: "300",
                action_type: "created",
                condition_selected_model: null,
                condition_type: "OR",
                master_operator: "Common Operator1",
                model_name: "No applicable model"
            }
        ],
        actions: [
            {
                id: 9,
                lock_model_name: "refferal_code",
                action_method: "calculate_loyalty_points",
                parameters: null
            },
            {
                id: 10,
                lock_model_name: "user_type",
                action_method: "calculate_loyalty_points",
                parameters: null
            },
            {
                id: 11,
                lock_model_name: "refferal_code",
                action_method: "calculate_loyalty_points",
                parameters: null
            }
        ]
    };
    // const ruleData = staticRuleData;


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
                                                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Status</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3"><span className="text-dark">:</span></span>
                                  {ruleData.active ? "Active" : "Inactive"}
                                </label>
                              </div>
                            </div> */}
                                                        {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                              <div className="col-6 ">
                                <label>Created At</label>
                              </div>
                              <div className="col-6">
                                <label className="text">
                                  <span className="me-3"><span className="text-dark">:</span></span>
                                  {ruleData.created_at ? new Date(ruleData.created_at).toLocaleString() : "-"}
                                </label>
                              </div>
                            </div> */}
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
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{"-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Attribute</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.condition_attribute) || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Master Operator</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.master_operator) || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Sub Operator</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.operator) || "-"}</label></div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                                                <div className="col-6"><label>Value</label></div>
                                                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{condition.compare_value || "-"}</label></div>
                                                            </div>
                                                            {/* <div className="col-lg-4 col-md-6 col-sm-12 row px-3">
                                <div className="col-6"><label>Action Type</label></div>
                                <div className="col-6"><label className="text"><span className="me-3"><span className="text-dark">:</span></span>{toTitleCaseFromSnake(condition.action_type) || "-"}</label></div>
                              </div> */}

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
                                                                        {"-"}
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