var Joi = require('joi');
var Lab = require('lab');
var Code = require('code');
var ObjectAssign = require('object-assign');
var Proxyquire = require('proxyquire');
var Config = require('../config');

var lab = exports.lab = Lab.script();
var stub = {
    dynamodb: {}
};
var BaseModel = Proxyquire('../../lib/base-model', {
    dynamodb: stub.dynamodb
});

lab.experiment('BaseModel Validation', function () {

    lab.test('it returns the Joi validation results of a SubClass', function (done) {

        var SubModel = BaseModel.extend({
            constructor: function (attrs) {
                ObjectAssign(this, attrs);
            }
        });

        SubModel.schema = Joi.object().keys({
            name: Joi.string().required()
        });

        Code.expect(SubModel.validate()).to.be.an.object();

        done();
    });


    lab.test('it returns the Joi validation results of a SubClass instance', function (done) {

        var SubModel = BaseModel.extend({
            constructor: function (attrs) {
                ObjectAssign(this, attrs);
            }
        });

        SubModel.schema = Joi.object().keys({
            name: Joi.string().required()
        });

        var myModel = new SubModel({name: 'Stimpy'});

        Code.expect(myModel.validate()).to.be.an.object();

        done();
    });

});


lab.experiment('BaseModel Proxied Methods', function () {

    var peopleModel,
        tablename = 'people';


    lab.before(function (done) {
        peopleModel = BaseModel.extend({
            constructor: function (attrs) {

                ObjectAssign(this, attrs);
            }
        });

        peopleModel.init(Config.dynamodb);
        var options = {
            hashKey : 'name',
            timestamps : true,
            schema : {
                name    : Joi.string().required(),
                email   : Joi.string().email().required(),
                city    : Joi.string()
            }
        };

        peopleModel.defineModel(tablename, options);

        peopleModel.createTable(1,1)
            .then(function(){done();})
            .catch(function(err){
                done('table create error: ' + JSON.stringify(err,null,2));
            });
    });


    lab.after(function (done) {
        peopleModel.model.deleteTable(function (err){
            if (err) { done(err); }
            done();
        });
    });

    lab.test('it contains the model', function (done) {
        Code.expect(peopleModel.model).to.exist();
        done();
    });

    lab.test('it inserts data and returns the results', function (done) {

        var testData = {name: 'Ren', email: 'ren@a.com'};

        peopleModel.model.create(testData, function(err, data){
            Code.expect(err).to.not.exist();
            Code.expect(data.get('email')).to.equal(testData.email);

            done();
        });
    });

    lab.test('it inserts data out of schema and should fail', function (done) {
        var testData = {name: 'Ren'}; //missing email

        peopleModel.model.create(testData, function(err, data){
            Code.expect(err).to.exist();
            Code.expect(data).to.not.exist();

            done();
        });
    });

    lab.test('it inserts data out of schema and should fail', function (done) {
        var testData = {name: 'Ren'}; //missing email

        peopleModel.model.create(testData, function(err, data){
            Code.expect(err).to.exist();
            Code.expect(data).to.not.exist();

            done();
        });
    });
});
