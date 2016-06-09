var socket = io.connect();
var app = angular.module('app', []);

var cursor = new Vector(0, 0);

var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

document.onmousemove = function (e) {
    cursor = new Vector(e.pageX, e.pageY);
}

app.controller('mainController', ['$scope', '$interval', function ($scope, $interval) {

    $scope.players = [];
    $scope.me = guid();
    $scope.food = [];

    socket.emit('connect', {'guid':$scope.me});

    socket.on('gameState', function (data) {
        $scope.spawnFood(data.food);
        $scope.updatePlayers(data.players);
        console.log(data);
    });

    $scope.spawnFood = function (foodArray) {
        var food = [];
        for (var i = 0; i < foodArray.length - 1; i++) {
            var f = {};
            var a = foodArray[i];
            f.position = new Vector(a.position.x, a.position.y);
            f.size = a.size;
            food.push(f);
        }
        $scope.food = food;
    }

    $scope.updatePlayers = function (playerArray) {

        var tempPlayers = [];

        for (var i = playerArray.length - 1; i >= 0; i--) {
            var a = playerArray[i];
            tempPlayers.push(a);
        }
        $scope.players = tempPlayers;
    }

    $interval(function () {
        socket.emit('move', { 'player': $scope.me, 'goal':cursor });

    }, 25);
}]);