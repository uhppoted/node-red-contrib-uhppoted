module.exports = function(RED) {    
    const uhppote = require('./uhppote.js');

    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);
        
        this.timeout = config.timeout;
        this.bind = config.bind;
        this.dest = config.broadcast;
        
        const node = this;
        
        node.on('input', function(msg) {
            const request = [ 0x17, 0x94 ];

            let decode = function(reply) {
                const devices = [];
                reply.forEach(element => {
                    if ((element.length == 64) && (element[0] == 0x17) && (element[1] == 0x94)) {
                        let bytes  = new DataView(element.buffer);
                        let device = { 
                            device: {
                                id:      uhppote.deviceId(bytes),
                                address: uhppote.address(bytes, 8),
                                subnet:  uhppote.address(bytes, 12),
                                gateway: uhppote.address(bytes, 16),
                                MAC:     uhppote.hexify(bytes.buffer.slice(20,26)).join(':'),
                                version: uhppote.hexify(bytes.buffer.slice(26,28)).join(''),
                                date:    uhppote.yyyymmdd(bytes.buffer.slice(28,32))
                            }
                        };

                        devices.push(device);
                    }
                });
                
                return devices
            }

            let emit = function(devices) {
                msg.payload = devices;
                node.send(msg);
            }

            uhppote.broadcast(this.bind, this.dest, request, this.timeout)
                .then(reply   => { return decode(reply) })
                .then(devices => { return emit(devices) })
                .catch(err    => { node.error('uhppoted::broadcast  ' + err) });
        });
    }

    RED.nodes.registerType('get-devices', GetDevicesNode);
}

