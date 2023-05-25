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

export const CREATE_INVOICE_MUTATION = gql`
  mutation invoIceEstimator($input: InvoiceInput!) {
    invoIceEstimator(input: $input) {
      invoice_estimator {
        discount_value_with_currency
        total_with_currency
        customer_discount_with_currency
        invoice_data {
          name
          price
          quantity
          custom_option
          total_product_price
        }
      }
      message
      status
    }
  }
`;
