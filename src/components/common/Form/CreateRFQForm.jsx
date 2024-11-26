import { orderSummaryColumns, orderSummaryData } from "../../../constant/data";
import Table from "../../base/Table/Table";
import SettingIcon from "../Icon/SettingIcon";
import React from "react";

export default function CreateRFQForm({
  handleEventTypeModalShow,
  handleEventScheduleModalShow,
  handleSettingModalShow,
}) {
  return (
    <div className="row ">
      <div className="card-body">
        <div className="row align-items-end justify-items-end mx-2">
          <div className="col-md-4 mt-0">
            <div className="form-group">
              <label className="po-fontBold">Event Type</label>
            </div>
            <input
              className="form-control "
              onClick={handleEventTypeModalShow}
              placeholder="+ Select [RFQ / Auction]"
            />
          </div>
          <div className="col-md-4 mt-0">
            <div className="form-group">
              <label className="po-fontBold">Event No.</label>
              <input
                className="form-control"
                type="text"
                placeholder="Neo Valley"
              />
            </div>
          </div>
          <div className="col-md-4 mt-0">
            <div className="form-group">
              <label className="po-fontBold">Created On</label>
              <input
                className="form-control"
                type="text"
                placeholder="Materia"
              />
            </div>
          </div>
          <div className="col-md-4 mt-2">
            <div className="form-group">
              <label className="po-fontBold">Material Type</label>
              <input
                className="form-control"
                type="text"
                placeholder="05-02-2024"
              />
            </div>
          </div>
          <div className="col-md-4 mt-2">
            <div className="form-group">
              <label className="po-fontBold">Event Schedule</label>
            </div>
            <input
              className="form-control "
              onClick={handleEventScheduleModalShow}
              placeholder="From [dd-mm-yy hh:mm] To [dd-mm-yy hh:mm] ([DD] Days
                                                          [HH] Hrs [MM] Mins)"
            />
          </div>
          <div className="col-md-4 mt-2 ">
            <button className="purple-btn1 m-0 color-#fff">
              <span className="material-symbols-outlined align-text-top">
                add
              </span>
              Additional Vendor Fields
            </button>
          </div>
        </div>
        <div className="mt-3 mx-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className=" mb-0">Order Summery</h5>
            <button
              type="submit"
              className="btn btn-md"
              onClick={handleSettingModalShow}
            >
              <SettingIcon
                color={"#8B0203"}
                style={{ width: "30px", height: "30px" }}
              />
            </button>
          </div>
        </div>
        <div className="mx-3">
        <Table
          columns={orderSummaryColumns}
          data={orderSummaryData}
          showCheckbox={true}
        />
        </div>
      </div>
    </div>
  );
}
