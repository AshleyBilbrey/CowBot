module.exports = {
    get(callback) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        const axios = require('axios');

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("CowBot");
            var expire = Date.now() - 3600000;
            dbo.collection("weather").findOne({ time: {$gt: expire} }, function(err, result) {
                if(err) throw err;
                if(result == null) {
                    axios.get("https://api.weather.gov/gridpoints/STO/31,67/forecast", { headers: {'User-Agent': 'CowBot'}}).then(response => {
                        var currentWeather = {
                            name: response.data.properties.periods[0].name,
                            temp: response.data.properties.periods[0].temperature,
                            unit: response.data.properties.periods[0].temperatureUnit,
                            desc: response.data.properties.periods[0].detailedForecast,
                            img: response.data.properties.periods[0].icon,
                            time: Date.now()
                        }

                        dbo.collection("weather").insertOne(currentWeather, function(err, res) {
                            if(err) throw err;
                            db.close();
                            callback(currentWeather);
                        });
                    })
                } else {
                    db.close();
                    callback(result);
                }
            });
        });
    }
}
