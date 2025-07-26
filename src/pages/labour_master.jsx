
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../confi/apiDomain";
import SingleSelector from "../components/base/Select/SingleSelector";

const LabourMaster = () => {
  return (
    <div className="website-content overflow-auto">
      <div className="module-data-section p-4">
        <a href="#">Setup &gt; Purchase Setup &gt; Labour Master</a>
        <h5 className="mt-4">Labour Master</h5>

        <div className="card mt-5 pb-4">
          <div className="d-flex justify-content-end ">
            <div className="card-tools">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="bi bi-plus"></i> Add
              </button>
            </div>
          </div>

          <div className="tbl-container  mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Labour Code/ID</th>
                  <th>Contractor Name</th>
                  <th>Labour Sub-Type</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Middle Name</th>
                  <th>Date of Birth</th>
                  <th>Phone Number</th>
                  <th>Job Title/Position</th>
                  <th>Labour Category</th>
                  <th>Work Shifts</th>
                  <th>Availability</th>
                  <th>Employment Status</th>
                  <th>Bank Account Name</th>
                  <th>Bank Account No.</th>
                  <th>Bank Branch Name</th>
                  <th>Bank Branch IFSC Code</th>
                  <th>Union Memberships</th>
                  <th>Hourly Rate/Salary</th>
                  <th>Overtime Rate</th>
                  <th>Address</th>
                  <th>Department</th>
                  <th>Supervisor</th>
                  <th>Hire Date</th>
                  <th>Equipment Certifications</th>
                  <th>Photo</th>
                  <th>Documents</th>
                  <th>License/Permit Information</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((num) => (
                  <tr key={num} data-bs-toggle="modal" data-bs-target="#readOnlyModal">
                    <td>{num}</td>
                    {Array(28).fill(null).map((_, i) => (
                      <td key={i}></td>
                    ))}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <img src="../Data_Mapping/img/Green_check.svg" alt="Check" />
                        <img src="../Data_Mapping/img/Edit.svg" alt="Edit" data-bs-toggle="modal" data-bs-target="#exampleModal" />
                        <img src="../Data_Mapping/img/Delete_red.svg" alt="Delete" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Powered by <img src="./images/go-logo.JPG" alt="Logo" /></p>
      </footer>
    </div>
  );
};

export default LabourMaster;
