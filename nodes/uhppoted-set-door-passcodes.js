module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetDoorPasscodesNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const door = msg.payload.door
      const passcodes = [0, 0, 0, 0]

      if (msg.payload.passcodes) {
        for (const [ix, code] of msg.payload.passcodes.entries()) {
          if (ix < 4 && code > 0 && code < 1000000) {
            passcodes[ix] = code
          }
        }
      }

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('set-door-passcodes.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.set(context, deviceId, opcodes.SetDoorPasscodes, {
          door,
          passcodes
        })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('uhppoted-set-door-passcodes', SetDoorPasscodesNode)
}
