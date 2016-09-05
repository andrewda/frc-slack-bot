
module.exports = {
	config: {
		name: 'Echo',
		description: 'Echo the user',
		command: 'echo',
		syntax: 'echo <message>',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		events.on('message', function(msg) {
			plugin.rtm.sendMessage(plugin.stripCommand(msg.text), msg.channel);
		});
	}
}
