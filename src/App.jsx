import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Members from './pages/Members';
import ErpStockRegister13B from './pages/erp-stock-register13b';
import ErpStockRegisterCreation13C from './pages/erp-stock-register-creation13c';
import ErpStockRegisterCreationDetail13C from './pages/erp-stock-register-creation-detail-13c';
import CreateRfq from './pages/create-rfq';
import ErpRfqAuctionEvents4f from './pages/erp-rfq-auction-events-4f';
import ErpRfqAuctionEvents4h from './pages/erp-rfq-auction-events-4h';
import ErpRfqDetailPriceTrends4h from './pages/erp-rfq-detail-price-trends4h';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Members />} />
          <Route path='/erp-stock-register-creation13c' element={<ErpStockRegisterCreation13C />} />
          <Route path='/erp-stock-register-creation-detail-13c' element={<ErpStockRegisterCreationDetail13C />} />
          <Route path='/erp-stock-register13b' element={<ErpStockRegister13B />} />
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



