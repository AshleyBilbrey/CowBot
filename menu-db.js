module.exports = {
    get(callback) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        const axios = require('axios');
        const cheerio = require('cheerio');

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("CowBot");
            var expire = Date.now() - 3600000;
            var dateNum = new Date(Date.now() - 28800000).getUTCDay() + 1;
            currentMenu = dbo.collection("menus").findOne({ time: {$gt: expire} }, function(err, result) {
                if(err) throw err;
                if(result == null) {
                    let tercero_breakfast = [];
                    let tercero_lunch = [];
                    let tercero_dinner = [];
                    let segundo_breakfast = [];
                    let segundo_lunch = [];
                    let segundo_dinner = [];

                    axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/tercero/').then(resp => {
                        var $ = cheerio.load(resp.data);
                        $('div#tab' + dateNum + 'content > div:nth-of-type( 2 ) > li').each((i, element) => {
                            const food = $(element).children("span").text()
                            tercero_breakfast.push(food);
                        });

                        if(dateNum == 1) {
                            tercero_breakfast.push("**Sunday breakfast is usually 9 a.m.–2 p.m.**");
                        } else if(dateNum == 7) {
                            tercero_breakfast.push("**Saturday breakfast is usually 9 a.m.–2 p.m.**");
                        } else {
                            tercero_breakfast.push("**Weekday breakfast is usually 7–11 a.m.**");
                        }

                        $('div#tab' + dateNum + 'content > div:nth-of-type( 3 ) > li').each((i, element) => {
                            const food = $(element).children("span").text()
                            tercero_lunch.push(food);
                        });

                        if(dateNum == 1) {
                            tercero_lunch.push("**Sunday lunch time usually serves breakfast.**");
                        } else if(dateNum == 7) {
                            tercero_lunch.push("**Saturday lunch time usually serves breakfast.**");
                        } else {
                            tercero_lunch.push("**Weekday lunch is usually 11 a.m.–2 p.m.**");
                        }

                        $('div#tab' + dateNum + 'content > div:nth-of-type( 4 ) > li').each((i, element) => {
                            const food = $(element).children("span").text()
                            tercero_dinner.push(food);
                        });

                        if(dateNum == 1) {
                            tercero_dinner.push("**Sunday dinner is usually 5–8 p.m.**");
                        } else if(dateNum == 7) {
                            tercero_dinner.push("**Saturday dinner is usually 5–7 p.m.**");
                        } else {
                            tercero_dinner.push("**Weekday dinner is usually 5–9 p.m.**");
                        }

                    }).then(() => {
                        axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/segundo/').then(resp => {
                            var $ = cheerio.load(resp.data);
                            $('div#tab' + dateNum + 'content > div:nth-of-type( 2 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_breakfast.push(food);
                            });

                            if(dateNum == 1) {
                                segundo_breakfast.push("**Sunday breakfast is usually 9–11 a.m.**");
                            } else if(dateNum == 7) {
                                segundo_breakfast.push("**Saturday breakfast is usually 9–11 a.m.**");
                            } else {
                                segundo_breakfast.push("**Weekday breakfast is usually 7–11 a.m.**");
                            }

                            $('div#tab' + dateNum + 'content > div:nth-of-type( 3 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_lunch.push(food);
                            });

                            if(dateNum == 1) {
                                segundo_lunch.push("**Sunday lunch is usually 11 a.m.–2 p.m.**");
                            } else if(dateNum == 7) {
                                segundo_lunch.push("**Saturday lunch is usually 11 a.m.–2 p.m.**");
                            } else {
                                segundo_lunch.push("**Weekday lunch is usually 11 a.m.–2 p.m.**");
                            }

                            $('div#tab' + dateNum + 'content > div:nth-of-type( 4 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_dinner.push(food);
                            });

                            if(dateNum == 1) {
                                segundo_dinner.push("**Sunday dinner is usually 5–8 p.m.**");
                            } else if(dateNum == 7) {
                                segundo_dinner.push("**Saturday dinner is usually 5–7 p.m.**");
                            } else {
                                segundo_dinner.push("**Weekday dinner is usually 5–9 p.m.**");
                            }
                        });
                    }).then(() => {
                        var doc = {
                            tercero_breakfast: tercero_breakfast,
                            tercero_lunch: tercero_lunch,
                            tercero_dinner: tercero_dinner,
                            segundo_breakfast: segundo_breakfast,
                            segundo_lunch: segundo_lunch,
                            segundo_dinner: segundo_dinner,
                            time: Date.now()
                        }

                        dbo.collection("menus").insertOne(doc, function(err, res) {
                            if(err) throw err;
                            db.close();
                            callback(doc);
                        });
                    });



                } else {
                    db.close();
                    callback(result);
                }
            });
        });
    }
}
