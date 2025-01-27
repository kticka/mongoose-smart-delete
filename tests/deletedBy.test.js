const createModel = require('./setup/createModel')
describe('SoftDelete - deletedAt field', () => {

  let Model, User

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    await User.deleteMany({}, {softDelete: false, withDeleted: true})
  })

  it('Deleted document should have deletedBy attribute set to ObjectId when config.deletedBy is set', async () => {
    User     = createModel()
    Model    = createModel({}, {
      deletedBy: {
        ref: User.constructor.name
      }
    })
    const Document = await Model.create({})
    const Actor    = await User.create({})

    await Document.deleteOne({deletedBy: Actor})
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedBy).toEqual(Actor._id)
  })

  it('Deleted document should have custom deletedBy attribute set to ObjectId when config.deletedBy is set', async () => {
    const deletedByField = 'removedBy'

    User     = createModel()
    Model    = createModel({}, {
      deletedBy: {
        field: deletedByField,
        ref:   User.constructor.name
      }
    })

    const Document = await Model.create({})
    const Actor    = await User.create({})

    await Document.deleteOne({deletedBy: Actor})
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedBy).toBeUndefined()
    expect(Deleted[deletedByField]).toEqual(Actor._id)
  })
})