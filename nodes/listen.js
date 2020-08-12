module.exports = function (RED) {
  const uhppote = require('./uhppote.js')

  function ListenNode (config) {
    RED.nodes.createNode(this, config)

    const node = this

    let bind = '0.0.0.0:60000'
    let debug = false

    if (config.uhppote) {
      bind = config.uhppote.listen
      debug = config.uhppote.debug
    }

    const listener = uhppote.listen(bind, debug, this)

    this.received = function (src, msg) {
      const event = decode(msg)

      if (event) {
        const msg = {
          payload: { event: event.event }
        }

        node.send(msg)
      }
    }

    this.onerror = function (err) {
      node.error('uhppoted::listen  ' + err)
    }

    this.close = function () {
      if (listener) {
        listener.close()
      }
    }

    const decode = function (message) {
      if ((message.length === 64) && (message[0] === 0x17) && (message[1] === 0x20)) {
        const bytes = new DataView(message.buffer)

        const status = {
          deviceId: uhppote.deviceId(bytes, 4),
          event: {
            index: uhppote.uint32(bytes, 8),
            type: uhppote.uint8(bytes, 12),
            granted: uhppote.bool(bytes, 13),
            door: uhppote.uint8(bytes, 14),
            direction: uhppote.uint8(bytes, 15),
            cardNumber: uhppote.uint32(bytes, 16),
            timestamp: uhppote.yyyymmddHHmmss(bytes.buffer.slice(20, 27)),
            reason: uhppote.uint8(bytes, 27)
          },
          doors: [
            uhppote.bool(bytes, 28),
            uhppote.bool(bytes, 29),
            uhppote.bool(bytes, 30),
            uhppote.bool(bytes, 31)
          ],
          buttons: [
            uhppote.bool(bytes, 32),
            uhppote.bool(bytes, 33),
            uhppote.bool(bytes, 34),
            uhppote.bool(bytes, 35)
          ],
          system: {
            status: uhppote.uint8(bytes, 36),
            date: uhppote.yymmdd(bytes.buffer.slice(51, 54)),
            time: uhppote.HHmmss(bytes.buffer.slice(37, 40))
          },
          packet: uhppote.uint32(bytes, 40),
          backup: uhppote.uint32(bytes, 44),
          specialMessage: uhppote.uint8(bytes, 48),
          lowBattery: uhppote.uint8(bytes, 49),
          fireAlarm: uhppote.uint8(bytes, 50)
        }

        return status
      }
    }
  }

  RED.nodes.registerType('listen', ListenNode)
}
