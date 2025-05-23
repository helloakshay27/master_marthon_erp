import React, { useState } from "react";
import axios from "axios";

const DownloadPdfButton = ({ apiUrl, buttonLabel = "Download File" }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Get the signed URL and filename from the API
      const response = await axios.get(apiUrl);
      const data = response.data;
      console.log("data:-", data);

      if (data.signed_url) {
        // Fetch the file as a blob from the signed URL
        const fileResponse = await axios.get(data.signed_url, {
          responseType: "blob",
        });

        // Try to get filename from Content-Disposition header, fallback to default
        let filename = "downloaded_file";
        const disposition = fileResponse.headers["content-disposition"];
        if (disposition) {
          // Handle both filename= and filename*= cases
          const match = disposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1].replace(/['"]/g, "").trim());
          }
        } else if (data.filename) {
          filename = data.filename;
        }

        // Create a blob URL and trigger download
        const blob = new Blob([fileResponse.data], { type: fileResponse.data.type || undefined });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Download link not found.");
      }
    } catch (err) {
      alert("Failed to download file.");
    }
    setLoading(false);
  };

  return (
    <button className="purple-btn2" onClick={handleDownload} disabled={loading}>
      {loading ? "Downloading..." : buttonLabel}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style={{ fill: "black", marginLeft: 8 }}
      >
        <g fill="currentColor">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
        </g>
      </svg>
    </button>
  );
};

export default DownloadPdfButton;