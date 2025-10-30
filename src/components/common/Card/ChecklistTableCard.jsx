import React, { useState, useEffect } from "react";
import SelectBox from "../../base/Select/SelectBox"

const ChecklistTableCard = ({ checklistData, onChecklistDataChange }) => {
  // Flatten the data for table display
  const flattenChecklistData = () => {
    if (!checklistData || !Array.isArray(checklistData)) return [];
    const flatData = [];
    checklistData.forEach((checklist, checklistIndex) => {
      checklist.sub_categories?.forEach((subCategory, subCategoryIndex) => {
        // Add subcategory row
        flatData.push({
          type: "subcategory",
          srNo: `${subCategoryIndex + 1}`,
          particulars: subCategory.name,
          subCategoryId: subCategory.id,
          checklistId: checklist.id,
        });
        // Add question rows for this subcategory
        subCategory.questions?.forEach((question, questionIndex) => {
          flatData.push({
            type: "question",
            srNo: `${subCategoryIndex + 1}.${questionIndex + 1}`,
            particulars: question.descr,
            questionId: question.id,
            subCategoryId: subCategory.id,
            checklistId: checklist.id,
            mandatory: question.quest_mandatory,
          });
        });
      });
    });
    return flatData;
  };

  const tableData = flattenChecklistData();

  // State for user responses, remarks, and files
  const [responses, setResponses] = useState({});
  const [remarks, setRemarks] = useState({});
  const [files, setFiles] = useState({});

  const handleResponseChange = (questionId, value) => {
    // Extract the actual value if SelectBox returns an object
    const actualValue = typeof value === 'object' && value?.value ? value.value : value;
    setResponses((prev) => ({ ...prev, [questionId]: actualValue }));
  };

  const handleRemarkChange = (questionId, value) => {
    setRemarks((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (questionId, file) => {
    console.log("File selected for question", questionId, ":", file);
    setFiles((prev) => ({ ...prev, [questionId]: file }));
    
    // Convert file to base64 if needed
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Content = e.target.result;
        console.log("Base64 conversion complete for question", questionId);
        console.log("File details:", {
          name: file.name,
          type: file.type,
          size: file.size,
          base64Length: base64Content.length
        });
        
        setFiles((prev) => ({ 
          ...prev, 
          [questionId]: {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            base64Content: base64Content
          }
        }));
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to prepare checklist data for payload
  const prepareChecklistPayload = () => {
    const checklistPayload = {};
    
    checklistData.forEach((checklist) => {
      const checklistId = checklist.id.toString();
      checklistPayload[checklistId] = {
        questions: []
      };
      
      checklist.sub_categories?.forEach((subCategory) => {
        subCategory.questions?.forEach((question) => {
          const questionId = question.id;
          const response = responses[questionId];
          const remark = remarks[questionId];
          const file = files[questionId];
          
          console.log(`Processing question ${questionId}:`, {
            response,
            remark,
            file: file ? {
              name: file.name,
              type: file.type,
              hasBase64: !!file.base64Content,
              base64Length: file.base64Content?.length
            } : null
          });
          
          // Only include questions that have been answered
          if (response || remark || file) {
            // Handle SelectBox response - it might be an object with {value, label} or just a string
            const responseValue = typeof response === 'object' && response?.value 
              ? response.value 
              : response;
              
            const questionData = {
              id: questionId,
              value: responseValue || "",
              comments: remark || "",
              option_id: question.qtype === "multiple" && question.options?.length > 0 
                ? (question.options.find(opt => opt.name === responseValue)?.id || null)
                : null,
              files: file && file.base64Content ? [{
                filename: file.name || "unknown",
                content_type: file.type || "application/octet-stream",
                content: file.base64Content
              }] : []
            };
            
            console.log(`Final question data for ${questionId}:`, questionData);
            checklistPayload[checklistId].questions.push(questionData);
          }
        });
      });
    });
    
    return checklistPayload;
  };

  // Update parent component when data changes
  useEffect(() => {
    if (onChecklistDataChange) {
      const payload = prepareChecklistPayload();
      onChecklistDataChange(payload);
    }
  }, [responses, remarks, files, onChecklistDataChange]);

  // Options for SelectBox
  const responseOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  if (!tableData.length) {
    return (
      <div className="text-center mt-4">
        <p>No checklist details available</p>
      </div>
    );
  }

  return (
        <div className="table-responsive m-3">
          <table
            className="tbl-container w-100 table-bordered mb-0"
          >
            <thead>
              <tr
              >
                <th style={{ width: "80px" }}>Sr No</th>
                <th>Particulars</th>
                <th>Response</th>
                <th>Required Documents</th>
                <th>Remark if any</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={`${row.type}-${index}`}>
                  <td className="text-center fw-bold">{row.srNo}</td>
                  <td>
                    {row.type === "subcategory" ? (
                      <strong style={{ color: "black" }}>
                        {row.particulars}
                      </strong>
                    ) : (
                      <div>
                        {row.particulars}
                        {row.mandatory && (
                          <span className="text-danger ms-2">*</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    {row.type === "question" ? (
                      <SelectBox
                        options={responseOptions}
                        value={responses[row.questionId] || ""}
                        onChange={(value) =>
                          handleResponseChange(row.questionId, value)
                        }
                        placeholder="Select..."
                      />
                    ) : null}
                  </td>
                  <td className="text-center">
                    {row.type === "question" ? (
                      <div>
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          onChange={(e) =>
                            handleFileChange(
                              row.questionId,
                              e.target.files[0] || null
                            )
                          }
                        />
                        <div className="text-muted small mt-1">
                          {files[row.questionId]?.name || "No file attached"}
                        </div>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {row.type === "question" && (
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Add remarks..."
                        value={remarks[row.questionId] || ""}
                        onChange={(e) =>
                          handleRemarkChange(row.questionId, e.target.value)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default ChecklistTableCard;
