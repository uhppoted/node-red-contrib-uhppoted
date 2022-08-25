module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetEventNode (config) {
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
        if (object.event.index === 0 && object.event.type.code === 0xff) {
          common.error(node, new Error(`event for ${deviceId}/${index} has been overwritten`))
        } else if (object.event.index === 0) {
          common.error(node, new Error(`no event for ${deviceId}/${index}`))
        } else {
          common.emit(node, t, object)
        }
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('get-event.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.set(context, deviceId, opcodes.GetEvent, { index: index })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (key) {
      return RED._('get-event.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-get-event', GetEventNode)
}
