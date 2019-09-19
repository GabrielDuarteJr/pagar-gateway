const agent = require('supertest')
const http = require('http')
const memoize = require('lodash/memoize')

const createServer = require('../../server/create-server')

let App, server
const createTestServer = memoize(async () => {
  const app = App = await createServer()
  server = http.createServer(
    app.callback()
  )

  await new Promise(
    (resolve, reject) => server.listen(0, (err) => err ? reject(err) : resolve())
  )

  const req = agent(
    server
  )

  req.app = app
  return req
})

before(() => {
  return createTestServer()
})

after((done) => {
  if (App) {
    server.close(done)
  }
})
module.exports = { createServer: createTestServer }
