import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

const SearchBox = ({ history }) => {
  const location = useLocation()
  const [keyword, setKeyword] = useState('')
  const [placeholder, setPlaceholder] = useState('')

  useEffect(() => {
    if (location.pathname.match(/\/admin\/userlist/) !== null) {
      setPlaceholder('Search Users...')
    } else if (location.pathname.match(/\/admin\/categorylist/) !== null) {
      setPlaceholder('Search Categories...')
    } else if (location.pathname.match(/\/admin\/orderlist/) !== null) {
      setPlaceholder('Search Orders by users...')
    } else {
      setPlaceholder('Search Books...')
    }
  }, [location.pathname])

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      if (location.pathname.match(/\/admin\/booklist/) !== null) {
        history.push(`/admin/booklist/search/${keyword}`)
      } else if (location.pathname.match(/\/admin\/userlist/) !== null) {
        history.push(`/admin/userlist/search/${keyword}`)
      } else if (location.pathname.match(/\/admin\/categorylist/) !== null) {
        history.push(`/admin/categorylist/search/${keyword}`)
      } else if (location.pathname.match(/\/admin\/orderlist/) !== null) {
        history.push(`/admin/orderlist/search/${keyword}`)
      } else {
        history.push(`/search/${keyword}`)
      }
    } else {
      if (location.pathname.match(/\/admin\/booklist/) !== null) {
        history.push('/admin/booklist')
      } else if (location.pathname.match(/\/admin\/userlist/) !== null) {
        history.push('/admin/userlist')
      } else if (location.pathname.match(/\/admin\/categorylist/) !== null) {
        history.push('/admin/categorylist')
      } else if (location.pathname.match(/\/admin\/orderlist/) !== null) {
        history.push('/admin/orderlist')
      } else {
        history.push('/')
      }
    }
  }

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        style={{ borderRadius: '3px' }}
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
