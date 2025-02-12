module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetCardNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const card = msg.payload.cardNumber

      const emit = function (object) {
        const reply = {
          topic: t,
          payload: {
            deviceId: object.deviceId,
            cardNumber: card,
            status: { code: 0, message: RED._('get-card.cardOk') },
            card: object.card,
          },
        }

        switch (object.card.number) {
          case 0:
            reply.payload.card = null
            reply.payload.status = {
              code: 1,
              message: RED._('get-card.cardNotFound'),
            }
            break

          case 0xffffffff:
            reply.payload.card = null
            reply.payload.status = {
              code: 2,
              message: RED._('get-card.cardDeleted'),
            }
            break
        }

        node.send(reply)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => {
            return RED._('get-card.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .get(context, controller.id, opcodes.GetCardByID, { card }, controller.address, controller.protocol)
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

  RED.nodes.registerType('uhppoted-get-card', GetCardNode)
}
