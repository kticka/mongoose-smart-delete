const Mongoose   = require('mongoose')
const SoftDelete = require('../../src')

module.exports   = function (schema = {}, config = {}) {

  let Schema

  if (schema instanceof Mongoose.Schema) {
    Schema = schema
  } else {
    Schema = new Mongoose.Schema(schema)
  }

  Schema.plugin(SoftDelete, config)
  const modelName = `TestModel_${new Mongoose.Types.ObjectId()}`
  return Mongoose.model(modelName, Schema)
}