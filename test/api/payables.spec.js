const faker = require('faker')
const sinon = require('sinon')
const { createServer } = require('../helpers/create-server')
const { user, payables } = require('../../src/lib')
const getExpectedMock = require('../mock/expected/get-payables.json')

const path = '/payables'

describe('Payables', () => {
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

  context('GET /payables', () => {
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

    it('should returns 404 Payable not found', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(payables, 'getAll').rejects(new Error('ERROR_PLAYABLE_NOT_FOUND'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(404, 'Payable not found')
    })

    it('should returns 500 There was a problem get payable', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(payables, 'getAll').rejects(new Error('ERROR_GET_PLAYABLES'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(500, 'There was a problem get payable')
    })

    it('should returns 200', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(payables, 'getAll').resolves(getExpectedMock)
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .expect(200, getExpectedMock)
    })
  })

  context('GET /payables?balance', () => {
    it('should returns 404 Payable not found', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(payables, 'getBalance').rejects(new Error('ERROR_PLAYABLE_NOT_FOUND'))
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .query({ balance: 'waiting_funds' })
        .expect(404, 'Payable not found')
    })

    it('should returns 200 Balance type not valid', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      sandbox.stub(payables, 'getAll').resolves(getExpectedMock)
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .query({ balance: 'test' })
        .expect(200, getExpectedMock)
    })

    it('should returns 200 Balance type paid', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      const expectedBalance = {
        balance: '231.49',
        type: 'paid'
      }
      sandbox.stub(payables, 'getBalance').resolves(expectedBalance)
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .query({ balance: 'paid' })
        .expect(200, expectedBalance)
    })

    it('should returns 200 Balance type waiting_funds', async () => {
      sandbox.stub(user, 'confirmUser').resolves(1)
      const expectedBalance = {
        balance: '145.67',
        type: 'waiting_funds'
      }
      sandbox.stub(payables, 'getBalance').resolves(expectedBalance)
      await request.get(path)
        .set('clientid', credentials.clientId)
        .set('clientkey', credentials.clientKey)
        .query({ balance: 'waiting_funds' })
        .expect(200, expectedBalance)
    })
  })
})
