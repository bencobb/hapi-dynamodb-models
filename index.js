var Path = require('path');
var Hoek = require('hoek');
var BaseModel = require('./lib/base-model');

exports.register = function (server, options, next) {
    'use strict';
    Hoek.assert(options, 'Missing options');
    Hoek.assert(options.dynamodb, 'Missing options.dynamodb');
    Hoek.assert(options.models, 'Missing options.models');

    Object.keys(options.models).forEach(function (key) {
        options.models[key] = require(Path.join(process.cwd(), options.models[key]));
        server.expose(key, options.models[key]);
    });

    BaseModel.init(options.dynamodb);

    server.expose('BaseModel', BaseModel);

    next();
};

exports.BaseModel = BaseModel;

exports.register.attributes = {
    pkg: require('./package.json')
};
