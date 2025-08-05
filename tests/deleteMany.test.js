const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - deleteMany (mode: ${mode})`, () => {
    let Model

    beforeAll(async () => {
      Model = createModel({num: Number}, {mode: mode})
    })

    beforeEach(async () => {
      const objects = Array.from({length: 5}, (_, index) => ({num: index + 1}))
      await Model.insertMany(objects)
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should exclude soft-deleted documents from standard queries but include them when using withDeleted', async () => {
      await Model.deleteMany({num: {$lte: 3}})
      const objects = await Model.find({})
      expect(objects.map(obj => obj.num)).toEqual([4, 5])
      const withDeleted = await Model.find({}, null, {withDeleted: true})
      expect(withDeleted.map(obj => obj.num)).toEqual([1, 2, 3, 4, 5])
    })

    it('Should permanently remove documents when softDelete is false', async () => {
      await Model.deleteMany({num: {$lte: 3}}, {softDelete: false})
      const objects = await Model.find({}, null, {withDeleted: true})
      expect(objects.map(obj => obj.num)).toEqual([4, 5])
    })

    it('Model.deleteMany should return {acknowledged: true, deletedCount: 3}', async () => {
      const result = await Model.deleteMany({num: {$lte: 3}})
      expect(result).toEqual({acknowledged: true, deletedCount: 3})
    })

  })
})