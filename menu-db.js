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

                        $('div#tab' + dateNum + 'content > div:nth-of-type( 3 ) > li').each((i, element) => {
                            const food = $(element).children("span").text()
                            tercero_lunch.push(food);
                        });

                        $('div#tab' + dateNum + 'content > div:nth-of-type( 4 ) > li').each((i, element) => {
                            const food = $(element).children("span").text()
                            tercero_dinner.push(food);
                        });
                    }).then(() => {
                        axios.get('https://housing.ucdavis.edu/dining/menus/dining-commons/segundo/').then(resp => {
                            var $ = cheerio.load(resp.data);
                            $('div#tab' + dateNum + 'content > div:nth-of-type( 2 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_breakfast.push(food);
                            });

                            $('div#tab' + dateNum + 'content > div:nth-of-type( 3 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_lunch.push(food);
                            });

                            $('div#tab' + dateNum + 'content > div:nth-of-type( 4 ) > li').each((i, element) => {
                                const food = $(element).children("span").text()
                                segundo_dinner.push(food);
                            });
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
