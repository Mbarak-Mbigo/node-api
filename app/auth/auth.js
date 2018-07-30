const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../models");

const router = express.Router();

/**
 * /register
 * /login
 * /logout
 */

/**
 * REGISTER
 *    hashpassword
 *    generate token
 *    save token & hashedPwd
 *    return token
 *
 * LOGIN
 *    compare passwrd with hash
 *    ON_TRUE
 *      generate a new token
 *      save token
 *      return token
 *
 *    ON_FAILURE
 *      return login failure
 *
 * ACCESS_PRIVATE_ENDPOING
 *    check token if valid
 *    VALID:
 *      return results of request
 *    IN_VALID
 *      return error // request to login again.
 */

router.all("/", (req, res, next) => {
  // console.log("Entered authentication realm");
  // authenticate
  next();
});

router.get("/", (req, res) => {
  res.send({ route: "auth get" });
});

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
        "secret"
      );
      // add token to user
      db.User.update({ token: token }, { where: { id: user.id } })
        .then(updatedUser => {
          console.log("updatedUser", updatedUser);
          res.status(200).send({ status: "registration successful", token });
        })
        .catch(error => {
          console.log("error updating", error);
        });
    })
    .catch(error => {
      console.log("errrror ====>", error);
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
            "secret"
          );
          // save token to db;
          db.User.update({ token: token }, { where: { id: user.id } })
            .then(updatedUser => {
              console.log("updatedUser", updatedUser);
              res
                .status(200)
                .send({ status: "login successful", token: token });
            })
            .catch(error => {
              console.log("Errrorr", error);
              res.status(500).send({ error: "An error occurred" });
            });
        } else {
          res.status(403).send({ Error: "Invalid username or password" });
        }
      });
    })
    .catch(err => {
      console.log("error occured");
    });
});

router.post("/", (req, res) => {
  const { password } = req.body;
  bcrypt.hash(password, 10, function(err, hash) {
    console.log("results", err, hash);
    if (hash) {
      // save hash generate token
    } else {
      // error return;
      res
        .status(403)
        .send({ Error: "Authentication failed. Kindly provide a password" });
    }
  });

  res.send({ route: "auth post" });
});

module.exports = router;
