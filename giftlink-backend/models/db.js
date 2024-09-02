// db.js
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URL with authentication options
//let url = `${process.env.MONGO_URL}`;
let url = `${process.env.MONGOO}`;
let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });      

    // Task 1: Connect to MongoDB
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName);
    // Task 3: Return database instance
    return dbInstance;
}

module.exports = connectToDatabase;
