const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - replaceOne (mode: ${mode})`, () => {
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

    it('Should not replace deleted document', async () => {
      await Document.deleteOne()
      await Model.replaceOne({_id: Document._id}, {name: 'UpdatedDocument'})
      const Updated = await Model.findOne({_id: Document._id}, null, {withDeleted: true})
      expect(Updated.name).toBe('TestDocument')
    })

    it('Should replace deleted document when using withDeleted option', async () => {
      await Document.deleteOne()
      await Model.replaceOne({_id: Document._id}, {name: 'UpdatedDocument'}, {withDeleted: true})
      const Updated = await Model.findOne({_id: Document._id}, null, {withDeleted: true})
      expect(Updated.name).toBe('UpdatedDocument')
    })

    it('Should replace deleted document when chaining withDeleted(true)', async () => {
      await Document.deleteOne()
      await Model.replaceOne({_id: Document._id}, {name: 'UpdatedDocument'}).withDeleted(true)
      const Updated = await Model.findOne({_id: Document._id}).withDeleted(true)
      expect(Updated.name).toBe('UpdatedDocument')
    })
  })
})