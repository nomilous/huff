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
    var tag = opts.tag;
    var compiled, contract, stored;

    Account.getAccount({dataDir: dataDir, address: sender})
      .then(function(account) {
        sender = account;
        return Compiler.compile(file);
      })
      .then(function(_compiled) {
        compiled = _compiled;
        return Deployer.deploy({
          sender: sender,
          compiled: compiled,
          params: params,
          gas: gas
        })
      })
      .then(function(_deployed) {
        contract = _deployed;
        return Archiver.archive({
          compiled: compiled,
          contract: contract,
          sender: sender,
          file: file,
          tag: tag});
      })
      .then(function(_stored) {
        stored = _stored;
      })
      .then(function() {
        resolve({
          compiled: compiled,
          sender: sender,
          contract: contract,
          stored: stored,
        });
      })
      .catch(reject);
  });
};
