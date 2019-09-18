var assert = require('assert')

describe('Transactions', () => {
  describe('POST /transaction', () => {
    it('should return -1 when the value is not present', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
  describe('GET /transactions', () => {
    it('should return -1 when the value is not present', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
