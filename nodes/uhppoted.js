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

        sock.send(rq, 0, rq.length, 60000, dest, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(debug, 'sent', request)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: bind,
        port: 0
      })
    })

    sock.on('message', (message, remote) => {
      replies.push(new Uint8Array(message))
      log(debug, 'received', message)
    })

    try {
      await Promise.race([onerror, Promise.all([wait, send])])
    } finally {
      sock.close()
    }

    return replies
  },

  execute: async function (bind, dest, request, timeout, debug) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const rq = new Uint8Array(64)
    let received = () => {}

    rq.set(request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const wait = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)

      received = (reply) => {
        clearTimeout(timer)
        resolve(reply)
      }
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        sock.setBroadcast(true)

        sock.send(rq, 0, rq.length, 60000, dest, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(debug, 'sent', request)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: bind,
        port: 0
      })
    })

    sock.on('message', (message, remote) => {
      log(debug, 'received', message)

      if (received) {
        received(new Uint8Array(message))
      }
    })

    try {
      const result = await Promise.race([onerror, Promise.all([wait, send])])

      if (result && result.length > 0) {
        return result[0]
      }
    } finally {
      sock.close()
    }

    throw new Error('no reply to request')
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
        console.log('received', message)
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

function log (debug, label, message) {
  if (debug) {
    if (typeof debug === 'function') {
      const pad = ' '.repeat(25)
      debug(label, pad + format(message, pad))
    } else {
      const prefix = ' '.repeat(18)
      const pad = ' '.repeat(26)
      console.log(prefix + '[debug] ' + label + '\n' + pad + format(message, pad))
    }
  }
}

function format (message, pad) {
  return message
    .toString('hex')
    .replace(/(.{2})/g, '$& ')
    .replace(/(.{24})/g, '$& ')
    .replace(/(.{50})/g, '$&\n' + pad)
    .trimEnd()
}
