module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function ClearTaskListNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const controller = common.resolve(msg.payload)

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: (k) => { return RED._('clear-task-list.' + k) },
          logger: (m) => { node.log(m) }
        }

        uhppoted.get(context, controller.id, opcodes.ClearTaskList, {}, controller.address, controller.protocol)
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (key) {
      return RED._('clear-task-list.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-clear-task-list', ClearTaskListNode)
}
