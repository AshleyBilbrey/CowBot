module.exports = {
    name: "revokevip",
    description: "Revokes someone's VIP",
    execute(message, args) {
        const Discord = require('discord.js');
        const cowdb = require("../cow-db.js");

        const myId = "198638477783465985";
        if(message.author == myId) {
            if(args[2].length == myId.length) {
                try {
                    cowdb.revokeVip(args[2], () => {
                        message.channel.send("Revoked VIP for " + args[2]);
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
