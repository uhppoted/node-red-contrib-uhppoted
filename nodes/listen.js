module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function ListenNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    let bind = '0.0.0.0:60000'
    let debug = false

    if (uhppote) {
      bind = uhppote.listen
      debug = uhppote.debug
    }

    this.status({})

    const listener = uhppoted.listen(bind, debug, this)

    this.received = function (src, msg) {
      const event = decode(msg)

      if (event) {
        const msg = { payload: event }

        node.send(msg)
        node.status({})
      }
    }

    this.onerror = function (err) {
      node.status({
        fill: 'red',
        shape: 'dot',
        text: 'error'
      })

      node.warn('uhppoted::listen  ' + err)
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
