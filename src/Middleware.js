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
      this.where({deleted: {$ne: true}})
    }
    next()
  })

  schema.pre('aggregate', function (next) {
    if (!this.options?.withDeleted) {
      if (!this.pipeline().some(stage => stage.$match?.deleted !== undefined)) {
        this.pipeline().unshift({$match: {deleted: {$ne: true}}})
      }
    }
    next()
  })

  schema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], {document: false, query: true}, function (next) {
    if (this.$isSoftDelete) {
      const update = this.getUpdate()
      update.$set  = {
        deleted: true
      }
      if (config.deletedAt) update.$set.deletedAt = new Date()
      this.setUpdate(update)
      console.log(update)
    }
    next()
  })

  schema.pre(['restoreOne', 'restoreMany'], {document: false, query: true}, function (next) {
    if (this.$isSoftDelete) {
      const update  = this.getUpdate()
      update.$unset = {
        deleted:   true,
        deletedAt: true,
      }
      this.setUpdate(update)
      console.log(update)
    }
    next()
  })


}