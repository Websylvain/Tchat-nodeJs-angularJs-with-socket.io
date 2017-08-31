//INIT
var http = require('http');
var md5 = require('MD5');
var mongoClient = require('mongodb').MongoClient;
httpServer = http.createServer(function(req,res){
    console.log('Connection d\'un client !');
    res.end('hello !');
});
httpServer.listen(9999);
var io = require('socket.io').listen(httpServer);
var url = 'mongodb://127.0.0.1:27017/mongochat';
//END INIT

//DB CONNECTION
mongoClient.connect(url,function(err,db){
    if(err){
        throw err;
    }

    console.log('DB is okay');
    let users = [], messages = [] , current_user = false;

    io.sockets.on('connection',function(socket){
        console.log("A new client is connected to app.js");

        db.collection('messages').find().toArray(function(err, res){
            if(err){
                throw err;
            }

            messages = res;

            //LIST MESSAGES 
            for (var m in messages) {
                socket.emit("addedMessage", messages[m]);
            }

        });
        
        
        //LIST USERS logged
        for (var k in users) {
            socket.emit("addedUser", users[k]);
        }
        
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
        });

        //EVENT MESSAGE
        // msgInfo = {"user":"ddd","message":"mon message"}
        socket.on("sendMessage",function(msgInfo){
            console.log(msgInfo);
            //Push Message in Array
            messages.push(msgInfo);
            //Insert Message in collection
            db.collection('messages').insert(msgInfo);
            //Add message to client
            io.sockets.emit("addedMessage", msgInfo);
        });



    });


});

