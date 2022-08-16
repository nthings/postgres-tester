const express = require("express");
const { Client } = require("pg");
const path = require("path");
const app = express();
const router = express.Router();
require('dotenv').config();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", async function (req, res) {
  let message = "";
  let query = "";
  try {
    // DB Connection
    const client = new Client({
      host: process.env["DB_HOST"],
      user: process.env["DB_USER"],
      password: process.env["DB_PASSWORD"],
      port: process.env["DB_PORT"],
      database: "postgres",
      connectionTimeoutMillis: 5000,
    });
    await client.connect();
    query = JSON.stringify((await client.query(
      "select now()"
    )).rows[0]);
    message = `I'm connected to: ${process.env["DB_HOST"]}`
  } catch (e) {
    message = `Something went wrong. I can't connect. Error: ${JSON.stringify(e)}`;
  } finally {
    res.render("index", { message, query });
  }
});

//add the router
app.use("/", router);
const port = process.env.PORT || 3000
app.listen(port);

console.log(`Running at Port ${port}`);
