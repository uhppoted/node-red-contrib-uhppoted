module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')
  const lookup = require('./lookup.js')

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

    const listener = uhppoted.listen(bind, debug, this)

    this.received = function (src, msg) {
      const event = decode(msg)

      if (event) {
        const msg = {
          payload: { event: event }
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

        const event = {
          deviceId: uhppoted.deviceId(bytes, 4),
          event: {
            index: uhppoted.uint32(bytes, 8),
            type: lookup.eventType(bytes, 12),
            granted: uhppoted.bool(bytes, 13),
            door: uhppoted.uint8(bytes, 14),
            direction: lookup.eventDirection(bytes, 15),
            card: uhppoted.uint32(bytes, 16),
            timestamp: uhppoted.yyyymmddHHmmss(bytes.buffer.slice(20, 27)),
            reason: lookup.eventReason(bytes, 27)
          },
          doors: [
            uhppoted.bool(bytes, 28),
            uhppoted.bool(bytes, 29),
            uhppoted.bool(bytes, 30),
            uhppoted.bool(bytes, 31)
          ],
          buttons: [
            uhppoted.bool(bytes, 32),
            uhppoted.bool(bytes, 33),
            uhppoted.bool(bytes, 34),
            uhppoted.bool(bytes, 35)
          ],
          system: {
            status: uhppoted.uint8(bytes, 36),
            date: uhppoted.yymmdd(bytes.buffer.slice(51, 54)),
            time: uhppoted.HHmmss(bytes.buffer.slice(37, 40))
          },
          specialInfo: uhppoted.uint8(bytes, 48),
          relays: lookup.relays(bytes, 49),
          inputs: lookup.inputs(bytes, 50)
        }

        return event
      }
    }
  }

  RED.nodes.registerType('listen', ListenNode)
}
