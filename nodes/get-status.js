module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')

  function GetStatusNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    node.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId

      const emit = function (object) {
        msg.payload = object
        send(msg)
      }

      const error = function (err) {
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        node.warn('uhppoted::execute  ' + err)
      }

      try {
        uhppoted.get(deviceId, 0x20, {}, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-status', GetStatusNode)
}
