import React, { useState, useEffect } from "react";
import Table from "../../base/Table/Table";
import { participantsTabColumns } from "../../../constant/data";
import SearchIcon from "../Icon/SearchIcon";

export default function ParticipantsTab({ data }) {
  const [isSelectCheckboxes, setIsSelectCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(
      Array.isArray(data?.event_vendors)
        ? data.event_vendors.map((vendor) => {
            const { organization_name, contact_number, email } = vendor.pms_supplier || {};
            return {
              name: organization_name || "_",
              phone: contact_number || "_",
              email: email || "_",
            };
          })
        : []
    );
  }, [data]);

  const handleSwitchChange = (e) => {
    const checked = e.target.checked;
    setIsSelectCheckboxes(checked);

    if (!checked) {
      setSelectedRows([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredData(
        Array.isArray(data?.event_vendors)
          ? data.event_vendors.map((vendor) => {
              const { organization_name, contact_number, email } = vendor.pms_supplier || {};
              return {
                name: organization_name || "_",
                phone: contact_number || "_",
                email: email || "_",
              };
            })
          : []
      );
    }
  };

  const handleSearchClick = () => {
    const filtered = Array.isArray(data?.event_vendors)
      ? data.event_vendors
          .map((vendor) => {
            const { organization_name, contact_number, email } = vendor.pms_supplier || {};
            return {
              name: organization_name || "_",
              phone: contact_number || "_",
              email: email || "_",
            };
          })
          .filter((vendor) =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      : [];
    setFilteredData(filtered);
  };

  const tableData = filteredData.map((vendor, index) => ({
    srNo: index + 1, // Add serial number
    ...vendor,
  }));


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
          <div className="input-group">
            <input
              type="search"
              id="searchInput"
              className="w-50 tbl-search"
              placeholder="Type your vendors here"
              style={{ paddingLeft: "10px" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="input-group-append">
              <button type="button" className="btn btn-md btn-default" onClick={handleSearchClick}>
                <SearchIcon />
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* <div className="d-flex align-items-center">
              <p className="eventList-p1 mb-0 me-2" style={{ textWrap: "nowrap" }}>
                Show only selected vendors
              </p>
              <div className="form-check form-switch mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={isSelectCheckboxes}
                  onChange={handleSwitchChange}
                />
              </div>
            </div> */}
            <div>
              <img
                className="me-2"
                src="../erp_event_module/img/Separator-dark.svg"
                alt=""
              />
            </div>
            {/* <select
              name="language"
              className="event-participant-select eventD-forms buyEvent-forms"
              required
            >
              <option value="" disabled selected hidden>
                Filter by city
              </option>
              <option value="indian">xxxxxxxx</option>
              <option value="nepali">xxxxxxxx</option>
              <option value="others">Others</option>
            </select> */}
          </div>
        </div>
        {tableData.length > 0 ? (
          <Table
            columns={participantsTabColumns} // Use columns with serial number
            data={tableData}
          />
        ) : (
          <div className="text-center mt-4">No data found</div>
        )}
      </div>
    </div>
  );
}
