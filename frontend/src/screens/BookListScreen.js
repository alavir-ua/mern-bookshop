import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listBooks, deleteBook, createBook } from '../actions/bookActions'
import { BOOK_CREATE_RESET } from '../constants/bookConstants'
import Meta from '../components/Meta'

const BookListScreen = ({ history, match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const bookList = useSelector((state) => state.bookList)
  const { loading, error, books, page, pages } = bookList

  const bookDelete = useSelector((state) => state.bookDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = bookDelete

  const bookCreate = useSelector((state) => state.bookCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    book: createdBook,
  } = bookCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: BOOK_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(`/admin/book/${createdBook._id}/edit`)
    } else {
      dispatch(listBooks(keyword, pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdBook,
    pageNumber,
    keyword,
  ])

  const deleteHandler = (id, name) => {
    if (window.confirm(`Really delete the book "${name}" ?`)) {
      dispatch(deleteBook(id))
    }
  }

  const createBookHandler = () => {
    dispatch(createBook())
  }

  return (
    <>
      <Meta title="Admin Books" />
      <Row className="align-items-center">
        <Col>
          <h1>Books</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createBookHandler}>
            <i className="fas fa-plus"></i> Create Book
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORIES</th>
                <th>PAGES</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book._id}</td>
                  <td>{book.name}</td>
                  <td>${book.price}</td>
                  <td>
                    {book.categories.map((category) => category.name + ', ')}
                  </td>
                  <td>{book.pages}</td>
                  <td>
                    <LinkContainer to={`/admin/book/${book._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(book._id, book.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <Paginate
              isAdmin={true}
              type="books"
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            />
          </Table>
        </>
      )}
    </>
  )
}

export default BookListScreen
