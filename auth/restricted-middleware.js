const jwt = require('jsonwebtoken')

const {jwtSecret} = require('../config/secrets')

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    // check that we remember the client,
    // that the client logged in already
    if (authorization) {
      jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err) {
      res.status(401).json({ you: "Username or Password is incorrect" });
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
} else {
  res.status(400).json({ message: "No credentials provided" });
}
  };