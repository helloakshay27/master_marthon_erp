import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Members from './pages/members';
import ErpStockRegister13B from './pages/erp-stock-register13b';
import ErpStockRegisterCreationDetail13C from './pages/erp-stock-register-creation-detail-13c';
import CreateRfq from './pages/create-rfq';
import ErpRfqAuctionEvents4f from './pages/erp-rfq-auction-events-4f';
import ErpRfqAuctionEvents4h from './pages/erp-rfq-auction-events-4h';
import ErpRfqDetailPriceTrends4h from './pages/erp-rfq-detail-price-trends4h';
import ApprovalsList from './pages/approvals-list';
import EditApprovals from './pages/edit-approvals';
import AddApprovals from './pages/add-approvals';
import GoodReceiveNoteDetails from './pages/grn/grn_detail';
import CreateBOQ from './pages/create-BOQ';
import ViewBOQ from './pages/view-BOQ';
import BOQApprovalList from './pages/boq_approval_list';
import BOQDetailsPageMaster from './pages/boq-details-page-master';
import BOQApprovalDetails from './pages/boq-approval-details'
import EstimationList from './pages/estimation-list';
import EstimationDetailsWings from './pages/estimation-details-wings';
import EstimationDetailsSubProject from './pages/estimation-details-sub-project';
import EstimationComparision from './pages/estimation-comparision';
import EstimationApprovalDetails from './pages/estimation-approval-details';
import EstimationCreation from './pages/estimation-creation';
import EstimationDetailsProject from './pages/estimation-details-project';
import BillBookingDetails from './pages/bill-booking-details';
import BillEntryDetails from './pages/bill-entry-details';
import BillBookingList from './pages/bill-booking-list';
import BillEntryList from './pages/bill-entry-list';
import BillEntryListSubPage from './pages/bill-entry-list-sub-page'
import BillBookingCreate from './pages/bill-booking-create';
import PoAdvanceNotePayment from './pages/po-advance-note-payment';
import PoAdvanceNoteList from './pages/po-advance-note-list';
import RootLayout from './pages/Layout/RootLayout';
import EstimationApprovolList from './pages/estimation-approval-list';
import TreeDataWithStaticRows from './components/dataGrid/TreeDataWithStaticRows';
import BOQList from './pages/boq-list';
import CreateRate from './pages/create-rate';
import ViewRate from './pages/view-rate';


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
          <Route path="/TreeDataWithStaticRows" element={<TreeDataWithStaticRows />} />

          <Route
            path="/"
            element={
                <RootLayout />
            }
          >
          {/* <Route path='/erp-stock-register-creation13c' element={<ErpStockRegisterCreation13C />} /> */}
          <Route path='/stock_register_detail/:id' element={<ErpStockRegisterCreationDetail13C />} />
          <Route path='/stock_register_list' element={<ErpStockRegister13B />} />
          <Route path='/erp-rfq-auction-events-4f' element={<ErpRfqAuctionEvents4f />} />
          <Route path='/erp-rfq-auction-events-4h' element={<ErpRfqAuctionEvents4h />} />
          <Route path='/erp-rfq-detail-price-trends4h' element={<ErpRfqDetailPriceTrends4h />} />
          <Route path='/create-rfq' element={<CreateRfq />} />
          <Route path='/create-BOQ' element={<CreateBOQ />} />
          <Route path='/boq-list' element={<BOQList />} />
          <Route path='/view-BOQ' element={<ViewBOQ />} />
          <Route path='/boq-approval-list' element={<BOQApprovalList />} />
          <Route path='/boq-details-page-master' element={<BOQDetailsPageMaster />} />
          <Route path='/boq-approval-details' element={<BOQApprovalDetails />} />
          <Route path='/create-rate'  element={<CreateRate/>} />
          <Route path='/view-rate'  element={<ViewRate/>} />
          <Route path='/estimation-list' element={<EstimationList/>} />
          <Route path='/estimation-details-wings' element={<EstimationDetailsWings/>} />
          <Route path='/estimation-details-sub-project' element={<EstimationDetailsSubProject/>} />
          <Route path='/estimation-comparision' element={<EstimationComparision/>} />
          <Route path='/estimation-approval-details' element={<EstimationApprovalDetails/>} />
          <Route path='/estimation-creation' element={<EstimationCreation/>} />
          <Route path='/estimation-details-project' element={<EstimationDetailsProject/>} />
          <Route path='/estimation-approvol-list'  element={<EstimationApprovolList/>} />
          <Route path='/bill-booking-details' element={<BillBookingDetails/>} />
          <Route path='/bill-entry-details' element={<BillEntryDetails/>} />
          <Route path='/bill-booking-list' element={<BillBookingList/>} />
          <Route path='/bill-entry-list' element={<BillEntryList/>} />
          <Route path='/bill-entry-list-sub-page' element={<BillEntryListSubPage/>} />
          <Route path='/bill-booking-create' element={<BillBookingCreate/>} />
          <Route path='/po-advance-note-payment' element={<PoAdvanceNotePayment/>} />
          <Route path='/po-advance-note-list'  element={<PoAdvanceNoteList/>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



