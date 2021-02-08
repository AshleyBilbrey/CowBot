module.exports = {
    name: "menu",
    description: "See today's Dining Commons menu.",
    execute(message, args) {
        const Discord = require('discord.js');
        const mhandler = require("../menu-db.js");
        mhandler.get(function sendMenu(menu) {
            var embed = new Discord.MessageEmbed();
            var description = "";

            if(args[3] != null) {
                if((args[2].toLowerCase() == "t") || (args[2].toLowerCase() == "tercero")) {
                    embed.setColor(0xffbf00);
                    if((args[3].toLowerCase() == "b") || (args[3].toLowerCase() == "breakfast")) {
                        if(menu.tercero_breakfast[0] != null) {
                            embed.setTitle("Today's Tercero Breakfast Menu");
                            for(i in menu.tercero_breakfast) {
                                description += menu.tercero_breakfast[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/tercero/");
                        }
                    } else if((args[3].toLowerCase() == "l") || (args[3].toLowerCase() == "lunch")) {
                        if(menu.tercero_lunch[0] != null) {
                            embed.setTitle("Today's Tercero Lunch Menu");
                            for(i in menu.tercero_lunch) {
                                description += menu.tercero_lunch[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/tercero/");
                        }
                    } else if((args[3].toLowerCase() == "d") || (args[3].toLowerCase() == "dinner")) {
                        if(menu.tercero_dinner[0] != null) {
                            embed.setTitle("Today's Tercero Dinner Menu");
                            for(i in menu.tercero_dinner) {
                                description += menu.tercero_dinner[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/tercero/");
                        }
                    } else {
                        message.channel.send("Moo! That's not a valid command. Correct usage is !cow menu <common> <meal>");
                    }
                } else if((args[2].toLowerCase() == "s") || (args[2].toLowerCase() == "segundo")) {
                    embed.setColor(0x022851);
                    if((args[3].toLowerCase() == "b") || (args[3].toLowerCase() == "breakfast")) {
                        if(menu.segundo_breakfast[0] != null) {
                            embed.setTitle("Today's Segundo Breakfast Menu");
                            for(i in menu.segundo_breakfast) {
                                description += menu.segundo_breakfast[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. This can especially happen on weekends for Segundo. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/segundo/");
                        }
                    } else if((args[3].toLowerCase() == "l") || (args[3].toLowerCase() == "lunch")) {
                        if(menu.segundo_lunch[0] != null) {
                            embed.setTitle("Today's Segundo Lunch Menu");
                            for(i in menu.segundo_lunch) {
                                description += menu.segundo_lunch[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. This can especially happen on weekends for Segundo. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/segundo/");
                        }
                    } else if((args[3].toLowerCase() == "d") || (args[3].toLowerCase() == "dinner")) {
                        if(menu.segundo_dinner[0] != null) {
                            embed.setTitle("Today's Segundo Dinner Menu");
                            for(i in menu.segundo_dinner) {
                                description += menu.segundo_dinner[i] + "\n";
                            }
                            embed.setDescription(description);
                            message.channel.send(embed);
                        } else {
                            message.channel.send("Sorry, there was an issue with gathering this menu. This can especially happen on weekends for Segundo. You can see the menu at https://housing.ucdavis.edu/dining/menus/dining-commons/segundo/");
                        }
                    } else {
                        message.channel.send("Moo! That's not a valid command. Correct usage is !cow menu <common> <meal>");
                    }
                } else {
                    message.channel.send("Moo! That's not a valid command. Correct usage is !cow menu <common> <meal>");
                }
            } else {
                message.channel.send("Moo! That's not a valid command. Correct usage is !cow menu <common> <meal>");
            }



        });
    }
}
