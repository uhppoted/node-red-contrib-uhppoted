module.exports = {
  encode: function (code, deviceId, object) {
    const ip = require('ip')
    const request = Buffer.alloc(64)
    const opcodes = require('../nodes/opcodes.js')

    request.writeUInt8(0x17, 0)

    switch (code) {
      case opcodes.GetDevice:
        request.writeUInt8(0x94, 1)
        if (deviceId !== null) {
          request.writeUInt32LE(deviceId, 4)
        }
        break

      case opcodes.SetIP:
        request.writeUInt8(0x96, 1)
        request.writeUInt32LE(deviceId, 4)
        ip.toBuffer(object.address, request, 8)
        ip.toBuffer(object.netmask, request, 12)
        ip.toBuffer(object.gateway, request, 16)
        request.writeUInt32LE(0x55aaaa55, 20)
        break

      case opcodes.GetListener:
        request.writeUInt8(0x92, 1)
        request.writeUInt32LE(deviceId, 4)
        break

      case opcodes.SetListener:
        request.writeUInt8(0x90, 1)
        request.writeUInt32LE(deviceId, 4)
        ip.toBuffer(object.address, request, 8)
        request.writeUInt16LE(object.port, 12)
        break

      case opcodes.GetTime:
        request.writeUInt8(0x32, 1)
        request.writeUInt32LE(deviceId, 4)
        break

      case opcodes.SetTime:
        request.writeUInt8(0x30, 1)
        request.writeUInt32LE(deviceId, 4)
        datetime2bin(object.datetime).copy(request, 8)
        break

      case opcodes.GetDoorControl:
        request.writeUInt8(0x82, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt8(object.door, 8)
        break

      case opcodes.SetDoorControl:
        request.writeUInt8(0x80, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt8(object.door, 8)
        request.writeUInt8(object.delay, 10)
        switch (object.control) {
          case opcodes.NormallyOpen:
            request.writeUInt8(1, 9)
            break

          case opcodes.NormallyClosed:
            request.writeUInt8(2, 9)
            break

          case opcodes.Controlled:
            request.writeUInt8(3, 9)
            break

          default:
            throw new Error(`invalid door control ${code}`, object.control)
        }
        break

      case opcodes.GetStatus:
        request.writeUInt8(0x20, 1)
        request.writeUInt32LE(deviceId, 4)
        break

      case opcodes.OpenDoor:
        request.writeUInt8(0x40, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt8(object.door, 8)
        break

      case opcodes.GetCards:
        request.writeUInt8(0x58, 1)
        request.writeUInt32LE(deviceId, 4)
        break

      case opcodes.GetCardByID:
        request.writeUInt8(0x5a, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.card.number, 8)
        break

      case opcodes.GetCardByIndex:
        request.writeUInt8(0x5c, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.card.index, 8)
        break

      case opcodes.PutCard:
        request.writeUInt8(0x50, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.card.number, 8)
        date2bin(object.card.valid.from).copy(request, 12)
        date2bin(object.card.valid.to).copy(request, 16)
        request.writeUInt8(object.card.doors['1'] ? 0x01 : 0x00, 20)
        request.writeUInt8(object.card.doors['2'] ? 0x01 : 0x00, 21)
        request.writeUInt8(object.card.doors['3'] ? 0x01 : 0x00, 22)
        request.writeUInt8(object.card.doors['4'] ? 0x01 : 0x00, 23)
        break

      case opcodes.DeleteCard:
        request.writeUInt8(0x52, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.card.number, 8)
        break

      case opcodes.DeleteCards:
        request.writeUInt8(0x54, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(0x55aaaa55, 8)
        break

      case opcodes.GetEventIndex:
        request.writeUInt8(0xb4, 1)
        request.writeUInt32LE(deviceId, 4)
        break

      case opcodes.SetEventIndex:
        request.writeUInt8(0xb2, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.index, 8)
        request.writeUInt32LE(0x55aaaa55, 12)
        break

      case opcodes.GetEvent:
        request.writeUInt8(0xb0, 1)
        request.writeUInt32LE(deviceId, 4)
        request.writeUInt32LE(object.index, 8)
        break

      default:
        throw new Error(`invalid protocol function code ${code}`)
    }

    return request
  },

  decode: function (buffer, translator) {
    const lookup = require('./lookup.js')

    if ((buffer.length !== 64) || (buffer[0] !== 0x17)) {
      return null
    }

    const bytes = new DataView(buffer.buffer)

    switch (buffer[1]) {
      case 0x20:
        return {
          deviceId: uint32(bytes, 4),
          state: state(bytes, translator)
        }

      case 0x30:
        return {
          deviceId: uint32(bytes, 4),
          datetime: yyyymmddHHmmss(bytes, 8)
        }

      case 0x32:
        return {
          deviceId: uint32(bytes, 4),
          datetime: yyyymmddHHmmss(bytes, 8)
        }

      case 0x40:
        return {
          deviceId: uint32(bytes, 4),
          opened: bool(bytes, 8)
        }

      case 0x50:
        return {
          deviceId: uint32(bytes, 4),
          stored: bool(bytes, 8)
        }

      case 0x52:
        return {
          deviceId: uint32(bytes, 4),
          deleted: bool(bytes, 8)
        }

      case 0x54:
        return {
          deviceId: uint32(bytes, 4),
          deleted: bool(bytes, 8)
        }

      case 0x58:
        return {
          deviceId: uint32(bytes, 4),
          cards: uint32(bytes, 8)
        }

      case 0x5a:
      case 0x5c:
        return {
          deviceId: uint32(bytes, 4),
          card: {
            number: uint32(bytes, 8),
            valid: {
              from: yyyymmdd(bytes, 12),
              to: yyyymmdd(bytes, 16)
            },
            doors: {
              1: bool(bytes, 20),
              2: bool(bytes, 21),
              3: bool(bytes, 22),
              4: bool(bytes, 23)
            }
          }
        }

      case 0x80:
      case 0x82:
        return {
          deviceId: uint32(bytes, 4),
          doorControlState: {
            door: uint8(bytes, 8),
            delay: uint8(bytes, 10),
            control: {
              value: uint8(bytes, 9),
              state: lookup.doorState(bytes, 9, translator)
            }
          }
        }

      case 0x90:
        return {
          deviceId: uint32(bytes, 4),
          updated: bool(bytes, 8)
        }

      case 0x92:
        return {
          deviceId: uint32(bytes, 4),
          address: address(bytes, 8),
          port: uint16(bytes, 12)
        }

      case 0x94:
        return {
          deviceId: uint32(bytes, 4),
          device: device(bytes)
        }

      case 0xb0:
        return {
          deviceId: uint32(bytes, 4),
          event: {
            index: uint32(bytes, 8),
            type: lookup.eventType(bytes, 12, translator),
            granted: bool(bytes, 13),
            door: uint8(bytes, 14),
            direction: lookup.direction(bytes, 15, translator),
            card: uint32(bytes, 16),
            timestamp: yyyymmddHHmmss(bytes, 20),
            reason: lookup.reason(bytes, 27, translator)
          }
        }

      case 0xb4:
        return {
          deviceId: uint32(bytes, 4),
          index: uint32(bytes, 8)
        }

      case 0xb2:
        return {
          deviceId: uint32(bytes, 4),
          updated: bool(bytes, 8)
        }

      default:
        return null
    }
  }
}

// function code: 0x20
function state (bytes, translator) {
  const lookup = require('./lookup.js')

  return {
    serialNumber: uint32(bytes, 4),
    event: {
      index: uint32(bytes, 8),
      type: lookup.eventType(bytes, 12, translator),
      granted: bool(bytes, 13),
      door: uint8(bytes, 14),
      direction: lookup.direction(bytes, 15, translator),
      card: uint32(bytes, 16),
      timestamp: yyyymmddHHmmss(bytes, 20),
      reason: lookup.reason(bytes, 27, translator)
    },
    doors: {
      1: bool(bytes, 28),
      2: bool(bytes, 29),
      3: bool(bytes, 30),
      4: bool(bytes, 31)
    },
    buttons: {
      1: bool(bytes, 32),
      2: bool(bytes, 33),
      3: bool(bytes, 34),
      4: bool(bytes, 35)
    },
    system: {
      status: uint8(bytes, 36),
      date: yymmdd(bytes, 51),
      time: HHmmss(bytes, 37)
    },
    specialInfo: uint8(bytes, 48),
    relays: lookup.relays(bytes, 49),
    inputs: lookup.inputs(bytes, 50)
  }
}

// function code: 0x94
function device (bytes) {
  return {
    serialNumber: uint32(bytes, 4),
    address: address(bytes, 8),
    netmask: address(bytes, 12),
    gateway: address(bytes, 16),
    MAC: mac(bytes, 20),
    version: bcd(bytes, 26, 2),
    date: yyyymmdd(bytes, 28)
  }
}

function uint8 (bytes, offset) {
  return bytes.getUint8(offset, true)
}

function uint16 (bytes, offset) {
  return bytes.getUint16(offset, true)
}

function uint32 (bytes, offset) {
  return bytes.getUint32(offset, true)
}

function bool (bytes, offset) {
  return bytes.getUint8(offset, true) === 0x01
}

function bcd (bytes, offset, length) {
  const slice = new Uint8Array(bytes.buffer.slice(offset, offset + length))
  const digits = []

  for (let i = 0; i < slice.length; i++) {
    digits.push((slice[i] >>> 4).toString(10))
    digits.push((slice[i] & 0x0f).toString(10))
  }

  return digits.join('')
}

function address (bytes, offset) {
  const ip = require('ip')

  return ip.fromLong(bytes.getUint32(offset, false))
}

function mac (bytes, offset) {
  const slice = new Uint8Array(bytes.buffer.slice(offset, offset + 6))
  const hex = []

  for (let i = 0; i < slice.length; i++) {
    hex.push(('0' + slice[i].toString(16)).slice(-2))
  }

  return hex.join(':')
}

function yyyymmddHHmmss (bytes, offset) {
  const datetime = bcd(bytes, offset, 7)
  const date = datetime.substr(0, 4) + '-' + datetime.substr(4, 2) + '-' + datetime.substr(6, 2)
  const time = datetime.substr(8, 2) + ':' + datetime.substr(10, 2) + ':' + datetime.substr(12, 2)

  return date + ' ' + time
}

function yyyymmdd (bytes, offset) {
  const date = bcd(bytes, offset, 4)

  if (date === '00000000') {
    return ''
  }

  return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2)
}

function yymmdd (bytes, offset) {
  const date = '20' + bcd(bytes, offset, 3)

  return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2)
}

function HHmmss (bytes, offset) {
  const time = bcd(bytes, offset, 3)

  return time.substr(0, 2) + ':' + time.substr(2, 2) + ':' + time.substr(4, 2)
}

function date2bin (date) {
  const bytes = []
  const re = /([0-9]{2})([0-9]{2})-([0-9]{2})-([0-9]{2})/
  const match = date.match(re)

  for (const m of match.slice(1)) {
    const b = parseInt(m, 10)
    const byte = ((b / 10) << 4) | (b % 10)
    bytes.push(byte)
  }

  return Buffer.from(bytes)
}

function datetime2bin (datetime) {
  const bytes = []
  const re = /([0-9]{2})([0-9]{2})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/
  const match = datetime.match(re)

  for (const m of match.slice(1)) {
    const b = parseInt(m, 10)
    const byte = ((b / 10) << 4) | (b % 10)
    bytes.push(byte)
  }

  return Buffer.from(bytes)
}
