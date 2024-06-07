# TODO

### IN PROGRESS

- [ ] TCP/IP protocol (cf. https://github.com/uhppoted/uhppote-core/issues/17)
      - [x] uhppoted
      - [x] uhppoted-get-device
      - [x] uhppoted-set-ip
      - [x] uhppoted-get-time
      - [x] uhppoted-set-time
      - [x] uhppoted-get-door-control
      - [x] uhppoted-set-door-control
      - [x] uhppoted-get-listener
      - [x] uhppoted-set-listener
      - [x] uhppoted-get-status
      - [x] uhppoted-get-cards
      - [x] uhppoted-get-card
      - [x] uhppoted-get-card-by-index
      - [x] uhppoted-put-card
      - [x] uhppoted-delete-card
      - [x] uhppoted-delete-all-cards
      - [x] uhppoted-get-time-profile
      - [x] uhppoted-set-time-profile
      - [x] uhppoted-clear-time-profiles
      - [x] uhppoted-add-task
      - [x] uhppoted-clear-task-list
      - [x] uhppoted-refresh-task-list
      - [x] uhppoted-record-special-events
      - [x] uhppoted-get-event-index
      - [x] uhppoted-set-event-index
      - [x] uhppoted-get-event
      - [x] uhppoted-open-door
      - [x] uhppoted-set-pc-control
      - [x] uhppoted-set-interlock
      - [x] uhppoted-activate-keypads
      - [x] uhppoted-set-door-passcodes
      - [x] uhppoted-restore-default-parameters
      - [ ] examples
      - [ ] integration-tests
      - [ ] documentation
      - [ ] CHANGELOG
      - [ ] README
      - [ ] // FIXME remove (debugging only

```
      const controller = common.resolve(msg.payload)

controller.controller
, controller.address, controller.protocol

    <p>The input <code>msg.payload</code> is a JSON object identifying the destination controller.</p>
    <p>The controller is identified by specifying either the (legacy) 'deviceId' or the composite
       'controller' object which supports both UDP and TCP connections. Defaults to broadcast UDP if
       the address or protocol are not valid.</p>

        <dt>controller.controller<span class="property-type">uint32</span></dt>
        <dd>controller serial number</dd>
        <dt>controller.address<span class="property-type">string</span></dt>
        <dd>controller IPv4 address</dd>
        <dt>controller.protocol<span class="property-type">string</span></dt>
        <dd>controller connection protocol ('udp' or 'tcp')</dd>


    "controller": {
        "controller": 405419896,
        "address": "192.168.1.100",
        "protocol": "tcp"
    }

    "controller": {
        "controller": 405419896,
        "address": "192.168.1.100",
        "protocol": "tcp"
    },
```

## TODO

- [ ] GetEvents
- [ ] NPX integration tests
- [ ] (?) use JSON.parse if node input is a string

