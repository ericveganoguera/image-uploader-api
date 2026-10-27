// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const dbConfig = require("../config/db");

// ℹ️ MongoDB connection string. The database name is passed with `dbName`,
// so MONGODB_URI can be the bare connection string (local MongoDB if not set)
const MONGO_URI = dbConfig.url;

mongoose
  .connect(MONGO_URI, { dbName: dbConfig.database })
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
