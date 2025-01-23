const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Database Connected on host ${conn.connection.host}
Database Name: ${conn.connection.name}`);
  });
};
module.exports = dbConnection;
