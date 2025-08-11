import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchIndent = () => {
  const [formData, setFormData] = useState({
    project: '',
    subProject: '',
    wings: '',
    morNo: '',
    morStartDate: '',
    morEndDate: '',
    materialType: '',
    materialSubType: '',
    material: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching with:', formData);
  };

  const handleShowAll = () => {
    // Implement show all functionality
    console.log('Showing all records');
  };

  const handleReset = () => {
    setFormData({
      project: '',
      subProject: '',
      wings: '',
      morNo: '',
      morStartDate: '',
      morEndDate: '',
      materialType: '',
      materialSubType: '',
      material: ''
    });
  };

  return (
    <div>
      <main className="h-100 w-100">
        <div className="main-content">
          <div className="website-content container-fluid">
            <div className="module-data-section">
              <Link to="/ropo-mapping-create">
                Home &gt; Store &gt; Store Operations &gt; ROPO Mapping &gt; Search Indent
              </Link>
              <h5 className="mt-3">Search Indent</h5>
              
              <div className="card">
                <div className="card-body" style={{ height: 'auto', minHeight: '500px' }}>
                  <div className="p-3">
                    <div className="row">
                      <div className="col-md-6 mt-0">
                        <div className="form-group">
                          <label className="po-fontBold">Project</label>
                          <select
                            className="form-control form-select"
                            name="project"
                            value={formData.project}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Project</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mt-0">
                        <div className="form-group">
                          <label className="po-fontBold">Sub Project</label>
                          <select
                            className="form-control form-select"
                            name="subProject"
                            value={formData.subProject}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Sub Project</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label className="po-fontBold">Wings</label>
                          <select
                            className="form-control form-select"
                            name="wings"
                            value={formData.wings}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Wings</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mt-0">
                        <div className="form-group">
                          <label className="po-fontBold">MOR No.</label>
                          <input
                            className="form-control"
                            type="text"
                            name="morNo"
                            value={formData.morNo}
                            onChange={handleInputChange}
                            placeholder="Enter MOR Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label className="po-fontBold">MOR Start Date</label>
                          <input 
                            className="form-control" 
                            type="date"
                            name="morStartDate"
                            value={formData.morStartDate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label className="po-fontBold">MOR End Date</label>
                          <input 
                            className="form-control" 
                            type="date"
                            name="morEndDate"
                            value={formData.morEndDate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mt-2">
                      <h6 className="fw-bold my-3">OR Search By:</h6>
                      <div className="col-md-6 mt-0">
                        <div className="form-group">
                          <label className="po-fontBold">Material Type</label>
                          <select
                            className="form-control form-select"
                            name="materialType"
                            value={formData.materialType}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Material Type</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mt-0">
                        <div className="form-group">
                          <label className="po-fontBold">Material Sub Type</label>
                          <select
                            className="form-control form-select"
                            name="materialSubType"
                            value={formData.materialSubType}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Material Sub Type</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mt-2">
                        <div className="form-group">
                          <label className="po-fontBold">Material</label>
                          <select
                            className="form-control form-select"
                            name="material"
                            value={formData.material}
                            onChange={handleInputChange}
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Material</option>
                            <option value="alaska">Alaska</option>
                            <option value="california">California</option>
                            <option value="delaware">Delaware</option>
                            <option value="tennessee">Tennessee</option>
                            <option value="texas">Texas</option>
                            <option value="washington">Washington</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-1 justify-content-center d-flex">
                    <button className="purple-btn1 me-2" onClick={handleSearch}>
                      Search
                    </button>
                    <button className="purple-btn1 me-2" onClick={handleShowAll}>
                      Show All
                    </button>
                    <button className="purple-btn1 me-2" onClick={handleReset}>
                      Reset
                    </button>
                    <Link to="/ropo-mapping-create">
                      <button className="purple-btn1">
                        Close
                      </button>
                    </Link>
                  </div>
                  
                  <div className="tbl-container me-2 mt-3">
                    <table className="w-100">
                      <thead>
                        <tr>
                          <th rowSpan={2} />
                          <th rowSpan={2}>Project SubProject</th>
                          <th rowSpan={2}>MOR Date</th>
                          <th rowSpan={2}>
                            <input type="checkbox" />
                          </th>
                          <th colSpan={6}>Material Details</th>
                        </tr>
                        <tr>
                          <th>Material Type</th>
                          <th>Material Sub Type</th>
                          <th>Material</th>
                          <th>UOM</th>
                          <th>Pending Qty</th>
                          <th>Ordered Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="d-flex justify-content-center mt-3">
                    <button className="purple-btn2">Accept Selected</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchIndent;

