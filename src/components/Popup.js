import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const Popup = ({ show, closeModal, formValues, selectedRow, selectedDate}) => { 


  const downloadPDF = () => {


    const doc = new jsPDF();
    const x = 10;
    let y = 10;
    const lineHeight = 10;




      // Add logo
      const logo = new Image();
      logo.src = "public/Image/cyclewally.png";
      logo.onload = function() {
        const logoWidth = 50;
        const logoHeight = (logoWidth * this.height) / this.width;
        doc.addImage(this, 'png', x, y, logoWidth, logoHeight);
      };

      // Add the estimate text
      const pageWidth = doc.internal.pageSize.getWidth(); // get the width of the page
      const estimateText = "Estimate";
      const fontSize = 16;
      const estimateWidth = doc.getStringUnitWidth(estimateText) * fontSize / doc.internal.scaleFactor;
      doc.text(pageWidth - estimateWidth - x, y, estimateText); // float the text to the right




      doc.setFontSize(16);
      doc.setFontSize(12);
      doc.text(`Address: Lahore`, x, y + lineHeight);
      doc.text(`Phone: +92-309-8881496`, x, y + lineHeight * 2);
      doc.text(`Email: hello@cyclewalay.com`, x, y + lineHeight * 3);
      
      // Increase y-position to provide space for the Bill table
      y += lineHeight * 5;
      
      // Add the Bill table
      const tableCol = ["BILL TO"];
      const Bill = [  
        [formValues.firstName, formValues.lastName],
        [formValues.address],
        [formValues.customerNumber],
        [selectedDate ? selectedDate.toLocaleDateString() : 'none'],
      ];
      doc.autoTable({
        startY: y,
        head: [tableCol],
        body: Bill,
      });
      
      // Increase y-position to provide space for the estimate text
      y += lineHeight * 2;
      

      
      // Increase y-position to provide space for the table header
      y += lineHeight * 2;
      
      // Add the table header and rows
      const tableColumns = ["DESCRIPTION", "UNIT PRICE", "QTY", "AMOUNT"];
      const tableRows = selectedRow.map((value, key) => {
        return [    
          [value.name],
          [value.price_range.minimum_price.regular_price.value],
          [value.quantity],
          [value.quantity * value.price_range.minimum_price.regular_price.value],
        ];
      });
      doc.autoTable({
        startY: y,
        head: [tableColumns],
        body: tableRows
      });
      // add the grand total
      y += lineHeight * (tableRows.length + 1);
      doc.text(`Grand Total: ${total} ${selectedRow.length > 0 ? selectedRow[0].price_range.minimum_price.regular_price.currency : ''}`, 20, y);     
      // add the discount amount
      y += lineHeight * 1;
      doc.text(`Discount amount: ${formValues.discountAmount}`, 20, y);
      // add the payable amount
      y += lineHeight * 1;
      doc.text(`Payable: ${total - formValues.discountAmount} ${selectedRow.length > 0 ? selectedRow[0].price_range.minimum_price.regular_price.currency : ''}`, 20, y);
      // Save the document
     doc.save("form-data.pdf");
  }
  const total = selectedRow.reduce((acc, val) => {
    return acc + (val.quantity * val.price_range.minimum_price.regular_price.value);
  }, 0);


  return (
    
    <div className={`popup ${show ? 'show' : ''}`}>
        <button onClick={closeModal} className="CloseButton">x</button>
      <div className="popup-content">
        <h2>Your Invoice Estimator Pdf is Generated. Download Your Invoice Pdf.</h2>

        <table className='popUpTable'>
        <tr className='popUpTableHead'>
          <th>Name</th>
          <th style={{Float: "left"}}>Quantity</th>
          <th>Price</th>
        </tr>
        {selectedRow.map((val, key) => {
          return (
            <tr key={key} className= "popUpTableData">
              <td>{val.name}</td>
              <td>{val.quantity}</td>
             <td>{val.quantity * val.price_range.minimum_price.regular_price.value} {val.price_range.minimum_price.regular_price.currency}</td>
            </tr>
          )
        })}
        </table>
      <div className='GrandTotalsec'> 
        <h2>Grand Total:</h2>
        <p>{total} {selectedRow.length > 0 ? selectedRow[0].price_range.minimum_price.regular_price.currency : ''}</p>
       <h2> Discount amount:</h2> <p>{formValues.discountAmount}</p>
        <h2>Payable:</h2> <p>{total - formValues.discountAmount} {selectedRow.length > 0 ? selectedRow[0].price_range.minimum_price.regular_price.currency : ''}</p>
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


