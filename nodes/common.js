module.exports = {
  emit: function (node, topic, object) {
    node.send({ topic, payload: object })
  },

  ok: function (node, err) {
    node.status({})
  },

  error: function (node, err) {
    node.status({ fill: 'red', shape: 'dot', text: 'node-red:common.status.error' })
    node.warn('uhppoted::' + err)
  },

  resolve: function (payload) {
    if (payload.controller != null) {
      return _resolve(payload.controller)
    }

    if (payload.deviceId != null) {
      return { id: payload.deviceId, address: null, protocol: 'udp' }
    }

    throw new Error("missing 'controller' parameter")
  },

  clamp: function (v, min, max) {
    return Math.min(Math.max(v, min), max)
  }
}

function _resolve (controller) {
  if (typeof (controller) === 'number') {
    return { id: controller, address: null, protocol: 'udp' }
  }

  if (typeof (controller) === 'object') {
    const { id, address = null, protocol = 'udp' } = controller
    const proto = `${protocol}`.toLowerCase() === 'tcp' ? 'tcp' : 'udp'

    if ((address != null) && (typeof (address) === 'string')) {
      const match = `${address}`.match(/^(.+?):([0-9]+)$/)

      if (match) {
        const addr = match[1]
        const port = parseInt(match[2], 10)

        return { id, address: { address: addr, port }, protocol: proto }
      } else {
        return { id, address: { address, port: 60000 }, protocol: proto }
      }
    }

    if ((address != null) && (typeof (address) === 'object')) {
      const { address: addr, port } = address
      const p = parseInt(`${port}`)

      if (!Number.isNaN(p) && p > 0 && p < 65536) {
        return { id, address: { address: addr, port: p }, protocol: proto }
      } else {
        return { id, address: { address: addr, port: 60000 }, protocol: proto }
      }
    }

    return { id, address, protocol: 'udp' }
  }
}
