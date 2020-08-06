module.exports = {
    broadcast: function(node, request, timeout) {
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

            await this.wait(timeout);
        
            resolve(reply);
            sock.close();
        })
    },

    wait: function(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    },

    deviceId: function(bytes) {
        return bytes.getUint32(4,true)
    },

    address: function(bytes, offset) {
        const ip = require('ip');
                                
        return ip.fromLong(bytes.getUint32(offset,false))
    },

    hexify: function(slice) {
        const bytes = new Uint8Array(slice);
        const hex   = [];

        for (i=0; i<bytes.length; i++) {
            hex.push(('0' + bytes[i].toString(16)).slice(-2));
        }

        return hex
    },

    yyyymmdd: function(slice) {
        const bytes = new Uint8Array(slice);
        const date = [];

        for (i=0; i<bytes.length; i++) {
            date.push((bytes[i] >>>  4).toString(10));
            date.push((bytes[i] & 0x0f).toString(10));
        }
    
        date.splice(6,0,'-');
        date.splice(4,0,'-');

        return date.join('')
    }
}

