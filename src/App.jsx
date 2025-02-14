import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Members from "./pages/members";
import ErpStockRegister13B from "./pages/erp-stock-register13b";
import ErpStockRegisterCreationDetail13C from "./pages/erp-stock-register-creation-detail-13c";
import CreateRfq from "./pages/create-rfq";
import ErpRfqAuctionEvents4f from "./pages/erp-rfq-auction-events-4f";
import ErpRfqAuctionEvents4h from "./pages/erp-rfq-auction-events-4h";
import ErpRfqDetailPriceTrends4h from "./pages/erp-rfq-detail-price-trends4h";
import ApprovalsList from "./pages/approvals-list";
import EditApprovals from "./pages/edit-approvals";
import AddApprovals from "./pages/add-approvals";
import GoodReceiveNoteDetails from "./pages/grn/grn_detail";
import CreateBOQ from "./pages/create-BOQ";
import BOQList from "./pages/view-BOQ";
import BOQApprovalList from "./pages/boq_approval_list";
import BOQDetailsPageMaster from "./pages/boq-details-page-master";
import BOQApprovalDetails from "./pages/boq-approval-details";
import EstimationList from "./pages/estimation-list";
import EstimationDetailsWings from "./pages/estimation-details-wings";
import EstimationDetailsSubProject from "./pages/estimation-details-sub-project";
import EstimationComparision from "./pages/estimation-comparision";
import EstimationApprovalDetails from "./pages/estimation-approval-details";
import EstimationCreation from "./pages/estimation-creation";
import EstimationDetailsProject from "./pages/estimation-details-project";
import BillBookingDetails from "./pages/bill-booking-details";
import BillEntryDetails from "./pages/bill-entry-details";
import BillBookingList from "./pages/bill-booking-list";
import BillEntryList from "./pages/bill-entry-list";
import BillEntryListSubPage from "./pages/bill-entry-list-sub-page";
import BillBookingCreate from "./pages/bill-booking-create";
import PoAdvanceNotePayment from "./pages/po-advance-note-payment";
import PoAdvanceNoteList from "./pages/po-advance-note-list";
import RootLayout from "./pages/Layout/RootLayout";
import EstimationApprovolList from "./pages/estimation-approval-list";
import TreeDataWithStaticRows from "./components/dataGrid/TreeDataWithStaticRows";
// import BOQList from './pages/boq-list';
import CreateRate from "./pages/create-rate";
import ViewRate from "./pages/view-rate";
import BillPaymentCreate from "./pages/bill-payment-create";
import BillPaymentDetails from "./pages/bill-payment-details";
import BillPaymentList from "./pages/bill-payment-list";
import BillVerificationCreate from "./pages/bill-verification-create";
import BillVerificationDetails from "./pages/bill-verification-details";
import BillVerificationList from "./pages/bill-verification-list";
import CreditNoteCreate from "./pages/credit-note-create";
import CreditNoteDetails from "./pages/credit-note-details";
import CreditNoteList from "./pages/credit-note-list";
import DebitNoteCreate from "./pages/debit-note-create";
import DebitNoteDetails from "./pages/debit-note-details";
import DebitNoteList from "./pages/debit-note-list";
import POAdvanceNoteDetails from "./pages/po-advance-note-details";
import BOQEdit from "./pages/boq-edit";
import ContractInvitation from "./pages/contract-invitation";
import SectionTab from "./pages/section-tab";
import EventListPage from "./pages/admin_list";
import VendorDetails from "./pages/vendor-details";
import VendorListPage from "./pages/vendor-list";
import UserOverview from "./pages/user-overview";
import CreateEvent from "./pages/create-event";
import CreateBid from "./pages/create-bid";
import Dashboard from "./pages/dashboard";
import AuthData from "./confi/authData";
import EoiDeatailPage from "./pages/eoi-detail";
import EditEvent from "./pages/edit-event";
import ApprovalMatrics from "./pages/approvalMatrics";
import InvoiceApproval from "./pages/invoice-approval";
import ApprovalEdit from "./pages/approval-edit";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Members />} />
          <Route path="/approvals-list" element={<ApprovalsList />} />
          <Route path="/edit-approvals" element={<EditApprovals />} />
          <Route path="/add-approvals" element={<AddApprovals />} />
          <Route path="/create-BOQ" element={<CreateBOQ />} />
            {/* <Route path='/boq-list' element={<BOQList />} /> */}
            <Route path="/view-BOQ" element={<BOQList />} />
            <Route path="/boq-approval-list" element={<BOQApprovalList />} />
            <Route path="/boq-edit" element={<BOQEdit />} />
            {/* <Route
              path="/boq-details-page-master"
              element={<BOQDetailsPageMaster />}
            /> */}
             <Route
              path="/boq-details-page-master/:id"
              element={<BOQDetailsPageMaster />}
            />

            {/* estimation */}
             <Route path="/estimation-list" element={<EstimationList />} />
             <Route
              path="/estimation-details-project/:id"
              element={<EstimationDetailsProject />}
            />
             <Route
              path="/estimation-details-sub-project/:id"
              element={<EstimationDetailsSubProject />}
            />
              <Route
              path="/estimation-creation"
              element={<EstimationCreation />}
            />

          <Route
            path="/good_receive_notes/:id"
            element={<GoodReceiveNoteDetails />}
          />
          <Route
            path="/stock_register_detail/:id"
            element={<ErpStockRegisterCreationDetail13C />}
          />
          <Route
            path="/stock_register_list"
            element={<ErpStockRegister13B />}
          />
          <Route
            path="/TreeDataWithStaticRows"
            element={<TreeDataWithStaticRows />}
          />
          <Route path="/authData" element={<AuthData />} />
          {/* <Route path='/erp-stock-register-creation13c' element={<ErpStockRegisterCreation13C />} /> */}
          {/* <Route
            path="/erp-rfq-auction-events-4f"
            element={<ErpRfqAuctionEvents4f />}
          /> */}
          <Route
            path="/erp-rfq-auction-events-4h"
            element={<ErpRfqAuctionEvents4h />}
          />
          <Route
            path="/erp-rfq-detail-price-trends4h/:eventId"
            element={<ErpRfqDetailPriceTrends4h />}
          />
          <Route path="/create-rfq" element={<CreateRfq />} />
          {/* <Route path="/event-list" element={<ErpRfqA />} /> */}
          <Route path="/event-list" element={<EventListPage />} />
          <Route path="/contract-invitation" element={<ContractInvitation />} />
          <Route path="/section-tab" element={<SectionTab />} />
          {/* <Route path="/event-list" element={<EventList />} /> */}
          <Route path="/user-list/:eventId" element={<VendorDetails />} />
          <Route path="/eoi-details/:eventId" element={<EoiDeatailPage />} />n
          <Route path="/vendor-list" element={<VendorListPage />} />
          <Route path="/user-overview/:eventId" element={<UserOverview />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {/* <Route path='/create-bid' element={<CreateBid />} /> */}
          <Route path="/create-bid/:eventId" element={<CreateBid />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<RootLayout />}>
            {/* <Route path='/erp-stock-register-creation13c' element={<ErpStockRegisterCreation13C />} /> */}

            <Route
              path="/erp-rfq-auction-events-4f"
              element={<ErpRfqAuctionEvents4f />}
            />
            <Route
              path="/erp-rfq-auction-events-4h"
              element={<ErpRfqAuctionEvents4h />}
            />
            <Route
              path="/erp-rfq-detail-price-trends4h"
              element={<ErpRfqDetailPriceTrends4h />}
            />
            <Route path="/create-rfq" element={<CreateRfq />} />
            
            <Route path="/boq-edit" element={<BOQEdit />} />
            <Route
              path="/boq-approval-details"
              element={<BOQApprovalDetails />}
            />
            <Route path="/create-rate" element={<CreateRate />} />
            <Route path="/view-rate" element={<ViewRate />} />
           
            <Route
              path="/estimation-details-wings"
              element={<EstimationDetailsWings />}
            />
           
            <Route
              path="/estimation-comparision"
              element={<EstimationComparision />}
            />
            <Route
              path="/estimation-approval-details"
              element={<EstimationApprovalDetails />}
            />
          
            
            <Route
              path="/estimation-approvol-list"
              element={<EstimationApprovolList />}
            />
            <Route
              path="/bill-booking-details"
              element={<BillBookingDetails />}
            />
            <Route path="/bill-entry-details" element={<BillEntryDetails />} />
            <Route path="/bill-booking-list" element={<BillBookingList />} />
            <Route path="/bill-entry-list" element={<BillEntryList />} />
            <Route
              path="/bill-entry-list-sub-page"
              element={<BillEntryListSubPage />}
            />
            <Route
              path="/bill-booking-create"
              element={<BillBookingCreate />}
            />
            <Route
              path="/bill-payment-create"
              element={<BillPaymentCreate />}
            />
            <Route
              path="/bill-payment-details"
              element={<BillPaymentDetails />}
            />
            <Route path="/bill-payment-list" element={<BillPaymentList />} />
            <Route
              path="/bill-verification-create"
              element={<BillVerificationCreate />}
            />
            <Route
              path="/bill-verification-details"
              element={<BillVerificationDetails />}
            />
            <Route
              path="/bill-verification-list"
              element={<BillVerificationList />}
            />
            <Route path="/credit-note-create" element={<CreditNoteCreate />} />
            <Route
              path="/credit-note-details"
              element={<CreditNoteDetails />}
            />
            <Route path="/credit-note-list" element={<CreditNoteList />} />
            <Route path="/debit-note-create" element={<DebitNoteCreate />} />
            <Route path="/debit-note-details" element={<DebitNoteDetails />} />
            <Route path="/debit-note-list" element={<DebitNoteList />} />
            <Route
              path="/po-advance-note-details"
              element={<POAdvanceNoteDetails />}
            />
            <Route
              path="/po-advance-note-payment"
              element={<PoAdvanceNotePayment />}
            />
            <Route
              path="/po-advance-note-list"
              element={<PoAdvanceNoteList />}
            />
            <Route
              path="/stock_register_detail/:id"
              element={<ErpStockRegisterCreationDetail13C />}
            />
            <Route
              path="/stock_register_list"
              element={<ErpStockRegister13B />}
            />
            <Route
              path="/erp-rfq-auction-events-4f"
              element={<ErpRfqAuctionEvents4f />}
            />
            <Route
              path="/erp-rfq-auction-events-4h"
              element={<ErpRfqAuctionEvents4h />}
            />
            <Route
              path="/erp-rfq-detail-price-trends4h"
              element={<ErpRfqDetailPriceTrends4h />}
            />
            <Route path="/create-rfq" element={<CreateRfq />} />
            <Route path="/create-BOQ" element={<CreateBOQ />} />
            {/* <Route path='/boq-list' element={<BOQList />} /> */}
            <Route path="/view-BOQ" element={<BOQList />} />
            <Route path="/boq-approval-list" element={<BOQApprovalList />} />
            <Route
              path="/boq-details-page-master/:id"
              element={<BOQDetailsPageMaster />}
            />
           
            <Route
              path="/boq-approval-details"
              element={<BOQApprovalDetails />}
            />
            <Route path="/create-rate" element={<CreateRate />} />
            <Route path="/view-rate" element={<ViewRate />} />
            <Route path="/estimation-list" element={<EstimationList />} />
            <Route
              path="/estimation-details-wings"
              element={<EstimationDetailsWings />}
            />
            <Route
              path="/estimation-details-sub-project"
              element={<EstimationDetailsSubProject />}
            />
            <Route
              path="/estimation-comparision"
              element={<EstimationComparision />}
            />
            <Route
              path="/estimation-approval-details"
              element={<EstimationApprovalDetails />}
            />
            <Route
              path="/estimation-creation"
              element={<EstimationCreation />}
            />
            <Route
              path="/estimation-details-project"
              element={<EstimationDetailsProject />}
            />
            <Route
              path="/estimation-approvol-list"
              element={<EstimationApprovolList />}
            />
            <Route
              path="/bill-booking-details"
              element={<BillBookingDetails />}
            />
            <Route path="/bill-entry-details" element={<BillEntryDetails />} />
            <Route path="/bill-booking-list" element={<BillBookingList />} />
            <Route path="/bill-entry-list" element={<BillEntryList />} />
            <Route
              path="/bill-entry-list-sub-page"
              element={<BillEntryListSubPage />}
            />
            <Route
              path="/bill-booking-create"
              element={<BillBookingCreate />}
            />
            <Route
              path="/bill-payment-create"
              element={<BillPaymentCreate />}
            />
            <Route
              path="/bill-payment-details"
              element={<BillPaymentDetails />}
            />
            <Route path="/bill-payment-list" element={<BillPaymentList />} />
            <Route
              path="/bill-verification-create"
              element={<BillVerificationCreate />}
            />
            <Route
              path="/bill-verification-details"
              element={<BillVerificationDetails />}
            />
            <Route
              path="/bill-verification-list"
              element={<BillVerificationList />}
            />
            <Route path="/credit-note-create" element={<CreditNoteCreate />} />
            <Route
              path="/credit-note-details"
              element={<CreditNoteDetails />}
            />
            <Route path="/credit-note-list" element={<CreditNoteList />} />
            <Route path="/debit-note-create" element={<DebitNoteCreate />} />
            <Route path="/debit-note-details" element={<DebitNoteDetails />} />
            <Route path="/debit-note-list" element={<DebitNoteList />} />
            <Route
              path="/po-advance-note-details"
              element={<POAdvanceNoteDetails />}
            />
            <Route
              path="/po-advance-note-payment"
              element={<PoAdvanceNotePayment />}
            />
            <Route
              path="/po-advance-note-list"
              element={<PoAdvanceNoteList />}
            />
          </Route>
          <Route path="/approval-materics" element={<ApprovalMatrics />} />
          <Route path="/invoice_approval" element={<InvoiceApproval />} />
          <Route path="/approval_edit/:id" element={<ApprovalEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
