const mongoose  = require('mongoose')
const execHooks = require('./execHooks')
const findOneAndDelete = mongoose.Model.deleteOne

module.exports = function (query = {}, options = {}) {
  if (options.softDelete === false) {
    return findOneAndDelete.call(this, query, options)
  }
  return execHooks.call(this, 'findOneAndDelete', this.collection.findOneAndUpdate(query, {$set: {deleted: true}}))
}