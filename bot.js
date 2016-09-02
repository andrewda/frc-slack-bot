
var SlackBot = require('./lib');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs-extra');
var path = require('path');

var files = fs.readdirSync(path.join(__dirname, 'plugins'));
files.forEach(function(file) {
	if (file.endsWith('.js')) {
		var plugin = require('./plugins/' + file);

		var config = plugin.config;
		var eventEmitter = new EventEmitter();

		var bot = new SlackBot(eventEmitter, config);

		plugin.main(bot, eventEmitter);
	}
});
