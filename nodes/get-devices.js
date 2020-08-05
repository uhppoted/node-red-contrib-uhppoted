
module.exports = function(RED) {    
    function GetDevicesNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            let request  = [ 0x17, 0x94 ];
            
            broadcast(this, request).then(reply => {
                let devices = [];

                reply.forEach(element => {
                    if ((element.length == 64) && (element[0] == 0x17) && (element[1] == 0x94)) {
                        let v = new DataView(element.buffer);
                        let device = { 
                            device: {
                                id: v.getUint32(4,true)
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
                })

                msg.payload = devices;
                node.send(msg);
            });
        });
    }

    RED.nodes.registerType('get-devices', GetDevicesNode);
}

async function broadcast(node, request) {
    const dgram = require('dgram');
    const opts  = { type: 'udp4', reuseAddr:true };
    const sock  = dgram.createSocket(opts);
    const rq = new Uint8Array(64);

    rq.set(request);

    let reply = [];

    sock.on('error', function(err) {
        node.error('uhppoted::broadcast  ' + err);
    });

    sock.on('message', function (message, remote) {
        reply.push(new Uint8Array(message));
    });

    sock.on('listening', () => {
        node.log('uhppoted::broadcast.listening  ' + sock.address().address + ':' + sock.address().port);
        sock.setBroadcast(true);

        sock.send(rq, 0, rq.length, 60000, '255.255.255.255', function(err, bytes) {
            if (err) {
                node.error('uhppoted::broadcast  ' + err);
            }
        });
    });    
    
    sock.bind();

    await new Promise(resolve => setTimeout(resolve, 2500));

    close(sock);
    
    return reply
}

function close(sock) {
    try {
        sock.close();
    } catch (err) {
        node.error('uhppoted::close  ' + err);
    }
}

