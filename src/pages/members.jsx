import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Members() {

  return (


    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="website-content overflow-auto">
          <div className="module-data-section container-fluid">
            <h1>ERP_Store</h1>
            <ul>
              <li>
                <Link to="good_receive_notes/43?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414">grn_detail</Link>
              </li>
              <li>
                <Link to="/TreeDataWithStaticRows">TreeDataWithStaticRows</Link>
              </li>
              <li>
                <Link to="/create-rfq">create_rfq</Link>
              </li>
              <li>
                <Link to="/erp-rfq-auction-events-4f">erp_rfq_auction_events_4f</Link>
              </li>
              <li>
                <Link to="/erp-rfq-auction-events-4h">erp_rfq_auction_events_4h</Link>
              </li>
              <li>
                <Link to="/erp-rfq-detail-price-trends4h">erp_rfq_detail_price_trends4h</Link>
              </li>
              <li>
                <Link to="/stock_register_detail/47">stock_register detail</Link>
              </li>
              {/* <li>
                <Link to="/erp-stock-register-creation13c">erp_stock_register_creation13c</Link>
              </li> */}
              <li>
                <Link to="/stock_register_list?token=4ad0c1cd2506a717ae19ed050c28d7f078b0210991571e47"> stock register list</Link>
              </li>
              <li>
                <Link to="/approvals-list">approvals_list</Link>
              </li>

            </ul>

            <h1>BOQ</h1>
            <ul>
              <li>
                <Link to="/create-BOQ">Create BOQ</Link>
              </li>
              <li>
                <Link to="/boq-list">BOQ-List</Link>
              </li>
              <li>
                <Link to="/view-BOQ">View BOQ</Link>
              </li>
              <li>
                <Link to="/boq-approval-list">BOQ Approval List</Link>
              </li>
              <li>
                <Link to="/boq-details-page-master">BOQ Details Page Master</Link>
              </li>
              <li>
                <Link to="/boq-approval-details">BOQ Approval Details</Link>
              </li>

              <li>
                <Link to="/create-rate">Create Rate</Link>
              </li>
              <li>
                <Link to="/view-rate">View Rate</Link>
              </li>

              <li>
                <Link to="/estimation-creation">Estimation creation</Link>
              </li>
              <li>
                <Link to="/estimation-list">Estimation List Page</Link>
              </li>
              <li>
                <Link to="/estimation-details-project">Estimation details project</Link>
              </li>
              <li>
                <Link to="/estimation-details-sub-project">Estimation details sub project</Link>
              </li>
              <li>
                <Link to="/estimation-details-wings">Estimation details wings</Link>
              </li>

              <li>
                <Link to="/estimation-comparision">Estimation comparision</Link>
              </li>
              <li>
                <Link to="/estimation-approvol-list">Estimation approval list</Link>
              </li>
              <li>
                <Link to="/estimation-approval-details">Estimation approval details</Link>
              </li>



            </ul>

            <h1>Billing & Accounts</h1>
            <ul>
              <li>
                <Link to="/bill-booking-details">Bill Booking Details </Link>
              </li>
              <li>
                <Link to="/bill-entry-details" >Bill Entry Details</Link>
              </li>
              <li>
                <Link to="/bill-booking-list" >Bill Booking List</Link>
              </li>
              <li>
                <Link to="/bill-entry-list" >Bill Entry List</Link>
              </li>

              <li>
                <Link to="/po-advance-note-payment" >Po Advance Note Payment</Link>
              </li>


              <li>
                <Link to="/po-advance-note-list" >Po Advance Note List</Link>
              </li>
              <li>
                <Link to="/bill-entry-list-sub-page" >Bill Entry List Sub Page</Link>
              </li>
              <li>
                <Link to="/bill-booking-create" >Bill Booking Create</Link>
              </li>
              <li>
                <Link to="" ></Link>
              </li>
            </ul>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Members;
