import React, { useEffect, useState } from "react";
// import SubHeader from "../components/SubHeader";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import "../styles/mor.css";
import { useNavigate } from "react-router-dom";

const staticRuleData = {
  id: 8,
  name: "rule test",
  active: true,
  created_at: "2025-05-28T16:46:14.752+05:30",
  conditions: [
    {
      id: 10,
      model_id: 1,
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
      model_id: 1,
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
      model_id: 1,
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
      parameters: "100",
      rule_engine_available_function_id: 1,
    }
  ]
};

const RuleEngineEdit = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [thenError, setThenError] = useState({});
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
        model_id: "", // master attribute 
        condition_attribute: "", //sub atrribute 
        master_operator: "", //master operator
        operator: "",    //sub operator 
        compare_value: "",
        condition_type: "",
        // action_type: "created",

    };

    const toSnakeCase = str =>
        str &&
        str
            .replace(/\s+/g, '_')         // Replace spaces with underscores
            .replace(/[A-Z]/g, letter =>
                `${letter.toLowerCase()}`
            ) // Add _ before uppercase and lowercase it
            .replace(/^_+/, '')           // Remove leading underscores
            .toLowerCase();

    const [conditions, setConditions] = useState(staticRuleData.conditions);
    const [ruleName, setRuleName] = useState(staticRuleData.name);
    // THEN section state
    const [masterRewardOutcome, setMasterRewardOutcome] = useState(staticRuleData.actions[0]?.rule_engine_available_function_id || "");
    const [subRewardOutcome, setSubRewardOutcome] = useState("");
    const [parameter, setParameter] = useState(staticRuleData.actions[0]?.parameters || "");


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

    // ...existing code...
    const [masterAttributeOptions, setMasterAttributeOptions] = useState([]);
    const [subAttributeOptions, setSubAttributeOptions] = useState({}); // key: condition idx, value: options array

    // Fetch master attribute options on mount
    useEffect(() => {
        axios
            .get("https://marathon.lockated.com/rule_engine/available_models.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414")
            .then((response) => {
                // Assuming response.data is an array of objects with 'id' and 'name'
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.display_name
                }));
                setMasterAttributeOptions(options);
            })
            .catch((error) => {
                console.error("Error fetching master attributes:", error);
            });
    }, []);

    useEffect(() => {
    // For each condition, if model_id exists, fetch sub-attributes
    conditions.forEach((condition, idx) => {
        if (condition.model_id) {
            axios
                .get(`https://marathon.lockated.com/rule_engine/available_attributes.json?q[available_model_id_eq]=${condition.model_id}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                .then((response) => {
                    const options = response.data.map(item => ({
                        value: toSnakeCase(item.display_name),
                        label: item.display_name
                    }));
                    setSubAttributeOptions(prev => ({
                        ...prev,
                        [idx]: options
                    }));
                })
                .catch(() => {
                    setSubAttributeOptions(prev => ({
                        ...prev,
                        [idx]: []
                    }));
                });
        }
    });
    // eslint-disable-next-line
}, []);
    // Fetch sub-attributes when master attribute changes for a condition
    const handleMasterAttributeChange = (idx, selectedValue) => {
        handleConditionChange(idx, "model_id", selectedValue);
        handleConditionChange(idx, "condition_attribute", ""); // Reset sub-attribute

        if (selectedValue) {
            axios
                .get(`https://marathon.lockated.com/rule_engine/available_attributes.json?q[available_model_id_eq]=${selectedValue}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                .then((response) => {
                    const options = response.data.map(item => ({
                        value: toSnakeCase(item.display_name),
                        label: item.display_name
                    }));
                    console.log("sub options", options)
                    setSubAttributeOptions(prev => ({
                        ...prev,
                        [idx]: options
                    }));
                })
                .catch((error) => {
                    setSubAttributeOptions(prev => ({
                        ...prev,
                        [idx]: []
                    }));
                    console.error("Error fetching sub attributes:", error);
                });
        } else {
            setSubAttributeOptions(prev => ({
                ...prev,
                [idx]: []
            }));
        }
    };

    // console.log("sub attriL", subAttributeOptions)

    const [masterRewardOptions, setMasterRewardOptions] = useState([]);
    const [subRewardOptions, setSubRewardOptions] = useState([]);
    // Fetch Master Reward Outcome options on mount
    useEffect(() => {
        axios
            .get("https://marathon.lockated.com/rule_engine/available_functions.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414")
            .then((response) => {
                // Assuming response.data is an array of objects with 'id' and 'display_name'
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.display_name
                }));
                setMasterRewardOptions(options);
            })
            .catch((error) => {
                console.error("Error fetching master reward outcomes:", error);
            });
    }, []);

    // Fetch sub reward options when masterRewardOutcome changes
    useEffect(() => {
        if (masterRewardOutcome) {
            axios
                .get(`https://marathon.lockated.com/rule_engine/available_functions.json?q[available_model_id]=${masterRewardOutcome}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                .then((response) => {
                    const options = response.data.map(item => ({
                        value: item.id,
                        label: item.display_name
                    }));
                    setSubRewardOptions(options);
                })
                .catch((error) => {
                    setSubRewardOptions([]);
                    console.error("Error fetching sub reward outcomes:", error);
                });
        } else {
            setSubRewardOptions([]);
        }
    }, [masterRewardOutcome]);

    const [masterOperatorOptions, setMasterOperatorOptions] = useState([]);
    const [subOperatorOptions, setSubOperatorOptions] = useState({}); // key: condition idx, value: options array
    // Fetch master operator options on mount
    useEffect(() => {
        axios
            .get("https://marathon.lockated.com/rule_engine/conditions.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414")
            .then((response) => {
                // Filter out unique master_operator values and ignore null/empty
                const operators = response.data
                    .map(item => item.master_operator)
                    .filter((op, idx, arr) => op && arr.indexOf(op) === idx)
                    .map(op => ({
                        value: op,
                        label: op
                    }));
                setMasterOperatorOptions(operators);
            })
            .catch((error) => {
                console.error("Error fetching master operators:", error);
            });
    }, []);

    useEffect(() => {
  conditions.forEach((condition, idx) => {
    if (condition.master_operator) {
      axios
        .get(`https://marathon.lockated.com/rule_engine/conditions.json?q[rule_id]=${condition.master_operator}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
        .then((response) => {
          const options = response.data
            .map(item => {
              if (!item.operator) return null;
              const label = item.operator
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return {
                value: item.operator,
                label
              };
            })
            .filter((op, idx2, arr) => op && arr.findIndex(o => o.value === op.value) === idx2);
          setSubOperatorOptions(prev => ({
            ...prev,
            [idx]: options
          }));
        })
        .catch(() => {
          setSubOperatorOptions(prev => ({
            ...prev,
            [idx]: []
          }));
        });
    }
  });
  // eslint-disable-next-line
}, []);

    // Fetch sub operators when master operator changes for a condition
    const handleMasterOperatorChange = (idx, selectedValue) => {
        handleConditionChange(idx, "master_operator", selectedValue);
        handleConditionChange(idx, "operator", ""); // Reset sub-operator

        if (selectedValue) {
            // Find the selected master operator's id (assuming value is id)
            const selectedOperator = masterOperatorOptions.find(op => op.value === selectedValue);
            if (selectedOperator) {
                axios
                    .get(`https://marathon.lockated.com/rule_engine/conditions.json?q[rule_id]=${selectedValue}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`)
                    .then((response) => {
                        // Map sub operators from response (assuming 'operator' field)
                        const options = response.data
                            .map(item => {
                                if (!item.operator) return null;
                                const label = item.operator
                                    .split('_')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                                return {
                                    value: item.operator,
                                    label
                                };
                            })
                            .filter((op, idx, arr) => op.value && arr.findIndex(o => o.value === op.value) === idx);
                        setSubOperatorOptions(prev => ({
                            ...prev,
                            [idx]: options
                        }));
                    })
                    .catch((error) => {
                        setSubOperatorOptions(prev => ({
                            ...prev,
                            [idx]: []
                        }));
                        console.error("Error fetching sub operators:", error);
                    });
            }
        } else {
            setSubOperatorOptions(prev => ({
                ...prev,
                [idx]: []
            }));
        }
    };

    const rule_engine_conditions_attributes = conditions.map(cond => ({
        ...cond,
        model_id: Number(cond.model_id),
        // compare_value: cond.compare_value !== "" && !isNaN(cond.compare_value)
        // ? Number(cond.compare_value)
        // : cond.compare_value
    }));

    // Helper to get master reward outcome name by id
    const getMasterRewardOutcomeName = (id) => {
        const found = masterRewardOptions.find(opt => opt.value === id);
        return found ? toSnakeCase(found.label) : "";
    };

    const rule_engine_actions_attributes = conditions.map(condition => ({
        lock_model_name: condition.condition_attribute,
        action_method: getMasterRewardOutcomeName(masterRewardOutcome),
        parameters: Number(parameter) || 0,
        rule_engine_applicable_model_id: Number(condition.model_id),
        rule_engine_available_function_id: Number(masterRewardOutcome),
        action_selected_model: Number(condition.model_id)
    }));


    const payload = {
        rule_engine_rule: {
            name: ruleName,
            active: true,
            model_id: Number(conditions[0]?.model_id) || 1,
            rule_engine_conditions_attributes,
            rule_engine_actions_attributes,
        }
    };
    console.log("Payload:", payload);

    // Handle submit
    const handleSubmit = async () => {
        // e.preventDefault();
        let newErrors = {};
        let hasError = false;

        // Rule name validation
        if (!ruleName) {
            newErrors.ruleName = "Rule name is required.";
            hasError = true;
        }
        // Validate each condition
        conditions.forEach((c, idx) => {
            let condErr = {};
            if (!c.model_id) condErr.model_id = "Master attribute is required.";
            if (!c.condition_attribute) condErr.condition_attribute = "Sub attribute is required.";
            if (!c.master_operator) condErr.master_operator = "Master operator is required.";
            if (!c.operator) condErr.operator = "Sub operator is required.";
            if (!c.compare_value) condErr.compare_value = "Value is required.";
            if (Object.keys(condErr).length > 0) {
                newErrors[idx] = condErr;
                hasError = true;
            }
        });

        // Validate THEN section
        let thenErr = {};
        if (!masterRewardOutcome) thenErr.masterRewardOutcome = "Master reward outcome is required.";
        if (!subRewardOutcome) thenErr.subRewardOutcome = "Sub reward outcome is required.";
        // if (!parameter) thenErr.parameter = "Required";
        setThenError(thenErr);

        setErrors(newErrors);

        if (hasError || Object.keys(thenErr).length > 0) return;
        // Build payload
        const payload = {
            rule_engine_rule: {
                name: ruleName,
                active: true,
                model_id: Number(conditions[0]?.model_id) || 1,
                rule_engine_conditions_attributes,
                rule_engine_actions_attributes,

            }
        };
        console.log("Payload on submisiion:", payload);
        // Send payload to API here
        try {
            const response = await axios.post(
                "https://marathon.lockated.com/rule_engine/rules.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414",
                payload
            );
            // Handle success (show message, redirect, etc.)
            console.log("Rule created:", response.data);
            alert("Rule created successfully!");
            navigate("/rule-engine-list")
        } catch (error) {
            // Handle error
            console.error("Error creating rule:", error);
            alert("Failed to create rule.");
        }
    };

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="">Rule Engine &gt; Edit Rule</a>
                    </a>
                    <h5 class="mt-4">Edit Rule</h5>
                    <div className="card mt-3 pb-">

                        <div className="card m-3">
                            <div className="card-body">
                                <div className="col-md-6 ">
                                    <div className="form-group">
                                        <label>New Rule <span>*</span></label>
                                        <input
                                              disabled
                                            value={ruleName}
                                            onChange={e => setRuleName(e.target.value)}
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Rule Name"
                                        />
                                        {errors.ruleName && (
                                            <div className="text-danger" style={{ fontSize: "12px" }}>{errors.ruleName}</div>
                                        )}
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
                                            <ul className="nav nav-tabs border-0 mt-3">
                                                <div className="d-flex gap-3 And-btn rounded custom-radio-lg">
                                                    <li className="nav-item d-flex p-2 gap-2" role="presentation">
                                                        <input
                                                            type="radio"
                                                            className="nav-link"
                                                            id={`and-tab-${idx}`}
                                                            name={`condition-type-${idx}`}
                                                            value="AND"
                                                            checked={condition.condition_type === "AND"}
                                                            onChange={() => handleConditionChange(idx, "condition_type", "AND")}
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
                                                            checked={condition.condition_type === "OR"}
                                                            onChange={() => handleConditionChange(idx, "condition_type", "OR")}
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
                                                                options={masterAttributeOptions}
                                                                value={masterAttributeOptions.find(opt => opt.value === condition.model_id)}
                                                                onChange={selected =>
                                                                    handleMasterAttributeChange(idx, selected ? selected.value : "")
                                                                }
                                                                placeholder="Select Master Attribute"
                                                            />
                                                            {errors[idx]?.model_id && (
                                                                <div className="text-danger" style={{ fontSize: "12px" }}>{errors[idx].model_id}</div>
                                                            )}
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
                                                                options={subAttributeOptions[idx] || []}
                                                                value={(subAttributeOptions[idx] || []).find(opt => opt.value === condition.condition_attribute)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "condition_attribute", selected ? selected.value : "")
                                                                }
                                                                placeholder="Select Sub Attribute"
                                                            />
                                                            {errors[idx]?.condition_attribute && (
                                                                <div className="text-danger" style={{ fontSize: "12px" }}>{errors[idx].condition_attribute}</div>
                                                            )}
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
                                                                options={masterOperatorOptions}
                                                                placeholder="Select Master Operator"
                                                                value={masterOperatorOptions.find(opt => opt.value === condition.master_operator)}
                                                                onChange={selected =>
                                                                    handleMasterOperatorChange(idx, selected ? selected.value : "")
                                                                }
                                                            />
                                                            {errors[idx]?.master_operator && (
                                                                <div className="text-danger" style={{ fontSize: "12px" }}>{errors[idx].master_operator}</div>
                                                            )}
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
                                                                options={subOperatorOptions[idx] || []}
                                                                placeholder="Select Sub Operator"
                                                                value={(subOperatorOptions[idx] || []).find(opt => opt.value === condition.operator)}
                                                                onChange={selected =>
                                                                    handleConditionChange(idx, "operator", selected ? selected.value : "")
                                                                }
                                                            />
                                                            {errors[idx]?.operator && (
                                                                <div className="text-danger" style={{ fontSize: "12px" }}>{errors[idx].operator}</div>
                                                            )}
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
                                                                    value={condition.compare_value}
                                                                    onChange={e =>
                                                                        handleConditionChange(idx, "compare_value", e.target.value)
                                                                    }
                                                                />

                                                            </div>
                                                            {errors[idx]?.compare_value && (
                                                                <div className="text-danger" style={{ fontSize: "12px" }}>{errors[idx].compare_value}</div>
                                                            )}
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
                                                options={masterRewardOptions}
                                                value={masterRewardOptions.find(opt => opt.value === masterRewardOutcome)}
                                                onChange={selected =>
                                                    setMasterRewardOutcome(selected ? selected.value : "")
                                                }
                                                placeholder={`Select  Master Reward Outcome`}
                                            />
                                            {thenError.masterRewardOutcome && (
                                                <div className="text-danger" style={{ fontSize: "12px" }}>{thenError.masterRewardOutcome}</div>
                                            )}
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
                                                options={subRewardOptions}
                                                value={subRewardOptions.find(opt => opt.value === subRewardOutcome)}
                                                onChange={selected =>
                                                    setSubRewardOutcome(selected ? selected.value : "")
                                                }
                                                placeholder={`Select Sub Reward Outcome`}
                                            />
                                            {thenError.subRewardOutcome && (
                                                <div className="text-danger" style={{ fontSize: "12px" }}>{thenError.subRewardOutcome}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Parameter </label>
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
                            <div className="col-md-2">
                                <button className="purple-btn2 w-100" onClick={handleSubmit}>Submit</button>
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

export default RuleEngineEdit;
