
var TheBlueAlliance = require('thebluealliance');

var tba = new TheBlueAlliance('SlackBot', 'A FRC Slack bot', '1')

module.exports = {
	config: {
		name: 'Teams',
		description: 'Get team data from TheBlueAlliance',
		command: 'team',
		syntax: 'team <teamid>',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		events.on('message', function(msg) {
			var team = plugin.getParameters(msg.text)[0];

			tba.getTeam(team, function(err, info) {
				if (err) {
					console.log(err);

					plugin.rtm.sendMessage('Error performing request: ' + err.message, msg.channel);
				} else {
					plugin.rtm.sendMessage('Team Name: ' + info.nickname + '\n' +
								'Motto: ' + info.motto + '\n' +
								'Location: ' + info.location + '\n' +
								'Rookie Year: ' + info.rookie_year + '\n' +
								'Website: ' + info.website, msg.channel);
				}
			});
		});
	}
}
