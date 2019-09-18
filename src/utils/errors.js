const logger = require('./logger')

const log = logger('error')

const errortypes = {
  ERRO_NOT_AUTHORIZED: {
    status: 401,
    message: 'Unauthorized'
  },
  ERRO_REQUEST_CREDENTIALS: {
    status: 511,
    message: 'Request credentials'
  },
  ERRO_CREATE_NEW_USER: {
    status: 500,
    message: 'There was a problem saving user'
  },
  ERRO_GET_USER: {
    status: 500,
    message: 'There was a problem get user'
  },
  ERRO_CREDENTIALS: {
    status: 400,
    message: 'Invalid credentials'
  },
  ERRO_USER_NOT_FOUND: {
    status: 404,
    message: 'User not found'
  },
  ERRO_TRANSACTION_NOT_FOUND: {
    status: 404,
    message: 'Transaction not found'
  },
  ERRO_CREATE_NEW_TRANSACTION: {
    status: 500,
    message: 'There was a problem saving transaction'
  },
  ERRO_GET_TRANSACTIONS: {
    status: 500,
    message: 'There was a problem get transaction'
  },
  ERRO_CREATE_NEW_PAYABLE: {
    status: 500,
    message: 'There was a problem saving payable'
  },
  ERRO_GET_PLAYABLES: {
    status: 500,
    message: 'There was a problem get payable'
  },
  ERRO_PLAYABLE_NOT_FOUND: {
    status: 404,
    message: 'Payable not found'
  }
}

module.exports = error => {
  const { message, status } = errortypes[error]
  log(message)
  return [message, status]
}
