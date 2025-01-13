const Schema     = require('./Schema')
const Methods    = require('./Methods')
const Middleware = require('./Middleware')

module.exports = function (schema, options = {}) {

  const config = {}

  config.deleted       = {}
  config.deleted.field = typeof options.deleted?.field === 'string' ? options.deleted?.field : 'deleted'
  config.deleted.unset = typeof options.deleted?.unset === 'boolean' ? options.deleted?.unset : true


  if (options.deletedAt) {
    config.deletedAt       = {}
    config.deletedAt.field = typeof options.deletedAt.field === 'string' ? options.deletedAt.field : 'deletedAt'
  }

  if (options.deletedBy) {
    if (typeof options.deletedBy.ref !== 'string') throw new Error('deletedBy.ref is required')

    config.deletedBy       = {}
    config.deletedBy.field = typeof options.deletedBy.field === 'string' ? options.deletedBy.field : 'deletedBy'
    config.deletedBy.ref   = options.deletedBy.ref
  }

  Schema(schema, config)
  Middleware(schema, config)
  Methods(schema)
}