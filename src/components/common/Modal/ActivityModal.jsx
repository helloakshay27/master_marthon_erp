import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import OrderIcon from "../Icon/OrderIcon";

const ActivityModal = ({ show, handleClose }) => {
  const activityStatus = [
    {
      icon: <i className="bi bi-hexagon"></i>,
      title: "Pratik Bhosale downloaded the auction report.",
      correctionFrom: "Yes",
      correctionTo: "No",
      date: "30 Nov 2024 at 04:19 pm",
    },
    {
      icon: <i className="bi bi-hexagon"></i>,
      title: "Pratik Bhosale has withdrawn the event.",
      correctionFrom: "Yes",
      correctionTo: "No",
      date: "30 Nov 2024 at 04:19 pm",
    },
    {
      icon: <OrderIcon />,
      title: "Dharamnath Corporation has placed the bid.",
      correctionFrom: "Yes",
      correctionTo: "No",
      date: "30 Nov 2024 at 04:19 pm",
    },
  ];

  return (
    <>
      <DynamicModalBox
        size="sm"
        modalType={true}
        show={show}
        onHide={handleClose}
        title="Activity"
      >
        <div>
          {/* {activities.map((activity, index) => (
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
          ))} */}

          {activityStatus.map((item, index) => (
            <div className="d-flex" style={{marginBottom:'15px'}} key={index}>
              <div
                style={{
                  height: "130px",
                  textAlign:'center',
                  marginRight:'10px'
                }}
              >
                <div
                  className="rounded-circle"
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    backgroundColor: "#de7008",
                    color:'#fff'
                  }}
                >
                  {item.icon}
                </div>
                <div className="vr h-100"></div>
              </div>
              <div>
                <p>{item.title}</p>
                {item.correctionFrom && (
                  <div
                    className="rounded-2 p-2"
                    style={{ border: "1px dashed #ddd", width: "100%" }}
                  >
                    <p>
                      {item.correctionFrom == "yes" ||
                      item.correctionFrom == "no"
                        ? "Show Best Price to Participants"
                        : "Order ending at"}
                    </p>

                    <div className="d-flex align-items-center justify-content-start gap-2">
                      <div className="rounded-2 p-1 bg-light text-decoration-line-through">
                        {item.correctionFrom}
                      </div>
                      <i className="bi bi-arrow-right"></i>
                      <div className="rounded-2 p-1 bg-light">
                        {item.correctionTo}
                      </div>
                    </div>
                  </div>
                )}
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </DynamicModalBox>
    </>
  );
};

export default ActivityModal;
