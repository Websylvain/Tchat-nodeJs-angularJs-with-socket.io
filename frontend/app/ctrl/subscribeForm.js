app.controller('SubscribeForm',["$scope", "socket","settings", function($scope, socket, settings) {
    $scope.login = false;

    //SERVER RETURN TO YOU
    socket.on('newusr',function(userInfo){
        $scope.login = true;
        settings.setUSER(userInfo);
    })

    //onclick subscribe form
    $scope.subscribe = function(form){
        socket.emit("subscribe", form);
    }

}]);