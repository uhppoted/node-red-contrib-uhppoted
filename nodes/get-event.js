module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetEventNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const index = msg.payload.index

      const emit = function (object) {
        if (object.index !== 0) {
          common.emit(node, t, object)
        }
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.set(deviceId, opcodes.GetEvent, { index: index }, { node: node, config: uhppote }, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (text) {
      switch (text) {
        case 'unknown':
          return RED._('get-event.unknown')

        // event type
        case 'none':
          return RED._('get-event.eventNone')

        case 'card swipe':
          return RED._('get-event.eventSwipe')

        case 'door':
          return RED._('get-event.eventDoor')

        case 'alarm':
          return RED._('get-event.eventAlarm')

        case '<overwritten>':
          return RED._('get-event.eventOverwritten')

          // event direction

        case 'in':
          return RED._('get-event.directionIn')

        case 'out':
          return RED._('get-event.directionOut')

        // event reason
        case 'swipe':
          return RED._('get-event.swipe')

        case 'swipe:denied (system)':
          return RED._('get-event.swipeDenied')

        case 'no access rights':
          return RED._('get-event.noAccess')

        case 'incorrect password':
          return RED._('get-event.incorrectPassword')

        case 'anti-passback':
          return RED._('get-event.antiPassback')

        case 'more cards':
          return RED._('get-event.moreCards')

        case 'first card open':
          return RED._('get-event.firstCardOpen')

        case 'door is normally closed':
          return RED._('get-event.doorNormallyClosed')

        case 'interlock':
          return RED._('get-event.interlock')

        case 'not in allowed time period':
          return RED._('get-event.notInAllowedTimePeriod')

        case 'invalid timezone':
          return RED._('get-event.invalidTimezone')

        case 'access denied':
          return RED._('get-event.accessDenied')

        case 'push button ok':
          return RED._('get-event.pushbuttonOk')

        case 'door opened':
          return RED._('get-event.doorOpened')

        case 'door closed':
          return RED._('get-event.doorClosed')

        case 'door opened (supervisor password)':
          return RED._('get-event.supervisorDoorOpen')

        case 'controller power on':
          return RED._('get-event.controllerPowerOn')

        case 'controller reset':
          return RED._('get-event.controllerReset')

        case 'pushbutton invalid (door locked)':
          return RED._('get-event.pushbuttonDoorLocked')

        case 'pushbutton invalid (offline)':
          return RED._('get-event.pushbuttonOffline')

        case 'pushbutton invalid (interlock)':
          return RED._('get-event.pushbuttonInterlock')

        case 'pushbutton invalid (threat)':
          return RED._('get-event.pushbuttonThreat')

        case 'door open too long':
          return RED._('get-event.doorOpenTooLong')

        case 'forced open':
          return RED._('get-event.forcedOpen')

        case 'fire':
          return RED._('get-event.fire')

        case 'forced closed':
          return RED._('get-event.forcedClosed')

        case 'theft prevention':
          return RED._('get-event.theftPrevention')

        case '24x7 zone':
          return RED._('get-event.zone24x7')

        case 'emergency':
          return RED._('get-event.emergency')

        case 'remote open door':
          return RED._('get-event.remoteOpenDoor')

        case 'remote open door (USB reader)':
          return RED._('get-event.usbOpenDoor')

        case '(reserved)':
          return RED._('get-event.reserved')
      }

      return text
    }
  }

  RED.nodes.registerType('get-event', GetEventNode)
}
