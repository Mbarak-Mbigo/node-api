const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const auth = require("./app/auth/auth");
const user = require("./app/user/user");

// Server details
const PORT = process.env.PORT || 5005;
const HOST = process.env.HOST || "127.0.0.1";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth/", auth);
app.use("/user/", user);

app.use("*", (req, res) => {
  res.status(403).send({ message: "URL not found" });
});

app.listen(PORT, HOST, console.log(`Server running on ${HOST}/${PORT}`));
