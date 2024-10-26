import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Members from './pages/members';
import ErpStockRegister13B from './pages/erp-stock-register13b';
import ErpStockRegisterCreation13C from './pages/erp-stock-register-creation13c';
import ErpStockRegisterCreationDetail13C from './pages/erp-stock-register-creation-detail-13c';
import CreateRfq from './pages/create-rfq';
import ErpRfqAuctionEvents4f from './pages/erp-rfq-auction-events-4f';
import ErpRfqAuctionEvents4h from './pages/erp-rfq-auction-events-4h';
import ErpRfqDetailPriceTrends4h from './pages/erp-rfq-detail-price-trends4h';
import ApprovalsList from './pages/approvals-list';
import EditApprovals from './pages/edit-approvals';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AddApprovals from './pages/add-approvals';
import GoodReceiveNoteDetails from './pages/grn/grn_detail';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Members />} />
          <Route path='/approvals-list' element={<ApprovalsList />} />
          <Route path='/edit-approvals' element={<EditApprovals />} />
          <Route path='/add-approvals' element={<AddApprovals />} />
          <Route path="/good_receive_notes/:id" element={<GoodReceiveNoteDetails />} />

          {/* <Route path='/erp-stock-register-creation13c' element={<ErpStockRegisterCreation13C />} /> */}
          <Route path='/stock_register_detail/:id' element={<ErpStockRegisterCreationDetail13C />} />
          <Route path='/stock_register_list' element={<ErpStockRegister13B />} />
          <Route path='/erp-rfq-auction-events-4f' element={<ErpRfqAuctionEvents4f />} />
          <Route path='/erp-rfq-auction-events-4h' element={<ErpRfqAuctionEvents4h />} />
          <Route path='/erp-rfq-detail-price-trends4h' element={<ErpRfqDetailPriceTrends4h />} />
          <Route path='/create-rfq' element={<CreateRfq />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



