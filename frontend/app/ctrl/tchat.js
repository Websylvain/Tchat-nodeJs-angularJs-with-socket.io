app.controller('tchat',["$scope", "socket","settings",
    function($scope, socket, settings) {
    $scope.users = [];
    $scope.messages = [];
    
    // LISTING USERS
    socket.on('addedUser',function(u){
        console.log("Un nouvel utilisateur c'est connecté: " + u.login );
        $scope.users.push(u);
    })

    // LISTING MESSAGES
    socket.on('addedMessage',function(m){
        console.log("Un nouveau message a été posté: " + m.message );
        $scope.messages.push(m);
    })


    // DELETE WHEN USER EXIT
    socket.on('deleteUsrFromList',function(u){
        $scope.users.splice(u,1);
    })


    $scope.user = null;

    // SCOPE.USER OBSERVE settings.getUser
    $scope.$watch(function(){ return settings.getUSER();}, function(newValue, oldValue) {
        $scope.user = newValue;
    });


    // SEND MESSAGE
    $scope.send = function(msg){
        var msgInfo = {
            user : $scope.user,
            message: msg
        }
        socket.emit("sendMessage", msgInfo);
    }
}]);