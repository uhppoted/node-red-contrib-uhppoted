module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetInterlockNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const interlock = msg.payload.interlock

      const emit = function (object) {
        common.emit(node, t, {
          deviceId: object.deviceId,
          interlock,
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
            return RED._('uhppoted-set-interlock.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .set(context, controller.id, opcodes.SetInterlock, { interlock }, controller.address, controller.protocol)
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

  RED.nodes.registerType('uhppoted-set-interlock', SetInterlockNode)
}
