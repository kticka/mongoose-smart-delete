const createModel = require('./setup/createModel')
const modes       = require('./setup/modes')

modes.forEach((mode) => {
  describe(`SoftDelete - distinct (mode: ${mode})`, () => {
    let Model

    beforeAll(async () => {
      Model = createModel({
        name: String
      }, {mode: mode})
    })

    beforeEach(async () => {
      await Model.create({name: 'A'})
      await Model.create({name: 'B'})
      await Model.create({name: 'C'})
      await Model.deleteOne({name: 'A'})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should exclude soft deleted documents by default', async () => {
      expect(await Model.distinct('name')).toEqual(['B', 'C'])
    })

    it('Should include soft deleted documents when using the withDeleted option', async () => {
      expect(await Model.distinct('name', {}, {withDeleted: true})).toEqual(['A', 'B', 'C'])
    })

    it('Should include soft deleted documents when chaining withDeleted(true)', async () => {
      expect(await Model.distinct('name').withDeleted(true)).toEqual(['A', 'B', 'C'])
    })
  })
})