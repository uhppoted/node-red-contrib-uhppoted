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

    it('should encode get-device request', function () {
      const bytes = codec.encode(0x94, 405419896)

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x94)
      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)
    })

    it('should encode set-address request', function () {
      const bytes = codec.encode(0x96, 405419896, {
        address: '192.168.1.125',
        subnet: '255.255.255.0',
        gateway: '192.168.0.1'
      })

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x96)
      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)

      expect(bytes[8]).to.equal(192)
      expect(bytes[9]).to.equal(168)
      expect(bytes[10]).to.equal(1)
      expect(bytes[11]).to.equal(125)

      expect(bytes[12]).to.equal(255)
      expect(bytes[13]).to.equal(255)
      expect(bytes[14]).to.equal(255)
      expect(bytes[15]).to.equal(0)

      expect(bytes[16]).to.equal(192)
      expect(bytes[17]).to.equal(168)
      expect(bytes[18]).to.equal(0)
      expect(bytes[19]).to.equal(1)

      expect(bytes[20]).to.equal(0x55)
      expect(bytes[21]).to.equal(0xaa)
      expect(bytes[22]).to.equal(0xaa)
      expect(bytes[23]).to.equal(0x55)
    })

    it('should encode get-time request', function () {
      const bytes = codec.encode(0x32, 405419896)

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x32)
      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)
    })
  })

  describe('#decode(...)', function () {
    it('should decode get-device response', function () {
      const msg = Buffer.from([
        0x17, 0x94, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0xff, 0xff, 0xff, 0x00,
        0xc0, 0xa8, 0x01, 0x01, 0x00, 0x12, 0x23, 0x34, 0x45, 0x56, 0x08, 0x92, 0x20, 0x20, 0x08, 0x25,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('device')
      expect(object.device.serialNumber).to.equal(405419896)
      expect(object.device.address).to.equal('192.168.1.100')
      expect(object.device.subnet).to.equal('255.255.255.0')
      expect(object.device.gateway).to.equal('192.168.1.1')
      expect(object.device.MAC).to.equal('00:12:23:34:45:56')
      expect(object.device.version).to.equal('0892')
      expect(object.device.date).to.equal('2020-08-25')
    })

    it('should decode get-time response', function () {
      const msg = Buffer.from([
        0x17, 0x32, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x20, 0x20, 0x08, 0x28, 0x14, 0x23, 0x56, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('datetime')
      expect(object.deviceId).to.equal(405419896)
      expect(object.datetime).to.equal('2020-08-28 14:23:56')
    })

    it('should decode event message', function () {
      const msg = Buffer.from([
        0x17, 0x20, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x47, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x01,
        0x02, 0x00, 0x01, 0x00, 0x20, 0x20, 0x08, 0x25, 0x10, 0x08, 0x40, 0x06, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x08, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x20, 0x08, 0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('event')
      expect(object.event.deviceId).to.equal(405419896)
      expect(object.event.event.index).to.equal(71)
      expect(object.event.event.type.code).to.equal(1)
      expect(object.event.event.type.event).to.equal('card swipe')
      expect(object.event.event.granted).to.equal(false)
      expect(object.event.event.door).to.equal(3)
      expect(object.event.event.direction.code).to.equal(1)
      expect(object.event.event.direction.direction).to.equal('in')
      expect(object.event.event.card).to.equal(65538)
      expect(object.event.event.timestamp).to.equal('2020-08-25 10:08:40')
      expect(object.event.event.reason.code).to.equal(6)
      expect(object.event.event.reason.reason).to.equal('no access rights')
      expect(object.event.doors).to.deep.equal([false, false, false, false])
      expect(object.event.buttons).to.deep.equal([false, false, false, false])
      expect(object.event.system.status).to.equal(0)
      expect(object.event.system.date).to.equal('2020-08-25')
      expect(object.event.system.time).to.equal('10:08:40')
      expect(object.event.relays.code).to.equal(0)
      expect(object.event.relays.locked).to.deep.equal({ 1: 0, 2: 0, 3: 0, 4: 0 })
      expect(object.event.inputs.code).to.equal(0)
      expect(object.event.inputs.forceLock).to.equal(false)
      expect(object.event.inputs.fireAlarm).to.equal(false)
    })
  })
})
