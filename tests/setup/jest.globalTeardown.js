module.exports = async function () {
  if (globalThis.Mongod !== undefined) await globalThis.Mongod.stop()
}
