describe('SoftDelete - updateOne', () => {
  let Model, Document

  beforeAll(async () => {
    Model = global.Model({name: String})
  })

  beforeEach(async () => {
    Document = await Model.create({name: 'TestDocument'})
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Should not update deleted document', async () => {
    await Document.deleteOne()
    await Model.updateOne({_id: Document._id}, {name: 'UpdatedDocument'})
    const Updated = await Model.findOne({_id: Document._id}, null, {withDeleted: true})
    expect(Updated.name).toBe('TestDocument')
  })

  it('Should update deleted document when using withDeleted option', async () => {
    await Document.deleteOne()
    await Model.updateOne({_id: Document._id}, {name: 'UpdatedDocument'}, {withDeleted: true})
    const Updated = await Model.findOne({_id: Document._id}, null, {withDeleted: true})
    expect(Updated.name).toBe('UpdatedDocument')
  })

  it('Should update deleted document when when chaining withDeleted(true)', async () => {
    await Document.deleteOne()
    await Model.updateOne({_id: Document._id}, {name: 'UpdatedDocument'}).withDeleted(true)
    const Updated = await Model.findOne({_id: Document._id}).withDeleted(true)
    expect(Updated.name).toBe('UpdatedDocument')
  })
})