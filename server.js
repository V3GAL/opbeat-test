'use strict';
var opbeat = require('opbeat').start({
  appId: '5ecfcdffbe',
  organizationId: '5f3fe181c08c46f1b53471cfe28c3e2c',
  secretToken: 'b5566f02ec0c4584dacec68310072acf98061cd8'
})

const Hapi = require('hapi');
var team = require('./src/models/team');
var async = require('async');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        console.log('request.params', request.params);
        console.log('request.payload', request.payload);
        console.log('request.query', request.query);
        return reply('hello world');
    }
});

server.route({
    method: 'GET',
    path: '/teams',
    handler: function (request, reply) {
        console.log('request.params', request.params);
        console.log('request.payload', request.payload);
        console.log('request.query', request.query);
		
        var trace = opbeat.buildTrace();

        if (trace) trace.start('TestCache', 'cache');

        var myArray = [10, 1000, 10000, 100000 ]; 
        var rand = myArray[Math.floor(Math.random() * myArray.length)];    

		for(var i = 0; i < rand ; i++){
        (function(){
          console.log(i);           
          })();
        };
		console.log('Ramdon Number:' + rand);       

        team.getAll(function (err, result) {
            if (err) {
                return reply(err).code(404);
            } else {
                return reply(result).code(200);
            }
        });

        if (trace) trace.end();
    }
});

server.route({
    method: 'POST',
    path: '/teams/{id}',
    handler: function (request, reply) {
        console.log('request.params', request.params);
        console.log('request.payload', request.payload);
        console.log('request.query', request.query);

        async.waterfall([
            //1. Find the teams
            function (callback) {

                async.series({
                    team1: function (callback) {
                        team.find(request.params.id, callback);
                    },
                    team2: function (callback) {
                        team.find(request.payload.team.id, callback);
                    }
                }, function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
            },
            //2. Add the new scores
            function (teams, callback) {
                async.series({
                    add1: function (callback) {
                        team.addscore(teams.team1.id, request.query.score, callback);
                    },
                    add2: function (callback) {
                        team.addscore(teams.team2.id, request.payload.team.score, callback);
                    }
                }, function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });

            }], function (err, result) {
                if (err) {
                    return reply(err).code(404);
                } else {
                    return reply().code(200);
                }
            });

    }
});

//Registering Plugins
server.register([
    require('inert')
], (err) => {
    if (err) {
        console.info('An error ocurred trying to Register the plugins. ' + err);
    } else {
        /*server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                reply.file('./public/index.html');
            }
        });*/

        //serve all public files
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: 'public'
                }
            }
        });
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.info('NODE_ENV', process.env.NODE_ENV, 'Server running at:', server.info.uri);
});
