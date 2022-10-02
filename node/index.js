const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT ?? 3333;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const connection = mysql.createConnection(config);

const createTableQuery = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(50), PRIMARY KEY(id))`;
connection.query(createTableQuery);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (_, response) => {
  response.render("index", {
    title: "Full Cycle Rocks!",
  });
});

app.post("/people", (request, response) => {
  const insertQuery = `INSERT INTO people(name) VALUES('${request.body.name}')`;

  connection.query(insertQuery, (err) => {
    if (err) throw err;
  });

  return response.redirect("/list-people");
});

app.get("/list-people", (_, response) => {
  const indexQuery = `SELECT * FROM people`;

  connection.query(indexQuery, (_, rows) => {
    const sanitizedRows = JSON.parse(JSON.stringify(rows))?.map(
      (person) => person.name
    );

    response.render("list", {
      title: "Everyone from the DB",
      people: sanitizedRows,
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Running at http://localhost:${PORT}`);
});
