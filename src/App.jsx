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
import BillEntryListSubPage from "./pages/bill-entry-create-page";
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
import UnassignedMor from "./pages/unassigned-mor";
import SubProject from "./pages/sub-project";
import CreateTemplate from "./pages/create-template";
import MaterialRejctionSlipCreate from "./pages/material-rejction-slip-create";
import MaterialRejctionSlip from "./pages/material-rejction-slip";
import MaterialReconciliationCreate from "./pages/material-reconciliation -create";
import MaterialReconciliationDetail from "./pages/material-reconciliation -detail";
import MaterialReconciliationList from "./pages/material-reconciliation -list";
import EditBOQNew from "./pages/Boq-edit-new";
import EventTemplateList from "./pages/event-template-list";
import EventTemplateDetails from "./pages/event-template-details";
import EditTemplate from "./pages/edit-template";
import WorkSubCategory from "./pages/work-sub-category";
import AddWorkSubCategory from "./pages/add-work-sub-category";
// import BOQAmend from "./pages/boq-amend";
import BoqAmend from "./pages/boq-amend";
import BoqAmendSub from "./pages/boq-amend-sub";
import CounterOffer from "./pages/counter-offer";
import BillVerificationEdit from "./pages/bill-verification-edit";
import BillEntryCreateVendorPage from "./pages/bill-entry-create-vendor";
import BillEntryVendorList from "./pages/bill-entry-vendor-list";
import TestTable from "./pages/testTable";
import RuleEngineList from "./pages/rule-engine-list";
import RuleEngineCreate from "./pages/rule-engine-create";
import RuleEngineDetails from "./pages/rule-engine-details";
import RuleEngineEdit from "./pages/rule-engine-edit";
import MiscellaneousBillCreate from "./pages/miscellaneous-bill-create";
import MiscellaneousBillList from "./pages/miscellaneous-bill-list";
import MiscellaneousBillDetails from "./pages/miscellaneous-bill-details";
import MiscellaneousBillEdit from "./pages/miscellaneous-bill-edit";
import SectionReKYCDetails from "./pages/pms/suppliers/rekyc";
import RateDetails from "./pages/details-rate";
import MaterialReconciliationEdit from "./pages/material-reconciliation-edit";
import GatePassCreate from "./pages/gate-pass-create";
import GatePassList from "./pages/gate-pass-list";
import GatePassDetails from "./pages/gate-pass-details";
import GatePassEdit from "./pages/gate-pass-edit";
import ConfirmationPage from "./pages/confirmation";
import ApprovalMatrixCreate from "./pages/vendor-approval-create";
import VendorApprovalList from "./pages/vendor-approval-list";
import VendorApprovalEdit from "./pages/vendor-approval-edit";
import EditRate from "./pages/edit-rate";
import RateRevision from "./pages/rate-revision";
import BillApproval from "./pages/bill-approval";
import BillApprovalList from "./pages/bill-approval-list";
import InitialBOQList from "./pages/initial-boq-list";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Members />} />
          <Route
            path="/stock_register_detail/:id"
            element={<ErpStockRegisterCreationDetail13C />}
          />
          <Route
            path="/stock_register_list"
            element={<ErpStockRegister13B />}
          />
          <Route path="/create-rate" element={<CreateRate />} />
          <Route path="/view-rate" element={<ViewRate />} />
          <Route path="/details-rate/:id" element={<RateDetails />} />
          <Route path="/edit-rate/:id" element={<EditRate />} />
          <Route path="/rate-revision/:id" element={<RateRevision />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/gate-pass-create" element={<GatePassCreate />} />
          <Route path="/gate-pass-list" element={<GatePassList />} />
          <Route path="/gate-pass-details/:id" element={<GatePassDetails />} />
          <Route path="/gate-pass-edit/:id" element={<GatePassEdit />} />
          <Route path="/bill-entry-list" element={<BillEntryList />} />
          <Route path="/rekyc/:id" element={<SectionReKYCDetails />} />
          <Route
            path="/bill-entry-vendor-list"
            element={<BillEntryVendorList />}
          />
          <Route
            path="/bill-entry-list-sub-page"
            element={<BillEntryListSubPage />}
          />
          <Route
            path="/bill-entry-details/:id"
            element={<BillEntryDetails />}
          />
          <Route
            path="/bill-verification-details/:id"
            element={<BillVerificationDetails />}
          />
          <Route path="/bill-approval-list" element={<BillApprovalList />} />
          <Route path="/bill-approval/:id" element={<BillApproval />} />
          <Route
            path="/bill-verification-list"
            element={<BillVerificationList />}
          />
          <Route path="/bill-booking-create" element={<BillBookingCreate />} />
          <Route
            path="/bill-booking-create/:id"
            element={<BillBookingCreate />}
          />
          <Route
            path="/bill-booking-details/:id"
            element={<BillBookingDetails />}
          />
          <Route path="/bill-entry-details" element={<BillEntryDetails />} />
          <Route path="/bill-booking-list" element={<BillBookingList />} />
          <Route
            path="/bill-payment-details"
            element={<BillPaymentDetails />}
          />
          <Route path="/credit-note-create" element={<CreditNoteCreate />} />
          <Route
            path="/credit-note-details/:id"
            element={<CreditNoteDetails />}
          />
          <Route path="/credit-note-list" element={<CreditNoteList />} />
          <Route path="/debit-note-create" element={<DebitNoteCreate />} />
          <Route
            path="/debit-note-details/:id"
            element={<DebitNoteDetails />}
          />
          <Route path="/debit-note-list" element={<DebitNoteList />} />
          <Route
            path="/po-advance-note-details/:id"
            element={<POAdvanceNoteDetails />}
          />
          <Route
            path="/po-advance-note-payment"
            element={<PoAdvanceNotePayment />}
          />
          <Route
            path="/po-advance-note-payment/:id"
            element={<PoAdvanceNotePayment />}
          />
          <Route
            path="/bill-entry-vendor-create"
            element={<BillEntryCreateVendorPage />}
          />
          <Route path="/po-advance-note-list" element={<PoAdvanceNoteList />} />
          {/* <Route path="/credit-note-create" element={<CreditNoteCreate />} /> */}
          <Route path="/approvals-list" element={<ApprovalsList />} />
          <Route path="/edit-approvals" element={<EditApprovals />} />
          <Route path="/add-approvals" element={<AddApprovals />} />
          <Route path="/create-BOQ" element={<CreateBOQ />} />
          <Route path="/boq-edit-new/:id" element={<EditBOQNew />} />
          <Route path="/boq-amend/:id" element={<BoqAmend />} />
          <Route path="/create-BOQ" element={<BoqAmendSub />} />
          {/* <Route path='/boq-list' element={<BOQList />} /> */}
          <Route path="/view-BOQ/:id" element={<BOQList />} />
          <Route path="/initial-boq-list" element={<InitialBOQList />} />
          <Route path="/boq-approval-list" element={<BOQApprovalList />} />
          {/* <Route path="/boq-edit/:id" element={<BOQEdit />} /> */}
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
          <Route path="/estimation-creation" element={<EstimationCreation />} />
          <Route
            path="/good_receive_notes/:id"
            element={<GoodReceiveNoteDetails />}
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
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/edit-template/:id" element={<EditTemplate />} />
          <Route path="/event-template-list" element={<EventTemplateList />} />
          <Route
            path="/event-template-details/:id"
            element={<EventTemplateDetails />}
          />
          {/* <Route path="/event-list" element={<ErpRfqA />} /> */}
          <Route path="/event-list" element={<EventListPage />} />
          <Route path="/contract-invitation" element={<ContractInvitation />} />
          <Route path="/section-tab" element={<SectionTab />} />
          {/* <Route path="/event-list" element={<EventList />} /> */}
          <Route path="/user-list/:eventId" element={<VendorDetails />} />
          <Route path="/eoi-details/:eventId" element={<EoiDeatailPage />} />
          <Route path="/vendor-list" element={<VendorListPage />} />
          <Route path="/user-overview/:eventId" element={<UserOverview />} />
          <Route path="/create-event" element={<CreateEvent />} />
          {/* <Route path='/create-bid' element={<CreateBid />} /> */}
          <Route path="/create-bid/:eventId" element={<CreateBid />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/counter-offer/:id" element={<CounterOffer />} />
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

            <Route path="/boq-edit/:id" element={<BOQEdit />} />
            <Route
              path="/boq-approval-details"
              element={<BOQApprovalDetails />}
            />

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

            <Route path="/bill-booking-list" element={<BillBookingList />} />

            <Route
              path="/bill-payment-create"
              element={<BillPaymentCreate />}
            />

            <Route path="/bill-payment-list" element={<BillPaymentList />} />
            <Route
              path="/bill-verification-create"
              element={<BillVerificationCreate />}
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
            {/* <Route path="/create-rate" element={<CreateRate />} /> */}
            {/* <Route path="/view-rate" element={<ViewRate />} /> */}
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
              path="/bill-booking-details/:id"
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
              path="/bill-verification-list"
              element={<BillVerificationList />}
            />
            <Route
              path="/bill-verification-edit"
              element={<BillVerificationEdit />}
            />

            <Route
              path="/credit-note-details"
              element={<CreditNoteDetails />}
            />
            <Route path="/credit-note-list" element={<CreditNoteList />} />
            <Route path="/debit-note-create" element={<DebitNoteCreate />} />
            <Route path="/debit-note-details" element={<DebitNoteDetails />} />
            <Route path="/debit-note-list" element={<DebitNoteList />} />
            {/* <Route
              path="/po-advance-note-details"
              element={<POAdvanceNoteDetails />}
            /> */}

            <Route
              path="/po-advance-note-list"
              element={<PoAdvanceNoteList />}
            />
          </Route>
          <Route path="/approval-materics" element={<ApprovalMatrics />} />
          <Route path="/invoice_approval" element={<InvoiceApproval />} />
          <Route path="/approval_edit/:id" element={<ApprovalEdit />} />
          <Route path="/unassigned-mor" element={<UnassignedMor />} />
          sub-mor
          <Route path="/sub-mor" element={<SubProject />} />
          sub-mor
          <Route
            // path="/material-rejction-slip-create/:id"
            path="/material-rejection-slip-create/:id"
            element={<MaterialRejctionSlipCreate />}
          />
          <Route
            path="/material-rejection-slip"
            element={<MaterialRejctionSlip />}
          />
          <Route
            path="/material-reconciliation-create"
            element={<MaterialReconciliationCreate />}
          />
          <Route
            path="/material-reconciliation-detail/:id"
            element={<MaterialReconciliationDetail />}
          />
          <Route
            path="/material-reconciliation-edit/:id"
            element={<MaterialReconciliationEdit />}
          />
          <Route
            path="/material-reconciliation-list"
            element={<MaterialReconciliationList />}
          />
          <Route path="/work-sub-category" element={<WorkSubCategory />} />
          <Route
            path="/add-work-sub-category"
            element={<AddWorkSubCategory />}
          />
          {/* ... */}
          <Route path="/test-table" element={<TestTable />} />
          <Route path="/rule-engine-list" element={<RuleEngineList />} />
          <Route path="/rule-engine-create" element={<RuleEngineCreate />} />
          <Route
            path="/rule-engine-details/:id"
            element={<RuleEngineDetails />}
          />
          <Route path="/rule-engine-edit/:id" element={<RuleEngineEdit />} />
          <Route
            path="/miscellaneous-bill-create"
            element={<MiscellaneousBillCreate />}
          />
          <Route
            path="/miscellaneous-bill-create/:id"
            element={<MiscellaneousBillCreate />}
          />
          <Route
            path="/miscellaneous-bill-list"
            element={<MiscellaneousBillList />}
          />
          <Route
            path="/miscellaneous-bill-details/:id"
            element={<MiscellaneousBillDetails />}
          />
          <Route
            path="/miscellaneous-bill-edit/:id"
            element={<MiscellaneousBillEdit />}
          />
          <Route
            path="/vendor-approval-create"
            element={<ApprovalMatrixCreate />}
          />
          <Route
            path="/vendor-approval-list"
            element={<VendorApprovalList />}
          />
          <Route
            path="/vendor-approval-edit/:id"
            element={<VendorApprovalEdit />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
