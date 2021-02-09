import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createCategory } from '../actions/categoryActions'
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants'
import Meta from '../components/Meta'

const CategoryCreateScreen = ({ history }) => {
  const [name, setName] = useState('')

  const dispatch = useDispatch()

  const categoryCreate = useSelector((state) => state.categoryCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = categoryCreate

  useEffect(() => {
    dispatch({ type: CATEGORY_CREATE_RESET })
    if (successCreate) {
      history.push('/admin/categorylist')
    } else {
      setName(name)
    }
  }, [dispatch, history, successCreate, name])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createCategory({ name }))
  }

  return (
    <>
      <Link to="/admin/categorylist" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Category</h1>
        <Meta title="Admin Create Category" />
        {loadingCreate ? (
          <Loader />
        ) : errorCreate ? (
          <Message variant="danger">{errorCreate}</Message>
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

            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default CategoryCreateScreen
