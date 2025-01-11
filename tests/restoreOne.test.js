const createModel = require('./setup/createModel')
describe('SoftDelete - deleteOne', () => {
  let Model, Document

  beforeAll(async () => {
    Model = createModel({})
  })

  beforeEach(async () => {
    Document = await Model.create({})
    await Document.deleteOne()
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Document.restoreOne should restore Document', async () => {
    expect(await Model.findOne({})).toBeNull()
    await Document.restoreOne()
    expect((await Model.findOne({}))._id).toEqual(Document._id)
  })

  it('Model.restoreOne should restore Document', async () => {
    expect(await Model.findOne({})).toBeNull()
    await Model.restoreOne({_id: Document._id})
    expect((await Model.findOne({}))._id).toEqual(Document._id)
  })
})