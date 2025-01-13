const Mongoose = require('mongoose')
const Kareem   = require('kareem')

const operations = {
  deleteOne:        'updateOne',
  deleteMany:       'updateMany',
  findOneAndDelete: 'findOneAndUpdate'
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
    return Mongoose.Model[deleteOp].call(context, query, options)
  }

  const q = isDocument ? this.updateOne({$set: {deleted: true}}) : context[updateOp](query, {$set: {deleted: true}})

  // Remove soft delete flag after the operation is executed and all hooks are called
  q.post(function() {
    delete this.$isSoftDelete
    delete q.$isSoftDelete
  })

  // Move delete hooks to update hooks so they are executed automatically
  if (isDocument) {
    const modelMiddleware = new Kareem()
    if (this.constructor._middleware._pres?.has(deleteOp)) modelMiddleware._pres.set(updateOp, this.constructor._middleware._pres.get(deleteOp))
    if (this.constructor._middleware._posts?.has(deleteOp)) modelMiddleware._posts.set(updateOp, this.constructor._middleware._posts.get(deleteOp))
    this.constructor._middleware = modelMiddleware
    this.$isSoftDelete           = true
  }

  const queryMiddleware = new Kareem()
  if (q._queryMiddleware._pres?.has(deleteOp)) queryMiddleware._pres.set(updateOp, q._queryMiddleware._pres.get(deleteOp))
  if (q._queryMiddleware._posts?.has(deleteOp)) queryMiddleware._posts.set(updateOp, q._queryMiddleware._posts.get(deleteOp))
  q._queryMiddleware = queryMiddleware
  q.$isSoftDelete    = true
  return q
}