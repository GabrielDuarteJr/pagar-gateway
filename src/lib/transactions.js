const { transaction } = require('../models')

const formatCardNumber = (cardNumber) =>
  '*'.repeat(cardNumber.length - 4) + cardNumber.substr(-4)

const save = async (newTransaction) => {
  const cardNumber = formatCardNumber(newTransaction.cardNumber)
  const value = String((newTransaction.value / 100).toFixed(2))
  const currentTransaction = await transaction.create({ ...newTransaction, cardNumber, value })
  if (!currentTransaction) {
    throw new Error('ERRO_TRANSACTION_NOT_FOUND')
  }
  delete currentTransaction.userid
  delete currentTransaction.cvv
  return currentTransaction
}

const getAll = async (userId) => {
  const filtredTransactions = []
  const allTransactions = await transaction.getByClientId(userId)
  if (!allTransactions) {
    throw new Error('ERRO_TRANSACTION_NOT_FOUND')
  }
  allTransactions.map(transaction => {
    delete transaction.id
    delete transaction.userid
    delete transaction.cvv
    filtredTransactions.push(transaction)
  })
  return filtredTransactions
}

module.exports = {
  save,
  getAll
}
