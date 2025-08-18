const mongoose    = require('mongoose')
const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - deletionId field (mode: ${mode})`, () => {

    let Model

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Deleted document should not have set deletionId config.deletionId.field is not provided', async () => {
      Model          = createModel({}, {mode: mode})
      const Document = await Model.create({})
      await Document.deleteOne()
      const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
      expect(Deleted.deleted).toBe(true)
      expect(Deleted.deletionId).toBeUndefined()
    })

    it('Deleted document should have deletionId attribute set to date when config.deletionId is set to true', async () => {
      const Model = createModel({}, {
        deletionId: true,
        mode:       mode
      })
      Document    = await Model.create({})
      await Document.deleteOne()
      const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
      expect(Deleted.deleted).toBe(true)
      expect(Deleted.deletionId).toBeInstanceOf(mongoose.Types.ObjectId)
    })

    it('Deleted document should have custom deletionId attribute set to date when config.deletionId.field is provided', async () => {
      const deletionIdField = 'removalId'
      Model                 = createModel({}, {
        deletionId: {
          field: deletionIdField
        },
        mode:       mode
      })
      const Document        = await Model.create({})
      await Document.deleteOne()
      const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
      expect(Deleted.deleted).toBe(true)
      expect(Deleted.deletionId).toBeUndefined()
      expect(Deleted[deletionIdField]).toBeInstanceOf(mongoose.Types.ObjectId)
    })

    it('Deleted document should have deletionId provided by options', async () => {
      const Model      = createModel({}, {
        deletionId: true,
        mode:       mode
      })
      const Document   = await Model.create({})
      const deletionId = new mongoose.Types.ObjectId()
      await Document.deleteOne({deletionId: deletionId})
      const Deleted = await Model.findOne({_id: Document._id}).withDeleted()
      expect(Deleted.deleted).toBe(true)
      expect(deletionId.equals(Deleted.deletionId)).toBe(true)
    })
  })
})