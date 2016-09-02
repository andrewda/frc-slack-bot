var config = require('../../config.json');

function PluginConfig(plugin) {
	this.name = plugin.name;
	this.description = plugin.description;
	this.command = config.prefix + plugin.command;
	this.syntax = config.prefix + plugin.syntax;
	this.test = !!plugin.test || true;
}

module.exports = PluginConfig;
