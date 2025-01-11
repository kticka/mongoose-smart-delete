module.exports = function (withDeleted = true) {
  this.options             = this.options || {}
  this.options.withDeleted = withDeleted
  return this
}