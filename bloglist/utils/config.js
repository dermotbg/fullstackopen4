require('dotenv').config()

const MDB_URI = process.env.MDB_URI
const PORT = process.env.PORT

module.exports = {
  MDB_URI,
  PORT
}
