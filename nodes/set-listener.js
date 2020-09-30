module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')

  function SetListenerNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    node.status({})

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const address = msg.payload.address
      const port = msg.payload.port

      const emit = function (object) {
        if (!object.updated) {
          throw new Error(`failed to update listener address for ${deviceId}`, deviceId)
        }

        common.emit(node, t, {
          deviceId: deviceId,
          address: address,
          port: port
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.set(deviceId, 0x90, { address: address, port: port }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('set-listener', SetListenerNode)
}
