import React from "react";

export default function PriceTrendsTab() {
  return (
    <div
      className="tab-pane fade"
      id="priceTrends"
      role="tabpanel"
      aria-labelledby="priceTrends-tab"
      tabIndex={0}
    >
      <div className="priceTrends-list-main">
        {Array(6)
          // @ts-ignore
          .fill()
          .map((_, index) => (
            <div className="priceTrends-item my-3" key={index}>
              <div className="item-label">A</div>
              <div className="priceTrends-list-child go-shadow-k p-3">
                <p className="eventList-p2 mb-0 fw-bold">
                  AXIS CONTROL from AXIS ELECTRICAL COMPONENTS INDIA PRIVATE
                  LIMITED
                </p>
                <p className="eventList-p1 mb-0">copper make</p>
              </div>
            </div>
          ))}
      </div>

      <footer className="d-flex justify-content-end pageChange">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item pagechange-child">
              <a className="page-link pagechange-child-a" href="#">
                <span>
                  <img
                    className="pageChangeIMG me-2"
                    src="../erp_event_module/img/previous_arrow.svg"
                    alt=""
                  />
                </span>
                Previous Event
              </a>
            </li>
            <li className="page-item pagechange-child">
              <a className="page-link pagechange-child-a" href="#">
                {" "}
                Next Event
                <span>
                  <img
                    className="pageChangeIMG ms-2"
                    src="../erp_event_module/img/next_arrow.svg"
                    alt=""
                  />
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
