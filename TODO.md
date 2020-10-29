## v0.0.0

## IN PROGRESS

- [ ] dashboard: configure - changing controllers should restore from flow context
- [ ] (maybe) rework codec as map of functions
- [ ] Release
- [ ] Publish to NPM, add badges to README and update README installation
      e.g. ![NPM version](https://badge.fury.io/js/node-red-contrib-uhppoted.svg)
           ![NPM](https://img.shields.io/npm/l/node-red-contrib-uhppoted)
           [comment]: # (To install the stable version use the `Menu - Manage palette` option and) 
           [comment]: # (search for `node-red-contrib-uhppoted`,  or run the following command in)
           [comment]: # (your Node-RED user directory (typically `~/.node-red`:)
           [comment]: # ()
           [comment]: # (    npm i node-red-contrib-uhppoted)
           [comment]: # ()
           [comment]: # (Restart your Node-RED instance and you should have the `uhppoted` nodes available in the palette. )
           [comment]: # ()
           [comment]: # (If you want to try the latest version from github, you can install it by)
           [comment]: # ()
           [comment]: # (    npm i uhppoted/node-red-contrib-uhppoted)

- [x] dashboard: events - show last event index on detail page
- [x] dashboard: events - reload fetched events on tab
- [x] dashboard: events - ignore events if event id does not match index
- [x] dashboard: events - clear table button
- [x] dashboard: cards - changing controllers should clear list/restore from flow context
- [x] dashboard: use list of controllers in global config
- [x] dashboard: reload received events table on switching to tab
- [x] dashboard: update displayed door labels when switching devices
- [x] dashboard: add 'update' button to configuration page
- [x] 'force broadcast' flag in config
- [x] 'U' node icon
- [x] document lookup functions
- [x] unit test for codec.decode with/without translator
- [x] unify broadcast/send/exec
- [x] document codec functions
- [x] README
- [x] internationalisation
- [x] put card.status output at top of get-card-xxx outputs
- [x] check node status thing conforms to node-red packaging guide (https://nodered.org/docs/creating-nodes/i18n)
- [x] split get-card output to separate status + record
- [x] document uhppoted functions
- [x] label node ports
- [x] rework doors/buttons to be keys of object rather than array
- [x] document examples
- [x] basic examples
- [x] optional node message topic
- [x] make 'broadcast' function look like get/set/send
- [x] config: device list editor
- [x] make 'send' function look like get/set
- [x] fallback to broadcast address if destination is not defined
- [x] add device list to configuration
- [x] rename uhppote to config or somesuch
- [x] get-event
- [x] set-event-index
- [x] export constants for opcodes
- [x] get-event-index
- [x] delete-cards
- [x] delete-card
- [x] put-card
- [x] get-card-by-index
- [x] get-card
- [x] rename subnet to netmask
- [x] open-door
- [x] broadcast only for broadcast addresses
- [x] set-door-control
- [x] update codec 'set' tests to deep.equal object
- [x] update codec 'get' tests to deep.equal message
- [x] get-door-control
- [x] set-listener
- [x] commonalise set code
- [x] get-listener
- [x] commonalise get code
- [x] get-status
- [x] set-time
- [x] make configuration destinatation address:port
- [x] get-time
- [x] include rinfo in `debug`
- [x] make dasboard prettier
- [x] node examples
- [x] set-address
- [x] `log` (or `debug`) function for broadcast/execute/listen
- [x] reject with Error on timeouts
- [x] `uhppoted.execute`
- [x] rework event list as table
- [x] codec
- [x] use deviceId everywhere to be consistent
- [x] node help
- [x] get-device: add device ID to request
- [x] listen
- [x] lookup
- [x] get-device(s): remove this.config object
- [x] configuration node for bind/broadcast/timeout etc
- [x] get-device
- [x] uhppote::broadcast
- [x] ESLint
- [x] Add broadcast address to node properties
- [x] Add bind address to node properties
- [x] Add timeout to node properties
- [x] Decode get-devices reply
- [x] Figure out how to use Promises rather than callbacks for UDP
- [x] 'catch' promise errors

## TODO

- [ ] integration tests

