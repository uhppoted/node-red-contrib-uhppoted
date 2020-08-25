module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function GetDevicesNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    let timeout = 5000
    let bind = '0.0.0.0'
    let dest = '255.255.255.255'
    let debug = false

    if (uhppote) {
      timeout = uhppote.timeout
      bind = uhppote.bind
      dest = uhppote.broadcast
      debug = uhppote.debug ? function (l, m) { node.log(l + '\n' + m) } : null
    }

    this.status({})

    this.on('input', function (msg, send, done) {
      const decode = function (replies) {
        const devices = []

        for (const reply of replies) {
          const object = codec.decode(reply)

          if ((object !== null) && (object.device !== null)) {
            devices.push(object)
          }
        }

        return devices
      }

      const emit = function (devices) {
        msg.payload = devices
        send(msg)
      }

      const request = codec.encode(0x94)

      uhppoted.broadcast(bind, dest, request, timeout, debug)
        .then(reply => { return decode(reply) })
        .then(devices => { return emit(devices) })
        .then(done())
        .catch(err => {
          node.status({
            fill: 'red',
            shape: 'dot',
            text: 'error'
          })

          node.warn('uhppoted::broadcast  ' + err)
        })
    })

    this.on('close', function () {
    })
  }

  RED.nodes.registerType('get-devices', GetDevicesNode)
}
