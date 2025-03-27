module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function SetTimeProfileNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = topic && topic !== '' ? topic : msg.topic
      const controller = common.resolve(msg.payload)
      const profile = msg.payload.profile

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
            return RED._('uhppoted-set-time-profile.' + k)
          },
          logger: (m) => {
            node.log(m)
          },
        }

        uhppoted
          .get(context, controller.id, opcodes.SetTimeProfile, { profile }, controller.address, controller.protocol)
          .then((object) => {
            if (object) {
              object.profileId = profile.id
            }

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
      return RED._('uhppoted-set-time-profile.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-set-time-profile', SetTimeProfileNode)
}
