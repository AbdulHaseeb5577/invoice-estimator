import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GridActionsCellItem, GridRowParams, } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@apollo/client';
import { DELETE_ORDER } from './mutation/mutations';
import { PLACE_ORDER } from './mutation/mutations';
const token = localStorage.getItem('token');
console.log("view",token);
const graphqlEndpoint = "http://localhost:3000/graphql";

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};
const graphqlQuery = `{ invoiceestimator_view 
    { 
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

    const [deleteInvoiceEstimator]=useMutation(DELETE_ORDER);
    const HandleDelete = async (id,e) => {
        window.location.reload();
        console.log("delete", id);
        // return id;
    
        try{
            const{data}=await deleteInvoiceEstimator({
                variables:{
                    id
                }
            }

            );
        }catch(error){
            console.log(error);
        }
      };
      const [orderPlace]=useMutation(PLACE_ORDER);
      const HandlePlaceOrder = async (id,e) => {
          window.location.reload();
          console.log("placed", id);
          // return id;
      
          try{
              const{data}=await orderPlace({
                  variables:{
                      id
                  }
              }
  
              );
          }catch(error){
              console.log(error);
          }
        };
    
      const handleEdit = (id) => {
        window.location.href = `/Edit?id=${id}`;
      };
      const handleView = (id) => {
        // Implement print logic here
      };
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    fetch(graphqlEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query: graphqlQuery })
    })
      .then(response => response.json())
      .then(data => {
        const rowsData = data.data.invoiceestimator_view.map(item => ({
          id: item.id,
          name: item.customer_name,
          discount: item.discount_amount,
          address: item.customer_address,
          number: item.estimate_id,
          price: item.total,
          status: item.order_status,
        }));
        setRows(rowsData);
      })
      .catch(error => console.error(error));
  }, []);



  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'discount', headerName: 'Discount', width: 120 },
      { field: 'address', headerName: 'Address', width: 250 },
      { field: 'number', headerName: 'Number', width: 100},
      { field: 'price', headerName: 'Price', width: 140 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 312,
        renderCell: (params: GridRowParams ) => (
          <div className='ViewAction'>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              onClick={() => HandleDelete(params.id)}
            />
            <GridActionsCellItem
              icon={<button>edit</button>}
              onClick={() => handleEdit(params.id)}
              showInMenu
            />
            <GridActionsCellItem
              icon={<button>View</button>}
              onClick={() => handleView(params.id)}
              showInMenu
            />
            <GridActionsCellItem
              icon={<button>PlaceOrder</button>}
              onClick={() => HandlePlaceOrder(params.id)}
              showInMenu
            />
          </div>
        )
      }
    ],
    []
  );
  
  return (
    <Box sx={{ height: 600, width: "100%" }}>
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
    </Box>
  );
      }  

export default View;
