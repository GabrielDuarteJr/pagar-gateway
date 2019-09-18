const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync()

const encrypt = (plain) => bcrypt.hashSync(plain, salt)
const compare = (plain, hash) => bcrypt.compareSync(plain, hash)

module.exports = {
  encrypt,
  compare
}
