const describe = require('mocha').describe
const assert = require('chai').assert
const it = require('mocha').it
const expect = require('chai').expect
const resolve = require('../nodes/common.js').resolve

describe('common', function () {
  describe('resolve controller ID', function () {
    it('should resolve a legacy uint32 deviceId argument', function () {
      const { controller, address, protocol } = resolve({ deviceId: 405419896 })

      expect(controller).to.equal(405419896)
      assert.isNull(address)
      expect(protocol).to.equal('udp')
    })

    it('should resolve a uint32 controller argument', function () {
      const { controller, address, protocol } = resolve({ controller: 405419896 })

      expect(controller).to.equal(405419896)
      assert.isNull(address)
      expect(protocol).to.equal('udp')
    })

    it('should resolve an object controller ID', function () {
      const { controller, _address, _protocol } = resolve({ controller: { controller: 405419896 } })

      expect(controller).to.equal(405419896)
    })
  })

  describe('resolve controller address', function () {
    it('should resolve a missing controller address argument', function () {
      const { controller, address, protocol } = resolve({ controller: { controller: 405419896, protocol: 'tcp' } })

      expect(controller).to.equal(405419896)
      assert.isNull(address)
      expect(protocol).to.equal('udp')
    })

    it('should resolve a controller address {address,port} argument', function () {
      const { _controller, address, protocol } = resolve({ controller: { address: { address: '192.168.1.100', port: 12345 }, protocol: 'tcp' } })

      expect(address).to.deep.equal({ address: '192.168.1.100', port: 12345 })
      expect(protocol).to.equal('tcp')
    })

    it('should resolve a controller {address} argument', function () {
      const { _controller, address, protocol } = resolve({ controller: { controller: 405419896, address: { address: '192.168.1.100' }, protocol: 'tcp' } })

      expect(address).to.deep.equal({ address: '192.168.1.100', port: 60000 })
      expect(protocol).to.equal('tcp')
    })

    it('should resolve a controller string address argument', function () {
      const { _controller, address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'tcp' } })

      expect(address).to.deep.equal({ address: '192.168.1.100', port: 60000 })
      expect(protocol).to.equal('tcp')
    })

    it('should resolve a controller string address:port argument', function () {
      const { _controller, address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100:12345', protocol: 'tcp' } })

      expect(address).to.deep.equal({ address: '192.168.1.100', port: 12345 })
      expect(protocol).to.equal('tcp')
    })
  })

  describe('resolve controller protocol', function () {
    it("should resolve a 'udp' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'udp' } })

      expect(protocol).to.equal('udp')
    })

    it("should resolve a 'UDP' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'UDP' } })

      expect(protocol).to.equal('udp')
    })

    it("should resolve a 'tcp' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'tcp' } })

      expect(protocol).to.equal('tcp')
    })

    it("should resolve a 'TCP' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'TCP' } })

      expect(protocol).to.equal('tcp')
    })

    it("should resolve a '' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: '' } })

      expect(protocol).to.equal('udp')
    })

    it("should resolve a 'weird' controller protocol argument", function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, address: '192.168.1.100', protocol: 'weird' } })

      expect(protocol).to.equal('udp')
    })

    it('should resolve a missing controller protocol argument', function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, addres: '192.168.1.100' } })

      expect(protocol).to.equal('udp')
    })

    it('should resolve a null controller protocol argument', function () {
      const { _controller, _address, protocol } = resolve({ controller: { controller: 405419896, addres: '192.168.1.100', protocol: null } })

      expect(protocol).to.equal('udp')
    })
  })
})
