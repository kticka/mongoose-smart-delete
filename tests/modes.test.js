const createModel = require('./setup/createModel')

describe('SoftDelete - modes', () => {

  let Model


  describe('Strict mode', () => {

    beforeEach(() => {
      Model = createModel({}, {mode: 'strict', deletedAt: true})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should set deleted attribute to false when document is created', async () => {
      const Document = await Model.create({})
      expect(Document.deleted).toBe(false)
    })

    it('Should set deleted attribute to false when document is restored', async () => {
      let Document = await Model.create({})
      await Document.deleteOne()
      expect((await Model.findOne({}).withDeleted()).deleted).toBe(true)
      expect((await Model.findOne({}).withDeleted()).deletedAt).not.toBeUndefined()
      await Document.restoreOne()
      Document = await Model.findOne({})
      expect(Document.deleted).toBe(false)
      expect(Document.deletedAt).toBeUndefined()
      expect(Document.deletedBy).toBeUndefined()
    })

  })

  describe('$ne mode', () => {

    beforeEach(() => {
      Model = createModel({}, {mode: '$ne', deletedAt: true})
    })

    afterEach(async () => {
      await Model.deleteMany({}, {softDelete: false, withDeleted: true})
    })

    it('Should set deleted field to false when document is created', async () => {
      const Document = await Model.create({})
      expect(Document.deleted).toBeUndefined()
    })

    it('Should unset deleted field when document is restored', async () => {
      let Document = await Model.create({})
      await Document.deleteOne()
      expect((await Model.findOne({}).withDeleted()).deleted).toBe(true)
      expect((await Model.findOne({}).withDeleted()).deletedAt).not.toBeUndefined()
      await Document.restoreOne()
      Document = await Model.findOne({})
      expect(Document.deleted).toBeUndefined()
      expect(Document.deletedAt).toBeUndefined()
      expect(Document.deletedBy).toBeUndefined()
    })

  })
})