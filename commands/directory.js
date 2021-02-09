module.exports = {
        name: "directory",
        description: "Sends the server invite link for the UCD Directory Server",
        execute(message) {
            const Discord = require('discord.js');
            message.channel.send("Club Directory Discord Server:\nhttps://discord.gg/ucf44wN");
        }
    }
