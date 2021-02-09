import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import Book from '../models/bookModel.js'

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Fetch all categories
// @route   GET /api/categories?pageNumber=
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  if (req.query.pageNumber.length === 0) {
    const categories = await Category.find({})

    res.json({ categories, counts: [], page: 0, pages: [] })
  }

  {
    const pageSize = 5
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}

    const count = await Category.countDocuments({ ...keyword })
    const categories = await Category.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    const counts = []

    for (let i = 0; i < categories.length; i++) {
      const params = { categories: { $elemMatch: { _id: categories[i]._id } } }
      const count = await Book.countDocuments({ ...params })
      counts.push(count)
    }

    res.json({ categories, counts, page, pages: Math.ceil(count / pageSize) })
  }
})

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body

  const categoryExists = await Category.findOne({ name })

  if (categoryExists) {
    res.status(400)
    throw new Error('Category already exists')
  }

  const category = new Category({
    user: req.user._id,
    name,
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

export { getCategoryById, getCategories, createCategory }
