const { user } = require('../lib')
const errorHandling = require('../utils/errors')

const set = async (ctx) => {
  const { name, email } = ctx.request.body
  try {
    ctx.body = await user.save(name, email)
  } catch (e) {
    [ctx.body, ctx.status] = errorHandling(e.message)
  }
}

module.exports = {
  set
}
