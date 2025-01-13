const Mongoose = require('mongoose')
const Kareem   = require('kareem')

const operations = {
  deleteOne:        'updateOne',
  deleteMany:       'updateMany',
  findOneAndDelete: 'findOneAndUpdate',
  restoreOne:       'updateOne',
  restoreMany:      'updateMany'
}

module.exports = async function (deleteOp, query = {}, options = {}) {
  if (!operations[deleteOp]) {
    throw new Error(`Invalid delete operation: ${deleteOp}`)
  }

  const isDocument = this instanceof Mongoose.Document
  const updateOp   = operations[deleteOp]
  const context    = isDocument ? this.constructor : this

  if (options.softDelete === false) {
    // Perform a hard delete if softDelete is explicitly disabled
    options.callOriginalMethod = true
    return Mongoose.Model[deleteOp].call(context, query, options)
  }

  options.softDelete = true

  // Create empty update operation which later will be filled in middleware
  const q = isDocument ? this.updateOne(options) : context[updateOp](query, {})
  q.setOptions(options)

  // Move query level hooks so they are executed automatically
  const queryMiddleware = new Kareem()

  if (q._queryMiddleware._pres?.has(deleteOp)) queryMiddleware._pres.set(updateOp, q._queryMiddleware._pres.get(deleteOp))
  if (q._queryMiddleware._posts?.has(deleteOp)) queryMiddleware._posts.set(updateOp, q._queryMiddleware._posts.get(deleteOp))

  q._queryMiddleware = queryMiddleware

  if (isDocument) {
    // Replace document updateOne hooks with <deleteOp> hooks
    q._hooks._pres.set('exec', [])
    q._hooks._posts.set('exec', [])

    const self = this
    q.pre(function queryPreSoftDeleteUpdateOne(cb) {
      self.constructor._middleware.execPre(deleteOp, self, [options], cb)
    })

    q.post(function queryPostSoftDeleteUpdateOne(cb) {
      self.constructor._middleware.execPost(deleteOp, self, [options], {}, cb)
    })
  }

  return q
}