const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - findOneAndDelete (mode: ${mode})`, () => {
    let Model, Document

    beforeAll(async () => {
      Model = createModel({name: String}, {mode: mode})
    })

    beforeEach(async () => {
      Document = await Model.create({name: 'TestDocument'})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should not remove document from collection when option softDelete is set to true', async () => {
      await Model.findOneAndDelete({_id: Document._id}, {softDelete: true})
      expect(await Model.findOne({})).toBeNull()
      expect(await Model.findOne({}, null, {withDeleted: true})).not.toBeNull()
    })

    it('Should remove document from collection when option softDelete is set to false', async () => {
      await Model.findOneAndDelete({_id: Document._id}, {softDelete: false})
      expect(await Model.findOne({}, null, {withDeleted: true})).toBeNull()
    })
  })
})