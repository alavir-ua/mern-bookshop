import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listBookDetails, updateBook } from '../actions/bookActions'
import { listCategories } from '../actions/categoryActions'
import { BOOK_UPDATE_RESET } from '../constants/bookConstants'
import Meta from '../components/Meta'

const BookEditScreen = ({ match, history }) => {
  const bookId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [publisher, setPublisher] = useState('')
  const [publish_date, setPublish_date] = useState('')
  const [pages, setPages] = useState(0)
  const [dimensions, setDimensions] = useState('')
  const [language, setLanguage] = useState('')
  const [type, setType] = useState('')
  const [ean_upc, setEan_upc] = useState('')
  const [bookCategories, setBookCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const histories = useHistory()

  const dispatch = useDispatch()

  const bookDetails = useSelector((state) => state.bookDetails)
  const { loading, error, book } = bookDetails

  const categoryList = useSelector((state) => state.categoryList)
  const {
    loading: loadingCategories,
    error: errorGetCategories,
    categories,
  } = categoryList

  const bookUpdate = useSelector((state) => state.bookUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = bookUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: BOOK_UPDATE_RESET })
      history.push('/admin/booklist')
    } else {
      if (!book.name || book._id !== bookId) {
        dispatch(listBookDetails(bookId))
        dispatch(listCategories())
      } else {
        setName(book.name)
        setPrice(book.price)
        setDescription(book.description)
        setImage(book.image)
        setPublisher(book.publisher)
        setPublish_date(book.publish_date)
        setPages(book.pages)
        setDimensions(book.dimensions)
        setLanguage(book.language)
        setType(book.type)
        setImage(book.image)
        setEan_upc(book.ean_upc)
        setBookCategories(book.categories)
        setCountInStock(book.countInStock)
      }
    }
  }, [dispatch, history, bookId, book, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const bookCategoriesHandler = (event) => {
    const selectedCategory = JSON.parse(event.target.value)
    const arr = [...selectedCategories]

    const repeated = arr.some(
      (category) => category._id === selectedCategory._id
    )

    if (arr.length === 0 || !repeated) {
      arr.push(selectedCategory)
    }

    setSelectedCategories(arr)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const finalCategories =
      selectedCategories.length !== 0 ? selectedCategories : bookCategories

    dispatch(
      updateBook({
        _id: bookId,
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
        categories: finalCategories,
        countInStock,
      })
    )
  }

  const dimArr = [
    '5.5 X 8.1 X 1.4 inches | 1.2 pounds',
    '5.2 X 7.9 X 0.8 inches | 0.56 pounds',
    '6.3 X 1.2 X 9.2 inches | 1.2 pounds',
    '5.7 X 8.3 X 1.0 inches | 0.8 pounds',
    '5.8 X 1.5 X 8.4 inches | 1.1 pounds',
    '5.5 X 8.5 X 1.1 inches | 0.9 pounds',
    '5.9 X 8.3 X 1.3 inches | 1.14 pounds',
    '5.3 X 7.9 X 0.7 inches | 0.44 pounds',
    '5.1 X 1.4 X 7.6 inches | 0.8 pounds',
    '9.1 X 6.3 X 1.4 inches | 1.37 pounds',
  ]

  return (
    <>
      <Button
        className="btn btn-outline-light my-3"
        onClick={() => {
          histories.goBack()
        }}
      >
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit Book</h1>
        <Meta title="Admin Edit Book" />
        {loadingUpdate && loadingCategories && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error && errorGetCategories ? (
          <Message variant="danger">
            {error}
            {errorGetCategories}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="publisher">
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="publish_date">
              <Form.Label>Publish date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter publish date"
                value={publish_date}
                onChange={(e) => setPublish_date(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="pages">
              <Form.Label>Pages</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="dimensions">
              <Form.Label>Dimensions</Form.Label>
              <Form.Control
                name="dimensions"
                value={dimensions}
                as="select"
                onChange={(e) => setDimensions(e.target.value)}
              >
                {dimArr.map((dimension, idx) => (
                  <option key={idx} value={dimension}>
                    {dimension}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                name="type"
                value={type}
                as="select"
                onChange={(e) => setType(e.target.value)}
              >
                <option key={0} value="Hardcover">
                  Hardcover
                </option>
                <option key={1} value="Paperback">
                  Paperback
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ean_upc">
              <Form.Label>EAN/UPC</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter EAN_UPC"
                value={ean_upc}
                onChange={(e) => setEan_upc(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="categories">
              <Form.Label>
                Categories:&nbsp;
                {bookCategories.map((category) => category.name + ', ')}
              </Form.Label>

              {selectedCategories.length !== 0 && (
                <ul>
                  <h6 className="mt-3" style={{ color: '#00b300' }}>
                    Selected categories
                  </h6>
                  {selectedCategories.map((category) => (
                    <li key={category._id}>{category.name}</li>
                  ))}
                </ul>
              )}

              <Form.Control
                name="category"
                as="select"
                onChange={bookCategoriesHandler}
                multiple
              >
                {categories.map((category) => (
                  <option key={category._id} value={JSON.stringify(category)}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default BookEditScreen
