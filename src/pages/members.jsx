// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Footer from "../components/Footer";
// import { Link } from "react-router-dom";
// import React from "react";

// function Members() {

//   return (
//     <>
//       <Header />
//       <div className="main-content">
//         <Sidebar />
//         <div className="website-content overflow-auto">
//           <div className="module-data-section container-fluid">
//             <ul>
//               {/* <li>
//                 <Link to="good_receive_notes/:id">grn_detail</Link>
//               </li>
//               <li>
//                 <Link to="/TreeDataWithStaticRows">TreeDataWithStaticRows</Link>
//               </li>
//               <li>
//                 <Link to="/create-rfq">create_rfq</Link>
//               </li>
//               <li>
//                 <Link to="/erp-rfq-auction-events-4f">erp_rfq_auction_events_4f</Link>
//               </li>
//               <li>
//                 <Link to="/erp-rfq-auction-events-4h">erp_rfq_auction_events_4h</Link>
//               </li>
//               <li>
//                 <Link to="/erp-rfq-detail-price-trends4h">erp_rfq_detail_price_trends4h</Link>
//               </li>
//               <li>
//                 <Link to="/stock_register_detail/47">stock_register detail</Link>
//               </li> */}
//               {/* <li>
//                 <Link to="/erp-stock-register-creation13c">erp_stock_register_creation13c</Link>
//               </li> */}
//               {/* <li>
//                 <Link to="/stock_register_list?token=4ad0c1cd2506a717ae19ed050c28d7f078b0210991571e47"> stock register list</Link>
//               </li> */}
//               {/* <li>
//                 <Link to="/approvals-list">approvals_list</Link>
//               </li> */}

//             </ul>

//             <h3>BOQ Pages & Estimation Pages </h3>
//             <ul>
//               <li>
//                 <Link to="/create-BOQ">Create BOQ</Link>
//               </li>
//               {/* <li>
//                 <Link to="/boq-list">BOQ-List</Link>
//               </li> */}
//               <li>
//                 <Link to="/view-BOQ">BOQ List</Link>
//               </li>
//               <li>
//                 <Link to="/boq-approval-list">BOQ Approval List</Link>
//               </li>
//               <li>
//                 <Link to="/boq-details-page-master">BOQ Details Page Master</Link>
//               </li>
//               {/* <li>
//                 <Link to="/boq-approval-details">BOQ Approval Details</Link>
//               </li> */}

//               <li>
//                 <Link to="/boq-edit">BOQ Edit</Link>
//               </li>

//               <li>
//                 <Link to="/create-rate">Create Rate</Link>
//               </li>
//               <li>
//                 <Link to="/view-rate">View Rate</Link>
//               </li>

//               <li>
//                 <Link to="/estimation-creation">Estimation creation</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-list">Estimation List Page</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-details-project">Estimation details project</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-details-sub-project">Estimation details sub project</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-details-wings">Estimation details wings</Link>
//               </li>

//               <li>
//                 <Link to="/estimation-comparision">Estimation comparision</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-approvol-list">Estimation approval list</Link>
//               </li>
//               <li>
//                 <Link to="/estimation-approval-details">Estimation approval details</Link>
//               </li>

//             </ul>

//             <h1>RFQ Module</h1>
//             <ul>
//               <li>
//                 <Link to="/create-event">create_event</Link>
//               </li>
//               <li>
//                 <Link to="/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">event_list</Link>
//               </li>
//               <li>
//                 <Link to="/erp-rfq-detail-price-trends4h">
//                   event_details_price
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contract-invitation">
//                   contract_invitation
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/section-tab">
//                   section_tab
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">vendor_list</Link>
//               </li>

//               <li>
//                 <Link to="/work-list">work list</Link>
//               </li>

//               <li>
//                 <Link to="/material-list">Material List</Link>
//               </li>

//               <li>
//                 <Link to="/service-list">Service List</Link>
//               </li>

//               <li>
//                 <Link to="/Po">Po lists</Link>
//               </li>
//               <li>
//                 <Link to="/Wo">Wo list</Link>
//               </li>
//             </ul>
// {/*
//             <h1>Billing & Accounts</h1>
//             <ul>
//               <li>
//                 <Link to="/bill-booking-details">Bill Booking Details </Link>
//               </li>
//               <li>
//                 <Link to="/bill-entry-details" >Bill Entry Details</Link>
//               </li>
//               <li>
//                 <Link to="/bill-booking-list" >Bill Booking List</Link>
//               </li>
//               <li>
//                 <Link to="/bill-entry-list" >Bill Entry List</Link>
//               </li>
//               <li>
//                 <Link to="/bill-entry-list-sub-page" >Bill Entry List Sub Page</Link>
//               </li>
//               <li>
//                 <Link to="/bill-booking-create" >Bill Booking Create</Link>
//               </li>
//               <li>
//                 <Link to="/bill-payment-create" >Bill Payment Create</Link>
//               </li>
//               <li>
//                 <Link to="/bill-payment-details" >Bill Payment Details</Link>
//               </li>
//               <li>
//                 <Link to="/bill-payment-list" >Bill payment List</Link>
//               </li>
//               <li>
//                 <Link to="/bill-verification-create" >Bill Verification Create</Link>
//               </li>
//               <li>
//                 <Link to="/bill-verification-details" >Bill Verification details</Link>
//               </li>
//               <li>
//                 <Link to="bill-verification-list" >Bill Verification List</Link>
//               </li>
//               <li>
//                 <Link to="/credit-note-create" >Credit Note Create</Link>
//               </li>
//               <li>
//                 <Link to="/credit-note-details" >Credit Note Details</Link>
//               </li>
//               <li>
//                 <Link to="/credit-note-list" >Credit Note List</Link>
//               </li>
//               <li>
//                 <Link to="/debit-note-create" >Debit Note Create</Link>
//               </li>
//               <li>
//                 <Link to="/debit-note-details" >Debit Note Details</Link>
//               </li>
//               <li>
//                 <Link to="/debit-note-list" >Debit Note List</Link>
//               </li>
//               <li>
//                 <Link to="/po-advance-note-details" >PO Advance Note Details</Link>
//               </li>

//               <li>
//                 <Link to="/po-advance-note-payment" >Po Advance Note Payment</Link>
//               </li>

//               <li>
//                 <Link to="/po-advance-note-list" >Po Advance Note List</Link>
//               </li>

//               <li>
//                 <Link to="" ></Link>
//               </li>
//             </ul> */}
//           </div>
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Members;

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import React from "react";

function Members() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div
            className="module-data-section container-fluid"
            style={{ marginBottom: "200px" }}
          >
            <div className="m-3">
              <h1>Rule engine</h1>
              <ul>
                <li>
                  <Link to="/rule-engine-list">Rule engine list </Link>
                </li>
                <li>
                  <Link to="/rule-engine-create"> Rule engine create</Link>
                </li>
              </ul>
              <h1>Rate</h1>
              <ul>
                <li>
                  <Link to="/create-rate">Create Rate</Link>
                </li>
                <li>
                  <Link to="/view-rate">Rate List</Link>
                </li>
              </ul>
              <h1>Gate Pass</h1>
              <ul>
                <li>
                  <Link to="/gate-pass-create"> Gate Pass Create</Link>
                </li>
                <li>
                  <Link to="/gate-pass-list">Gate pass List</Link>
                </li>
              </ul>
              <h1>Vendor REkyc</h1>
              <ul>
                <li>
                  <Link to="/rekyc/:id">Section Re KYC Details</Link>
                </li>
                <li>
                  <Link to="/vendor-approval-create">Vendor approval create</Link>
                </li>
                <li>
                  <Link to="/vendor-approval-list">Vendor approval list</Link>
                </li>
                <li>
                  <Link to="/vendor-approval-create">Vendor approval edit</Link>
                </li>
              </ul>
              <h1>BOQ</h1>
              <ul>
                <li>
                  <Link to="/create-BOQ">Create BOQ</Link>
                </li>
                <li>
                  <Link to="/view-BOQ">View BOQ</Link>
                </li>

                {/* <li>
                  <Link to="/boq-Edit-New">BOQ Edit</Link>
                </li> */}
                <li>
                  <Link to="/boq-approval-list">BOQ Approval List</Link>
                </li>

                <li>
                  {/* <Link to="/boq-details-page-master">
                    BOQ Details Page Master
                  </Link> */}
                </li>
                <li>
                  {/* <Link to="/boq-approval-details">BOQ Approval Details</Link> */}
                </li>
                <li>
                  <Link to="/approval-materics?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Approval Matrics
                  </Link>
                </li>

                <li>
                  <Link to="/unassigned-mor">Unassigned Mor</Link>
                </li>
                <li>
                  <Link to="/sub-mor">sub project Mor</Link>
                </li>
                <li>
                  <Link to="/material-rejction-slip-create">
                    Material Rejection Create
                  </Link>
                </li>
                <li>
                  <Link to="/material-rejection-slip">
                    Material Rejection Slip
                  </Link>
                </li>
                <li>
                  <Link to="/material-reconciliation-create">
                    Material reconciliation Create
                  </Link>
                </li>
                <li>
                  <Link to="/material-reconciliation-detail">
                    Material reconciliation detail
                  </Link>
                </li>
                <li>
                  <Link to="/material-reconciliation-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Material reconciliation list
                  </Link>
                </li>
                <li>
                  <Link to="/work-sub-category">Work Sub Category</Link>
                </li>
                <li>
                  <Link to="/add-work-sub-category">
                    {" "}
                    Add Work Sub Category
                  </Link>
                </li>
              </ul>
            </div>
            <div className="m-3">
              <h1>Billing & Accounts</h1>
              <ul>
                {/* <li>
                  <Link to="/bill-booking-details">Bill Booking Details </Link>
                </li> */}
                <h5>___Bill Entry___</h5>
                <li>
                  <Link to="/bill-entry-details/:id">Bill Entry Details</Link>
                </li>
                {/* <li>
                  <Link to="/bill-booking-list">Bill Booking List</Link>
                </li> */}
                <li>
                  <Link to="/bill-entry-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Bill Entry List
                  </Link>
                </li>
                <li>
                  <Link to="/bill-entry-vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Bill Entry Vendor List
                  </Link>
                </li>
                <li>
                  <Link to="/bill-entry-list-sub-page">
                    Bill Entry create Page
                  </Link>
                </li>
                <li>
                  <Link to="/bill-entry-vendor-create">
                    Bill Entry Vendor create Page
                  </Link>
                </li>
                {/* <li>
                  <Link to="/bill-booking-create">Bill Booking Create</Link>
                </li> */}
                <h5>___Bill Verification___</h5>
                {/* <li>
                  <Link to="/bill-verification-create">
                    Bill Verification Create
                  </Link>
                </li> */}
                <li>
                  <Link to="bill-verification-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Bill Verification List
                  </Link>
                </li>
                <li>
                  <Link to="/bill-verification-details">
                    Bill Verification details
                  </Link>
                </li>
                <li>
                  <Link to={`/bill-approval/78?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`}>
                    Bill Approval
                  </Link>
                </li>


                {/* <li>
                  <Link to="/bill-verification-edit">
                    Bill Verification Edit
                  </Link>
                </li> */}
                <h5>___Bill Payment___</h5>
                <li>
                  <Link to="/bill-payment-create">Bill Payment Create</Link>
                </li>
                <li>
                  <Link to="/bill-payment-details">Bill Payment Details</Link>
                </li>
                <li>
                  <Link to="/bill-payment-list">Bill payment List</Link>
                </li>

                <h5>____Bill Booking____</h5>
                <li>
                  <Link to="/bill-booking-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Bill Booking List
                  </Link>
                </li>

                <li>
                  <Link to="/bill-booking-create/:id">Bill Booking Create</Link>
                </li>

                <h5>___Credit Note___</h5>
                {/* <li>
                  <Link to="/credit-note-create">Credit Note Create</Link>
                </li> */}
                <li>
                  {/* <Link to="/credit-note-details">Credit Note Details</Link> */}
                </li>
                <li>
                  <Link to="/credit-note-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Credit Note List
                  </Link>
                </li>
                {/* <li>
                  <Link to="/test-table">Test Table</Link>
                </li> */}
                <h5>___Debit Note___</h5>
                {/* <li>
                  <Link to="/debit-note-create">Debit Note Create</Link>
                </li> */}
                {/* <li>
                  <Link to="/debit-note-details">Debit Note Details</Link>
                </li> */}
                <li>
                  <Link to="/debit-note-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Debit Note List
                  </Link>
                </li>
                <h5>___Miscellaneous Bill___</h5>
                <li>
                  <Link to="/miscellaneous-bill-create">
                    Miscellaneous Bill Create
                  </Link>
                </li>
                <li>
                  <Link to="/miscellaneous-bill-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    Miscellaneous Bill List
                  </Link>
                </li>
                <h5>___PO Advance___</h5>
                <li>
                  <Link to="/po-advance-note-details/:id">
                    PO Advance Note Details
                  </Link>
                </li>

                <li>
                  <Link to="/po-advance-note-payment/:id">
                    Po Advance Note Payment
                  </Link>
                </li>

                <li>
                  <Link to="/po-advance-note-list">Po Advance Note List</Link>
                </li>

                <li>
                  <Link to=""></Link>
                </li>
              </ul>
            </div>
            <div className="m-3">
              <h3> Estimation Pages </h3>
              <ul>
                {/* <li>
                  <Link to="/create-BOQ">Create BOQ</Link>
                </li> */}
                {/* <li>
                 <Link to="/boq-list">BOQ-List</Link>
               </li> */}
                {/* <li>
                  <Link to="/view-BOQ">BOQ List</Link>
                </li> */}
                {/* <li>
                  <Link to="/boq-approval-list">BOQ Approval List</Link>
                </li> */}
                {/* <li>
                  <Link to="/boq-details-page-master">
                    BOQ Details Page Master
                  </Link>
                </li> */}
                {/* <li>
                 <Link to="/boq-approval-details">BOQ Approval Details</Link>
               </li> */}

                {/* <li>
                  <Link to="/boq-edit">BOQ Edit</Link>
                </li> */}

                <li>
                  <Link to="/estimation-creation">Estimation creation</Link>
                </li>
                <li>
                  <Link to="/estimation-list">Estimation List Page</Link>
                </li>
                <li>
                  <Link to="/estimation-details-project">
                    Estimation details project
                  </Link>
                </li>
                <li>
                  <Link to="/estimation-details-sub-project">
                    Estimation details sub project
                  </Link>
                </li>
                <li>
                  <Link to="/estimation-details-wings">
                    Estimation details wings
                  </Link>
                </li>

                <li>
                  <Link to="/estimation-comparision">
                    Estimation comparision
                  </Link>
                </li>
                <li>
                  <Link to="/estimation-approvol-list">
                    Estimation approval list
                  </Link>
                </li>
                <li>
                  <Link to="/estimation-approval-details">
                    Estimation approval details
                  </Link>
                </li>
              </ul>
            </div>
            <div className="m-3">
              <h1>RFQ Module</h1>
              <ul>
                <li>
                  <Link to="/create-event?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    create_event
                  </Link>
                </li>
                <li>
                  <Link to="/event-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    event_list
                  </Link>
                </li>
                <li>
                  <Link to="/edit-event?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    edit_event
                  </Link>
                </li>

                <li>
                  <Link to="/create-template?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    create_template
                  </Link>
                </li>
                <li>
                  <Link to="/edit-template?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    edit_template
                  </Link>
                </li>
                <li>
                  <Link to="/event-template-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    event_template_list
                  </Link>
                </li>
                <li>
                  <Link to="/erp-rfq-detail-price-trends4h?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    event_details_price
                  </Link>
                </li>
                <li>
                  <Link to="/contract-invitation?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    contract_invitation
                  </Link>
                </li>
                <li>
                  <Link to="/section-tab">section_tab</Link>
                </li>
                <li>
                  <Link to="/vendor-list?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    vendor_list
                  </Link>
                </li>

                <li>
                  <Link to="/work-list">work list</Link>
                </li>

                <li>
                  <Link to="/material-list">Material List</Link>
                </li>

                <li>
                  <Link to="/service-list">Service List</Link>
                </li>

                <li>
                  <Link to="/Po">Po lists</Link>
                </li>
                <li>
                  <Link to="/Wo">Wo list</Link>
                </li>
                <li>
                  <Link to="/user-lists?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    user_list
                  </Link>
                </li>

                <li>
                  <Link to="/user-overview?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">
                    user_overview
                  </Link>
                </li>

                <li>
                  <Link to="good_receive_notes/:id">grn_detaisl</Link>
                </li>

                <li>
                  <Link to="/stock_register_detail/47">
                    stock_register detail
                  </Link>
                </li>
                <li>
                  <Link to="/erp-stock-register-creation13c">
                    erp_stock_register_creation13c
                  </Link>
                </li>
                <li>
                  <Link to="/stock_register_list?token=4ad0c1cd2506a717ae19ed050c28d7f078b0210991571e47">
                    {" "}
                    stock register list
                  </Link>
                </li>
                <li>
                  <Link to="/approvals-list">approvals_list</Link>
                </li>
                <li>
                  <Link to="/rekyc/:id">Section Re KYC Details</Link>
                </li>
              </ul>
            </div>

            <div className="m-3">
              <h1>RFQ OLD</h1>
              <ul>
                <li>
                  <Link to="/create-rfq">create_rfq</Link>
                </li>
                <li>
                  <Link to="/erp-rfq-auction-events-4f">
                    erp_rfq_auction_events_4f
                  </Link>
                </li>
                <li>
                  <Link to="/erp-rfq-auction-events-4h">
                    erp_rfq_auction_events_4h
                  </Link>
                </li>
                <li>
                  <Link to="/erp-rfq-detail-price-trends4h">
                    erp_rfq_detail_price_trends4h
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Members;
