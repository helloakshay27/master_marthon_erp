import React from "react";
import DynamicModalBox from "../../base/Modal/DynamicModalBox";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const CopyBudgetModal = ({ show, handleClose }) => {
  return (
//     <div className={`modal fade ${show}`} id="copyModal" tabIndex="-1" aria-labelledby="copyModalLabel" aria-hidden={!show}>
//     <div className="modal-dialog">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title fs-5" id="exampleModalLabel">Copy Budget</h5>
//           <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
//         </div>
//         <div className="modal-body">
//           <div className="row mb-2">
//             <div className="col-md-6">
//               <div className="form-group">
//                 <label>From</label>
//                 <select className="form-control form-select" style={{ width: '100%' }}>
//                   <option selected>Alabama</option>
//                   <option>Alaska</option>
//                   <option>California</option>
//                   <option>Delaware</option>
//                   <option>Tennessee</option>
//                   <option>Texas</option>
//                   <option>Washington</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="form-group">
//                 <label>To</label>
//                 <select className="form-control form-select" style={{ width: '100%' }}>
//                   <option selected>Alabama</option>
//                   <option>Alaska</option>
//                   <option>California</option>
//                   <option>Delaware</option>
//                   <option>Tennessee</option>
//                   <option>Texas</option>
//                   <option>Washington</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="row mt-2 justify-content-center">
//             <div className="col-md-4">
//               <button className="purple-btn2 w-100" onClick={handleClose}>
//                 Copy
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//   </div>

<Modal
show={show}
onHide={handleClose}
dialogClassName="modal-right"
className="setting-modal"
backdrop={true}
>
<Modal.Header>
{/* <div className="modal-header"> */}
           <h5 className="modal-title fs-5" id="exampleModalLabel">Copy Budget</h5>
           <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
        {/* </div> */}
</Modal.Header>
<div className="modal-body">
          <div className="row mb-2">
            <div className="col-md-6">
              <div className="form-group">
                <label>From</label>
                <select className="form-control form-select" style={{ width: '100%' }}>
                  <option selected>Alabama</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>To</label>
                <select className="form-control form-select" style={{ width: '100%' }}>
                  <option selected>Alabama</option>
                  <option>Alaska</option>
                  <option>California</option>
                  <option>Delaware</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Washington</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mt-2 justify-content-center">
            <div className="col-md-4">
              <button className="purple-btn2 w-100" onClick={handleClose}>
                Copy
              </button>
            </div>
          </div>
        </div>
</Modal>




//     <DynamicModalBox
//     // centered={true}
//     top={true}
//     size="md"
//     show={show}
//     onHide={onClose}
//     className="modal-centered-custom"
//     title={<span style={{ textAlign: 'left', width: '100%' }}>Copy Budget</span>}

//   >

//     {/* <div className="modal-dialog"> */}
//       {/* <div className="modal-content"> */}
//         {/* <div className="modal-body"> */}
//           <div className="row mb-2"style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//         }}>
//             <div className="col-md-6">
//               <div className="form-group">
//                 <label>From</label>
//                 <select className="form-control form-select" style={{ width: '100%' }}>
//                   <option selected>Alabama</option>
//                   <option>Alaska</option>
//                   <option>California</option>
//                   <option>Delaware</option>
//                   <option>Tennessee</option>
//                   <option>Texas</option>
//                   <option>Washington</option>
//                 </select>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="form-group">
//                 <label>To</label>
//                 <select className="form-control form-select" style={{ width: '100%' }}>
//                   <option selected>Alabama</option>
//                   <option>Alaska</option>
//                   <option>California</option>
//                   <option>Delaware</option>
//                   <option>Tennessee</option>
//                   <option>Texas</option>
//                   <option>Washington</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="row mt-2 justify-content-center">
//             <div className="col-md-4">
//               <button className="purple-btn2 w-100" onClick={onClose}>
//                 Copy
//               </button>
//             </div>
//           </div>
//         {/* </div> */}
//       {/* </div> */}
//     {/* </div> */}
//   </DynamicModalBox>
  );
};

export default CopyBudgetModal;
