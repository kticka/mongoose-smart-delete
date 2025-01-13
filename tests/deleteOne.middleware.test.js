const Mongoose    = require('mongoose')
const createModel = require('./setup/createModel')
describe('SoftDelete - deleteOne middleware', () => {

  let Model, Document, TriggeredHooks = {}

  beforeAll(async () => {
    const Schema = Mongoose.Schema({})
    Schema.pre('deleteOne', {document: true, query: true}, function (next) {
      TriggeredHooks.preDeleteOne = true
      next()
    })

    Schema.post('deleteOne', {document: true, query: true}, function (doc, next) {
      TriggeredHooks.postDeleteOne = true
      next()
    })

    Schema.pre('updateOne', {document: true, query: true}, function (next) {
      TriggeredHooks.preUpdateOne = true
      next()
    })

    Schema.post('updateOne', {document: true, query: true}, function () {
      TriggeredHooks.postUpdateOne = true
    })

    Model = createModel(Schema)
  })

  beforeEach(async () => {
    Document = await Model.create({name: 'TestDocument'})
  })

  afterEach(async () => {
    TriggeredHooks = {}
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Document.deleteOne should trigger pre hook', async () => {
    await Document.deleteOne()
    expect(TriggeredHooks.preDeleteOne).toBe(true)
    expect(TriggeredHooks.preUpdateOne).not.toBe(true)
  })

  it('Document.deleteOne should trigger post hook', async () => {
    await Document.deleteOne()
    expect(TriggeredHooks.postDeleteOne).toBe(true)
    expect(TriggeredHooks.postUpdateOne).not.toBe(true)
  })

  it('Model.deleteOne should trigger pre and pre hook', async () => {
    await Model.deleteOne({_id: Document._id})
    expect(TriggeredHooks.preDeleteOne).toBe(true)
    expect(TriggeredHooks.preUpdateOne).not.toBe(true)
  })

  it('Model.deleteOne should trigger pre and post hook', async () => {
    await Model.deleteOne({_id: Document._id})
    expect(TriggeredHooks.postDeleteOne).toBe(true)
    expect(TriggeredHooks.postUpdateOne).not.toBe(true)
  })
})