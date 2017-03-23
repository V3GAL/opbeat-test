var async = require('async');

var lstTeam = [
    { id: 1, name: "Colombia", score: 5 },
    { id: 2, name: "Usa", score: 3 },
    { id: 3, name: "Mexico", score: 1 },
    { id: 4, name: "Argentina", score: 0 },
    { id: 5, name: "Brazil", score: 2 }
];

var team = {
    getAll: function (callback) {
        lstTeam.sort(function (a, b) { return b.score - a.score });
        callback(null, lstTeam);
    },
    find: function (id, callback) {
        var teamFound = lstTeam.filter(function (obj) {
            return obj['id'] == id;
        })[0];

        if (teamFound) {
            callback(null, teamFound);
        } else {
            callback("Team Not found");
        }
    },
    addscore: function (idTeam, score, callback) {
        var success = false;
        async.eachSeries(lstTeam, function (item, callback) {
            if (item.id == idTeam) {
                success = true;
                item.score = item.score + parseInt(score);
                callback();
            }else{
                callback();
            }

        }, function (err) {
            if (err || !success) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        });

    }
};

module.exports = team;
