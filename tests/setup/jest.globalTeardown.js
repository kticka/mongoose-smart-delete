module.exports = async function () {
  await globalThis.Mongod.stop()
}
