module.exports = {
  GetDevice: function (deviceId) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x94, 1)
    if (deviceId !== null) {
      request.writeUInt32LE(deviceId, 4)
    }

    return request
  },

  SetIP: function (deviceId, object) {
    const ip = require('ip')
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x96, 1)
    request.writeUInt32LE(deviceId, 4)
    ip.toBuffer(object.address, request, 8)
    ip.toBuffer(object.netmask, request, 12)
    ip.toBuffer(object.gateway, request, 16)
    request.writeUInt32LE(0x55aaaa55, 20)

    return request
  },

  GetListener: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x92, 1)
    request.writeUInt32LE(deviceId, 4)

    return request
  },

  SetListener: function (deviceId, object) {
    const ip = require('ip')
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x90, 1)
    request.writeUInt32LE(deviceId, 4)
    ip.toBuffer(object.address, request, 8)
    request.writeUInt16LE(object.port, 12)

    return request
  },

  GetTime: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x32, 1)
    request.writeUInt32LE(deviceId, 4)

    return request
  },

  SetTime: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x30, 1)
    request.writeUInt32LE(deviceId, 4)
    datetime2bin(object.datetime).copy(request, 8)

    return request
  },

  GetDoorControl: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x82, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt8(object.door, 8)

    return request
  },

  SetDoorControl: function (deviceId, object) {
    const opcodes = require('../nodes/opcodes.js')

    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
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
        throw new Error(`invalid door control ${object.control}`)
    }

    return request
  },

  GetStatus: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x20, 1)
    request.writeUInt32LE(deviceId, 4)

    return request
  },

  OpenDoor: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x40, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt8(object.door, 8)

    return request
  },

  GetCards: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x58, 1)
    request.writeUInt32LE(deviceId, 4)

    return request
  },

  GetCardByID: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x5a, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.card.number, 8)

    return request
  },

  GetCardByIndex: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x5c, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.card.index, 8)

    return request
  },

  PutCard: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x50, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.card.number, 8)
    date2bin(object.card.valid.from).copy(request, 12)
    date2bin(object.card.valid.to).copy(request, 16)
    request.writeUInt8(object.card.doors['1'] ? 0x01 : 0x00, 20)
    request.writeUInt8(object.card.doors['2'] ? 0x01 : 0x00, 21)
    request.writeUInt8(object.card.doors['3'] ? 0x01 : 0x00, 22)
    request.writeUInt8(object.card.doors['4'] ? 0x01 : 0x00, 23)

    return request
  },

  DeleteCard: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x52, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.card.number, 8)

    return request
  },

  DeleteCards: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0x54, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(0x55aaaa55, 8)

    return request
  },

  GetEventIndex: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0xb4, 1)
    request.writeUInt32LE(deviceId, 4)

    return request
  },

  SetEventIndex: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0xb2, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.index, 8)
    request.writeUInt32LE(0x55aaaa55, 12)

    return request
  },

  GetEvent: function (deviceId, object) {
    const request = Buffer.alloc(64)

    request.writeUInt8(0x17, 0)
    request.writeUInt8(0xb0, 1)
    request.writeUInt32LE(deviceId, 4)
    request.writeUInt32LE(object.index, 8)

    return request
  }
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
