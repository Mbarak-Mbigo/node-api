const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const auth = require("./app/auth/auth");

// Server details
const PORT = process.env.PORT || 5005;
const HOST = process.env.HOST || "127.0.0.1";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth/", auth);

app.listen(PORT, HOST, console.log(`Server running on ${HOST}/${PORT}`));
