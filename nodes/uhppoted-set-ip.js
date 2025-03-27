module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetIPNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    this.status({})

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
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
          translator: (k) => {
            return RED._('uhppoted-set-ip.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .send(context, controller.id, opcodes.SetIP, { address, netmask, gateway }, controller.address, controller.protocol)
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

  RED.nodes.registerType('uhppoted-set-ip', SetIPNode)
}
