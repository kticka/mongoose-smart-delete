const mongoose    = require('mongoose')
const withDeleted = require('./withDeleted')

const softDelete = require('./softDelete')

const deleteMany       = mongoose.Model.deleteMany
const deleteOne        = mongoose.Model.deleteOne
const findOneAndDelete = mongoose.Model.findOneAndDelete

mongoose.Model.deleteOne = function (condition, options) {
  if (this.schema._useSoftDelete && !options?.callOriginalMethod) {
    return softDelete.call(this, 'deleteOne', condition, options)
  }
  return deleteOne.call(this, condition, options)
}

mongoose.Model.deleteMany = function (condition, options) {
  if (this.schema._useSoftDelete && !options?.callOriginalMethod) {
    return softDelete.call(this, 'deleteMany', condition, options)
  }
  return deleteMany.call(this, condition, options)
}

mongoose.Model.findOneAndDelete = function (condition, options) {
  if (this.schema._useSoftDelete && !options?.callOriginalMethod) {

    return softDelete.call(this, 'findOneAndDelete', condition, options)
  }
  return findOneAndDelete.call(this, condition, options)
}

mongoose.Model.restoreOne = function (condition, options) {
  if (this.schema._useSoftDelete) {
    return softDelete.call(this, 'restoreOne', condition, options)
  }
}

mongoose.Model.restoreMany = function (condition, options) {
  if (this.schema._useSoftDelete) {
    return softDelete.call(this, 'restoreMany', condition, options)
  }
}

mongoose.Document.prototype.restoreOne = function (options = {}) {
  return softDelete.call(this, 'restoreOne', {}, options)
}

mongoose.Document.prototype.deleteOne = function (options = {}) {
  return softDelete.call(this, 'deleteOne', {}, options)
}

mongoose.Aggregate.prototype.withDeleted = withDeleted

module.exports = function (schema) {
  schema._useSoftDelete = true
  schema.query.withDeleted = withDeleted
}