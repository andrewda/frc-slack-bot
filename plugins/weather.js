
var gp = require('weather-gov-graph-parse');
var schedule = require('node-schedule');

var config = require('../config.json');

module.exports = {
	config: {
		name: 'Weather',
		description: 'Get weather data from weather.gov',
		command: 'weather',
		syntax: '[latitude] [longitude]',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		var weatherConfig = config.plugins[plugin.getName()];

		var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = weatherConfig.meeting_days.map(function(m) { return ((m - 1) > 0) ? m - 1 : 6 });
		rule.hour = weatherConfig.update_hour;
		rule.minute = 0;

		events.on('message', function(msg) {
			var latitude = plugin.getParameters((msg.text))[0]
							? plugin.getParameters(msg.text)[0]
							: '44.0646';

			var longitude = plugin.getParameters((msg.text))[1]
							? plugin.getParameters(msg.text)[1]
							: '-123.0761';

			gp('44.0646', '-123.0761', function(err, data) {
		        if (err) {
		            console.log(err);

					plugin.send('Error performing request: ' + err.message, weatherConfig.channel);
		        } else {
		            var high = 0;
		            data.forEach(function(forecast) {
		                var tomorrow = new Date();
		                tomorrow.setDate(tomorrow.getDate() + 1);

		                if (forecast.date.getDate() === tomorrow.getDate()) {
		                    if (forecast.temperature > high) {
		                        high = forecast.temperature;
		                    }
		                }
		            });

		            plugin.rtm.sendMessage(createMessage(high), msg.channel);
		        }
		    });
		});

		var j = schedule.scheduleJob(rule, function() {
			gp('44.0646', '-123.0761', function(err, data) {
		        if (err) {
		            console.log(err);

					plugin.send('Error performing request: ' + err.message, weatherConfig.channel);
		        } else {
		            var high = 0;
		            data.forEach(function(forecast) {
		                var tomorrow = new Date();
		                tomorrow.setDate(tomorrow.getDate() + 1);

		                if (forecast.date.getDate() === tomorrow.getDate()) {
		                    if (forecast.temperature > high) {
		                        high = forecast.temperature;
		                    }
		                }
		            });

		            plugin.rtm.sendMessage(createMessage(high), weatherConfig.channel);
		        }
		    });
		});

		function createMessage(temp) {
			var message = '';

		    if (temp >= 85) {
		        message = 'You may wear shorts tomorrow, and power tools will not be used.';
		    } else {
		        message = 'Long pants are required for work in the Foundry.';
		    }

			return 'High Tomorrow: ' + temp + '\n' + message + '\n\n' + '_(if there are any issues with this bot, please contact @andrew)_'
		}
	}
}
