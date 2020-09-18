module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function DeleteCardNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    node.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId
      const cardNumber = msg.payload.cardNumber

      const emit = function (object) {
        common.emit(node, msg.topic, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, opcodes.DeleteCard, { card: { number: cardNumber } }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('delete-card', DeleteCardNode)
}
