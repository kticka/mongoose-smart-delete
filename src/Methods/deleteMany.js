const mongoose   = require('mongoose')
const execHooks  = require('./execHooks')
const deleteMany = mongoose.Model.deleteMany

module.exports = function (query = {}, options = {}) {
  if (options.softDelete === false) {
    return deleteMany.call(this, query, options)
  }
  return execHooks.call(this, 'deleteMany', this.collection.updateMany(query, {$set: {deleted: true}}))
}
