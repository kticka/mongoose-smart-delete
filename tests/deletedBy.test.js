const createModel = require('./setup/createModel')
describe('SoftDelete - deletedAt field', () => {

  it('Deleted document should have deletedBy attribute set to ObjectId when config.deletedBy is set', async () => {
    const User     = createModel()
    const Model    = createModel({}, {
      deletedBy: {
        ref: User.constructor.name
      }
    })
    const Document = await Model.create({})
    const Actor    = await User.create({})

    await Document.deleteOne({deleteBy: Actor})
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedBy).toEqual(Actor._id)
  })

  it('Deleted document should have custom deletedBy attribute set to ObjectId when config.deletedBy is set', async () => {
    const deletedByField = 'removedBy'

    const User     = createModel()
    const Model    = createModel({}, {
      deletedBy: {
        field: deletedByField,
        ref:   User.constructor.name
      }
    })

    const Document = await Model.create({})
    const Actor    = await User.create({})

    await Document.deleteOne({deleteBy: Actor})
    const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
    expect(Deleted.deleted).toBe(true)
    expect(Deleted.deletedBy).toBeUndefined()
    expect(Deleted[deletedByField]).toEqual(Actor._id)
  })
})