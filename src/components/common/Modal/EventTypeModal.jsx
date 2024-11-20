import React from "react";
import PropTypes from "prop-types";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";

const EventTypeModal = ({
  size,
  show,
  onHide,
  title,
  footerButtons,
  children,
  eventType,
  handleEventTypeChange,
  selectedStrategy,
  handleRadioChange,
  awardType,
  handleAwardTypeChange,
}) => (
  <DynamicModalBox
    size={size || "xl"}
    show={show}
    onHide={onHide}
    title={title}
    footerButtons={footerButtons}
  >
    <div className="ant-drawer-body">
      {/* Event Type Section */}
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
                {["Auction", "RFQ"].map((type) => (
                  <div
                    key={type}
                    className={`pro-radio-tabs__tab ${
                      eventType === type ? "pro-radio-tabs__tab__selected" : ""
                    }`}
                    role="radio"
                    aria-checked={eventType === type}
                  >
                    <div className="pro-radio-tabs__check-icon">
                      <label
                        className={`ant-radio-wrapper ${
                          eventType === type ? "ant-radio-wrapper-checked" : ""
                        }`}
                      >
                        <span
                          className={`ant-radio ${
                            eventType === type ? "ant-radio-checked" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            className="ant-radio-input"
                            value={type}
                            checked={eventType === type}
                            onChange={handleEventTypeChange}
                          />
                          <span className="ant-radio-inner"></span>
                        </span>
                      </label>
                    </div>
                    <p className="pro-text pro-body pro-text--normal">{type}</p>
                  </div>
                ))}
              </div>
            </span>
          </div>
        </div>
      </div>

      {/* Auction Strategies Section */}
      {eventType === "Auction" && (
        <div
          className="pro-radio-tabs pro-radio-tabs2 rfq-tab-hide"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}
        >
          {["Rank Based", "Price Based", "Traffic Light", "Knockout", "Dutch Auction"].map(
            (strategy) => (
              <div
                key={strategy}
                className={`pro-radio-tabs__tab ${
                  selectedStrategy === strategy
                    ? "pro-radio-tabs__tab__selected"
                    : ""
                }`}
                tabIndex={0}
                role="radio"
                aria-checked={selectedStrategy === strategy}
                onClick={() => handleRadioChange(strategy)}
              >
                <div className="pro-radio-tabs__check-icon">
                  <label className="ant-radio-wrapper">
                    <span
                      className={`ant-radio ${
                        selectedStrategy === strategy ? "ant-radio-checked" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        tabIndex={-1}
                        className="ant-radio-input"
                        checked={selectedStrategy === strategy}
                        onChange={() => handleRadioChange(strategy)}
                      />
                      <span className="ant-radio-inner" />
                    </span>
                  </label>
                </div>
                <div className="styles_strategy__xc2r+">
                  <div className="styles_strategyContent__c-1Di">
                    <p className="pro-text pro-body pro-text--medium">
                      {strategy}
                    </p>
                    <p className="pro-text pro-body pro-text--normal styles_strategySub__R7Aot">
                      {/* Add specific details dynamically if needed */}
                      Example description for {strategy}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Award Section */}
      <div className="ant-row ant-form-item">
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
                  {["SingleVendor", "MultiVendor"].map((award) => (
                    <div
                      key={award}
                      className={`pro-radio-tabs__tab ${
                        awardType === award
                          ? "pro-radio-tabs__tab__selected"
                          : ""
                      }`}
                      role="radio"
                      aria-checked={awardType === award}
                    >
                      <div className="pro-radio-tabs__check-icon">
                        <label
                          className={`ant-radio-wrapper ${
                            awardType === award
                              ? "ant-radio-wrapper-checked"
                              : ""
                          }`}
                        >
                          <span
                            className={`ant-radio ${
                              awardType === award
                                ? "ant-radio-checked"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              className="ant-radio-input"
                              value={award}
                              checked={awardType === award}
                              onChange={handleAwardTypeChange}
                            />
                            <span className="ant-radio-inner"></span>
                          </span>
                        </label>
                      </div>
                      <p className="pro-text pro-body pro-text--normal">{award}</p>
                    </div>
                  ))}
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>

    </div>
  </DynamicModalBox>
);

EventTypeModal.propTypes = {
  size: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  footerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      props: PropTypes.object,
    })
  ),
  children: PropTypes.node,
  eventType: PropTypes.string.isRequired,
  handleEventTypeChange: PropTypes.func.isRequired,
  selectedStrategy: PropTypes.string.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
  awardType: PropTypes.string.isRequired,
  handleAwardTypeChange: PropTypes.func.isRequired,
};

export default EventTypeModal;
