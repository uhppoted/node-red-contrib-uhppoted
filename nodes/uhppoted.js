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
          console.log('sent:    ', format(request))
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
        console.log('received:', format(message))
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
        console.log('received:', format(message))
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
  }
}

function format (message) {
  return message
    .toString('hex')
    .replace(/(.{2})/g, '$& ')
    .replace(/(.{24})/g, '$& ')
    .replace(/(.{50})/g, '$&\n          ')
}
