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

      sock.bind(0, bind)
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
