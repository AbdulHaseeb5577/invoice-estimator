import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Popup } from './Popup';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from '@apollo/client';
import { CREATE_INVOICE_MUTATION } from './mutation/mutations';

Modal.setAppElement('#root');

export const MyForm = (props) => {
  const [invoIceEstimatorMutation] = useMutation(CREATE_INVOICE_MUTATION);
  const selectedRow = props.selectedRow;
  const schema = yup.object().shape({
    discountAmount: yup.number().integer().moreThan(-1).required("*"),
    discountType: yup.string().required("Discount Type is a required field"),
    firstName: yup.string().required("Name is Required Field"),
    lastName: yup.string().required("Name is Required Field"),
    email: yup.string().email("Invalid email").required("Email is a required field"),
    address: yup.string().required("Name is a required field"),
    customerNumber: yup.number().positive().integer().moreThan(0).required("Customer Number is a required field"),
    couponcode: yup.string(),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [formValues, setFormValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [invoiceEstimatorData, setInvoiceEstimatorData] = useState('');

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    console.log('selected row:', selectedRow);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const input = {
        chked_box_val: selectedRow.map((row) => ({
          product_id: row.id,
          product_qty: row.quantity,
        })),
        custom_options: selectedRow.map((row) => ({
          product_id: row.id,
          custom_option: row.customoption || '',
        })),
        coupon_code: data.couponcode,
        first_name: data.firstName,
        last_name: data.lastName,
        customer_email: data.email,
        customer_address: data.address,
        customer_number: data.customerNumber,
        discount_amount: data.discountAmount,
        discount_type: data.discountType,
      };

      setFormValues(data);
      setIsModalOpen(true);


      const { data: { invoIceEstimator: { invoice_estimator: invoiceEstimator_Data } } } = await invoIceEstimatorMutation({
        variables: { input },
        context: {
          headers: headers
        }
      });
      console.log("invoiceEstimator:", invoiceEstimator_Data);
      setInvoiceEstimatorData(invoiceEstimator_Data);

      // console.log("invoiceEstimator:", invoiceEstimator, data, input);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} placeholderText={'12/30/2023'} className="UserDate" />
      <form className="UserForm" onSubmit={handleSubmit(onSubmit)}>
  <div className="form-row">
    <div className="form-column">
      <label>Discount Amount:</label>
      <input type="number" placeholder="Discount Amount" {...register("discountAmount")} min={0} onWheel={(e) => e.currentTarget.blur()}  />
      <p className="Error">{errors.discountAmount?.message}</p>

      <label>Discount Type:</label>
      <select {...register("discountType")}>
        <option value="fix">Fix</option>
        <option value="percent">Percentage</option>
      </select>
      <p className="Error">{errors.discountType?.message}</p>

      <label>Customer First Name:</label>
      <input type="text" placeholder="Customer First Name:" {...register("firstName")} />
      <p className="Error">{errors.firstName?.message}</p>

      <label>Customer Last Name:</label>
      <input type="text" placeholder="Customer Last Name:" {...register("lastName")} />
      <p className="Error">{errors.lastName?.message}</p>
    </div>

    <div className="form-column">
      <label>Email:</label>
      <input type="text" placeholder="Email..." {...register("email")} />
      <p className="Error">{errors.email?.message}</p>

      <label>Customer Address:</label>
      <input name="address" placeholder="Address" type="text" autoComplete="street-address" {...register("address")} />
      <p className="Error">{errors.address?.message}</p>

      <label>Customer Number:</label>
      <input type="number" placeholder="Customer Number" {...register("customerNumber")} />
      <p className="Error">{errors.customerNumber?.message}</p>

      <label>Coupon Code:</label>
      <input type="text" placeholder="Coupon Code" {...register("couponcode")} />
      <p className="Error">{errors.couponcode?.message}</p>
    </div>
  </div>

  <input type="submit" className="SubmitUser" />
</form>

      <Modal className="View-popup" isOpen={isModalOpen} onRequestClose={() => {setIsModalOpen(false);console.log
      ('ppppppppppppppppp',invoiceEstimatorData)}}>
        <Popup selectedRow={selectedRow} invoiceEstimator={invoiceEstimatorData} formValues={formValues} closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};