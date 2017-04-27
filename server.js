var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var port = 18080;
var users = {};

var io = require('socket.io')();


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){

    function connect(user){
        users[socket.id] = { userId: socket.id, userName: user.userName, headPic: user.headPic};
        io.emit('user online', users);
    }
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('user online', connect);

    socket.on('list', function(d, cb){
       cb(users);
    });

    socket.on('disconnect', function(){
        delete users[socket.id];
        io.emit('user offline', socket.id);
    })
});

io.listen(10666);

http.listen(port, function(){
    console.log('listening on *:' + port);
});

