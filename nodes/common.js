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
  }
}
