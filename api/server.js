// implement your server here
const express = require('express');
const postsRouter = require('./posts/posts-router')
const server = express();

server.use(express.json());

// require your posts router and connect it here
server.use('/api/posts', postsRouter)
server.use('*', (req, res) => {
    res.status(404).json({message: 'not here, buddy.'})
});


module.exports = server;