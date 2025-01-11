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

module.exports = function (schema) {
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
}