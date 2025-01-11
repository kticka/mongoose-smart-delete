const Mongoose = require('mongoose')

module.exports = function (schema = {}, options = {}) {

  let Schema

  if (schema instanceof Mongoose.Schema) {
    Schema = schema
  } else {
    Schema = new Mongoose.Schema(schema)
  }

  Schema.plugin(require('../../src'), options)
  const modelName = `TestModel_${new Mongoose.Types.ObjectId()}`
  return Mongoose.model(modelName, Schema)
}