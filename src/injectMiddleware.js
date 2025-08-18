const mongoose = require('mongoose')

const queries = [
  'find',
  'findOne',
  'findOneAndUpdate',
  'findOneAndReplace',
  'update',
  'updateOne',
  'updateMany',
  'replaceOne',
  'distinct',
  'deleteOne',
  'deleteMany',
  'findOneAndDelete',
  'countDocuments',
  // backwards compatibility
  'count'
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
      const query = this.getQuery()
      if (query[config.deleted.field] === undefined) {
        this.where(getWhereConditions(config))
      }
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
    const options = this.getOptions()
    if (options.softDelete !== false) {
      // Only update non-deleted documents
      this.where(getWhereConditions(config))

      const update = this.getUpdate()

      update.$set = {
        [config.deleted.field]: true
      }

      if (config.deletedAt) update.$set[config.deletedAt.field] = new Date()
      if (config.deletedBy) update.$set[config.deletedBy.field] = this.options.deletedBy


      if (config.deletionId) {
        this.options.deletionId ??= new mongoose.Types.ObjectId()
        update.$set[config.deletionId.field] = this.options.deletionId
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
      if (config.deletionId) update.$unset[config.deletionId.field] = true
      this.setUpdate(update)
      next()
    }
  )

  schema.post(['deleteOne', 'deleteMany'], {document: false, query: true}, function (data, next) {
    if (this.getOptions().softDelete !== false) {
      data.deletedCount = data.modifiedCount
    }
    next()
  })

  schema.post(['restoreOne', 'restoreMany'], {document: false, query: true}, function (data, next) {
    data.restoredCount = data.modifiedCount
    next()
  })

  schema.post(['deleteOne', 'deleteMany', 'restoreOne', 'restoreMany'], {document: false, query: true}, function (data, next) {
    if (this.getOptions().softDelete !== false) {
      delete data.matchedCount
      delete data.upsertedId
      delete data.upsertedCount
      delete data.modifiedCount
    }
    next()
  })
}