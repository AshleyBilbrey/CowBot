require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

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
                msg.channel.send("Hello friend! I'm still under development, but I'll do my best!");
                console.log("--------------------")
                var correctmenu = await sendMenu(msg.channel, msgarr[2], msgarr[3]);
                if(!correctmenu) {
                    msg.channel.send("Moo! That didn't work quite right. Please make sure you have a proper dining common and meal. `!cow menu <common> <meal>`")
                }
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

async function isProperCommon(common) {
    if((common.toLowerCase() === "tercero") || (common.toLowerCase() === "segundo")) {
        return true;
    } else {
        return false;
    }
}

function mealNum(mealstring) {
    var mealnum;
    if((mealstring.toLowerCase() === "breakfast") || (mealstring.toLowerCase() === "b")) {
        mealnum = 2;
    } else if ((mealstring.toLowerCase() === "lunch") || (mealstring.toLowerCase() === "l")) {
        mealnum = 3;
    } else if ((mealstring.toLowerCase() === "dinner") || (mealstring.toLowerCase() === "d")) {
        mealnum = 4;
    } else {
        mealnum = -1;
    }
    return mealnum;
}

async function properMealString(mealstring) {
    var proper;
    if((mealstring.toLowerCase() === "breakfast") || (mealstring.toLowerCase() === "b")) {
        proper = "breakfast";
    } else if ((mealstring.toLowerCase() === "lunch") || (mealstring.toLowerCase() === "l")) {
        proper = "lunch";
    } else if ((mealstring.toLowerCase() === "dinner") || (mealstring.toLowerCase() === "d")) {
        proper = "dinner";
    } else {
        proper = "error";
    }
    return proper;
}

async function refreshMenu(force, common, mealstring) {
    //Assumes values passed are proper

    var cont = false;
    if(force) {
        console.log("Force was on, so continuing to write new file.");
        cont = true;
    } else {
        if(fs.existsSync("data/menu-" + common.toLowerCase() + "-" + mealstring + ".json/")) {
            await fs.readFile("data/menu-" + common.toLowerCase() + "-" + mealstring + ".json/", "utf8", function (err, data) {
                if(err) {
                    console.log("There was an error refreshing the data.");
                } else {
                    var jsonObject = JSON.parse(data);
                    console.log("Data read from refreshMenu:");
                    console.log(jsonObject.date);
                    if(jsonObject.date !== getLocalDateString()) {
                        console.log("The date was not equal, so continuing to write new file.");
                        cont = true;
                    }
                }
            });
        } else {
            console.log("File does not exist, so continuing to write new file...");
            cont = true;
        }
    }

    if(cont === true) {
        var jsonObject2 = {date: "null", food: ["null"]};
        jsonObject2.date = await getLocalDateString();
        jsonObject2.food = await getMenuFromWeb(common.toLowerCase(), await mealNum(mealstring));
        await fs.writeFile("data/menu-" + common.toLowerCase() + "-" + mealstring + ".json/", JSON.stringify(jsonObject2), (err) => {
            if(err) {
                throw err;
            }
        });
        console.log("Writing new file...");
        return 1;
    } else {
        console.log("Did not get new menu from web.")
        return 0;
    }
}

async function getMenuFromWeb(common, mealnum) {
    common = common.toLowerCase();
    console.log("Getting menu from web... This should be done rarely.");
    let items = [];
    const page = await axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/' + common + '/');
    const $ = await cheerio.load(page.data);
    await $('div#tab' + await getLocalDateNum() + 'content > div:nth-of-type(' + mealnum + ') > li').each((i, element) => {
        const food = $(element).children("span").text()
        items.push(food);
    });
    return items;
}

async function sendMenu(channel, common, meal) {
    console.log(await isProperCommon(common));
    if(await isProperCommon(common) && (await mealNum(meal) != -1)) {
        var mealstring = await properMealString(meal);
        var jsonObject;
        await refreshMenu(false, common.toLowerCase(), mealstring);
        await fs.readFile("data/menu-" + common.toLowerCase() + "-" + mealstring + ".json/", "utf8", function (err, data) {
            if(err) {
                channel.send("There was an error running this command.");
            } else {
                console.log("Data read from file in sendMenu");
                console.log(data);
                var jsonObject = JSON.parse(data);
                var embed = new MessageEmbed();
                if(common.toLowerCase() === "tercero") {
                    const mealnum = mealNum(meal);
                    console.log(mealNum(meal));
                    embed.setColor(0xffbf00);
                    if(mealnum === 2) {
                        embed.setTitle("Tercero Breakfast Menu for (today)");
                    } else if(mealnum === 3) {
                        embed.setTitle("Tercero Lunch Menu for (today)");
                    } else if(mealnum === 4) {
                        embed.setTitle("Tercero Dinner Menu for (today)");
                    }
                } else if(common.toLowerCase() === "segundo") {
                    const mealnum = mealNum(meal);
                    console.log(mealNum(meal));
                    embed.setColor(0x022851);
                    if(mealnum === 2) {
                        embed.setTitle("Segundo Breakfast Menu for (today)");
                    } else if(mealnum === 3) {
                        embed.setTitle("Segundo Lunch Menu for (today)");
                    } else if(mealnum === 4) {
                        embed.setTitle("Segundo Dinner Menu for (today)");
                    }
                }
                var description = "";
                if(jsonObject.food.length === 0) {
                    description = "Sorry, there was an issue gathering the menu for this meal for today. This can happen with special menus. If this persists for multiple days, please contact the bot manager."
                } else {
                    for(i in jsonObject.food) {
                        description += jsonObject.food[i] + "\n";
                    }
                }
                embed.setDescription(description);
                channel.send(embed);
            }
        });

        return true;
    } else {
        return false;
    }
}

function getLocalDateString() {
    //Gets date in California Time
    var utcDate = new Date();
    var localDate = new Date(utcDate.getTime() - 28800000);
    return localDate.getUTCFullYear() + "-" + (localDate.getUTCMonth() + 1) + "-" + localDate.getUTCDate();
}

function getLocalDateNum() {
    var utcDate = new Date();
    var localDate = new Date(utcDate.getTime() - 28800000);
    return localDate.getUTCDay() + 1;
}

client.login(process.env.BOT_TOKEN);
