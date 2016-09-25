
module.exports = SlackBot;

var Slack = require('@slack/client');

var config = require('../config.json');

var RtmClient = Slack.RtmClient;

var rtm = new RtmClient(config.slack.token, {
	logLevel: config.debug ? 'verbose' : 'error'
});

rtm.start();

function SlackBot(events, plugin) {
	if (!plugin) {
		throw new Error('Plugin configuration is required')
	}

	this.plugins = require('../bot.js').getPlugins();
	this.listeners = require('../bot.js').getListeners();

	this.config = config;

	this.events = events;

	this.pluginConfig = plugin;

	this.RTM_EVENTS = Slack.RTM_EVENTS;

	this.rtm = rtm;

	var self = this;

	for (var type in this.RTM_EVENTS) {
		var name = this.RTM_EVENTS[type];

		this.rtm.on(name, function(message) {
			var listener = self.listeners.get(message.type) || function(message) {
				this.events.emit(message.type, message);
			};

			listener.call(self, message);
		});
	}
}

SlackBot.prototype.getName = function() {
	return this.pluginConfig.name;
};

SlackBot.prototype.getDescription = function() {
	return this.pluginConfig.description;
};

SlackBot.prototype.getCommand = function() {
	return this.pluginConfig.command;
};

SlackBot.prototype.getSyntax = function() {
	return this.pluginConfig.syntax;
};

SlackBot.prototype.getSyntaxMessage = function() {
	return 'Usage: ' + this.pluginConfig.syntax;
};

SlackBot.prototype.getParameters = function(message) {
	var paramString = message.replace(this.pluginConfig.command, '').trim();
	return (paramString.split(' ') || []);
}

SlackBot.prototype.testCommand = function(message) {
	return this.pluginConfig.command === message.split(' ')[0];
};

SlackBot.prototype.testSyntax = function(message) {
	var requirements = (this.pluginConfig.syntax.match(/</g) || []).length;
	return message.split(' ').length - 1 >= requirements;
};

SlackBot.prototype.stripCommand = function(message) {
	return message.replace(this.pluginConfig.command, '');
};
