### v0.6.7: Implements `record-special-events` node for enabling/disabling door events

1. Adds `record-special-events` node for enabling and disabling door open, door close
   and door button events.
2. Bumps version of `https://github.com/isaacs/ini` indirect dependency (security fix)

### v0.6.6: Bug fix

1. Fixes typo in set-door-control node that precluded setting the 'controlled' door state.
2. Ensured request timers were cancelled in the event of a an error.
3. Added minimal manual integration test flow.

### v0.6.5: Initial release

1. Working set of NodeRED nodes that implement an API for interacting with the UHPPOTE Wiegand TCP/IP access control boards.

