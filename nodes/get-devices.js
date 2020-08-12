module.exports = function (RED) {
  const uhppote = require('./uhppote.js')

  function GetDevicesNode (config) {
    RED.nodes.createNode(this, config)

    this.uhppote = RED.nodes.getNode(config.uhppote)

    const node = this

    node.on('input', function (msg) {
      let timeout = 5000
      let bind = '0.0.0.0'
      let dest = '255.255.255.255'
      let debug = false

      if (this.uhppote) {
        timeout = this.uhppote.timeout
        bind = this.uhppote.bind
        dest = this.uhppote.broadcast
        debug = this.uhppote.debug
      }

      const decode = function (replies) {
        const devices = []
        replies.forEach(reply => {
          if ((reply.length === 64) && (reply[0] === 0x17) && (reply[1] === 0x94)) {
            const bytes = new DataView(reply.buffer)
            const device = {
              device: {
                id: uhppote.deviceId(bytes, 4),
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

      uhppote.broadcast(bind, dest, request, timeout, debug)
        .then(reply => { return decode(reply) })
        .then(devices => { return emit(devices) })
        .catch(err => { node.error('uhppoted::broadcast  ' + err) })
    })
  }

  RED.nodes.registerType('get-devices', GetDevicesNode)
}
