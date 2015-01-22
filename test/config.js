var cwd     = process.cwd();
var wd      = __dirname;
var dir     = wd.replace(cwd, '');

module.exports = {
    dynamodb: {
        //running on local dynamodb
        endpoint: 'http://127.0.0.1:7999',
        region: 'us-east-1'
    },
    models: {
        DummyData: dir + '/fixtures/dummy-model'
    }

};
