const express = require('express')
const authRouter = require('../auth/router')
const usersRouter = require('../users/users-router')

const server = express()

server.use(express.json())
server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)


server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;