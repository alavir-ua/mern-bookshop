import {
  STRIPE_PAY_REQUEST,
  STRIPE_PAY_SUCCESS,
  STRIPE_PAY_FAIL,
} from '../constants/stripeConstants'
import axios from 'axios'
import { logout } from './userActions'

export const createStripePay = (id, order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STRIPE_PAY_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(
      '/api/stripe/charge',
      {
        amount: Math.trunc(order.totalPrice * 100),
        id: id,
      },
      config
    )

    dispatch({
      type: STRIPE_PAY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: STRIPE_PAY_FAIL,
      payload: message,
    })
  }
}
