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
export const GET_INVOICE_ESTIMATOR_VIEW = gql`
  query GetInvoiceEstimatorView {
    invoiceestimator_view {
      customer_address
      customer_name
      estimate_id
      discount_amount
      discount_type
      id
      order_status
      customer_number
      customer_email
      total
    }
  }
`;
export const VIEW_POPUP_ESTIMATOR = gql`
  mutation ViewPopupEstimator($estimateId: Int!) {
    popupInvoiceEstimatorView(input: { estimate_invoice_id: $estimateId }) {
      message
      status
      edit_invoice_estimator {
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
    }
  }
`;
export const EDIT_INVOICE_ESTIMATOR_MUTATION = gql`
  mutation editInvoiceEstimator($input: EditInvoiceInput!) {
    editInvoiceEstimator(input: $input) {
      edit_invoice_estimator {
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
