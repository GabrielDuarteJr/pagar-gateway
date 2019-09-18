const Client = require('../db')

const createUserScript = `
INSERT INTO public.user(name, email, clientid, clientkey) VALUES($1, $2, $3, $4) RETURNING clientid, clientkey;
`
const getUserScript = `
select * from public.user where clientid = $1;
`

const create = async ({ name, email, clientId, clientKey }) => {
  try {
    const { rows } = await Client.query(createUserScript, [ name, email, clientId, clientKey ])
    return rows[0]
  } catch (err) {
    throw new Error('ERRO_CREATE_NEW_USER')
  }
}

const getByClientId = async clientId => {
  try {
    const { rows } = await Client.query(getUserScript, [ clientId ])
    return rows[0]
  } catch (err) {
    throw new Error('ERRO_GET_USER')
  }
}

module.exports = {
  create,
  getByClientId
}
