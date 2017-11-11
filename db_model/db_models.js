
//============== Connecting to SQLite3 ==================
// Open Connection
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:', function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log("Conncted to the In-Memory SQLite Database.");
});

// Close Connection

function close(){
    db.close(function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

//================= CREATING DB MODELS ==================
//----------------- PIZZA TABLE -------------------------

db.serialize(function () {
    // CREATE size TABLE
    db.run("CREATE TABLE IF NOT EXISTS Size (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL)");
    // INSERT DEFAULT VALUES IN size TABLE
    db.run("INSERT INTO size (name, price) VALUES ('Standard', 5)");
    db.run("INSERT INTO size (name, price) VALUES ('Large', 8.5)");
    // -----------
    // CREATE topping TABLE
    db.run("CREATE TABLE IF NOT EXISTS Topping (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, pizzaId INTEGER, price REAL NOT NULL, FOREIGN KEY(pizzaId) REFERENCES Pizza(id))");
    // CREATE pizza TABLE
    db.run("CREATE TABLE IF NOT EXISTS Pizza (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL, sizeId INTEGER, FOREIGN KEY(sizeId) REFERENCES Size(id))");
    // CREATE OrderItem TABLE
    db.run("CREATE TABLE IF NOT EXISTS OrderItem (id INTEGER PRIMARY KEY AUTOINCREMENT, quantity INTEGER NOT NULL, pizzaId INTEGER, FOREIGN KEY(pizzaId) REFERENCES Pizza(id))");
    // CREATE Order TABLE
    db.run("CREATE TABLE IF NOT EXISTS Orders (id INTEGER PRIMARY KEY AUTOINCREMENT, totalPrice REAL NOT NULL, recipient TEXT NOT NULL, orderItems INTEGER, FOREIGN KEY(orderItems) REFERENCES OrderItem(id))");
    // close the connection
    close();
});




