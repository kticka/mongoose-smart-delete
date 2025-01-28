const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - deleteOne (mode: ${mode})`, () => {
    let Model, Document

    beforeAll(async () => {
      Model = createModel({}, {mode: mode})
    })

    beforeEach(async () => {
      Document = await Model.create({})
      await Document.deleteOne()
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Document.restoreOne should restore Document', async () => {
      expect(await Model.findOne({})).toBeNull()
      await Document.restoreOne()
      expect((await Model.findOne({}))._id).toEqual(Document._id)
    })

    it('Model.restoreOne should restore Document', async () => {
      expect(await Model.findOne({})).toBeNull()
      await Model.restoreOne({_id: Document._id})
      expect((await Model.findOne({}))._id).toEqual(Document._id)
    })
  })
})