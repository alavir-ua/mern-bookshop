import express from 'express'
const router = express.Router()
import {
  getCategoryById,
  getCategories,
  createCategory,
} from '../controllers/categoryController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/:id').get(getCategoryById)
router.route('/').get(getCategories).post(protect, admin, createCategory)

export default router
