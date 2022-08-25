module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')

  function OpenDoorNodeDeprecated (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const door = msg.payload.door

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('open-door.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.set(context, deviceId, 0x40, { door: door })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('open-door', OpenDoorNodeDeprecated)
}
