
module.exports = SlackBot;

var Slack = require('@slack/client');

var PluginConfig = require('./classes/PluginConfig');

var config = require('../config.json');

var IncomingWebhook = Slack.IncomingWebhook;
var RtmClient = Slack.RtmClient;

function SlackBot(events, plugin) {
	if (!plugin) {
		throw new Error('Plugin configuration is required')
	}

	this.pluginConfig = new PluginConfig(plugin);

	this.RTM_EVENTS = Slack.RTM_EVENTS;

	this.rtm = new RtmClient(config.slack.token, {
		logLevel: config.debug ? 'verbose' : 'error'
	});

	this.plugins = new Map();

	this.rtm.start();

	var self = this;
	this.rtm.on(this.RTM_EVENTS.MESSAGE, function(message) {
		var identifier = '<@' + config.slack.botid + '>'
		if (message.text && message.text.split(' ')[0] === identifier) {
			message.text = message.text.replace(identifier, '').trim();

			if (self.pluginConfig.test) {
				if (self.testCommand(message.text)) {
					if (self.testSyntax(message.text)) {
						events.emit('message', message);
					} else {
						self.send(this.getSyntaxMessage(), message.channel);
					}
				}
			} else {
				events.emit('message', message);
			}
		}
	});
}

SlackBot.prototype.send = function(message, channel, callback) {
	this.rtm.sendMessage(message, channel, callback);
};

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
