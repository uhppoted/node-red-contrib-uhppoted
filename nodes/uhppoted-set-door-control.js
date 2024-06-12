module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetDoorControlNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const door = msg.payload.door
      const delay = msg.payload.delay

      let control = 0x00

      switch (msg.payload.control) {
        case 'normally open':
          control = opcodes.NormallyOpen
          break

        case 'normally closed':
          control = opcodes.NormallyClosed
          break

        case 'controlled':
          control = opcodes.Controlled
          break

        default:
          throw new Error(RED._('set-door-control.invalidDoorControl').replace(/\${code}/, msg.payload.control))
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
          translator: (k) => { return RED._('set-door-control.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted
          .set(context, controller.id, opcodes.SetDoorControl, { door, delay, control }, controller.address, controller.protocol)
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (key) {
      return RED._('set-door-control.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-set-door-control', SetDoorControlNode)
}
