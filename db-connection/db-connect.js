var mysql = require("mysql");
var db;
function connectDatabase() {
  if (!db) {
    db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "true_love"
    });

    db.connect(function(err) {
      if (!err) {
        console.log("Database is connected!");
      } else {
        console.log("Error connecting database! " + JSON.stringify(err));
      }
    });
  }
  return db;
}

module.exports = connectDatabase();