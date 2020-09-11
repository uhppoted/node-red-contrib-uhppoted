module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')

  function GetCardNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    node.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId
      const cardNumber = msg.payload.cardNumber

      const emit = function (object) {
        // 0:          not found
        // 0xffffffff: deleted
        common.emit(node, msg.topic, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, 0x5a, { cardNumber: cardNumber }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-card', GetCardNode)
}
