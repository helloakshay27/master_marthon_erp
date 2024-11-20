import React, { useState } from 'react';
import DynamicModalBox from '../../base/Modal/DynamicModalBox';

const AttachmentModal = ({ show, onHide }) => {
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState(null);

  const handleDocumentNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle file submission logic here
    console.log('Document Name:', documentName);
    console.log('File:', file);
    onHide();
  };

  return (
    <DynamicModalBox
      show={show}
      onHide={onHide}
      size="md"
      title="Upload File"
      footerButtons={[
        {
          label: "Submit",
          variant: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="row mt-2">
        <div className="col-md-12">
          <div className="form-group">
            <label>Name of the Document</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter document name"
              value={documentName}
              onChange={handleDocumentNameChange}
            />
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-12">
          <div className="form-group">
            <label>File Upload</label>
            <input
              className="form-control"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </DynamicModalBox>
  );
};

export default AttachmentModal;
