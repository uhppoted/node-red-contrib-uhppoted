module.exports = {
  emit: function (node, topic, object) {
    node.send({ topic: topic, payload: object })
  },

  error: function (node, err) {
    node.status({ fill: 'red', shape: 'dot', text: 'error' })
    node.warn('uhppoted::set ' + err)
  }
}
