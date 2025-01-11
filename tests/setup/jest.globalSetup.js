const MongoDB  = require('mongodb-memory-server')
const Mongoose = require('mongoose')

global.Model = function (schema = {}, options = {}) {

  let Schema

  if (schema instanceof Mongoose.Schema) {
    Schema = schema
  } else {
    Schema = new global.Mongoose.Schema(schema)
  }

  Schema.plugin(require('../../src'), options)
  const modelName = `TestModel_${new Mongoose.Types.ObjectId()}`
  return global.Mongoose.model(modelName, Schema)
}

module.exports = async function () {
  global.Mongod   = await MongoDB.MongoMemoryServer.create()
  global.Mongoose = await Mongoose.connect(global.Mongod.getUri())
}