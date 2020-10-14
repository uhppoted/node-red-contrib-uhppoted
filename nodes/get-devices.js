module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetDevicesNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic

      const emit = function (devices) {
        common.emit(node, t, devices)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          node: node,
          config: uhppote,
          translator: (k) => { return RED._('get-devices.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.broadcast(context, 0, opcodes.GetDevice, {})
          .then(objects => { emit(objects) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-devices', GetDevicesNode)
}
