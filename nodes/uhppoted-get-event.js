module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetEventNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const index = msg.payload.index

      const emit = function (object) {
        if (object.event.index === 0 && object.event.type.code === 0xff) {
          common.error(node, new Error(`event for ${controller.id}/${index} has been overwritten`))
        } else if (object.event.index === 0) {
          common.error(node, new Error(`no event for ${controller.id}/${index}`))
        } else {
          common.emit(node, t, object)
        }
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => {
            return RED._('uhppoted-get-event.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .get(context, controller.id, opcodes.GetEvent, { index }, controller.address, controller.protocol)
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

    this.translate = function (key) {
      return RED._('uhppoted-get-event.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-get-event', GetEventNode)
}
