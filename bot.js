
var SlackBot = require('./lib');
var PluginConfig = require('./lib/classes/PluginConfig');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');

var plugins = [];

module.exports.getPlugins = function() {
	return plugins;
};

var files = fs.readdirSync(path.join(__dirname, 'plugins'));
files.forEach(function(file) {
	if (file.endsWith('.js')) {
		var plugin = require('./plugins/' + file);

		var eventEmitter = new EventEmitter();
		var bot = new SlackBot(eventEmitter, plugin.config);

		plugin.main(bot, eventEmitter);

		plugins.push(new PluginConfig(plugin.config));
	}
});
