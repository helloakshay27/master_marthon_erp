import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import {
  CreateRFQForm,
  LayoutModal,
  VendorModal,
  EventScheduleModal,
  DocumentModal,
  AttachmentModal,
  EventTypeModal,
  RfqTabList,
  OrderDetails,
  AuditLogTable,
  Table,
} from "../components";
import { auditLogColumns, auditLogData } from "../constant/data";

export default function CreateRfq() {
  const [orderDetails, setOrderDetails] = useState(true);
  const [materialOne, setMaterialOne] = useState(true);
  const [materialTwo, setMaterialTwo] = useState(true);
  const [eventTypeModal, setEventTypeModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [eventSchedule, setEventSchedule] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [eventType, setEventType] = useState("auction");
  const [awardType, setAwardType] = useState("single");
  const [dynamicExtension, setDynamicExtension] = useState(true);
  const [settingShow, setSettingShow] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("Rank Based");

  const handleSettingClose = () => setSettingShow(false);
  const handleSettingModalShow = () => setSettingShow(true);

  const handleVendorClose = () => setVendorModal(false);
  const handleVendorModalShow = () => setVendorModal(true);

  const handleDocumentClose = () => setDocumentModal(false);
  const handleDocumentModalShow = () => setDocumentModal(true);

  const handleAttachmentClose = () => setAttachmentModal(false);
  const handleAttachmentModalShow = () => {
    handleDocumentClose();
    setAttachmentModal(true);
  };

  const handleEventScheduleClose = () => {
    setEventSchedule(false);
  };
  const handleEventScheduleModalShow = () => {
    setEventSchedule(true);
  };

  const handleRadioChange = (strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleEventTypeModalShow = () => {
    setEventTypeModal(true);
  };
  const handleEventTypeModalClose = () => {
    setEventTypeModal(false);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleAwardTypeChange = (e) => {
    setAwardType(e.target.value);
  };

  const handleDynamicExtensionChange = (e) => {
    setDynamicExtension(e.target.checked);
  };

  const orderDropdown = () => {
    setOrderDetails(!orderDetails);
  };
  const materialOneDropdown = () => {
    setMaterialOne(!materialOne);
  };
  const materialTwoDropdown = () => {
    setMaterialTwo(!materialTwo);
  };

  return (
    <>
      <div className="website-content overflow-auto">
        <div className="module-data-section p-4">
          <a href="">
            Home &gt; Purchase &gt; Procurement &gt; Create RFQ &amp; Auction
          </a>
          <h5 className="mt-4">Create RFQ &amp; Auction</h5>
          <div className="row my-4 align-items-center">
            <div className="head-material text-center">
              <h4>Create RFQ &amp; Auction</h4>
            </div>
            <RfqTabList />
            <div className="tab-content mor-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <div className="container-fluid">
                  <CreateRFQForm
                    handleEventTypeModalShow={handleEventTypeModalShow}
                    handleEventScheduleModalShow={handleEventScheduleModalShow}
                    handleSettingModalShow={handleSettingModalShow}
                  />
                  <OrderDetails
                    orderDropdown={orderDropdown}
                    orderDetails={orderDetails}
                    materialOneDropdown={materialOneDropdown}
                    materialOne={materialOne}
                    handleAttachmentModalShow={handleAttachmentModalShow}
                    handleDocumentModalShow={handleDocumentModalShow}
                    materialTwoDropdown={materialTwoDropdown}
                    materialTwo={materialTwo}
                    handleVendorModalShow={handleVendorModalShow}
                  />
                  <div className="row mt-5 me-3">
                    <h5>Audit Log</h5>
                    <div className="mx-0">
                      <Table columns={auditLogColumns} data={auditLogData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EventTypeModal
        show={eventTypeModal}
        onHide={handleEventTypeModalClose}
        title={"Configuration for Event"}
        eventType={eventType}
        handleEventTypeChange={handleEventTypeChange}
        eventTypeModal={eventTypeModal}
        handleEventTypeModalClose={handleEventTypeModalClose}
        selectedStrategy={selectedStrategy}
        handleRadioChange={handleRadioChange}
        awardType={awardType}
        handleAwardTypeChange={handleAwardTypeChange}
        dynamicExtension={dynamicExtension}
        handleDynamicExtensionChange={handleDynamicExtensionChange}
        size={"xl"}
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
            onClick: handleEventTypeModalClose,
            props: {
              className: "purple-btn2",
            },
          },
        ]}
      />
      <LayoutModal show={settingShow} onHide={handleSettingClose} />
      <VendorModal show={vendorModal} onHide={handleVendorClose} />
      <EventScheduleModal
        show={eventSchedule}
        onHide={handleEventScheduleClose}
      />
      <DocumentModal
        show={documentModal}
        onHide={handleDocumentClose}
        handleAttachmentModalShow={handleAttachmentModalShow}
      />
      <AttachmentModal show={attachmentModal} onHide={handleAttachmentClose} />
    </>
  );
}
