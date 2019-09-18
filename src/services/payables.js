const { payables } = require('../lib')
const errorHandling = require('../utils/errors')

const get = async (ctx) => {
  const { userId } = ctx
  const { balance } = ctx.request.query
  try {
    if (balance === 'waiting_funds' || balance === 'paid') {
      const currentBalance = await payables.getBalance(userId, balance)
      ctx.body = currentBalance
    } else {
      const allPayables = await payables.getAll(userId)
      ctx.body = allPayables
    }
  } catch (e) {
    [ctx.body, ctx.status] = errorHandling(e.message)
  }
}

module.exports = {
  get
}
