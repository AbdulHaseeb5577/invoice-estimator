
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import React, { useEffect,useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { EDIT_INVOICE_ESTIMATOR_MUTATION } from './mutation/mutations'
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







// ------------------------------Start product List










function ProductsList(props) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'image',
      headerName: 'Image',
      flex: 2,
      renderCell: (params) => (
        <img src={params.value?.url} alt={params.row.name} style={{ width: '40%', height: '100%' }} />
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 2,
      renderCell: (params) => (
        <input
          type="number"
          value={params.row.quantity}
          onChange={(event) => onQuantityChange(event, params.row.id)}
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => `${params.row.price_range?.minimum_price?.regular_price?.value} ${params.row.price_range?.minimum_price?.regular_price?.currency}`,
    },
    {
      field: "customoption",
      headerName: "Custom Option",
      flex: 1,
      renderCell: (params) => (
        <select onChange={(event) => onCustomOptionChange(event, params.row.id)}>
          <option value="">-</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      ),
    },
  ];

  const [selectedRow, setSelectedRows] = React.useState({});

  const onCustomOptionChange = (event, id) => {
    const newCustomOption = event.target.value;
    const updatedSelectedRows = { ...selectedRow };
    updatedSelectedRows[id] = { ...updatedSelectedRows[id], customoption: newCustomOption };

    // Update quantity field
    const existingQuantity = updatedSelectedRows[id]?.quantity;
    updatedSelectedRows[id] = { ...updatedSelectedRows[id], quantity: existingQuantity || 1 };

    setSelectedRows(updatedSelectedRows);
    props.handleSelectedRow(Object.values(updatedSelectedRows));
  };

  const onQuantityChange = (event, id) => {
    const newQuantity = parseInt(event.target.value);
    const updatedSelectedRows = { ...selectedRow };
    updatedSelectedRows[id] = { ...updatedSelectedRows[id], quantity: newQuantity };

    // Update customOption field
    const existingCustomOption = updatedSelectedRows[id]?.customoption;
    updatedSelectedRows[id] = { ...updatedSelectedRows[id], customoption: existingCustomOption || '' };

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
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          options={options}
          rows={products}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(updatedSelectedRows) => onRowsSelectionHandler(updatedSelectedRows)}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
        />
      </Box>
      {console.log("tessssssssssssss",selectedRow)}
    </>
  );
}











// ---------------------------------------end product list 













export const Edit = () => {

  const [selectedRow, setSelectedRow] = React.useState('');
  const [editInvoiceEstimatorMutation] = useMutation(EDIT_INVOICE_ESTIMATOR_MUTATION);

  const handleSelectedRow = (row) => {
    setSelectedRow(row);
  }














// ---------------------------- my form 










const MyForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInvoiceEstimator, setEditInvoiceEstimator] = useState('');
  const schema = yup.object().shape({
    discountAmount: yup.number().positive().integer().required("*"),
    firstName: yup.string().required("Name is Required Field"),
    discountType: yup.string().required("Discount Type is a required field"),
    lastName: yup.string().required("Name is Required Field"),
    email: yup.string().email("Invalid email").required("Email is a required field"),
    address: yup.string().required("Name is a required field"),
    customerNumber: yup.number().positive().integer().moreThan(0).required("Customer Number is a required field"),
    couponcode: yup.string().required("Discount Type is a required field"),
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

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
              custom_options {
                product_id
                custom_option
              }
              customer_address
              customer_name
              customer_number
              customer_email
              estimate_id
              discount_amount
              coupon_code
              discount_type
              estimate_id
            }
          }
        `,
      })
      .then((result) => {
        const data = result.data.invoiceestimator_edit;
        console.log(":::::::::::::::::Getting data from Query to populate", data,selectedRow);
        setValue('discountAmount', data.discount_amount);
        setValue('firstName', data.customer_name);
        setValue('lastName', '');
        setValue('email', data.customer_email);
        setValue('discountType', data.discountType);
        setValue('address', data.customer_address);
        setValue('customerNumber', data.customer_number);
        setValue('coupon_code', '');

        data.chked_box_val.forEach((product, index) => {
          setValue(`chked_box_val[${index}].product_id`, selectedRow.id);
          setValue(`chked_box_val[${index}].product_qty`, selectedRow.quantity);
        });
      })
      .catch((error) => {
      });
  }, [id,setValue]);

  const onSubmit = async (data) => {
    const input = {
      editable_estimate_invoice_id: id,
      first_name: data.firstName,
      last_name: data.lastName,
      discount_amount: data.discountAmount,
      discount_type: data.discountType,
      customer_email: data.email,
      customer_address: data.address,
      customer_number: data.customerNumber,
      coupon_code: data.couponcode,
      chked_box_val: Object.values(selectedRow).map((row) => ({
        product_id: row.id,
        product_qty: row.quantity,
      })),
      custom_options: Object.values(selectedRow).map((row) => ({
        product_id: row.id,
        custom_option: row.customoption,
      })),
    };
  
    const token = localStorage.getItem('token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    console.log("edit token", token, headers);
  
    try {
      const { data: { editInvoiceEstimator : {edit_invoice_estimator : editInvoiceEstimator_Data } } } = await editInvoiceEstimatorMutation({
        variables: { input },
        context: {
          headers: headers
        }
      });
  
      console.log("editInvoiceEstimator result data", editInvoiceEstimator);
      setEditInvoiceEstimator(editInvoiceEstimator_Data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
    console.log("heloooooooooooooooo",input)
  };

  return (
    <>
      <DatePicker placeholderText={'12/30/2023'} className="UserDate" />
      <form className="UserForm" onSubmit={handleSubmit(onSubmit)}>
        <label>Discount Amount:</label>
        <input type="number" placeholder="Discount Amount" {...register("discountAmount")} />
        <p className="Error">{errors.discountAmount?.message}</p>
        <label>Discount Type:</label>
        <select {...register("discountType")}>
          <option value="fix">Fix</option>
          <option value="percentage">Percentage</option>
        </select>
        <p className="Error">{errors.discountType?.message}</p>
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
        <label>coupon code:</label>
        <input type="number" placeholder="coupon code" {...register("couponcode")} />
        <p className="Error">{errors.couponcode?.message}</p>
        <button type="submit" className="SubmitUser">Submit</button>
      </form>
      <Modal isOpen={isModalOpen} onRequestClose={() => {setIsModalOpen(false);
      console.log('ppppppppppppppppp',editInvoiceEstimator)}}>
      </Modal>
    </>
  );
};






// -----------------------------------------end my form 









      
  return (
    <ApolloProvider client={client}>
      <MyForm selectedRow={selectedRow} />
      <ProductsList handleSelectedRow={handleSelectedRow} />
    </ApolloProvider>

  )
};
