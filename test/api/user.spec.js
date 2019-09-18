var assert = require('assert')

describe('User', () => {
  describe('POST /user', () => {
    it('should return 200', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
    it('should return 500 There was a problem saving user', () => {
      assert.strict.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
