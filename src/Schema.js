const mongoose = require('mongoose')
module.exports = function (schema, options = {}) {

  options = Object.assign({
    deletedAt: true,
    deletedBy: false
  }, options)

  schema.add({
    deleted: {
      type:    Boolean
    }
  })

  if (options.deletedAt) {
    schema.add({
      deletedAt: {
        type: Date
      }
    })
  }
}
