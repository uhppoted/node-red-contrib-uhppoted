const TAG = 'uhppoted-activate-keypads'

module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function ActivateKeypadsNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const keypads = {
        1: !!msg.payload.keypads['1'],
        2: !!msg.payload.keypads['2'],
        3: !!msg.payload.keypads['3'],
        4: !!msg.payload.keypads['4'],
      }

      const emit = function (object) {
        common.emit(node, t, {
          deviceId: object.deviceId,
          keypads,
          updated: object.updated,
        })
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        const context = {
          config: uhppote,
          translator: this.translate,
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .set(context, controller.id, opcodes.ActivateKeypads, { keypads }, controller.address, controller.protocol)
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

    this.translate = function (key) {
      return RED._(`${TAG}.${key}`)
    }
  }

  RED.nodes.registerType(TAG, ActivateKeypadsNode)
}
