const createModel = require('./setup/createModel')
describe('SoftDelete - find', () => {
  let Model, Document1, Document2

  beforeAll(async () => {
    Model = createModel()
  })

  beforeEach(async () => {
    Document1 = await Model.create({})
    Document2 = await Model.create({})
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Should exclude soft deleted documents by default', async () => {
    await Document1.deleteOne()
    const documents = await Model.find({})
    expect(documents.length).toBe(1)
    expect(documents[0]._id).toEqual(Document2._id)
  })

  it('Should include soft deleted documents when using the withDeleted option', async () => {
    await Document1.deleteOne()
    const documents = await Model.find({}, null, {withDeleted: true})
    expect(documents.length).toBe(2)
  })

  it('Should include soft deleted documents when chaining withDeleted(true)', async () => {
    await Document1.deleteOne()
    const documents = await Model.find({}).withDeleted(true)
    expect(documents.length).toBe(2)
  })
})