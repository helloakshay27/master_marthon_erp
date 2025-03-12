import React from "react";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";

import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SelectBox,
  SettingIcon,
  StarIcon,
} from "../components";

const MaterialRejctionSlip = () => {
  return (
    <main className="h-100 w-100">
      <div className="main-content">
        {/* sidebar ends above */}
        {/* webpage conteaint start */}
        <div className="website-content overflow-auto">
          <div className="module-data-section p-3">
            <a href="">
              Home &gt; Purchase &gt; MOR &gt; Material Rejection Slip
            </a>
            <h5 className="mt-3">Material Rejection Slip</h5>
            <div className="material-boxes mt-3">
              <div className="container-fluid">
                <div className="row justify-content-center gap-4">
                  <div className="col-md-2 text-center" style={{ opacity: 1 }}>
                    <div className="content-box">
                      <h4 className="content-box-title">Rejection Slip List</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                  <div className="col-md-2" style={{ opacity: 1 }}>
                    <div className="content-box text-center">
                      <h4 className="content-box-title">Pending for Action</h4>
                      <p className="content-box-sub ">150</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3 pb-4">
              <CollapsibleCard title="Quick Filter">
                <div>
                  <div className="row my-2 align-items-end">
                    {/* Event Title */}
                    <div className="col-md-3">
                      <label htmlFor="event-title-select">Company</label>

                      <SelectBox
                        // options={companyOptions}
                        // onChange={(selectedOption) =>
                        //   handleCompanySelection(selectedOption)
                        // }
                        value
                        placeholder={`Select Company`} // Dynamic placeholder
                        isSearchable={true}
                      />
                    </div>

                    {/* Event Number */}
                    <div className="col-md-3">
                      <label htmlFor="event-no-select">Project</label>

                      <SelectBox
                        // options={projects}
                        // onChange={(selectedOption) =>
                        //   handleProjectSelection(selectedOption)
                        // }
                        value
                        placeholder={`Select Project`} // Dynamic placeholder
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="event-no-select"> Sub Project</label>
                      <SelectBox
                        // options={siteOptions}
                        // onChange={(selectedOption) =>
                        //   handleSiteSelection(selectedOption)
                        // }
                        value
                        placeholder={`Select Sub-project`} // Dynamic placeholder
                      />
                    </div>

                    {/* )} */}
                    <button
                      type="submit"
                      className="col-md-1 purple-btn2 ms-2 mt-4"
                      // onClick={handleFilterSubmit}
                    >
                      Go{" "}
                    </button>

                    <button
                      className="col-md-1 purple-btn2 ms-2 mt-4"
                      // onClick={handleResetFilters}
                    >
                      Reset
                    </button>
                  </div>
                  {/* </form> */}
                </div>
              </CollapsibleCard>
              <div className="card mx-3 collapsed-card">
                <div className="card-header3">
                  <h3 className="card-title">Bulk Action</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx={16} cy={16} r={16} fill="#8B0203" />
                        <path
                          d="M16 24L9.0718 12L22.9282 12L16 24Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="card-body mt-0 pt-0">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>From Status</label>
                        <select
                          name="from_status"
                          id="from_status"
                          className="form-control form-select from"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                      <div className="form-group mt-3">
                        <label>To Status</label>
                        <select
                          name="to_status"
                          id="to_status"
                          className="form-control form-select to"
                        >
                          <option value="">Select Status</option>
                          <option value="draft">Draft</option>
                          <option value="send_for_approval">
                            Sent For Approval
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Remark</label>
                        <textarea
                          className="form-control remark"
                          rows={4}
                          placeholder="Enter ..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="offset-md-1 col-md-2">
                      <button className="purple-btn2 m-0 status">
                        <a style={{ color: "white !important" }}> Submit </a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex mt-3 align-items-end px-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="search"
                      id="searchInput"
                      className="form-control tbl-search"
                      placeholder="Type your keywords here"
                      //  value={searchTerm}
                      //  onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-md btn-default"
                        //  onClick={() => handleSearch()}
                      >
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tbl-container m-3 px-1  mt-3">
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>Sr.No.</th>
                      <th>PO No.</th>
                      <th>Challan</th>
                      <th>Material Types</th>
                      <th>MOR No.</th>
                      <th>Defective Qty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {" "}
                        RS65585
                      </td>
                      <td>IS6564262</td>
                      <td>10-03-2024</td>
                      <td>Tiles</td>
                      <td>MOR/MAR/MAX/101/02/2024</td>
                      <td> 40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* filter modal */}
        </div>
      </div>
    </main>
  );
};

export default MaterialRejctionSlip;
