const mongoose         = require('mongoose')
const deleteOne        = require('./deleteOne')
const deleteMany       = require('./deleteMany')
const findOneAndDelete = require('./findOneAndDelete')
const restoreOne       = require('./restoreOne')
const restoreMany      = require('./restoreMany')
const withDeleted      = require('./withDeleted')

mongoose.Aggregate.prototype.withDeleted = withDeleted

module.exports = function (schema) {
  schema.method('deleteOne', deleteOne)
  schema.static('deleteOne', deleteOne)
  schema.static('deleteMany', deleteMany)
  schema.static('findOneAndDelete', findOneAndDelete)

  schema.method('restoreOne', restoreOne)
  schema.static('restoreOne', restoreOne)
  schema.static('restoreMany', restoreMany)

  schema.query.withDeleted = withDeleted
}