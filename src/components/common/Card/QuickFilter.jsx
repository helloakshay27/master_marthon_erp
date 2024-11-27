import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CollapsibleCard from "../../base/Card/CollapsibleCards";

// Validation schema using Yup
const validationSchema = Yup.object({
  company: Yup.string().required("Company is required"),
  project: Yup.string().required("Project is required"),
  subProject: Yup.string().required("Sub-Project is required"),
  lastCreated: Yup.string().required("Last Created is required"),
});

const QuickFilter = () => {
  return (
    <CollapsibleCard title="Quick Filter">
      <Formik
        initialValues={{
          company: "",
          project: "",
          subProject: "",
          lastCreated: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form Submitted", values);
        }}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="row my-2 align-items-end">
              {["company", "project", "subProject", "lastCreated"].map((name, index) => (
                <div className="col-md-2" key={index}>
                  <div className="form-group">
                    <label>{name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")}</label>
                    <Field as="select" name={name} className="form-control form-select" style={{ width: "100%" }}>
                      <option value="">Select {name}</option>
                      {["Alabama", "Alaska", "California", "Delaware"].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Field>
                    <ErrorMessage name={name} component="div" className="text-danger mt-2" />
                  </div>
                </div>
              ))}
              <div className="col-md-2">
                <button type="submit" className="purple-btn2 m-0">Go</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </CollapsibleCard>
  );
};

export default QuickFilter;
