module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')

  function OpenDoorNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    node.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId
      const door = msg.payload.door

      const emit = function (object) {
        common.emit(node, msg.topic, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.set(deviceId, 0x40, { door: door }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('open-door', OpenDoorNode)
}