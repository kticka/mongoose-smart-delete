const mongoose         = require('mongoose')
const restoreOne       = require('./restoreOne')
const restoreMany      = require('./restoreMany')
const withDeleted      = require('./withDeleted')

const softDelete = require('./softDelete')

mongoose.Aggregate.prototype.withDeleted = withDeleted

module.exports = function (schema) {
  schema.method('deleteOne', function (options) {
    return softDelete.call(this, 'deleteOne', {}, options)
  })

  schema.static('deleteOne', function (query, options) {
    return softDelete.call(this, 'deleteOne', query, options)
  })

  schema.static('deleteMany', function (query, options) {
    return softDelete.call(this, 'deleteMany', query, options)
  })

  schema.static('findOneAndDelete', function (query, options) {
    return softDelete.call(this, 'findOneAndDelete', query, options)
  })

  schema.method('restoreOne', restoreOne)
  schema.static('restoreOne', restoreOne)
  schema.static('restoreMany', restoreMany)

  schema.query.withDeleted = withDeleted
}