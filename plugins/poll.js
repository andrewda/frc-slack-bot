
var config = require('../config.json');

module.exports = {
	config: {
		name: 'Poll',
		description: 'Create and vote on polls',
		command: 'poll',
		syntax: '<question>',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		var pluginConfig = config.plugins[plugin.getName()];

		events.on('message', function(msg) {
			var message = updatePoll(msg.user, plugin.stripCommand(msg.text), 0, 0);

			plugin.rtm.sendMessage(message, msg.channel);
		});

		events.on('reaction_added', reactionHandler);
		events.on('reaction_removed', reactionHandler);

		function reactionHandler(msg) {
			var channel = msg.item.channel;

			if (msg.item_user === config.slack.botid) {
				plugin.web.reactions.get({
					channel: channel,
					timestamp: msg.item.ts,
					full: true
				}, function(err, reactions) {
					var msg = reactions.message;

					var userExists = /<@(.*)>/.test(msg.text);
					var newlines = msg.text.split('\n').length;

					if (userExists && newlines >= 3) {
						var results = {
							yes: 0,
							no: 0
						};

						var user = msg.text.match(/<@(.*)>/)[1];
						var question = msg.text.split('\n')[2].trim();

						if (msg.reactions) {
							msg.reactions.forEach(function(reaction) {
								switch (reaction.name) {
									case '+1': results.yes = reaction.count; break;
									case '-1': results.no = reaction.count; break;
								}
							});
						}

						var message = updatePoll(user, question, results.yes, results.no);

						plugin.web.chat.update(msg.ts, channel, message);
					}
				});
			}
		}

		function updatePoll(user, question, yes, no) {
			return `Poll _(created by <@${user}>)_` +
					`\n-----------------------` +
					`\n${question}` +
					`\n` +
					`\n"Yes" votes (:+1: reaction) - ${yes}` +
					`\n"No" votes (:-1: reaction) - ${no}`;
		}
	}
}
