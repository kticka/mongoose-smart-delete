const Mongoose    = require('mongoose')
const createModel = require('./setup/createModel')
describe('SoftDelete - deleteMany middleware', () => {

  let Model, TriggeredHooks = {}

  beforeAll(async () => {
    const Schema = Mongoose.Schema({})
    Schema.pre('deleteMany', {document: true, query: false}, function (next) {
      TriggeredHooks.preDeleteMany = true
      next()
    })

    Schema.post('deleteMany', {document: true, query: false}, function (doc, next) {
      TriggeredHooks.postDeleteMany = true
      next()
    })

    Model = createModel(Schema)
  })

  beforeEach(async () => {
    const objects = Array.from({length: 10}, (_, index) => ({num: index + 1}))
    await Model.insertMany(objects)
  })

  afterEach(async () => {
    TriggeredHooks = {}
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Model.deleteMany should trigger pre hook', async () => {
    await Model.deleteMany({num: {$lte: 5}})
    expect(TriggeredHooks.preDeleteMany).toBe(true)
  })

  it('Model.deleteMany should trigger post hook', async () => {
    await Model.deleteMany({num: {$lte: 5}})
    expect(TriggeredHooks.postDeleteMany).toBe(true)
  })
})