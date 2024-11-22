import React from "react";
import CheckedCircleIcon from "../Icon/CheckedCircleIcon";
import DropArrowIcon from "../Icon/DropArrowIcon";
import EnvelopeIcon from "../Icon/EnvelopeIcon";
import FullClipIcon from "../Icon/FullClipIcon";
import FullScreenIcon from "../Icon/FullScreenIcon";
import MenuCommentIcon from "../Icon/MenuCommentIcon";
import MenuIcon from "../Icon/MenuIcon";
import ShowIcon from "../Icon/ShowIcon";
import TrophyIcon from "../Icon/TrophyIcon";
import ZoomInIcon from "../Icon/ZoomInIcon";
import ZoomOutIcon from "../Icon/ZoomOutIcon";

export default function ResponseTab({toggleAccordion,isOpen,toggleOthersAccordion,isOthersOpen}) {
  return (
    <div
      className="tab-pane fade show active"
      id="responses"
      role="tabpanel"
      aria-labelledby="responses-tab"
      tabIndex={0}
    >
      <div className="viewBy-main">
        <div className="viewBy-main-child1">
          <div className="viewBy-header d-flex align-items-center ">
            <select name="language" className=" viewBy-headerForm" 
// @ts-ignore
            required>
              <option value="" disabled selected hidden>
                View by Product
              </option>
              <option value="indian">xxxxxxxx</option>
              <option value="nepali">xxxxxxxx</option>
              <option value="others">Others</option>
            </select>
            <select name="language" className="viewBy-headerForm" 
// @ts-ignore
            required="">
              <option value="">
                Actions
              </option>
              <option value="indian">xxxxxxxx</option>
              <option value="nepali">xxxxxxxx</option>
              <option value="others">Others</option>
            </select>
            <div className="d-flex align-items-center">
              <div className="">
                <p className="viewBy-headerFormP">
                  <span className="me-1">
                    <ShowIcon />
                  </span>
                  Show / Hide
                </p>
              </div>
              <div className="me-2">
                <p className="viewBy-headerFormP">
                  <span className="me-1">
                    <FullScreenIcon />
                  </span>
                  Fullscreen
                </p>
              </div>
              <div>
                <FullClipIcon />
              </div>
            </div>
            <div className="viewBy-zoom">
              <div className="viewBy-zoomIN">
                <ZoomInIcon />
              </div>
              <div className="viewBy-zoomOUT">
                <ZoomOutIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="viewBy-main-child2">
          <p className="viewBy-main-child2P">
            <span></span>
            Participation :
          </p>
          <div className="d-flex align-items-center">
            <div
              className="viewBy-main-child2-child1 d-flex align-items-center justify-content-center gap-2"
              id="viewBy-main-child2-child1"
            >
              4
            </div>
            <div
              className="viewBy-main-child2-child2 d-flex align-items-center justify-content-center gap-2"
              id="viewBy-main-child2-child2"
            >
              <EnvelopeIcon />4
            </div>
            <div
              className="viewBy-main-child2-child3 d-flex align-items-center justify-content-center gap-2"
              id="viewBy-main-child2-child3"
            >
              <ShowIcon />4
            </div>
            <div
              className="viewBy-main-child2-child4 d-flex align-items-center justify-content-center gap-2"
              id="viewBy-main-child2-child4"
            >
              <CheckedCircleIcon />4
            </div>
          </div>
        </div>
      </div>
      <div className="viewBy-mainTable">
        <table>
          <tbody>
            <tr>
              <td className="viewBy-tHead" />
              <td className="viewBy-tHead p-1 pb-2">
                <div className="viewBy-tHead-heading">
                  <div className="viewBy-tHead-heading-child">
                    <span className="viewBy-tHead-heading-child-span">
                      <TrophyIcon />1
                    </span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <p
                        className="viewBy-tHead-heading-p1"
                        title="Manly ELECTRIC Product"
                      >
                        Vendor 1
                      </p>
                      <p className="viewBy-tHead-heading-p2">
                        11:40 am, 24 Jan 2024
                      </p>
                    </div>
                    <button className=" btn d-flex align-items-center">
                      <MenuIcon />
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <button className="viewBy-tHead-btn">Counter Offer</button>
                </div>
              </td>
              <td className="viewBy-tHead p-1 pb-2">
                <div className="viewBy-tHead-heading">
                  <div className="viewBy-tHead-heading-child">
                    <span className="viewBy-tHead-heading-child-span">
                      <TrophyIcon />1
                    </span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <p
                        className="viewBy-tHead-heading-p1"
                        title="Manly ELECTRIC Product"
                      >
                        Vendor 2
                      </p>
                      <p className="viewBy-tHead-heading-p2">
                        11:40 am, 24 Jan 2024
                      </p>
                    </div>
                    <button className=" btn d-flex align-items-center">
                      <MenuIcon />
                    </button>
                  </div>
                </div>
                <div
                  className=" d-flex align-items-center justify-content-center"
                  style={{ flexDirection: "column" }}
                >
                  <div className="viewBy-bid-main">
                    <button className="btn viewBy-bid-main-left">
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <p className="m-0 viewBy-bid-main-p">Current Bid 4</p>
                    <button className=" btn viewBy-bid-main-right">
                      <i
                        className="bi bi-chevron-right"
                        style={{ width: "100px", height: "100px" }}
                      ></i>
                    </button>
                    <MenuCommentIcon />
                  </div>
                  <button className=" viewBy-tHead-btn viewBy-tHead-btn2">
                    Counter Offer
                  </button>
                </div>
              </td>
              <td className="viewBy-tHead p-1 pb-2">
                <div className="viewBy-tHead-heading">
                  <div className="viewBy-tHead-heading-child">
                    <span className="viewBy-tHead-heading-child-span">
                      <TrophyIcon />1
                    </span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <p
                        className="viewBy-tHead-heading-p1"
                        title="Manly ELECTRIC Product"
                      >
                        Vendor3
                      </p>
                      <p className="viewBy-tHead-heading-p2">
                        11:40 am, 24 Jan 2024
                      </p>
                    </div>
                    <button className=" btn d-flex align-items-center">
                      <MenuIcon />
                    </button>
                  </div>
                </div>
                <div
                  className=" d-flex align-items-center justify-content-center"
                  style={{ flexDirection: "column" }}
                >
                  <div className="viewBy-bid-main">
                    <button className="btn viewBy-bid-main-left">
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <p className="m-0 viewBy-bid-main-p">Current Bid 4</p>
                    <button className=" btn viewBy-bid-main-right">
                      <i className="bi bi-chevron-right"></i>
                    </button>

                    <MenuCommentIcon />
                  </div>
                  <button className=" viewBy-tHead-btn viewBy-tHead-btn2">
                    Counter Offer
                  </button>
                </div>
              </td>
              <td className="viewBy-tHead">
                <div className="viewBy-tHead-heading"></div>
              </td>
            </tr>
            <tr>
              <td className="viewBy-tBody1-p">Gross Total</td>
              <td className="viewBy-tBody1-1">
                <span className="viewBy-tBody1-R">₹</span>
                15883962.3
              </td>
              <td className="viewBy-tBody1-2">
                <span className="viewBy-tBody1-R">₹</span>
                7681656.04
              </td>
              <td className="viewBy-tBody1-3">
                <span className="viewBy-tBody1-R">₹</span>
                14058103.00
              </td>
              <td className="viewBy-tBody1-3">
                <span className="viewBy-tBody1-R" />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="accordion" id="accordionExample1">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button viewBy-collapT1"
                type="button"
                onClick={toggleAccordion}
                aria-expanded={isOpen}
                aria-controls="collapseOne"
              >
                <span className="pe-3">
                  <DropArrowIcon isOpen={isOpen} />
                </span>
                <span style={{ color: isOpen ? "#e95420" : "" }}>
                  Wooden Frd Door{" "}
                </span>
                <span style={{ color: isOpen ? "#e95420" : "" }}>
                  (WOODEN DOOR SHUTTER 2 HRS FIRE RATED (MAIN DOOR))
                </span>
                <span style={{ color: isOpen ? "#e95420" : "" }}>
                  1 257 Nos Requested at Sanvo Resorts Pvt. Ltd.
                </span>
                <span className="ms-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="56"
                    height="56"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="thin"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  >
                    <polyline points="6 9 8 11 10 9"></polyline>
                  </svg>
                </span>
              </button>
            </h2>
            <div
              id="collapseOne"
              className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample1"
            >
              <div className="accordion-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="viewBy-tBody2-p" style={{ width: "16%" }}>
                        Best Total Amount
                      </td>
                      <td className="viewBy-tBody1-1" style={{ width: "20%" }}>
                        1<span className="viewBy-tBody1-R">Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1" style={{ width: "20%" }}>
                        1<span className="viewBy-tBody1-R">Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1" style={{ width: "20%" }}>
                        1<span className="viewBy-tBody1-R">Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                    <tr>
                      <td className="viewBy-tBody2-p">Quantity Available</td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R">₹</span>
                        6850692.71
                        <span className="viewBy-tBody1-R">/Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1-active">
                        <span className="viewBy-tBody1-R">₹</span>
                        65,09,878
                        <span className="viewBy-tBody1-R">/Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R">₹</span>
                        1,40,58,103
                        <span className="viewBy-tBody1-R">/Lumpsum</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R" />
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                    <tr>
                      <td className="viewBy-tBody2-p">Price</td>
                      <td className="viewBy-tBody1-1">
                        18
                        <span className="viewBy-tBody1-R">%</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        18
                        <span className="viewBy-tBody1-R">%</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R">-</span>
                      </td>
                      <td className="viewBy-tBody1-1">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                    <tr>
                      <td className="viewBy-tBody2-p">Realised Discount</td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        68,50,692.71
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        76,81,656.04
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        1,40,58,103
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                    <tr>
                      <td className="viewBy-tBody2-p">GST</td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        68,50,692.71
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        76,81,656.04
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        1,40,58,103
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                    <tr>
                      <td className="viewBy-tBody2-p">Realised GST</td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        68,50,692.71
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        76,81,656.04
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R">₹</span>
                        1,40,58,103
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="default-val">
                  <div className="col-md-2">
                    <p className="d-flex gap-1 align-items-center">
                      Default: <span className="viewBy-tBody1-R">₹</span>
                      68{" "}
                      <select name="" className="">
                        {" "}
                      </select>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion" id="accordionExample2">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button viewBy-collapT1"
                type="button"
                onClick={toggleOthersAccordion}
                aria-expanded={isOthersOpen}
                aria-controls="collapseOne"
              >
                <span className="pe-3">
                  <DropArrowIcon isOpen={isOthersOpen} />
                </span>{" "}
                <span
                  style={{
                    color: isOthersOpen ? "#e95420" : "",
                  }}
                >
                  Other Charges
                </span>
                <span className="ms-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="56"
                    height="56"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="thin"
                    style={{
                      transform: isOthersOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  >
                    <polyline points="6 9 8 11 10 9"></polyline>
                  </svg>
                </span>
              </button>
            </h2>
            <div
              id="collapseTwo"
              aria-labelledby="headingTwo"
              className={`accordion-collapse collapse ${
                isOthersOpen ? "show" : ""
              }`}
              data-bs-parent="#accordionExample2"
            >
              <div className="accordion-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="viewBy-tBody2-p" style={{ width: "17%" }}>
                        Sum Total
                      </td>
                      <td className="viewBy-tBody1-3" style={{ width: "20%" }}>
                        <span className="viewBy-tBody1-R">₹</span>
                        68,50,692.71
                      </td>
                      <td className="viewBy-tBody1-3" style={{ width: "20%" }}>
                        <span className="viewBy-tBody1-R">₹</span>
                        76,81,656.04
                      </td>
                      <td className="viewBy-tBody1-3" style={{ width: "20%" }}>
                        <span className="viewBy-tBody1-R">₹</span>
                        1,40,58,103
                      </td>
                      <td className="viewBy-tBody1-3">
                        <span className="viewBy-tBody1-R" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
