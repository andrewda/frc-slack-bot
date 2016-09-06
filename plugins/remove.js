
var config = require('../config.json');

module.exports = {
	config: {
		name: 'Remove',
		description: 'Remove messages with an emoji'
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		var pluginConfig = config.plugins[plugin.getName()];
		var chat = plugin.rtm._chat;

		events.on('reaction_added', function(msg) {
			if (msg.reaction === pluginConfig.remove_reaction) {
				chat.delete(msg.item.ts, msg.item.channel);
			}
		});
	}
}
