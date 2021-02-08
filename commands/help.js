module.exports = {
    name: "help",
    description: "See a list of all commands.",
    execute(message) {
        const Discord = require('discord.js');
        message.channel.send("**CowBot Help v1.0:**\n" +
        "*!cow menu <common> <meal>*\nSee today's Dining Commons menu.\nExample: !cow menu tercero breakfast\n" +
        "*!cow weather*\nSee the current weather at UC Davis.\n" +
        "*!cow suggest*\nLets you know where to send suggestions.\n" +
        "*!cow help*\nSee a list of all commands."
        );
    }
}
