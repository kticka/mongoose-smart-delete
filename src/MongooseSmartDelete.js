const Mongoose  = require('mongoose')
const Kareem    = require('kareem')
const Methods = {}
class MongooseSmartDelete {

  constructor(context) {
    this.context   = context
    this._op       = null
    this._updateOp = null
  }

  modelDeleteOne(query = {}, options = {}) {
    options.softDelete = this._useSoftDelete(options)
    if (!options.softDelete) {
      return Methods.Model.deleteOne.call(this.context, query, options)
    }
    this._op       = 'deleteOne'
    this._updateOp = 'updateOne'
    return this.query(query, options)
  }

  documentDeleteOne(options = {}) {
    options.softDelete = this._useSoftDelete(options)
    if (!options.softDelete) {
      return Methods.Document.deleteOne.call(this.context, options)
    }
    this._op       = 'deleteOne'
    this._updateOp = 'updateOne'
    return this.query({}, options)
  }

  documentRestoreOne(options = {}) {
    this._op       = 'restoreOne'
    this._updateOp = 'updateOne'
    return this.query({}, options)
  }

  modelRestoreOne(query = {}, options = {}) {
    this._op       = 'restoreOne'
    this._updateOp = 'updateOne'
    return this.query(query, options)
  }

  deleteMany(query = {}, options = {}) {
    options.softDelete = this._useSoftDelete(options)

    if (!options.softDelete) {
      return Methods.Model.deleteMany.call(this.context, query, options)
    }
    this._op       = 'deleteMany'
    this._updateOp = 'updateMany'
    return this.query(query, options)
  }

  findOneAndDelete(query = {}, options = {}) {
    options.softDelete = this._useSoftDelete(options)
    if (!options.softDelete) {
      return Methods.Model.findOneAndDelete.call(this.context, query, options)
    }
    this._op       = 'findOneAndDelete'
    this._updateOp = 'findOneAndUpdate'
    return this.query(query, options)
  }


  restoreMany(query = {}, options = {}) {
    this._op       = 'restoreMany'
    this._updateOp = 'updateMany'
    return this.query(query, options)
  }

  _useSoftDelete(options = {}) {
    return this.context.schema._smartDelete && options.softDelete !== false
  }

  query() {
    const query = this.context[this._updateOp].apply(this.context, arguments)

    const queryMiddleware = new Kareem()

    if (query._queryMiddleware._pres?.has(this._op)) queryMiddleware._pres.set(this._updateOp, query._queryMiddleware._pres.get(this._op))
    if (query._queryMiddleware._posts?.has(this._op)) queryMiddleware._posts.set(this._updateOp, query._queryMiddleware._posts.get(this._op))

    query._queryMiddleware = queryMiddleware

    if (this.context instanceof Mongoose.Document) {
      // Replace document updateOne hooks with <deleteOp> hooks
      query._hooks._pres.set('exec', [])
      query._hooks._posts.set('exec', [])

      const self = this.context
      const op   = this._op
      query.pre(function queryPreSoftDeleteUpdateOne(cb) {
        self.constructor._middleware.execPre(op, self, [query.getOptions()], cb)
      })

      query.post(function queryPostSoftDeleteUpdateOne(cb) {
        self.constructor._middleware.execPost(op, self, [query.getOptions()], {}, cb)
      })
    }
    return query
  }

  static setOriginalMethods(methods) {
    Object.assign(Methods, methods)
  }
}

module.exports = MongooseSmartDelete