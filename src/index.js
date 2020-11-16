require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const Discord = require('discord.js');
const client = new Discord.Client();

var fs = require('fs');

client.on('ready', () => {
    console.log("CowBot Running.");
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('message', async msg => {
    var msgarr = await msg.content.split(" ");
    if(msgarr[0] === "!cow") {
        if(msgarr[1] === "menu") {
            if((msgarr[2] != undefined) && (msgarr[3] != undefined)) {
                msg.channel.send("You sent a correct command, but it's still in development...");
                refreshMenu(true, msgarr[3], msgarr[2]);
            } else {
                msg.channel.send("Moo! Prpoer usage of this command is `!cow menu <common> <meal>`");
            }
        } else {
            msg.channel.send("Moo! That's not a valid command! Use `!cow help` to get a current list of commans!");
        }
        //console.log("Command run! Defaulting to tercero because dev mode yeah...")
        //msg.channel.send("Loading...");
        //refreshMenu(true, "breakfast", "tercero");
    }
});

async function refreshMenu(force, mealstring, common) {
    var mealnum;
    var meal;

    if((common.toLowerCase() != "tercero") && (common.toLowerCase() != "segundo")) {
        return "wrongc"
    }

    if((mealstring.toLowerCase() === "breakfast") || (mealstring.toLowerCase() === "b")) {
        mealnum = 2;
        meal = "breakfast";
    } else if ((mealstring.toLowerCase() === "lunch") || (mealstring.toLowerCase() === "l")) {
        mealnum = 3;
        meal = "lunch";
    } else if ((mealstring.toLowerCase() === "dinner") || (mealstring.toLowerCase() === "d")) {
        mealnum = 4;
        meal = "dinner";
    } else {
        return "wrongm";
    }

    cont = false;
    if(force) {
        cont = true;
    } else {
        if(fs.exists("data/menu-" + meal + "/")) {
            var jsonString = await fs.readFile("data/menu-" + common.toLowerCase() + "-" + meal + ".json/");
            var jsonObject = await JSON.parse(jsonString);
            //add current day if statement
            cont = true;
        } else {
            cont = true;
        }
    }

    if(cont = true) {
        var jsonObject2 = {date: "2020-11-15", food: ["milk", "cheese"]};
        jsonObject2.date = "2020-11-15";
        jsonObject2.food = await getMenuFromWeb(common.toLowerCase(), mealnum);
        await fs.writeFile("data/menu-" + common + "-" + meal + ".json/", JSON.stringify(jsonObject2), (err) => {
            if(err) {
                throw err;
            }
        });
        console.log(JSON.stringify(jsonObject2));
        return "worked";
    } else {
        return "valid";
    }
}

async function getMenuFromWeb(common, mealnum) {
    common = common.toLowerCase();
    console.log("Getting menu from web... This should be done rarely.");
    let items = [];
    const page = await axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/' + common + '/');
    const $ = await cheerio.load(page.data);
    await $('div#tab7content > div:nth-of-type(' + mealnum + ') > li').each((i, element) => {
        const food = $(element).children("span").text()
        items.push(food);
    });
    return items;
}

client.login(process.env.BOT_TOKEN);
