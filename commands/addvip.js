module.exports = {
    name: "addvip",
    description: "Adds someone as VIP",
    execute(message, args) {
        const Discord = require('discord.js');
        const cowdb = require("../cow-db.js");

        const myId = "198638477783465985";
        if(message.author == myId) {
            if(args[2].length == myId.length) {
                try {
                    cowdb.addVip(args[2], () => {
                        message.channel.send("Made " + args[2] + " VIP");
                    });
                } catch {
                    message.channel.send("There was an issue.");
                }

            } else {
                message.channel.send("Moo! Not proper format. Use right click > Copy ID.");
            }
        } else {
            message.channel.send("Moo?")
        }
    }
}
