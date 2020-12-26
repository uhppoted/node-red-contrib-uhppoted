module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function RecordSpecialEventsNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const enable = msg.payload.enable

      const emit = function (object) {
        common.emit(node, t, {
          deviceId: object.deviceId,
          enable: enable,
          updated: object.updated
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('record-special-events.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.set(context, deviceId, opcodes.RecordSpecialEvents, { enable: enable })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('record-special-events', RecordSpecialEventsNode)
}
