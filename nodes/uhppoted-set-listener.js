module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetListenerNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const address = msg.payload.address
      const port = msg.payload.port
      const interval = Number.isNaN(msg.payload.interval) ? 0 : common.clamp(msg.payload.interval, 0, 255)

      const emit = function (object) {
        if (!object.updated) {
          throw new Error(`failed to update listener address for ${controller.id}`, controller.id)
        }

        common.emit(node, t, {
          controller: controller.id,
          address,
          port,
          interval,
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => {
            return RED._('uhppoted-set-listener.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .set(context, controller.id, opcodes.SetListener, { address, port, interval }, controller.address, controller.protocol)
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

  RED.nodes.registerType('uhppoted-set-listener', SetListenerNode)
}
