const Client = require('../db')

const createPayableScript = `
INSERT INTO public.payable(payable, paymentDate, status, userId, transactionId)
VALUES($1, $2, $3, $4, $5) RETURNING *;
`
const getPayableScript = `
select * from public.payable where userId = $1;
`

const create = async (userId, transactionId, payable, paymentDate, status) => {
  try {
    const { rows } = await Client.query(createPayableScript, [ payable, paymentDate, status, userId, transactionId ])
    return rows[0]
  } catch (err) {
    throw new Error('ERRO_CREATE_NEW_PAYABLE')
  }
}

const getByClientId = async userId => {
  try {
    const { rows } = await Client.query(getPayableScript, [ userId ])
    return rows
  } catch (err) {
    throw new Error('ERRO_GET_PLAYABLES')
  }
}

module.exports = {
  create,
  getByClientId
}
