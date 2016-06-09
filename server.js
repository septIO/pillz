var express = require('express.io'),
    path = require('path'),
    //Vector = require('victor'),
    server = express(),
    _ = require('underscore');
fs = require('fs');

app = server.http().io();

var port = 1337;

var players = [];
var food = [];

var gameState = {};

eval(fs.readFileSync('public/js/utilities.js') + '');

server.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.io.route('connect', function (req) {
    players.push(new Player(req.data.guid));
});

app.io.route('move', function (req) {
    playerMove(req.data.player, req.data.goal);
});

app.io.route('updateState', function (req) {

    req.io.broadcast('gameState', gameState);

});

console.log('Listening on ' + port, new Date().toTimeString());
app.listen(port);

var spawnFood = function () {
    while (food.length < 15) {
        food.push(new Food());
    }
}

var Food = function () {
    return {
        position: new Vector(rand(20, 1000), rand(20, 800)),
        size: rand(10, 20)
    }
}

var Player = function (guid) {
    return {
        position: new Vector(rand(20, 1000), rand(20, 800)),
        velocity: 0.04,
        size: 100,
        guid: guid,
        record: 10000000
    }
}

var playerMove = function (guid, goal) {

    var p = _.find(players, function (pl) { return pl.guid == guid });

    if (typeof p === 'undefined') return;

    var goal = new Vector(goal.x, goal.y);

    var goal = goal.subtract(new Vector(p.size / 2, p.size / 2));
    var rad = 200;
    var dist = goal.subtract(p.position).length();
    var goal = dist < rad ? goal : p.position.add(goal.subtract(p.position).unit().scale(rad));

    p.position = Vector.lerp(p.position, goal, p.velocity);
}

var updateGamestate = function (callable) {
    for (i = food.length - 1; i >= 0; i--) {
        for (j = 0; j < players.length; j++) {
            var p = players[j];
            var f = new Vector(food[i].position.x, food[i].position.y);
            var dist = p.position.midpoint(p.size).subtract(f).length();
            if (dist < p.record) {
                p.record = dist;
                p.closest = f.midpoint(f.size).clone();
            }

            console.log(dist < p.size / 2 || p.size > f.size);

            if (dist < p.size / 2 || p.size * .60 > f.size) {
                console.log(dist);
                players[j].size += p.size>300 ? 0 : 10;
                food.splice(i, 1);
                players[j].velocity += 0;
            }
        }
    }

    spawnFood();

    gameState.players = players;
    gameState.food = food;

    app.io.broadcast('gameState', gameState);

    if(typeof callable === 'function')
        callable();

}

setInterval(function () {
    updateGamestate();
}, 20)