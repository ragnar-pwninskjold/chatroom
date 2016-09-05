$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    var name = prompt("Please enter a name you wish to use");
    $('#nick').append("Your current username is: " + name);

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });

    socket.on('message', addMessage);
    socket.on('disconnected', function() {
        addMessage("Someone has disconnected");
    });
});