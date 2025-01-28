const mongoose = require('mongoose')
module.exports = function (schema, config) {

  const deletedField = {
    type:  Boolean,
    index: true
  }

  if (config.mode === 'strict') {
    deletedField.default = false
  }

  schema.add({
    [config.deleted.field]: deletedField
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
        type:  mongoose.Schema.Types.ObjectId,
        ref:   config.deletedBy.ref,
        index: true
      }
    })
  }
}
