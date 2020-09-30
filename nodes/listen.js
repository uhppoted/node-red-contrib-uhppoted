module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function ListenNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    let bind = '0.0.0.0:60000'
    let debug = false

    if (uhppote) {
      bind = uhppote.listen
      debug = uhppote.debug ? function (l, m) { node.log(l + '\n' + m) } : null
    }

    this.status({})

    const listener = uhppoted.listen(bind, debug, this)

    this.received = function (src, msg) {
      const event = decode(msg)

      if (event) {
        common.emit(node, topic, event)
        node.status({})
      }
    }

    this.onerror = function (err) {
      common.error(node, err)
    }

    this.close = function () {
      if (listener) {
        listener.close()
      }
    }

    const decode = function (message) {
      return codec.decode(message)
    }
  }

  RED.nodes.registerType('listen', ListenNode)
}
