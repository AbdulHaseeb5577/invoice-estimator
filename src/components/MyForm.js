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
  const [invoIceEstimator] = useMutation(CREATE_INVOICE_MUTATION);
  const selectedRow = props.selectedRow;
  const schema = yup.object().shape({
    discountAmount: yup.number().positive().integer().required("*"),
    discountType: yup.string().required("Discount Type is a required field"),
    firstName: yup.string().required("Name is Required Field"),
    lastName: yup.string().required("Name is Required Field"),
    email: yup.string().email("Invalid email").required("Email is a required field"),
    address: yup.string().required("Name is a required field"),
    customerNumber: yup.number().positive().integer().moreThan(0).required("Customer Number is a required field"),
    couponcode: yup.number().positive().integer().required("If you are not under 18"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [formValues, setFormValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

      const { data: { invoice_estimator: invoiceEstimator } } = await invoIceEstimator({
        variables: { input },
        context: {
          headers: headers
        }
      });

      console.log("invoiceEstimator:", invoiceEstimator);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} placeholderText={'12/30/2023'} className="UserDate" />
      <form className="UserForm" onSubmit={handleSubmit(onSubmit)} >
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
        <input type="text" placeholder="Email..." {...register("email")} />
        <p className="Error">{errors.email?.message}</p>
        <label>Customer Address:</label>
        <input name="address" placeholder="Address" type="text" autoComplete="street-address" {...register("address")} />
        <p className="Error">{errors.address?.message}</p>
        <label>Customer Number:</label>
        <input type="number" placeholder="Customer Number" {...register("customerNumber")} />
        <p className="Error">{errors.customerNumber?.message}</p>
        <label>coupon code:</label>
        <input type="number" placeholder="coupon code" {...register("couponcode")} />
        <p className="Error">{errors.couponcode?.message}</p>
        <input type="submit" className="SubmitUser"/>
      </form>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <Popup selectedRow={selectedRow} formValues={formValues} closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};
