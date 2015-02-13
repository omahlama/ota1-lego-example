var net = require("net")
var binary = require("binary")
var _ = require("lodash")

function parse(str) {
	return str.split(":")
		.map(function(part) { return part.split("=") })
		.reduce(function(memo, pair) { memo[pair[0]] = pair[1]; return memo}, {})
}

function stringify(obj) {
	return _.map(obj, function(value, key) {
		return key + "=" + value
	}).join(":")
}

function connect(host, port, messageHandler, connectionReady) {
	var socket = net.createConnection({host: host, port: port})

	socket.on("connect", function() {
		socket.setKeepAlive(true)
		socket.setNoDelay(true)

		binary.stream(socket).loop(function() {
			this.scan("message", "\n").tap(function(stash) {
				var message = stash.message.toString()

				var messageObject = parse(message)
				messageHandler(messageObject)
			})
		})

		connectionReady()
	})

	return function sendToServer(msgObject) {
		var str = stringify(msgObject)
		socket.write(str+"\n")
	}

}

exports.connect = connect