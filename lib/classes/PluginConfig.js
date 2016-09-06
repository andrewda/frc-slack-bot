var config = require('../../config.json');

function PluginConfig(plugin) {
	this.name = plugin.name;
	this.description = plugin.description;

	if (plugin.command) {
		this.command = config.prefix + plugin.command;
		this.syntax = this.command + plugin.syntax;
		this.test = !!plugin.test || true;
	}
}

module.exports = PluginConfig;
