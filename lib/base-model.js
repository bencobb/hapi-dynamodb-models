var Joi = require('joi');
var Vogels = require('vogels');
var ClassExtend = require('ampersand-class-extend');
var Q = require('q');
var Hoek = require('hoek');

var BaseModel = function() {};
BaseModel.extend = ClassExtend;

BaseModel.init = function(config){
    Vogels.AWS.config.update(config);
};

BaseModel.defineModel = function(tableName, options) {
    Hoek.assert(tableName, 'tableName is required');
    Hoek.assert(options, 'options is required');
    Hoek.assert(options.schema, 'options.schema is required');
    Hoek.assert(options.hashKey, 'options.hashKey is required');

    this.modelName = tableName;
    this.model = Vogels.define(tableName, options);
    this.model.config({tableName: tableName});
};

BaseModel.validate = function (input) {
    return Q.ninvoke(Joi, 'validate', input, this.schema);
};

BaseModel.prototype.validate = function () {
    return Q.ninvoke(Joi, 'validate', this, this.constructor.schema);
};

BaseModel.createTable = function (readCapacity, writeCapacity){
    var input = {};
    input[this.modelName] = {
        readCapacity: readCapacity,
        writeCapacity: writeCapacity
    };

    return Q.ninvoke(Vogels, 'createTables', input);
};


/*
BaseModel.putItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'putItem', params);
};

BaseModel.batchGetItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'batchGetItem', params);
};

BaseModel.batchWriteItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'batchWriteItem', params);
};

BaseModel.deleteItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'deleteItem', params);
};

BaseModel.deleteTable = function (params) {
    return Q.ninvoke(BaseModel.db, 'deleteTable', params);
};

BaseModel.describeTable = function (params) {
    return Q.ninvoke(BaseModel.db, 'describeTable', params);
};

BaseModel.query = function (params) {
    return Q.ninvoke(BaseModel.db, 'query', params);
};

BaseModel.scan = function (params) {
    return Q.ninvoke(BaseModel.db, 'scan', params);
};

BaseModel.updateTable = function (params) {
    return Q.ninvoke(BaseModel.db, 'updateTable', params);
};

BaseModel.waitFor = function (state, params) {
    return Q.ninvoke(BaseModel.db, 'waitFor', state, params);
};

BaseModel.getItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'getItem', params);
};

BaseModel.updateItem = function (params) {
    return Q.ninvoke(BaseModel.db, 'updateItem', params);
};

BaseModel.listTables = function (params) {
    return Q.ninvoke(BaseModel.db, params, 'listTables');
};

BaseModel.createTable = function(tablename, key, ) {
    return Q.ninvoke(BaseModel.db, 'createTable', params);
};
*/

module.exports = BaseModel;
