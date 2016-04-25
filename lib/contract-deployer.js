var Promise = require('bluebird');
var Account = require('./account');
var Compiler = require('./compiler');
var Deployer = require('./deployer');
var Archiver = require('./archiver');

module.exports = function(opts) {
  return new Promise(function(resolve, reject) {
    var dataDir = opts.dataDir;
    var sender = opts.sender || 0;
    var params = opts.params;
    var file = opts.file;
    var gas = opts.gas;
    var compiled;

    Account.getAccount({dataDir: dataDir, address: sender})
      .then(function(account) {
        sender = account;
        return Compiler.compile(file);
      })
      .then(function(_compiled) {
        compiled = _compiled;
        console.log('...compiled contract');
        return Deployer.deploy({
          sender: sender,
          compiled: compiled,
          params: params,
          gas: gas
        })
      })
      .then(function(deployed) {
        console.log('...deployed address: %s', deployed.address);
        console.log('\nvar contract = eth.contract(%s).at(\'%s\');', JSON.stringify(compiled.abi), deployed.address);
        return Archiver.archive({compiled: compiled, contract: deployed, file: file});
      })
      .then(resolve)
      .catch(reject);
  });
};
