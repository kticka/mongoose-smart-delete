const queries = [
  'find',
  'findOne',
  'findOneAndUpdate',
  'findOneAndReplace',
  'update',
  'updateOne',
  'updateMany',
  'replaceOne',
  'countDocuments',
  'deleteOne',
  'deleteMany',
  'findOneAndDelete'
]

function getWhereConditions(config) {
  const field = config.deleted.field
  switch (config.mode) {
    case 'strict':
      return {[field]: false}
    default:
      return {[field]: {$ne: true}}
  }
}

module.exports = function (schema, config) {
  schema.pre(queries, function (next) {
    if (!this.options?.withDeleted) {
      this.where(getWhereConditions(config))
    }
    next()
  })

  schema.pre('aggregate', function (next) {
    if (!this.options?.withDeleted) {
      if (!this.pipeline().some(stage => stage.$match?.[config.deleted.field] !== undefined)) {
        this.pipeline().unshift({$match: getWhereConditions(config)})
      }
    }
    next()
  })

  schema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], {document: false, query: true}, function (next) {
    if (this.getOptions().softDelete !== false) {
      // Only update non-deleted documents
      this.where(getWhereConditions(config))

      const update = this.getUpdate()

      update.$set = {
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
      // Only update deleted documents
      this.where({[config.deleted.field]: true})

      const update = this.getUpdate()

      update.$unset = update.$unset || {}

      if (config.mode === 'strict') {
        update.$set = {
          [config.deleted.field]: false
        }
      } else {
        update.$unset[config.deleted.field] = true
      }

      if (config.deletedAt) update.$unset[config.deletedAt.field] = true
      if (config.deletedBy) update.$unset[config.deletedBy.field] = true
      this.setUpdate(update)
      next()
    }
  )
}