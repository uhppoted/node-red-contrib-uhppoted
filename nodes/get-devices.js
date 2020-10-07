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
        uhppoted.broadcast(0, opcodes.GetDevice, {}, uhppote, (m) => { node.log(m) })
          .then(objects => { emit(objects) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-devices', GetDevicesNode)
}
