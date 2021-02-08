module.exports = {
    name: "weather",
    description: "See the current weather at UC Davis.",
    execute(message) {
        const Discord = require('discord.js');
        const weatherdb = require("../weather-db.js");
        weatherdb.get(function sendWeather(weather) {
            embed = new Discord.MessageEmbed();
            embed.setColor(0x58b9ff);
            embed.setTitle("Davis Weather for " + weather.name);
            embed.setDescription(
                "** " + weather.temp + "° " + weather.unit + "**\n" +
                weather.desc
            );
            embed.setThumbnail(weather.img);
            message.channel.send(embed);
        });
    }
}
