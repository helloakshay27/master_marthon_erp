import React from 'react';
import DynamicModalBox from '../../base/Modal/DynamicModalBox';

const DocumentModal = ({ show, onHide, handleAttachmentModalShow }) => {
  return (
    <DynamicModalBox
      centered={true}
      size="lg"
      show={show}
      onHide={onHide}
      className="modal-centered-custom"
      title="Document Attachment"
      footerButtons={[
        // @ts-ignore
        {
          label: "Close",
          onClick: onHide,
          props: {
            className: "purple-btn2",
          },
        },
      ]}
    >
      <div className="row mt-2">
        <div className="col-12 px-4">
          <div className="d-flex justify-content-between">
            <h5>Latest Documents</h5>
            <button
              className="purple-btn2 m-0"
              data-bs-toggle="modal"
              data-bs-target="#file_attachment"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleAttachmentModalShow}
            >
              <svg
                width={16}
                height={17}
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.1892 16.0745H0.794209C0.364012 16.0745 0 15.7435 0 15.3133V8.03309C0 7.61944 0.347466 7.27197 0.794209 7.27197C1.24095 7.27197 1.58842 7.60289 1.58842 8.03309V14.5688H14.4116V8.03309C14.4116 7.61944 14.759 7.27197 15.2058 7.27197C15.6525 7.27197 16 7.60289 16 8.03309V15.3133C15.9669 15.727 15.6194 16.0745 15.1892 16.0745Z"
                  fill="white"
                />
                <path
                  d="M11.6318 3.28438L8.57081 0.223371C8.27298 -0.0744571 7.7766 -0.0744571 7.46222 0.223371L4.36812 3.28438C4.2192 3.4333 4.13647 3.63185 4.13647 3.84695C4.13647 4.06205 4.2192 4.24405 4.36812 4.39297C4.51703 4.54188 4.71558 4.62461 4.91414 4.62461C5.12924 4.62461 5.32779 4.54188 5.4767 4.39297L7.1644 2.72182V10.5812C7.1644 11.0445 7.52841 11.4085 7.9917 11.4085C8.45498 11.4085 8.819 11.0445 8.819 10.5812V2.68873L10.5232 4.39297C10.8211 4.6908 11.3174 4.6908 11.6318 4.39297C11.7807 4.24405 11.8635 4.0455 11.8635 3.84695C11.8635 3.63185 11.7807 3.4333 11.6318 3.28438Z"
                  fill="white"
                />
              </svg>
              <span className="ms-2">Attachment File</span>
            </button>
          </div>
          <div className="tbl-container px-0 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Document Name</th>
                  <th>Attachment Name</th>
                  <th>Upload Date</th>
                  <th>Upload By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>MTC</td>
                  <td>Material test cert.pdf</td>
                  <td>01-11-202</td>
                  <td>Vendor User</td>
                  <td>
                    <button className="p-2 bg-white border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-12 px-4">
          <h5>Documents Attachment History</h5>
          <div className="tbl-container px-0 mt-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Document Name</th>
                  <th>Attachment Name</th>
                  <th>Upload Date</th>
                  <th>Upload By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>MTC</td>
                  <td>Material test cert.pdf</td>
                  <td>01-11-202</td>
                  <td>Vendor User</td>
                  <td>
                    <button className="p-2 bg-white border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default DocumentModal;
