import React from "react";
import PropTypes from "prop-types";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const EventTypeModal = ({
  size,
  show,
  onHide,
  title,
  footerButtons,
  eventType,
  handleEventTypeChange,
  eventTypeModal,
  handleEventTypeModalClose,
  selectedStrategy,
  handleRadioChange,
  awardType,
  handleAwardTypeChange,
  dynamicExtension,
  handleDynamicExtensionChange
}) => (
  <DynamicModalBox
        size="xl"
        show={eventTypeModal}
        onHide={handleEventTypeModalClose}
        title="Configuration for Event"
        footerButtons={[
          // @ts-ignore
          {
            label: "Close",
            onClick: handleEventTypeModalClose,
            props: {
              className: "purple-btn1",
            },
          },
          // @ts-ignore
          {
            label: "Save Changes",
            onClick: handleEventTypeModalClose,
            props: {
              className: "purple-btn2",
            },
          },
        ]}
      >
        <div className="ant-drawer-body">
          <div className="styles_auctionConfigContainer__huK3U">
            <div className="ant-row ant-form-item">
              <div className="ant-col ant-form-item-label">
                <label title="Event Type">Event Type</label>
              </div>
              <div className="ant-col ant-form-item-control-wrapper">
                <div className="ant-form-item-control">
                  <span className="ant-form-item-children">
                    <div
                      className="pro-radio-tabs"
                      style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                    >
                      <div
                        className={`pro-radio-tabs__tab ${
                          eventType === "Auction"
                            ? "pro-radio-tabs__tab__selected"
                            : ""
                        }`}
                        role="radio"
                        aria-checked={eventType === "Auction"}
                      >
                        <div className="pro-radio-tabs__check-icon">
                          <label
                            className={`ant-radio-wrapper ${
                              eventType === "Auction"
                                ? "ant-radio-wrapper-checked"
                                : ""
                            }`}
                          >
                            <span
                              className={`ant-radio ${
                                eventType === "Auction"
                                  ? "ant-radio-checked"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="ant-radio-input"
                                value="Auction"
                                checked={eventType === "Auction"}
                                onChange={handleEventTypeChange}
                              />
                              <div className="ant-radio-inner"></div>
                            </span>
                          </label>
                        </div>
                        <p className="pro-text pro-body pro-text--normal">
                          Auction
                        </p>
                      </div>
                      <div
                        className={`pro-radio-tabs__tab ${
                          eventType === "RFQ"
                            ? "pro-radio-tabs__tab__selected"
                            : ""
                        }`}
                        role="radio"
                        aria-checked={eventType === "RFQ"}
                      >
                        <div className="pro-radio-tabs__check-icon">
                          <label
                            className={`ant-radio-wrapper ${
                              eventType === "RFQ"
                                ? "ant-radio-wrapper-checked"
                                : ""
                            }`}
                          >
                            <span
                              className={`ant-radio ${
                                eventType === "RFQ" ? "ant-radio-checked" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="ant-radio-input"
                                value="RFQ"
                                checked={eventType === "RFQ"}
                                onChange={handleEventTypeChange}
                              />
                              <div className="ant-radio-inner"></div>
                            </span>
                          </label>
                        </div>
                        <p className="pro-text pro-body pro-text--normal">
                          RFQ
                        </p>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            {eventType === "Auction" && (
              <div
                className="pro-radio-tabs pro-radio-tabs2 rfq-tab-hide my-3"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}
              >
                {/* Rank Based Radio Button */}
                <div
                  className={`pro-radio-tabs__tab ${
                    selectedStrategy === "Rank Based"
                      ? "pro-radio-tabs__tab__selected"
                      : ""
                  }`}
                  tabIndex={0}
                  role="radio"
                  aria-checked={selectedStrategy === "Rank Based"}
                  onClick={() => handleRadioChange("Rank Based")}
                >
                  <div className="pro-radio-tabs__check-icon">
                    <label className="ant-radio-wrapper">
                      <span
                        className={`ant-radio ${
                          selectedStrategy === "Rank Based"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          checked={selectedStrategy === "Rank Based"}
                          onChange={() => handleRadioChange("Rank Based")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                    </label>
                  </div>
                  <div className="styles_strategy__xc2r+">
                    <div className="styles_strategyContent__c-1Di">
                      <p className="pro-text pro-body pro-text--medium">
                        Rank Based
                      </p>
                      <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                        Vendors will be ranked on bid price
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Based Radio Button */}
                <div
                  className={`pro-radio-tabs__tab ${
                    selectedStrategy === "Price Based"
                      ? "pro-radio-tabs__tab__selected"
                      : ""
                  }`}
                  tabIndex={0}
                  role="radio"
                  aria-checked={selectedStrategy === "Price Based"}
                  onClick={() => handleRadioChange("Price Based")}
                >
                  <div className="pro-radio-tabs__check-icon">
                    <label className="ant-radio-wrapper">
                      <span
                        className={`ant-radio ${
                          selectedStrategy === "Price Based"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          checked={selectedStrategy === "Price Based"}
                          onChange={() => handleRadioChange("Price Based")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                    </label>
                  </div>
                  <div className="styles_strategy__xc2r+">
                    <div className="styles_strategyContent__c-1Di">
                      <p className="pro-text pro-body pro-text--medium">
                        Price Based
                      </p>
                      <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                        Minimum bid price visible to vendors
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traffic Light Radio Button */}
                <div
                  className={`pro-radio-tabs__tab ${
                    selectedStrategy === "Traffic Light"
                      ? "pro-radio-tabs__tab__selected"
                      : ""
                  }`}
                  tabIndex={0}
                  role="radio"
                  aria-checked={selectedStrategy === "Traffic Light"}
                  onClick={() => handleRadioChange("Traffic Light")}
                >
                  <div className="pro-radio-tabs__check-icon">
                    <label className="ant-radio-wrapper">
                      <span
                        className={`ant-radio ${
                          selectedStrategy === "Traffic Light"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          checked={selectedStrategy === "Traffic Light"}
                          onChange={() => handleRadioChange("Traffic Light")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                    </label>
                  </div>
                  <div className="styles_strategy__xc2r+">
                    <div className="styles_strategyContent__c-1Di">
                      <p className="pro-text pro-body pro-text--medium">
                        Traffic Light
                      </p>
                      <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                        Vendors will be divided based on a specified range
                      </p>
                    </div>
                  </div>
                </div>

                {/* Knockout Radio Button */}
                <div
                  className={`pro-radio-tabs__tab ${
                    selectedStrategy === "Knockout"
                      ? "pro-radio-tabs__tab__selected"
                      : ""
                  }`}
                  tabIndex={0}
                  role="radio"
                  aria-checked={selectedStrategy === "Knockout"}
                  onClick={() => handleRadioChange("Knockout")}
                >
                  <div className="pro-radio-tabs__check-icon">
                    <label className="ant-radio-wrapper">
                      <span
                        className={`ant-radio ${
                          selectedStrategy === "Knockout"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          checked={selectedStrategy === "Knockout"}
                          onChange={() => handleRadioChange("Knockout")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                    </label>
                  </div>
                  <div className="styles_strategy__xc2r+">
                    <div className="styles_strategyContent__c-1Di">
                      <p className="pro-text pro-body pro-text--medium">
                        Knockout
                      </p>
                      <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                        Vendors will accept/reject your offer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dutch Auction Radio Button */}
                <div
                  className={`pro-radio-tabs__tab ${
                    selectedStrategy === "Dutch Auction"
                      ? "pro-radio-tabs__tab__selected"
                      : ""
                  }`}
                  tabIndex={0}
                  role="radio"
                  aria-checked={selectedStrategy === "Dutch Auction"}
                  onClick={() => handleRadioChange("Dutch Auction")}
                >
                  <div className="pro-radio-tabs__check-icon">
                    <label className="ant-radio-wrapper">
                      <span
                        className={`ant-radio ${
                          selectedStrategy === "Dutch Auction"
                            ? "ant-radio-checked"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          tabIndex={-1}
                          className="ant-radio-input"
                          checked={selectedStrategy === "Dutch Auction"}
                          onChange={() => handleRadioChange("Dutch Auction")}
                        />
                        <div className="ant-radio-inner" />
                      </span>
                    </label>
                  </div>
                  <div className="styles_strategy__xc2r+">
                    <div className="styles_strategyContent__c-1Di">
                      <p className="pro-text pro-body pro-text--medium">
                        Dutch Auction
                      </p>
                      <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                        First come first serve allocation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Award Section */}
            <div className="ant-row ant-form-item mt-3">
              <div className="ant-col ant-form-item-label">
                <label title="How will you award the event?">
                  How will you award the event?
                </label>
              </div>
              <div className="ant-col ant-form-item-control-wrapper">
                <div className="ant-form-item-control">
                  <span className="ant-form-item-children">
                    <div style={{ maxWidth: 700 }}>
                      <div
                        className="pro-radio-tabs"
                        style={{ gridTemplateColumns: "1fr 1fr" }}
                      >
                        <div
                          className={`pro-radio-tabs__tab ${
                            awardType === "SingleVendor"
                              ? "pro-radio-tabs__tab__selected"
                              : ""
                          }`}
                          role="radio"
                          aria-checked={awardType === "SingleVendor"}
                        >
                          <div className="pro-radio-tabs__check-icon">
                            <label
                              className={`ant-radio-wrapper ${
                                awardType === "SingleVendor"
                                  ? "ant-radio-wrapper-checked"
                                  : ""
                              }`}
                            >
                              <span
                                className={`ant-radio ${
                                  awardType === "SingleVendor"
                                    ? "ant-radio-checked"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="ant-radio-input"
                                  value="SingleVendor"
                                  checked={awardType === "SingleVendor"}
                                  onChange={handleAwardTypeChange}
                                />
                                <div className="ant-radio-inner"></div>
                              </span>
                            </label>
                          </div>
                          <p className="pro-text pro-body pro-text--normal">
                            I'll award the entire lot to single vendor
                          </p>
                        </div>
                        <div
                          className={`pro-radio-tabs__tab ${
                            awardType === "MultipleVendors"
                              ? "pro-radio-tabs__tab__selected"
                              : ""
                          }`}
                          role="radio"
                          aria-checked={awardType === "MultipleVendors"}
                        >
                          <div className="pro-radio-tabs__check-icon">
                            <label
                              className={`ant-radio-wrapper ${
                                awardType === "MultipleVendors"
                                  ? "ant-radio-wrapper-checked"
                                  : ""
                              }`}
                            >
                              <span
                                className={`ant-radio ${
                                  awardType === "MultipleVendors"
                                    ? "ant-radio-checked"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  className="ant-radio-input"
                                  value="MultipleVendors"
                                  checked={awardType === "MultipleVendors"}
                                  onChange={handleAwardTypeChange}
                                />
                                <div className="ant-radio-inner"></div>
                              </span>
                            </label>
                          </div>
                          <p className="pro-text pro-body pro-text--normal">
                            I may partially award the event to multiple vendors
                          </p>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <form className="ant-form-item my-4">
              <div>
                <div className="d-flex align-items-center gap-3 my-3">
                  <input
                    type="checkbox"
                    className="ant-radio-input"
                    checked={dynamicExtension}
                    onChange={handleDynamicExtensionChange}
                  />
                  <label htmlFor="Datepicker">
                    Dynamic Event Extension (Extend closing time in last 1 min
                    in case of rank / price changes in top selected bids.)
                  </label>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "200px", height: "60px" }}
                  />
                  <div className="d-flex align-items-center gap-3">
                    <span>Price</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span>Rank</span>
                  </div>
                </div>
                <div className="dynamic-time d-flex w-100 align-items-end mt-3 gap-5">
                  <div className="trigger-time">
                    <label>Trigger time extension on last</label>
                    <input
                      type="text"
                      placeholder="Min(s)"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                  <div className="extend-time">
                    <label>Extend time by</label>
                    <input
                      type="text"
                      placeholder="Min(s)"
                      style={{ marginLeft: "5px" }}
                    />
                  </div>
                  <div className="time-extention">
                    <label>Time extension on change in:</label>
                    <select
                      className="form-control form-select"
                      style={{ width: "100%" }}
                    >
                      <option selected>Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DynamicModalBox>
);


export default EventTypeModal;
