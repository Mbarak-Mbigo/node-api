const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../models");

const router = express.Router();

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // add user to db
  db.User.create({
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, 10)
  })
    .then(user => {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: `${user.firstName}  ${user.lastName}`
        },
        "secret",
        { expiresIn: "1h" }
      );
      res.status(200).send({ status: "registration successful", token });
    })
    .catch(error => {
      res.status(500).send({ error: "An error occurred" });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.User.findOne({
    where: { email: email }
  })
    .then(user => {
      bcrypt.compare(password, user.password, (err, verified) => {
        if (verified) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`
            },
            "secret",
            { expiresIn: "1h" }
          );
          res.status(200).send({ status: "login successful", token: token });
        } else {
          res.status(403).send({ Error: "Invalid username or password" });
        }
      });
    })
    .catch(err => {
      console.log("error occured");
    });
});

router.post("/logout", (req, res) => {});

module.exports = router;
