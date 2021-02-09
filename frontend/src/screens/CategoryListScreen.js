import React, { useEffect } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listCategories } from '../actions/categoryActions'
import Meta from '../components/Meta'

const CategoryListScreen = ({ history, match }) => {
  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)
  const { loading, error, categories, counts, page, pages } = categoryList

  for (let i = 0; i < categories.length; i++) {
    categories[i].bookQty = counts[i]
  }

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }
    dispatch(listCategories(keyword, pageNumber))
  }, [dispatch, history, userInfo, pageNumber, keyword])

  const createCategoryHandler = () => {
    history.push('/admin/category/create')
  }

  return (
    <>
      <Meta title="Admin Categories" />
      <Row className="align-items-center">
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createCategoryHandler}>
            <i className="fas fa-plus"></i> Create Category
          </Button>
        </Col>
      </Row>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
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
                <th>QUANTITY OF BOOKS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.bookQty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            isAdmin={true}
            type="categories"
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default CategoryListScreen
