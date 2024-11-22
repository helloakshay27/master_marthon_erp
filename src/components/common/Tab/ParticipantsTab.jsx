import React from "react";

export default function ParticipantsTab() {
  return (
    <div
      className="tab-pane fade"
      id="participants"
      role="tabpanel"
      aria-labelledby="participants-tab"
      tabIndex={0}
    >
      <div>
        <div className="d-flex justify-content-between mt-4 align-items-center">
          <input
            type="search"
            placeholder="Search vendors"
            className="event-participant-search-in"
          />
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <p className="eventList-p1 mb-0 pe-1">
                Show only selected vendors
              </p>
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
              </div>
            </div>
            <div>
              <img
                className="me-2"
                src="../erp_event_module/img/Separator-dark.svg"
                alt=""
              />
            </div>
            <select
              name="language"
              className="event-participant-select eventD-forms buyEvent-forms"
              required
            >
              <option value="" disabled selected hidden >
                Filter by city
              </option>
              <option value="indian">xxxxxxxx</option>
              <option value="nepali">xxxxxxxx</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <div className="tbl-container">
          <table className="w-100">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Name</th>
                <th>Bids Closed</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">
                    AXIS ELECTRICAL COMPONENTS INDIA PRIVATE LIMITED
                  </p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#">
                    View Price Cap
                  </a>
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">AJAY ELECTRICALS</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#">
                    {" "}
                  </a>
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">
                    Ampere Electrical Services
                  </p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#">
                    View Price Cap
                  </a>
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">A.R. ENTERPRISE</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#" />
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">
                    BRAHMARI POWERTECH PRIVATE LIMITED
                  </p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#" />
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">
                    CAPE ELECTRIC PRIVATE LIMITED
                  </p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#">
                    View Price Cap
                  </a>
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">ELECTRICAL SOLUTIONS</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#" />
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">IQRA ENTERPRISES</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#" />
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">MAC ELECTRICALS</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#">
                    {" "}
                  </a>
                </td>
              </tr>
              <tr className="go-shadow-k">
                <td>
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-start">
                  <p className="participant-table mb-1">Moksh Infra</p>
                </td>
                <td className="text-start ">
                  <a className="participant-table2" href="#" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
