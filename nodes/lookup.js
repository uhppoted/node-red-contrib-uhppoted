module.exports = {

  eventType: function (node, bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const event = {
      code: byte,
      event: translate(node, 'unknown')
    }

    switch (byte) {
      case 0x00:
        event.event = translate(node, 'none')
        break

      case 0x01:
        event.event = translate(node, 'card swipe')
        break

      case 0x02:
        event.event = translate(node, 'door')
        break

      case 0x03:
        event.event = translate(node, 'alarm')
        break

      case 0xff:
        event.event = translate(node, '<overwritten>')
        break
    }

    return event
  },

  direction: function (node, bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const direction = {
      code: byte,
      direction: translate(node, 'unknown')
    }

    switch (byte) {
      case 0x01:
        direction.direction = translate(node, 'in')
        break

      case 0x02:
        direction.direction = translate(node, 'out')
        break
    }

    return direction
  },

  reason: function (node, bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const reason = {
      code: byte,
      reason: translate(node, 'unknown')
    }

    switch (byte) {
      case 1:
        reason.reason = translate(node, 'swipe')
        break

      case 5:
        reason.reason = translate(node, 'swipe:denied (system)') // Access is managed by the system not the controller
        break

      case 6:
        reason.reason = translate(node, 'no access rights') // swipe denied
        break

      case 7:
        reason.reason = translate(node, 'incorrect password') // swipe denied
        break

      case 8:
        reason.reason = translate(node, 'anti-passback') // swipe denied
        break

      case 9:
        reason.reason = translate(node, 'more cards') // swipe denied (absolutely no idea what this means :-()
        break

      case 10:
        reason.reason = translate(node, 'first card open') // swipe denied (no idea what this means either)
        break

      case 11:
        reason.reason = translate(node, 'door is normally closed') // swipe denied
        break

      case 12:
        reason.reason = translate(node, 'interlock') // swipe denied
        break

      case 13:
        reason.reason = translate(node, 'not in allowed time period') // swipe denied
        break

      case 15:
        reason.reason = translate(node, 'invalid timezone') // swipe denied
        break

      case 18:
        reason.reason = translate(node, 'access denied') // swipe denied
        break

      case 20:
        reason.reason = translate(node, 'push button ok')
        break

      case 23:
        reason.reason = translate(node, 'door opened')
        break

      case 24:
        reason.reason = translate(node, 'door closed')
        break

      case 25:
        reason.reason = translate(node, 'door opened (supervisor password)')
        break

      case 28:
        reason.reason = translate(node, 'controller power on')
        break

      case 29:
        reason.reason = translate(node, 'controller reset')
        break

      case 31:
        reason.reason = translate(node, 'pushbutton invalid (door locked)')
        break

      case 32:
        reason.reason = translate(node, 'pushbutton invalid (offline)')
        break

      case 33:
        reason.reason = translate(node, 'pushbutton invalid (interlock)')
        break

      case 34:
        reason.reason = translate(node, 'pushbutton invalid (threat)')
        break

      case 37:
        reason.reason = translate(node, 'door open too long')
        break

      case 38:
        reason.reason = translate(node, 'forced open')
        break

      case 39:
        reason.reason = translate(node, 'fire')
        break

      case 40:
        reason.reason = translate(node, 'forced closed')
        break

      case 41:
        reason.reason = translate(node, 'theft prevention')
        break

      case 42:
        reason.reason = translate(node, '24x7 zone')
        break

      case 43:
        reason.reason = translate(node, 'emergency')
        break

      case 44:
        reason.reason = translate(node, 'remote open door')
        break

      case 45:
        reason.reason = translate(node, 'remote open door (USB reader)')
        break

      default:
        reason.reason = translate(node, '(reserved)')
        break
    }

    return reason
  },

  relays: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const relays = {
      state: byte,
      relays: {
        1: (byte & 0x01) === 1,
        2: (byte & 0x02) === 1,
        3: (byte & 0x03) === 1,
        4: (byte & 0x08) === 1
      }
    }

    return relays
  },

  inputs: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const inputs = {
      state: byte,
      forceLock: (byte & 0x01) === 0x01,
      fireAlarm: (byte & 0x02) === 0x02
    }

    return inputs
  },

  doorState: function (node, bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    switch (byte) {
      case 1:
        return translate(node, 'normally open')

      case 2:
        return translate(node, 'normally closed')

      case 3:
        return translate(node, 'controlled')
    }

    return translate(node, 'unknown')
  }
}

function translate (node, text) {
  return (node && node.translate) ? node.translate(text) : text
}
