module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function ListenNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    let bind = '0.0.0.0:60000'
    let debug = false

    if (uhppote) {
      bind = uhppote.listen
      debug = uhppote.debug ? function (l, m) { node.log(l + '\n' + m) } : null
    }

    common.ok(node)

    const listener = uhppoted.listen(bind, debug, this)

    this.received = function (src, msg) {
      const event = decode(msg)

      if (event) {
        common.emit(node, topic, event)
        common.ok(node)
      }
    }

    this.onerror = function (err) {
      common.error(node, err)
    }

    this.close = function () {
      if (listener) {
        listener.close()
      }
    }

    const decode = function (message) {
      return codec.decode(node, message)
    }

    this.translate = function (text) {
      switch (text) {
        case 'unknown':
          return RED._('listen.unknown')

        // event type
        case 'none':
          return RED._('listen.eventNone')

        case 'card swipe':
          return RED._('listen.eventSwipe')

        case 'door':
          return RED._('listen.eventDoor')

        case 'alarm':
          return RED._('listen.eventAlarm')

        case '<overwritten>':
          return RED._('listen.eventOverwritten')

        // event direction
        case 'in':
          return RED._('get-event.directionIn')

        case 'out':
          return RED._('get-event.directionOut')

        // event reason
        case 'swipe':
          return RED._('listen.swipe')

        case 'swipe:denied (system)':
          return RED._('listen.swipeDenied')

        case 'no access rights':
          return RED._('listen.noAccess')

        case 'incorrect password':
          return RED._('listen.incorrectPassword')

        case 'anti-passback':
          return RED._('listen.antiPassback')

        case 'more cards':
          return RED._('listen.moreCards')

        case 'first card open':
          return RED._('listen.firstCardOpen')

        case 'door is normally closed':
          return RED._('listen.doorNormallyClosed')

        case 'interlock':
          return RED._('listen.interlock')

        case 'not in allowed time period':
          return RED._('listen.notInAllowedTimePeriod')

        case 'invalid timezone':
          return RED._('listen.invalidTimezone')

        case 'access denied':
          return RED._('listen.accessDenied')

        case 'push button ok':
          return RED._('listen.pushbuttonOk')

        case 'door opened':
          return RED._('listen.doorOpened')

        case 'door closed':
          return RED._('listen.doorClosed')

        case 'door opened (supervisor password)':
          return RED._('listen.supervisorDoorOpen')

        case 'controller power on':
          return RED._('listen.controllerPowerOn')

        case 'controller reset':
          return RED._('listen.controllerReset')

        case 'pushbutton invalid (door locked)':
          return RED._('listen.pushbuttonDoorLocked')

        case 'pushbutton invalid (offline)':
          return RED._('listen.pushbuttonOffline')

        case 'pushbutton invalid (interlock)':
          return RED._('listen.pushbuttonInterlock')

        case 'pushbutton invalid (threat)':
          return RED._('listen.pushbuttonThreat')

        case 'door open too long':
          return RED._('listen.doorOpenTooLong')

        case 'forced open':
          return RED._('listen.forcedOpen')

        case 'fire':
          return RED._('listen.fire')

        case 'forced closed':
          return RED._('listen.forcedClosed')

        case 'theft prevention':
          return RED._('listen.theftPrevention')

        case '24x7 zone':
          return RED._('listen.zone24x7')

        case 'emergency':
          return RED._('listen.emergency')

        case 'remote open door':
          return RED._('listen.remoteOpenDoor')

        case 'remote open door (USB reader)':
          return RED._('listen.usbOpenDoor')

        case '(reserved)':
          return RED._('listen.reserved')
      }

      return text
    }
  }

  RED.nodes.registerType('listen', ListenNode)
}
