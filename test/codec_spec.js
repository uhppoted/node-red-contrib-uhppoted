// const helper = require('node-red-node-test-helper')
const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const codec = require('../nodes/codec.js')

describe('codec', function () {
  describe('#encode(...)', function () {
    it('should fail with error when encoding an invalid function code', function () {
      expect(() => { codec.encode(0xff) }).to.throw('invalid protocol function code 255')
    })

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

    it('should encode get-status request', function () {
      const bytes = codec.encode(0x20, 405419896)

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x20)

      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)
    })

    it('should encode get-listener request', function () {
      const bytes = codec.encode(0x92, 405419896)

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x92)

      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)
    })

    it('should encode set-listener request', function () {
      const bytes = codec.encode(0x90, 405419896, { address: '192.168.1.100', port: 60001 })

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x90)

      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)

      expect(bytes[8]).to.equal(192)
      expect(bytes[9]).to.equal(168)
      expect(bytes[10]).to.equal(1)
      expect(bytes[11]).to.equal(100)

      expect(bytes[12]).to.equal(0x61)
      expect(bytes[13]).to.equal(0xea)
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

    it('should encode set-time request', function () {
      const bytes = codec.encode(0x30, 405419896, { datetime: '2021-08-29 13:45:51' })

      expect(bytes).to.have.lengthOf(64)
      expect(bytes[0]).to.equal(0x17)
      expect(bytes[1]).to.equal(0x30)

      expect(bytes[4]).to.equal(0x78)
      expect(bytes[5]).to.equal(0x37)
      expect(bytes[6]).to.equal(0x2a)
      expect(bytes[7]).to.equal(0x18)

      expect(bytes[8]).to.equal(0x20)
      expect(bytes[9]).to.equal(0x21)
      expect(bytes[10]).to.equal(0x08)
      expect(bytes[11]).to.equal(0x29)

      expect(bytes[12]).to.equal(0x13)
      expect(bytes[13]).to.equal(0x45)
      expect(bytes[14]).to.equal(0x51)
    })

    it('should encode get-door-control request', function () {
      const msg = Buffer.from([
        0x17, 0x82, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x82, 405419896, { door: 3 })

      expect(bytes).to.deep.equal(msg)
    })
  })

  describe('#decode(...)', function () {
    it('should return null when decoding an invalid function code', function () {
      const msg = Buffer.from([
        0x17, 0xff, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0xff, 0xff, 0xff, 0x00,
        0xc0, 0xa8, 0x01, 0x01, 0x00, 0x12, 0x23, 0x34, 0x45, 0x56, 0x08, 0x92, 0x20, 0x20, 0x08, 0x25,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.equal(null) // don't particularly want to import the 'null' function from chai
    })

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

    it('should decode get-status response', function () {
      const msg = Buffer.from([
        0x17, 0x20, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x47, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x01,
        0x02, 0x00, 0x01, 0x00, 0x20, 0x20, 0x08, 0x25, 0x10, 0x08, 0x40, 0x06, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x08, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x20, 0x08, 0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('state')
      expect(object.deviceId).to.equal(405419896)
      expect(object.state.serialNumber).to.equal(405419896)
      expect(object.state.event.index).to.equal(71)
      expect(object.state.event.type.code).to.equal(1)
      expect(object.state.event.type.event).to.equal('card swipe')
      expect(object.state.event.granted).to.equal(false)
      expect(object.state.event.door).to.equal(3)
      expect(object.state.event.direction.code).to.equal(1)
      expect(object.state.event.direction.direction).to.equal('in')
      expect(object.state.event.card).to.equal(65538)
      expect(object.state.event.timestamp).to.equal('2020-08-25 10:08:40')
      expect(object.state.event.reason.code).to.equal(6)
      expect(object.state.event.reason.reason).to.equal('no access rights')
      expect(object.state.doors).to.deep.equal([false, false, false, false])
      expect(object.state.buttons).to.deep.equal([false, false, false, false])
      expect(object.state.system.status).to.equal(0)
      expect(object.state.system.date).to.equal('2020-08-25')
      expect(object.state.system.time).to.equal('10:08:40')
      expect(object.state.relays.state).to.equal(0)
      expect(object.state.relays.relays).to.deep.equal({ 1: false, 2: false, 3: false, 4: false })
      expect(object.state.inputs.state).to.equal(0)
      expect(object.state.inputs.forceLock).to.equal(false)
      expect(object.state.inputs.fireAlarm).to.equal(false)
    })

    it('should decode get-listener response', function () {
      const msg = Buffer.from([
        0x17, 0x92, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0x61, 0xea, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('address')
      expect(object).to.have.property('port')
      expect(object.deviceId).to.equal(405419896)
      expect(object.address).to.equal('192.168.1.100')
      expect(object.port).to.equal(60001)
    })

    it('should decode set-listener response', function () {
      const msg = Buffer.from([
        0x17, 0x90, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('updated')
      expect(object.deviceId).to.equal(405419896)
      expect(object.updated).to.equal(true)
    })

    it('should decode get-time response', function () {
      const msg = Buffer.from([
        0x17, 0x92, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0xe1, 0x5f, 0xea, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('address')
      expect(object).to.have.property('port')
      expect(object.deviceId).to.equal(405419896)
      expect(object.address).to.equal('192.168.1.225')
      expect(object.port).to.equal(59999)
    })

    it('should decode set-time response', function () {
      const msg = Buffer.from([
        0x17, 0x30, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x20, 0x21, 0x08, 0x28, 0x14, 0x23, 0x56, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.not.equal(null) // don't particularly want to import the 'null' function from chai
      expect(object).to.have.property('deviceId')
      expect(object).to.have.property('datetime')
      expect(object.deviceId).to.equal(405419896)
      expect(object.datetime).to.equal('2021-08-28 14:23:56')
    })

    it('should decode get-door-control response', function () {
      const expected = {
        deviceId: 405419896,
        doorControlState: {
          door: 4,
          delay: 7,
          value: 3,
          state: 'controlled'
        }
      }

      const msg = Buffer.from([
        0x17, 0x82, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x04, 0x03, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
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
      expect(object.deviceId).to.equal(405419896)
      expect(object).to.have.property('state')
      expect(object.state.serialNumber).to.equal(405419896)
      expect(object.state.event.index).to.equal(71)
      expect(object.state.event.type.code).to.equal(1)
      expect(object.state.event.type.event).to.equal('card swipe')
      expect(object.state.event.granted).to.equal(false)
      expect(object.state.event.door).to.equal(3)
      expect(object.state.event.direction.code).to.equal(1)
      expect(object.state.event.direction.direction).to.equal('in')
      expect(object.state.event.card).to.equal(65538)
      expect(object.state.event.timestamp).to.equal('2020-08-25 10:08:40')
      expect(object.state.event.reason.code).to.equal(6)
      expect(object.state.event.reason.reason).to.equal('no access rights')
      expect(object.state.doors).to.deep.equal([false, false, false, false])
      expect(object.state.buttons).to.deep.equal([false, false, false, false])
      expect(object.state.system.status).to.equal(0)
      expect(object.state.system.date).to.equal('2020-08-25')
      expect(object.state.system.time).to.equal('10:08:40')
      expect(object.state.relays.state).to.equal(0)
      expect(object.state.relays.relays).to.deep.equal({ 1: false, 2: false, 3: false, 4: false })
      expect(object.state.inputs.state).to.equal(0)
      expect(object.state.inputs.forceLock).to.equal(false)
      expect(object.state.inputs.fireAlarm).to.equal(false)
    })
  })
})
