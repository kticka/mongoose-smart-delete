const mongoose = require('mongoose')
module.exports = function (schema, options = {}) {

  options = Object.assign({
    deletedAt: true,
    deletedBy: false
  }, options)

  schema.add({
    deleted: {
      type:    Boolean,
      default: false
    }
  })

  if (options.deletedAt) {
    schema.add({
      deletedAt: {
        type: Date
      }
    })
  }

  if (options.deletedBy) {
    schema.add({
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  options.deletedBy
      }
    })
  }
}
