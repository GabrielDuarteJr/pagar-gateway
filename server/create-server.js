const Koa = require('koa')
const convert = require('koa-convert')
const body = require('koa-bodyparser')
const authentication = require('./authentication')
const routes = require('../src/routes')
const logger = require('../src/utils/logger')
const errorHandling = require('../src/utils/errors')
const consigureDb = require('../src/db/configure-db')

const log = logger('Server')

const logStart = () => {
  log.info('Server started')
  log.debug('Server logger.debug = enabled')
  log.warn('Server logger.warn = enabled')
  log.error('Server logger.error = enabled')
}

const createServer = () => {
  const app = new Koa()
  app.use(authentication)
  app.use(convert(body()))
  app.use(routes())

  try {
    consigureDb()
    log.info(`Database configuration success`)
  } catch (err) {
    const error = errorHandling(err.message)
    log.error(`Database configuration error = ${error.body}`)
  }
  logStart()
  return app
}

module.exports = createServer
