module.exports = {
    name: "suggest",
    description: "Lets you know where to send suggestions.",
    execute(message) {
        const Discord = require('discord.js');
        message.channel.send("I'd really really appreciate any and all suggestions to improve this bot! Please send them to nekeki#7777.");
    }
}
