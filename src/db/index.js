const { db: { user, host, database, password, port } } = require('../../configs')
const { Pool } = require('pg')

const client = new Pool({
  user,
  host,
  database,
  password,
  port
})

module.exports = client
