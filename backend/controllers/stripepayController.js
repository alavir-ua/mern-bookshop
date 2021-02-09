import Stripe from 'stripe'
import asyncHandler from 'express-async-handler'

const stripePay = asyncHandler(async (req, res) => {
  let { amount, id } = req.body

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const payment = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'USD',
    description: 'Bookshop',
    payment_method: id,
    confirm: true,
  })

  if (payment && payment.status === 'succeeded') {
    const { id, status, created, charges } = payment
    res.json({ id, status, created, charges })
  } else {
    res.status(404)
    throw new Error('Payment Failed')
  }
})

export { stripePay }
