var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function(req,res){
    console.log('Connection d\'un client !');
    res.end('hello !');
});

httpServer.listen(9999);
var io = require('socket.io').listen(httpServer);

var users = [];
var messages = [];

// EDIT CONNECTION
io.sockets.on("connection",function(socket){

    console.log("nouveau utilisateur connecté");

    //LIST THE USERS logged
    for (var k in users) {
        socket.emit("addedUser", users[k]);
    }

    var current_user = false;

    //LIST MESSAGES 
    for (var m in messages) {
        socket.emit("addedMessage", messages[m]);
    }

    var current_user = false;

    //EVENT SUBSCRIBE
    socket.on('subscribe',function(user){
        // USE INFO FROM FRONT END
        current_user = user;
        console.log(user);
        current_user.id = user.mail.replace("@",'-').replace(".","-");
        current_user.avatar = "http://gravatar.com/avatar/" +md5(user.mail) + "?s=50";
        
        //Add user to users list
        users[current_user.id] = current_user;
        
        //Log the current user
        socket.emit("newusr",current_user);
        //Say @ every one that new usr is arrived
        io.sockets.emit("addedUser",current_user);
    });

    //EVENT DISCONNECT
    socket.on('disconnect', function(){
        if(!current_user){
            return false
        }
        delete users[current_user.id];
        io.sockets.emit("deleteUsrFromList", current_user);
    })

    //EVENT MESSAGE
    socket.on("sendMessage",function(msgInfo){
        console.log(msgInfo.user.login + ": " + msgInfo.message );
        messages.push(msgInfo);
        io.sockets.emit("addedMessage", msgInfo);
    });
    
});
