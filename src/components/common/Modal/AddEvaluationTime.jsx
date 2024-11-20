import React, { useState } from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { evaluationOptions } from "../../../constant/data";

const AddEvaluationTimeModal = ({ show, handleClose }) => {
  const [evaluationTime, setEvaluationTime] = useState("30 Minutes");

  const handleOptionChange = (e) => {
    setEvaluationTime(e.target.value);
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={handleClose}
      title="Add Evaluation Time"
      footerButtons={[
        { label: "Cancel", onClick: handleClose, props: { className: "purple-btn1" } },
        { label: "Save", onClick: () => console.log(`Saved: ${evaluationTime}`), props: { className: "purple-btn2" } },
      ]}
    >
      <div className="row justify-content-between align-items-center">
        {evaluationOptions.map((option, index) => (
          <div className="col-md-3" key={index}>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="evaluationTime"
                  value={option.value}
                  checked={evaluationTime === option.value}
                  onChange={handleOptionChange}
                />
                <label className="form-check-label">{option.label}</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DynamicModalBox>
  );
};

export default AddEvaluationTimeModal;
