module.exports = function (RED) {
  const uhppote = require('./uhppote.js')

  function GetDeviceNode (config) {
    RED.nodes.createNode(this, config)

    this.deviceid = Number(config.deviceid)
    this.timeout = config.timeout
    this.bind = config.bind
    this.dest = config.address

    const node = this

    node.on('input', function (msg) {
      const request = [0x17, 0x94]

      const decode = function (deviceid, replies) {
        for (let i = 0; i < replies.length; i++) {
          const reply = replies[i]
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

            if (device.device.id === deviceid) {
              return device
            }
          }
        }
      }

      const emit = function (device) {
        msg.payload = device
        console.log('>>>', msg)
        node.send(msg)
      }

      uhppote.broadcast(this.bind, this.dest, request, this.timeout)
        .then(reply => { return decode(this.deviceid, reply) })
        .then(device => { return emit(device) })
        .catch(err => { node.error('uhppoted::broadcast  ' + err) })
    })
  }

  RED.nodes.registerType('get-device', GetDeviceNode)
}
