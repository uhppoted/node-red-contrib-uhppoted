module.exports = {
  /**
    * Encodes a request as a 64 byte UDP message.
    *
    * @param {opcode}   code     Function opcode, translated into message function byte
    * @param {number}   deviceId The serial number for the target access controller
    * @param {object}   object   Additional request specific information.
    *
    * @param {buffer}   64 byte NodeJS Buffer
    *
    * @author: TS
    * @exports
    */
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

  /**
    * Decodes a 64 byte received message into the corresponding object.
    *
    * @param {buffer}   buffer     64 byte NodeJS buffer
    * @param {function} translator (optional) function to internationalise the text in a decoded object
    *
    * @param {object}   Decoded object (or null)
    *
    * @author: TS
    * @exports
    */
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
            control: lookup.doorState(bytes, 9, translator)
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

/**
  * Internal utility function to decode the (large) response to a get-status request
  * (function code: 0x20).
  *
  * @param {buffer}   buffer     64 byte NodeJS buffer
  * @param {function} translator (optional) function to internationalise the text in a
  *                              decoded object
  *
  * @param {object}   Decoded status object
  *
  * @author: TS
  */
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

/**
  * Internal utility function to decode the response to a get-device request (function code: 0x94).
  *
  * @param {buffer}   buffer     64 byte NodeJS buffer
  *
  * @param {object}   Decoded device object
  *
  * @author: TS
  */
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

/**
  * Internal utility function to extract a uint8 from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of uint8 in buffer
  *
  * @param {uint8}  uint8 at offset in buffer.
  *
  * @author: TS
  */
function uint8 (bytes, offset) {
  return bytes.getUint8(offset, true)
}

/**
  * Internal utility function to extract a uint16 from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of uint16 in buffer
  *
  * @param {uint16}  Litte-endian uint16 at offset in buffer.
  *
  * @author: TS
  */
function uint16 (bytes, offset) {
  return bytes.getUint16(offset, true)
}

/**
  * Internal utility function to extract a uint32 from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of uint32 in buffer
  *
  * @param {uint32}  Litte-endian uint32 at offset in buffer.
  *
  * @author: TS
  */
function uint32 (bytes, offset) {
  return bytes.getUint32(offset, true)
}

/**
  * Internal utility function to extract a bool from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of bool in buffer
  *
  * @param {bool}   true if the byte at the offset is 1, false otherwise.
  *
  * @author: TS
  */
function bool (bytes, offset) {
  return bytes.getUint8(offset, true) === 0x01
}

/**
  * Internal utility function to extract a BCD number from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of BCD number in buffer
  * @param {number} length  Number of bytes to decode
  *
  * @param {string}  Decoded number as a string.
  *
  * @author: TS
  */
function bcd (bytes, offset, length) {
  const slice = new Uint8Array(bytes.buffer.slice(offset, offset + length))
  const digits = []

  for (let i = 0; i < slice.length; i++) {
    digits.push((slice[i] >>> 4).toString(10))
    digits.push((slice[i] & 0x0f).toString(10))
  }

  return digits.join('')
}

/**
  * Internal utility function to extract an IP address from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of IP address in buffer
  *
  * @param {string}  Decoded 4 byte IPv4 address as a IP address object.
  *
  * @author: TS
  */
function address (bytes, offset) {
  const ip = require('ip')

  return ip.fromLong(bytes.getUint32(offset, false))
}

/**
  * Internal utility function to extract a MAC address from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of MAC address in buffer
  *
  * @param {string}  Decoded 6 byte MAC address as a colon delimited string.
  *
  * @author: TS
  */
function mac (bytes, offset) {
  const slice = new Uint8Array(bytes.buffer.slice(offset, offset + 6))
  const hex = []

  for (let i = 0; i < slice.length; i++) {
    hex.push(('0' + slice[i].toString(16)).slice(-2))
  }

  return hex.join(':')
}

/**
  * Internal utility function to extract a BCD timestamp from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of timestamp in buffer
  *
  * @param {string}  Decoded 6 byte timestamp in yyy-mm-dd HH:mm:ss format.
  *
  * @author: TS
  */
function yyyymmddHHmmss (bytes, offset) {
  const datetime = bcd(bytes, offset, 7)
  const date = datetime.substr(0, 4) + '-' + datetime.substr(4, 2) + '-' + datetime.substr(6, 2)
  const time = datetime.substr(8, 2) + ':' + datetime.substr(10, 2) + ':' + datetime.substr(12, 2)

  return date + ' ' + time
}

/**
  * Internal utility function to extract a BCD date from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of date in buffer
  *
  * @param {string}  Decoded 4 byte date in yyyy-mm-dd format.
  *
  * @author: TS
  */
function yyyymmdd (bytes, offset) {
  const date = bcd(bytes, offset, 4)

  if (date === '00000000') {
    return ''
  }

  return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2)
}

/**
  * Internal utility function to extract an abbreviated BCD date from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of date in buffer
  *
  * @param {string}  Decoded 3 byte date in yyyy-mm-dd format (assumes base centry is 2000).
  *
  * @author: TS
  */
function yymmdd (bytes, offset) {
  const date = '20' + bcd(bytes, offset, 3)

  return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2)
}

/**
  * Internal utility function to extract a BCD time from a response message.
  *
  * @param {array}  buffer  64 byte DataView
  * @param {number} offset  Index of time in buffer
  *
  * @param {string}  Decoded 3 byte time in HH:mm:ss format.
  *
  * @author: TS
  */
function HHmmss (bytes, offset) {
  const time = bcd(bytes, offset, 3)

  return time.substr(0, 2) + ':' + time.substr(2, 2) + ':' + time.substr(4, 2)
}

/**
  * Internal utility function to encode a date as BCD.
  *
  * @param {string} date    Date, formatted as yyyy-mm-dd
  * @param {number} offset  Index of time in buffer
  *
  * @param {buffer} 4 byte NodeJS buffer with BCD encoded timestamp
  *
  * @author: TS
  */
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

/**
  * Internal utility function to encode a timestamp as BCD.
  *
  * @param {string} datetime Timestamp, formatted as yyyy-mm-dd HH:mm:ss
  * @param {number} offset   Index of time in buffer
  *
  * @param {buffer} 6 byte NodeJS buffer with BCD encoded timestamp.
  *
  * @author: TS
  */
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
