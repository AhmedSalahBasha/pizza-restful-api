var app = require('./app');
var port = process.env.PORT || 3000;

var express = require('express');
//var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var server = app.listen(port, function () {
    console.log('Express server is listening on port ' + port);
});

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
function close() {
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
    //db.run("CREATE TABLE IF NOT EXISTS Size (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL)");
    // INSERT DEFAULT VALUES IN size TABLE
    //db.run("INSERT INTO Size (name, price) VALUES ('Standard', 5)");
    //db.run("INSERT INTO Size (name, price) VALUES ('Large', 8.5)");
    // -----------
    // CREATE topping TABLE
    db.run("CREATE TABLE IF NOT EXISTS Topping (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL, pizzaId INTEGER, FOREIGN KEY(pizzaId) REFERENCES Pizza(id))");
    // CREATE pizza TABLE
    db.run("CREATE TABLE IF NOT EXISTS Pizza (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL, size TEXT)");
    // CREATE OrderItem TABLE
    db.run("CREATE TABLE IF NOT EXISTS OrderItem (id INTEGER PRIMARY KEY AUTOINCREMENT, quantity INTEGER NOT NULL, pizzaId INTEGER, FOREIGN KEY(pizzaId) REFERENCES Pizza(id))");
    // CREATE Order TABLE
    db.run("CREATE TABLE IF NOT EXISTS Orders (id INTEGER PRIMARY KEY AUTOINCREMENT, totalPrice REAL NOT NULL, recipient TEXT NOT NULL, orderItems INTEGER, FOREIGN KEY(orderItems) REFERENCES OrderItem(id))");
    // close the connection
    //close();
    //db.run("INSERT INTO Pizza (name, price, size) VALUES ('Margritte', 8.5, 23)");
});

var Size = {
    Standard: { price: 5, name: "Standard", code: "S" },
    Large: { price: 8.5, name: "Large", code: "L" }
};


// ============ ROUTES =============
// -------- Index -------------------
app.get('/', function (req, res) {
    res.send('Welcome! Enterprise Computing - TU-Berlin');
});


// ---------- GET ALL | Size -------------
app.get('/size', function (req, res) {
    res.setHeader("Content-Type", "application/json");

    db.all("SELECT * FROM Size", function (err, row) {
        if (err) { return res.status(500).send(err); }
        res.status(200).send(row);
    })
});

function getPriceBySize(size) {
    var sizePrice;
    if (size == Size.Standard.name) {
        sizePrice = Size.Standard.price;
    } else if (size == Size.Large.name) {
        sizePrice = Size.Large.price;
    } else {
        return 0;
    }
    return sizePrice;
}

// ----------- POST | Pizza ---------------
app.post('/pizza', function (req, res) {

    var sizePrice = getPriceBySize(req.body.size);
    if (sizePrice == 0) {
        return res.status(404).send("Invalid input");
    }

    db.run("INSERT INTO Pizza (name, price, size) VALUES (?, ?, ?)",
        [req.body.name, sizePrice, req.body.size],
        function (err) {
            if (err) { return res.status(400).send("Invalid input"); }
            res.location(`/pizza/${this.lastID}`);
            res.status(201).send("Created new pizza");
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
});

// ---------------- GET ALL | Pizza -----------------
app.get('/pizza', function (req, res) {
    res.setHeader("Content-Type", "application/json");

    db.all("SELECT id FROM Pizza", function (err, rows) {
        if (err) { return res.status(500).send("Error occured!" + " - " + err.message); }
        if (rows.length == 0) { return res.status(404).send("No pizza exists."); }
        //res.status(200).send("successful operation");
        res.status(200).send(rows);
        //res.json(rows.all).send();
    });
});

// -------------- GET BY ID | Pizza -----------------
app.get('/pizza/:pizzaId', function (req, res) {
    res.setHeader("Content-Type", "application/json");

    db.all("SELECT * FROM Pizza WHERE Pizza.id = ?", [req.params.pizzaId], function (err, row) {
        if (row.length == 0) { return res.status(404).send("Pizza could not be found") }
        if (err) { return res.status(500).send("Error occured!" + " - " + err.message); }
        res.status(200).send(row);
    });
});

// -------------- PUT BY ID | Pizza -----------------
app.put('/pizza/:pizzaId', function (req, res) {

    var sizePrice = getPriceBySize(req.body.size);
    if (sizePrice == 0) {
        return res.status(404).send("Invalid pizza supplied");
    }

    db.all("SELECT * FROM Pizza WHERE Pizza.id = ?", [req.params.pizzaId], function (err, row) {
        if (row.length == 0) { return res.status(404).send("Pizza could not be found") }
        else {
            db.run("UPDATE Pizza SET name = ?, price = ?, size = ? WHERE id = ?",
                [req.body.name, sizePrice, req.body.size, req.params.pizzaId],
                function (err) {
                    //if (row.length == 0) { return res.status(404).send("Pizza could not be found")}
                    if (err) { return res.status(400).send("Invalid pizza supplied" + " - " + err.message); }
                    res.status(204).send("Update okay");
                });
        }
    });
});

// -------------- DELETE BY ID | Pizza -----------------
app.delete('/pizza/:pizzaId', function (req, res) {
    db.all("SELECT * FROM Pizza WHERE Pizza.id = ?", [req.params.pizzaId], function (err, row) {
        if (row.length == 0) { return res.status(404).send("Pizza not found") }
        else {
            db.run("DELETE FROM Pizza WHERE id = ?", [req.params.pizzaId],
                function (err, rowid) {
                    if (err) { return res.status(400).send("Invalid ID supplied"); }
                    res.status(204).send("deleted");
                });
        }
    });
});

// =============== ***** ROUTES | Topping ***** ===================

// ------------- POST | Topping --------------------------
app.post('/pizza/:pizzaId/topping', function (req, res) {

    var pizzaOldPrice;
    db.all("SELECT price FROM Pizza WHERE Pizza.id = ?", [req.params.pizzaId], function (err, row) {
        if (row.length == 0) { return res.status(404).send("Invalid input") }
        else {
            pizzaOldPrice = row[0].price;
            //console.log("row :  " + row[0].price);
            db.run("INSERT INTO Topping (name, price, pizzaId) VALUES (?, ?, ?)",
                [req.body.name, req.body.price, req.params.pizzaId],
                function (err, row) {
                    if (err) { return res.status(400).send("Invalid input" + err.message); }
                    else {
                        // calculate new price for the pizza (add size price + topping price)
                        var newPrice = parseFloat(req.body.price) + parseFloat(pizzaOldPrice);
                        db.run("UPDATE Pizza SET price = ? WHERE id = ?",
                            [newPrice, req.params.pizzaId],
                            function (err) {
                                if (err) { return res.status(400).send("Invalid input" + err.message); }
                                else {
                                    res.location(`/pizza/`+ req.params.pizzaId + `/topping/${this.lastID}`);
                                    res.status(201).send("Created new topping for pizza.");
                                }
                            });
                    }
                    //console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
        }
    });
});

// -------------- GET Topping BY Pizza ID | Topping -------------------
app.get('/pizza/:pizzaId/topping', function (req, res) {
    res.setHeader("Content-Type", "application/json");
    db.all("SELECT price FROM Pizza WHERE Pizza.id = ?", [req.params.pizzaId], function (err, row) {
        if (row.length == 0) { return res.status(404).send("Invalid input") }
        else {
            db.all("SELECT * FROM Topping WHERE Topping.pizzaId = ?", [req.params.pizzaId],
                function (err, rows) {
                    if (rows.length == 0) { return res.status(400).send("No toppings found.") }
                    if (err) { return res.status(404).send("Specified pizza id not found." + " - " + err.message); }
                    else {
                        res.status(200).send(rows);
                    }
                });
        }
    });
});

// -------------- GET Topping BY toppingId BY pizzaId | Topping -----------------
app.get('/pizza/:pizzaId/topping/:toppingId', function (req, res) {
    res.setHeader("Content-Type", "application/json");
    db.all("SELECT * FROM Topping WHERE Topping.pizzaId = ? AND Topping.id = ?",
        [req.params.pizzaId, req.params.toppingId],
        function (err, row) {
            if (row.length == 0) { return res.status(404).send("Pizza or Topping not be found") }
            if (err) { return res.status(400).send("Invalid IDs supplied"); }
            else {
                res.status(200).send(row);
            }
        });
});

// ========================= ORDER ===========================



