module.exports = function (RED) {
  const uhppote = require('./uhppote.js')

  function GetDevicesNode (config) {
    RED.nodes.createNode(this, config)

    this.timeout = config.timeout
    this.bind = config.bind
    this.dest = config.broadcast
    this.debug = (config.debug === 'true')

    const node = this

    node.on('input', function (msg) {
      const decode = function (replies) {
        const devices = []
        replies.forEach(reply => {
          if ((reply.length === 64) && (reply[0] === 0x17) && (reply[1] === 0x94)) {
            const bytes = new DataView(reply.buffer)
            const device = {
              device: {
                id: uhppote.deviceId(bytes),
                address: uhppote.address(bytes, 8),
                subnet: uhppote.address(bytes, 12),
                gateway: uhppote.address(bytes, 16),
                MAC: uhppote.hexify(bytes.buffer.slice(20, 26)).join(':'),
                version: uhppote.hexify(bytes.buffer.slice(26, 28)).join(''),
                date: uhppote.yyyymmdd(bytes.buffer.slice(28, 32))
              }
            }

            devices.push(device)
          }
        })

        return devices
      }

      const emit = function (devices) {
        msg.payload = devices
        node.send(msg)
      }

      const request = Buffer.alloc(64)

      request.writeUInt8(0x17, 0)
      request.writeUInt8(0x94, 1)

      uhppote.broadcast(this.bind, this.dest, request, this.timeout, this.debug)
        .then(reply => { return decode(reply) })
        .then(devices => { return emit(devices) })
        .catch(err => { node.error('uhppoted::broadcast  ' + err) })
    })
  }

  RED.nodes.registerType('get-devices', GetDevicesNode)
}
