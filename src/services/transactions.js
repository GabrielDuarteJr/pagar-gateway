const { transactions, payables } = require('../lib')
const errorHandling = require('../utils/errors')

const set = async (ctx) => {
  const { userId } = ctx
  const { value, paymentMethod } = ctx.request.body
  try {
    const currentTransaction = await transactions.save({ userId, ...ctx.request.body })
    await payables.save({ userId, value, paymentMethod, transactionId: currentTransaction.id }) 
    delete currentTransaction.id
    ctx.body = currentTransaction
  } catch (e) {
    [ctx.body, ctx.status] = errorHandling(e.message)
  }
}

const get = async (ctx) => {
  const { userId } = ctx
  try {
    const allTransactions = await transactions.getAll(userId)
    ctx.body = allTransactions
  } catch (e) {
    [ctx.body, ctx.status] = errorHandling(e.message)
  }
}

module.exports = {
  set,
  get
}
