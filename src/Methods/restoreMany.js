const mongoose  = require('mongoose')
const execHooks = require('./execHooks')

module.exports = function () {
  let context, query

  if (this instanceof mongoose.Model) {
    context = this.model()
    query   = {_id: this._id}
  } else {
    context       = this
    query         = arguments[0] || {}
    query.deleted = true
  }

  return execHooks.call(this, 'restoreOne', context.collection.updateMany(query, {$unset: {deleted: false}}))
}