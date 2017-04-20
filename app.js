var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(9600); 

io.on('connection', function (socket) {

    console.log(socket.id + " is connected.");

    socket.emit('whatIsYourName');

    socket.on('mynameis', function (data) {

        console.log(data.name);

        connectedClients[socket.id] = data.name;
        connectedName[data.name] = socket.id;


        io.emit('clients',{clients:connectedClients});



    });

    socket.on('disconnect', function () {

        
        delete  connectedName[connectedClients[socket.id]];
        delete connectedClients[socket.id];

       
        
        socket.broadcast.emit('clients',{clients:connectedClients});

    });

    socket.on('message', function (data) {

        socket.broadcast.emit('onMessage',data);
        //io.to(connectedName[data.name]).emit('onMessage',data);

    });