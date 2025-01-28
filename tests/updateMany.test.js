const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - updateMany (mode: ${mode})`, () => {
    let Model, Document

    beforeAll(async () => {
      Model = createModel({name: String}, {mode: mode})
    })

    beforeEach(async () => {
      Document = await Model.create({name: 'TestDocument 1'})
      await Model.create({name: 'TestDocument 2'})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should not update deleted documents', async () => {
      await Document.deleteOne()
      await Model.updateMany({}, {name: 'UpdatedDocument'})
      const documents = await Model.find({}, null, {withDeleted: true})
      expect(documents.map(doc => doc.name)).toEqual(['TestDocument 1', 'UpdatedDocument']);
    })

    it('Should update deleted documents when using withDeleted option', async () => {
      await Document.deleteOne()
      await Model.updateMany({}, {name: 'UpdatedDocument'}, {withDeleted: true})
      const documents = await Model.find({}, null, {withDeleted: true})
      expect(documents.every(doc => doc.name === 'UpdatedDocument')).toBe(true);
    })

    it('Should update deleted documents when chaining withDeleted(true)', async () => {
      await Document.deleteOne()
      await Model.updateMany({}, {name: 'UpdatedDocument'}).withDeleted(true)
      const documents = await Model.find({}).withDeleted(true)
      expect(documents.every(doc => doc.name === 'UpdatedDocument')).toBe(true);
    })

  })
})