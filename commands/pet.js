module.exports = {
        name: "pet",
        description: "Reacts when someone pets the bot",
        execute(message) {
            const Discord = require('discord.js');
            message.channel.send("*moooooooooo*");
        }
    }
    