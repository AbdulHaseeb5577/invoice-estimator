import gql from 'graphql-tag';

export const LOGIN_CUSTOMER = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;


export const DELETE_ORDER = gql`
mutation DeleteInvoiceEstimator($id:Int!) {
  deleteInvoiceEstimator(input: {id:$id}) {
    message
    status
  }
}
`;
export const PLACE_ORDER = gql`
mutation PlaceOrder($id:Int!) {
  orderPlace(input: {id:$id}) {
    message
    status
  }
}
`
export const CREATE_INVOICE = gql`
mutation createOrderInvoice ($first_name:String, $last_name: String,$customer_address:String, $customer_number: Int, $discount_amount: Float, $coupon_code: Int, 
$chked_box_val: [ItemsIds]!){
  invoiceEstimator(input: { 
   chked_box_val:$chked_box_val
    coupon_code:$coupon_code
    first_name:$first_name
    last_name:$last_name
    customer_address:$customer_address
    customer_number:$customer_number
    discount_amount:$discount_amount
  }
    )

  {
    invoice_estimator {
      customer_address
      customer_name
      customer_number
      discount_amount
      estimate_id
      id
    }
    message
    selected_products {
      product_id
      product_qty
    }
    status
  }
}
`;