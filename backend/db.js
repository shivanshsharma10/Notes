// db.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sshivansh:XC2G4R1Zdw9N77pS@cluster0.abcde.mongodb.net/";
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect()
      .then(conn => {
        dbConnection = conn.db('myDatabase');
        console.log("Successfully connected to MongoDB.");
        return callback();
      })
      .catch(err => {
        console.error(err);
        return callback(err);
      });
  },
  getDb: function () {
    return dbConnection;
  },
};
