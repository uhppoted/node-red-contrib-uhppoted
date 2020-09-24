module.exports = function (RED) {
  function ConfigNode (node) {
    RED.nodes.createNode(this, node)

    this.name = node.name
    this.bind = node.bind
    this.broadcast = node.broadcast
    this.listen = node.listen
    this.timeout = node.timeout
    this.debug = node.debug
    this.controllers = node.controllers
  }

  RED.nodes.registerType('config', ConfigNode)
}
