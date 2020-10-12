module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetStatusNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, opcodes.GetStatus, {}, { node: node, config: uhppote }, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (text) {
      switch (text) {
        case 'unknown':
          return RED._('get-status.unknown')

        // event type
        case 'none':
          return RED._('get-status.eventNone')

        case 'card swipe':
          return RED._('get-status.eventSwipe')

        case 'door':
          return RED._('get-status.eventDoor')

        case 'alarm':
          return RED._('get-status.eventAlarm')

        case '<overwritten>':
          return RED._('get-status.eventOverwritten')

        // event direction
        case 'in':
          return RED._('get-event.directionIn')

        case 'out':
          return RED._('get-event.directionOut')

        // event reason
        case 'swipe':
          return RED._('get-status.swipe')

        case 'swipe:denied (system)':
          return RED._('get-status.swipeDenied')

        case 'no access rights':
          return RED._('get-status.noAccess')

        case 'incorrect password':
          return RED._('get-status.incorrectPassword')

        case 'anti-passback':
          return RED._('get-status.antiPassback')

        case 'more cards':
          return RED._('get-status.moreCards')

        case 'first card open':
          return RED._('get-status.firstCardOpen')

        case 'door is normally closed':
          return RED._('get-status.doorNormallyClosed')

        case 'interlock':
          return RED._('get-status.interlock')

        case 'not in allowed time period':
          return RED._('get-status.notInAllowedTimePeriod')

        case 'invalid timezone':
          return RED._('get-status.invalidTimezone')

        case 'access denied':
          return RED._('get-status.accessDenied')

        case 'push button ok':
          return RED._('get-status.pushbuttonOk')

        case 'door opened':
          return RED._('get-status.doorOpened')

        case 'door closed':
          return RED._('get-status.doorClosed')

        case 'door opened (supervisor password)':
          return RED._('get-status.supervisorDoorOpen')

        case 'controller power on':
          return RED._('get-status.controllerPowerOn')

        case 'controller reset':
          return RED._('get-status.controllerReset')

        case 'pushbutton invalid (door locked)':
          return RED._('get-status.pushbuttonDoorLocked')

        case 'pushbutton invalid (offline)':
          return RED._('get-status.pushbuttonOffline')

        case 'pushbutton invalid (interlock)':
          return RED._('get-status.pushbuttonInterlock')

        case 'pushbutton invalid (threat)':
          return RED._('get-status.pushbuttonThreat')

        case 'door open too long':
          return RED._('get-status.doorOpenTooLong')

        case 'forced open':
          return RED._('get-status.forcedOpen')

        case 'fire':
          return RED._('get-status.fire')

        case 'forced closed':
          return RED._('get-status.forcedClosed')

        case 'theft prevention':
          return RED._('get-status.theftPrevention')

        case '24x7 zone':
          return RED._('get-status.zone24x7')

        case 'emergency':
          return RED._('get-status.emergency')

        case 'remote open door':
          return RED._('get-status.remoteOpenDoor')

        case 'remote open door (USB reader)':
          return RED._('get-status.usbOpenDoor')

        case '(reserved)':
          return RED._('get-status.reserved')
      }

      return text
    }
  }

  RED.nodes.registerType('get-status', GetStatusNode)
}
