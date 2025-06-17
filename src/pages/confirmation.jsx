import React from "react";
import "../styles/mor.css"; // Import the external CSS file (or use inline styles)

const ConfirmationPage = () => {
  return (
    <div className="card shadow-sm p-5">
      <div className="card-header text-white mb-3"></div>
      <div className="card-body">
        <div className="alert alert-info" role="alert">
          Thank you for submitting your details. We have successfully received
          your information, and it is now under review by our team. The review
          process ensures all the submitted details meet our requirements and
          comply with our standards. Once the review is complete, you will
          receive further communication regarding the status of your application
          or any additional steps required. We appreciate your patience and look
          forward to working with you.
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
