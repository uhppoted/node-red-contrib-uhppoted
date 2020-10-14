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
        let card = { topic: t, payload: object }
        let status = { topic: t, payload: { status: { code: 0, message: RED._('get-card-by-index.cardOk') } } }

        switch (object.card.number) {
          case 0:
            card = null
            status = { topic: t, payload: { status: { code: 1, message: RED._('get-card-by-index.cardNotFound') } } }
            break

          case 0xffffffff:
            card = null
            status = { topic: t, payload: { status: { code: 2, message: RED._('get-card-by-index.cardDeleted') } } }
            break
        }

        node.send([status, card])
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          node: node,
          config: uhppote,
          translator: (k) => { return RED._('get-card-by-index.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.get(context, deviceId, opcodes.GetCardByIndex, { card: { index: index } })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-card-by-index', GetCardByIndexNode)
}
