module.exports = async function () {
  await global.Mongoose.disconnect()
  await global.Mongod.stop()
}
