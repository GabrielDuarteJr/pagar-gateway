const Router = require('koa-router')
const validate = require('./utils/validation')
const { user, transactions, payables } = require('./services')

const createRouter = () => {
  const router = new Router()
  setRoutes(router, validate)
  return router
}

const setRoutes = (router, { validateUser, validateTransaction }) => {
  router.post('/user', validateUser, user.set)
  router.post('/transactions', validateTransaction, transactions.set)
  router.get('/transactions', transactions.get)
  router.get('/payables', payables.get)
}

module.exports = () => createRouter().routes()
