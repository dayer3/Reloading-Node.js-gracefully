'use strict';

const express = require('express');
const app = express();
var server = require('http').createServer(app);
const ServerShutdown = require('server-shutdown');
const serverShutdown = new ServerShutdown();
const io = require('socket.io')(server);
serverShutdown.registerServer(io, ServerShutdown.Adapters.socketio);
const spawn = require('child_process').spawn;

var messages = [{
  author: "Carlos",
  text: "Hola! que tal?"
}, {
  author: "Pepe",
  text: "Muy bien! y tu??"
}, {
  author: "Paco",
  text: "Genial!"
}];

var sockets = [];

app.use(express.static('public'));

app.get('/hello', function (req, res) {
  res.status(200).send("Hello World!");
});

app.get('/sleep', function (req, res) {
  const ls = spawn('sleep', ['10']);
  ls.on('close', (code) => {
    res.send('wake up!\n');
  });
});

io.on('connection', function (socket) {
  console.log('[' + process.pid + '] :     A client (' + socket.id + ') has connected');
  sockets.push(socket);
  socket.emit('messages', messages);

  socket.on('new-message', function (data) {
    messages.push(data);
    io.sockets.emit('messages', messages);
  });

});

process.on('SIGHUP', _ => {
  console.log('[' + process.pid + '] :     SIGHUP signal got. Exit graceluffy.');
  serverShutdown.shutdown(_ => {
    console.log('[' + process.pid + '] :     server ends graceluffy.');
    process.exit(0);
  });
}).on('SIGTERM', _ => {
  console.log('[' + process.pid + '] :     SIGTERM signal got. Exit now.');
  serverShutdown.forceShutdown(_ => {
    console.log('[' + process.pid + '] :     server ends forcefully.');
    process.exit(0);
  });
});

server.listen(8100, _ => {
  console.log('[' + process.pid + '] :     Listeting at http://localhost:8100');
});
serverShutdown.registerServer(server);
