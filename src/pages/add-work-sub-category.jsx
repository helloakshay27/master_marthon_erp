import React from "react";

import CollapsibleCard from "../components/base/Card/CollapsibleCards";

import SingleSelector from "../components/base/Select/SingleSelector"; // Adjust path as needed
import axios from "axios";

// import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../confi/apiDomain";

const AddWorkSubCategory = () => {
  // main category and sub level2
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [workCategories, setWorkCategories] = useState([]); // To store work categories fetched from the API
  const [selectedCategory, setSelectedCategory] = useState(null); // To store the selected work category
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // To store the selected work subcategory
  const [subCategoryOptions, setSubCategoryOptions] = useState([]); // To store subcategories for the selected category
  const [subCategoryLevel3Options, setSubCategoryLevel3Options] = useState([]);
  const [subCategoryLevel4Options, setSubCategoryLevel4Options] = useState([]); // Sub-category level 4 options
  const [subCategoryLevel5Options, setSubCategoryLevel5Options] = useState([]); // Sub-category level 5 options
  const [selectedSubCategoryLevel3, setSelectedSubCategoryLevel3] =
    useState(null); // State for selected subcategory level 3
  const [selectedSubCategoryLevel4, setSelectedSubCategoryLevel4] =
    useState(null); // State for selected subcategory level 4
  const [selectedSubCategoryLevel5, setSelectedSubCategoryLevel5] =
    useState(null); // State for selected subcategory level 5

  // Fetching work categories on component mount
  useEffect(() => {
    axios
      .get(
        `${baseURL}work_categories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      ) // Replace with your API endpoint
      .then((response) => {
        setWorkCategories(response.data.work_categories); // Save the categories to state
      })
      .catch((error) => {
        console.error("Error fetching work categories:", error);
      });
  }, []);

  // Handler for selecting a work category
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setSelectedSubCategory(null); // Clear subcategory selection when the category changes
    setSubCategoryOptions([]); // Reset subcategories list
    setSubCategoryLevel3Options([]); // Clear sub-subcategory options
    setSubCategoryLevel4Options([]); // Clear level 4 options
    setSubCategoryLevel5Options([]); // Clear level 5 options
    setSelectedSubCategoryLevel3(null);
    setSelectedSubCategoryLevel4(null);
    setSelectedSubCategoryLevel5(null);

    // If there are subcategories for this category, update the subcategory options
    if (selectedOption && selectedOption.work_sub_categories.length > 0) {
      setSubCategoryOptions(
        selectedOption.work_sub_categories.map((subCategory) => ({
          value: subCategory.id,
          label: subCategory.name,
        }))
      );
    }
  };

  // Handler for selecting a work subcategory
  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);
    setSubCategoryLevel3Options([]); // Clear sub-subcategory options on subcategory change
    setSubCategoryLevel4Options([]); // Clear subcategory level 4 options
    setSubCategoryLevel5Options([]); // Clear subcategory level 5 options
    setSelectedSubCategoryLevel3(null);
    setSelectedSubCategoryLevel4(null);
    setSelectedSubCategoryLevel5(null);

    // Fetch sub-subcategories using the selected subcategory ID-- level3
    axios
      .get(
        `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
      )
      .then((response) => {
        const subSubCategories = response.data.work_sub_categories || [];
        setSubCategoryLevel3Options(
          subSubCategories.map((subSubCategory) => ({
            value: subSubCategory.id,
            label: subSubCategory.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching sub-subcategories:", error);
      });
  };

  // Handler for selecting a level 3 subcategory
  const handleLevel3Change = (selectedOption) => {
    setSelectedSubCategoryLevel3(selectedOption);
    setSubCategoryLevel4Options([]); // Clear subcategory level 4 options
    setSubCategoryLevel5Options([]); // Clear subcategory level 5 options

    // Fetch level 4 subcategories using the selected level 3 subcategory ID
    if (selectedOption && selectedOption.value) {
      axios
        .get(
          `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          const subSubCategories = response.data.work_sub_categories || [];
          setSubCategoryLevel4Options(
            subSubCategories.map((subSubCategory) => ({
              value: subSubCategory.id,
              label: subSubCategory.name,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching level 4 subcategories:", error);
        });
    }
  };

  // Handler for selecting a level 4 subcategory
  const handleLevel4Change = (selectedOption) => {
    setSelectedSubCategoryLevel4(selectedOption);
    setSubCategoryLevel5Options([]); // Clear level 5 options

    // Fetch level 5 subcategories using the selected level 4 subcategory ID
    if (selectedOption && selectedOption.value) {
      axios
        .get(
          `${baseURL}work_sub_categories/${selectedOption.value}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
        )
        .then((response) => {
          const subSubCategories = response.data.work_sub_categories || [];
          setSubCategoryLevel5Options(
            subSubCategories.map((subSubCategory) => ({
              value: subSubCategory.id,
              label: subSubCategory.name,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching level 5 subcategories:", error);
        });
    }
  };

  // umo api

  return (
    <div>
      <div className="card mt-5 pb-4">
        <CollapsibleCard title="Work Subcategory">
          <div className="card-body mt-0 pt-0">
            <div className="row">
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>
                    Main Category <span>*</span>
                  </label>
                  <SingleSelector
                    options={workCategories.map((category) => ({
                      value: category.id,
                      label: category.name,
                      work_sub_categories: category.work_sub_categories, // Include subcategories in the category option
                    }))}
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                    placeholder={`Select Main category`}
                  />
                  {errors.main && (
                    <div className="error-message">{errors.main}</div>
                  )}
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label> Sub-category Level 2</label>
                  <SingleSelector
                    options={subCategoryOptions}
                    onChange={handleSubCategoryChange}
                    value={selectedSubCategory}
                    placeholder={`Select Sub-category lvl 2`} // Dynamic placeholder
                  />
                  {errors.sub && (
                    <div className="error-message">{errors.sub}</div>
                  )}
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>Sub-category Level 3</label>
                  <SingleSelector
                    options={subCategoryLevel3Options}
                    onChange={handleLevel3Change}
                    value={selectedSubCategoryLevel3}
                    placeholder={`Select Sub-category lvl 3`} // Dynamic placeholder
                  />
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label> Sub-category Level 4</label>
                  <SingleSelector
                    options={subCategoryLevel4Options}
                    onChange={handleLevel4Change}
                    value={selectedSubCategoryLevel4}
                    placeholder={`Select Sub-category lvl 4`} // Dynamic placeholder
                  />
                </div>
              </div>
              {/* <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label> Sub-category Level 5</label>
                  <SingleSelector
                    options={subCategoryLevel5Options}
                    onChange={handleLevel5Change}
                    value={selectedSubCategoryLevel5}
                    placeholder={`Select Sub-category lvl 5`} // Dynamic placeholder
                  />
                </div>
              </div> */}

              {/* <div className="row"> */}
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>
                    Subcategory Name <span>*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder=""
                    fdprocessedid="qv9ju9"
                    onChange={(e) =>
                      handleInputChange("itemName", e.target.value)
                    }
                  />
                  {errors.itemName && (
                    <div className="error-message">{errors.itemName}</div>
                  )}
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    // rows={2}
                    placeholder="Enter ..."
                    defaultValue={""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Benchmark Lead Time*</label>
                  <input
                    className="form-control"
                    // rows={2}
                    placeholder="Enter ..."
                    defaultValue={""}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>SAC Code*</label>
                  <input
                    className="form-control"
                    // rows={2}
                    placeholder="Enter ..."
                    defaultValue={""}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>
        <div className="d-flex justify-content-center mt-3">
          <button className="purple-btn2">Create</button>
          <button className="purple-btn1">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkSubCategory;
