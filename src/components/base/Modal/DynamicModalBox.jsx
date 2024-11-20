import React from "react";
import { Modal, Button } from "react-bootstrap";

function DynamicModalBox({
  show,
  onHide,
  size = "md",
  title = "",
  children,
  centered = true,
  backdrop = true,
  keyboard = true,
  footerButtons = [],
}) {
  return (
    <Modal
      centered={centered}
      size={size}
      show={show}
      onHide={onHide}
      backdrop={backdrop}
      keyboard={keyboard}
      className="modal-centered-custom"
    >
      <Modal.Header>
        <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
          <h5 className="modal-title text-center w-100" id="modalTitle">
            {title}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={onHide}
          />
        </div>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footerButtons.length > 0 && (
        <Modal.Footer className="modal-footer justify-content-center">
          {footerButtons.map((btn, index) => (
            <button
              key={index}
              className="purple-btn2"
              onClick={btn.onClick}
              {...btn.props}
            >
              {btn.label}
            </button>
          ))}
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default DynamicModalBox;
