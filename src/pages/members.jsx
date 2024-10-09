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
                <Link to="/erp-stock-register-creation13c">
                  erp_stock_register_creation_13C
                </Link>
              </li>
              <li>
                <Link to="/erp-stock-register-creation13c">
                  erp_stock_register_creation _detail_13C(D)
                </Link>
              </li>
              <li>
                <Link to="/erp-stock-register13b">erp_stock_register_13B</Link>
              </li>
              <li>
                <Link to="/create-rfq">create-rfq</Link>
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
            </ul>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Members;
