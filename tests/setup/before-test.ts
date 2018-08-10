require("dotenv").load();
const mongoose = require("mongoose");
import "mocha";

const uri = `mongodb+srv://api-rest-rw-user:${process.env.MONGODB_ATLAS_CONNECTION_PWD}@cluster0-nebbb.mongodb.net/test?retryWrites=true`;
const options = {
    dbName: "test",
    useNewUrlParser: true,
    bufferCommands: false,
    connectTimeoutMS: 5000, // Give up initial connection after 5 seconds
    socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

before(function() {
    // Set property to ignore TLS (SSL) to ignore self-signed certificate errors
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    return new Promise(function(resolve) {
        mongoose.connect(uri, options)
            .then(function() {
            mongoose.connection.once("open", function() {
                console.log("Connection to database succeeded");
            });
            mongoose.connection.db.collections(function(error, collections) {
            if (error) {
                throw new Error(error);
            } else {
                collections.map(function(collection) {
                    let collName = collection.collectionName;
                    // console.log("found collection %s", collName);
                    collection.drop(function(error) {
                        if (error) throw new Error(error);
                        console.log("Dropped collection ", collName);
                    });
                });
            }
        });
        resolve();
    })
    .catch(function(error) {
        console.log(`Database connection error: ${error.message}`);
        });
    });
});

after(function() {
    mongoose.connection.close();
});
