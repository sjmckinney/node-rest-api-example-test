require("dotenv").load();
const mongoose = require("mongoose");
import "mocha";

const getConnectionUri = () => {

    let protocol, user, password, host;

    switch(process.env.NODE_ENV) {
        case "LOCAL":
            protocol = "mongodb";
            user = "user";
            password = process.env.MONGODB_LOCAL_PWD;
            host = "localhost:27017";
            break;
        case "REMOTE":
            protocol = "mongodb+srv";
            user = "api-rest-rw-user";
            password = process.env.MONGODB_ATLAS_CONNECTION_PWD;
            host = "cluster0-nebbb.mongodb.net";
            break;
        default:
            console.log(`Value of NODE_ENV ${process.env.NODE_ENV} is not recognised`);
    }
    
    return `${protocol}://${user}:${password}@${host}/test?retryWrites=true`;

};

const deleteCollections = (uri, options) => {

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
                    mongoose.connection.dropCollection(collName,(error ,result) => {
                        if (error) {
                          console.log(`Collection ${collName} has not been dropped`);
                        } else {
                          console.log(`Collection ${collName} has been dropped: ${result}`);
                        }
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

};

before(async function() {
    // Set property to ignore TLS (SSL) to ignore self-signed certificate errors
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const options = {
        dbName: "test",
        useNewUrlParser: true,
        bufferCommands: false,
        connectTimeoutMS: 5000, // Give up initial connection after 5 seconds
        socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
    };

    const uri: String = getConnectionUri();
    console.log(`Connected to: ${uri}\r\n`);
    await deleteCollections(uri, options);

});

after(function() {
    mongoose.connection.close();
});
