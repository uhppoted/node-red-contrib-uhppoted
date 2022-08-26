# HOWTO: Migrating a NodeRED flow from v0.9.x to v1.0.x

## Using the NodeRED editor

1. **Make a backup copy of the flow**.
2. Identify the _uhppoted_ nodes to be replaced - they will be coloured red on the flow.
3. Edit one of the existing nodes and open the configuration information (if any).
4. Copy the configuration information.
5. Drop the equivalent replacement node on to the flow.
6. Edit the replacement node and create a new configuration with the information from step 3.
7. Rewire the flow to route the connections to the replacement node.
8. Rinse and repeat for all remaining nodes.

## Editing the NodeRED flow JSON file

By far the easiest way to migrate a flow as long as you're reasonably careful. The `grep` patterns files 
referenced below can be downloaded from:
- [migrate_v0.9.x.grep](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/documentation/migrate_v0.9.x.grep)
- [migrate_v1.0.0.grep](https://github.com/uhppoted/node-red-contrib-uhppoted/blob/master/documentation/migrate_v1.0.0.grep)

1. **Make a backup copy of the flow JSON file**.
2. List the nodes that need to be updated:
```
grep -f migrate_v0.9.x.grep flow.json
```

3. Open the JSON file in a text editor and make the following changes

   2.1 Change the _configuration_ node type to _uhppoted-config_:
```
BEFORE
    {
        "id": "cbd92359.dbf19",
        "type": "config",
        "z": "",
        "name": "example",
        "timeout": "5000",
        "bind": "192.168.1.100",
        "broadcast": "192.168.1.255:60000",
        "listen": "192.168.1.100:60001",
        "controllers": "{\"303986753\":{\"address\":\"192.168.1.100:60000\"},\"405419896\":{\"address\":\"192.168.1.100:60000\"}}",
        "debug": true
    },

AFTER
    {
        "id": "cbd92359.dbf19",
        "type": "uhppoted-config",
        "z": "",
        "name": "example",
        "timeout": "5000",
        "bind": "192.168.1.100",
        "broadcast": "192.168.1.255:60000",
        "listen": "192.168.1.100:60001",
        "controllers": "{\"303986753\":{\"address\":\"192.168.1.100:60000\"},\"405419896\":{\"address\":\"192.168.1.100:60000\"}}",
        "debug": true
    },
```

   2.2 Update the node _type_ for all existing nodes to use the _uhppoted-_ prefix, e.g.:
```
BEFORE
    {
        "id": "6a470566.d4725c",
        "type": "get-devices",
        "z": "a640a000.d83cb",
        "name": "get-devices",
        "topic": "get-devices",
        "config": "cbd92359.dbf19",
        "x": 310,
        "y": 80,
        "wires": [
            [
                "6699677.c355098",
                "30341779.5c29e8"
            ]
        ]
    },

AFTER
    {
        "id": "6a470566.d4725c",
        "type": "uhppoted-get-devices",
        "z": "a640a000.d83cb",
        "name": "get-devices",
        "topic": "get-devices",
        "config": "cbd92359.dbf19",
        "x": 310,
        "y": 80,
        "wires": [
            [
                "6699677.c355098",
                "30341779.5c29e8"
            ]
        ]
    },
```

3. Save and exit

4. Confirm all the nodes have been updated:
```
grep -f migrate_v0.9.x.grep flow.json
grep -f migrate_v1.0.0.grep flow.json
```

5. Confirm no other nodes have been unexpectedly updated:
```
grep '"type":' flow.json | grep '"uhppoted-' | grep -v -f migrate_v1.0.0.grep
```

6. Start the flow and confirm all the nodes are using the new _uhppoted-_ nodes ('old' nodes will be highlighted in red).



