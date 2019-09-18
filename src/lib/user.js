const uuidv4 = require('uuid/v4')
const encryption = require('../utils/encryption')
const { user } = require('../models')

const createCredentials = (name, email) => ({
  clientId: uuidv4(),
  clientKey: encryption.encrypt(email + name)
})

const save = async (name, email) => {
  const credentials = createCredentials(name, email)
  try {
    return await user.create({ name, email, ...credentials })
  } catch (err) {
    throw new Error('ERRO_CREATE_NEW_USER')
  }
}

const confirmUser = async (clientId, clientKey) => {
  const currentUser = await user.getByClientId(clientId)
  if (!currentUser) {
    throw new Error('ERRO_USER_NOT_FOUND')
  }
  const { id, name, email } = currentUser
  if (encryption.compare(email + name, clientKey)) {
    return id
  } else {
    throw new Error('ERRO_CREDENTIALS')
  }
}

module.exports = {
  save,
  confirmUser
}
