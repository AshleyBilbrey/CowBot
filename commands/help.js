module.exports = {
    name: "help",
    description: "See a list of all commands.",
    execute(message) {
        const Discord = require('discord.js');
        message.channel.send("CowBot Help:");
        message.channel.send("!cow menu <common> <meal>\nSee today's Dining Commons menu.\nExample: !cow menu tercero breakfast");
        message.channel.send("!cow help\nSee a list of all commands.");
    }
}
