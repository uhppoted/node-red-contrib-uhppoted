const codec = require('./codec.js')
const ipx = require('./ipx.js')

const dgram = require('dgram')
const net = require('net')
const os = require('os')
const opts = { type: 'udp4', reuseAddr: true }

module.exports = {
  /**
   * Executes a 'get' command to retrieve information from a UHPPOTE access controller.
   * 'get' and 'set' are functionally identical but are defined separately for
   * semantic clarity.
   *
   * @param {object}   ctx        Configuration, internationalisation translation and logger
   * @param {number}   controller The serial number for the target access controller
   * @param {byte}     op         Operation code from 'opcode' module
   * @param {object}   request    Operation parameters for use by codec.encode
   * @param {string}   dest       Optional controller IPv4 address. Defaults to UDP broadcast.
   * @param {string}   protocol   Optional connection protocol ('udp' or 'tcp'). Defaults to
   *                              'udp' unless 'tcp'
   *
   * @param {object}   Decoded reply containing the received information
   *
   * @exports
   */
  get: async function (ctx, controller, op, request, dest = null, protocol = 'udp') {
    const c = context(controller, ctx.config, ctx.logger)
    const receiver = receiveAny(c.timeout)

    try {
      const decode = function (reply) {
        if (reply) {
          const response = codec.decode(reply, ctx.translator)

          if (response && response.deviceId === c.deviceId) {
            return response
          }
        }

        throw new Error(`no reply from ${controller}`)
      }

      if (protocol === 'tcp' && dest != null) {
        return tcp(c, dest, op, request, receiver).then(decode)
      } else if (dest != null) {
        return udp(c, dest, op, request, receiver).then(decode)
      } else {
        return udp(c, { address: c.addr.address, port: c.addr.port }, op, request, receiver).then(decode)
      }
    } finally {
      receiver.cancel()
    }
  },

  /**
   * Executes a 'set' command to update information on a UHPPOTE access controller.
   * 'get' and 'set' are functionally identical but are defined separately for
   * semantic clarity.
   *
   * @param {object}   ctx        Configuration, internationalisation translation and logger
   * @param {number}   controller The serial number for the target access controller
   * @param {byte}     op         Operation code from 'opcode' module
   * @param {object}   request    Operation parameters for use by codec.encode
   * @param {string}   dest       Optional controller IPv4 address. Defaults to UDP broadcast.
   * @param {string}   protocol   Optional connection protocol ('udp' or 'tcp'). Defaults to
   *                              'udp' unless 'tcp'
   *
   * @param {object}  Decoded result of the operation
   *
   * @exports
   */
  set: async function (ctx, controller, op, request, dest = null, protocol = 'udp') {
    const c = context(controller, ctx.config, ctx.logger)
    const receiver = receiveAny(c.timeout)

    try {
      const decode = function (reply) {
        if (reply) {
          const response = codec.decode(reply, ctx.translator)
          if (response && response.deviceId === c.deviceId) {
            return response
          }
        }

        throw new Error(`no reply from ${controller}`)
      }

      if (protocol === 'tcp' && dest != null) {
        return tcp(c, dest, op, request, receiver).then(decode)
      } else if (dest != null) {
        return udp(c, dest, op, request, receiver).then(decode)
      } else {
        return udp(c, { address: c.addr.address, port: c.addr.port }, op, request, receiver).then(decode)
      }
    } finally {
      receiver.cancel()
    }
  },

  /**
   * Sends a command to update information on a UHPPOTE access controller without
   * expecting a reply. Used solely by the 'set-ip' node - the UHPPOTE access controller
   * does not reply to the set IP command.
   *
   * @param {object}   ctx        Configuration, internationalisation translation and logger
   * @param {number}   controller The serial number for the target access controller
   * @param {byte}     op         Operation code from 'opcode' module
   * @param {object}   request    Operation parameters for use by codec.encode
   * @param {string}   dest       Optional controller IPv4 address. Defaults to UDP broadcast.
   * @param {string}   protocol   Optional connection protocol ('udp' or 'tcp'). Defaults to
   *                              'udp' unless 'tcp'
   *
   */
  send: async function (ctx, controller, op, request, dest = null, protocol = 'udp') {
    const c = context(controller, ctx.config, ctx.logger)

    const receiver = new Promise((resolve) => {
      resolve()
    })

    const decode = function (_reply) {
      return {}
    }

    receiver.received = (_message) => {}

    if (protocol === 'tcp' && dest != null) {
      return tcp(c, dest, op, request, receiver).then(decode)
    } else if (dest != null) {
      return udp(c, dest, op, request, receiver).then(decode)
    } else {
      return udp(c, { address: c.addr.address, port: c.addr.port }, op, request, receiver).then(decode)
    }
  },

  /**
   * Broadcasts a command to retrieve information from all responding UHPPOTE access
   * controllers. In this implementation it is used exclusively by the 'get-devices'
   * node.
   *
   * It differs from 'get' in that it waits for a timeout before returning an array of
   * received responses rather than returning the first received response. It also
   * explicity issues a UDP broadcast message - 'get' will issue a UDP 'sendto' if
   * possible.
   *
   * @param {object}   ctx      Configuration, internationalisation translation and logger
   * @param {byte}     op       Operation code from 'opcode' module
   * @param {object}   request  Operation parameters for use by codec.encode
   *
   * @param {array} Array of Javascript objects from codec.decode containing the decoded
   *                received responses.
   *
   * @exports
   */
  broadcast: async function (ctx, op, request) {
    const c = context(0, ctx.config, ctx.logger)
    const replies = []

    const receiver = new Promise((resolve) => {
      setTimeout(() => {
        resolve(replies)
      }, c.timeout)
    })

    const decode = function (replies) {
      if (replies) {
        return replies.map((m) => {
          const response = codec.decode(m, ctx.translator)
          if (response) {
            return response
          }

          throw new Error('invalid reply to broadcasted request')
        })
      }

      throw new Error('no reply to broadcasted request')
    }

    receiver.received = (message) => {
      replies.push(new Uint8Array(message))
    }

    return udp(c, { address: c.addr.address, port: c.addr.port }, op, request, receiver).then(decode)
  },

  /**
   * Establishes a 'listening' UDP connection on the 'listen' port defined in the
   * configuration to receive events from UHPPOTE access controllers configured
   * to send events to this host:port. Received events are forwarded to the
   * supplied handler for dispatch to the application.
   *
   * @param {object}   ctx      Configuration, internationalisation translation and logger
   * @param {function} handler  Function to invoke with received event
   *
   * @exports
   */
  listen: function (ctx, handler) {
    const c = context(0, ctx.config, ctx.logger)
    const sock = dgram.createSocket(opts)

    sock.on('error', (err) => {
      handler.onerror(err)
    })

    sock.on('message', (message, rinfo) => {
      log(c.debug, 'received', message, rinfo)

      const event = codec.decode(message, context.translator)

      if (event) {
        handler.received(event)
      }
    })

    sock.bind({
      address: c.listen.address,
      port: c.listen.port,
    })

    return sock
  },
}

/**
 * Sends a UDP command to a UHPPOTE access controller and returns the decoded
 * reply, for use by 'get' and 'set'.
 *
 * configuration to receive events from UHPPOTE access controllers configured
 * to send events to this host:port. Received events are forwarded to the
 * supplied handler for dispatch to the application.
 *
 * @param {object}   context  Addresses, logger, debug, etc.
 * @param {object}   dest     Destination { address,port }
 * @param {byte}     op       Operation code from 'opcode' module
 * @param {object}   request  Operation parameters for use by codec.encode
 * @param {function} receive  Handler for received messages
 *
 * @return {object}  Decoded reply from access controller
 *
 */
async function udp(ctx, dest, op, request, receive) {
  const sock = dgram.createSocket(opts)
  const rq = codec.encode(op, ctx.deviceId, request)
  let timer = 0

  const onerror = new Promise((resolve, reject) => {
    sock.on('error', (err) => {
      reject(err)
    })
  })

  const ontimeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ctx.timeout)
  })

  const send = new Promise((resolve, reject) => {
    sock.on('listening', () => {
      if (ctx.forceBroadcast || isBroadcast(dest.address)) {
        sock.setBroadcast(true)
      }

      sock.send(new Uint8Array(rq), 0, 64, dest.port, dest.address, (err, bytes) => {
        if (err) {
          reject(err)
        } else {
          log(ctx.debug, 'sent', rq, ctx.addr)
          resolve(bytes)
        }
      })
    })

    sock.bind({
      address: ctx.bind,
      port: 0,
    })
  })

  sock.on('message', (message, rinfo) => {
    log(ctx.debug, 'received', message, rinfo)

    receive.received(new Uint8Array(message))
  })

  try {
    const result = await Promise.race([onerror, ontimeout, Promise.all([receive, send])])

    if (result && result.length === 2) {
      return result[0]
    }
  } finally {
    clearTimeout(timer)
    sock.close()
  }

  throw new Error('no reply to request')
}

/**
 * Sends a TCP command to a UHPPOTE access controller and returns the decoded
 * reply, for use by 'get' and 'set'.
 *
 * configuration to receive events from UHPPOTE access controllers configured
 * to send events to this host:port. Received events are forwarded to the
 * supplied handler for dispatch to the application.
 *
 * @param {object}   context  Addresses, logger, debug, etc.
 * @param {object}   dest     Destination { address,port }
 * @param {byte}     op       Operation code from 'opcode' module
 * @param {object}   request  Operation parameters for use by codec.encode
 * @param {function} receive  Handler for received messages
 *
 * @return {object}  Decoded reply from access controller
 *
 */
async function tcp(ctx, dest, op, request, receive) {
  const sock = new net.Socket()
  const rq = codec.encode(op, ctx.deviceId, request)
  let timer = 0

  const onerror = new Promise((resolve, reject) => {
    sock.on('error', (err) => {
      reject(err)
    })
  })

  const ontimeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout ${ctx.timeout}ms`)), ctx.timeout)
  })

  const send = new Promise((resolve, reject) => {
    sock.on('connect', () => {
      sock.write(new Uint8Array(rq), (err) => {
        if (err) {
          reject(err)
        } else {
          log(ctx.debug, 'TCP::sent', rq, dest)
          resolve()
        }
      })
    })

    sock.on('data', (message) => {
      log(ctx.debug, 'TCP::received', message)

      receive.received(new Uint8Array(message))
    })

    sock.connect({
      host: dest.address,
      port: dest.port,
      localAddress: ctx.bind,
      localPort: 0,
    })
  })

  try {
    const result = await Promise.race([onerror, ontimeout, Promise.all([receive, send])])

    if (result && result.length === 2) {
      return result[0]
    }

  throw new Error('no reply to request')
  } finally {
    clearTimeout(timer)
    sock.destroy()
  }
}

/**
 * Utility function to reconcile supplied configuration against the default
 * values. Returns a working 'exec' context with valid:
 * - bind address:port
 * - destination address:port
 * - timeout
 * - debug enabled
 *
 * @param {number}   device   The serial number for the target access controller
 * @param {object}   config   Configuration object supplied to requesting node
 * @param {function} logger   Log function for sent/received messages
 *
 * @param {object} Valid working context
 *
 */
function context(device, config, logger) {
  const deviceId = Number(device)
  let timeout = 5000
  let bind = '0.0.0.0'
  let dest = '255.255.255.255:60000'
  let listen = '0.0.0.0:60001'
  let forceBroadcast = false
  let debug = false

  if (config) {
    timeout = Number.parseInt(config.timeout)
    bind = config.bind
    dest = config.broadcast
    listen = config.listen
    debug = config.debug
      ? function (l, m) {
          logger(l + '\n' + m)
        }
      : null

    if (config.controllers) {
      try {
        const devices = JSON.parse(config.controllers)

        for (const [id, device] of Object.entries(devices)) {
          if (parseInt(id) === deviceId) {
            for (const [k, v] of Object.entries(device)) {
              if (k === 'address') {
                dest = v
              } else if (k === 'broadcast') {
                forceBroadcast = v
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
    deviceId,
    timeout,
    bind,
    addr: stringToIP(dest),
    listen: stringToIP(listen),
    forceBroadcast,
    debug,
  }
}

/**
 * Utility function to write a sent/received UDP message to the log function.
 *
 * @param {function}   debug  The log function that will write the formatted message
 * @param {string}     label  'sent' or 'received'
 * @param {uint8array} message 64 byte UDP message
 * @param {object}     rinfo   source/destination IP address and port
 *
 */
function log(debug, label, message, rinfo) {
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

/**
 * Utility function to format a 64 byte UDP message.
 *
 * @param {uint8array} message 64 byte UDP message
 * @param {string}     pad     prefix used to align the message to the log entries
 *
 * @returns {string} Message formatted as a hexadecimal chunk
 *
 */
function format(message, pad) {
  return message
    .toString('hex')
    .replace(/(.{2})/g, '$& ')
    .replace(/(.{24})/g, '$& ')
    .replace(/(.{50})/g, '$&\n' + pad)
    .trimEnd()
}

/**
 * Utility function to convert an IP address in host:port format an object with
 * address and port.
 *
 * @param {string} addr  IP address in host:port format
 *
 * @returns {object} Object containing IP address and port as properties
 *
 */
function stringToIP(addr) {
  let address = addr
  let port = 60000

  const re = /^(.*?)(?::([0-9]+))?$/
  const match = addr.match(re)

  if (match.length > 1 && match[1]) {
    address = match[1]
  }

  if (match.length > 2 && match[2]) {
    port = parseInt(match[2], 10)
  }

  return {
    address,
    port,
  }
}

/**
 * Utility function that takes a best guess as to whether an IP address is likely to be
 * a broadcast address. It uses the OS interface list, returning 'true' if the address
 * matches one of the 'bit flipped' netmasks.
 *
 * @param {string} addr  IP address
 *
 * @returns {bool} 'true' if the address is a broadcast address. Defaults to 'false'.
 *
 */
function isBroadcast(addr) {
  const interfaces = os.networkInterfaces()

  for (const v of Object.entries(interfaces)) {
    for (const ifs of v[1]) {
      if (ifs.family && ifs.family === 'IPv4') {
        const broadcastAddr = ipx.broadcastAddr(ifs.address, ifs.netmask)

        if (broadcastAddr === addr) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Utility function construct a Promise that can resolves on receiving a single reply. Used by 'get' and 'set'.
 *
 * @param {number} timeout  Timeout (in seconds). Ignored if 'undefined' (e.g. for send() which does not expect
 *                          a reply)
 *
 * @returns {promise} Constructed Promised with a 'received' function.
 *
 */
function receiveAny(timeout) {
  let timer = null
  let f = null

  const p = new Promise((resolve, reject) => {
    f = resolve
    if (timeout) {
      timer = setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)
    }
  })

  p.cancel = () => {
    if (timer) {
      clearTimeout(timer)
    }
  }

  p.received = (message) => {
    if (timer) {
      clearTimeout(timer)
    }

    if (f) {
      f(message)
    }
  }

  return p
}
