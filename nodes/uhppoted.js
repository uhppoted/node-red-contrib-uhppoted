module.exports = {

  broadcast: async function (bind, dest, request, timeout, debug) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const addr = stringToIP(dest)
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

        sock.send(rq, 0, rq.length, addr.port, addr.address, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(debug, 'sent', request, addr)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      replies.push(new Uint8Array(message))
      log(debug, 'received', message, rinfo)
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
    const addr = stringToIP(dest)
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

        sock.send(rq, 0, rq.length, addr.port, addr.address, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(debug, 'sent', request, addr)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      log(debug, 'received', message, rinfo)

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

  send: async function (bind, dest, request, timeout, debug) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const addr = stringToIP(dest)
    const rq = new Uint8Array(64)

    rq.set(request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        sock.setBroadcast(true)

        sock.send(rq, 0, rq.length, addr.port, addr.address, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(debug, 'sent', request, addr)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      log(debug, 'received', message, rinfo)
    })

    try {
      const result = await Promise.race([onerror, Promise.all([send])])

      if (result && result.length > 0) {
        return new Uint8Array()
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

    sock.on('message', (message, rinfo) => {
      if (debug) {
        log(debug, 'received', message, rinfo)
      }

      handler.received(rinfo, message)
    })

    let address = '0.0.0.0'
    let port = 60001

    if (bind) {
      const re = /^(.*?)(?::([0-9]+))?$/
      const match = bind.match(re)

      if ((match.length > 1) && match[1]) {
        address = match[1]
      }

      if ((match.length > 2) && match[2]) {
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

function log (debug, label, message, rinfo) {
  let description = label

  if (rinfo) {
    description = `${label} ${rinfo.address}:${rinfo.port}`
  }

  if (debug) {
    if (typeof debug === 'function') {
      const pad = ' '.repeat(25)
      debug(description, pad + format(message, pad))
    } else {
      const prefix = ' '.repeat(18)
      const pad = ' '.repeat(26)
      console.log(prefix + '[debug] ' + description + '\n' + pad + format(message, pad))
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

function stringToIP (addr) {
  let address = addr
  let port = 60000

  const re = /^(.*?)(?::([0-9]+))?$/
  const match = addr.match(re)

  if ((match.length > 1) && match[1]) {
    address = match[1]
  }

  if ((match.length > 2) && match[2]) {
    port = parseInt(match[2], 10)
  }

  return {
    address: address,
    port: port
  }
}
