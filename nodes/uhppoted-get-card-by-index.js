module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetCardByIndexNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const index = msg.payload.index

      const emit = function (object) {
        const reply = {
          topic: t,
          payload: {
            deviceId: object.deviceId,
            index: index,
            status: {
              code: 0,
              message: RED._('get-card-by-index.cardOk')
            },
            card: object.card
          }
        }

        switch (object.card.number) {
          case 0:
            reply.payload.status = { code: 1, message: RED._('get-card-by-index.cardNotFound') }
            reply.payload.card = null
            break

          case 0xffffffff:
            reply.payload.status = { code: 2, message: RED._('get-card-by-index.cardDeleted') }
            reply.payload.card = null
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
          translator: (k) => { return RED._('get-card-by-index.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.get(context, deviceId, opcodes.GetCardByIndex, { index: index })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('uhppoted-get-card-by-index', GetCardByIndexNode)
}
