const mongoose            = require('mongoose')
const MongooseSmartDelete = require('./MongooseSmartDelete')

MongooseSmartDelete.setOriginalMethods({
  Model:             {
    deleteOne:        mongoose.Model.deleteOne,
    deleteMany:       mongoose.Model.deleteMany,
    findOneAndDelete: mongoose.Model.findOneAndDelete
  },
  Document:          {
    deleteOne: mongoose.Model.prototype.deleteOne
  }
})

mongoose.Model.deleteOne = function () {
  return new MongooseSmartDelete(this).modelDeleteOne(...arguments)
}

mongoose.Model.prototype.deleteOne = function () {
  return new MongooseSmartDelete(this).documentDeleteOne(...arguments)
}

mongoose.Model.restoreOne = function () {
  return new MongooseSmartDelete(this).modelRestoreOne(...arguments)
}

mongoose.Document.prototype.restoreOne = function () {
  return new MongooseSmartDelete(this).documentRestoreOne(...arguments)
}

mongoose.Model.deleteMany = function () {
  return new MongooseSmartDelete(this).deleteMany(...arguments)
}

mongoose.Model.restoreMany = function () {
  return new MongooseSmartDelete(this).restoreMany(...arguments)
}

mongoose.Model.findOneAndDelete = function () {
  return new MongooseSmartDelete(this).findOneAndDelete(...arguments)
}

const withDeleted = function (enable = true) {
  this.options             = this.options || {}
  this.options.withDeleted = enable
  return this
}

mongoose.Aggregate.prototype.withDeleted = withDeleted
mongoose.Query.prototype.withDeleted     = withDeleted
