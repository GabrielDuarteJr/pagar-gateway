const Client = require('../db')

const createTransactionScript = `
INSERT INTO public.transaction(value, description, paymentMethod, cardNumber, bearerName, cardExpiration, cvv, userId)
VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
`
const getTransactionScript = `
select * from public.transaction where userId = $1;
`

const create = async ({ userId, value, description, paymentMethod, cardNumber, bearerName, cardExpiration, cvv }) => {
  try {
    const { rows } = await Client.query(createTransactionScript, [ value, description, paymentMethod, cardNumber, bearerName, cardExpiration, cvv, userId ])
    return rows[0]
  } catch (err) {
    throw new Error('ERRO_CREATE_NEW_TRANSACTION')
  }
}

const getByClientId = async userId => {
  try {
    const { rows } = await Client.query(getTransactionScript, [ userId ])
    return rows
  } catch (err) {
    throw new Error('ERRO_GET_TRANSACTIONS')
  }
}

module.exports = {
  create,
  getByClientId
}
