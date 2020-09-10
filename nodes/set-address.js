module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function SetAddressNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    let timeout = 5000
    let bind = '0.0.0.0'
    let dest = '255.255.255.255:60000'
    let debug = false

    if (uhppote) {
      timeout = uhppote.timeout
      bind = uhppote.bind
      dest = uhppote.broadcast
      debug = uhppote.debug ? function (l, m) { node.log(l + '\n' + m) } : null
    }

    this.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId
      const address = msg.payload.address
      const netmask = msg.payload.netmask
      const gateway = msg.payload.gateway

      const decode = function (deviceid, reply) {
        if (reply) {
          return {}
        }

        throw new Error(`no reply to set-address request for device ID ${deviceId}`)
      }

      const emit = function (object) {
        common.emit(node, msg.topic, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const request = codec.encode(0x96, deviceId, { address: address, netmask: netmask, gateway: gateway })

        uhppoted.send(bind, dest, request, timeout, debug)
          .then(reply => { return decode(this.deviceid, reply) })
          .then(object => { return emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('set-address', SetAddressNode)
}
