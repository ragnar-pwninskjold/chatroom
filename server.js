var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

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

    socket.on('message', function(message) {
    	socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function(message) {
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].name == socket.username) {
                userList.splice(i, 1);
            }
        }
    	socket.broadcast.emit('disconnected', userList);
    });

    socket.on('private', function(data) {
        var prvId = makeId();
        var prv = io.of('/'+prvId);
    });

   socket.on('uName', function(name) {
    socket.username = name;
    id = socket.client.id;
    temp = {id: id, name: name};
    userList.push(temp);
    console.log(userList);
    //io.sockets.emit('This is where the users will go');
    io.sockets.emit('uList', userList);
   });
   
});

server.listen(process.env.PORT || 8080);