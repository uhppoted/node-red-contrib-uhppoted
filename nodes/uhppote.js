module.exports = {
  broadcast: async function (bind, dest, request, timeout) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const replies = []
    const rq = new Uint8Array(64)

    rq.set(request)

    const received = function (message) {
      replies.push(new Uint8Array(message))
    }

    try {
      await Promise.all([
        send(sock, dest, rq, received),
        wait(timeout)
      ])
    } finally {
      close(sock)
    }

    return new Promise(resolve => {
      resolve(replies)
    })
  },

  deviceId: function (bytes) {
    return bytes.getUint32(4, true)
  },

  address: function (bytes, offset) {
    const ip = require('ip')

    return ip.fromLong(bytes.getUint32(offset, false))
  },

  hexify: function (slice) {
    const bytes = new Uint8Array(slice)
    const hex = []

    for (let i = 0; i < bytes.length; i++) {
      hex.push(('0' + bytes[i].toString(16)).slice(-2))
    }

    return hex
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
  }
}

function send (sock, dest, request, handler) {
  return new Promise((resolve, reject) => {
    const ready = function () {
      sock.setBroadcast(true)
      sock.send(request, 0, request.length, 60000, dest, (err, bytes) => {
        if (err) {
          reject(err)
        } else {
          resolve(bytes)
        }
      })
    }

    const error = function (err) {
      reject(err)
    }

    sock.on('listening', () => { ready() })
    sock.on('message', (message, remote) => { handler(message) })
    sock.on('error', (err) => { error(err) })
    sock.bind(0)
  })
}

function wait (timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

function close (sock) {
  sock.close()
}
