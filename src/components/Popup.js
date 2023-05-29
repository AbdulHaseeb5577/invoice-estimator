import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect } from 'react';

export const Popup = ({ show, closeModal, invoiceEstimator }) => {
  useEffect(() => {
    console.log("datapoppopopop", invoiceEstimator);
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice', 10, 10);
    doc.save('invoice.pdf');
  };
  return (
    
    <div className={`popup ${show ? 'show' : ''}`}>
        <button onClick={closeModal} className="CloseButton">x</button>
      <div className="popup-content">
        <h2>Your Invoice Estimator Pdf is Generated. Download Your Invoice Pdf.</h2>

        <table className='popUpTable'>
        <tr className='popUpTableHead'>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
            <tr className= "popUpTableData">
              <td></td>
              <td></td>
             <td></td>
            </tr>
        
        </table>
      <div className='GrandTotalsec'> 
        <h2>Grand Total:</h2>
        <p></p>
       <h2> Discount amount:</h2> 
       <p></p>
        <h2>Payable:</h2> 
        <p></p>
        <div className='PdfDownload'> 
        <button onClick={() => {
        downloadPDF();
        }}>Download as PDF</button>

        </div>
      </div>

      </div>

    </div>

  );
};


