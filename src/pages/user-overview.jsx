// import React from "react";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import { Link } from "react-router-dom";

import axios from 'axios';


const UserOverview = () => {
  const { eventId } = useParams();
  const [publishedStages, setPublishedStages] = useState(true);
  const [terms, setTerms] = useState(true);
  const [Contact, setContact] = useState(true);
  const [lineItems, setLineItems] = useState(true);
  const [isHistoryActive, setIsHistoryActive] = useState(false);


  const navigate = useNavigate();


  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null)
  const [endDate, setEndDate] = useState(null)


  console.log("Event ID:", eventId);
  useEffect(() => {
    const fetchEventMaterials = async () => {
      console.log("Event ID:", eventId);
      try {
        // Fetch data directly without headers
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/vendor_show?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        // Transform the API response into the required table data format
        setData(response.data);
        console.log("response:", response.data);
        const isoDate = response.data.event_schedule.start_time
        setDate(response.data.event_schedule.start_time)
        setEndDate(response.data.event_schedule.end_time_duration)
        console.log("date:", isoDate)
      } catch (err) {
        console.error("Error fetching event materials:", err.response || err.message || err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventMaterials();
  }, [eventId]);


  const handlepublishedStages = () => {
    setPublishedStages(!publishedStages)
  };

  const handleTerms = () => {
    setTerms(!terms)
  };

  const handleContact = () => {
    setContact(!Contact)
  };

  const handlelineItem = () => {
    setLineItems(!lineItems)
  };



  const formatDate = (date) => {
    const date1 = new Date(date);

    // Extract date parts
    const options = { month: "short" }; // Short month name like "Dec"
    const day = date1.getDate().toString().padStart(2, "0"); // Ensure 2 digits
    const month = (date1.getMonth() + 1).toString().padStart(2, "0"); // "Dec"
    const year = date1.getFullYear();

    // Extract time parts
    let hours = date1.getHours();
    const minutes = date1.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour

    // Combine into desired format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const isoDate = date;

  // Call the function and log the result
  const formattedDate = formatDate(isoDate);
  console.log("Formatted Date:", formattedDate);

  //end date
  const calculateEndDate = (date) => {
    const date1 = new Date(date);

    // Extract date parts
    const options = { month: "short" }; // Short month name like "Dec"
    const day = date1.getDate().toString().padStart(2, "0"); // Ensure 2 digits
    const month = (date1.getMonth() + 1).toString().padStart(2, "0"); // "Dec"
    const year = date1.getFullYear();

    // Extract time parts
    let hours = date1.getHours();
    const minutes = date1.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour

    // Combine into desired format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const formattedEndDate = calculateEndDate(endDate);

  console.log(formattedEndDate)
  console.log('end d', endDate)

  console.log("data:", data)

  // const navigate = useNavigate();  // Initialize the navigate function

  // Function to handle button click and navigate
  const handleNavigate = () => {
    console.log("vendor list ")
    navigate('/vendor-list');  // Redirect to /vendor-list page
  };

  return (
    <>
      <Header />

      <style>
        {`
          #project-header {
            display: flex;
            flex-direction: column;
            padding: 16px;
            border-bottom: 1px solid #ccc;
            background-color: #f9f9f9;
          }

          #project-header2 {
            display: flex;
            flex-direction: column;
            padding-top: 5px;
            // border-bottom: 1px solid #ccc;
            background-color: #f9f9f9;
          }


          .styles_projectTitle__3f7Yw {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }

          .styles_projectTitleContent__1Xu_Z {
            display: flex;
            align-items: center;
            gap: 8px; /* Space between button and text */
          }

          .styles_headerCtaLink__2kCN6 {
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
          }

          .styles_headerCtaLink__2kCN6 svg {
            width: 24px;
            height: 24px;
            color: #007bff; /* Blue color for back button */
          }

          .styles_projectTitleContent__1Xu_Z span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .styles_projectTitleExtra__3ePz7 {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .styles_projectTitleExtra__3ePz7 span {
            font-size: 14px;
            color: #555;
          }

          .styles_strategyTag__2icur {
            background-color: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #333;
          }

        `}
      </style>


    
      {/* Tabs Section */}

      <div className="styles_projectTabsHeader__148No" id="project-header">
        {/* Project Title Section */}
        <div className="styles_projectTitle__3f7Yw">
          <div className="styles_projectTitleContent__1Xu_Z">
          
            <button
              type="button"
              className="ant-btn styles_headerCtaLink__2kCN6 ant-btn-link"
              onClick={handleNavigate}  // Call handleNavigate on button click
            >
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                className="pro-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.707 4.293a1 1 0 0 1 0 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
           
            <span>
              [1000291945] PLUMBING MATERIAL products - SWAYAM REALTORS AND
              TRADERS LLP
            </span>
          </div>
          <div className="styles_projectTitleExtra__3ePz7">
            <span> REALTY PRIVATE LTD</span>
          </div>
        </div>
      </div>

      <div class="container mt-4">
        {/* <!-- Tab navigation --> */}
        <ul class="nav nav-tabs" id="myTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Event Overview</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">[1000291945] PLUMBIN...</a>
          </li>

        </ul>

        {/* <!-- Tab content --> */}
        <div class="tab-content w-100" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div className="main-content w-100 ">
              <div
                className="w-100  pt-4 mb-2 ps-2 pe-2"
                style={{
                  overflowY: "auto",
                  height: "calc(100vh - 100px)",
                }}



              >


                {/* Published Stages */}

                <div className="card  p-3 mt-3 rounded-3">
                  <div className="col-12">
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#participation-summary"
                      role="button"
                      aria-expanded={publishedStages}
                      aria-controls="participation-summary"
                      onClick={handlepublishedStages}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="participation-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {publishedStages ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Published Stages</span>

                    </a>
                    {publishedStages && (
                      <div id="participation-summary" className="" style={{ paddingLeft: "24px", }}>

                        <div className=" card card-body rounded-3 p-4  pt-0  ">

                          <div className="tbl-container mt-3">

                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">Stage Title</th>
                                  <th className="text-start">Status</th>
                                  <th className="text-start">Bidding Starts At</th>
                                  <th className="text-start">Bidding Ends At</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.material_title}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.status}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{formattedDate}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{formattedEndDate}</td>

                                </tr>
                              </tbody>
                            </table>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                  {/* Terms & Conditions */}


                  <div className="col-12 "
                    style={{
                      borderTop: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      paddingTop: "10px ", // Optional padding to add spacing between content and borders
                    }}

                  >
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#terms-conditions"
                      role="button"
                      aria-expanded={terms}
                      aria-controls="terms-conditions"
                      onClick={handleTerms}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="terms-conditions-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {terms ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Terms & Conditions</span>
                    </a>
                    {terms && (
                      <div id="terms-conditions" className="" style={{ paddingLeft: "24px", }}>
                        <div className=" card card-body rounded-3 p-4">
                          <p>
                            1. Payment terms: Net 30 days.
                            <br />
                            <br />
                            2. Delivery within 15 business days.
                            <br />
                            <br />
                            3. Warranty: 1 year from the date of purchase.
                            <br />
                            <br />
                            4. Returns are subject to company policy.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>



                  {/* contact */}

                  <div className="col-12"
                    style={{
                      // borderTop: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      // padding: "20px 0", // Optional padding to add spacing between content and borders
                    }}

                  >
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#savings-summary"
                      role="button"
                      aria-expanded={Contact}
                      aria-controls="savings-summary"
                      onClick={handleContact}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="savings-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {Contact ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Contact Info </span>
                    </a>
                    {Contact && (
                      <div id="savings-summary" className="" style={{ paddingLeft: "24px", }}>
                        <div className=" card card-body rounded-3 p-4  pt-0 ">

                          {/* Table Section */}
                          <div className="tbl-container mt-3">
                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">Buyer Name</th>
                                  <th className="text-start">Email</th>
                                  <th className="text-start">Phone</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.created_by}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.created_by_email}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.crated_by_mobile}</td>

                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* line */}

                  <div className="col-12 pb-4">
                    <a
                      className="btn d-flex align-items-center"
                      data-bs-toggle="collapse"
                      href="#savings-summary"
                      role="button"
                      aria-expanded={lineItems}
                      aria-controls="savings-summary"
                      onClick={handlelineItem}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span
                        id="savings-summary-icon"
                        className="icon-1"
                        style={{ marginRight: "8px" }} // Adds gap between icon and text
                      >
                        {lineItems ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Line Items</span>
                    </a>

                    {lineItems && (
                      <div id="savings-summary" className="mt-2" style={{ paddingLeft: "24px", }}>
                        <div className="card card-body rounded-3 p-4 pt-0">
                          {/* Table Section */}
                          <div className="tbl-container mt-3">
                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">S No.</th>
                                  <th className="text-start">Line Item Name</th>
                                  <th className="text-start">PR No</th>
                                  <th className="text-start">Item No</th>
                                  <th className="text-start">Specification Needed</th>
                                  <th className="text-start">Attachment</th>
                                  <th className="text-start">Quantity</th>
                                  <th className="text-start">PR Creator</th>
                                  <th className="text-start">PR Creator Phone</th>
                                  <th className="text-start">PR Creator Email</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.event_materials.map((data) => (
                                  <tr key={data.id}>
                                    <td className="text-start" style={{ color: "#777777" }}>1</td>
                                    <td className="text-start" style={{ color: "#777777" }}>{data.inventory_name}</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}></td>
                                    <td className="text-start" style={{ color: "#777777" }}>NA - NA</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>{data.quantity}</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>


              {/* other */}



            </div>
          </div>
          <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div className="main-content w-100 ">
              <div
                // className="w-100  pt-4 mb-2 ps-2 pe-2"
                style={{
                  overflowY: "auto",
                  height: "calc(100vh - 100px)",
                }}


                className={` tab-pane fade ${!isHistoryActive ? "show active" : ""
                  } eventList-parent p-4 pt-0 w-100`}
                id="live"
                role="tabpanel"
                tabIndex={0}
              >

                {/* Published Stages */}

                <div className="card  p-3 mt-3 rounded-3">
                  <div className="col-12">
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#participation-summary"
                      role="button"
                      aria-expanded={publishedStages}
                      aria-controls="participation-summary"
                      onClick={handlepublishedStages}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="participation-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {publishedStages ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Published Stages</span>

                    </a>
                    {publishedStages && (
                      <div id="participation-summary" className="" style={{ paddingLeft: "24px", }}>

                        <div className=" card card-body rounded-3 p-4  pt-0  ">

                          <div className="tbl-container mt-3">

                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">Stage Title</th>
                                  <th className="text-start">Status</th>
                                  <th className="text-start">Bidding Starts At</th>
                                  <th className="text-start">Bidding Ends At</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.material_title}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.status}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{formattedDate}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{formattedEndDate}</td>

                                </tr>
                              </tbody>
                            </table>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                  {/* Terms & Conditions */}

                  <div className="col-12 "
                    style={{
                      borderTop: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      paddingTop: "10px ", // Optional padding to add spacing between content and borders
                    }}

                  >
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#terms-conditions"
                      role="button"
                      aria-expanded={terms}
                      aria-controls="terms-conditions"
                      onClick={handleTerms}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="terms-conditions-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {terms ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Terms & Conditions</span>
                    </a>
                    {terms && (
                      <div id="terms-conditions" className="" style={{ paddingLeft: "24px", }}>
                        <div className=" card card-body rounded-3 p-4">
                          <p>
                            1. Payment terms: Net 30 days.
                            <br />
                            <br />
                            2. Delivery within 15 business days.
                            <br />
                            <br />
                            3. Warranty: 1 year from the date of purchase.
                            <br />
                            <br />
                            4. Returns are subject to company policy.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* contact */}

                  <div className="col-12"
                    style={{
                      // borderTop: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      // padding: "20px 0", // Optional padding to add spacing between content and borders
                    }}>
                    <a
                      className="btn"
                      data-bs-toggle="collapse"
                      href="#savings-summary"
                      role="button"
                      aria-expanded={Contact}
                      aria-controls="savings-summary"
                      onClick={handleContact}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span id="savings-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                        {Contact ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Contact Info </span>
                    </a>
                    {Contact && (
                      <div id="savings-summary" className="" style={{ paddingLeft: "24px", }}>
                        <div className=" card card-body rounded-3 p-4  pt-0 ">

                          {/* Table Section */}
                          <div className="tbl-container mt-3">
                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">Buyer Name</th>
                                  <th className="text-start">Email</th>
                                  <th className="text-start">Phone</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.created_by}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.created_by_email}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.crated_by_mobile}</td>

                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* line */}

                  <div className="col-12 pb-4">
                    <a
                      className="btn d-flex align-items-center"
                      data-bs-toggle="collapse"
                      href="#savings-summary"
                      role="button"
                      aria-expanded={lineItems}
                      aria-controls="savings-summary"
                      onClick={handlelineItem}
                      style={{ fontSize: "16px", fontWeight: "normal" }}
                    >
                      <span
                        id="savings-summary-icon"
                        className="icon-1"
                        style={{ marginRight: "8px" }} // Adds gap between icon and text
                      >
                        {lineItems ? (
                          <i className="bi bi-dash-lg"></i>
                        ) : (
                          <i className="bi bi-plus-lg"></i>
                        )}
                      </span>
                      <span style={{ fontSize: "22px", fontWeight: "normal" }}>Line Items</span>
                    </a>

                    {lineItems && (
                      <div id="savings-summary" className="mt-2" style={{ paddingLeft: "24px", }}>
                        <div className="card card-body rounded-3 p-4 pt-0">
                          {/* Table Section */}
                          <div className="tbl-container mt-3">
                            <table className="w-100 table">
                              <thead>
                                <tr>
                                  <th className="text-start">S No.</th>
                                  <th className="text-start">Line Item Name</th>
                                  <th className="text-start">PR No</th>
                                  <th className="text-start">Item No</th>
                                  <th className="text-start">Specification Needed</th>
                                  <th className="text-start">Attachment</th>
                                  <th className="text-start">Quantity</th>
                                  <th className="text-start">PR Creator</th>
                                  <th className="text-start">PR Creator Phone</th>
                                  <th className="text-start">PR Creator Email</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.event_materials.map((data) => (
                                  <tr key={data.id}>
                                    <td className="text-start" style={{ color: "#777777" }}>1</td>
                                    <td className="text-start" style={{ color: "#777777" }}>{data.inventory_name}</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}></td>
                                    <td className="text-start" style={{ color: "#777777" }}>NA - NA</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>{data.quantity}</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                    <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {loading ? (
        "Loading...."
      ) : error ? (
        "Something went wrong..."
      ) : data ? (
        <div className="w-100">
          <div className="main-content w-100 ">
            <div
              // className="w-100  pt-4 mb-2 ps-2 pe-2"
              style={{
                overflowY: "auto",
                height: "calc(100vh - 100px)",
              }}


              className={` tab-pane fade ${!isHistoryActive ? "show active" : ""
                } eventList-parent p-4 pt-0 w-100`}
              id="live"
              role="tabpanel"
              tabIndex={0}
            >
              {/* Published Stages */}

              <div className="card  p-3 mt-3 rounded-3">
                <div className="col-12">
                  <a
                    className="btn"
                    data-bs-toggle="collapse"
                    href="#participation-summary"
                    role="button"
                    aria-expanded={publishedStages}
                    aria-controls="participation-summary"
                    onClick={handlepublishedStages}
                    style={{ fontSize: "16px", fontWeight: "normal" }}
                  >
                    <span id="participation-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                      {publishedStages ? (
                        <i className="bi bi-dash-lg"></i>
                      ) : (
                        <i className="bi bi-plus-lg"></i>
                      )}
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "normal" }}>Published Stages</span>

                  </a>
                  {publishedStages && (
                    <div id="participation-summary" className="" style={{ paddingLeft: "24px", }}>

                      <div className=" card card-body rounded-3 p-4  pt-0  ">

                        <div className="tbl-container mt-3">

                          <table className="w-100 table">
                            <thead>
                              <tr>
                                <th className="text-start">Stage Title</th>
                                <th className="text-start">Status</th>
                                <th className="text-start">Bidding Starts At</th>
                                <th className="text-start">Bidding Ends At</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-start" style={{ color: "#777777" }}>{data.material_title}</td>
                                <td className="text-start" style={{ color: "#777777" }}>{data.status}</td>
                                <td className="text-start" style={{ color: "#777777" }}>{formattedDate}</td>
                                <td className="text-start" style={{ color: "#777777" }}>{formattedEndDate}</td>

                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
                {/* Terms & Conditions */}

                <div className="col-12 "
                  style={{
                    borderTop: "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
                    paddingTop: "10px ", // Optional padding to add spacing between content and borders
                  }}>
                  <a
                    className="btn"
                    data-bs-toggle="collapse"
                    href="#terms-conditions"
                    role="button"
                    aria-expanded={terms}
                    aria-controls="terms-conditions"
                    onClick={handleTerms}
                    style={{ fontSize: "16px", fontWeight: "normal" }}
                  >
                    <span id="terms-conditions-icon" className="icon-1" style={{ marginRight: "8px" }}>
                      {terms ? (
                        <i className="bi bi-dash-lg"></i>
                      ) : (
                        <i className="bi bi-plus-lg"></i>
                      )}
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "normal" }}>Terms & Conditions</span>
                  </a>
                  {terms && (
                    <div id="terms-conditions" className="" style={{ paddingLeft: "24px", }}>
                      <div className=" card card-body rounded-3 p-4">
                        <p>
                          1. Payment terms: Net 30 days.
                          <br />
                          <br />
                          2. Delivery within 15 business days.
                          <br />
                          <br />
                          3. Warranty: 1 year from the date of purchase.
                          <br />
                          <br />
                          4. Returns are subject to company policy.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* contact */}

                <div className="col-12"
                  style={{
                    // borderTop: "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
                    // padding: "20px 0", // Optional padding to add spacing between content and borders
                  }}>
                  <a
                    className="btn"
                    data-bs-toggle="collapse"
                    href="#savings-summary"
                    role="button"
                    aria-expanded={Contact}
                    aria-controls="savings-summary"
                    onClick={handleContact}
                    style={{ fontSize: "16px", fontWeight: "normal" }}
                  >
                    <span id="savings-summary-icon" className="icon-1" style={{ marginRight: "8px" }}>
                      {Contact ? (
                        <i className="bi bi-dash-lg"></i>
                      ) : (
                        <i className="bi bi-plus-lg"></i>
                      )}
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "normal" }}>Contact Info </span>
                  </a>
                  {Contact && (
                    <div id="savings-summary" className="" style={{ paddingLeft: "24px", }}>
                      <div className=" card card-body rounded-3 p-4  pt-0 ">

                        {/* Table Section */}
                        <div className="tbl-container mt-3">
                          <table className="w-100 table">
                            <thead>
                              <tr>
                                <th className="text-start">Buyer Name</th>
                                <th className="text-start">Email</th>
                                <th className="text-start">Phone</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-start" style={{ color: "#777777" }}>{data.created_by}</td>
                                <td className="text-start" style={{ color: "#777777" }}>{data.created_by_email}</td>
                                <td className="text-start" style={{ color: "#777777" }}>{data.crated_by_mobile}</td>

                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                {/* line */}

                <div className="col-12 pb-4">
                  <a
                    className="btn d-flex align-items-center"
                    data-bs-toggle="collapse"
                    href="#savings-summary"
                    role="button"
                    aria-expanded={lineItems}
                    aria-controls="savings-summary"
                    onClick={handlelineItem}
                    style={{ fontSize: "16px", fontWeight: "normal" }}
                  >
                    <span
                      id="savings-summary-icon"
                      className="icon-1"
                      style={{ marginRight: "8px" }} // Adds gap between icon and text
                    >
                      {lineItems ? (
                        <i className="bi bi-dash-lg"></i>
                      ) : (
                        <i className="bi bi-plus-lg"></i>
                      )}
                    </span>
                    <span style={{ fontSize: "22px", fontWeight: "normal" }}>Line Items</span>
                    <button
                      className="btn btn-primary ml-auto"
                      style={{ fontSize: "16px" }} // Customize button style here
                    >
                      Right Button
                    </button>
                  </a>







                  {lineItems && (
                    <div id="savings-summary" className="mt-2" style={{ paddingLeft: "24px", }}>
                      <div className="card card-body rounded-3 p-4 pt-0">
                        {/* Table Section */}
                        <div className="tbl-container mt-3">
                          <table className="w-100 table">
                            <thead>
                              <tr>
                                <th className="text-start">S No.</th>
                                <th className="text-start">Line Item Name</th>
                                <th className="text-start">PR No</th>
                                <th className="text-start">Item No</th>
                                <th className="text-start">Specification Needed</th>
                                <th className="text-start">Attachment</th>
                                <th className="text-start">Quantity</th>
                                <th className="text-start">PR Creator</th>
                                <th className="text-start">PR Creator Phone</th>
                                <th className="text-start">PR Creator Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.event_materials.map((data) => (
                                <tr key={data.id}>
                                  <td className="text-start" style={{ color: "#777777" }}>1</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.inventory_name}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  <td className="text-start" style={{ color: "#777777" }}></td>
                                  <td className="text-start" style={{ color: "#777777" }}>NA - NA</td>
                                  <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  <td className="text-start" style={{ color: "#777777" }}>{data.quantity}</td>
                                  <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  <td className="text-start" style={{ color: "#777777" }}>-</td>
                                  <td className="text-start" style={{ color: "#777777" }}>-</td>
                                </tr>
                              ))}

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>


            {/* other */}



          </div>



        </div>
      ) : (
        "No data available"
      )}




    </>
  );
};

export default UserOverview;
