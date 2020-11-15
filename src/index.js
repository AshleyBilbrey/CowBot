require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log("CowBot Running.");
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('message', async msg => {
    if(msg.content === "!cow getmenu") {
        console.log("Command run! Defaulting to tercero because dev mode yeah...")
        msg.channel.send("Loading...");
        const menu = await getMenu("tercero");
        if(menu === "error") {
            msg.channel.send("There was an error running this command.");
        } else if(menu === "wrong") {
            msg.channel.send("That's not a valid dining common!")
        } else {
            console.log(menu);
            for(item in menu) {
                msg.channel.send(menu[item]);
            }
        }
    }
});

/*async function pullMenu(common) {
    try {
        console.log("pullMenu");
        const { response } = await axios.get("https://housing.ucdavis.edu/dining/menus/dining-commons/" + common + "/");
        const $ = await cheerio.load(response);
        return $;
    } catch {
        console.log("UH OH");
        return "error";
    }
}*/

async function getMenu(common) {
    common = common.toLowerCase();
    if((common === "tercero") || (common === "segundo")) {
        console.log("getMenu");

        let items = [];
        const page = await axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/' + common + '/');
        const $ = await cheerio.load(page.data);
        items[0] = await $('div#tab7content > div:nth-of-type(2) > li:nth-of-type(2) > span').text();
        return items;

    } else {
        return "wrong";
    }
}

client.login(process.env.BOT_TOKEN);
