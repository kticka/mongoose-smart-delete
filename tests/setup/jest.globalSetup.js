const MongoDB = require('mongodb-memory-server')

module.exports = async function () {
  if (!process.env.CI) globalThis.Mongod = await MongoDB.MongoMemoryServer.create({instance: {port: 27017}})
}