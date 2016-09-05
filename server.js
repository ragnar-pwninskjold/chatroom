var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

userCount = 0;

io.on('connection', function (socket) {
    console.log('Client connected');
    userCount++;

    socket.on('message', function(message) {
    	console.log('Received message:', message);
    	socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function(message) {
    	console.log('Someone disconnected!:', message);
    	socket.broadcast.emit('disconnected');
    	userCount--;
    });
});

server.listen(process.env.PORT || 8080);