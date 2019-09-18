var assert = require('assert')

describe('Payable', () => {
  describe('GET /payables', () => {
    it('should return -1 when the value is not present', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
  describe('GET /payables?status', () => {
    it('should return -1 when the value is not present', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
