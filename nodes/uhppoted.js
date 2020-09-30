const codec = require('./codec.js')
const dgram = require('dgram')
const os = require('os')
const ip = require('ip')
const opts = { type: 'udp4', reuseAddr: true }

module.exports = {
  get: async function (deviceId, op, request, config, logger) {
    return exec(deviceId, op, request, config, logger)
  },

  set: async function (deviceId, op, request, config, logger) {
    return exec(deviceId, op, request, config, logger)
  },

  send: async function (deviceId, op, request, config, logger) {
    const c = parse(deviceId, config, logger)
    const sock = dgram.createSocket(opts)
    const rq = codec.encode(op, deviceId, request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        if (isBroadcast(c.addr.address)) {
          sock.setBroadcast(true)
        }

        sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(c.debug, 'sent', rq, c.addr)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: c.bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      log(c.debug, 'received', message, rinfo)
    })

    try {
      const result = await Promise.race([onerror, Promise.all([send])])

      if (result && result.length > 0) {
        return {}
      }
    } finally {
      sock.close()
    }

    throw new Error('no reply to request')
  },

  broadcast: async function (deviceId, op, request, config, logger) {
    const c = parse(deviceId, config, logger)
    const sock = dgram.createSocket(opts)
    const rq = codec.encode(op, deviceId, request)
    const replies = []

    const decode = function (reply) {
      if (reply) {
        const response = codec.decode(reply)
        if (response) {
          return response
        }
      }

      throw new Error('invalid reply to broadcasted request')
    }

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const wait = new Promise(resolve => {
      setTimeout(resolve, c.timeout)
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        if (isBroadcast(c.addr.address)) {
          sock.setBroadcast(true)
        }

        sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
          if (err) {
            reject(err)
            return
          }

          log(c.debug, 'sent', rq, c.addr)
          resolve(bytes)
        })
      })

      sock.bind({
        address: c.bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      replies.push(new Uint8Array(message))
      log(c.debug, 'received', message, rinfo)
    })

    try {
      await Promise.race([onerror, Promise.all([wait, send])])

      return replies.map(reply => decode(reply))
    } finally {
      sock.close()
    }
  },

  listen: function (bind, debug, handler) {
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

async function exec (deviceId, op, request, config, logger) {
  const c = parse(deviceId, config, logger)
  const sock = dgram.createSocket(opts)
  const rq = codec.encode(op, deviceId, request)
  let received = () => {}

  const decode = function (reply) {
    if (reply) {
      const response = codec.decode(reply)
      if (response && (response.deviceId === deviceId)) {
        return response
      }
    }

    throw new Error(`no reply from ${deviceId}`)
  }

  const onerror = new Promise((resolve, reject) => {
    sock.on('error', (err) => {
      reject(err)
    })
  })

  const wait = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('timeout'))
    }, c.timeout)

    received = (reply) => {
      clearTimeout(timer)
      resolve(reply)
    }
  })

  const send = new Promise((resolve, reject) => {
    sock.on('listening', () => {
      if (isBroadcast(c.addr.address)) {
        sock.setBroadcast(true)
      }

      sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
        if (err) {
          reject(err)
        } else {
          log(c.debug, 'sent', rq, c.addr)
          resolve(bytes)
        }
      })
    })

    sock.bind({
      address: c.bind,
      port: 0
    })
  })

  sock.on('message', (message, rinfo) => {
    log(c.debug, 'received', message, rinfo)

    if (received) {
      received(new Uint8Array(message))
    }
  })

  try {
    const result = await Promise.race([onerror, Promise.all([wait, send])])

    if (result && result.length > 0) {
      return decode(result[0])
    }
  } finally {
    sock.close()
  }

  throw new Error('no reply to request')
}

function parse (deviceId, config, logger) {
  let timeout = 5000
  let bind = '0.0.0.0'
  let dest = '255.255.255.255:60000'
  let debug = false

  if (config) {
    timeout = config.timeout
    bind = config.bind
    dest = config.broadcast
    debug = config.debug ? function (l, m) { logger(l + '\n' + m) } : null

    if (config.controllers) {
      try {
        const devices = JSON.parse(config.controllers)

        for (const [id, device] of Object.entries(devices)) {
          if (parseInt(id) === deviceId) {
            for (const [k, v] of Object.entries(device)) {
              if (k === 'address') {
                dest = v
              }
            }
          }
        }
      } catch (error) {
        logger(`Error parsing config.controllers JSON ${error}`)
      }
    }
  }

  return {
    timeout: timeout,
    bind: bind,
    addr: stringToIP(dest),
    debug: debug
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

function isBroadcast (addr) {
  const interfaces = os.networkInterfaces()

  for (const v of Object.entries(interfaces)) {
    for (const ifs of v[1]) {
      if (ifs.family && ifs.family === 'IPv4') {
        const subnet = ip.subnet(ifs.address, ifs.netmask)

        if (subnet.broadcastAddress === addr) {
          return true
        }
      }
    }
  }

  return false
}
