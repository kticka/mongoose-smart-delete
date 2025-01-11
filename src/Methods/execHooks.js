const Mongoose = require('mongoose')

module.exports = async function (hook, query) {
  const schema = this instanceof Mongoose.Model ? this.model().schema : this.schema

  await schema.s.hooks.execPre(hook, this, [this, true], err => {
    if (err) throw err
  })

  const result = await query

  await schema.s.hooks.execPost(hook, this, [this], err => {
    if (err) throw err
  })

  return result
}