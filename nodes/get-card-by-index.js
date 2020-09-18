module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetCardByIndexNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    node.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId
      const index = msg.payload.index

      const emit = function (object) {
        switch (object.card.number) {
          case 0:
            object.error = -1
            object.card = { number: '', valid: { from: '', to: '' }, doors: { 1: '', 2: '', 3: '', 4: '' } }
            break

          case 0xffffffff:
            object.error = -2
            object.card = { number: '', valid: { from: '', to: '' }, doors: { 1: '', 2: '', 3: '', 4: '' } }
            break
        }

        common.emit(node, msg.topic, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, opcodes.GetCardByIndex, { card: { index: index } }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-card-by-index', GetCardByIndexNode)
}
