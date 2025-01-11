const mongoose  = require('mongoose')
const execHooks = require('./execHooks')
const deleteOne = mongoose.Model.deleteOne

module.exports = function () {
  let context, query, options

  if (this instanceof mongoose.Model) {
    context = this.model()
    query   = {_id: this._id}
    options = arguments[0] || {}
  } else {
    context = this
    query   = arguments[0] || {}
    options = arguments[1] || {}
  }

  if (options.softDelete === false) {
    return deleteOne.call(context, query, options)
  }
  return execHooks.call(this, 'deleteOne', context.collection.updateOne(query, {$set: {deleted: true}}))
}