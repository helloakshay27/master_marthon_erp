import React,{useEffect,useState} from "react";
import ScatterChart from "../Chart/ScatterChart";
import axios from "axios";

export default function AnalyticsTab({ id }) {

  const [selectedFilter, setSelectedFilter] = useState('gross_total'); // Default filter value
  const [analyticsData, setAnalyticsData] = useState(null); // State to hold fetched analytics data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const [companies, setCompanies] = useState([]); // To store company names and IDs
  const [selectedMaterialId, setSelectedMaterialId] = useState(null); // To store selected company ID

  // Handle filter dropdown change
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Fetch analytics data whenever the `id` or `selectedFilter` changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state before fetching

      try {
        const response = await fetch(
          `https://vendors.lockated.com/rfq/events/${id}/event_analytics?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&filter_type=${selectedFilter}&event_material_id=${selectedMaterialId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalyticsData(data); // Set the fetched data for the chart
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Stop loading
      }
    };

    // if (selectedFilter && selectedMaterialId) {
      fetchAnalytics(); // Fetch data only if filter is selected
    // }
  }, [selectedFilter,selectedMaterialId]); // Depend on both `id` and `selectedFilter`
 
  
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); // Set loading state to true before fetching
      setError(null); // Reset the error state before fetching

      try {
        const response = await fetch(
          `https://vendors.lockated.com/rfq/events/${id}/event_materials_list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&filter_type=${selectedFilter}&event_material_id=${selectedMaterialId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCompanies(data.event_materials); // Store the fetched company data in state
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchCompanies(); // Fetch the companies data on component mount
  }, [selectedFilter,selectedMaterialId]); // Empty dependency array ensures this runs once on mount

  // Handle the dropdown change event
  const handleDropdownChange = (event) => {
    setSelectedMaterialId(event.target.value); // Set selected company ID
  };

  return (
    <div
      className="tab-pane fade analytics"
      id="analytics"
      role="tabpanel"
      aria-labelledby="analytics-tab"
      tabIndex={0}
    >
      {/* Details Section */}
      <div className="details d-flex align-items-center my-4">
        <label htmlFor="details" className="me-2 fw-bold" style={{ textWrap: 'nowrap' }}>
          Show the details according to:
        </label>
        <select
          id="details"
          className="form-select me-3"
          aria-label="Details filter"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
           <option value="gross_total">Gross Total</option>
          <option value="product_price">Product Price</option>
          <option value="product_total">Product Total</option>
        </select>
        <span className="me-2">for</span>
        <select id="product" className="form-select" aria-label="Product filter"
        onChange={handleDropdownChange}
        value={selectedMaterialId || ''} // Set the selected value to the current selected company ID
        >
          {/* <option value="woodenDoorFrame">Wooden Door Frame (...</option> */}
          <option value="">Select Material</option>
        {companies.map(([companyName, companyId]) => (
          <option key={companyId} value={companyId}>
            {companyName} {/* Display company name */}
          </option>
        ))}
        </select>
      </div>

      {/* Quotes and Timing Section */}
      <div className="d-flex justify-content-between mb-4">
        {/* Quote Section */}
        <div className="quote d-flex justify-content-between flex-grow-1">
          <div>
            <label className="d-block fw-semibold">Initial Quote</label>
            <p className="text-muted">₹10,800 / Nos</p>
          </div>
          <div>
            <label className="d-block fw-semibold">Final Best Price</label>
            <p className="text-muted">₹10,800 / Nos</p>
          </div>
          <div>
            <label className="d-block fw-semibold">Realized Savings</label>
            <p className="text-muted">₹0 - 0%</p>
          </div>
        </div>

        {/* Time Section */}
        <div className="time ms-4 flex-grow-1">
          <div>
            <label className="d-block fw-semibold">Start Time</label>
            <p className="text-muted">06:10 PM Apr 01, 24</p>
          </div>
          <div>
            <label className="d-block fw-semibold">End Time</label>
            <p className="text-muted">03:35 PM Apr 06, 24</p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div id="container" className="mt-4 card p-4 pt-5 h-100 rounded-3">
        {/* Render the ScatterChart only if analyticsData is available */}
        {analyticsData && analyticsData.graph_data.length > 0 ? (
          <ScatterChart graphData={analyticsData.graph_data} selectedFilter={selectedFilter} />
        ) : (
          <p>No data available for the selected filter.</p>
        )}
      </div>
    </div>
  );
}


