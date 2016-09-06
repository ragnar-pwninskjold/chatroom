var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

userCount = 0;
userList = [];

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


io.on('connection', function (socket) {
    console.log(io.sockets.server.eio.clientsCount);
    
    clientId = socket.client.id;
    console.log('Client connected');
    userCount++;
    console.log("first count" + userCount);
    io.sockets.emit('userCount', userCount);

    socket.on('message', function(message) {
    	socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function(message) {
        userCount--;
    	socket.broadcast.emit('disconnected', userCount);
        io.sockets.emit('uList', userList);
    });

    socket.on('private', function(data) {
        var prvId = makeId();
        var prv = io.of('/'+prvId);
    });

   socket.on('uName', function(name) {
   
    id = socket.client.id;
    temp = {id: id, name: name};
    userList.push(temp);
    console.log(userList);
    //io.sockets.emit('This is where the users will go');
    io.sockets.emit('uList', userList);
   });
   
});

server.listen(process.env.PORT || 8080);