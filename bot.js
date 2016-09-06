
var SlackBot = require('./lib');
var PluginConfig = require('./lib/classes/PluginConfig');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');

var listeners = new Map();
var plugins = new Map();

module.exports.getListeners = function() {
	return listeners;
};

module.exports.getPlugins = function() {
	return plugins;
};

var listenerFiles = fs.readdirSync(path.join(__dirname, 'listeners'));
listenerFiles.forEach(function(file) {
	if (file.endsWith('.js')) {
		var listener = require('./listeners/' + file);

		listeners.set(file.replace('.js', ''), listener);
	}
});

var pluginFiles = fs.readdirSync(path.join(__dirname, 'plugins'));
pluginFiles.forEach(function(file) {
	if (file.endsWith('.js')) {
		var plugin = require('./plugins/' + file);
		var pluginConfig = new PluginConfig(plugin.config);

		var eventEmitter = new EventEmitter();
		var bot = new SlackBot(eventEmitter, pluginConfig);

		plugin.main(bot, eventEmitter);

		plugins.set(pluginConfig.name, pluginConfig);
	}
});
