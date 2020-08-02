"use strict";

const CommandsInfo = require("./command/CommandsInfo");
const Command = require("./command/Command");

module.exports.apply = async (message) => {
	try {
		const commandsInfo = new CommandsInfo();
		let commandObject = new Command(message);
		let reply = await commandObject.execute(commandsInfo);
		return reply;
	} catch (ex) {
		return ex;
	}
};
