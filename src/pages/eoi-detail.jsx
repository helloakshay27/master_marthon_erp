import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/mor.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EoiDeatailPage() {
  //user overview

  const [publishedStages, setPublishedStages] = useState(true);
  const [termss, setTermss] = useState(true);
  const [Contact, setContact] = useState(true);
  const [lineItems, setLineItems] = useState(true);
  const [isHistoryActive, setIsHistoryActive] = useState(false);

  const [data1, setData1] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [deliveryDate, setDelivaryDate] = useState(null);
  const [loading, setLoading] = useState();
  const [documentAttachment, setDocumentAttachment] = useState(true);

  const { eventId } = useParams();

  // console.log("Event ID:", eventId);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eoiId = queryParams.get("eoi_id");

  // Logging the extracted parameters
  // console.log("Event ID:", eventId);
  // console.log("EOI ID:", eoiId);

  const [vendorId, setVendorId] = useState(() => {
    // Retrieve the vendorId from sessionStorage or default to an empty string
    return sessionStorage.getItem("vendorId") || "";
  });

  const handleYesClick = async () => {
    try {
      const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"; // Your token

      // Construct the URL for the PUT API request
      const url = `https://vendors.lockated.com/rfq/events/${eventId}/expression_of_interests/${eoiId}?token=${token}&q[vendor_id_in]=${vendorId}`;

      // Define the payload to send in the request (if required by the API)
      const payload = {
        // Add any data the API might need, e.g. status, etc.
        status: "approved",
      };

      // Make the PUT request using axios
      const response = await axios.put(url, payload);

      // Check the response and display a success message
      if (response.status === 200) {
        alert("Yes selected and request updated successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Failed to update the EOI status.");
      }
    } catch (error) {
      console.error("Error occurred while updating EOI:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Define a function to handle the No button click event
  const handleNoClick = async () => {
    try {
      const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"; // Your token

      // Construct the URL for the PUT API request
      const url = `https://vendors.lockated.com/rfq/events/${eventId}/expression_of_interests/${eoiId}?token=${token}&q[vendor_id_in]=${vendorId}`;

      // Define the payload to send in the request (if required by the API)
      const payload = {
        // Add any data the API might need, e.g. status, etc.
        status: "rejected",
      };

      // Make the PUT request using axios
      const response = await axios.put(url, payload);

      // Check the response and display a success message
      if (response.status === 200) {
        alert("No selected and request updated successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Failed to update the EOI status.");
      }
    } catch (error) {
      console.error("Error occurred while updating EOI:", error);
      alert("An error occurred while processing your request.");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventMaterials = async () => {
      // const eventId = 8
      // console.log("Event ID:", eventId);
      try {
        // Fetch data directly without headers
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&page=1`
        );

        // Transform the API response into the required table data format

        // console.log("fetching events", response.data);
        // console.log("Attachments:", response.data.attachments);

        setData1(response.data);
        // console.log("response:", response.data);
        const isoDate = response.data.event_schedule.start_time;
        setDate(response.data.event_schedule.start_time);
        setEndDate(response.data.event_schedule.end_time_duration);
        setDelivaryDate(response.data.delivery_date);
        // console.log("delivary date", response.data.delivery_date);

        // console.log("date:", isoDate);
      } catch (err) {
        console.error(
          "Error fetching event materials:",
          err.response || err.message || err
        );
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventMaterials();
  }, [eventId]);

  const handlepublishedStages = () => {
    setPublishedStages(!publishedStages);
  };

  const handleTerms = () => {
    setTermss(!termss);
  };

  const handleContact = () => {
    setContact(!Contact);
  };

  const handlelineItem = () => {
    setLineItems(!lineItems);
  };

  const handleDocumentAttachment = () => {
    setDocumentAttachment(!documentAttachment);
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
  // console.log("Formatted Date:", formattedDate);

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

  const calculateDelivarydDate = (date) => {
    if (!date) {
      console.warn("Date is undefined or null.");
      return "Invalid date";
    }

    // Ensure that the date is being parsed correctly by the Date constructor.
    const dateObj = new Date(date);

    // Check if the date object is valid.
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "Invalid date";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format.

    // If the date string contains a time zone, it's being converted into local time correctly by the Date constructor.
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const Delivarydate = calculateDelivarydDate(deliveryDate);
  // console.log("Formatted Delivery Date:", Delivarydate);

  const [terms, setTerms] = useState([]); // To store terms and conditions

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );
        console.log("API Response terms and condition:", response.data); //
        // setTerms(response.data.terms_and_conditions || []);

        const extractedTerms = response.data.resource_term_conditions.map(
          (item) => ({
            id: item.term_condition.id,
            condition: item.term_condition.condition,
          })
        );

        setTerms(extractedTerms || []); // Set the mapped terms
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      }
    };

    fetchTerms();
  }, []);

  const handleNavigate = () => {
    // console.log("vendor list ");
    navigate(
      "/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
    ); // Redirect to /vendor-list page
  };

  return (
    <div className="">
      <div className="styles_projectTabsHeader__148No" id="project-header">
        {/* Project Title Section */}
        <div className="styles_projectTitle__3f7Yw">
          <div className="styles_projectTitleContent__1Xu_Z">
            <button
              type="button"
              className="ant-btn styles_headerCtaLink__2kCN6 ant-btn-link"
              onClick={handleNavigate}
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
            <span className="ms-2">
              [{data1?.event_no}] {data1?.event_title}
            </span>
          </div>
          <div className="styles_projectTitleExtra__3ePz7">
            <span> REALTY PRIVATE LTD</span>
          </div>
        </div>
      </div>

      {/* <!-- Tab navigation --> */}
      <div
        style={{
          overflowY: "auto",
          height: "calc(100vh - 100px)",
        }}
      >
        <ul class="nav nav-tabs" id="myTabs" role="tablist">
          <li class="nav-item ms-4" role="presentation">
            <a
              className="nav-link active ps-4 pe-4"
              id="home-tab"
              data-bs-toggle="tab"
              href="#home"
              role="tab"
              aria-controls="home"
              aria-selected="true"
              style={{ color: "#DE7008", fontSize: "16px" }}
            >
              Event Overview
            </a>
          </li>
        </ul>

        {/* <!-- Tab content --> */}
        <div class="tab-content " id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            {/* user overview  */}

            <div
              className="p-3 mb-2 "
              // style={{
              //   overflowY: "auto",
              //   height: "calc(100vh - 100px)",
              // }}
            >
              {loading ? (
                "Loading...."
              ) : error ? (
                "Something went wrong..."
              ) : data1 ? (
                <div className="w-100 container-fluid">
                  <div className="main-content w-100 ">
                    <div className="w-100  pt-2 mb-2  pe-2">
                      {/* Published Stages */}

                      <div className="card mb-5 p-3 mt-2 rounded-3 ">
                        <div
                          className="col-12"
                          style={{ paddingBottom: "20px" }}
                        >
                          <a
                            className="btn"
                            data-bs-toggle="collapse"
                            href="#participation-summary"
                            role="button"
                            aria-expanded={publishedStages}
                            aria-controls="participation-summary"
                            onClick={handlepublishedStages}
                          >
                            <span
                              id="participation-summary-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {publishedStages ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Published Stages
                            </span>
                          </a>
                          {publishedStages && (
                            <div
                              id="participation-summary"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-4  ">
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr. No.</th>
                                        <th className="text-start">
                                          Stage Title
                                        </th>
                                        <th className="text-start">Status</th>
                                        <th className="text-start">
                                          Bidding Starts At
                                        </th>
                                        <th className="text-start">
                                          Bidding Ends At
                                        </th>
                                        <th className="text-start">
                                          Delivary date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          [{data1.event_no}] {data1.event_title}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.status}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {formattedDate}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {formattedEndDate}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {Delivarydate}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Terms & Conditions */}

                        <div
                          className="col-12 "
                          style={{
                            borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            paddingTop: "20px ", // Optional padding to add spacing between content and borders
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
                            className="btn"
                            data-bs-toggle="collapse"
                            href="#terms-conditions"
                            role="button"
                            aria-expanded={termss}
                            aria-controls="terms-conditions"
                            onClick={handleTerms}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <span
                              id="terms-conditions-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {termss ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Terms & Conditions
                            </span>
                          </a>
                          {termss && (
                            <div
                              id="terms-conditions"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-0">
                                <ul
                                  className=" mt-3 mb-3"
                                  // style={{ fontSize: "13px", marginLeft: "0px" }}
                                >
                                  {/* {terms.map((term) => (
                                    <li key={term.id} className="mb-3 mt-3">
                                      {term.condition}
                                    </li>
                                  ))} */}
                                  {terms.map((term) => (
                                    <li key={term.id} className="mb-3 mt-3">
                                      {term.condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* contact */}

                        <div
                          className="col-12 "
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
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
                            <span
                              id="savings-summary-icon"
                              className="icon-1"
                              // style={{ marginRight: "8px" }}
                              style={{
                                marginRight: "8px",
                                border: "1px solid #dee2e6",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                fontSize: "12px",
                              }}
                            >
                              {Contact ? (
                                <i className="bi bi-dash-lg"></i>
                              ) : (
                                <i className="bi bi-plus-lg"></i>
                              )}
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "normal" }}
                            >
                              Contact Info{" "}
                            </span>
                          </a>
                          {Contact && (
                            <div
                              id="savings-summary"
                              className=""
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className=" card card-body rounded-3 p-4 ">
                                {/* Table Section */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr.No.</th>
                                        <th className="text-start">
                                          Buyer Name
                                        </th>
                                        <th className="text-start">Email</th>
                                        <th className="text-start">Phone</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          1
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.created_by}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.created_by_email}
                                        </td>
                                        <td
                                          className="text-start"
                                          // style={{ color: "#777777" }}
                                        >
                                          {data1.crated_by_mobile}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* line */}

                        <div
                          className="col-12 pb-4 pt-3 "
                          style={{
                            // borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            // padding: "20px 0", // Optional padding to add spacing between content and borders
                            paddingTop: "20px ",
                            paddingBottom: "20px ",
                          }}
                        >
                          <a
                            className="btn d-flex  justify-content-between w-100"
                            data-bs-toggle="collapse"
                            href="#savings-summary"
                            role="button"
                            aria-expanded={lineItems}
                            aria-controls="savings-summary"
                            onClick={handlelineItem}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <div>
                              <span
                                id="savings-summary-icon"
                                className="icon-1"
                                // style={{ marginRight: "8px" }} // Adds gap between icon and text
                                style={{
                                  marginRight: "8px",
                                  border: "1px solid #dee2e6",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "8px",
                                  paddingRight: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                {lineItems ? (
                                  <i className="bi bi-dash-lg"></i>
                                ) : (
                                  <i className="bi bi-plus-lg"></i>
                                )}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "normal",
                                }}
                              >
                                Line Items
                              </span>
                            </div>
                          </a>
                          {lineItems && (
                            <div
                              id="savings-summary"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="card card-body rounded-3 p-4 ">
                                {/* Table Section */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr.No.</th>
                                        <th className="text-start">
                                          Inventory Name
                                        </th>
                                        <th className="text-start">Quantity</th>
                                        <th className="text-start">UOM</th>
                                        <th className="text-start">
                                          Material Type
                                        </th>
                                        <th className="text-start">Location</th>
                                        <th className="text-start">Rate</th>
                                        <th className="text-start">Amount</th>
                                        <th className="text-start">
                                          Section Name
                                        </th>
                                        <th className="text-start">
                                          Sub Section Name
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data1.event_materials.map(
                                        (data, index) => (
                                          <tr key={data.id}>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.inventory_name}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.quantity}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.uom}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.material_type}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.location}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.rate}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.amount}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.section_name}
                                            </td>
                                            <td
                                              className="text-start"
                                              // style={{ color: "#777777" }}
                                            >
                                              {data.sub_section_name}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-12 pb-4 pt-3">
                          <a
                            className="btn d-flex justify-content-between w-100"
                            data-bs-toggle="collapse"
                            href="#document-attachment"
                            role="button"
                            aria-expanded={documentAttachment}
                            aria-controls="document-attachment"
                            onClick={handleDocumentAttachment}
                            style={{ fontSize: "16px", fontWeight: "normal" }}
                          >
                            <div>
                              <span
                                id="document-attachment-icon"
                                className="icon-1"
                                style={{
                                  marginRight: "8px",
                                  border: "1px solid #dee2e6",
                                  paddingTop: "10px",
                                  paddingBottom: "10px",
                                  paddingLeft: "8px",
                                  paddingRight: "8px",
                                  fontSize: "12px",
                                }}
                              >
                                {documentAttachment ? (
                                  <i className="bi bi-dash-lg"></i>
                                ) : (
                                  <i className="bi bi-plus-lg"></i>
                                )}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "normal",
                                }}
                              >
                                Document Attachment
                              </span>
                            </div>
                          </a>

                          {documentAttachment && (
                            <div
                              id="document-attachment"
                              className="mt-2"
                              style={{ paddingLeft: "24px" }}
                            >
                              <div className="card card-body rounded-3 p-4">
                                {/* Document Details Table */}
                                <div className="tbl-container mt-3">
                                  <table className="w-100 table">
                                    <thead>
                                      <tr>
                                        <th className="text-start">Sr No</th>
                                        <th className="text-start">
                                          File Name
                                        </th>
                                        <th className="text-start">
                                          Uploaded At
                                        </th>
                                        <th className="text-start">Download</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data1?.attachments?.map(
                                        (attachment, index) => (
                                          <tr key={attachment.id}>
                                            <td className="text-start">
                                              {index + 1}
                                            </td>
                                            <td className="text-start">
                                              {attachment.filename}
                                            </td>
                                            <td className="text-start">
                                              {formattedDate}
                                            </td>
                                            {/* <td className="text-start">
                                              {new Date(
                                                attachment.blob_created_at
                                              ).toLocaleString()}
                                            </td> */}
                                            <td className="text-start">
                                              <a
                                                href={`https://vendors.lockated.com/rfq/events/${eventId}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`}
                                                download={attachment.filename}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 16 16"
                                                  style={{ fill: "black" }}
                                                >
                                                  <g fill="currentColor">
                                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                                  </g>
                                                </svg>
                                              </a>
                                            </td>
                                          </tr>
                                        )
                                      ) || (
                                        <tr>
                                          <td
                                            colSpan="5"
                                            className="text-center"
                                          >
                                            No attachments available.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-md-12 mt-2">
                          <p
                            className="text-end "
                            style={{ fontSize: "15px", marginRight: "15px" }}
                          >
                            Are you interested?
                          </p>
                          <div className="d-flex justify-content-end mt-2">
                            <button
                              className="col-md-0 purple-btn2"
                              onClick={handleYesClick}
                              style={{ fontSize: "16px" }}
                            >
                              Yes
                            </button>
                            <button
                              className="col-md-0 purple-btn2"
                              onClick={handleNoClick}
                              style={{ fontSize: "16px" }}
                            >
                              No{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                "No data available"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
