const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../models");

// create user
Router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("header details", req.headers);

  db.User.create({
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, 10)
  })
    .then(user => {
      res.status(200).send({ message: "User created successfully" });
    })
    .catch(error => {
      res.status(500).send({ error: "Error encountered while creating user" });
    });
});

// add contribution
Router.post("/contribution", (req, res) => {
  const { amount } = req.body;
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  jwt.verify(token, "secret", (error, decoded) => {
    console.log("token verification status", error, decoded);
    if (!error) {
      db.User.findOne({ where: { id: decoded.id } })
        .then(user => {
          user.createContribution({
            amount
          });
        })
        .then(() => {
          res.status(200).send({ status: "Add a contribution" });
        })
        .catch(() => {
          res
            .status(500)
            .send({ error: "Error encountered while adding contribution" });
        });
    }
  });
});

module.exports = Router;
