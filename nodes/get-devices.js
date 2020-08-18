module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')

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
      debug = uhppote.debug
    }

    this.status({})

    this.on('input', function (msg, send, done) {
      const decode = function (replies) {
        const devices = []
        replies.forEach(reply => {
          if ((reply.length === 64) && (reply[0] === 0x17) && (reply[1] === 0x94)) {
            const bytes = new DataView(reply.buffer)
            const device = {
              device: {
                id: uhppoted.deviceId(bytes, 4),
                address: uhppoted.address(bytes, 8),
                subnet: uhppoted.address(bytes, 12),
                gateway: uhppoted.address(bytes, 16),
                MAC: uhppoted.hexify(bytes.buffer.slice(20, 26)).join(':'),
                version: uhppoted.hexify(bytes.buffer.slice(26, 28)).join(''),
                date: uhppoted.yyyymmdd(bytes.buffer.slice(28, 32))
              }
            }

            devices.push(device)
          }
        })

        return devices
      }

      const emit = function (devices) {
        msg.payload = devices
        send(msg)
      }

      const request = Buffer.alloc(64)

      request.writeUInt8(0x17, 0)
      request.writeUInt8(0x94, 1)

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
