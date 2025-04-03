import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EventTemplateList() {
  const [eventTemplates, setEventTemplates] = useState([]);
  const [pagination, setPagination] = useState({
    total_count: 0,
    current_page: 1,
    total_pages: 1,
  });
  const navigate = useNavigate();
  const id = useParams();

  useEffect(() => {
    fetchEventTemplates();
  }, [pagination.current_page]);

  const fetchEventTemplates = async () => {
    try {
      const response = await axios.get(
        `https://marathon.lockated.com/rfq/event_templates?page=${pagination.current_page}`
      );
      setEventTemplates(response.data.event_templates || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Error fetching event templates:", error);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  return (
    <>
      <div className="main-content">
        <div className="website-content overflow-auto">
          <div className="module-data-section">
            <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-light border-bottom thead">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none text-primary">
                      RFQ
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Event Template List
                  </li>
                </ol>
              </nav>
              <h5 className="mt-3 ms-3">Event Template List</h5>
              <div style={{ width: "15%" }}></div>
            </div>

            <div className="d-flex justify-content-end align-items-center px-4 py-2 bg-light border-bottom">
              <button
                className="purple-btn2"
                onClick={() => navigate("/event-template-create")}
              >
                <span className="material-symbols-outlined align-text-top">
                  add
                </span>
                Create Event Template
              </button>
            </div>

            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="tbl-container mt-3 px-3">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sr No.</th>
                        <th>Event Template Name</th>
                        <th>Action</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventTemplates.length === 0 ? (
                        <tr>
                          <td colSpan="3">No event templates found.</td>
                        </tr>
                      ) : (
                        eventTemplates.map((template, index) => (
                          <tr key={template.id}>
                            <td>
                              {(pagination.current_page - 1) * 10 + index + 1}
                            </td>
                            <td>{template.name || "N/A"}</td>
                            <td>
                              <button
                                className="btn"
                                onClick={() =>
                                  navigate(
                                    `/event-template-details/${template.id}`
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-eye"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                                </svg>
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn"
                                onClick={() =>
                                  navigate(
                                    `/edit-template/${template.id}`
                                  )
                                }
                              >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-square"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                  </svg>
                              </button>
                            </td>
                            
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                  <ul className="pagination justify-content-center d-flex">
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(1)}
                      >
                        First
                      </button>
                    </li>
                    <li
                      className={`page-item ${
                        pagination.current_page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                      >
                        Prev
                      </button>
                    </li>
                    {[...Array(pagination.total_pages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          pagination.current_page === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${
                        pagination.current_page === pagination.total_pages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.total_pages)}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                  <div>
                    <p>
                      Showing{" "}
                      {Math.min(
                        (pagination.current_page - 1) * 10 + 1,
                        pagination.total_count
                      )}{" "}
                      to{" "}
                      {Math.min(
                        pagination.current_page * 10,
                        pagination.total_count
                      )}{" "}
                      of {pagination.total_count} entries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
