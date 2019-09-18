const validator = require('validator')
const logger = require('./logger')

const log = logger('User')

const rulleName = (name) => !name && validator.isEmpty(name)
  ? 'Required a username'
  : null

const rulleEmail = (email) => !email && !validator.isEmail(email)
  ? 'Invalid email'
  : null

const rulleValue = (value) => !value && !validator.isInt(value)
  ? 'Required value'
  : null

const rulleDescription = (description) => !description && !validator.isEmpty(description)
  ? 'Required a description'
  : null

const rullePaymentMethod = (paymentMethod) => !paymentMethod && !(validator.equals(paymentMethod, 'debit_card') || validator.equals(paymentMethod, 'credit_card'))
  ? 'Required payment method'
  : null

const rulleCardNumber = (cardNumber) => !cardNumber && !validator.isCreditCard(cardNumber)
  ? 'Required a card number valid'
  : null

const rulleBearerName = (bearerName) => !bearerName && !validator.isEmpty(bearerName)
  ? 'Required bearer Name'
  : null

const rulleCardExpiration = (cardExpiration) => !cardExpiration && !validator.isEmpty(cardExpiration)
  ? 'Required card expiration'
  : null

const rulleCvv = (cvv) => !cvv || cvv.length > 4
  ? 'Required cvv'
  : null

const validateUser = async (ctx, next) => {
  const { name, email } = ctx.request.body
  let errors = []
  errors.push(rulleName(name))
  errors.push(rulleEmail(email))
  errors = errors.filter(Boolean)
  if (errors.length) {
    log.error(`Error validade user = ${errors}`)
    ctx.status = 400
    ctx.body = {
      message: errors
    }
  } else {
    await next()
  }
}

const checkValuesTransaction = ({ value, description, paymentMethod, cardNumber, bearerName, cardExpiration, cvv }) => {
  const errors = []
  errors.push(rulleValue(value))
  errors.push(rulleDescription(description))
  errors.push(rullePaymentMethod(paymentMethod))
  errors.push(rulleCardNumber(cardNumber))
  errors.push(rulleBearerName(bearerName))
  errors.push(rulleCardExpiration(cardExpiration))
  errors.push(rulleCvv(cvv))
  return errors.filter(Boolean)
}

const validateTransaction = async (ctx, next) => {
  const errors = checkValuesTransaction(ctx.request.body)
  if (errors.length) {
    log.error(`Error validade user = ${errors}`)
    ctx.status = 400
    ctx.body = {
      message: errors
    }
  } else {
    await next()
  }
}

module.exports = {
  validateUser,
  validateTransaction
}
