module.exports = {
        name: "pet",
        description: "Reacts when someone pets the bot",
        execute(message) {
            const Discord = require('discord.js');
            const cowdb = require("../cow-db.js");
            try {
                cowdb.pet(message.author, (petcount) => {
                    var bin = petcount.toString(2);
                    var oo = "*m";
                    if(petcount < 2) {
                        oo += "o";
                    }
                    if(bin.length < 1950) {
                        for(var i = 0; i < bin.length; i++) {
                            if(bin.charAt(i) == '1') {
                                oo += "O";
                            } else {
                                oo += "o";
                            }
                        }
                        oo += "~*";
                    } else {
                        oo = "*Big Moo~*";
                    }
                    if(Math.floor(Math.random() * Math.floor(100)) == 0) {
                        oo = "*oink~*";
                    }
                    cowdb.isVip(message.author, (isVip) => {
                        if(isVip) {
                            oo += "  ❤️🐄";
                        }
                        message.channel.send(oo);
                    })

                    var rand = Math.floor(Math.random() * Math.floor(30));
                    if(rand == 0) {
                        message.channel.send("https://tenor.com/view/kissing-kiss-me-licking-sweet-affection-gif-15399371");
                    } else if(rand == 1) {
                        message.channel.send("https://tenor.com/view/love-govegan-cow-cows-affection-gif-8268492");
                    } else if(rand == 2) {
                        message.channel.send("https://tenor.com/view/pet-cow-hug-cuddle-gif-11964259");
                    }

                });
            } catch {
                message.channel.send("*Mooooooo~*")
            }

        }
    }
