import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const AdminPaginate = ({
  id = '',
  isAdmin,
  type = '',
  pages,
  page,
  keyword = '',
}) => {
  const link = (x, type, id) => {
    if (type === 'books') {
      if (isAdmin) {
        if (keyword) {
          return `/admin/booklist/search/${keyword}`
        } else {
          return `/admin/booklist/page/${x + 1}`
        }
      } else {
        if (keyword) {
          return `/search/${keyword}/page/${x + 1}`
        } else {
          return `/page/${x + 1}`
        }
      }
    } else if (type === 'users') {
      if (isAdmin) {
        if (keyword) {
          return `/admin/userlist/search/${keyword}`
        } else {
          return `/admin/userlist/page/${x + 1}`
        }
      }
    } else if (type === 'categories') {
      if (isAdmin) {
        return `/admin/categorylist/page/${x + 1}`
      } else {
        if (keyword) {
          return `/category/${id}/search/${keyword}/page/${x + 1}`
        } else {
          return `/category/${id}/page/${x + 1}`
        }
      }
    }
  }

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={link(x, type, id)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  )
}

export default AdminPaginate
