module.exports = function(RED) {    
    function GetDevicesNode(config) {
        RED.nodes.createNode(this, config);
        
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
                                id: bytes.getUint32(4, true)
                                // IpAddress    net.IP             `uhppote:"offset:8"`
                                // SubnetMask   net.IP             `uhppote:"offset:12"`
                                // Gateway      net.IP             `uhppote:"offset:16"`
                                // MacAddress   types.MacAddress   `uhppote:"offset:20"`
                                // Version      types.Version      `uhppote:"offset:26"`
                                // Date         types.Date         `uhppote:"offset:28"`                            
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

            broadcast(this, request, 5000)
                .then(reply   => { return decode(reply) })
                .then(devices => { return emit(devices) })
                .catch(err    => { node.error('uhppoted::broadcast  ' + err) });
        });
    }

    RED.nodes.registerType('get-devices', GetDevicesNode);
}

function broadcast(node, request, timeout) {
    const dgram = require('dgram');
    const opts  = { type: 'udp4', reuseAddr:true };
    const sock  = dgram.createSocket(opts);
    const reply = [];
    const rq    = new Uint8Array(64);

    rq.set(request);

    return new Promise(async (resolve, reject) => {        
        const send = function() {
            sock.send(rq, 0, rq.length, 60000, '255.255.255.255', (err, bytes) => {
                if (err) {
                    reject(err);                    
                }
            });
        }

        const received = function(message) {
            reply.push(new Uint8Array(message));
        }

        const bound = function() {
            sock.setBroadcast(true);
            send();
        }

        const error = function(err) {
            reject(err);
        }

        sock.on('listening', () => { bound(); });            
        sock.on('message',   (message, remote) => { received(message) });
        sock.on('error',     (err)  => { error(err) });
        sock.bind();

        await wait(timeout);
        
        resolve(reply);
        sock.close();
    })
}

function wait(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

