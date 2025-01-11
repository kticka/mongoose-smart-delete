const Schema     = require('./Schema')
const Methods    = require('./Methods')
const Middleware = require('./Middleware')

module.exports = function (schema, options = {}) {

  options = Object.assign({
    deletedAt: true,
    deletedBy: false
  }, options)

  Schema(schema, options)
  Methods(schema, options)
  Middleware(schema, options)
}