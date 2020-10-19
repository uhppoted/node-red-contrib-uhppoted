# node-red-contrib-uhppoted

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)

Node-RED module that implements an API for interacting with a UHPPOTE TCP/IP Wiegand access controller board. The API supports device and card management as well as handling for events.

#### Requirements:
- `node‑red` version 1.1.3+
- `node.js` version 14.7.4+
- `ip.js` version 1.1.5+ 

For the latest updates see the [CHANGELOG.md](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/CHANGELOG.md)

#### Installation

The nodes are currently only installable from the [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_ repository:


    cd ~\.node-red\node_modules
    git clone https://github.com/uhppoted/node-red-contrib-uhppoted.git
    cd node-red-contrib-uhppoted
    npm install


### Nodes

| Node               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `get‑devices`      | Fetches a list of access controllers on the local LAN        |
| `get‑device`       | Retrieves the information for a single access controller     |
| `set‑ip`           | Sets the controller IP address, net mask and gateway address |
| `get‑status`       | Retrieves the current controller status                      |
| `get‑time`         | Retrieves the current controller date and time               |
| `set‑time`         | Sets the controller date and time                            |
| `get‑door‑control` | Retrieves the control configuration for a controller door    |
| `set‑door‑control` | Sets the control configuration for a controller door         |
| `open‑door`        | Remotely opens a controller door                             |
| `get‑card`         | Retrieves a card record from a controller                    |
| `get‑card-by-index`| Retrieves a card record from a controller by record number   |
| `put‑card`         | Adds or updates a card record on a controller                |
| `delete‑card`      | Deletes a card record from a controller                      |
| `delete‑all‑cards` | Deletes all card records stored on a controller              |
| `listen`           | Establishes a listening connection for controller events     |
| `get‑event‑index`  | Retrieves the current event index from a controller          | 
| `set‑event‑index`  | Sets the current event index on a controller                 |
| `get‑event`        | Retrieves a single event from a controller                   |

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

### Examples

The [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_ repository includes a set of [basic examples](https://github.com/uhppoted/node-red-contrib-uhppoted/tree/master/examples/basic) that demonstrate the usage of each node, as well as a more complex [dashboard project](https://github.com/uhppoted/node-red-contrib-uhppoted/tree/master/examples/dashboard) that combines the nodes to create a dashboard:

| Node               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| [`1‑get‑devices`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/1-get-devices.json) | Example _flow_ for the `get‑devices` node |
| [`2‑get‑device`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/2-get-device.json)   | Example _flow_ for the `get‑device` node |
| [`3‑IPv4`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/3-IPv4.json)               | Example _flow_ for the `set‑ip` node |
| [`4‑listen`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/4-listen.json)           | Example _flow_ for the `listen`. `get-listener` and `set‑listener` nodes |
| [`5‑status`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/5-status.json)           | Example _flow_ for the `get‑status` node |
| [`6‑time`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/6-time.json)               | Example _flow_ for the `get‑time` and `set‑time` nodes |
| [`7‑doors`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/7-doors.json)             | Example _flow_ for the `get‑door‑control`, `set‑door‑control` and `open‑door` nodes |
| [`8‑cards`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/8-cards.json)             | Example _flow_ for the `get‑cards`, `get‑card`, `get‑card‑by‑index`, `put‑card`, `delete‑card` and `delete‑cards` nodes |
| [`9-events`](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/examples/basic/9-events.json)           | Example _flow_ for the `get‑event‑index`, `set‑event‑index` and `get‑event` nodes |


### Issues and Feature Requests

Please create an issue in the [node‑red‑contrib‑uhppoted](https://github.com/uhppoted/node-red-contrib-uhppoted) _github_ repository.

### License

[MIT](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/LICENSE)
