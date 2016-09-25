
var config = require('../config.json');

module.exports = function(message) {
	/**
	 * This function is called from the scope of index.js, so
	 * using `this` will yield the current SlackBot object.
	 */

	var identifier = '<@' + this.config.slack.botid + '>'
	if (message.text && (message.text.split(' ')[0] === identifier || !config.requireMention)) {
		message.text = message.text.replace(identifier, '').trim();

		if (this.pluginConfig.test || !this.getCommand()) {
			if (this.testCommand(message.text)) {
				if (this.testSyntax(message.text)) {
					this.events.emit('message', message);
				} else {
					this.rtm.sendMessage(this.getSyntaxMessage(), message.channel);
				}
			}
		} else {
			this.events.emit('message', message);
		}
	}
};
