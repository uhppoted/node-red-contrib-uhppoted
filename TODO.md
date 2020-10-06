## v0.0.0

## IN PROGRESS

- [ ] unify broadcast/send/exec
- [ ] check node status thing conforms to node-red packaging guide
- [ ] README
- [ ] 'force broadcast' flag in config
- [ ] dashboard: create as project (Ref. https://nodered.org/docs/user-guide/projects)
- [ ] dashboard: add 'update' button to configuration page
- [ ] dashboard: distribute received event index
- [ ] dashboard: update displayed door labels when switching devices
- [ ] dashboard: store list of controllers in global config
- [ ] internationalisation
- [ ] integration tests
- [ ] 'U' node icon

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


