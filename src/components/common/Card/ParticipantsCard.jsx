import React from 'react'

export default function ParticipantsCard() {
  return (
    <div id="participation-summary">
              <div className="card card-body p-2">
                <div className="participate-sec">
                  <div
                    className="totals-activity d-flex align-items-center justify-content-between mx-3"
                    style={{ gap: "0" }}
                  >
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="total-participants">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="active-participants">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="total-bids">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="revised-bids">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="rejected-bids">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="counter-offers">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="accepted-counter-offers">3</p>
                    </div>
                    <div className="total-activity">
                      <p>Total Participants</p>
                      <p id="dynamic-time-extended">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}
