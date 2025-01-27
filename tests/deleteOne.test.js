const createModel = require('./setup/createModel')
describe('SoftDelete - deleteOne', () => {
  let Model, Document

  beforeAll(async () => {
    Model = createModel({name: String})
  })

  beforeEach(async () => {
    Document = await Model.create({name: 'TestDocument'})
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false, withDeleted: true})
  })

  it('Document.deleteOne should not remove document from collection when option softDelete is set to true', async () => {
    await Document.deleteOne({softDelete: true})
    expect(await Model.findOne({})).toBeNull()
    expect(await Model.findOne({}, null, {withDeleted: true})).not.toBeNull()
  })

  it('Document.deleteOne should remove document from collection when option softDelete is set to false', async () => {
    await Document.deleteOne({softDelete: false})
    expect(await Model.findOne({}, null, {withDeleted: true})).toBeNull()
  })

  it('Model.deleteOne should not remove document from collection when option softDelete is set to true', async () => {
    await Model.deleteOne({_id: Document._id}, {softDelete: true})
    expect(await Model.findOne({})).toBeNull()
    expect(await Model.findOne({}, null, {withDeleted: true})).not.toBeNull()
  })

  it('Model.deleteOne should remove document from collection when option softDelete is set to false', async () => {
    await Model.deleteOne({_id: Document._id}, {softDelete: false})
    expect(await Model.findOne({}, null, {withDeleted: true})).toBeNull()
  })
})