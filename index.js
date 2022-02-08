// require your server and launch it here
const server = require('./api/server');
const port = 8080;

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})