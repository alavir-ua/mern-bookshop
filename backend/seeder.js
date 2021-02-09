import dotenv from 'dotenv'
import colors from 'colors'
import Category from './models/categoryModel.js'
import User from './models/userModel.js'
import Book from './models/bookModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'
import names from './data/bookNames.js'
import moment from 'moment'
import 'moment/locale/en-gb.js'
import countries from 'i18n-iso-countries'
import faker from 'faker'
import _ from 'lodash'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Book.deleteMany()
    await User.deleteMany()
    await Category.deleteMany()

    const userUuids = []

    //creating admin
    const admin = new User({
      name: 'Admin',
      email: 'admin@email.com',
      password: '123456',
      isAdmin: true,
    })

    const createdAdmin = await admin.save()
    const adminUuid = createdAdmin._id

    //creating of 19 users
    for (let i = 1; i < 20; i++) {
      const name = faker.name.findName()
      const email = (name + '@email.com').split(' ').join('')

      const user = new User({
        name,
        email: email.toLowerCase(),
        password: '123456',
      })

      const createdUser = await user.save()
      const userUuid = createdUser._id
      userUuids.push(userUuid)
    }

    //creating categories
    const categoriesArray = [
      'Literary',
      'Historical',
      'Westerns',
      'Trillers',
      'Science & Technology',
      'Personal Memories',
      'Humorous',
      'Essays',
      'Fantastic',
      'Family Life',
    ]

    const categories = []

    //creation of (categoriesArray.lenght) categories
    for (const element of categoriesArray) {
      const category = new Category({
        name: element,
        user: adminUuid,
      })

      const createdCategory = await category.save()
      categories.push(createdCategory)
      //const categoryName = createdCategory.name
      //console.log(`Created category with name ${categoryName}`)
    }

    const bookUuids = []

    //creation of (names.lenght) books
    for (const [x, value] of names.entries()) {
      const reviews = []

      //creation of 19 reviews
      for (let i = 1; i < 20; i++) {
        const randomUser = await User.findById(
          userUuids[Math.floor(Math.random() * userUuids.length)]
        )

        const alreadyReviewed = reviews.find(
          (r) => r.user.toString() === randomUser._id.toString()
        )

        const rating = [1, 2, 3, 4, 5]

        if (!alreadyReviewed) {
          const userRating = faker.random.arrayElement(rating)

          const userReview = {
            name: randomUser.name,
            rating: userRating,
            comment: faker.lorem.paragraph(),
            user: randomUser._id,
          }
          reviews.push(userReview)
        }
      }

      const bookRating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

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
      const typeArr = ['Hardcover', 'Paperback']

      const image =
        x + 1 < 10
          ? `/uploads\\\\image-161038224290${x + 1}.jpg`
          : `/uploads\\\\image-16103822429${x + 1}.jpg`

      const book = new Book({
        user: adminUuid,
        name: value,
        price: faker.random.float({
          min: 10,
          max: 50,
        }),
        description: faker.lorem.paragraphs(),
        image,
        publisher: faker.company.companyName(),
        publish_date: moment(faker.date.past()).format('LL'),
        pages: faker.random.number({
          min: 150,
          max: 500,
        }),
        dimensions: dimArr[Math.floor(Math.random() * dimArr.length)],
        language: 'English',
        type: typeArr[Math.floor(Math.random() * typeArr.length)],
        ean_upc: faker.random.number({
          min: 978000000000,
          max: 978999999999,
        }),
        categories: _.sampleSize(
          categories,
          faker.random.number({
            min: 1,
            max: 3,
          })
        ),
        reviews,
        countInStock: faker.random.number({
          min: 5,
          max: 45,
        }),
        rating: bookRating,
        numReviews: reviews.length,
      })

      const createdBook = await book.save()
      const createdBookUuid = createdBook._id
      bookUuids.push(createdBookUuid)
      //console.log(`Created book with uuid ${createdBookUuid}`)
    }

    //creating of 10 orders
    for (let i = 1; i < 11; i++) {
      const randomUser = await User.findById(
        userUuids[Math.floor(Math.random() * userUuids.length)]
      )

      const randUserUuid = randomUser._id

      const orderItems = []

      const randomBookUuids = _.sampleSize(
        bookUuids,
        faker.random.number({
          min: 1,
          max: 4,
        })
      )

      for (const value of randomBookUuids) {
        const book = await Book.findById(value).select('name image price')

        const bookInOrder = {
          product: book._id,
          name: book.name,
          image: book.image,
          price: book.price,
          qty: faker.random.number({
            min: 1,
            max: 4,
          }),
        }
        orderItems.push(bookInOrder)
      }

      const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
      }

      const itemsPrice = addDecimals(
        orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      )
      const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100)
      const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)))
      const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
      ).toFixed(2)

      const pastDate = faker.date.past(5, new Date())

      const isPaid = faker.random.boolean()

      const paidAt = isPaid
        ? new Date(pastDate.getTime() + 2 * 60000)
        : undefined

      const isDelivered = isPaid ? faker.random.boolean() : false

      const deliveredDate = new Date(pastDate)

      const methods = ['PayPal', 'Stripe']

      const paymentMethod = methods[Math.floor(Math.random() * methods.length)]

      deliveredDate.setDate(
        pastDate.getDate() +
          faker.random.number({
            min: 2,
            max: 6,
          })
      )

      const deliveredAt = isDelivered ? deliveredDate : undefined

      const paymentResult = isPaid
        ? {
            id: faker.vehicle.vin(),
            status: paymentMethod === 'PayPal' ? 'COMPLETED' : 'SUCCEEDED',
            update_time: paidAt,
            email_address: randomUser.email,
          }
        : undefined

      const randomCountry = faker.address.country()

      const order = new Order({
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        isDelivered,
        deliveredAt,
        orderItems,
        user: randUserUuid,
        shippingAddress: {
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          postalCode: faker.address.zipCodeByState(),
          country:
            paymentMethod === 'Stripe'
              ? countries.getAlpha2Code(randomCountry, 'en')
                ? countries.getAlpha2Code(randomCountry, 'en')
                : 'US'
              : randomCountry,
        },
        paymentMethod,
        createdAt: pastDate,
        updatedAt: pastDate,
        paidAt,
        paymentResult,
      })

      const createdOrder = await order.save()
    }

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Book.deleteMany()
    await User.deleteMany()
    await Category.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
