module.exports = {

  decode: function (buffer) {
    if ((buffer.length !== 64) || (buffer[0] !== 0x17)) {
      return null
    }

    const bytes = new DataView(buffer.buffer)

    switch (buffer[1]) {
      case 0x20:
        return { event: event(bytes) }

      case 0x94:
        return { device: device(bytes) }

      default:
        return null
    }
  }
}

// function code: 0x20
function event (bytes) {
  const lookup = require('./lookup.js')

  return {
    deviceId: uint32(bytes, 4),
    event: {
      index: uint32(bytes, 8),
      type: lookup.eventType(bytes, 12),
      granted: bool(bytes, 13),
      door: uint8(bytes, 14),
      direction: lookup.direction(bytes, 15),
      card: uint32(bytes, 16),
      timestamp: yyyymmddHHmmss(bytes, 20),
      reason: lookup.reason(bytes, 27)
    },
    doors: [
      bool(bytes, 28),
      bool(bytes, 29),
      bool(bytes, 30),
      bool(bytes, 31)
    ],
    buttons: [
      bool(bytes, 32),
      bool(bytes, 33),
      bool(bytes, 34),
      bool(bytes, 35)
    ],
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
    deviceId: uint32(bytes, 4),
    address: address(bytes, 8),
    subnet: address(bytes, 12),
    gateway: address(bytes, 16),
    MAC: mac(bytes, 20),
    version: bcd(bytes, 26, 2),
    date: yyyymmdd(bytes, 28)
  }
}

function uint8 (bytes, offset) {
  return bytes.getUint8(offset, true)
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
  const timestamp = bcd(bytes, offset, 7)
  const date = timestamp.substr(0, 4) + '-' + timestamp.substr(4, 2) + '-' + timestamp.substr(6, 2)
  const time = timestamp.substr(8, 2) + ':' + timestamp.substr(10, 2) + ':' + timestamp.substr(12, 2)

  return date + ' ' + time
}

function yyyymmdd (bytes, offset) {
  const date = bcd(bytes, offset, 4)

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
