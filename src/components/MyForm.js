import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Popup } from './Popup';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
Modal.setAppElement('#root');

export const MyForm = (props) => {
  const selectedRow = props.selectedRow;
  const schema = yup.object().shape({
    discountAmount: yup.number().positive().integer().required("*"),
    firstName: yup.string().required("Name is Required Field"),
    lastName: yup.string().required("Name is Required Field"),
    email: yup.string().email("Invalid email").required("Email is a required field"),
    address: yup.string().required("Name is a required field"),
    customerNumber: yup.number().positive().integer().required("If you are not under 18"),
    couponcode: yup.number().positive().integer().required("If you are not under 18"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [formValues, setFormValues] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = (data) => {
    data.selectedDate = selectedDate;
    setFormValues(data);
    setIsModalOpen(true);
  }


  return (
    <>
     <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} placeholderText={'12/30/2023'} className="UserDate" />
      <form className="UserForm" onSubmit={handleSubmit(onSubmit)} >
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
}

