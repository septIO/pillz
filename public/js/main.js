var socket = io.connect();
var app = angular.module('app', []);

var cursor = new Vector(0, 0);
var me = guid();

document.onmousemove = function (e) {
    cursor = new Vector(e.pageX, e.pageY);
    socket.emit('move', { 'player': me, 'goal': cursor });
}

app.controller('mainController', ['$scope', '$interval', function ($scope, $interval) {

    $scope.players = [];
    $scope.food = [];
    $scope.scoreBoard = [];
    $scope.me;


    socket.emit('connect', { 'guid': me });

    socket.on('gameState', function (data) {
        $scope.spawnFood(data.food);
        $scope.updatePlayers(data.players);
        $scope.updateScoreBoard(data.players);

        $scope.me = _.find($scope.players, function (pl) { return pl.guid == me });
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
        $scope.$apply(function () { $scope.food = food; })
    }

    $scope.updatePlayers = function (playerArray) {

        var tempPlayers = [];

        for (var i = playerArray.length - 1; i >= 0; i--) {
            var a = playerArray[i];
            tempPlayers.push(a);
        }

        $scope.$apply(function () { $scope.players = tempPlayers; });
    }

    $scope.updateScoreBoard = function(players){
        $scope.scoreBoard = _.sortBy(players, 'score').reverse().slice(0, 10);
        
    }
}]);