const bcrypt = require('bcryptjs')
const router = require('express').Router()
const jwt = require('jsonwebtoken')

const Users = require('../users/users-model')
const { jwtSecret } = require("../config/secrets.js");

//Post register
router.post("/register", (req, res) => {
    const userInfo = req.body;
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);
  
    userInfo.password = hash;
  
    Users.add(userInfo)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => res.status(500).json(err));
  });

//Post login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    Users.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user)
  
          res.status(200).json({ welcome: `${user.username}`, token });
        } else {
          res.status(401).json({ message: "invalid username or password" });
        }
      })
      .catch(error => {
        res.status(500).json({ errorMessage: "error finding the user" });
      });
  });

//Logout user
router.get("/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          res
            .status(500)
            .json({
              message:
                "You cannot be logged out",
            });
        } else {
          res.status(200).json({ message: "You are now logged out" });
        }
      });
    } else {
      res.status(200).json({ message: "I don't know you" });
    }
  });

  //jwt
  function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.role || "user",
    };
  
    const options = {
      expiresIn: "1h",
    };
  
    return jwt.sign(payload, jwtSecret, options);
  }


module.exports = router