$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    var name = prompt("Please enter a name you wish to use");
    $('#nick').append("Your current username is: " + name);
    socket.emit('uName', name);


    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });

    $('#private-chat').on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var recipient = $('#private-chat').val();
        socket.emit('private', recipient);
    });

    socket.on('message', addMessage);
    socket.on('disconnected', function(data) {
        addMessage("Someone has disconnected");
        updateUserList(data);

    });
   
    var updateUserList = function(data) {
        addMessage("The user count is: " + data.length);
        var list = document.getElementById('list-list');
        while(list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < data.length; i++) {
            $('#online-list ul').append('<li>'+data[i].name+'</li>');
        }
    };
    socket.on('uList', function(data) {
        updateUserList(data);
    });
});