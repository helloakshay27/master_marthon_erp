import React from "react";
import PropTypes from "prop-types";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import SelectBox from "../../base/Select/SelectBox";
import { bidsType } from "../../../constant/data";

const Card = ({
  title,
  middleText,
  placeholder,
  bgColor,
  color,
  circleColor,
}) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: circleColor,
        borderRadius: "4px",
        textAlign: "left",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "64%",
        marginTop: "-8px",
        height: "50px",
      }}
    >
      <h5 style={{ margin: 0, fontSize: "15px", paddingTop: "15px" }}>
        {" "}
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="10" fill={circleColor} />
        </svg>
        {title}
      </h5>

      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "rgba(0, 0, 0, 0.5)",
          width: "15%",
          paddingTop: "12px",
        }}
      >
        {middleText}
      </p>

      <input
        type="text"
        placeholder={placeholder}
        style={{
          padding: "4px",
          borderRadius: "3px",
          border: "1px solid #ccc",
          outline: "none",
          marginRight: "10px",
          width: "48%",
        }}
      />
    </div>
  );
};

const EventTypeModal = ({
  size,
  show,
  onHide,
  title,
  footerButtons,
  handleEventConfigurationSubmit,
  eventType,
  handleEventTypeChange,
  eventTypeModal,
  handleEventTypeModalClose,
  selectedStrategy,
  handleRadioChange,
  awardType,
  handleAwardTypeChange,
  dynamicExtension,
  handleDynamicExtensionChange,
  dynamicExtensionConfigurations,
  trafficType,
  handleTrafficChange,
  handleDynamicExtensionBid,
}) => {
  // const [eventType]

  const validateForm = () => {
    if (!eventType) {
      alert("Please select an event type.");
      return false;
    }
    if (eventType === "0" && !selectedStrategy) {
      alert("Please select a strategy.");
      return false;
    }
    if (selectedStrategy === "2") {
      if (!dynamicExtensionConfigurations.triggered_time_extension_on_last) {
        alert("Please enter the trigger time extension.");
        return false;
      }
      if (!dynamicExtensionConfigurations.extend_event_time_by) {
        alert("Please enter the extend time.");
        return false;
      }
    }
    if (
      dynamicExtension[2] &&
      !dynamicExtensionConfigurations.minimum_revisions
    ) {
      alert("Please enter the minimum revisions required.");
      return false;
    }
    if (dynamicExtension[3] && !dynamicExtensionConfigurations.delivery_date) {
      alert("Please select a delivery date.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      handleEventConfigurationSubmit();
    }
  };

  return (
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
          onClick: handleFormSubmit,
          props: {
            className: "purple-btn2",
          },
        },
      ]}
      // @ts-ignore
      modalType={true}
    >
      <div className="ant-drawer-body setting-modal">
        <div className="ant-row ant-form-item">
          <div className="ant-col ant-form-item-label">
            <label title="Event Type">
              Event Type <span style={{ color: "red" }}>*</span>
            </label>
          </div>
          <div className="ant-col ant-form-item-control-wrapper">
            <div
              className="pro-radio-tabs"
              style={{ gridTemplateColumns: "4fr 4fr 4fr" }}
            >
              <div
                className={`pro-radio-tabs__tab ${
                  eventType === "rfq" ? "pro-radio-tabs__tab__selected" : ""
                }`}
                role="radio"
                aria-checked={eventType === "rfq"}
                onClick={() => handleEventTypeChange("rfq")}
                tabIndex={0}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    className={`ant-radio-wrapper ${
                      eventType === "rfq" ? "ant-radio-wrapper-checked" : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        eventType === "rfq" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="rfq"
                        checked={eventType === "rfq"}
                        onChange={() => handleEventTypeChange("rfq")}
                        tabIndex={-1}
                      />
                      <div className="ant-radio-inner"></div>
                    </span>
                  </label>
                </div>
                <p className="pro-text pro-body pro-text--normal">RFQ</p>
              </div>

              {/* contract Tab */}
              <div
                className={`pro-radio-tabs__tab ${
                  eventType === "contract"
                    ? "pro-radio-tabs__tab__selected"
                    : ""
                }`}
                role="radio"
                aria-checked={eventType === "contract"}
                tabIndex={0}
                onClick={() => handleEventTypeChange("contract")}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    className={`ant-radio-wrapper ${
                      eventType === "contract"
                        ? "ant-radio-wrapper-checked"
                        : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        eventType === "contract" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="contract"
                        checked={eventType === "contract"}
                        onChange={() => handleEventTypeChange("contract")}
                      />
                      <div className="ant-radio-inner"></div>
                    </span>
                  </label>
                </div>
                <p className="pro-text pro-body pro-text--normal">Contract</p>
              </div>

              <div
                className={`pro-radio-tabs__tab ${
                  eventType === "auction" ? "pro-radio-tabs__tab__selected" : ""
                }`}
                role="radio"
                aria-checked={eventType === "auction"}
                tabIndex={0}
                onClick={() => handleEventTypeChange("auction")}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    htmlFor="eventType"
                    className={`ant-radio-wrapper ${
                      eventType === "auction" ? "ant-radio-wrapper-checked" : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        eventType === "auction" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="auction"
                        checked={eventType === "auction"}
                        onChange={() => handleEventTypeChange("auction")}
                        id="eventType"
                      />
                      <div className="ant-radio-inner"></div>
                    </span>
                  </label>
                </div>
                <p className="pro-text pro-body pro-text--normal">Auction</p>
              </div>
              
            </div>
          </div>
        </div>
        {eventType === "auction" && (
          <div
            className="pro-radio-tabs pro-radio-tabs2 rfq-tab-hide my-3"
            style={{ gridTemplateColumns: "6fr 6fr" }}
          >
            <div
              className={`pro-radio-tabs__tab ${
                selectedStrategy === "rank_based"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={selectedStrategy === "rank_based"}
              onClick={() => handleRadioChange("rank_based")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      selectedStrategy === "rank_based"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={selectedStrategy === "rank_based"}
                      onChange={() => handleRadioChange("rank_based")}
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
            <div
              className={`pro-radio-tabs__tab ${
                selectedStrategy === "price_based"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={selectedStrategy === "price_based"}
              onClick={() => handleRadioChange("price_based")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      selectedStrategy === "price_based"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={selectedStrategy === "price_based"}
                      onChange={() => handleRadioChange("price_based")}
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
            {/* <div
            className={`pro-radio-tabs__tab ${
              selectedStrategy === "2"
                ? "pro-radio-tabs__tab__selected"
                : ""
            }`}
            tabIndex={0}
            role="radio"
            aria-checked={selectedStrategy === "2"}
            onClick={() => handleRadioChange("Traffic Light")}
          >
            <div className="pro-radio-tabs__check-icon">
              <label className="ant-radio-wrapper">
                <span
                  className={`ant-radio ${
                    selectedStrategy === "2"
                      ? "ant-radio-checked"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    tabIndex={-1}
                    className="ant-radio-input"
                    checked={selectedStrategy === "2"}
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
          </div> */}

            <div
              className={`pro-radio-tabs__tab ${
                selectedStrategy === "traffic_light"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={selectedStrategy === "traffic_light"}
              onClick={() => handleRadioChange("traffic_light")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      selectedStrategy === "traffic_light"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={selectedStrategy === "traffic_light"}
                      onChange={() => handleRadioChange("traffic_light")}
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

            {/* <div
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
                    selectedStrategy === "Knockout" ? "ant-radio-checked" : ""
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
                <p className="pro-text pro-body pro-text--medium">Knockout</p>
                <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                  Vendors will accept/reject your offer
                </p>
              </div>
            </div>
          </div> */}
            {/* <div
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
          </div> */}
          </div>
        )}
        {selectedStrategy === "2" && (
          <div className="ant-row ant-form-item mt-3">
            <div className="ant-row ant-form-item mt-3">
              <div className="ant-col">
                <label title="How will you award the event?">
                  Group traffic light by:
                </label>
              </div>
              <div className="ant-col">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="radio"
                      name="groupTrafficLight"
                      value="price"
                      style={{ marginRight: "5px" }}
                    />
                    Price
                  </label>
                  <label
                    style={{
                      marginLeft: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="radio"
                      name="groupTrafficLight"
                      value="checked"
                      style={{ marginRight: "5px" }}
                    />
                    Rank
                  </label>
                </div>
              </div>
            </div>
            {/* // card  */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <Card
                title="GREEN"
                middleText="Gross Total Less Than"
                placeholder="223"
                // bgColor="rgba(0, 128, 0, 0.3)"
                bgColor="rgba(220,255,220,1)"
                circleColor="green"
                color={""}
              />

              {/* Card for Yellow */}
              <Card
                title="YELLOW"
                color="yellow"
                middleText="Gross Total Less Than"
                placeholder="2323"
                bgColor="rgba(255,255,220,1)"
                circleColor="orange"
              />

              {/* Card for Green */}
            </div>
          </div>
        )}

        <div className="ant-col ant-form-item-label">
          <label title="How will you award the event?">
            How will you award the event?{" "}
            <span style={{ color: "red" }}>*</span>
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
                      awardType === "single_vendor"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    role="radio"
                    aria-checked={awardType === "single_vendor"}
                    onClick={() => handleAwardTypeChange("single_vendor")}
                    tabIndex={-1}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label
                        className={`ant-radio-wrapper ${
                          awardType === "single_vendor"
                            ? "ant-radio-wrapper-checked"
                            : ""
                        }`}
                      >
                        <span
                          className={`ant-radio ${
                            awardType === "single_vendor"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="ant-radio-input"
                            value="single_vendor"
                            checked={awardType === "single_vendor"}
                            onChange={() =>
                              handleAwardTypeChange("single_vendor")
                            }
                            tabIndex={-1}
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
                      awardType === "multiple_vendors"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    role="radio"
                    aria-checked={awardType === "multiple_vendors"}
                    onClick={() => handleAwardTypeChange("multiple_vendors")}
                    tabIndex={0}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label
                        className={`ant-radio-wrapper ${
                          awardType === "multiple_vendors"
                            ? "ant-radio-wrapper-checked"
                            : ""
                        }`}
                      >
                        <span
                          className={`ant-radio ${
                            awardType === "multiple_vendors"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="ant-radio-input"
                            value="multiple_vendors"
                            checked={awardType === "multiple_vendors"}
                            onChange={() =>
                              handleAwardTypeChange("multiple_vendors")
                            }
                            tabIndex={-1}
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
        <form className="ant-form-item my-4">
          <div>
            {selectedStrategy === "0" && (
              <div className="d-flex align-items-center gap-2 my-3">
                <input
                  type="checkbox"
                  // checked={dynamicExtension[0]}
                  // onChange={(e) =>
                  //   handleDynamicExtensionChange(0, e.target.checked)
                  // }
                />
                <div className="ant-col ant-form-item-label">
                  Show rank to vendor for individual item.
                </div>
              </div>
            )}
            <div className="d-flex align-items-center gap-2 my-3">
              <input
                type="checkbox"
                checked={dynamicExtension[1]}
                onChange={(e) =>
                  handleDynamicExtensionChange(1, e.target.checked)
                }
              />
              <div className="ant-col ant-form-item-label">
                Dynamic Event Extension
              </div>
            </div>
            {dynamicExtension[1] && (
              <>
                <label htmlFor="Datepicker">
                  Extend closing time in last 1 min in case of rank / price
                  changes in top selected bids.{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className={`pro-radio-tabs__tab ${
                      dynamicExtensionConfigurations.time_extension_type ===
                      "type1"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    style={{ width: "50%" }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={
                      dynamicExtensionConfigurations.time_extension_type ===
                      "type1"
                    }
                    onClick={() =>
                      handleDynamicExtensionBid("time_extension_type", "type1")
                    }
                  >
                    <span
                      className={`ant-radio ${
                        dynamicExtensionConfigurations.time_extension_type ===
                        "type1"
                          ? "ant-radio-checked"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        tabIndex={-1}
                        className="ant-radio-input"
                        checked={
                          dynamicExtensionConfigurations.time_extension_type ===
                          "type1"
                        }
                        onChange={() =>
                          handleDynamicExtensionBid(
                            "time_extension_type",
                            "type1"
                          )
                        }
                      />
                      <div className="ant-radio-inner" />
                    </span>
                    <p className="pro-text pro-body pro-text--medium ps-2">
                      Price
                    </p>
                  </div>
                  <div
                    className={`pro-radio-tabs__tab col-md-6 ${
                      dynamicExtensionConfigurations.time_extension_type ===
                      "type2"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    style={{ width: "50%" }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={
                      dynamicExtensionConfigurations.time_extension_type ===
                      "type2"
                    }
                    onClick={() =>
                      handleDynamicExtensionBid("time_extension_type", "type2")
                    }
                  >
                    <span
                      className={`ant-radio ${
                        dynamicExtensionConfigurations.time_extension_type ===
                        "type2"
                          ? "ant-radio-checked"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        tabIndex={-1}
                        className="ant-radio-input"
                        checked={
                          dynamicExtensionConfigurations.time_extension_type ===
                          "type2"
                        }
                        onChange={() =>
                          handleDynamicExtensionBid(
                            "time_extension_type",
                            "type2"
                          )
                        }
                      />
                      <div className="ant-radio-inner" />
                    </span>
                    <p className="pro-text pro-body pro-text--medium ps-2">
                      Rank
                    </p>
                  </div>
                </div>
                <div
                  className="dynamic-time d-grid w-100 align-items-end mt-3 gap-2"
                  style={{ gridTemplateColumns: "6fr 6fr" }}
                >
                  <div className="trigger-time">
                    <label>
                      Trigger time extension on last{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Min(s)"
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                      value={
                        dynamicExtensionConfigurations.triggered_time_extension_on_last
                      }
                      onChange={(e) =>
                        handleDynamicExtensionBid(
                          "triggered_time_extension_on_last",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="extend-time">
                    <label>
                      Extend time by <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Min(s)"
                      className="form-control"
                      style={{ marginLeft: "5px" }}
                      value={
                        dynamicExtensionConfigurations.extend_event_time_by
                      }
                      onChange={(e) =>
                        handleDynamicExtensionBid(
                          "extend_event_time_by",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="time-extention">
                    <label>
                      Time extension on change in:{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <SelectBox
                      label={""}
                      options={bidsType}
                      defaultValue={"Select Top bids"}
                      onChange={(value) => {
                        handleDynamicExtensionBid(
                          "time_extension_on_change_in",
                          value
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="d-flex align-items-center gap-2 my-3">
              <input
                type="checkbox"
                checked={dynamicExtension[2]}
                onChange={(e) =>
                  handleDynamicExtensionChange(2, e.target.checked)
                }
              />
              <div className="ant-col ant-form-item-label">
                Set minimum revisions to show Rank
              </div>
            </div>
            {dynamicExtension[2] && (
              <input
                type="number"
                className="form-control"
                placeholder="Enter number of revisions required"
                value={dynamicExtensionConfigurations.minimum_revisions}
                onChange={(e) =>
                  handleDynamicExtensionBid("minimum_revisions", e.target.value)
                }
              />
            )}
            <div className="d-flex align-items-center gap-2 my-3">
              <input
                type="checkbox"
                checked={dynamicExtension[3]}
                onChange={(e) =>
                  handleDynamicExtensionChange(3, e.target.checked)
                }
              />
              <div className="ant-col ant-form-item-label">Delivery Date</div>
            </div>
            {dynamicExtension[3] && (
              <input
                type="datetime-local"
                placeholder="Select Date"
                className="form-control"
                value={dynamicExtensionConfigurations.delivery_date}
                onChange={(e) =>
                  handleDynamicExtensionBid("delivery_date", e.target.value)
                }
              />
            )}
          </div>
        </form>
      </div>
    </DynamicModalBox>
  );
};

export default EventTypeModal;
