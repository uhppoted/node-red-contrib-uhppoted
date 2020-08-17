module.exports = {

  broadcast: async function (bind, dest, request, timeout, debug) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const replies = []
    const rq = new Uint8Array(64)

    rq.set(request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const wait = new Promise(resolve => {
      setTimeout(resolve, timeout)
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        sock.setBroadcast(true)

        if (debug) {
          console.log('request:', request)
        }

        sock.send(rq, 0, rq.length, 60000, dest, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            resolve(bytes)
          }
        })
      })

      sock.bind({
        addres: bind,
        port: 0
      })
    })

    sock.on('message', (message, remote) => {
      replies.push(new Uint8Array(message))

      if (debug) {
        console.log('reply:  ', message)
      }
    })

    try {
      await Promise.race([onerror, Promise.all([wait, send])])
    } finally {
      sock.close()
    }

    return replies
  },

  listen: function (bind, debug, handler) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)

    sock.on('error', (err) => {
      handler.onerror(err)
    })

    sock.on('message', (message, remote) => {
      if (debug) {
        console.log('reply:  ', message)
      }

      handler.received(remote, message)
    })

    let address = '0.0.0.0'
    let port = 60001

    if (bind) {
      const re = /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(?::([0-9]+))?$/
      const match = bind.match(re)

      if (match.length > 1) {
        address = match[1]
      }

      if (match.length > 2) {
        port = parseInt(match[2], 10)
      }
    }

    sock.bind({
      address: address,
      port: port
    })

    return sock
  },

  deviceId: function (bytes, offset) {
    return bytes.getUint32(offset, true)
  },

  address: function (bytes, offset) {
    const ip = require('ip')

    return ip.fromLong(bytes.getUint32(offset, false))
  },

  uint32: function (bytes, offset) {
    return bytes.getUint32(offset, true)
  },

  uint8: function (bytes, offset) {
    return bytes.getUint8(offset, true)
  },

  bool: function (bytes, offset) {
    return bytes.getUint8(offset, true) === 0x01
  },

  hexify: function (slice) {
    const bytes = new Uint8Array(slice)
    const hex = []

    for (let i = 0; i < bytes.length; i++) {
      hex.push(('0' + bytes[i].toString(16)).slice(-2))
    }

    return hex
  },

  yyyymmddHHmmss: function (slice) {
    const bytes = new Uint8Array(slice)
    const timestamp = []

    for (let i = 0; i < bytes.length; i++) {
      timestamp.push((bytes[i] >>> 4).toString(10))
      timestamp.push((bytes[i] & 0x0f).toString(10))
    }

    timestamp.splice(12, 0, ':')
    timestamp.splice(10, 0, ':')
    timestamp.splice(8, 0, ' ')
    timestamp.splice(6, 0, '-')
    timestamp.splice(4, 0, '-')

    return timestamp.join('')
  },

  yyyymmdd: function (slice) {
    const bytes = new Uint8Array(slice)
    const date = []

    for (let i = 0; i < bytes.length; i++) {
      date.push((bytes[i] >>> 4).toString(10))
      date.push((bytes[i] & 0x0f).toString(10))
    }

    date.splice(6, 0, '-')
    date.splice(4, 0, '-')

    return date.join('')
  },

  yymmdd: function (slice) {
    const bytes = new Uint8Array(slice)
    const date = ['2', '0']

    for (let i = 0; i < bytes.length; i++) {
      date.push((bytes[i] >>> 4).toString(10))
      date.push((bytes[i] & 0x0f).toString(10))
    }

    date.splice(6, 0, '-')
    date.splice(4, 0, '-')

    return date.join('')
  },

  HHmmss: function (slice) {
    const bytes = new Uint8Array(slice)
    const time = []

    for (let i = 0; i < bytes.length; i++) {
      time.push((bytes[i] >>> 4).toString(10))
      time.push((bytes[i] & 0x0f).toString(10))
    }

    time.splice(4, 0, ':')
    time.splice(2, 0, ':')

    return time.join('')
  },

  eventType: function (byte) {
    const event = {
      code: byte,
      event: 'unknown'
    }

    switch (byte) {
      case 0x00:
        event.event = 'none'
        break

      case 0x01:
        event.event = 'card swipe'
        break

      case 0x02:
        event.event = 'door'
        break

      case 0x03:
        event.event = 'alarm'
        break

      case 0xff:
        event.event = '<overwritten>'
        break
    }

    return event
  },

  direction: function (byte) {
    const direction = {
      code: byte,
      direction: 'unknown'
    }

    switch (byte) {
      case 0x01:
        direction.direction = 'in'
        break

      case 0x02:
        direction.direction = 'out'
        break
    }

    return direction
  },

  reason: function (byte) {
    const reason = {
      code: byte,
      reason: 'unknown'
    }

    switch (byte) {
      case 1:
        reason.reason = 'swipe'
        break

      case 5:
        reason.reason = 'swipe:denied (system)' // Access is managed by the system not the controller
        break

      case 6:
        reason.reason = 'no access rights' // swipe denied
        break

      case 7:
        reason.reason = 'incorrect password' // swipe denied
        break

      case 8:
        reason.reason = 'anti-passback' // swipe denied
        break

      case 9:
        reason.reason = 'more cards' //  // swipe denied (absolutely no idea what this means :-()
        break

      case 10:
        reason.reason = 'first card open' // swipe denied (no idea what this means either)
        break

      case 11:
        reason.reason = 'door is normally closed' // swipe denied
        break

      case 12:
        reason.reason = 'interlock' // swipe denied
        break

      case 13:
        reason.reason = 'not in allowed time period' // swipe denied
        break

      case 15:
        reason.reason = 'invalid timezone' // swipe denied
        break

      case 18:
        reason.reason = 'access denied' // swipe denied
        break

      case 20:
        reason.reason = 'push button ok'
        break

      case 23:
        reason.reason = 'door opened'
        break

      case 24:
        reason.reason = 'door closed'
        break

      case 25:
        reason.reason = 'door opened (supervisor password)'
        break

      case 28:
        reason.reason = 'controller power on'
        break

      case 29:
        reason.reason = 'controller reset'
        break

      case 31:
        reason.reason = 'pushbutton invalid (door locked)'
        break

      case 32:
        reason.reason = 'pushbutton invalid (offline)'
        break

      case 33:
        reason.reason = 'pushbutton invalid (interlock)'
        break

      case 34:
        reason.reason = 'pushbutton invalid (threat)'
        break

      case 37:
        reason.reason = 'door open too long'
        break

      case 38:
        reason.reason = 'forced open'
        break

      case 39:
        reason.reason = 'fire'
        break

      case 40:
        reason.reason = 'forced closed'
        break

      case 41:
        reason.reason = 'theft prevention'
        break

      case 42:
        reason.reason = '24x7 zone'
        break

      case 43:
        reason.reason = 'emergency'
        break

      case 44:
        reason.reason = 'remote open door'
        break

      case 45:
        reason.reason = 'remote open door (USB reader)'
        break

      default:
        reason.reason = '(reserved)'
        break
    }

    return reason
  }
}
