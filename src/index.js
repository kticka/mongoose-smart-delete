require('./injectMethods')
const injectSchema     = require('./injectSchema')
const injectMiddleware = require('./injectMiddleware')

module.exports = function (schema, options = {}) {

  const config = {}

  config.deleted       = {}
  config.deleted.field = typeof options.deleted?.field === 'string' ? options.deleted?.field : 'deleted'

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

  config.mode = ['strict', '$ne'].indexOf(options.mode) > -1 ? options.mode : '$ne'

  schema._smartDelete = true

  injectSchema(schema, config)
  injectMiddleware(schema, config)
}