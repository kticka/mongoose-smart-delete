const Mongoose = require('mongoose')

beforeAll(async () => {
  await Mongoose.connect('mongodb://localhost:27017/')
})

afterAll(async () => {
  await Mongoose.disconnect()
})