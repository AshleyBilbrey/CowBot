module.exports = {
    pet: pet,
    userCheck: userCheck,
    isVip: isVip,
    addVip: addVip,
    revokeVip: revokeVip
}

function pet(user, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    userCheck(user, () => {
        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            var dbo = db.db("CowBot");

            dbo.collection("users").findOne({user_id: user.id}, function(err, result) {
                if(err) throw err;

                result.pets += 1;
                dbo.collection("users").replaceOne({user_id: result.user_id}, result, function(err, result2) {
                    if(err) throw err;
                    var newPet = {
                        time: Date.now(),
                        user_id: result.user_id
                    }
                    dbo.collection("pets").insertOne(newPet, function(err, result3) {
                        if(err) throw err;
                        var expiry = Date.now() - 86400000;
                        dbo.collection("pets").find({time: {$gt: expiry}}).count(function(err, count) {
                            callback(count);
                        });
                    });
                })
            });
        });
    });

}

function userCheck(user, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("CowBot");

        dbo.collection("users").findOne({user_id: user.id}, function(err, result) {
            if(err) throw err;
            if(result == null) {
                var newUser = {
                    user_id: user.id,
                    pets: 0,
                    isVip: false,
                }
                dbo.collection("users").insertOne(newUser, function(err, result) {
                    if(err) throw err;
                    callback();
                });
            } else {
                callback();
            }
        });
    });
}

function isVip(user, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    userCheck(user, () => {
        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            dbo = db.db("CowBot");

            dbo.collection("users").findOne({user_id: user.id}, function(err, result) {
                callback(result.isVip);
            });
        });
    });
}

function addVip(id, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        dbo = db.db("CowBot");

        dbo.collection("users").findOne({user_id: id}, function(err, result) {
            result.isVip = true;
            dbo.collection("users").replaceOne({user_id: id}, result, function(err, result) {
                callback();
            });
        });
    });

}

function revokeVip(id, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        dbo = db.db("CowBot");

        dbo.collection("users").findOne({user_id: id}, function(err, result) {
            result.isVip = false;
            dbo.collection("users").replaceOne({user_id: id}, result, function(err, result) {
                callback();
            });
        });
    });

}
