import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Table, ShortTable, SelectBox } from "../components";
import {
  mumbaiLocations,
  product,
  unitMeasure,
  freightData,
} from "../constant/data";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CreateBid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams(); // Get event ID from route parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventMaterials = async () => {
      console.log("Event ID:", eventId);
      try {
        // Fetch data directly without headers
        const response = await axios.get(
          `https://vendors.lockated.com/rfq/events/${eventId}/event_materials?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        );

        // Transform the API response into the required table data format
        const formattedData = response.data.map((item) => ({
          descriptionOfItem: item.inventory_name,
          quantity: item.quantity,
          quantityAvail: "",
          unit: item.uom,
          location: item.location,
          rate: "",
          amount: item.amount,
          totalAmt: "",
          attachment: null,
        }));

        setData(formattedData);
        console.log(formattedData);
      } catch (err) {
        console.error("Error fetching event materials:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventMaterials();
  }, [eventId]);

  const handleInputChange = (value, rowIndex, key) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = value;
    setData(updatedData);
  };

  const handleDescriptionOfItemChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].descriptionOfItem = selected;
    setData(updatedData);
  };

  const handleUnitChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].unit = selected;
    setData(updatedData);
  };

  const handleLocationChange = (selected, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].location = selected;
    setData(updatedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div
          className="w-100 p-4 mb-2"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 100px)",
          }}
        >
          <div className="head-material text-center">
            <h4>Create Bid</h4>
          </div>
          <div className="head-material">
            <h4>Create Bid for Event {eventId}</h4>
          </div>
          <Table
            columns={[
              { label: "Product", key: "descriptionOfItem" },
              { label: "Quantity", key: "quantity" },
              { label: "Quantity Available", key: "quantityAvail" },
              { label: "Best Total Amount", key: "bestAmount" },
              { label: "Price", key: "rate" },
              { label: "Total Amount", key: "amount" },
              { label: "Location", key: "location" },
              { label: "Creator Attachment", key: "attachment" },
            ]}
            data={data}
            customRender={{
              descriptionOfItem: (cell, rowIndex) => (
                <input
                  className="form-control"
                  type="text"
                  value={cell}
                  readOnly
                />
              ),

              quantity: (cell) => (
                <input
                  className="form-control"
                  type="text"
                  value={cell}
                  readOnly
                />
              ),
              unit: (cell, rowIndex) => (
                <SelectBox
                  isDisableFirstOption={true}
                  label={""}
                  options={unitMeasure}
                  defaultValue={cell}
                  onChange={(selected) => handleUnitChange(selected, rowIndex)}
                />
              ),
              location: (cell) => (
                <input
                  className="form-control"
                  type="text"
                  value={cell}
                  readOnly
                />
              ),
              quantityAvail: (cell, rowIndex) => (
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={cell}
                  onChange={(e) =>
                    handleInputChange(e.target.value, rowIndex, "quantityAvail")
                  }
                  placeholder="Enter Quantity Available"
                />
              ),
              rate: (cell, rowIndex) => (
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  value={cell}
                  onChange={(e) =>
                    handleInputChange(e.target.value, rowIndex, "rate")
                  }
                  placeholder="Enter Rate"
                />
              ),
              bestAmount: (_, rowIndex) => {
                const quantity = parseFloat(data[rowIndex].quantityAvail) || 0;
                const rate = parseFloat(data[rowIndex].rate) || 0;
                const totalAmount = quantity * rate;

                return (
                  <input
                    className="form-control"
                    type="text"
                    value={totalAmount.toFixed(2)}
                    readOnly
                  />
                );
              },
              attachment: (cell, rowIndex) => (
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const updatedData = [...data];
                      updatedData[rowIndex].attachment = file;
                      setData(updatedData);
                    }
                  }}
                />
              ),
              amount: (_, rowIndex) => {
                const quantity = parseFloat(data[rowIndex].quantityAvail) || 0;
                const rate = parseFloat(data[rowIndex].rate) || 0;
                const totalAmount = quantity * rate;

                return (
                  <input
                    className="form-control"
                    type="text"
                    value={totalAmount.toFixed(2)}
                    readOnly
                  />
                );
              },
            }}
          />
          <div className="d-flex justify-content-end">
            <ShortTable data={freightData} />
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="purple-btn2"
              onClick={() => navigate("/event-list")}
            >
              Create
            </button>
            <button
              className="purple-btn1"
              onClick={() => navigate("/event-list")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
