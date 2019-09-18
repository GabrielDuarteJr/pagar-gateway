const moment = require('moment')
const { payables } = require('../models')

const calculateFee = (value, Fee) => String(((value * Fee) / 100).toFixed(2))

const save = async ({ userId, value, paymentMethod, transactionId }) => {
  const payable = paymentMethod === 'credit_card'
    ? calculateFee(value, 0.95)
    : calculateFee(value, 0.97)
  const paymentDate = paymentMethod === 'credit_card'
    ? moment().add(30, 'days').calendar()
    : moment().format('L')
  const status = paymentMethod === 'credit_card'
    ? 'waiting_funds'
    : 'paid'
  const currentPayable = await payables.create(userId, transactionId, payable, paymentDate, status)
  if (!currentPayable) {
    throw new Error('ERRO_PLAYABLE_NOT_FOUND')
  }
}

const getAll = async (userId) => {
  const filtredPayables = []
  const allPayables = await payables.getByClientId(userId)
  if (!allPayables) {
    throw new Error('ERRO_PLAYABLE_NOT_FOUND')
  }
  allPayables.map(payable => {
    delete payable.id
    delete payable.userid
    delete payable.transactionid
    filtredPayables.push(payable)
  })
  return filtredPayables
}

const getBalance = async (userId, typeBalance) => {
  let balance = 0
  const allPayables = await payables.getByClientId(userId)
  if (!allPayables) {
    throw new Error('ERRO_PLAYABLE_NOT_FOUND')
  }
  allPayables.map(({ status, payable }) => {
    if (status === typeBalance) {
      balance += parseFloat(payable)
    }
  })
  return { balance: balance.toString(), type: typeBalance }
}

module.exports = {
  save,
  getAll,
  getBalance
}
