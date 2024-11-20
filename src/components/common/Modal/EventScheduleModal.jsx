import React from 'react';
import DynamicModalBox from '../../base/Modal/DynamicModalBox';

const EventScheduleModal = ({ show, onHide }) => {
  return (
    <DynamicModalBox show={show} onHide={onHide} title="Event Schedule" footerButtons={[
        {
          label: "Save",
          onClick: onHide,
          props: {
            className: "purple-btn2",
          },
        }
      ]}>
        <div className="pb-4">
          <p>Start Time</p>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <select className="form-control form-select">
                  <option selected>Start Now</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-4">
              <input type="time" className="form-control" />
            </div>
          </div>
          <p className="mt-2">End Time</p>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <select className="form-control form-select">
                  <option selected>Duration</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <input type="time" className="form-control" />
            </div>
          </div>
          <p className="my-2" style={{ color: 'var(--light-grey)' }}>
            Event will end at 05 Apr 2024 at 11:24 am
          </p>
          <p className="mt-2">Evaluation time</p>
          <div className="row mt-2">
            <div className="col-md-4">
              <div className="form-group">
                <select className="form-control form-select">
                  <option selected>Duration</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <input type="time" className="form-control" />
            </div>
          </div>
        </div>
      </DynamicModalBox>
  );
};

export default EventScheduleModal;
