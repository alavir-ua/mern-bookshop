import express from 'express'
const router = express.Router()
import { stripePay } from '../controllers/stripepayController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/charge').post(protect, stripePay)

export default router
