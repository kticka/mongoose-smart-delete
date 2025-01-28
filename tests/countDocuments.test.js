const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe('SoftDelete - countDocuments', () => {
    let Model

    beforeAll(async () => {
      Model = createModel({}, {mode: mode})
    })

    beforeEach(async () => {
      await Model.insertMany([{}, {}])
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should exclude deleted documents by default', async () => {
      await Model.deleteOne()
      expect(await Model.countDocuments()).toBe(1)
    })

    it('Should include deleted documents when using withDeleted option', async () => {
      await Model.deleteOne()
      expect(await Model.countDocuments({}, {withDeleted: true})).toBe(2)
    })

    it('Should include deleted documents when chaining withDeleted(true)', async () => {
      await Model.deleteOne()
      expect(await Model.countDocuments({}).withDeleted(true)).toBe(2)
    })
  })
})