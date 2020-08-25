// const helper = require('node-red-node-test-helper')
const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const codec = require('../nodes/codec.js')

describe('codec', function () {
  describe('#encode(...)', function () {
    it('should encode get-devices request', function () {
      const bytes = codec.encode(0x94)

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x94)
      expect(bytes[4]).to.equal(0x00)
      expect(bytes[5]).to.equal(0x00)
      expect(bytes[6]).to.equal(0x00)
      expect(bytes[7]).to.equal(0x00)
    })
  })
})
