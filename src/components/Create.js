import { MyForm } from './MyForm';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const PRODUCTS_QUERY = gql`
  query {
    products(search: "", pageSize: 400) {
      items {
        id
        name
        sku
        url_key
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        stock_status
        image {
          url
        }
      }
    }
  }
`;


function ProductsList(props) {
  
const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'image', headerName: 'Image', flex: 2, renderCell: (params) => <img src={params.value?.url} alt={params.row.name} style={{ width: '40%', height: '100%' }}/> },
  { field: 'quantity', headerName: 'Quantity', flex: 2, renderCell: (params) => <input type="number" value={params.row.quantity} onChange={(event) => onQuantityChange(event, params.row.id)}/> },
  { field: 'price', headerName: 'Price', flex: 1, renderCell: (params) => `${params.row.price_range?.minimum_price?.regular_price?.value} ${params.row.price_range?.minimum_price?.regular_price?.currency}` },
  {
    field: 'customOption',
    headerName: 'Custom Option',
    flex: 1,
    renderCell: (params) => (
      <select onChange={(event) => onCustomOptionChange(event, params.row.id)}>
        <option value="">-</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    ),
  },
];
const [selectedRow, setSelectedRows] = React.useState({});
const onCustomOptionChange = (event, id) => {
  const newCustomOption = event.target.value;
  const updatedSelectedRows = { ...selectedRow };
  updatedSelectedRows[id] = { ...updatedSelectedRows[id], customOption: newCustomOption };

  // Update quantity field
  const existingQuantity = updatedSelectedRows[id]?.quantity;
  updatedSelectedRows[id] = { ...updatedSelectedRows[id], quantity: existingQuantity || 1 };

  setSelectedRows(updatedSelectedRows);
  props.handleSelectedRow(Object.values(selectedRow));
};
const onQuantityChange = (event, id) => {
  const newQuantity = event.target.value;
  const updatedSelectedRows = { ...selectedRow };
  updatedSelectedRows[id] = { ...updatedSelectedRows[id], quantity: newQuantity };

  // Update customOption field
  const existingCustomOption = updatedSelectedRows[id]?.customOption;
  updatedSelectedRows[id] = { ...updatedSelectedRows[id], customOption: existingCustomOption || '' };

  setSelectedRows(updatedSelectedRows);
  props.handleSelectedRow(Object.values(updatedSelectedRows));
};

const onRowsSelectionHandler = (updatedSelectedRows) => {
  const newSelectedRows = updatedSelectedRows.reduce((acc, id) => {
    const product = products.find((product) => product.id === id);
    const existingRow = selectedRow[id];
    const newRow = { ...product, quantity: existingRow ? existingRow.quantity : 1 };
    acc[id] = newRow;
    return acc;
  }, {});
  setSelectedRows(newSelectedRows);
  props.handleSelectedRow(Object.values(newSelectedRows));
};







  const { loading, error, data } = useQuery(PRODUCTS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const products = data.products.items;
  const options = {
    getRowHeight: (params) => 100,
  };

  return (
    <>
   
    <Box sx={{ height: 600, width: '100%', }}>
      <DataGrid
        options={options}
        rows={products}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(updatedSelectedRows) => onRowsSelectionHandler(updatedSelectedRows)}

        components={{Toolbar: GridToolbar}}
        componentsProps={{
          toolbar: {
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
          }
      }}
      />
    </Box>
    {console.log(selectedRow)}
    </>
  );
}

export const Create = () =>{
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("create",token);
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const [selectedRow, setSelectedRow] = React.useState('');

  const handleSelectedRow = (row) => {
    setSelectedRow(row);
  }

  return (
    <ApolloProvider client={client}>
      <MyForm selectedRow={selectedRow} />
      <ProductsList handleSelectedRow={handleSelectedRow} />
      {console.log(selectedRow)}
    </ApolloProvider>

  );
};
export default Create;