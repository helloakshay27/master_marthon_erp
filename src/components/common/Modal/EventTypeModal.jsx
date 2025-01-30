import React, { useEffect, useState } from "react";
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
  existingData,
}) => {
  const [localEventType, setLocalEventType] = useState(eventType);
  const [localSelectedStrategy, setLocalSelectedStrategy] = useState(selectedStrategy);
  const [localAwardType, setLocalAwardType] = useState(awardType);
  const [localDynamicExtension, setLocalDynamicExtension] = useState(dynamicExtension || [false, false, false, false]);
  const [localDynamicExtensionConfigurations, setLocalDynamicExtensionConfigurations] = useState(dynamicExtensionConfigurations);

  useEffect(() => {
    if (existingData) {
      setLocalEventType(existingData.event_type);
      setLocalSelectedStrategy(existingData.event_configuration);
      setLocalAwardType(existingData.award_scheme);
      setLocalDynamicExtension(existingData.dynamic_time_extension || [false, false, false, false]);
      setLocalDynamicExtensionConfigurations({
        time_extension_type: existingData.time_extension_type,
        triggered_time_extension_on_last: (existingData.triggered_time_extension_on_last),
        extend_event_time_by: existingData.extend_event_time_by,
        time_extension_on_change_in: existingData.time_extension_change,
        delivery_date: existingData.delivery_date ? new Date(existingData.delivery_date).toISOString().slice(0, 16) : "",
      });
    }

    console.log("localDynamicExtensionConfigurations :------",
      localDynamicExtensionConfigurations, existingData);
    
  }, [existingData]);  

  const validateForm = () => {
    if (!["rfq", "contract", "auction"].includes(localEventType)) {
      alert("Please select a valid event type.");
      return false;
    }
    if (!["single_vendor", "multiple_vendors"].includes(localAwardType)) {
      alert("Please select a valid award scheme.");
      return false;
    }
    if (localDynamicExtension[3] && !localDynamicExtensionConfigurations.delivery_date) {
      alert("Please select a delivery date.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {

      handleEventConfigurationSubmit({
        event_type: localEventType,
        event_configuration: localSelectedStrategy,
        award_scheme: localAwardType,
        dynamic_time_extension: localDynamicExtension,
        time_extension_type: localDynamicExtensionConfigurations.time_extension_type || "",
        triggered_time_extension_on_last: localDynamicExtensionConfigurations.triggered_time_extension_on_last || "",
        extend_event_time_by: localDynamicExtensionConfigurations.extend_event_time_by || 0,
        time_extension_change: localDynamicExtensionConfigurations.time_extension_on_change_in || "",
        delivery_date: localDynamicExtensionConfigurations.delivery_date || "",
      });
    }
  };

  const handleDynamicExtensionBidLocal = (key, value) => {
    setLocalDynamicExtensionConfigurations((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  
  return (
    <DynamicModalBox
      size="xl"
      show={eventTypeModal}
      onHide={handleEventTypeModalClose}
      title="Configuration for Event"
      footerButtons={[
        {
          label: "Close",
          onClick: handleEventTypeModalClose,
          props: {
            className: "purple-btn1",
          },
        },
        {
          label: "Save Changes",
          onClick: handleFormSubmit,
          props: {
            className: "purple-btn2",
          },
        },
      ]}
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
                  localEventType === "rfq" ? "pro-radio-tabs__tab__selected" : ""
                }`}
                role="radio"
                aria-checked={localEventType === "rfq"}
                onClick={() => setLocalEventType("rfq")}
                tabIndex={0}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    className={`ant-radio-wrapper ${
                      localEventType === "rfq" ? "ant-radio-wrapper-checked" : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        localEventType === "rfq" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="rfq"
                        checked={localEventType === "rfq"}
                        onChange={() => setLocalEventType("rfq")}
                        tabIndex={-1}
                      />
                      <div className="ant-radio-inner"></div>
                    </span>
                  </label>
                </div>
                <p className="pro-text pro-body pro-text--normal">RFQ</p>
              </div>

              <div
                className={`pro-radio-tabs__tab ${
                  localEventType === "contract"
                    ? "pro-radio-tabs__tab__selected"
                    : ""
                }`}
                role="radio"
                aria-checked={localEventType === "contract"}
                tabIndex={0}
                onClick={() => setLocalEventType("contract")}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    className={`ant-radio-wrapper ${
                      localEventType === "contract"
                        ? "ant-radio-wrapper-checked"
                        : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        localEventType === "contract" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="contract"
                        checked={localEventType === "contract"}
                        onChange={() => setLocalEventType("contract")}
                      />
                      <div className="ant-radio-inner"></div>
                    </span>
                  </label>
                </div>
                <p className="pro-text pro-body pro-text--normal">Contract</p>
              </div>

              <div
                className={`pro-radio-tabs__tab ${
                  localEventType === "auction" ? "pro-radio-tabs__tab__selected" : ""
                }`}
                role="radio"
                aria-checked={localEventType === "auction"}
                tabIndex={0}
                onClick={() => setLocalEventType("auction")}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label
                    htmlFor="eventType"
                    className={`ant-radio-wrapper ${
                      localEventType === "auction" ? "ant-radio-wrapper-checked" : ""
                    }`}
                  >
                    <span
                      className={`ant-radio ${
                        localEventType === "auction" ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="ant-radio-input"
                        value="auction"
                        checked={localEventType === "auction"}
                        onChange={() => setLocalEventType("auction")}
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
        {localEventType === "auction" && (
          <div
            className="pro-radio-tabs pro-radio-tabs2 rfq-tab-hide my-3"
            style={{ gridTemplateColumns: "6fr 6fr" }}
          >
            <div
              className={`pro-radio-tabs__tab ${
                localSelectedStrategy === "rank_based"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={localSelectedStrategy === "rank_based"}
              onClick={() => setLocalSelectedStrategy("rank_based")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      localSelectedStrategy === "rank_based"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={localSelectedStrategy === "rank_based"}
                      onChange={() => setLocalSelectedStrategy("rank_based")}
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
                localSelectedStrategy === "price_based"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={localSelectedStrategy === "price_based"}
              onClick={() => setLocalSelectedStrategy("price_based")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      localSelectedStrategy === "price_based"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={localSelectedStrategy === "price_based"}
                      onChange={() => setLocalSelectedStrategy("price_based")}
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

            <div
              className={`pro-radio-tabs__tab ${
                localSelectedStrategy === "traffic_light"
                  ? "pro-radio-tabs__tab__selected"
                  : ""
              }`}
              tabIndex={0}
              role="radio"
              aria-checked={localSelectedStrategy === "traffic_light"}
              onClick={() => setLocalSelectedStrategy("traffic_light")}
            >
              <div className="pro-radio-tabs__check-icon">
                <label className="ant-radio-wrapper">
                  <span
                    className={`ant-radio ${
                      localSelectedStrategy === "traffic_light"
                        ? "ant-radio-checked"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      tabIndex={-1}
                      className="ant-radio-input"
                      checked={localSelectedStrategy === "traffic_light"}
                      onChange={() => setLocalSelectedStrategy("traffic_light")}
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
          </div>
        )}
        {localSelectedStrategy === "2" && (
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
                bgColor="rgba(220,255,220,1)"
                circleColor="green"
                color={""}
              />

              <Card
                title="YELLOW"
                color="yellow"
                middleText="Gross Total Less Than"
                placeholder="2323"
                bgColor="rgba(255,255,220,1)"
                circleColor="orange"
              />
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
                      localAwardType === "single_vendor"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    role="radio"
                    aria-checked={localAwardType === "single_vendor"}
                    onClick={() => setLocalAwardType("single_vendor")}
                    tabIndex={-1}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label
                        className={`ant-radio-wrapper ${
                          localAwardType === "single_vendor"
                            ? "ant-radio-wrapper-checked"
                            : ""
                        }`}
                      >
                        <span
                          className={`ant-radio ${
                            localAwardType === "single_vendor"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="ant-radio-input"
                            value="single_vendor"
                            checked={localAwardType === "single_vendor"}
                            onChange={() => setLocalAwardType("single_vendor")}
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
                      localAwardType === "multiple_vendors"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    role="radio"
                    aria-checked={localAwardType === "multiple_vendors"}
                    onClick={() => setLocalAwardType("multiple_vendors")}
                    tabIndex={0}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label
                        className={`ant-radio-wrapper ${
                          localAwardType === "multiple_vendors"
                            ? "ant-radio-wrapper-checked"
                            : ""
                        }`}
                      >
                        <span
                          className={`ant-radio ${
                            localAwardType === "multiple_vendors"
                              ? "ant-radio-checked"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="ant-radio-input"
                            value="multiple_vendors"
                            checked={localAwardType === "multiple_vendors"}
                            onChange={() => setLocalAwardType("multiple_vendors")}
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
            {localSelectedStrategy === "0" && (
              <div className="d-flex align-items-center gap-2 my-3">
                <input
                  type="checkbox"
                  checked={localDynamicExtension[0]}
                  onChange={(e) =>
                    handleDynamicExtensionChange(0, e.target.checked)
                  }
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
                      localDynamicExtensionConfigurations.time_extension_type ===
                      "type1"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    style={{ width: "50%" }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={
                      localDynamicExtensionConfigurations.time_extension_type ===
                      "type1"
                    }
                    onClick={() =>
                      handleDynamicExtensionBidLocal("time_extension_type", "type1")
                    }
                  >
                    <span
                      className={`ant-radio ${
                        localDynamicExtensionConfigurations.time_extension_type ===
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
                          localDynamicExtensionConfigurations.time_extension_type ===
                          "type1"
                        }
                        onChange={() =>
                          handleDynamicExtensionBidLocal("time_extension_type", "type1")
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
                      localDynamicExtensionConfigurations.time_extension_type ===
                      "type2"
                        ? "pro-radio-tabs__tab__selected"
                        : ""
                    }`}
                    style={{ width: "50%" }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={
                      localDynamicExtensionConfigurations.time_extension_type ===
                      "type2"
                    }
                    onClick={() =>
                      handleDynamicExtensionBidLocal("time_extension_type", "type2")
                    }
                  >
                    <span
                      className={`ant-radio ${
                        localDynamicExtensionConfigurations.time_extension_type ===
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
                          localDynamicExtensionConfigurations.time_extension_type ===
                          "type2"
                        }
                        onChange={() =>
                          handleDynamicExtensionBidLocal("time_extension_type", "type2")
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
                        localDynamicExtensionConfigurations.triggered_time_extension_on_last
                      }
                      onChange={(e) =>
                        setLocalDynamicExtensionConfigurations({
                          ...localDynamicExtensionConfigurations,
                          triggered_time_extension_on_last: e.target.value,
                        })
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
                        localDynamicExtensionConfigurations.extend_event_time_by
                      }
                      onChange={(e) =>
                        setLocalDynamicExtensionConfigurations({
                          ...localDynamicExtensionConfigurations,
                          extend_event_time_by: e.target.value,
                        })
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
                        setLocalDynamicExtensionConfigurations({
                          ...localDynamicExtensionConfigurations,
                          time_extension_on_change_in: value,
                        });
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
                value={localDynamicExtensionConfigurations.minimum_revisions}
                onChange={(e) =>
                  setLocalDynamicExtensionConfigurations({
                    ...localDynamicExtensionConfigurations,
                    minimum_revisions: e.target.value,
                  })
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
                value={localDynamicExtensionConfigurations.delivery_date}
                onChange={(e) =>
                  setLocalDynamicExtensionConfigurations({
                    ...localDynamicExtensionConfigurations,
                    delivery_date: e.target.value,
                  })
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
