const faker = require('faker')
const sinon = require('sinon')
const { createServer } = require('../helpers/create-server')
const { user, transactions, payables } = require('../../src/lib')
const errorFieldsMock = require('../mock/expected/error-fields.json')
const fieldsEmptyMock = require('../mock/send/fields-empty.json')
const postSendMock = require('../mock/send/post-transaction.json')
const postExpectedMock = require('../mock/expected/post-transaction.json')
const getExpectedMock = require('../mock/expected/get-transactions.json')

const path = '/transactions'

describe('Transactions', () => {
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

  context('POST /transaction', () => {
    it('should returns 401 Unauthorized request credentials', async () => {
      await request.post(path)
        .set('clientid', 'teste')
        .set('clientkey', 'teste')
        .expect(401, 'Unauthorized request credentials')
    })

    it('should returns 404 User not found', async () => {
      sandbox.stub(user, 'confirmUser').rejects(new Error('ERROR_USER_NOT_FOUND'))
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(404, 'User not found')
    })

    it('should returns 400 Invalid credentials', async () => {
      sandbox.stub(user, 'confirmUser').rejects(new Error('ERROR_CREDENTIALS'))
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(400, 'Invalid credentials')
    })

    it('should returns 400 Check body request', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send({})
        .expect(400, 'Check body request')
    })

    it('should returns 400 Error fields', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(fieldsEmptyMock)
        .expect(400, errorFieldsMock)
    })

    it('should returns 404 Transaction not found', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'save').rejects(new Error('ERROR_TRANSACTION_NOT_FOUND'))
      sandbox.stub(payables, 'save').resolves(null)
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(postSendMock)
        .expect(404, 'Transaction not found')
    })

    it('should returns 500 There was a problem saving transaction', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'save').rejects(new Error('ERROR_CREATE_NEW_TRANSACTION'))
      sandbox.stub(payables, 'save').resolves(null)
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(postSendMock)
        .expect(500, 'There was a problem saving transaction')
    })

    it('should returns 404 Payable not found', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'save').resolves({ ...postExpectedMock, id: '1' })
      sandbox.stub(payables, 'save').rejects(new Error('ERROR_PLAYABLE_NOT_FOUND'))
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(postSendMock)
        .expect(404, 'Payable not found')
    })

    it('should returns 500 There was a problem saving payable', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'save').resolves({ ...postExpectedMock, id: '1' })
      sandbox.stub(payables, 'save').rejects(new Error('ERROR_CREATE_NEW_PAYABLE'))
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(postSendMock)
        .expect(500, 'There was a problem saving payable')
    })

    it('should returns 200', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'save').resolves({ ...postExpectedMock, id: '1' })
      sandbox.stub(payables, 'save').resolves(null)
      await request.post(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .send(postSendMock)
        .expect(200, postExpectedMock)
    })
  })

  context('GET /transactions', () => {
    it('should returns 401 Unauthorized request credentials', async () => {
      await request.get(path)
        .set('clientid', 'teste')
        .set('clientkey', 'teste')
        .expect(401, 'Unauthorized request credentials')
    })

    it('should returns 404 User not found', async () => {
      sandbox.stub(user, 'confirmUser').rejects(new Error('ERROR_USER_NOT_FOUND'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(404, 'User not found')
    })

    it('should returns 400 Invalid credentials', async () => {
      sandbox.stub(user, 'confirmUser').rejects(new Error('ERROR_CREDENTIALS'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(400, 'Invalid credentials')
    })

    it('should returns 404 Transaction not found', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'getAll').rejects(new Error('ERROR_TRANSACTION_NOT_FOUND'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(404, 'Transaction not found')
    })

    it('should returns 500 There was a problem get transaction', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'getAll').rejects(new Error('ERROR_GET_TRANSACTIONS'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(500, 'There was a problem get transaction')
    })

    it('should returns 200', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(transactions, 'getAll').resolves(getExpectedMock)
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(200, getExpectedMock)
    })
  })
})
