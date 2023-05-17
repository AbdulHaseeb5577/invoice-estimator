
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import React, { useState,  useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from 'react-router-dom';
Modal.setAppElement('#root');


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
];
const [selectedRow, setSelectedRows] = React.useState([]);
  
  const onQuantityChange = (event, id) => {
    const newQuantity = event.target.value;
    const updatedSelectedRows = selectedRow.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: newQuantity };
      } else {
        return product;
      }
    });
    setSelectedRows(updatedSelectedRows);
    props.handleSelectedRow(updatedSelectedRows);
  };

  const onRowsSelectionHandler = (updatedSelectedRows) => {
    const selectedRow = updatedSelectedRows.map((id) => {
      const product = products.find((product) => product.id === id);
      return { ...product, quantity: product.quantity || 1 };
    });
    setSelectedRows(selectedRow);
    props.handleSelectedRow(selectedRow);
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

export const Edit = () => {

  const [selectedRow, setSelectedRow] = React.useState('');

  const handleSelectedRow = (row) => {
    setSelectedRow(row);
  }


    const MyForm = (props) => {
        const selectedRow = props.selectedRow;
        const schema = yup.object().shape({
          discountAmount: yup.number().positive().integer().required("*"),
          firstName: yup.string().required("Name is Required Field"),
          lastName: yup.string().required("Name is Required Field"),
          email: yup.string().email("Invalid email").required("Email is a required field"),
          address: yup.string().required("Name is a required field"),
          customerNumber: yup.string()
        });
      
        const { register, handleSubmit, formState: { errors }, setValue } = useForm({
          resolver: yupResolver(schema),
        });
      
        const [formValues, setFormValues] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedDate, setSelectedDate] = useState(null);
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        console.log("kjalgshhhh;;;;;;;;;;;;;;;;;;;;;;;",id)


        useEffect(() => {
          const clientEdit = new ApolloClient({
            uri: 'http://localhost:3000/graphql',
            cache: new InMemoryCache(),
          });
      
          clientEdit
            .query({
              query: gql`
                {
                  invoiceestimator_edit(id: ${id}) {
                    chked_box_val {
                      product_id
                      product_qty
                    }
                    customer_address
                    customer_name
                    customer_number
                    discount_amount
                    estimate_id
                  }
                }
              `,
            })
            .then((result) => {
              const data = result.data.invoiceestimator_edit;
      console.log(data)
              // Set the initial form values using the retrieved data
              setValue('discountAmount', data.discount_amount);
              setValue('firstName', data.customer_name);
              setValue('lastName', '');
              setValue('email', );
              setValue('address', data.customer_address);
              setValue('customerNumber', data.customer_number);
      
              // Iterate over the chked_box_val array and set the initial product field values
              data.chked_box_val.forEach((product, index) => {
                setValue(`product_${index}_id`, product.product_id);
                setValue(`product_${index}_qty`, product.product_qty);
                console.log("check box::::::::::::::::::::::::::::",data.chked_box_val)
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }, []);
      
        const onSubmit = (data) => {
          data.selectedDate = selectedDate;
          setFormValues(data);
          setIsModalOpen(true);
        }
      
        return (
            <>
              <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} placeholderText={'12/30/2023'} className="UserDate" />
              <form className="UserForm" onSubmit={handleSubmit(onSubmit)}>
                <label>Discount Amount:</label>
                <input type="number" placeholder="Discount Amount" {...register("discountAmount")} />
                <p className="Error">{errors.discountAmount?.message}</p>
                <label>Customer First Name:</label>
                <input type="text" placeholder="Customer First Name:" {...register("firstName")} />
                <p className="Error">{errors.firstName?.message}</p>
                <label>Customer Last Name:</label>
                <input type="text" placeholder="Customer Last Name:" {...register("lastName")} />
                <p className="Error">{errors.lastName?.message}</p>
                <label>Email:</label>
                <input type="text" placeholder="Email:" {...register("email")} />
                <p className="Error">{errors.email?.message}</p>
                <label>Address:</label>
                <input type="text" placeholder="Address:" {...register("address")} />
                <p className="Error">{errors.address?.message}</p>
                <label>Customer Number:</label>
                <input type="text" placeholder="Customer Number:" {...register("customerNumber")} />
                <p className="Error">{errors.customerNumber?.message}</p>
                {console.log("sssss::::::::::::::::::::::::::::::::::",selectedRow)}
                {selectedRow && selectedRow.chked_box_val.map((product, index) => (
                  <div key={index}>
                    <label>{`Product ${index+1} ID:`}</label>
                    <input type="text" placeholder={`Product ${index+1} ID:`} {...register(`product_${index}_id`)} />
                    <p className="Error">{errors[`product_${index}_id`]?.message}</p>
                    <label>{`Product ${index+1} Quantity:`}</label>
                    <input type="number" placeholder={`Product ${index+1} Quantity:`} {...register(`product_${index}_qty`)} />
                    <p className="Error">{errors[`product_${index}_qty`]?.message}</p>
                  </div>
                ))}
                <button type="submit" className="SubmitUser">Submit</button>
              </form>
              {isModalOpen && (
                <div className="Modal">
                  <h2>Confirm Submission</h2>
                  <p>Discount Amount: {formValues.discountAmount}</p>
                  <p>Customer Name: {formValues.firstName} {formValues.lastName}</p>
                  <p>Email: {formValues.email}</p>
                  <p>Address: {formValues.address}</p>
                  <p>Customer Number: {formValues.customerNumber}</p>
                  <p>Selected Date: {selectedDate?.toLocaleDateString()}</p>

                  {formValues && selectedRow && selectedRow.chked_box_val.map((product, index) => (
                   
                    <div key={index}>
                      <p>{`Product ${index+1} ID: ${formValues[`product_${index}_id`]}`}</p>
                      <p>{`Product ${index+1} Quantity: ${formValues[`product_${index}_qty`]}`}</p>
                    </div>
                  ))}
                  <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
              )}
            </>
          );
                  };
      
  return (
    <ApolloProvider client={client}>
      <MyForm selectedRow={selectedRow} />
      <ProductsList handleSelectedRow={handleSelectedRow} />
      {console.log(selectedRow)}
    </ApolloProvider>

  )
};
