module.exports = {

  eventType: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const event = {
      code: byte,
      event: 'unknown'
    }

    switch (byte) {
      case 0x00:
        event.event = 'none'
        break

      case 0x01:
        event.event = 'card swipe'
        break

      case 0x02:
        event.event = 'door'
        break

      case 0x03:
        event.event = 'alarm'
        break

      case 0xff:
        event.event = '<overwritten>'
        break
    }

    return event
  },

  direction: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const direction = {
      code: byte,
      direction: 'unknown'
    }

    switch (byte) {
      case 0x01:
        direction.direction = 'in'
        break

      case 0x02:
        direction.direction = 'out'
        break
    }

    return direction
  },

  reason: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const reason = {
      code: byte,
      reason: 'unknown'
    }

    switch (byte) {
      case 1:
        reason.reason = 'swipe'
        break

      case 5:
        reason.reason = 'swipe:denied (system)' // Access is managed by the system not the controller
        break

      case 6:
        reason.reason = 'no access rights' // swipe denied
        break

      case 7:
        reason.reason = 'incorrect password' // swipe denied
        break

      case 8:
        reason.reason = 'anti-passback' // swipe denied
        break

      case 9:
        reason.reason = 'more cards' //  // swipe denied (absolutely no idea what this means :-()
        break

      case 10:
        reason.reason = 'first card open' // swipe denied (no idea what this means either)
        break

      case 11:
        reason.reason = 'door is normally closed' // swipe denied
        break

      case 12:
        reason.reason = 'interlock' // swipe denied
        break

      case 13:
        reason.reason = 'not in allowed time period' // swipe denied
        break

      case 15:
        reason.reason = 'invalid timezone' // swipe denied
        break

      case 18:
        reason.reason = 'access denied' // swipe denied
        break

      case 20:
        reason.reason = 'push button ok'
        break

      case 23:
        reason.reason = 'door opened'
        break

      case 24:
        reason.reason = 'door closed'
        break

      case 25:
        reason.reason = 'door opened (supervisor password)'
        break

      case 28:
        reason.reason = 'controller power on'
        break

      case 29:
        reason.reason = 'controller reset'
        break

      case 31:
        reason.reason = 'pushbutton invalid (door locked)'
        break

      case 32:
        reason.reason = 'pushbutton invalid (offline)'
        break

      case 33:
        reason.reason = 'pushbutton invalid (interlock)'
        break

      case 34:
        reason.reason = 'pushbutton invalid (threat)'
        break

      case 37:
        reason.reason = 'door open too long'
        break

      case 38:
        reason.reason = 'forced open'
        break

      case 39:
        reason.reason = 'fire'
        break

      case 40:
        reason.reason = 'forced closed'
        break

      case 41:
        reason.reason = 'theft prevention'
        break

      case 42:
        reason.reason = '24x7 zone'
        break

      case 43:
        reason.reason = 'emergency'
        break

      case 44:
        reason.reason = 'remote open door'
        break

      case 45:
        reason.reason = 'remote open door (USB reader)'
        break

      default:
        reason.reason = '(reserved)'
        break
    }

    return reason
  },

  relays: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const relays = {
      code: byte,
      locked: {
        1: byte & 0x01 === 0,
        2: byte & 0x02 === 0,
        3: byte & 0x03 === 0,
        4: byte & 0x08 === 0
      }
    }

    return relays
  },

  inputs: function (bytes, offset) {
    const byte = bytes.getUint8(offset, true)

    const inputs = {
      code: byte,
      forceLock: byte & 0x01 === 1,
      fireAlarm: byte & 0x02 === 1
    }

    return inputs
  }
}
