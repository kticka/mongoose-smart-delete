const MongoDB  = require('mongodb-memory-server')

module.exports = async function () {
  globalThis.Mongod   = await MongoDB.MongoMemoryServer.create({instance: {port: 27017}})
}