var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Proxyquire = require('proxyquire');
var Config = require('./config');


var lab = exports.lab = Lab.script();
var stub = {
    BaseModel: {}
};
var ModelsPlugin = Proxyquire('..', {
    './lib/base-model': stub.BaseModel
});


lab.experiment('Plugin', function () {
    lab.test('it successfuly exposes the base model', function (done) {

        var server = new Hapi.Server();
        var Plugin = {
            register: ModelsPlugin,
            options: Config
        };

        server.register(Plugin, function (err) {

            if (err) {
                return done(err);
            }

            Code.expect(server.plugins['hapi-dynamodb-models']).to.be.an.object();
            Code.expect(server.plugins['hapi-dynamodb-models'].BaseModel).to.exist();

            done();
        });
    });



    lab.test('it exposes defined models', function (done) {

        var server = new Hapi.Server();
        var Plugin = {
            register: ModelsPlugin,
            options: {
                dynamodb: Config.dynamodb,
                models: {
                    Dummy: './test/fixtures/dummy-model'
                }
            }
        };

        server.register(Plugin, function (err) {

            if (err) {
                return done(err);
            }

            Code.expect(server.plugins['hapi-dynamodb-models']).to.be.an.object();
            Code.expect(server.plugins['hapi-dynamodb-models'].Dummy).to.exist();

            done();
        });
    });
});
