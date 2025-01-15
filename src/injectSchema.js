const mongoose = require('mongoose')
module.exports = function (schema, config) {

  schema.add({
    [config.deleted.field]: {
      type:  Boolean,
      index: true
    }
  })

  if (config.deletedAt) {
    schema.add({
      [config.deletedAt.field]: {
        type: Date
      }
    })
  }

  if (config.deletedBy) {
    schema.add({
      [config.deletedBy.field]: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  config.deletedBy.ref,
        index: true
      }
    })
  }
}
