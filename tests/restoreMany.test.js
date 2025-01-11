describe('SoftDelete - restoreMany', () => {
  let Model

  beforeAll(async () => {
    Model = global.Model({num: Number})
  })

  beforeEach(async () => {
    const objects = Array.from({length: 5}, (_, index) => ({num: index + 1}))
    await Model.insertMany(objects)
    await Model.deleteMany({num: {$lte: 3}})
  })

  afterEach(async () => {
    await Model.deleteMany({}, {softDelete: false})
  })

  it('Should restore multiple documents', async () => {
    expect((await Model.find({})).map(obj => obj.num)).toEqual([4, 5])
    await Model.restoreMany({num: {$lte: 2}})
    expect((await Model.find({})).map(obj => obj.num)).toEqual([1, 2, 4, 5])
  })
})