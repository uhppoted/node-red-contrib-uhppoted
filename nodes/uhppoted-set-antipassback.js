module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetAntiPassbackNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      let antipassback = 0

      switch (msg.payload.antipassback) {
        case 'disabled':
          antipassback = opcodes.AntiPassbackDisabled
          break

        case '(1:2);(3:4)':
          antipassback = opcodes.AntiPassback12_34
          break

        case '(1,3):(2,4)':
          antipassback = opcodes.AntiPassback13_24
          break

        case '1:(2,3)':
          antipassback = opcodes.AntiPassback1_23
          break

        case '1:(2,3,4)':
          antipassback = opcodes.AntiPassback1_234
          break

        default:
          throw new Error(RED._('set-antipassback.invalidAntiPassback').replace(/\${code}/, msg.payload.antipassback))
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
          translator: (k) => {
            return RED._('set-antipassback.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .set(context, controller.id, opcodes.SetAntiPassback, { antipassback }, controller.address, controller.protocol)
          .then((object) => {
            emit(object)
          })
          .then(done())
          .catch((err) => {
            error(err)
          })
      } catch (err) {
        error(err)
      }
    })
  }

  RED.nodes.registerType('uhppoted-set-antipassback', SetAntiPassbackNode)
}
