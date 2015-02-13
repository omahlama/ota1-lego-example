var network = require("./network.js")

var sendMessage = network.connect("127.0.0.1", 7777, messageHandler, connected)

function connected() {
	sendMessage({type: "ok"})
}

function messageHandler(msg) {
	console.log(msg)
	sendMessage(msg)
}