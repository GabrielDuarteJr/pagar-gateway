const faker = require('faker')
const sinon = require('sinon')
const { createServer } = require('../helpers/create-server')
const { user } = require('../../src/lib')

const path = '/user'

describe('User', () => {
  let request
  let sandbox
  let credentials

  beforeEach(async () => {
    request = await createServer()
    sandbox = sinon.createSandbox()
    credentials = user.createCredentials(faker.name.findName(), faker.internet.email())
  })

  afterEach(() => {
    sandbox.restore()
  })

  context('POST /user', () => {
    it('should returns 400 Check body request', async () => {
      await request.post(path)
        .expect(400, 'Check body request')
    })

    it('should returns 400 Error fields', async () => {
      const fieldSendError = {
        name: '',
        email: ''
      }
      const errorsExpected = {
        message: [
          'Required a username',
          'Invalid email'
        ]
      }
      await request.post(path)
        .send(fieldSendError)
        .expect(400, errorsExpected)
    })

    it('should return 500 There was a problem saving user', async () => {
      sandbox.stub(user, 'save').rejects(new Error('ERROR_CREATE_NEW_USER'))
      const fieldSend = {
        name: 'teste',
        email: 'teste@teste.com'
      }
      await request.post(path)
        .send(fieldSend)
        .expect(500, 'There was a problem saving user')
    })

    it('should return 200', async () => {
      sandbox.stub(user, 'save').resolves(credentials)
      await request.post(path)
        .send({ name: 'teste', email: 'teste@teste.com' })
        .expect(200, credentials)
    })
  })
})
