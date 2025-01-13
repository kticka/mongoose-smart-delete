const queries = [
  'find',
  'findOne',
  'findOneAndUpdate',
  'findOneAndReplace',
  'update',
  'updateOne',
  'updateMany',
  'replaceOne',
  'countDocuments'
]

module.exports = function (schema, config) {
  schema.pre(queries, function (next) {
    if (!this.options?.withDeleted) {
      this.where({[config.deleted.field]: {$ne: true}})
    }
    next()
  })

  schema.pre('aggregate', function (next) {
    if (!this.options?.withDeleted) {
      if (!this.pipeline().some(stage => stage.$match?.[config.deleted.field] !== undefined)) {
        this.pipeline().unshift({$match: {[config.deleted.field]: {$ne: true}}})
      }
    }
    next()
  })

  schema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], {document: false, query: true}, function (next) {
    if (this.getOptions().softDelete !== false) {
      const update = this.getUpdate()
      update.$set  = {
        [config.deleted.field]: true
      }
      if (config.deletedAt) update.$set[config.deletedAt.field] = new Date()
      if (config.deletedBy) {
        update.$set[config.deletedBy.field] = this.getOptions().deletedBy
      }
      this.setUpdate(update)
    }
    next()
  })

  schema.pre(['restoreOne', 'restoreMany'], {document: false, query: true}, function (next) {
    if (this.getOptions().softDelete !== false) {
      const update  = this.getUpdate()
      update.$unset = {
        [config.deleted.field]: true,
      }

      if (config.deletedAt) update.$unset[config.deletedAt.field] = true
      if (config.deletedBy) update.$unset[config.deletedBy.field] = true

      this.setUpdate(update)
    }
    next()
  })


}