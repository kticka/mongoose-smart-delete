const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - save (mode: ${mode})`, () => {
    let Model, Doc

    beforeAll(async () => {
      Model = createModel({name: String}, {mode: mode})
    })

    beforeEach(async () => {
      Doc = await Model.create({name: 'TestDocument'})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should save deleted document when it\'s already loaded to memory', async () => {
      await Doc.deleteOne()
      Doc.name = 'UpdatedDocument'
      await Doc.save()
      const Updated = await Model.findOne({_id: Doc._id}, null, {withDeleted: true})
      expect(Updated.name).toBe('UpdatedDocument')
      expect(Updated.deleted).toBe(true)
    })
  })
})