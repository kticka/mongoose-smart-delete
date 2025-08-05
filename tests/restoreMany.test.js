const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - restoreMany (mode: ${mode})`, () => {
    let Model

    beforeAll(async () => {
      Model = createModel({num: Number}, {mode: mode})
    })

    beforeEach(async () => {
      const objects = Array.from({length: 5}, (_, index) => ({num: index + 1}))
      await Model.insertMany(objects)
      await Model.deleteMany({num: {$lte: 3}})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should restore multiple documents', async () => {
      expect((await Model.find({})).map(obj => obj.num)).toEqual([4, 5])
      await Model.restoreMany({num: {$lte: 2}})
      expect((await Model.find({})).map(obj => obj.num)).toEqual([1, 2, 4, 5])
    })

    it('Model.restoreMany should return {acknowledged: true, restoredCount: 3}', async () => {
      const result = await Model.restoreMany({})
      expect(result).toEqual({acknowledged: true, restoredCount: 3})
    })
  })
})