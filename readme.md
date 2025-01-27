# Mongoose Smart Delete

[![Node.js CI](https://github.com/kticka/mongoose-smart-delete/actions/workflows/test.yml/badge.svg)](https://github.com/kticka/mongoose-smart-delete/actions/workflows/test.yml)

The mongoose-smart-delete plugin seamlessly integrates soft delete functionality into your Mongoose models by overriding default methods like deleteOne, deleteMany, and findOneAndDelete. It also extends query methods such as find, findOne, and more, ensuring compatibility with your existing system
without requiring changes to your code. When applied to a model, default delete operations automatically perform soft deletes, providing a smooth transition to using the plugin.

This plugin leverages the same Mongoose hooks (pre and post) for delete operations like deleteOne and deleteMany, making it easy to retain existing behaviors. Additionally, it introduces custom hooks like restoreOne and restoreMany for handling restore operations.

Highly customizable, the plugin allows you to define custom field names for properties such as deleted, deletedAt, and deletedBy. You can also use hooks to modify or extend the default behavior, making it a flexible and lightweight solution for managing soft deletes in your application.

# Documentation

- [Installation](#installation)
- [Usage](#usage)
    - [Options](#options)
        - [deleted](#deleted-optional)
        - [deletedAt](#deletedat-optional)
        - [deletedBy](#deletedby-optional)
- [Delete](#delete)
    - [Document.deleteOne()](#documentdeleteone)
    - [Model.deleteOne()](#modeldeleteone)
    - [Model.deleteMany()](#modeldeletemany)
    - [Model.findOneAndDelete()](#modelfindoneanddelete)
    - [Model.findByIdAndDelete()](#modelfindbyidanddelete)
    - [Delete Hooks](#delete-hooks)
- [Restore](#restore)
    - [Document.restoreOne()](#documentrestoreone)
    - [Model.restoreOne()](#modelrestoreone)
    - [Model.restoreMany()](#modelrestoremany)
    - [Restore Hooks](#restore-hooks)
- [Queries](#queries)
    - [Model.find()](#modelfind)
    - [Model.findOne()](#modelfindone)
    - [Model.findOneAndUpdate()](#modelfindoneandupdate)
    - [Model.findOneAndReplace()](#modelfindoneandreplace)
    - [Model.updateOne()](#modelupdateone)
    - [Model.updateMany()](#modelupdatemany)
    - [Model.replaceOne()](#modelreplaceone)
    - [Model.countDocuments()](#modelcountdocuments)

## Installation

Install the package using npm:

```
npm install mongoose-smart-delete
```

## Usage

Import the package and apply it as a plugin to your schema:

```javascript
const Mongoose            = require('mongoose')
const MongooseSmartDelete = require('mongoose-smart-delete')

const Schema = new Mongoose.Schema({})
Schema.plugin(MongooseSmartDelete)
const Model = Mongoose.model('Model', Schema)

const Document = await Model.create({})
return Document.deleteOne()
```

## Options

### `deleted` (optional)

Sets the field name for the soft delete flag.

```javascript
Schema.plugin(MongooseSmartDelete, {
  deleted: {
    field: 'deleted',
  },
});
```

### `deletedAt` (optional)

Sets the field name for the deletion timestamp.

- For default behavior:

```javascript
Schema.plugin(MongooseSmartDelete, {
  deletedAt: true,
});
```

- To specify a custom field:

```javascript
Schema.plugin(MongooseSmartDelete, {
  deletedAt: {
    field: 'deletedAt',
  },
});
```

### `deletedBy` (optional)

Tracks the user who deleted the document.

- `deletedBy.field (optional)`: Sets the field name for the user reference.
- `deletedBy.ref (required)`: Sets the reference model for the user.

Example:

```javascript
const Mongoose            = require('mongoose')
const MongooseSmartDelete = require('mongoose-smart-delete')

const UserSchema     = new Mongoose.Schema({})
const DocumentSchema = new Mongoose.Schema({})

DocumentSchema.plugin(MongooseSmartDelete, {
  deletedBy: {
    field: 'deletedBy',
    ref: 'User',
  },
})

const UserModel     = Mongoose.model('User', UserSchema)
const DocumentModel = Mongoose.model('Document', DocumentSchema)

const User     = await UserModel.create({})
const Document = await DocumentModel.create({})

await Document.deleteOne({deletedBy: User})

```

## Delete

### Document.deleteOne()

Soft delete a document instance:

```javascript
Document.deleteOne();
```

Hard delete a document instance:

```javascript
Document.deleteOne({softDelete: false});
```

### Model.deleteOne()

Soft delete a single document:

```javascript
Model.deleteOne(query);
```

Hard delete a single document:

```javascript
Model.deleteOne(query, {softDelete: false});
```

### Model.findOneAndDelete()

Soft delete:
```javascript
Model.findOneAndDelete(query);
```

Hard delete:
```javascript
Model.findOneAndDelete(query, {softDelete: false});
```

### Model.findByIdAndDelete()
Soft delete:
```javascript
Model.findByIdAndDelete(id);
```

Hard delete:
```javascript
Model.findByIdAndDelete(id, {softDelete: false});
```

### Model.deleteMany()

Soft delete multiple documents:

```javascript
Model.deleteMany(query);
```

Hard delete multiple documents:

```javascript
Model.deleteMany(query, {softDelete: false});
```

### Delete Hooks

Use hooks to execute code before or after a delete operation.

#### deleteOne Hooks

Document-level hooks:\
In document level hook, you can use `options.softDelete` to determine if the operation is a soft delete or hard delete.\
In pre hook, options are passed as second argument. In post - as first.


```javascript
schema.pre('deleteOne', {document: true, query: false}, function (next, options) {
  if (options.softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
  next()
})

schema.post('deleteOne', function (options, next) {
  if (options.softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
})
```

Query-level hooks:\
In query level hook, you can use `this.getOptions().softDelete` to determine if the operation is a soft delete or hard delete.
```javascript
schema.pre('deleteOne', {query: true}, function (next) {
  if (this.getOptions().softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
  next()
})

schema.post('deleteOne', {query: true}, function (result, next) {
  if (this.getOptions().softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
  next()
})
```

#### deleteMany Hooks

```javascript
schema.pre('deleteMany', function (next) {
  if (this.getOptions().softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
  next();
});

schema.post('deleteMany', function () {
  if (this.getOptions().softDelete) {
    // Code for soft delete
  } else {
    // Code for hard delete
  }
});
```

#### Real life example with custom `batchId` attribute:

```javascript
// Update batchId field when soft deleting

const Mongoose            = require('mongoose')
const MongooseSmartDelete = require('mongoose-smart-delete')

const Schema = new Mongoose.Schema({
  batchId: String
})

Schema.plugin(MongooseSmartDelete)

Schema.pre(['deleteOne', 'deleteMany'], {document: false, query: true}, function (next) {
  const options = this.getOptions()

  if (options.softDelete) {
    if (options.batchId) {
      const update        = this.getUpdate()
      update.$set.batchId = options.batchId
      this.setUpdate(update)
    }
  }
  next()
})

const Model = Mongoose.model('Model', Schema)

module.exports = async function () {
  const Document = await Model.create({})

  await Model.deleteMany({}, {batchId: '12345'})

  return Model.findOne({}).withDeleted()
}
```

## Restore

### Document.restoreOne()

Restore a document instance:

```javascript
Document.restoreOne();
```

### Model.restoreOne()

Restore a single document:

```javascript
Model.restoreOne(query);
```

### Model.restoreMany()

Restore multiple documents:

```javascript
Model.restoreMany(query);
```

### Restore Hooks

Use hooks to execute code before or after a restore operation.

#### restoreOne Hooks

```javascript
schema.pre('restoreOne', function (next) {
  // Code before restore
  next();
});

schema.post('restoreOne', function () {
  // Code after restore
});
```

#### restoreMany Hooks

```javascript
schema.pre('restoreMany', function (next) {
  // Code before restore
  next();
});

schema.post('restoreMany', function () {
  // Code after restore
});
```

## Queries

### Model.find()

Include deleted documents in results:

```javascript
Model.find({}).withDeleted();
```

### Model.findOne()

Include a deleted document in results:

```javascript
Model.findOne({}).withDeleted();
```

### Model.findOneAndUpdate()

```javascript
Model.findOneAndUpdate({}).withDeleted();
```

### Model.findOneAndReplace()

```javascript
Model.findOneAndReplace({}).withDeleted();
```

### Model.updateOne()

```javascript
Model.updateOne({}).withDeleted();
```

### Model.updateMany()

```javascript
Model.updateMany({}).withDeleted();
```

### Model.replaceOne()

```javascript
Model.replaceOne({}).withDeleted();
```

### Model.countDocuments()

```javascript
Model.countDocuments({}).withDeleted();
```

# License

The MIT License

Copyright 2025 Karolis Tička https://github.com/kticka

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





