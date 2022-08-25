module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetIPNodeDeprecated (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    this.status({})

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const address = msg.payload.address
      const netmask = msg.payload.netmask
      const gateway = msg.payload.gateway

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('set-ip.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.send(context, deviceId, opcodes.SetIP, { address: address, netmask: netmask, gateway: gateway })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('set-ip', SetIPNodeDeprecated)
}
