module.exports = {
  broadcast: async function (bind, dest, request, timeout) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const replies = []
    const rq = new Uint8Array(64)

    rq.set(request)

    let onerror = function (err) {
      console.log(err)
    }

    const received = function (message) {
      replies.push(new Uint8Array(message))
    }

    const send = function () {
      return new Promise((resolve, reject) => {
        onerror = function (err) {
          reject(err)
        }

        const ready = function () {
          sock.setBroadcast(true)
          sock.send(rq, 0, rq.length, 60000, dest, (err, bytes) => {
            if (err) {
              reject(err)
            } else {
              resolve(bytes)
            }
          })
        }

        sock.on('listening', () => { ready() })
        sock.on('message', (message, remote) => { received(message) })
        sock.on('error', (err) => { onerror(err) })
        sock.bind(0)
      })
    }

    const failed = function () {
      return new Promise((resolve, reject) => {
        onerror = function (err) {
          reject(err)
        }
      })
    }

    try {
      await send()
      await Promise.race([
        wait(timeout),
        failed()
      ])
    } finally {
      sock.close()
    }

    // return new Promise(resolve => {
    //   resolve(replies)
    // })

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

function wait (timeout) {
  return new Promise(resolve => { setTimeout(resolve, timeout) })
}
