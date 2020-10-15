# node-red-uhppoted

# node-red-dashboard

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
![NPM version](https://badge.fury.io/js/node-red-dashboard.svg)
![NPM](https://img.shields.io/npm/l/node-red-dashboard)

Node-RED module implementing the API to interact with a UHPPOTE TCP/IP Wiegand Access Controller.

These nodes require:
- node-red version 1.1.3+
- node.js version 14.7.4+. 

For the latest updates see the [CHANGELOG.md](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/CHANGELOG.md)

## Pre-requisites

The `uhppoted` nodes require [Node-RED](https://nodered.org) to be installed.

## Install

The nodes are currently only installable from the github repository:

```
cd ~\.node-red\node_modules
git clone https://github.com/uhppoted/node-red-contrib-uhppoted.git
cd node-red-contrib-uhppoted
npm install
```

[comment]: # To install the stable version use the `Menu - Manage palette` option and 
[comment]: # search for `node-red-contrib-uhppoted`,  or run the following command in 
[comment]: # your Node-RED user directory (typically `~/.node-red`):
[comment]: # 
[comment]: #     npm i node-red-contrib-uhppoted
[comment]: # 
[comment]: # Restart your Node-RED instance and you should have the `uhppoted` nodes available in the palette. 
[comment]: # 
[comment]: # If you want to try the latest version from github, you can install it by
[comment]: # 
[comment]: #     npm i uhppoted/node-red-contrib-uhppoted

## Nodes

  - `get-devices`: fetches a list of access controllers on the local LAN
  - `get-device`: retrieves the information for a single access controller
  - `set-ip`: sets the controller IP address, net mask and gateway address
  - `get-status`: retrieves the current controller status
  - `get-time`: retrieves the current controller date and time
  - `set-time`: sets the controller date and time
  - `get-door-control`: retrieves the control configuration for a controller door
  - `set-door-control`: sets the control configuration for a controller door
  - `open-door`: remotely opens a controller door
  - `get-card`: retrieves a card record from a controller
  - `get-card-by-index`: retrieves a card record from a controller by record number
  - `put-card`: adds or updates a card record on a controller
  - `delete-card`: deletes a card record from a controller
  - `delete-all-cards`: deletes all card records stored on a controller
  - `listen`: establishes a listening connection for controller events
  - `get-event-index`: retrieves the current event index from a controller
  - `set-event-index`: sets the current event index on a controller
  - `get-event`: retrieves a single event from a controller

## Examples

## Discussions and suggestions

Please create an issue in the [github repository](https://github.com/uhppoted/node-red-contrib-uhppoted)

The current work in progress list is shown in the associated 
[github project](https://github.com/uhppoted/node-red-contrib/uhppoted/projects/1).

## Developers

```
cd ~\.node-red\node_modules
git clone https://github.com/uhppoted/node-red-contrib-uhppoted.git
cd node-red-contrib-uhppoted
npm install
```

The code follows standard es6lint 2020 style and lint rules.
