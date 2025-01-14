const Mongoose    = require('mongoose')
const createModel = require('./setup/createModel')
describe('SoftDelete - deleteOne middleware', () => {

  function setupHook(type, hook, options) {
    Schema[type](hook, options, function (v1, v2) {
      TriggeredHooks[type].push({
        hook:      hook,
        context:   this,
        arguments: arguments
      })

      return type === 'pre' ? v1() : v2()
    })
  }

  let Schema, TriggeredHooks

  beforeEach(async () => {
    Schema         = new Mongoose.Schema({})
    TriggeredHooks = {
      pre:  [],
      post: []
    }
  })

  it('Should trigger document-level pre("deleteOne") hook in document context.', async () => {
    setupHook('pre', 'deleteOne', {document: true, query: false})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne()
    expect(TriggeredHooks.pre.length).toBe(1)
    expect(TriggeredHooks.pre[0].hook).toBe('deleteOne')
    expect(TriggeredHooks.pre[0].context).toEqual(Document)
    expect(TriggeredHooks.pre[0].arguments[1].softDelete).toBe(true)
  })

  it('Should trigger document-level post("deleteOne") hook in document context.', async () => {
    setupHook('post', 'deleteOne', {document: true, query: false})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.post.length).toBe(1)
    expect(TriggeredHooks.post[0].hook).toBe('deleteOne')
    expect(TriggeredHooks.post[0].context).toEqual(Document)
    expect(TriggeredHooks.post[0].arguments[0].softDelete).toBe(true)
  })

  it('Should trigger query-level pre("deleteOne") hook in document context.', async () => {
    setupHook('pre', 'deleteOne', {document: false, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.pre.length).toBe(1)
    expect(TriggeredHooks.pre[0].hook).toBe('deleteOne')
    expect(TriggeredHooks.pre[0].context).toBeInstanceOf(Mongoose.Query)
    expect(TriggeredHooks.pre[0].context.getOptions().softDelete).toBe(true)
  })

  it('Should trigger query-level post("deleteOne") hook in document context.', async () => {
    setupHook('post', 'deleteOne', {document: false, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.post.length).toBe(1)
    expect(TriggeredHooks.post[0].hook).toBe('deleteOne')
    expect(TriggeredHooks.post[0].context).toBeInstanceOf(Mongoose.Query)
    expect(TriggeredHooks.post[0].context.getOptions().softDelete).toBe(true)
  })

  it('Should NOT trigger document-level pre("deleteOne") hook in query context.', async () => {
    setupHook('pre', 'deleteOne', {document: true, query: true})
    const Model = createModel(Schema)
    await Model.deleteOne({})
    expect(TriggeredHooks.pre.length).toBe(1)
    expect(TriggeredHooks.pre[0].context).toBeInstanceOf(Mongoose.Query)
  })

  it('Should NOT trigger document-level post("deleteOne") hook in query context.', async () => {
    setupHook('post', 'deleteOne', {document: true, query: true})
    const Model = createModel(Schema)
    await Model.deleteOne({})
    expect(TriggeredHooks.post.length).toBe(1)
    expect(TriggeredHooks.post[0].context).toBeInstanceOf(Mongoose.Query)
  })

  it('Should execute pre("deleteOne") hooks in the order: document-level first, then query-level.', async () => {
    setupHook('pre', 'deleteOne', {document: true, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.pre.length).toBe(2)
    expect(TriggeredHooks.pre[0].context).toBeInstanceOf(Mongoose.Document)
    expect(TriggeredHooks.pre[1].context).toBeInstanceOf(Mongoose.Query)
  })

  it('Should execute post("deleteOne") hooks in the order: query-level first, then document-level.', async () => {
    setupHook('post', 'deleteOne', {document: true, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.post.length).toBe(2)
    expect(TriggeredHooks.post[1].context).toBeInstanceOf(Mongoose.Document)
    expect(TriggeredHooks.post[0].context).toBeInstanceOf(Mongoose.Query)
  })

  it('Should NOT execute pre("updateOne") hooks in deleteOne operation.', async () => {
    setupHook('pre', 'updateOne', {document: true, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.pre.length).toBe(0)
  })

  it('Should NOT execute post("updateOne") hooks in deleteOne operation.', async () => {
    setupHook('post', 'updateOne', {document: true, query: true})
    const Model    = createModel(Schema)
    const Document = await Model.create({})
    await Document.deleteOne({})
    expect(TriggeredHooks.post.length).toBe(0)
  })
})

