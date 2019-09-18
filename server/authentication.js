const validator = require('validator')
const errorHandling = require('../src/utils/errors')
const user = require('../src/lib/user')

const ignoredRoutes = [
  '/user'
]

const getIgnoredAuth = (route) => ignoredRoutes.indexOf(route) >= 0

const getClient = async (clientid, clientkey) => {
  if (!clientid || !clientkey || !validator.isUUID(clientid)) {
    throw new Error('ERRO_REQUEST_CREDENTIALS')
  }
  return user.confirmUser(clientid, clientkey)
}

module.exports = async (ctx, next) => {
  const { clientid, clientkey } = ctx.header
  if (!getIgnoredAuth(ctx.url)) {
    try {
      ctx.userId = await getClient(clientid, clientkey)
      await next()
    } catch (e) {
      [ctx.body, ctx.status] = errorHandling(e.message)
    }
  } else {
    await next()
  }
}
