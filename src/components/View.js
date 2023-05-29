import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Modal } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { InMemoryCache, createHttpLink, useMutation } from '@apollo/client';
import { DELETE_ORDER } from './mutation/mutations';
import { PLACE_ORDER } from './mutation/mutations';
import { VIEW_POPUP_ESTIMATOR } from './mutation/mutations'
import { ApolloClient } from 'apollo-client';

const token = localStorage.getItem('token');
// console.log('view', token);
const graphqlEndpoint = 'http://localhost:3000/graphql';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
  headers: headers,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});



const graphqlQuery = `{
  invoiceestimator_view {
    customer_address
    customer_name
    estimate_id
    discount_amount
    id
    order_status
    total
  }
}`;

export const View = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);
  const [deleteInvoiceEstimator] = useMutation(DELETE_ORDER);
  const [orderPlace] = useMutation(PLACE_ORDER);
  const [popupData, setPopupData] = React.useState(null);

  console.log ("selectedOrderId",selectedOrderId)
  const handleDelete = async (id) => {
    window.location.reload();
    console.log('delete', id);

    try {
      const { data } = await deleteInvoiceEstimator({
        variables: {
          id,
        },
      });
      console.log("delete",data)
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async (id) => {
    console.log('placed', id);

    try {
      const { data } = await orderPlace({
        variables: {
          id,
        },
      });
      console.log("place",data)
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = () => {
    // Add code to download the PDF
  };

  const handleEdit = (id) => {
    window.location.href = `/Edit?id=${id}`;
  };

  const HandleView = async (id) => {
    setSelectedOrderId(id);
    setModalOpen(true);
  
    try {
      const { data } = await client.mutate({
        mutation: VIEW_POPUP_ESTIMATOR,
        variables: {
          estimateId: parseInt(id),
        },
        context: {
          headers: headers
        }
      });
  
      setPopupData(data); // Store the response data in the state variable
      console.log("check dataaaaaaa",data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    fetch(graphqlEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: graphqlQuery }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.invoiceestimator_view) {
          const rowsData = data.data.invoiceestimator_view.map((item) => ({
            id: item.id,
            name: item.customer_name,
            discount: item.discount_amount,
            address: item.customer_address,
            number: item.estimate_id,
            price: item.total,
            status: item.order_status,
          }));
          setRows(rowsData);
        }
      })
      .catch((error) => console.error(error));
  }, []);
  

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'discount', headerName: 'Discount', width: 120 },
      { field: 'address', headerName: 'Address', width: 250 },
      { field: 'number', headerName: 'Number', width: 100 },
      { field: 'price', headerName: 'Price', width: 140 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 312,
        renderCell: (params) => (
          <div className="ViewAction">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              onClick={() => handleDelete(params.id)}
            />
            <GridActionsCellItem
              icon={<button>edit</button>}
              onClick={() => handleEdit(params.id)}
              showInMenu
            />
            <GridActionsCellItem
              icon={<button>View</button>}
              onClick={() => HandleView(params.id)}
              showInMenu
            />
            <GridActionsCellItem
              icon={<button>PlaceOrder</button>}
              onClick={() => handlePlaceOrder(params.id)}
              showInMenu
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
      />
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="View-popup">
          <Button onClick={handleCloseModal} className="CloseButton View">
            Close
          </Button>
          <div>
            <div className="popup-content">
              <h2>
                Your Invoice Estimator Pdf is Generated. Download Your Invoice Pdf.
              </h2>
              <table className="popUpTable">
  <thead>
    <tr className="popUpTableHead">
      <th>Name</th>
      <th>Fitting Charges</th>
      <th>Quantity</th>
      <th>Product Price</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {popupData &&
      popupData.popupInvoiceEstimatorView &&
      popupData.popupInvoiceEstimatorView.edit_invoice_estimator &&
      popupData.popupInvoiceEstimatorView.edit_invoice_estimator.invoice_data &&
      popupData.popupInvoiceEstimatorView.edit_invoice_estimator.invoice_data.map(
        (item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.custom_option}</td>
            <td>{item.quantity}</td>
            <td>{item.price}</td>
            <td>{item.total_product_price}</td>
          </tr>
        )
      )}
  </tbody>
</table>
<div colSpan="5" className="GrandTotalsec">
        {popupData &&
          popupData.popupInvoiceEstimatorView &&
          popupData.popupInvoiceEstimatorView.edit_invoice_estimator && (
            <>
              <div>
                <h2>Grand Total:</h2>
                <p>
                  {popupData.popupInvoiceEstimatorView.edit_invoice_estimator.total_with_currency}
                </p>
              </div>
              <div>
                <h2>Discount amount:</h2>
                <p>
                  {popupData.popupInvoiceEstimatorView.edit_invoice_estimator.customer_discount_with_currency}
                </p>
              </div>
              <div>
                <h2>Payable:</h2>
                <p>
                  {popupData.popupInvoiceEstimatorView.edit_invoice_estimator.discount_value_with_currency}
                </p>
              </div>
              <div className="PdfDownload">
                <button onClick={() => downloadPDF()}>Download as PDF</button>
              </div>
            </>
          )}
      </div>




            </div>
          </div>
        </Box>
      </Modal>
    </Box>
  );
};

export default View;
