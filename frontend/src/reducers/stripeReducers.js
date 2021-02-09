import {
  STRIPE_PAY_REQUEST,
  STRIPE_PAY_SUCCESS,
  STRIPE_PAY_FAIL,
  STRIPE_PAY_RESET,
} from '../constants/stripeConstants'

export const stripePayReducer = (state = {}, action) => {
  switch (action.type) {
    case STRIPE_PAY_REQUEST:
      return { loadingStripePay: true }
    case STRIPE_PAY_SUCCESS:
      return { loadingStripePay: false, stripePaymentResult: action.payload }
    case STRIPE_PAY_FAIL:
      return { loadingStripePay: false, stripePaymentError: action.payload }
    case STRIPE_PAY_RESET:
      return {}
    default:
      return state
  }
}
