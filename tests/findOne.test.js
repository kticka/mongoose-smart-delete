describe('SoftDelete - findOne', () => {
  let Model

  beforeAll(async () => {
    Model = global.Model()
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Should exclude soft deleted documents by default', async () => {
    const document = await Model.create({})
    await document.deleteOne()
    expect(await Model.findOne({})).toBeNull()
  })

  it('Should include soft deleted documents when using the withDeleted option', async () => {
    const document = await Model.create({})
    await document.deleteOne()
    expect((await Model.findOne({}, null, {withDeleted: true}))._id).toEqual(document._id)
  })

  it('Should include soft deleted documents when chaining withDeleted(true)', async () => {
    const document = await Model.create({})
    await document.deleteOne()
    expect((await Model.findOne({}).withDeleted(true))._id).toEqual(document._id)
  })
})