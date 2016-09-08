# FRC Slack bot

## Introduction

FRC Slack Bot is a bot originally created for the [South Eugene Robotics Team](https://github.com/SouthEugeneRoboticsTeam) Slack server. It was made to be highly customizable to fit the needs of any team.

## Customization

Customizing the FRC Slack Bot couldn't be easier. You can customize everything - from high-level Plugins which handle commands to low-level Listeners which listen for server events.

### Custom Plugins

Plugins can be created and customized to handle commands. Commands may be something obvious such as "/echo" or "!echo", but may also be something more subtle, such as adding a reaction to a message.

Command files are named by their base command, so if you're creating a "!echo" command, the file would be named "echo.js".

An example Plugin can be found below:

```javascript
module.exports = {
	config: {
		name: 'Echo',
		description: 'Echo the user',
		command: 'echo',
		syntax: '<message>',
		test: true
	},
	main: function(plugin, events) {
		console.log('Plugin Loaded:', plugin.getName(), '-', plugin.getDescription());

		events.on('message', function(msg) {
			plugin.rtm.sendMessage(plugin.stripCommand(msg.text), msg.channel);
		});
	}
};
```

Config options:

`name`: **[required]** The plugin's name
`description`: **[required]** The plugin's description
`command`: The command to trigger the plugin
`syntax`: The command's syntax
`test`: `true` to emit only messages with the correct command and syntax (default `true` when `command` is defined)

Plugin parameters:

`plugin`: An instance of SlackBot (found in ../lib/index.js)
`events`: An EventEmitter object

### Custom Listeners

Listeners must be named after the event they listen for. For example, the file below is named "message.js" and listens for the "message" event. When the event is fired, it will use this function instead of defaulting to a simply emitting the message.

```javascript
module.exports = function(message) {
	var identifier = '<@' + this.config.slack.botid + '>'
	if (message.text && message.text.split(' ')[0] === identifier) {
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
```

Listener parameters:

`message`: A standard Slack message object
