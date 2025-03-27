module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function RecordSpecialEventsNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const enable = msg.payload.enable

      const emit = function (object) {
        common.emit(node, t, {
          deviceId: object.deviceId,
          enable,
          updated: object.updated,
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => {
            return RED._('uhppoted-record-special-events.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .set(context, controller.id, opcodes.RecordSpecialEvents, { enable }, controller.address, controller.protocol)
          .then((object) => {
            emit(object)
          })
          .then(done())
          .catch((err) => {
            error(err)
          })
      } catch (err) {
        error(err)
      }
    })
  }

  RED.nodes.registerType('uhppoted-record-special-events', RecordSpecialEventsNode)
}
