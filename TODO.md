## v0.0.0

## IN PROGRESS

- [ ] don't do broadcast for non-broadcast destinations
- [ ] fallback to broadcast address if destination is not defined
- [ ] make 'send' function look like get/set
- [ ] make 'broadcast' function look like get/set
- [ ] internationalisation
- [ ] document uhppoted functions
- [ ] document examples
- [ ] unit tests
      - broadcast
      - execute
      - send
      - listen
      - get-devices
      - get-device
      - set-address
      - get/set-listener
      - get/set-time
      - get-status
      - codec invalid device ID
      - codec invalid address

- [ ] 'U' node icon
- [ ] label node ports
- [ ] configure message topic
- [ ] display errors on dashboard and/or output err on error
- [ ] refresh dashboard every e.g. 60s

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


