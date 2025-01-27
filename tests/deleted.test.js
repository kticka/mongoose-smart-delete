const createModel = require('./setup/createModel')
describe('SoftDelete - deleted field', () => {

  let Model

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false, withDeleted: true})
  })

  it('Deleted document should have deleted field set to true when config.deleted.field is not provided', async () => {
    Model = createModel({})
    const Document = await Model.create({})
    await Document.deleteOne()
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedAt).toBeUndefined()
    expect(Deleted.deletedBy).toBeUndefined()
  })

  it('Deleted document should have custom deleted field set to true when config.deleted.field is provided', async () => {

    const deletedField = 'isDeleted'

    Model = createModel({}, {
      deleted: {
        field: deletedField
      }
    })
    const Document = await Model.create({})
    await Document.deleteOne()
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBeUndefined()
    expect(Deleted[deletedField]).toBe(true)
  })
})