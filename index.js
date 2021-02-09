require('dotenv').config();

var db = require('mongodb');
var fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log("CowBot Running.");
    console.log(`Logged in as ${client.user.tag}.`);
    client.user.setPresence({
        status: "online",  //You can show online, idle....
        game: {
            name: "!cowbot help",  //The message shown
            type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
});

client.on('message', message => {
    var msgarr = message.content.split(" ");
    if((msgarr[0] != "!cow") || (message.author.tag == client.user.tag)) {  return; }
    if(!client.commands.has(msgarr[1].toLowerCase())) {
        message.channel.send("Moo! That is not a valid command. You can see the list of commands with !cow help");
        return;
    }
    try {
        console.log(message.author.tag + " ran commnad " + message.content);
        client.commands.get(msgarr[1].toLowerCase()).execute(message, msgarr);
    } catch (error) {
        console.error(error);
        message.channel.send("Moo! There was an issue running that command.");
    }
});

client.login(process.env.BOT_TOKEN);
