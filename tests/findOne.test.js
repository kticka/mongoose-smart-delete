const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - findOne (mode: ${mode})`, () => {
    let Model

    beforeAll(async () => {
      Model = createModel({}, {mode: mode})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
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
})