import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CollapsibleCard from "../../base/Card/CollapsibleCards";

// Validation schema using Yup
const validationSchema = Yup.object({
  fromStatus: Yup.string().required("From Status is required"),
  toStatus: Yup.string().required("To Status is required"),
  remark: Yup.string().required("Remark is required").max(500, "Remark is too long"),
});

export default function BulkAction() {
  return (
    <CollapsibleCard title="Bulk Action">
      <Formik
        initialValues={{
          fromStatus: "",
          toStatus: "",
          remark: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form Submitted", values);
        }}
      >
        {({ handleChange, handleBlur, values, touched, errors }) => (
          <Form>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="form-group">
                  <label>From Status</label>
                  <Field as="select" name="fromStatus" className="form-control form-select">
                    <option value="">Select Status</option>
                    <option value="draft">Draft</option>
                    <option value="send_for_approval">Sent For Approval</option>
                  </Field>
                  <ErrorMessage
                    name="fromStatus"
                    component="div"
                    className="text-danger mt-2"
                  />
                </div>
                <div className="form-group mt-3">
                  <label>To Status</label>
                  <Field as="select" name="toStatus" className="form-control form-select">
                    <option value="">Select Status</option>
                    <option value="draft">Draft</option>
                    <option value="send_for_approval">Sent For Approval</option>
                  </Field>
                  <ErrorMessage
                    name="toStatus"
                    component="div"
                    className="text-danger mt-2"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Remark</label>
                  <Field
                    as="textarea"
                    name="remark"
                    className="form-control"
                    rows={4}
                    placeholder="Enter ..."
                  />
                  <ErrorMessage
                    name="remark"
                    component="div"
                    className="text-danger mt-2"
                  />
                </div>
              </div>
              <div className="offset-md-1 col-md-2">
                <button type="submit" className="purple-btn2 m-0">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </CollapsibleCard>
  );
}
