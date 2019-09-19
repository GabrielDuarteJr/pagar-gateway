const logger = require('./logger')

const log = logger('Error')

const errorTypes = {
  ERROR_REQUEST_CREDENTIALS: {
    status: 401,
    message: 'Unauthorized request credentials'
  },
  ERROR_CREATE_NEW_USER: {
    status: 500,
    message: 'There was a problem saving user'
  },
  ERROR_GET_USER: {
    status: 500,
    message: 'There was a problem get user'
  },
  ERROR_CREDENTIALS: {
    status: 400,
    message: 'Invalid credentials'
  },
  ERROR_USER_NOT_FOUND: {
    status: 404,
    message: 'User not found'
  },
  ERROR_TRANSACTION_NOT_FOUND: {
    status: 404,
    message: 'Transaction not found'
  },
  ERROR_CREATE_NEW_TRANSACTION: {
    status: 500,
    message: 'There was a problem saving transaction'
  },
  ERROR_GET_TRANSACTIONS: {
    status: 500,
    message: 'There was a problem get transaction'
  },
  ERROR_CREATE_NEW_PAYABLE: {
    status: 500,
    message: 'There was a problem saving payable'
  },
  ERROR_GET_PLAYABLES: {
    status: 500,
    message: 'There was a problem get payable'
  },
  ERROR_PLAYABLE_NOT_FOUND: {
    status: 404,
    message: 'Payable not found'
  },
  ERROR_VALIDATION: {
    status: 400,
    message: 'Check body request'
  }
}

module.exports = error => {
  log.error(error)
  try {
    const { message, status } = errorTypes[error]
    return [message, status]
  } catch (e) {
    return ['Internal Server Error', 500]
  }
}
