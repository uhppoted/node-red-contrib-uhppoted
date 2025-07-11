# CHANGELOG

## [1.1.12](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.12) - 2025-07-01

### Updated
1. Internal cleanups (minor).


## [1.1.11](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.11) - 2025-06-09

### Added
1. `uhppoted-get-antipassback` node.
2. `uhppoted-set-antipassback` node.

### Updated
1. Updated dependencies for security patches.
2. Fixed lookup tags for internationalisation.
3. Fixed inconsistent get/set semantics.
4. Fixed TCP transport bug (destination address ignored).
5. Fixed UDP transport timeout implementation.


## [1.1.10](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.10) - 2025-02-12

### Updated
1. Fixed bug in 'connected UDP' logic (not using injected controller address:port).


## [1.1.9](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.9) - 2025-01-29

### Updated
1. Added auto-send interval to get/set-listener nodes.


## [1.1.8](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.8) - 2024-09-06

### Added
1. Implemented TCP transport.

### Updated
1. Replaced _ip.js_ dependency with local module.
2. Deprecating _controllers_ list in _config_.


## [1.1.7](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.7) - 2024-03-26

### Added
1. `uhppoted-restore-default-parameters` node.


## [1.1.6](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.6) - 2023-12-01

### Added
1. `uhppoted-set-door-passcodes` node.

### Updated
1. Fixed input/output labels for renamed nodes.
2. Reworked `get-status` and `get-event` to return '' for zero value event timestamps.
3. Reworked `get-status` to explicitly handle response with no event.


## [1.1.5](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.5) - 2023-08-30

### Added
1. `uhppoted-activate-keypads` node.


## [1.1.4](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.4) - 2023-06-13

### Added
1. `uhppoted-set-interlock` node.


## [1.1.3](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.3) - 2023-03-17

### Added
1. uhppoted-set-pc-control node.
2. Card PIN field to `put-card`, `get-card` and `get-card-by-index`.

### Updated
1. Changed package.json to support NodeRED v2.2.3+


## [1.1.2](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.2) - 2022-12-16

### Changed
1. Reduced visiblity of 'upgrading from v0.x' notes to a section under _Installation_.
2. Multiple dependency updates for security patches.


## [1.1.1](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.1) - 2022-10-14

### Changed
1. Added 'swipe open' and 'swipe close' event reasons.


## [1.1.0](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.1.0) - 2022-09-18

### Added
1. github workflow 
2. node-red-dev sanity check

### Changed
1. Bumped NodeRED version to 3.0.2
2. Bumped package dependencies to latest for security patches
3. Included examples.json in NPM package

## [1.0.0](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v1.0.0) - 2022-09-10

### Removed
1. Removed all nodes without a _uhppote-_ prefix
2. Remove examples, dashboard and integration tests using deprecated nodes

## [0.9.1](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.9.1) - 2022-09-01

### Changed
1. Reworked README formatting (was breaking NodeRED page)
2. Reinstated examples removed from v0.9.0


## [0.9.0](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.9.0) - 2022-08-27

### Changed
1. Created duplicate set of nodes with _uhppoted-_ prefix (cf. [Config node name conflict](https://github.com/uhppoted/node-red-contrib-uhppoted/issues/11)
2. Updated examples.json and dashboard.json to use _uhppoted-_ prefixed nodes
3. Updated integration tests to use _uhppoted-_ prefixed nodes
4. Added 'notice of breaking change' to README 
5. Added MIGRATE.md with instructions for migrating from v0.9.0 to v1.0.0
6. Cleaned up _examples.json_
7. Added `engines` section to _package.json_


## [0.8.1](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.8.1) - 2022-08-01

### Changed
1. Updated dependencies.

## [0.8.1](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.8.1) - 2022-08-01

### Changed
1. Updated dependencies.


## [0.7.3](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.7.3) - 2022-06-01

Updated dependencies.

## [0.7.2](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.7.2) - 2022-01-26

Updated dependencies and reworked event handling for _overwritten_ events.

### Changed

1. Update NodeRED dependency to v2.1.4
2. Updated associated NodeRED components
3. Replaced regular expressions with NodeJS v14.18.3 compatible syntax
   (cf. https://github.com/uhppoted/uhppoted-nodejs/issues/5)
4. Throws an 'no event' error if `get-event` retrieves an event that does not exist
5. Throws an 'overwritten event' error if `get-event` retrieves an event that has been overwritten
   (cf. https://github.com/uhppoted/node-red-contrib-uhppoted/issues/7)


## [v0.7.1](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.7.1) 

Implements the task list management functions from the extended API

1. Added nodes for managing a controller task list:
   - `clear-task-list`
   - `add-task`
   - `refresh-task-list`


## [v0.7.0](https://github.com/uhppoted/node-red-contrib-uhppoted/releases/tag/v0.7.0)

Implements the time profile functions from the extended API.

1. New nodes:
   - `get-time-profile`
   - `set-time-profile`
   - `clear-time-profiles`

2. Reworks `put-card` with support for time profiles
3. Reworks`get-card` and `get-card-by-index` with support for time profiles
4. Updates dependency versions
5. Simplifies integration tests flow


## v0.6.12: Maintenance release to update dependencies

1. Updates NodeRED dependency to 1.3.3


## v0.6.10: Maintenance release to update dependencies

1. Updates NodeRED dependency to 1.2.9


## v0.6.9: Security fix for CVE-2020-28168

1. Updates node-red dependency to v1.2.7 with axios v0.21.1 patched for 
   [CVE-2020-28168](https://github.com/advisories/GHSA-4w2v-q235-vp99)


## v0.6.8: Implements decoding for _UHPPOTE_ firmware `v6.62` _listen events_

1. Adds handling for non-standard format of _listen events_ generated by controllers with 
   firmware version v6.62.


## v0.6.7: Implements `record-special-events` node for enabling/disabling door events

1. Adds `record-special-events` node for enabling and disabling door open, door close
   and door button events.
2. Bumps version of `https://github.com/isaacs/ini` indirect dependency (security fix)


## v0.6.6: Bug fix

1. Fixes typo in set-door-control node that precluded setting the 'controlled' door state.
2. Ensured request timers were cancelled in the event of a an error.
3. Added minimal manual integration test flow.


## v0.6.5: Initial release

1. Working set of NodeRED nodes that implement an API for interacting with the UHPPOTE Wiegand TCP/IP access control boards.

