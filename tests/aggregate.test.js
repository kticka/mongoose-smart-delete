const createModel = require('./setup/createModel')
describe('SoftDelete - aggregate', () => {
  let Model, Document

  beforeAll(async () => {
    Model = createModel()
  })

  beforeEach(async () => {
    Document = await Model.create({})
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Should exclude deleted documents when "withDeleted" option is not used', async () => {
    await Document.deleteOne()
    const documents = await Model.aggregate([
      {$match: {_id: Document}}
    ])
    expect(documents.length).toEqual(0)
  })

  it('Should return deleted documents when "withDeleted" option is used', async () => {
    await Document.deleteOne()
    const documents = await Model.aggregate([
      {$match: {_id: Document._id}}
    ], {withDeleted: true})
    expect(documents[0]._id).toEqual(Document._id)
  })

  it('Should return deleted documents when chaining withDeleted(true)', async () => {
    await Document.deleteOne()
    const documents = await Model.aggregate([
      {$match: {_id: Document._id}}
    ]).withDeleted(true)
    expect(documents[0]._id).toEqual(Document._id)
  })

  it('Should not duplicate soft delete filter if aggregation already contains filter on "deleted" field', async () => {
    const aggregation = Model.aggregate([
      {$match: {_id: Document._id}},
      {$match: {deleted: {$ne: false}}}
    ])

    await aggregation
    const pipeline = aggregation.pipeline()
    expect(pipeline.length).toBe(2)
    expect(pipeline[0].$match._id).toEqual(Document._id)
  })

  it('Should add soft delete filter automatically if not present in the aggregation pipeline', async () => {
    const aggregation = Model.aggregate([
      {$match: {_id: Document._id}}
    ])
    await aggregation
    const pipeline = aggregation.pipeline()
    expect(pipeline.length).toBe(2)
    expect(pipeline[0].$match.deleted.$ne).toBe(true)
  })
})