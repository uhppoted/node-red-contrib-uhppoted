const describe = require('mocha').describe
const assert = require('chai').assert
const it = require('mocha').it
const expect = require('chai').expect
const resolve = require('../nodes/common.js').resolve

describe('common', function () {
  describe('resolve controller ID', function () {
    it('should resolve a uint32 controller argument', function () {
      const { controller, address, protocol } = resolve(405419896)

      expect(controller).to.equal(405419896)
      assert.isNull(address)
      expect(protocol).to.equal('udp')
    })

    // it('should resolve an object controller ID', function () {
    //   const { controller, _address, _protocol } = resolve({ controller: 405419896 })
    //
    //   expect(controller).to.equal(405419896)
    // })
  })
})
