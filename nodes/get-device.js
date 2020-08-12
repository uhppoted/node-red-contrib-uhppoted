module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')

  function GetDeviceNode (config) {
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

    node.on('input', function (msg) {
      const id = msg.payload['device-id']

      const decode = function (deviceid, replies) {
        for (let i = 0; i < replies.length; i++) {
          const reply = replies[i]
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

            if (device.device.id === id) {
              return device
            }
          }
        }
      }

      const emit = function (device) {
        msg.payload = device
        node.send(msg)
      }

      const request = Buffer.alloc(64)

      request.writeUInt8(0x17, 0)
      request.writeUInt8(0x94, 1)

      uhppoted.broadcast(bind, dest, request, timeout, debug)
        .then(reply => { return decode(this.deviceid, reply) })
        .then(device => { return emit(device) })
        .catch(err => { node.error('uhppoted::broadcast  ' + err) })
    })
  }

  RED.nodes.registerType('get-device', GetDeviceNode)
}
