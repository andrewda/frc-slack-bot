
var bot = require('../bot');

module.exports = {
	config: {
		name: 'Help',
		description: 'Display a help message',
		command: 'help',
		syntax: 'help [plugin]',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		events.on('message', function(msg) {
			var plugins = bot.getPlugins();

			var message = 'Command List\n-----------------------';

			plugins.forEach(function(plugin) {
				message += '\n' + plugin.command + ' - ' + plugin.description;
			});

			plugin.send(message, msg.channel);
		});
	}
}