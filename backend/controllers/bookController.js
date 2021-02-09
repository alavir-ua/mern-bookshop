import fs from 'fs'
import path from 'path'
import asyncHandler from 'express-async-handler'
import Book from '../models/bookModel.js'
const __dirname = path.resolve()

// @desc    Fetch all books
// @route   GET /api/books/page/:pageNumber/search/:keyword
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Book.countDocuments({ ...keyword })
  const books = await Book.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ books, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)

  if (book) {
    res.json(book)
  } else {
    res.status(404)
    throw new Error('Book not found')
  }
})

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)

  if (book) {
    //delete  image
    if (book.image !== '/uploads\\\\sample.jpg') {
      const imagePath = __dirname + `${book.image}`

      fs.access(imagePath, fs.F_OK, (err) => {
        if (err) {
          console.log('err', err)
          return
        } else fs.unlinkSync(imagePath)
        console.log(`Image with path ${book.name} deleted successfully`)
      })
    }

    await book.remove()
    res.json({ message: 'Book removed' })
  } else {
    res.status(404)
    throw new Error('Book not found')
  }
})

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const book = new Book({
    user: req.user._id,
    name: 'Sample name',
    price: 0,
    description: 'Sample description',
    image: '/uploads\\\\sample.jpg',
    publisher: 'Sample publisher',
    publish_date: 'Sample date',
    pages: 0,
    dimensions: 'Sample dimensions',
    language: 'English',
    type: 'Sample type',
    ean_upc: 'Sample EAN_UPC',
    categories: [],
    countInStock: 0,
    numReviews: 0,
  })

  const createdBook = await book.save()
  res.status(201).json(createdBook)
})

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    publisher,
    publish_date,
    pages,
    dimensions,
    language,
    type,
    ean_upc,
    categories,
    countInStock,
  } = req.body

  const book = await Book.findById(req.params.id)

  //delete prevent image
  if (image !== book.image && book.image !== '/uploads\\\\sample.jpg') {
    const imagePath = __dirname + `${book.image}`

    fs.access(imagePath, fs.F_OK, (err) => {
      if (err) {
        console.log('err', err)
        return
      } else fs.unlinkSync(imagePath)
      console.log(`Image with path ${book.name} deleted successfully`)
    })
  }

  if (book) {
    book.name = name
    book.price = price
    book.description = description
    book.image = image
    book.publisher = publisher
    book.publish_date = publish_date
    book.pages = pages
    book.dimensions = dimensions
    book.language = language
    book.type = type
    book.ean_upc = ean_upc
    book.categories = categories
    book.countInStock = countInStock

    const updatedBook = await book.save()
    res.json(updatedBook)
  } else {
    res.status(404)
    throw new Error('Book not found')
  }
})

// @desc    Create new review
// @route   POST /api/books/:id/reviews
// @access  Private
const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const book = await Book.findById(req.params.id)

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Book already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    book.reviews.push(review)

    book.numReviews = book.reviews.length

    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length

    await book.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Book not found')
  }
})

// @desc    Get top rated books
// @route   GET /api/books/top
// @access  Public
const getTopBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({}).sort({ rating: -1 }).limit(10)

  res.json(books)
})

// @desc    Get books by category
// @route   GET /api/books/category/:id
// @access  Public
const getBooksByCategoryId = asyncHandler(async (req, res) => {
  const pageSize = 4
  const page = Number(req.query.pageNumber) || 1

  const params = { categories: { $elemMatch: { _id: req.params.id } } }

  const count = await Book.countDocuments({ ...params })
  const books = await Book.find({ ...params })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ books, page, pages: Math.ceil(count / pageSize) })
})

export {
  getBooks,
  getBookById,
  deleteBook,
  createBook,
  updateBook,
  createBookReview,
  getTopBooks,
  getBooksByCategoryId,
}
