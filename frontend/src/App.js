import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import BookScreen from './screens/BookScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreenPaypal from './screens/OrderScreenPaypal'
import OrderScreenStripe from './screens/OrderScreenStripe'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import BookListScreen from './screens/BookListScreen'
import CategoryListScreen from './screens/CategoryListScreen'
import CategoryCreateScreen from './screens/CategoryCreateScreen'
import BookEditScreen from './screens/BookEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import BookCategoryScreen from './screens/BookCategoryScreen'

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/order/:id/paypal" component={OrderScreenPaypal} exact />
          <Route path="/order/:id/stripe" component={OrderScreenStripe} exact />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/book/:id" component={BookScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/admin/booklist" component={BookListScreen} exact />
          <Route
            path="/admin/booklist/page/:pageNumber"
            component={BookListScreen}
            exact
          />
          <Route
            path="/admin/booklist/search/:keyword"
            component={BookListScreen}
            exact
          />
          <Route
            path="/admin/categorylist"
            component={CategoryListScreen}
            exact
          />
          <Route
            path="/admin/categorylist/page/:pageNumber"
            component={CategoryListScreen}
            exact
          />
          <Route
            path="/admin/categorylist/search/:keyword"
            component={CategoryListScreen}
            exact
          />
          <Route path="/admin/userlist" component={UserListScreen} exact />
          <Route
            path="/admin/userlist/page/:pageNumber"
            component={UserListScreen}
            exact
          />
          <Route
            path="/admin/userlist/search/:keyword"
            component={UserListScreen}
            exact
          />
          <Route path="/admin/orderlist" component={OrderListScreen} exact />
          <Route
            path="/admin/orderlist/page/:pageNumber"
            component={OrderListScreen}
            exact
          />
          <Route
            path="/admin/orderlist/search/:keyword"
            component={OrderListScreen}
            exact
          />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route
            path="/admin/category/create"
            component={CategoryCreateScreen}
            exact
          />
          <Route path="/admin/book/:id/edit" component={BookEditScreen} />
          <Route path="/category/:id" component={BookCategoryScreen} exact />
          <Route
            path="/category/:id/page/:pageNumber"
            component={BookCategoryScreen}
            exact
          />
          <Route path="/search/:keyword" component={HomeScreen} exact />
          <Route path="/page/:pageNumber" component={HomeScreen} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeScreen}
            exact
          />
          <Route path="/" component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
