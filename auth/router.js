const bcrypt = require('bcryptjs')
const router = require('express').Router()

const Users = require('../users/users-model')

//Post register
router.post("/register", (req, res) => {
    const userInfo = req.body;
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);
  
    userInfo.password = hash;
  
    Users.add(userInfo)
      .then(user => {
        res.json(user);
      })
      .catch(err => res.send(err));
  });

//Post login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    Users.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.user = {
            id: user.id,
            username: user.username,
          };
  
          res.status(200).json({ welcome: user.username });
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


module.exports = router