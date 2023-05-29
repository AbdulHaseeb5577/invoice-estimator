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
          <thead>
            <tr className='popUpTableHead'>
              <th>Name</th>
              <th>Fitting Charges</th>
              <th>Quantity</th>
              <th>Product Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceEstimator?.invoice_data?.map((item, index) => (
              <tr className="popUpTableData" key={index}>
                <td>{item.name}</td>
                <td>{item.custom_option}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total_product_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='GrandTotalsec'>
          <h2>Grand Total:</h2>
          <p>{invoiceEstimator?.total_with_currency}</p>
          <h2>Discount amount:</h2>
          <p>{invoiceEstimator?.customer_discount_with_currency}</p>
          <h2>Payable:</h2>
          <p>{invoiceEstimator?.discount_value_with_currency}</p>
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
