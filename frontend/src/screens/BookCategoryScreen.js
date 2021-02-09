import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Book from '../components/Book'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listCategoryBooks } from '../actions/bookActions'
import { listCategoryDetails } from '../actions/categoryActions'

const BookCategoryScreen = ({ match }) => {
  const categoryId = match.params.id

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const bookCategory = useSelector((state) => state.bookCategory)
  const { loading, error, books, page, pages } = bookCategory

  const categoryDetails = useSelector((state) => state.categoryDetails)

  const {
    loading: loadingCategory,
    error: errorGetCategory,
    category,
  } = categoryDetails

  useEffect(() => {
    dispatch(listCategoryBooks(categoryId, pageNumber))
    dispatch(listCategoryDetails(categoryId))
  }, [dispatch, categoryId, pageNumber])

  return (
    <>
      <Meta title={category.name} />
      <Link to="/" className="btn btn-dark">
        Go Back
      </Link>
      {loading && loadingCategory ? (
        <Loader />
      ) : error && errorGetCategory ? (
        <Message variant="danger">
          {error}
          {errorGetCategory}
        </Message>
      ) : (
        <>
          <h1>Books by category "{category.name}"</h1>
          <Row>
            {books.map((book) => (
              <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
                <Book book={book} />
              </Col>
            ))}
          </Row>
          <Paginate
            id={match.params.id}
            isAdmin={false}
            type="categories"
            pages={pages}
            page={page}
          />
        </>
      )}
    </>
  )
}

export default BookCategoryScreen
