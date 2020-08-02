"use strict";

const opsbot = require("./opsbot/index");

module.exports.send = async function(message) {
    let reply = await opsbot.apply(message);
    if (reply !== "") return reply;
}