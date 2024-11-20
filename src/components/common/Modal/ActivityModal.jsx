import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { activities } from "../../../constant/data";

const ActivityModal = ({ show, handleClose }) => {
  return (
    <>
      <DynamicModalBox show={show} onHide={handleClose} title="Activity">
        <div className="activity">
          {activities.map((activity, index) => (
            <div className="activity-item" key={index}>
              
              <p>{activity.text}</p>
              {activity.orderEnding && (
                <small>
                  Order ending at <strong>{activity.orderEnding}</strong>
                </small>
              )}
              {activity.change && <small>{activity.change}</small>}
              <small>{activity.time}</small>
            </div>
          ))}
        </div>
      </DynamicModalBox>
    </>
  );
};

export default ActivityModal;