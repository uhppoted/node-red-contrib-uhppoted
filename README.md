# node-red-contrib-uhppoted

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm version](https://badge.fury.io/js/node-red-contrib-uhppoted.svg)](https://badge.fury.io/js/node-red-contrib-uhppoted)
![NPM](https://img.shields.io/npm/l/node-red-contrib-uhppoted)
![build](https://github.com/uhppoted/node-red-contrib-uhppoted/workflows/build/badge.svg)

Node-RED module that implements an API for interacting with a UHPPOTE TCP/IP Wiegand access controller board. The API supports controller and card management
as well support for controller events. 

#### In The Wild
- _Monitoring a model train railroad with NodeRED + node-red-contrib-uhppoted:_

    [YouTube: Configure Node-RED to listen for RFID tags on local network - Model Railway Control Room Part Five](https://www.youtube.com/watch?v=d8-XKxpn9YA)


#### Release Notes

> **PLEASE NOTE**
>
> _As of v1.1.8 the `controllers` list in the `config` is being deprecated in favour of using a `controller` object in the input 
> message payload to a `uhppoted` node. The legacy implementation will be supported until at least the next major release but you are
> encouraged to update your flows._
>
> _For more information see the [controllers](#controllers) section._

##### Current Release

**[v1.1.13](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.13) - 2026-01-27**

1. Updated to NodeRED 4.1.4.
2. Reworked examples to run in Docker container.
3. Reworked integration tests to run in Docker container.
4. Removed _dashboard_ example (`node-red-dashboard` component deprecated by NodeRED team).


#### Requirements:
- `node‑red` version 2.2.3+
- `node.js` version 14.18.3+

For the latest updates see the [CHANGELOG.md](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/CHANGELOG.md)

#### Installation

To install the stable version use the `Menu - Manage palette` option and search for `node-red-contrib-uhppoted`,
or run the following command in your Node-RED user directory (e.g. `~/.node-red` on MacOS and Linux):

    npm install node-red-contrib-uhppoted

Restart your Node-RED instance and you should have the `uhppoted` nodes available in the palette.

If you want to try the development version from the [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_
repository:

    cd ~/.node-red/node_modules
    git clone https://github.com/uhppoted/node-red-contrib-uhppoted.git
    cd node-red-contrib-uhppoted
    npm install

##### _Upgrading from v0.x_

_Please note that updating from `node-red-contrib-uhppoted` v0.x to v1.x is a breaking change. `node-red-contrib-uhppoted` v1.0
fixed node name conflicts with other NodeRED modules and unfortunately changing node names throughout requires a breaking change._

_Please see:_
- _[Issue #11: config node name conflict](https://github.com/uhppoted/node-red-contrib-uhppoted/issues/11) for the original cause_
- _[Discussion: prefixing all nodes with uhppoted- to avoid naming conflicts](https://github.com/uhppoted/node-red-contrib-uhppoted/discussions/12) for any comments and further discussion._
- _[HOWTO: Migrating a NodeRED flow from v0.9.x to v1.0.x](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/documentation/MIGRATE.md)_


### Nodes

| Node                         | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `get‑devices`                | Fetches a list of access controllers on the local LAN         |
| `get‑device`                 | Retrieves the information for a single access controller      |
| `set‑ip`                     | Sets the controller IP address, net mask and gateway address  |
| `get‑status`                 | Retrieves the current controller status                       |
| `get‑time`                   | Retrieves the current controller date and time                |
| `set‑time`                   | Sets the controller date and time                             |
| `get‑door‑control`           | Retrieves the control configuration for a controller door     |
| `set‑door‑control`           | Sets the control configuration for a controller door          |
| `open‑door`                  | Remotely opens a controller door                              |
| `get‑card`                   | Retrieves a card record from a controller                     |
| `get‑card-by-index`          | Retrieves a card record from a controller by record number    |
| `put‑card`                   | Adds or updates a card record on a controller                 |
| `delete‑card`                | Deletes a card record from a controller                       |
| `delete‑all‑cards`           | Deletes all card records stored on a controller               |
| `get-time-profile`           | Retrieve a time profile from a controller                     |
| `set-time-profile`           | Defines a time profile on a controller                        |
| `clear-time-profiles`        | Deletes all time profiles defined on a controller             |
| `clear-task-list`            | Clears a controller task list                                 |
| `add-task`                   | Adds a new task to a controller's task list                   |
| `refresh-task-list`          | Refreshes a controller task list                              |
| `record-special-events`      | Enables or disables door events                               | 
| `get‑event‑index`            | Retrieves the current event index from a controller           | 
| `set‑event‑index`            | Sets the current event index on a controller                  |
| `get‑event`                  | Retrieves a single event from a controller                    |
| `set-pc-control`             | Delegates access control to an offboard application           |
| `set-interlock`              | Sets the controller door interlock mode                       |
| `activate-keypads`           | Activates/deactivates the reader access keypads               |
| `set-door-passcodes`         | Sets the supervisor keypad passcodes for a door               |
| `get-antipassback`           | Retrieves the controller anti-passback mode                   |
| `set-antipassback`           | Sets the controller anti-passback mode                        |
| `restore-default-parameters` | Resets a controller to the manufacturer default configuration |
| `listen`                     | Establishes a listening connection for controller events      |

All nodes take a message with JSON object payload as input and send a message with a JSON object payload as output.

##### Configuration

The nodes can (optionally) accept a configuration that overrides the default settings:

|               | Description                                    | Default           |
| ------------- | ---------------------------------------------- | ----------------- |
| `timeout`     | Request execution timeout (in milliseconds)    | `5000`            |
| `bind`        | UDP `address` to bind to for requests          | `0.0.0.0`         |
| `broadcast`   | UDP `address` for broadcast requests           | `255.255.255.255` |
| `listen`      | UDP address:port on which to listen for events | `0.0.0.0:60000`   |
| `controllers` | List of controller specific IPv4 address:port overrides for systems where a controller is either not located on the same LAN (i.e. cannot receive or respond to UDP broadcasts) or where directed UDP messages are preferred. | `(none)` |
| `debug`      | Enables logging of request/response messages to the console | `false` |

##### Controllers

All nodes (other than `get-devices`) expect a controller in the input message payload. v1.1.8+ supports two formats for the controller:
- the (legacy) implementation which expects the controller serial number as a device ID:
```
{
    "deviceId": 405419896
}
```
- the revised implementation which expects the `controller` as an object:
```
{
    "controller": {
        "id": 405419896,
        "address": "192.168.1.100",
        "protocol": "tcp"
    }
}

- id: controller serial number
- address: controller IPv4 address (optional)
- protocol: 'udp' or 'tcp' (optional)

Defaults to UDP broadcast transport if the address is null or the protocol is not 'tcp'.
```

**NOTE:**

_The legacy implementation will be supported until at least the next major release but any future enhancements will expect the _controller_
object and you are encouraged to update your flows accordingly._ 

In most cases, this is simply a matter of updating the input message payload to a _uhppoted_ node from e.g.:
```
{
    "deviceId": 405419896,
    "cardNumber": 10058400
}
```
to
```
{
    "controller": {
        "id": 405419896
    },
    "cardNumber": 10058400
}
```


### Examples

The [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_ repository includes a set of [basic examples](https://github.com/uhppoted/node-red-contrib-uhppoted/tree/master/examples/examples.json) that demonstrate the usage of each node.:

| Node               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| [`1‑get‑devices`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/1-get-devices.json) | Example _flow_ for the `get‑devices` node |
| [`2‑get‑device`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/2-get-device.json)   | Example _flow_ for the `get‑device` node |
| [`3‑set-ip`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/3-set-ip.json)           | Example _flow_ for the `set‑ip` node |
| [`4‑event-listener`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/4-event-listener.json)   | Example _flow_ for the `listen`. `get-listener` and `set‑listener` nodes |
| [`5‑get-status`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/5-get-status.json)           | Example _flow_ for the `get‑status` node |
| [`6‑time`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/6-time.json)               | Example _flow_ for the `get‑time` and `set‑time` nodes |
| [`7‑doors`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/7-doors.json)             | Example _flow_ for the `get‑door‑control`, `set‑door‑control`, `open‑door`, `activate-keypads`, `set-interlock`, `set-door-passcodes`, `get-antipassback` and `set-antipassback` nodes |
| [`8‑cards`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/8-cards.json)             | Example _flow_ for the `get‑cards`, `get‑card`, `get‑card‑by‑index`, `put‑card`, `delete‑card` and `delete‑cards` nodes |
| [`9-time-profiles`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/9-time-profiles.json) | Example _flow_ for the `get-time-profile`, `set‑time-profile` and `clear-time-profiles` nodes |
| [`10-tasklist`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/10-tasklist.json) | Example _flow_ for the `clear-task-list`, `add-task` and `refresh-task-list` nodes |
| [`11-events`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/11-events.json)     | Example _flow_ for the `record-special-events`, `get‑event‑index`, `set‑event‑index` and `get‑event` nodes |
| [`12-set-pc-control`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/12-set-pc-control.json) | Example _flow_ for the `set-pc-control` node |
| [`13-restore-default-parameters`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/13-13-restore-default-parameters.json) | Example _flow_ for the `restore-default-parameters` node |


### Issues and Feature Requests

Please create an issue in the [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_ repository.

### License

[MIT](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/LICENSE)
