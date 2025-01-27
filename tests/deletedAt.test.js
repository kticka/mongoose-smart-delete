const createModel = require('./setup/createModel')
describe('SoftDelete - deletedAt field', () => {

  let Model

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false, withDeleted: true})
  })

  it('Deleted document should not have set deletedAt config.deletedAt.field is not provided', async () => {
    Model    = createModel({})
    const Document = await Model.create({})
    await Document.deleteOne()
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedAt).toBeUndefined()
  })

  it('Deleted document should have deletedAt attribute set to date when config.deletedAt is set to true', async () => {
    const Model    = createModel({}, {
      deletedAt: true
    })
    Document = await Model.create({})
    await Document.deleteOne()
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedAt).toBeInstanceOf(Date)
  })

  it('Deleted document should have custom deletedAt attribute set to date when config.deletedAt.field is provided', async () => {
    const deletedAtField = 'removedAt'
    Model          = createModel({}, {
      deletedAt: {
        field: deletedAtField
      }
    })
    const Document = await Model.create({})
    await Document.deleteOne()
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedAt).toBeUndefined()
    expect(Deleted[deletedAtField]).toBeInstanceOf(Date)
  })
})