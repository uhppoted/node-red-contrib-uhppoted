module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')

  function ListenNode(config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic

    common.ok(node)

    const context = {
      config: RED.nodes.getNode(config.config),
      translator: (k) => {
        return RED._('uhppoted-listen.' + k)
      },
      logger: (m) => {
        node.log(m)
      },
    }

    const listener = uhppoted.listen(context, this)

    this.received = function (event) {
      common.emit(node, topic, event)
      common.ok(node)
    }

    this.onerror = function (err) {
      common.error(node, err)
    }

    this.close = function () {
      if (listener) {
        listener.close()
      }
    }

    this.translate = function (key) {
      return RED._('uhppoted-listen.' + key)
    }
  }

  RED.nodes.registerType('uhppoted-listen', ListenNode)
}
