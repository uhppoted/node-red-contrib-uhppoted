module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetListenerNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const address = msg.payload.address
      const port = msg.payload.port

      const emit = function (object) {
        if (!object.updated) {
          throw new Error(`failed to update listener address for ${deviceId}`, deviceId)
        }

        common.emit(node, t, {
          deviceId: deviceId,
          address: address,
          port: port
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('set-listener.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.set(context, deviceId, opcodes.SetListener, { address: address, port: port })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('set-listener', SetListenerNode)
}
