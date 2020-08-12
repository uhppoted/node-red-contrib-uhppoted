module.exports = function (RED) {
  function UhppoteNode (node) {
    RED.nodes.createNode(this, node)

    this.name = node.name
    this.bind = node.bind
    this.broadcast = node.broadcast
    this.listen = node.listen
    this.timeout = node.timeout
    this.debug = node.debug
  }

  RED.nodes.registerType('uhppote', UhppoteNode)
}
