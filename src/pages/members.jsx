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
                <Link to="good_receive_notes/:id">grn_detail</Link>
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Members;
