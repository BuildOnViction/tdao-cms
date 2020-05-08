const mongoose = require('mongoose');
const Config = require('../config');
const mlabURI = Config.hapiMongoModels.mongodb.connection.uri
const con = mongoose.connect(mlabURI, {useNewUrlParser: true, autoIndex: true}, (error) => {
    if (error) {
        console.log("Error " + error);
    } else {
        console.log("Connected successfully to server")
    }
});

module.exports = con;
